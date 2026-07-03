import requests, re, json, os, subprocess

headers = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
    "Referer": "https://www.bilibili.com/"
}

bvids = [
    ("BV1aDsGzPEMo", "破坏航标罚"),
    ("BV1iL4vzVEyz", "官方介入调查"),
    ("BV1UoWQzBEnC", "林草局立案")
]

out_dir = r"C:\Users\27876\Documents\Codex\2026-06-14\h5-2025-10-b-2024-1967\gobi-guardian\最终作品\assets\bridge-videos"
os.makedirs(out_dir, exist_ok=True)

for bvid, name in bvids:
    url = f"https://www.bilibili.com/video/{bvid}"
    print(f"\n=== {name} ({bvid}) ===")
    
    r = requests.get(url, headers=headers)
    if r.status_code != 200:
        print(f"Failed: {r.status_code}")
        continue
    
    match = re.search(r"window\.__playinfo__\s*=\s*({.*?})</script>", r.text)
    if not match:
        # Try alternate pattern
        match = re.search(r'window\.__playinfo__\s*=\s*({.*?})\s*</script>', r.text)
    if not match:
        print("No playinfo found")
        continue
    
    data = json.loads(match.group(1))
    dash = data.get("data", {}).get("dash", {})
    videos = dash.get("video", [])
    audios = dash.get("audio", [])
    
    if not videos:
        print("No video streams")
        continue
    
    # Pick best video (highest quality available, usually 480p)
    best_v = videos[0]
    v_url = best_v.get("baseUrl", "")
    if not v_url and "backupUrl" in best_v:
        v_url = best_v["backupUrl"][0]
    
    v_path = os.path.join(out_dir, f"{name}_video.m4s")
    a_path = os.path.join(out_dir, f"{name}_audio.m4s")
    out_path = os.path.join(out_dir, f"{name}.mp4")
    
    print(f"Downloading video ({best_v.get('width')}x{best_v.get('height')})...")
    vr = requests.get(v_url, headers={**headers, "Range": "bytes=0-"})
    with open(v_path, "wb") as f:
        f.write(vr.content)
    print(f"Video: {len(vr.content)} bytes")
    
    if audios:
        a_url = audios[0].get("baseUrl", "")
        print(f"Downloading audio...")
        ar = requests.get(a_url, headers={**headers, "Range": "bytes=0-"})
        with open(a_path, "wb") as f:
            f.write(ar.content)
        print(f"Audio: {len(ar.content)} bytes")
        
        # Merge with ffmpeg
        print("Merging...")
        subprocess.run([
            "ffmpeg", "-y", "-i", v_path, "-i", a_path,
            "-c", "copy", out_path
        ], capture_output=True)
        os.remove(v_path)
        os.remove(a_path)
        print(f"Done: {out_path}")
    else:
        os.rename(v_path, out_path.replace(".mp4", ".m4s"))
        print(f"Done (no audio): {out_path}")

print("\nAll done!")
