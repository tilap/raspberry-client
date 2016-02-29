#!/bin/bash

case "$1" in
  start)
        killall livestreamer
        livestreamer $2 best -np omxplayer
  ;;
  *)
        echo "Usage livestreamer.sh {start <url>}"
        exit 1
  ;;
esac

exit 0
