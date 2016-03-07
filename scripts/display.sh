#!/bin/bash

case "$1" in
  stop)
    killall kweb3 2>/dev/null
    killall chromium-browser 2>/dev/null
    killall livestreamer 2>/dev/null
    killall omxplayer 2>/dev/null
    killall omxplayer.bin 2>/dev/null
  ;;
  *)
    echo "Usage browser.sh {start <url>|refresh|load <url>}"
    exit 1
  ;;
esac
