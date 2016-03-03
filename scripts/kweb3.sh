#!/bin/bash

function start_browser {
    if [ -z "$1" ]
      then
        echo "you need to provide an url as parameter"
        exit 1
    fi

    export DISPLAY=:0
    xset s off -dpms
    unclutter -display $DISPLAY &

    killall kweb3 2>/dev/null

    # A - have to press Left Alt key for shortcuts
    # K - enable kiosk mode
    # J - enable javascript
    # E - enable cookies
    # P - play web video
    # X - enable omXplayer
    # r - enable key r to refresh
    # i - enable key i to insert new URL
    kweb3 -AKJEPX+-ri "$1"
}

function display_url {
    if [ -z "$1" ]
      then
        echo "you need to provide an url as parameter"
        exit 1
    fi

    export DISPLAY=:0
    xdotool keydown Alt+Left
    xdotool key i
    xdotool keyup Alt+Left
    /home/pi/xdotool_type "$1"
    xdotool key Return
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
    xdotool keydown Alt+Left
    xdotool key r
    xdotool keyup Alt+Left
  ;;
  *)
    echo "Usage browser.sh {start <url>|refresh|load <url>}"
    exit 1
  ;;
esac
