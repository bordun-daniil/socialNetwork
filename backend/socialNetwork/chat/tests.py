from re import M
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase, APIClient
from friends.models import Friend
from userprofile.models import User
from .models import ChatId, PrivateChat, GroupChat


class GetUserChatTests(APITestCase):
    def setUp(self):
        alice_login_data = {'username': "Alice", 'password': "12345678"}
        self.alice_ = User.objects.create_user(**alice_login_data, email="alice@gmail.com")
        self.alice_.save()

        bob_login_data = {'username': "Bob", 'password': "12345678"}
        self.bob_ = User.objects.create_user(**bob_login_data, email="bob@gmail.com")
        self.bob_.save()

        private_chat_id = ChatId.objects.create()
        PrivateChat.objects.create(id=private_chat_id, user1=self.alice_, user2=self.bob_)

        group_chat_id = ChatId.objects.create()
        group_chat = GroupChat.objects.create(id=group_chat_id)
        group_chat.users.add(self.alice_)

        alice_token = self.client.post(reverse('token_obtain'), alice_login_data, format='json').data['access']
        bob_token = self.client.post(reverse('token_obtain'), bob_login_data, format='json').data['access']

        self.alice = APIClient()
        self.alice.credentials(HTTP_AUTHORIZATION='Bearer ' + alice_token)

        self.bob = APIClient()
        self.bob.credentials(HTTP_AUTHORIZATION='Bearer ' + bob_token)

        self.eve = APIClient()
        self.eve.credentials(HTTP_AUTHORIZATION='Bearer')

        self.url = reverse('user_chats')

    def test(self):
        response = self.eve.get(self.url, format='json')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

        response = self.bob.get(self.url, format='json')
        self.assertEqual(len(response.data), 1)

        response = self.alice.get(self.url, format='json')
        self.assertEqual(len(response.data), 2)


class PrivateChatViewSetTests(APITestCase):
    def setUp(self):
        alice_login_data = {'username': "Alice", 'password': "12345678"}
        self.alice_ = User.objects.create_user(**alice_login_data, email="alice@gmail.com")
        self.alice_.save()

        bob_login_data = {'username': "Bob", 'password': "12345678"}
        self.bob_ = User.objects.create_user(**bob_login_data, email="bob@gmail.com")
        self.bob_.save()

        chat_id = ChatId.objects.create()
        PrivateChat.objects.create(id=chat_id, user1=self.alice_, user2=self.bob_)

        alice_token = self.client.post(reverse('token_obtain'), alice_login_data, format='json').data['access']
        bob_token = self.client.post(reverse('token_obtain'), bob_login_data, format='json').data['access']

        self.alice = APIClient()
        self.alice.credentials(HTTP_AUTHORIZATION='Bearer ' + alice_token)

        self.bob = APIClient()
        self.bob.credentials(HTTP_AUTHORIZATION='Bearer ' + bob_token)

        self.eve = APIClient()
        self.eve.credentials(HTTP_AUTHORIZATION='Bearer')

    def test_retrive(self):
        url = reverse('private_chat-detail', kwargs={'pk': 1})

        response = self.eve.get(url, format='json')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

        response = self.bob.get(url, format='json')
        self.assertEqual(len(response.data), 4)

        response = self.alice.get(url, format='json')
        self.assertEqual(len(response.data), 4)

    def test_create(self):
        url = reverse('private_chat-list')

        data = {'companion': 1}

        response = self.eve.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

        response = self.bob.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

        response = self.alice.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)


class GroupChatViewSetTests(APITestCase):
    def setUp(self):
        alice_login_data = {'username': "Alice", 'password': "12345678"}
        self.alice_ = User.objects.create_user(**alice_login_data, email="alice@gmail.com")
        self.alice_.save()

        bob_login_data = {'username': "Bob", 'password': "12345678"}
        self.bob_ = User.objects.create_user(**bob_login_data, email="bob@gmail.com")
        self.bob_.save()

        chat_id = ChatId.objects.create()
        group_chat = GroupChat.objects.create(id=chat_id)
        group_chat.users.add(self.alice_)

        Friend.objects.create(user=self.alice_, friend=self.bob_)
        Friend.objects.create(user=self.bob_, friend=self.alice_)

        alice_token = self.client.post(reverse('token_obtain'), alice_login_data, format='json').data['access']
        bob_token = self.client.post(reverse('token_obtain'), bob_login_data, format='json').data['access']

        self.alice = APIClient()
        self.alice.credentials(HTTP_AUTHORIZATION='Bearer ' + alice_token)

        self.bob = APIClient()
        self.bob.credentials(HTTP_AUTHORIZATION='Bearer ' + bob_token)

        self.eve = APIClient()
        self.eve.credentials(HTTP_AUTHORIZATION='Bearer')

    def test_retrive(self):
        url = reverse('group_chat-detail', kwargs={'pk': 1})

        response = self.eve.get(url, format='json')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

        response = self.bob.get(url, format='json')
        self.assertEqual(len(response.data), 6)

        response = self.alice.get(url, format='json')
        self.assertEqual(len(response.data), 6)

    def test_update(self):
        url = reverse('group_chat-detail', kwargs={'pk': 1})

        data = {'added_user': 2}

        response = self.eve.put(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

        response = self.bob.put(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

        response = self.alice.put(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)

    def test_create(self):
        url = reverse('group_chat-list')

        data = {'users': [1, 2], 'name': "Party"}

        response = self.eve.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

        response = self.bob.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

        response = self.alice.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
