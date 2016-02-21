#!/bin/bash

case "$1" in
    start)
        /opt/vc/bin/tvservice -p
        sudo supervisorctl start openbox
    ;;
    stop)
        echo "stop"
        /opt/vc/bin/tvservice -o
        sudo supervisorctl stop browser
        sudo supervisorctl stop openbox
    ;;
    status)
        /opt/vc/bin/tvservice -s | grep off
        if [ $? != 0 ] ; then
            echo 'on'
        else
            echo 'off'
        fi
    ;;
    subscribe)
        /opt/vc/bin/tvservice -M
    ;;
    *)
        echo "Usage screen.sh {start|stop|status}"
        exit 1
    ;;
esac

exit 0
