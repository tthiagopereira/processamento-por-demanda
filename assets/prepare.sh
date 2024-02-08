#!/bin/bash

ffmpeg \
  -i ./music.mp4 \
  -c:v libx264 \
  -c:a aac \
  -movflags +faststart \
  -b:v 1500k \
  -maxrate 1500k \
  -bufsize 1000k \
  output.mp4
