#!/usr/bin/env bash
# Builds the scroll-scrubbed hero frames from the raw clip.
# Usage: bash scripts/hero-frames.sh   (needs a full ffmpeg build with libwebp + libaom-av1)
# Output: public/video/frames/$VER/{d,m}/NNN.{avif,webp} + public/video/hero-poster-{800,1600}.webp
#
# Each frame ships twice: AVIF (primary, ~35-40% smaller at equal-or-better SSIM) and WebP (fallback for browsers
# without AVIF; HeroVideo.astro feature-detects once). Measurements: DESIGN.md → Hero scrub.
#
# VER is part of the URL (public/video/frames/$VER/...) and /video/* is served immutable (vercel.json), so BUMP VER
# whenever the frames change, and the same constant in src/components/HeroVideo.astro.
set -euo pipefail
cd "$(dirname "$0")/.."

VER=v2
SRC="asset/hero video/hero section v2.mp4"   # 2560x1440, 24 fps, 190 frames
OUT=public/video
STEP=2                                        # keep every 2nd frame: 95 frames, still smooth when scrubbed
JOBS=$(nproc 2>/dev/null || echo 4)

# Quality knobs (chosen by SSIM + eyeballing, see DESIGN.md).
D_AVIF_CRF=32;  D_WEBP_Q=58                  # desktop 16:9, 1600x900 (AVIF and WebP both 1600x900)
M_AVIF_CRF=32;  M_WEBP_Q=55                  # mobile 3:4 crop: AVIF 900x1200, WebP fallback 720x960
CPU_USED=4                                    # libaom speed; lower = slower, ~1% smaller

TMP=$(mktemp -d)
trap 'rm -rf "$TMP"' EXIT

rm -rf "$OUT/frames"
mkdir -p "$OUT/frames/$VER/d" "$OUT/frames/$VER/m"

# Lossless intermediates (PNG) so every encode starts from the same pixels.
mkdir -p "$TMP/d" "$TMP/m900" "$TMP/m720"
ffmpeg -v error -y -i "$SRC" -an \
  -vf "select='not(mod(n\,$STEP))',scale=1600:900:flags=lanczos" -fps_mode vfr -start_number 0 "$TMP/d/%03d.png"
# Mobile: centre 3:4 crop so a portrait phone isn't showing a thin letterboxed strip.
ffmpeg -v error -y -i "$SRC" -an \
  -vf "select='not(mod(n\,$STEP))',crop=1080:1440,scale=900:1200:flags=lanczos" -fps_mode vfr -start_number 0 "$TMP/m900/%03d.png"
ffmpeg -v error -y -i "$SRC" -an \
  -vf "select='not(mod(n\,$STEP))',crop=1080:1440,scale=720:960:flags=lanczos" -fps_mode vfr -start_number 0 "$TMP/m720/%03d.png"

# AVIF: 8-bit 4:2:0, BT.709 tagged (sRGB transfer) so browsers convert colours the same way as for the WebP.
avif() { # in.png out.avif crf
  ffmpeg -v error -y -i "$1" \
    -vf "scale=out_color_matrix=bt709:out_range=tv:flags=lanczos+accurate_rnd+full_chroma_int,format=yuv420p" \
    -colorspace bt709 -color_primaries bt709 -color_trc iec61966-2-1 -color_range tv \
    -c:v libaom-av1 -crf "$3" -b:v 0 -cpu-used "$CPU_USED" -still-picture 1 -f avif "$2"
}
webp() { # in.png out.webp quality
  ffmpeg -v error -y -i "$1" -c:v libwebp -quality "$3" -compression_level 6 "$2"
}
export -f avif webp
export CPU_USED

encode() { # fn srcdir ext arg dstdir
  local fn=$1 src=$2 ext=$3 arg=$4 dst=$5
  printf '%s\n' "$src"/*.png | xargs -P "$JOBS" -I{} \
    bash -c '"$0" "$1" "$2/$(basename "$1" .png).$3" "$4"' "$fn" {} "$dst" "$ext" "$arg"
}

encode avif "$TMP/d"    avif "$D_AVIF_CRF" "$OUT/frames/$VER/d"
encode webp "$TMP/d"    webp "$D_WEBP_Q"   "$OUT/frames/$VER/d"
encode avif "$TMP/m900" avif "$M_AVIF_CRF" "$OUT/frames/$VER/m"
encode webp "$TMP/m720" webp "$M_WEBP_Q"   "$OUT/frames/$VER/m"

# Poster = first frame (the LCP image, shown before the frames load and under reduced motion). Stays WebP: it is
# preloaded and used in <img srcset>, which must work everywhere.
ffmpeg -v error -y -i "$SRC" -frames:v 1 -vf scale=1600:900:flags=lanczos -c:v libwebp -quality 72 "$OUT/hero-poster-1600.webp"
ffmpeg -v error -y -i "$SRC" -frames:v 1 -vf scale=800:450:flags=lanczos -c:v libwebp -quality 72 "$OUT/hero-poster-800.webp"

for d in d m; do
  echo "$d: $(ls "$OUT/frames/$VER/$d"/*.avif | wc -l) avif ($(cat "$OUT/frames/$VER/$d"/*.avif | wc -c) B), $(ls "$OUT/frames/$VER/$d"/*.webp | wc -l) webp ($(cat "$OUT/frames/$VER/$d"/*.webp | wc -c) B)"
done
