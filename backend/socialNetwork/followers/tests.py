from django.test.testcases import TestCase
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase, APIClient
from userprofile.models import User
from .models import Follow


class FollowGetTests(APITestCase):
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

    def test_get_user_followers(self):
        Follow.objects.create(following=self.alice_, follower=self.bob_)
        url = reverse("followers")

        response = self.eve.get(url, format="json")
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

        response = self.bob.get(url, format="json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data, [])

        response = self.alice.get(url, format="json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)

    def test_get_user_following(self):
        Follow.objects.create(following=self.alice_, follower=self.bob_)
        url = reverse("following")

        response = self.eve.get(url, format="json")
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

        response = self.bob.get(url, format="json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)

        response = self.alice.get(url, format="json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 0)


class FollowPostTests(TestCase):
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

    def test_follow(self):
        url = reverse("follow")

        response = self.eve.post(url, format="json")
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

        response = self.bob.post(url, {"following": 3}, format="json")
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

        response = self.alice.post(url, {"following": 2}, format="json")
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(len(Follow.objects.filter(follower=self.alice_, following=self.bob_)), 1)

    def test_unfollow(self):
        Follow.objects.create(following=self.bob_, follower=self.alice_)
        url = reverse("unfollow")

        response = self.eve.post(url, format="json")
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

        response = self.bob.post(url, {"following": 3}, format="json")
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

        response = self.alice.post(url, {"following": 2}, format="json")
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(len(Follow.objects.filter(follower=self.alice_, following=self.bob_)), 0)
