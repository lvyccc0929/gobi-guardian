with open(r"C:\Users\27876\Documents\Codex\2026-06-14\h5-2025-10-b-2024-1967\gobi-guardian\最终作品\demo-p7.html", "r", encoding="utf-8") as f:
    c = f.read()

# Change save button to download poster.png
old = "function savePoster(){\n  if(navigator.share){navigator.share({title:'你也可以成为守护者',text:'戈壁地标——58年 vs 5分钟。修复它的，是一个路过的年轻人。',url:location.href}).catch(function(){});}\n  else{showToast('请截图保存');}\n}"

new = "function savePoster(){\n  var a=document.createElement('a');a.href='poster.png';a.download='戈壁守护者-海报.png';document.body.appendChild(a);a.click();document.body.removeChild(a);showToast('海报下载中...');\n}"

c = c.replace(old, new)

with open(r"C:\Users\27876\Documents\Codex\2026-06-14\h5-2025-10-b-2024-1967\gobi-guardian\最终作品\demo-p7.html", "w", encoding="utf-8") as f:
    f.write(c)
print("P7: save button now downloads poster.png")
