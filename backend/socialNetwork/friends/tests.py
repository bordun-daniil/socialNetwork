from django.urls import reverse
from django.utils import timezone
from rest_framework import status
from rest_framework.test import APITestCase, APIClient
from userprofile.models import User
from .models import Friend, FriendRequest


class FriendsGetTests(APITestCase):
    def setUp(self):
        alice_login_data = {"username": "Alice", "password": "12345678"}
        self.alice_ = User.objects.create_user(**alice_login_data, email="alice@gmail.com")
        self.alice_.save()

        bob_login_data = {"username": "Bob", "password": "12345678"}
        self.bob_ = User.objects.create_user(**bob_login_data, email="bob@gmail.com")
        self.bob_.save()

        alice_token = self.client.post(reverse("token_obtain"), alice_login_data, format="json").data["access"]
        bob_token = self.client.post(reverse("token_obtain"), bob_login_data, format="json").data["access"]

        self.alice = APIClient()
        self.alice.credentials(HTTP_AUTHORIZATION="Bearer " + alice_token)

        self.bob = APIClient()
        self.bob.credentials(HTTP_AUTHORIZATION="Bearer " + bob_token)

        self.eve = APIClient()
        self.eve.credentials(HTTP_AUTHORIZATION="Bearer " + "")

    def test_get_friends(self):
        alice = User.objects.get(id=1)
        bob = User.objects.get(id=2)

        Friend.objects.create(user=alice, friend=bob)
        Friend.objects.create(user=bob, friend=alice)

        url = reverse("friends_list")

        response = self.eve.get(url, format="json")
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

        response = self.bob.get(url, format="json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)

        response = self.alice.get(url, format="json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)

    def test_friend_requests(self):
        FriendRequest.objects.create(from_user=self.bob_, to_user=self.alice_)
        url = reverse("friend_requests")

        response = self.eve.get(url, format="json")
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

        response = self.bob.get(url, format="json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 0)

        response = self.alice.get(url, format="json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)

    def test_sent_friend_requests(self):
        FriendRequest.objects.create(from_user=self.bob_, to_user=self.alice_)
        url = reverse("sent_friend_requests")

        response = self.eve.get(url, format="json")
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

        response = self.bob.get(url, format="json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)

        response = self.alice.get(url, format="json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 0)

    def test_rejected_friend_requests(self):
        FriendRequest.objects.create(from_user=self.bob_, to_user=self.alice_, rejected=timezone.now())
        url = reverse("rejected_friend_requests")

        response = self.eve.get(url, format="json")
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

        response = self.bob.get(url, format="json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)

        response = self.alice.get(url, format="json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 0)


class FriendsPostTests(APITestCase):
    def setUp(self):
        alice_login_data = {"username": "Alice", "password": "12345678"}
        self.alice_ = User.objects.create_user(**alice_login_data, email="alice@gmail.com")
        self.alice_.save()

        bob_login_data = {"username": "Bob", "password": "12345678"}
        self.bob_ = User.objects.create_user(**bob_login_data, email="bob@gmail.com")
        self.bob_.save()

        alice_token = self.client.post(reverse("token_obtain"), alice_login_data, format="json").data["access"]
        bob_token = self.client.post(reverse("token_obtain"), bob_login_data, format="json").data["access"]

        self.alice = APIClient()
        self.alice.credentials(HTTP_AUTHORIZATION="Bearer " + alice_token)

        self.bob = APIClient()
        self.bob.credentials(HTTP_AUTHORIZATION="Bearer " + bob_token)

        self.eve = APIClient()
        self.eve.credentials(HTTP_AUTHORIZATION="Bearer " + "")

    def test_add_friend(self):
        url = reverse("add_friend")

        response = self.eve.post(url, {"to_user": 1}, format="json")
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

        response = self.bob.post(url, {"to_user": 10}, format="json")
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

        response = self.alice.post(url, {"to_user": 2}, format="json")
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_remove_friend(self):
        Friend.objects.create(user=self.alice_, friend=self.bob_)
        Friend.objects.create(user=self.bob_, friend=self.alice_)
        url = reverse("remove_friend")

        response = self.eve.post(url, {"friend": 1}, format="json")
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

        response = self.bob.post(url, {"friend": 10}, format="json")
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

        response = self.alice.post(url, {"friend": 2}, format="json")

        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(len(Friend.objects.filter(user=self.alice_)), 0)
        self.assertEqual(len(Friend.objects.filter(user=self.bob_)), 0)

    def test_accept_friend_request(self):
        FriendRequest.objects.create(from_user=self.bob_, to_user=self.alice_)
        url = reverse("accept_friend_request")

        response = self.eve.post(url, {"from_user": 1}, format="json")
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

        response = self.bob.post(url, {"from_user": 10}, format="json")
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

        response = self.alice.post(url, {"from_user": 2}, format="json")
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(len(Friend.objects.filter(user=self.alice_, friend=self.bob_)), 1)

    def test_cancel_friend_request(self):
        FriendRequest.objects.create(from_user=self.alice_, to_user=self.bob_)

        url = reverse("cancel_friend_request")

        response = self.eve.post(url, {"to_user": 1}, format="json")
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

        response = self.bob.post(url, {"to_user": 10}, format="json")
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

        response = self.alice.post(url, {"to_user": 2}, format="json")
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(len(FriendRequest.objects.filter(from_user=self.alice_, to_user=self.bob_)), 0)

    def test_reject_friend_request(self):
        FriendRequest.objects.create(from_user=self.bob_, to_user=self.alice_)

        url = reverse("reject_friend_request")

        response = self.eve.post(url, {"from_user": 1}, format="json")
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

        response = self.bob.post(url, {"from_user": 1}, format="json")
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

        response = self.alice.post(url, {"from_user": 2}, format="json")
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
