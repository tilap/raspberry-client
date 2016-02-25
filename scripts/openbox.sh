#!/bin/bash

case "$1" in
    start)
       result=`sudo supervisorctl start openbox 2>&1`
       if [[ $result == *"already started"* ]] ; then
           echo 'started'
       else
           echo 'starting'
       fi
    ;;
    restart)
        sudo supervisorctl restart openbox
    ;;
    stop)
        sudo supervisorctl stop openbox
    ;;
    *)
        echo "Usage openbox.sh {start|restart|stop}"
        exit 1
    ;;
esac

exit 0
