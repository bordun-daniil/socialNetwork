from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase, APIClient
from userprofile.models import User
from friends.models import Friend
from followers.models import Follow
from .models import Comment, Post


class UserPostListTests(APITestCase):
    def setUp(self):
        alice_login_data = {"username": "Alice", "password": "12345678"}
        alice = User.objects.create_user(**alice_login_data, email="alice@gmail.com")
        alice.save()

        bob_login_data = {"username": "Bob", "password": "12345678"}
        bob = User.objects.create_user(**bob_login_data, email="bob@gmail.com")
        bob.save()

        post = Post.objects.create(user=alice, content="Lorem ipsum dolor sit amet")
        post.save()

        alice_token = self.client.post(reverse("token_obtain"), alice_login_data, format="json").data['access']
        bob_token = self.client.post(reverse("token_obtain"), bob_login_data, format="json").data['access']

        self.url = reverse("user_post_list")

        self.alice = APIClient()
        self.alice.credentials(HTTP_AUTHORIZATION="Bearer " + alice_token)

        self.bob = APIClient()
        self.bob.credentials(HTTP_AUTHORIZATION="Bearer " + bob_token)

        self.eve = APIClient()
        self.eve.credentials(HTTP_AUTHORIZATION="Bearer " + "")

    def test_get(self):
        response = self.eve.get(self.url, format="json")
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

        response = self.alice.get(self.url, format="json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        response = self.bob.get(self.url, format="json")
        self.assertEqual(response.data, [])

    def test_post(self):
        data = {'content': "Lorem ipsum dolor sit amet", 'post_images': []}

        response = self.eve.post(self.url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

        response = self.bob.post(self.url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

        response = self.alice.post(self.url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)


class UserPostDetailTests(APITestCase):
    def setUp(self):
        alice_login_data = {"username": "Alice", "password": "12345678"}
        alice = User.objects.create_user(**alice_login_data, email="alice@gmail.com")
        alice.save()

        bob_login_data = {"username": "Bob", "password": "12345678"}
        bob = User.objects.create_user(**bob_login_data, email="bob@gmail.com")
        bob.save()

        post = Post.objects.create(user=alice, content="Lorem ipsum dolor sit amet")
        post.save()

        alice_token = self.client.post(reverse("token_obtain"), alice_login_data, format="json").data["access"]
        bob_token = self.client.post(reverse("token_obtain"), bob_login_data, format="json").data["access"]

        self.url = reverse("post_detail", kwargs={"pk": post.id})

        self.alice = APIClient()
        self.alice.credentials(HTTP_AUTHORIZATION="Bearer " + alice_token)

        self.bob = APIClient()
        self.bob.credentials(HTTP_AUTHORIZATION="Bearer " + bob_token)

        self.eve = APIClient()
        self.eve.credentials(HTTP_AUTHORIZATION="Bearer " + "")

    def test_get(self):
        response = self.eve.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

        response = self.bob.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        response = self.alice.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_put(self):
        data = {"user": 1, "content": "Lorem ipsum dolor sit amet", "post_images": []}

        response = self.eve.put(self.url, data, format="json")
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

        response = self.bob.put(self.url, data, format="json")
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

        response = self.alice.put(self.url, data, format="json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_delete(self):
        response = self.eve.delete(self.url, format="json")
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

        response = self.bob.delete(self.url, format="json")
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

        response = self.alice.delete(self.url, format="json")
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)


class NewsfeedTests(APITestCase):
    def setUp(self):
        alice_login_data = {"username": "Alice", "password": "12345678"}
        alice = User.objects.create_user(**alice_login_data, email="alice@gmail.com")
        alice.save()

        bob_login_data = {"username": "Bob", "password": "12345678"}
        bob = User.objects.create_user(**bob_login_data, email="bob@gmail.com")
        bob.save()

        Friend.objects.create(user=alice, friend=bob)
        Friend.objects.create(user=bob, friend=alice)
        Follow.objects.create(follower=bob, following=alice)

        post = Post.objects.create(user=alice, content="Lorem ipsum dolor sit amet")
        post.save()
        post = Post.objects.create(user=alice, content="Lorem ipsum dolor sit amet")
        post.save()
        post = Post.objects.create(user=bob, content="Lorem ipsum dolor sit amet")
        post.save()

        alice_token = self.client.post(reverse("token_obtain"), alice_login_data, format="json").data["access"]
        bob_token = self.client.post(reverse("token_obtain"), bob_login_data, format="json").data["access"]

        self.url = reverse("feed")

        self.alice = APIClient()
        self.alice.credentials(HTTP_AUTHORIZATION="Bearer " + alice_token)

        self.bob = APIClient()
        self.bob.credentials(HTTP_AUTHORIZATION="Bearer " + bob_token)

        self.eve = APIClient()
        self.eve.credentials(HTTP_AUTHORIZATION="Bearer " + "")

    def test_get(self):
        response = self.eve.get(self.url, format="json")
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

        response = self.bob.get(self.url + "?limit=10&offset=10", format="json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data, [])

        response = self.bob.get(self.url + "?limit=10&offset=1", format="json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)

        response = self.alice.get(self.url + "?limit=10&offset=0", format="json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)


class CommentAPITests(APITestCase):
    def setUp(self):
        alice_login_data = {"username": "Alice", "password": "12345678"}
        alice = User.objects.create_user(**alice_login_data, email="alice@gmail.com")
        alice.save()

        bob_login_data = {"username": "Bob", "password": "12345678"}
        bob = User.objects.create_user(**bob_login_data, email="bob@gmail.com")
        bob.save()

        post = Post.objects.create(user=alice, content="Lorem ipsum dolor sit amet")
        post.save()

        Comment.objects.create(user=alice, post=post, content="Lorem ipsum dolor sit amet")

        alice_token = self.client.post(reverse("token_obtain"), alice_login_data, format="json").data["access"]
        bob_token = self.client.post(reverse("token_obtain"), bob_login_data, format="json").data["access"]

        self.url = reverse("post_comments", kwargs={"pk": post.id})

        self.alice = APIClient()
        self.alice.credentials(HTTP_AUTHORIZATION="Bearer " + alice_token)

        self.bob = APIClient()
        self.bob.credentials(HTTP_AUTHORIZATION="Bearer " + bob_token)

        self.eve = APIClient()
        self.eve.credentials(HTTP_AUTHORIZATION="Bearer " + "")

    def test_get(self):
        response = self.eve.get(self.url, format="json")
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

        response = self.bob.get(self.url, format="json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)

    def test_post(self):
        data = {"content": "Lorem ipsum dolor sit amet", "replay_to": 1}

        response = self.eve.post(self.url, data, format="json")
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

        response = self.bob.post(self.url, data, format="json")
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

        response = self.alice.post(self.url, data, format="json")
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)


class LikeUnlikePost(APITestCase):
    def setUp(self):
        alice_login_data = {"username": "Alice", "password": "12345678"}
        alice = User.objects.create_user(**alice_login_data, email="alice@gmail.com")
        alice.save()

        bob_login_data = {"username": "Bob", "password": "12345678"}
        bob = User.objects.create_user(**bob_login_data, email="bob@gmail.com")
        bob.save()

        post = Post.objects.create(user=alice, content="Lorem ipsum dolor sit amet")
        post.save()

        alice_token = self.client.post(reverse("token_obtain"), alice_login_data, format="json").data["access"]
        bob_token = self.client.post(reverse("token_obtain"), bob_login_data, format="json").data["access"]

        self.url = reverse("like_unlike_post")

        self.alice = APIClient()
        self.alice.credentials(HTTP_AUTHORIZATION="Bearer " + alice_token)

        self.bob = APIClient()
        self.bob.credentials(HTTP_AUTHORIZATION="Bearer " + bob_token)

        self.eve = APIClient()
        self.eve.credentials(HTTP_AUTHORIZATION="Bearer " + "")

    def test(self):
        data = {"post_id": 1}

        response = self.eve.post(self.url, data, format="json")
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

        response = self.bob.post(self.url, data, format="json")
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

        response = self.bob.post(self.url, data, format="json")
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

        response = self.alice.post(self.url, data, format="json")
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)


class LikeUnlikeComment(APITestCase):
    def setUp(self):
        alice_login_data = {"username": "Alice", "password": "12345678"}
        alice = User.objects.create_user(**alice_login_data, email="alice@gmail.com")
        alice.save()

        bob_login_data = {"username": "Bob", "password": "12345678"}
        bob = User.objects.create_user(**bob_login_data, email="bob@gmail.com")
        bob.save()

        post = Post.objects.create(user=alice, content="Lorem ipsum dolor sit amet")
        post.save()

        Comment.objects.create(user=alice, post=post, content="Lorem ipsum dolor sit amet")

        alice_token = self.client.post(reverse("token_obtain"), alice_login_data, format="json").data["access"]
        bob_token = self.client.post(reverse("token_obtain"), bob_login_data, format="json").data["access"]

        self.url = reverse("like_unlike_comment")

        self.alice = APIClient()
        self.alice.credentials(HTTP_AUTHORIZATION="Bearer " + alice_token)

        self.bob = APIClient()
        self.bob.credentials(HTTP_AUTHORIZATION="Bearer " + bob_token)

        self.eve = APIClient()
        self.eve.credentials(HTTP_AUTHORIZATION="Bearer " + "")

    def test(self):
        data = {"comment_id": 1}

        response = self.eve.post(self.url, data, format="json")
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

        response = self.bob.post(self.url, data, format="json")
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

        response = self.alice.post(self.url, data, format="json")
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
