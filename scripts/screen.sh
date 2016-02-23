#!/bin/bash

case "$1" in
    on)
        /opt/vc/bin/tvservice -p
    ;;
    off)
        /opt/vc/bin/tvservice -o
    ;;
    state)
        tvstate=`/opt/vc/bin/tvservice -s 2>&1`
        if [[ $? != 0 ]] || [[ $tvstate == *"Failed to connect"* ]] ; then
            echo 'unavailable'
        elif [[ $tvstate == *"off"* ]] ; then
            echo 'off'
        else
            echo 'on'
        fi
    ;;
    subscribe)
        /opt/vc/bin/tvservice -M
    ;;
    *)
        echo "Usage screen.sh {on|off|state|subscribe}"
        exit 1
    ;;
esac

exit 0
