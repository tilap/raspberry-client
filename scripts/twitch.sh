#!/bin/bash

case "$1" in
  start)
        livestreamer twitch.tv/$2 best -np omxplayer
  ;;
  stop)
        echo "stop"
        killall livestreamer
  ;;
  *)
        echo "Usage twitch.sh {start <twitch_url>|stop}"
        exit 1
  ;;
esac

exit 0
