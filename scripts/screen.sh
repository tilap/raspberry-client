#!/bin/bash

case "$1" in
    on)
        /opt/vc/bin/tvservice -p
        sudo supervisorctl start openbox
    ;;
    off)
        echo "stop"
        /opt/vc/bin/tvservice -o
        sudo supervisorctl stop openbox
    ;;
    state)
        tvstate=`/opt/vc/bin/tvservice -s`
        if [ $? != 0 ] ; then
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
