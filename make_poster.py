from PIL import Image, ImageDraw, ImageFont, ImageFilter, ImageEnhance
import os

W, H = 750, 1334
img = Image.new("RGB", (W, H), "#0b0906")
draw = ImageDraw.Draw(img)

# Background gradient
for y in range(H):
    t = y / H
    r = int(13 + t * 12)
    g = int(9 + t * 6)
    b = int(6 + t * 4)
    draw.line([(0, y), (W, y)], fill=(r, g, b))

# Try to use Noto Serif SC font
font_paths = [
    "C:/Windows/Fonts/msyh.ttc",
    "C:/Windows/Fonts/simsun.ttc",
    "C:/Windows/Fonts/simhei.ttf",
]
font_large = None
font_medium = None
font_small = None

for fp in font_paths:
    if os.path.exists(fp):
        try:
            font_large = ImageFont.truetype(fp, 80)
            font_medium = ImageFont.truetype(fp, 36)
            font_small = ImageFont.truetype(fp, 24)
            font_tiny = ImageFont.truetype(fp, 18)
            font_stats = ImageFont.truetype(fp, 56)
            font_stat_label = ImageFont.truetype(fp, 20)
            font_big_cta = ImageFont.truetype(fp, 48)
            break
        except:
            pass

if not font_large:
    font_large = ImageFont.load_default()
    font_medium = font_large
    font_small = font_large
    font_tiny = font_large
    font_stats = font_large
    font_stat_label = font_large
    font_big_cta = font_large

# --- Hero section ---
gold = "#dcc680"
gold_dark = "#967538"
warm_white = "#e8e0d5"
dim_gold = "#C4A46C"

# 为人民服务
title = "为人民服务"
tw = draw.textlength(title, font=font_large)
draw.text(((W - tw) / 2, 100), title, fill=gold, font=font_large)

# Subtitle tags
tags = ["只争朝夕", "排除万难", "向斗争中学习", "毛主席万岁"]
tag_y = 200
x_positions = []
total_w = sum(draw.textlength(t, font=font_tiny) for t in tags) + 14 * (len(tags) - 1)
start_x = (W - total_w) / 2
for t in tags:
    draw.text((start_x, tag_y), t, fill="rgba(200,170,100,128)", font=font_tiny)
    start_x += draw.textlength(t, font=font_tiny) + 14

# Rule line
draw.line([(W/2 - 20, 250), (W/2 + 20, 250)], fill="rgba(200,170,100,89)", width=1)

# --- Quote ---
quote_y = 300
draw.text((40, quote_y), "它们存活了", fill=warm_white, font=font_medium)
draw.text((40, quote_y + 50), "差一点在", fill=warm_white, font=font_medium)

# Highlight 58 and 5
draw.text((40 + draw.textlength("它们存活了 ", font=font_medium), quote_y), "58 年", fill=gold, font=font_medium)
draw.text((40 + draw.textlength("它们存活了 58 年。\n差一点在 ", font=font_medium) if False else 40 + draw.textlength("差一点在 ", font=font_medium), quote_y + 50), "5 分钟", fill=gold, font=font_medium)
# Simpler approach - just draw inline
draw.text((40, quote_y + 100), "内消失。", fill=warm_white, font=font_medium)

# Sub-quote
draw.text((40, quote_y + 180), "修复它的，不是官方，是一个路过的年轻人。", fill=dim_gold, font=font_small)
draw.text((40, quote_y + 215), "他叫路遥，从成都开了两千公里，用了24天。", fill=dim_gold, font=font_small)

# --- Stats ---
stats_y = quote_y + 320
stats = [("24", "天"), ("27", "趟"), ("20", "吨")]
stat_spacing = W / 4
for i, (num, label) in enumerate(stats):
    sx = W/4 + i * stat_spacing
    nw = draw.textlength(num, font=font_stats)
    draw.text((sx - nw/2, stats_y), num, fill=gold, font=font_stats)
    lw = draw.textlength(label, font=font_stat_label)
    draw.text((sx - lw/2, stats_y + 70), label, fill=dim_gold, font=font_stat_label)

# --- Call to action ---
call_y = stats_y + 180
call_text = "如果你去戈壁，请不要碾压任何地面痕迹。"
draw.text(((W - draw.textlength(call_text, font=font_small))/2, call_y), call_text, fill=warm_white, font=font_small)
call_text2 = "每一道刻痕，都可能是某个时代的航标。"
draw.text(((W - draw.textlength(call_text2, font=font_small))/2, call_y + 35), call_text2, fill=dim_gold, font=font_small)

# --- Big CTA ---
cta_y = call_y + 130
cta1 = "你也可以成为"
cta2 = "守护者。"
draw.text(((W - draw.textlength(cta1, font=font_big_cta))/2, cta_y), cta1, fill=warm_white, font=font_big_cta)
draw.text(((W - draw.textlength(cta2, font=font_big_cta))/2, cta_y + 60), cta2, fill=gold, font=font_big_cta)

# --- Sub ---
sub_text = "1967 · 八航校 · 2025 · 你"
draw.text(((W - draw.textlength(sub_text, font=font_tiny))/2, cta_y + 160), sub_text, fill=dim_gold, font=font_tiny)

# --- QR section ---
qr_y = cta_y + 240
draw.text(((W - draw.textlength("微信扫码 · 查看完整作品", font=font_small))/2, qr_y), "微信扫码 · 查看完整作品", fill=dim_gold, font=font_small)

# Generate QR code on the poster
import qrcode
qr = qrcode.QRCode(box_size=4, border=2)
qr.add_data("https://lvyccc0929.github.io/gobi-guardian/")
qr.make(fit=True)
qr_img = qr.make_image(fill_color="black", back_color="#0b0906").convert("RGB")
qr_img = qr_img.resize((160, 160), Image.LANCZOS)
img.paste(qr_img, (int((W-160)/2), int(qr_y + 40)))

# Footer
foot_y = qr_y + 230
foot_text = "长按可截图 · 你就是下一个守护者"
draw.text(((W - draw.textlength(foot_text, font=font_tiny))/2, foot_y), foot_text, fill="rgba(200,170,100,77)", font=font_tiny)

# Save
out_path = r"C:\Users\27876\Documents\Codex\2026-06-14\h5-2025-10-b-2024-1967\gobi-guardian\最终作品\poster.png"
img.save(out_path, "PNG")
print(f"Poster saved: {os.path.getsize(out_path)/1024:.0f}KB")
