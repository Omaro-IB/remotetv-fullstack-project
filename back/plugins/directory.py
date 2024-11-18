import os
import uuid
from urllib.parse import urlparse
import json

SINGLE_TYPES = ["movie", "video", "song"]
SERIES_TYPES = ["tv", "album", "podcast"]
ROOT_PATH = os.path.abspath(os.path.join(os.path.abspath(__file__), os.pardir, os.pardir, "root"))
DIRECTORY_PATH = os.path.join(ROOT_PATH, "directory.json")

def add_json(json_path, data):
    if not os.path.exists(DIRECTORY_PATH):
        with open(json_path, "w+") as file:
            file.write(json.dumps([data], separators=(',', ':')))
    else:
        with open(json_path, 'rb+') as file:
            file.seek(-1, os.SEEK_END)
            file.truncate()
        with open(json_path, 'a') as file:
            file.write(","+json.dumps(data, separators=(',', ':'))+"]")

def add_single(media_type, title, image, release, quality, language, details, path):
    # Verify all are strings
    if not (isinstance(media_type, str) and isinstance(title, str) and isinstance(image, str) and isinstance(release, str) and isinstance(quality, str) and isinstance(language, str) and isinstance(details, str) and isinstance(path, str)):
        raise TypeError("title, image, release, quality, language, details, and path should all be of type string")

    # Verify type
    if media_type not in SINGLE_TYPES:
        raise ValueError(f"media_type must be one of: {", ".join([repr(t) for t in SINGLE_TYPES])} - not '{type}'")

    # Verify image is a URL
    parsed = urlparse(image)
    if not all([parsed.scheme, parsed.netloc, parsed.path]):
        raise ValueError("image should be formatted as a URL")

    # Verify path exists
    if not os.path.isfile(os.path.join(ROOT_PATH, path)):
        raise ValueError(f"file '{os.path.join(ROOT_PATH, path)}' not found")

    # Everything OK, create JSON object and add to directory.json
    new_entry = {
        "id": str(uuid.uuid4()),
        "type": media_type,
        "metadata": {
                "title": title,
                "image": image,
                "release": release,
                "quality": quality,
                "language": language,
                "details": details
        },
        "path": path
    }
    add_json(DIRECTORY_PATH, new_entry)


def add_series(media_type, title, image, release, quality, language, details, episodes):
    # Verify all are strings
    if not (isinstance(media_type, str) and isinstance(title, str) and isinstance(image, str) and isinstance(release, str) and isinstance(quality, str) and isinstance(language, str) and isinstance(details, str)):
        raise TypeError("title, image, release, quality, language, and details should all be of type string")

    # Verify type
    if media_type not in SINGLE_TYPES:
        raise ValueError(f"media_type must be one of: {", ".join([repr(t) for t in SINGLE_TYPES])} - not '{type}'")

    # Verify image is a URL
    parsed = urlparse(image)
    if not all([parsed.scheme, parsed.netloc, parsed.path]):
        raise ValueError("image should be formatted as a URL")

    # Verify episodes is a dictionary and all paths exist
    if not (isinstance(episodes, dict)):
        raise TypeError("episodes should be of type dict")

    for key in episodes:
        if not isinstance(episodes[key], dict):
            raise TypeError("all episodes key-values should be of type dict")
        for key2 in episodes[key]:
            if not isinstance(episodes[key][key2], str):
                raise TypeError("all episodes key-values' key-valyes should be of type str")
            if not os.path.isfile(os.path.join(ROOT_PATH, episodes[key][key2])):
                raise ValueError(f"file '{os.path.join(ROOT_PATH, episodes[key][key2])}' not found")

    # Everything OK, create JSON object and add to directory.json
    new_entry = {
        "id": str(uuid.uuid4()),
        "type": media_type,
        "metadata": {
                "title": title,
                "image": image,
                "release": release,
                "quality": quality,
                "language": language,
                "details": details
        },
        "episodes": episodes
    }
    add_json(DIRECTORY_PATH, new_entry)
