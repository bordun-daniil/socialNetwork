def create_group_chat_serialize_ready_data(request):
    icon = request.FILES.getlist('icon')
    serialize_ready_data = {
        'users': [request.user.id] + list(map(int, request.data.get('users', []))),
        'name': request.data.get('name')
    }
    print(request.FILES)
    
    if icon:
        serialize_ready_data['icon'] = icon[0]

    return serialize_ready_data


def get_notification_recipients(message):
    chat = message.content_type.model_class().objects.get(id=message.object_id)
    
    try:
        return [chat.user1 if chat.user1 != message.user else chat.user2]
    except AttributeError:
        recipients = list(chat.users.all())
        recipients.remove(message.user)
        return recipients
