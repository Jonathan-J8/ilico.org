#!/bin/bash
# Enhanced video conversion script for maximum browser compatibility

from=./videos
to=../app/public
List=(
"ilico_cheers" 
"ilico_election" 
"ilico_filter" 
"ilico_friends" 
"ilico_hush_2" 
"ilico_liberty" 
"ilico_mail" 
"ilico_neutrality" 
"ilico_over" 
"ilico_spy_2" 
"ilico_spy_3" 
"ilico_spy" 
"ilico_fai" 
)

echo "Converting videos with browser-compatible settings..."

for FILE in ${List[@]}; 
  do
    echo "Processing $FILE..."
    
    # Method 1: Ultra-compatible MP4 (baseline profile)
    echo "  Creating compatible MP4..."
    ffmpeg -y -i $from/$FILE.gif \
      -c:v libx264 \
      -profile:v baseline \
      -level 3.0 \
      -pix_fmt yuv420p \
      -movflags +faststart \
      -preset slow \
      -crf 20 \
      -maxrate 1M \
      -bufsize 2M \
      -g 30 \
      -keyint_min 30 \
      -sc_threshold 0 \
      -vf "scale=trunc(iw/2)*2:trunc(ih/2)*2,fps=30" \
      -avoid_negative_ts make_zero \
      -fflags +genpts \
      $to/${FILE}.mp4
      
    # Method 2: WebM VP8 (widely supported)
    echo "  Creating WebM VP8..."
    ffmpeg -y -i $from/$FILE.gif \
      -c:v libvpx \
      -crf 20 \
      -b:v 1M \
      -pix_fmt yuv420p \
      -g 30 \
      -vf "scale=trunc(iw/2)*2:trunc(ih/2)*2,fps=30" \
      $to/${FILE}.webm
      
    # Method 3: Keep original for comparison
    # echo "  Creating original MP4 (for comparison)..."
    # ffmpeg -y -i $from/$FILE.gif \
    #   -c:v libx264 \
    #   -c:a aac \
    #   $to/${FILE}.mp4
      
    echo "  ✓ $FILE conversion complete"
  done

echo "All conversions complete!"
