#!/usr/bin/env bash
# Builds the scroll-scrubbed hero frames from the raw clip.
# Usage: bash scripts/hero-frames.sh   (needs a full ffmpeg build with libwebp)
# Output: public/video/frames/{d,m}/NNN.webp + public/video/hero-poster-{800,1600}.webp
set -euo pipefail
cd "$(dirname "$0")/.."

SRC="asset/hero video/hero section v2.mp4"   # 2560x1440, 24 fps, 190 frames
OUT=public/video
STEP=2                                        # keep every 2nd frame: 95 frames, still smooth when scrubbed

rm -rf "$OUT/frames"
mkdir -p "$OUT/frames/d" "$OUT/frames/m"

# Desktop: 16:9 at 1600w.
ffmpeg -v error -y -i "$SRC" -an \
  -vf "select='not(mod(n\,$STEP))',scale=1600:900:flags=lanczos" -fps_mode vfr \
  -c:v libwebp -quality 58 -compression_level 6 -start_number 0 "$OUT/frames/d/%03d.webp"

# Mobile: centre 3:4 crop so a portrait phone isn't showing a thin letterboxed strip.
ffmpeg -v error -y -i "$SRC" -an \
  -vf "select='not(mod(n\,$STEP))',crop=1080:1440,scale=720:960:flags=lanczos" -fps_mode vfr \
  -c:v libwebp -quality 55 -compression_level 6 -start_number 0 "$OUT/frames/m/%03d.webp"

# Poster = first frame (the LCP image, shown before the frames load and under reduced motion).
ffmpeg -v error -y -i "$SRC" -frames:v 1 -vf scale=1600:900:flags=lanczos -c:v libwebp -quality 72 "$OUT/hero-poster-1600.webp"
ffmpeg -v error -y -i "$SRC" -frames:v 1 -vf scale=800:450:flags=lanczos -c:v libwebp -quality 72 "$OUT/hero-poster-800.webp"

echo "frames: $(ls "$OUT/frames/d" | wc -l) desktop, $(ls "$OUT/frames/m" | wc -l) mobile"
du -sh "$OUT/frames/d" "$OUT/frames/m"
