from django.db import models
from django.conf import settings
from django.core.cache import cache
from django.core.exceptions import ObjectDoesNotExist, ValidationError
from userprofile.models import User
from core.cache_utils import get_cache_key, delete_cache_key


class FollowManager(models.Manager):
    def get_followers(self, user: User) -> list:
        key = get_cache_key("followers", user.id)
        followers = cache.get(key)

        if followers is None:
            qs = self.select_related("follower").filter(following=user)
            followers = [f.follower for f in qs]
            cache.set(key, followers)

        return followers

    def get_following(self, user: User) -> list:
        key = get_cache_key("following", user.id)
        following = cache.get(key)

        if following is None:
            qs = self.select_related("following").filter(follower=user)
            following = [f.following for f in qs]
            cache.set(key, following)

        return following

    def get_followers_quantity(self, user: User) -> int:
        key = get_cache_key("followers_quantity", user.id)
        quantity = cache.get(key)

        if quantity is None:
            quantity = self.filter(following=user).count()
            cache.set(key, quantity)

        return quantity

    def get_following_quantity(self, user: User) -> int:
        key = get_cache_key("following_quantity", user.id)
        quantity = cache.get(key)

        if quantity is None:
            quantity = self.filter(follower=user).count()
            cache.set(key, quantity)

        return quantity

    def follow(self, following: int, follower: User):
        following = User.objects.get(id=following)

        if following == follower:
            return ValidationError("Users can't follow themselves.")

        follow, is_created = self.get_or_create(following=following, follower=follower)

        if not is_created:
            raise ValidationError("User already follow this following.")

        delete_cache_key("followers", following)
        delete_cache_key("following", follower)

        return follow

    def remove_following(self, following: int, follower: int) -> None:
        follow = self.get(following=following, follower=follower)
        follow.delete()
        delete_cache_key("followers", following)
        delete_cache_key("following", follower)

    def is_following(self, following: int, follower: int):
        followers_key = get_cache_key("followers", following)
        followers = cache.get(followers_key)

        if followers is not None:
            if follower in followers:
                return True
        else:
            try:
                self.get(following=following, follower=follower)
                return True
            except ObjectDoesNotExist:
                return False


class Follow(models.Model):
    following = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    follower = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='followers')
    objects = FollowManager()

    class Meta:
        unique_together = ("following", "follower")

    def save(self, *args, **kwargs):
        if self.follower == self.following:
            return ValidationError("Users can't follow themselves.")
        super(Follow, self).save(*args, **kwargs)
