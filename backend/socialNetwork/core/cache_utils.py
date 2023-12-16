from django.core.cache import cache

GET_CACHE_TYPES = {
    "friends": "fr-f-%s",
    "requests": "fr-r-%s",
    "sent_requests": "fr-sr-%s",
    "rejected_requests": "fr-rr-%s",

    "followers": "fo-fs-%s",
    "following": "fo-fg-%s",

    "followers_quantity": "fo-fsq-%s",
    "following_quantity": "fo-fgq-%s",
}

DELETE_CACHE_TYPES = {
    "friends": ["friends"],
    "requests": [
        "requests",
        "rejected_requests",
    ],
    "sent_requests": ["sent_requests"],

    "followers": ["followers"],
    "following": ["following"],
    "followers_quantity": ["followers_quantity"],
    "following_quantity": ["following_quantity"],
}


def get_cache_key(cache_type: str, user_id: int) -> str:
    return GET_CACHE_TYPES[cache_type] % user_id


def delete_cache_key(cache_type: str, user_id: int) -> None:
    for k in DELETE_CACHE_TYPES[cache_type]:
        cache.delete(GET_CACHE_TYPES[k] % user_id)

