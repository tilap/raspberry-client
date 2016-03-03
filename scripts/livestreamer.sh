#!/bin/bash

case "$1" in
  start)
        killall livestreamer 2>/dev/null
        killall omxplayer.bin 2>/dev/null
        livestreamer $2 best -np omxplayer
  ;;
  *)
        echo "Usage livestreamer.sh {start <url>}"
        exit 1
  ;;
esac

exit 0
