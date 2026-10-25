"""Tạo file mp3 giọng Nam Minh cho mọi câu trong data.js. Chạy: python cong-cu/tao_giong.py"""
import asyncio
import hashlib
import json
import os
import subprocess

import edge_tts

VOICE = "vi-VN-NamMinhNeural"
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
AUDIO_DIR = os.path.join(ROOT, "giong")
CLIPS_JS = os.path.join(ROOT, "voice-clips.js")


def clip_name(text):
    return hashlib.sha1(text.encode("utf-8")).hexdigest()[:12] + ".mp3"


async def make(text, sem, stats):
    path = os.path.join(AUDIO_DIR, clip_name(text))
    if os.path.exists(path) and os.path.getsize(path) > 0:
        stats["skip"] += 1
        return
    async with sem:
        for attempt in range(3):
            try:
                await edge_tts.Communicate(text, VOICE).save(path)
                stats["new"] += 1
                return
            except Exception as e:
                if attempt == 2:
                    stats["fail"].append((text, str(e)))
                await asyncio.sleep(2)


async def main():
    out = subprocess.run(["node", os.path.join(ROOT, "cong-cu", "liet-ke-cau.js")],
                         capture_output=True, check=True)
    texts = json.loads(out.stdout.decode("utf-8"))
    os.makedirs(AUDIO_DIR, exist_ok=True)

    stats = {"new": 0, "skip": 0, "fail": []}
    sem = asyncio.Semaphore(5)
    await asyncio.gather(*(make(t, sem, stats) for t in texts))

    clips = {t: "giong/" + clip_name(t) for t in texts
             if os.path.exists(os.path.join(AUDIO_DIR, clip_name(t)))}
    with open(CLIPS_JS, "w", encoding="utf-8") as f:
        f.write("// Tự sinh bởi cong-cu/tao_giong.py, không sửa tay.\n")
        f.write("const VOICE_CLIPS = " + json.dumps(clips, ensure_ascii=False, indent=0) + ";\n")

    used = set(os.path.basename(p) for p in clips.values())
    for name in os.listdir(AUDIO_DIR):
        if name not in used:
            os.remove(os.path.join(AUDIO_DIR, name))

    print(f"Tổng {len(texts)} câu | mới {stats['new']} | có sẵn {stats['skip']} | lỗi {len(stats['fail'])}")
    for text, err in stats["fail"]:
        print("  LỖI:", text, "->", err)


asyncio.run(main())
