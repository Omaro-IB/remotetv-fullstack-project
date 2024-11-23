"""
Usage:
  - search for a video (will print result): python3 -m plugins.YouTube.plugin SEARCH < query >
  - download video (will save under root/youtube): python3 -m plugins.YouTube.plugin DOWNLOAD < YouTube video ID >
"""

import yt_dlp
import os
import requests
# Boilerplate
import plugins.core.directory
import sys

OPTION = sys.argv[1]
INPUT = sys.argv[2]
if OPTION not in ("SEARCH", "DOWNLOAD"):
    raise ValueError("Invalid option")

# Perform search (TODO)
if OPTION == "SEARCH":
    print("Result1\nResult2\nResult3")

# Download video
elif OPTION == "DOWNLOAD":
    DOWN_PATH = os.path.join(os.path.abspath(__file__), os.pardir, os.pardir, os.pardir, "root")
    # Get name and extension
    with yt_dlp.YoutubeDL({}) as ydl:
        meta = ydl.extract_info(f'https://www.youtube.com/watch?v={INPUT}', download=False)
        name = f"{meta['title']}.{meta['ext']}"

    # Download video
    with yt_dlp.YoutubeDL({'outtmpl': os.path.abspath(os.path.join(DOWN_PATH, "youtube", "%(title)s.%(ext)s"))}) as ydl:
        ydl.download(f"https://www.youtube.com/watch?v={INPUT}")

    # Get thumbnail
    r = requests.get(f"https://i.ytimg.com/vi/{INPUT}/hqdefault.jpg")
    if r.status_code == "404":
        thumb = f"https://i.ytimg.com/vi/{INPUT}/hq720.jpg"
    else:
        thumb = f"https://i.ytimg.com/vi/{INPUT}/hqdefault.jpg"

    # Add video path to directory
    id_ = plugins.core.directory.add_single("video", meta['title'], thumb, meta['upload_date'], str(meta['height'])+'p', "English", f"YouTube video uploaded by {meta['uploader']}", os.path.join("youtube", name))
    print()
    print(id_)

