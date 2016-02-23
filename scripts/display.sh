#!/bin/bash

case "$1" in
    start)
        xinit /usr/bin/openbox-session
    ;;
    *)
        echo "Usage screen.sh {on|off|state|subscribe}"
        exit 1
    ;;
esac

exit 0
