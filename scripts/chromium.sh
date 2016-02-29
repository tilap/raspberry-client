#!/bin/bash

function start_browser {
    if [ -z "$1" ]
      then
        echo "you need to provide an url as parameter"
        exit 1
    fi

    chromium --noerrdialogs --kiosk "$1" --incognito
}

function display_url {
    if [ -z "$1" ]
      then
        echo "you need to provide an url as parameter"
        exit 1
    fi

    export DISPLAY=:0
    xdotool key F6
    /home/pi/xdotool_type "$1"
    xdotool key KP_Enter
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
  load)
    if [ -z "$2" ]
      then
        echo "load command needs an url as a parameter"
        exit 1
    fi

    echo "Load url: $2"
    display_url "$2"
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
