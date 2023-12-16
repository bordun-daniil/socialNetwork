from django.core.exceptions import ValidationError


class CommentFound(Exception):
    pass


def add_comment_to_comments_branch(branch, replay_to: int, comment_data):
    if branch["id"] == replay_to:
        branch["children"].append(comment_data)
        raise CommentFound
    else:
        for child in branch["children"]:
            add_comment_to_comments_branch(child, replay_to, comment_data)


def create_comment_node(comments_tree, replay_to, comment_data):
    for comment in comments_tree:
        try:
            add_comment_to_comments_branch(comment, replay_to, comment_data)
        except CommentFound:
            break


def create_comments_tree(comments):
    comments_tree = []
    added_comments_ids = set()

    while comments:
        for comment in comments:
            comment["children"] = []

            if comment["replay_to"] in added_comments_ids or comment["replay_to"] is None:
                replay_to = comment.pop("replay_to")

                if replay_to in added_comments_ids:
                    create_comment_node(comments_tree, replay_to, comment)
                else:
                    comments_tree.append(comment)

                added_comments_ids.add(comment["id"])
                comment_index = comments.index(comment)
                comments.pop(comment_index)

    return comments_tree


def create_serialize_ready_post_data(request):
    post_images = request.FILES.getlist('post_images')
    content = request.data['content']

    if len(content) >= 5000:
        raise ValidationError("Max content length is 5000 characters.")

    serialize_ready_data = {
            'user': request.user.id,
            'content': request.data['content'],
            'post_images': []
    }
    
    if post_images is not None:
        if len(post_images) < 10:
            serialize_ready_data['post_images'] = [{'image': image} for image in post_images]

    return serialize_ready_data
