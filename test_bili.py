import requests, re, json

headers = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
    "Referer": "https://www.bilibili.com/"
}

url = "https://www.bilibili.com/video/BV1aDsGzPEMo"
r = requests.get(url, headers=headers)
print("Status:", r.status_code)

match = re.search(r"window\.__playinfo__\s*=\s*({.*?})</script>", r.text)
if match:
    data = json.loads(match.group(1))
    videos = data.get("data", {}).get("dash", {}).get("video", [])
    for v in videos:
        print("Format:", v.get("id"), v.get("width"), "x", v.get("height"))
        print("URL:", v.get("baseUrl", "")[:100])
else:
    print("__playinfo__ not found, page length:", len(r.text))
