#!/bin/bash

function start_browser {
    if [ -z "$1" ]
      then
        echo "you need to provide an url as parameter"
        exit 1
    fi

    killall chromium-browser 2>/dev/null

    export DISPLAY=:0
    chromium-browser --no-first-run --noerrdialogs --kiosk "$1" --incognito
}

case "$1" in
  start)
    if [ -z "$2" ]
      then
        echo "start command needs an url as a parameter"
        exit 1
    fi

    start_browser "$2"
  ;;
  refresh)
    echo "refresh"
    export DISPLAY=:0
    xdotool keydown Ctrl
    xdotool key r
    xdotool keyup Ctrl
  ;;
  *)
    echo "Usage browser.sh {start <url>|refresh|load <url>}"
    exit 1
  ;;
esac
