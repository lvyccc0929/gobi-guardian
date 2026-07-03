import requests, re, json, os

headers = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
    "Referer": "https://www.bilibili.com/"
}

bvids = [
    ("BV1aDsGzPEMo", "v1_destroy"),
    ("BV1iL4vzVEyz", "v2_investigate"),
    ("BV1UoWQzBEnC", "v3_case"),
]

out_dir = r"C:\Users\27876\Documents\Codex\2026-06-14\h5-2025-10-b-2024-1967\gobi-guardian\最终作品\assets\bridge-videos"
os.makedirs(out_dir, exist_ok=True)

for bvid, name in bvids:
    url = f"https://www.bilibili.com/video/{bvid}"
    print(f"\n=== {name} ===")
    
    r = requests.get(url, headers=headers, timeout=30)
    if r.status_code != 200:
        print(f"Failed: {r.status_code}")
        continue
    
    match = re.search(r"window\.__playinfo__\s*=\s*({.*?})\s*</script>", r.text)
    if not match:
        # try non-greedy with more tolerance
        match = re.search(r'__playinfo__\s*=\s*(\{.*?"data":\{.*?\})\s*</script>', r.text, re.DOTALL)
    if not match:
        print("No playinfo")
        continue
    
    data = json.loads(match.group(1))
    dash = data.get("data", {}).get("dash", {})
    videos = dash.get("video", [])
    audios = dash.get("audio", [])
    
    if not videos:
        print("No videos")
        continue
    
    v = videos[0]
    v_url = v.get("baseUrl") or (v.get("backupUrl", [None])[0])
    if not v_url:
        print("No video URL")
        continue
    
    v_path = os.path.join(out_dir, f"{name}.mp4")
    
    print(f"Downloading {v.get('width')}x{v.get('height')}...")
    # Stream download without range header
    with requests.get(v_url, headers=headers, stream=True, timeout=60) as vr:
        total = 0
        with open(v_path, "wb") as f:
            for chunk in vr.iter_content(chunk_size=8192):
                f.write(chunk)
                total += len(chunk)
        print(f"Downloaded: {total} bytes -> {v_path}")

print("\nDone!")
