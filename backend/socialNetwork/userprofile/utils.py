def _get_upload_path(instance, filename: str) -> str:
    instance_path = None

    if instance.__class__.__name__ == 'User':
        instance_path = instance.username
    elif instance.__class__.__name__ == 'UserImage':
        instance_path = instance.user.username

    return f'{instance.__class__.__name__}/{instance_path}/{filename}'

def create_profile_serialize_ready_data(request):
    avatar_image = request.FILES.getlist('avatar_image')
    header_image = request.FILES.getlist('header_image')
    serialize_ready_data = {
        'first_name': request.data['first_name'],
        'last_name': request.data['last_name'],
        'bio': request.data['bio']
    }
    if avatar_image:
        serialize_ready_data['avatar_image'] = avatar_image[0]
    if header_image:
        serialize_ready_data['header_image'] = header_image[0]

    return serialize_ready_data
