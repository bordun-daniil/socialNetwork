from django.conf import settings
from django.core.cache import cache
from django.core.exceptions import ValidationError, ObjectDoesNotExist
from django.db import models, IntegrityError
from django.db.models import Q
from django.utils import timezone
from core.cache_utils import get_cache_key, delete_cache_key
from userprofile.models import User


class FriendRequestManager(models.Manager):
    def get_requests(self, user: User) -> list[User]:
        key = get_cache_key("requests", user.id)
        users = cache.get(key)

        if users is None:
            qs = self.select_related("from_user", "to_user").filter(to_user=user, rejected__isnull=True)
            users = [u.from_user for u in qs]
            cache.set(key, users)

        return users

    def sent_requests(self, user: User) -> list[User]:
        key = get_cache_key("sent_requests", user.id)
        users = cache.get(key)

        if users is None:
            qs = self.select_related("to_user").filter(from_user=user, rejected__isnull=True)
            users = [u.to_user for u in qs]
            cache.set(key, users)

        return users

    def rejected_requests(self, user: User) -> list[User]:
        key = get_cache_key("rejected_requests", user.id)
        users = cache.get(key)

        if users is None:
            qs = self.select_related("from_user", "to_user").filter(from_user=user, rejected__isnull=False)
            users = [u.to_user for u in qs]
            cache.set(key, users)

        return users

    def add_friend(self, from_user: User, to_user: int):
        to_user = User.objects.get(id=to_user)

        if from_user == to_user:
            raise ValidationError("User can't be friend with themselves.")
        if Friend.objects.are_friends(user1=from_user.id, user2=to_user.id):
            raise IntegrityError("Users are already friends")

        if self.is_friend_request_sent(from_user, to_user):
            raise IntegrityError("Request already sent")

        request = self.create(from_user=from_user, to_user=to_user)

        delete_cache_key("requests", to_user.id)
        delete_cache_key("sent_requests", from_user.id)

        return request

    def is_friend_request_sent(self, from_user: int, to_user: int):
        try:
            self.get(from_user=from_user, to_user=to_user)
            return True
        except ObjectDoesNotExist:
            return False


class FriendRequest(models.Model):
    from_user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE,
                                  related_name='friend_request_send')
    to_user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE,
                                related_name="friend_request_received")
    created = models.DateTimeField(default=timezone.now)
    rejected = models.DateTimeField(blank=True, null=True)
    objects = FriendRequestManager()

    class Meta:
        unique_together = ("from_user", "to_user")

    def accept(self) -> None:
        Friend.objects.create(user=self.from_user, friend=self.to_user)
        Friend.objects.create(user=self.to_user, friend=self.from_user)
        self.delete()

        delete_cache_key("requests", self.to_user.id)
        delete_cache_key("sent_requests", self.to_user.id)
        delete_cache_key("friends", self.to_user.id)

        delete_cache_key("requests", self.from_user.id)
        delete_cache_key("sent_requests", self.from_user.id)
        delete_cache_key("friends", self.from_user.id)

    def cancel(self) -> None:
        self.delete()

        delete_cache_key("sent_requests", self.from_user.id)
        delete_cache_key("requests", self.to_user.id)

    def reject(self) -> None:
        self.rejected = timezone.now()
        self.save()

        delete_cache_key("requests", self.to_user.id)
        delete_cache_key("sent_requests", self.from_user.id)


class FriendManager(models.Manager):
    def get_friends(self, user: User) -> list[User]:
        key = get_cache_key("friends", user.id)
        friends = cache.get(key)

        if friends is None:
            qs = self.select_related("friend").filter(user=user)
            friends = [u.friend for u in qs]
            cache.set(key, friends)

        return friends

    def remove_friend(self, user: int, friend: int) -> None:
        if self.are_friends(user1=user, user2=friend):
            qs = self.filter(Q(user=user, friend=friend) | Q(user=friend, friend=user))
            qs.delete()
            delete_cache_key("friends", user)
            delete_cache_key("friends", friend)
        else:
            raise ObjectDoesNotExist

    def are_friends(self, user1: int, user2: int) -> bool:
        key1 = get_cache_key("friends", user1)
        friends1 = cache.get(key1)

        key2 = get_cache_key("friends", user2)
        friends2 = cache.get(key2)

        if friends1 and user2 in friends1:
            return True
        elif friends2 and user1 in friends2:
            return True
        else:
            try:
                self.get(user=user1, friend=user2)
                return True
            except ObjectDoesNotExist:
                return False


class Friend(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    friend = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='friends')
    objects = FriendManager()

    class Meta:
        unique_together = ("user", "friend")

    def save(self, *args, **kwargs):
        if self.user == self.friend:
            ValidationError("User can't be friend with themselves.")

        super(Friend, self).save(*args, **kwargs)


class FriendNotification(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    is_seen = models.BooleanField(default=False)
