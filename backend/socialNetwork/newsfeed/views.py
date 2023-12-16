from django.db.models import Q
from django.http import Http404
from rest_framework import permissions, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.pagination import LimitOffsetPagination
from rest_framework.decorators import api_view, permission_classes
from core.utils import catch_unexpected_error
from friends.models import Friend
from followers.models import Follow
from .utils import create_comments_tree, create_serialize_ready_post_data
from .models import Post, Comment, Like
from .serializers import CommentPostSerializer, PostCreateSerializer, PostPutSerializer, PostGetSerializer, \
    CommentGetSerializer
from .permissions import IsOwnerOrReadOnly


class UserPostList(APIView):
    permission_classes = (permissions.IsAuthenticated,)

    def get(self, request):
        posts = Post.objects.filter(user=request.query_params.get('user_id', request.user))
        serialized_posts = PostGetSerializer(posts, context={'request': request}, many=True)
        return Response(serialized_posts.data, status=status.HTTP_200_OK)

    def post(self, request):
        serialize_ready_data = create_serialize_ready_post_data(request)
        serialized_post = PostCreateSerializer(data=serialize_ready_data)
        if serialized_post.is_valid():
            serialized_post.save()
            return Response(serialized_post.data, status=status.HTTP_201_CREATED)
        return Response({'error_message': serialized_post.error_messages}, status=status.HTTP_400_BAD_REQUEST)


class PostDetail(APIView):
    permission_classes = (permissions.IsAuthenticated, IsOwnerOrReadOnly)

    @staticmethod
    def get_object(pk):
        try:
            obj = Post.objects.get(pk=pk)
            return obj
        except Post.DoesNotExist:
            raise Http404

    def get_object_with_owner_permissions(self, pk):
        try:
            obj = self.get_object(pk)
            self.check_object_permissions(self.request, obj)
            return obj
        except Post.DoesNotExist:
            raise Http404

    def get(self, request, pk):
        post = self.get_object(pk)
        serialized_post = PostGetSerializer(post, context={'request': request})
        return Response(serialized_post.data)

    def put(self, request, pk):
        post = self.get_object_with_owner_permissions(pk)
        serializer = PostPutSerializer(post, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        post = self.get_object_with_owner_permissions(pk)
        post.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class CommentAPI(APIView):
    permission_classes = (permissions.IsAuthenticated,)

    def get(self, request, pk):
        """ Returns all comments from post """
        comments = Comment.objects.filter(post=pk)
        serialized_comments = CommentGetSerializer(comments, context={'request': request}, many=True)
        comments_tree = create_comments_tree(serialized_comments.data)
        return Response(comments_tree, status=status.HTTP_200_OK)

    def post(self, request, pk):
        request.data.pop("user", None)
        if len(request.data['content']) <= 1000:
            serialized_comment = CommentPostSerializer(data={**request.data, 'post': pk, 'user': request.user.id})
            if serialized_comment.is_valid():
                serialized_comment.save()
                return Response(serialized_comment.data, status=status.HTTP_201_CREATED)
            return Response({'error_message': serialized_comment.error_messages}, status=status.HTTP_400_BAD_REQUEST)
        return Response({'error_message': "Max content length is 1000 characters."})


class NewsfeedAPI(APIView, LimitOffsetPagination):
    permission_classes = (permissions.IsAuthenticated,)

    def get(self, request):
        friends = [f.friend for f in Friend.objects.select_related('friend').filter(user=request.user)]
        following = [f.following for f in Follow.objects.select_related('following').filter(follower=request.user)]
        qs = Post.objects.filter(Q(user__in=following) | Q(user__in=friends))
        pqs = self.paginate_queryset(qs, request, view=self)
        serialized_pqs = PostGetSerializer(pqs, context={'request': request}, many=True)
        return Response(serialized_pqs.data, status=status.HTTP_200_OK)


@permission_classes((permissions.IsAuthenticated,))
@api_view(["POST"])
@catch_unexpected_error
def like_unlike_post(request):
    post = Post.objects.get(id=request.data['post_id'])
    Like.objects.like_dislike(post, user=request.user)
    return Response(status=status.HTTP_201_CREATED)


@permission_classes((permissions.IsAuthenticated,))
@api_view(["POST"])
@catch_unexpected_error
def like_unlike_comment(request):
    comment = Comment.objects.get(id=request.data['comment_id'])
    Like.objects.like_dislike(comment, user=request.user)
    return Response(status=status.HTTP_201_CREATED)
