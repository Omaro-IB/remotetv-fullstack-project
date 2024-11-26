"""
Usage:
  - search for a video (will print result): python3 -m plugins.YouTube.plugin SEARCH < query >
  - download video (will save under root/youtube): python3 -m plugins.YouTube.plugin DOWNLOAD < YouTube video ID >
"""

import yt_dlp
import os
import requests
import json
# Boilerplate
import plugins.core.directory
import sys

OPTION = sys.argv[1]
INPUT = sys.argv[2]
if OPTION not in ("SEARCH", "DOWNLOAD"):
    raise ValueError("Invalid option")

# Perform search
if OPTION == "SEARCH":
    with yt_dlp.YoutubeDL({'quiet': True, 'noplaylist': True,  'extract_flat': True}) as ydl:
            result = ydl.extract_info(f"ytsearch10:{INPUT}", download=False)

            # Extract video links
            urls = [entry['url'] for entry in result['entries']]
            titles = [entry['title'] for entry in result['entries']]

            sources = []
            labels = []
            for i in range(len(urls)):
                if "?v=" not in urls[i]:
                    continue
                else:
                    sources.append(urls[i].split("?v=")[1])
                    labels.append(titles[i])

            print(json.dumps(labels))
            print(json.dumps(sources))

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

