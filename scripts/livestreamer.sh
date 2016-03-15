#!/bin/bash

case "$1" in
  start)
        ./display.sh stop
        livestreamer $2 best -np omxplayer
  ;;
  *)
        echo "Usage livestreamer.sh {start <url>}"
        exit 1
  ;;
esac

exit 0
