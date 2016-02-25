#!/bin/bash

case "$1" in
    start)
        sudo supervisorctl start openbox
    ;;
    restart)
       result=`sudo supervisorctl restart openbox 2>&1`
       if [[ $result == *"already started"* ]] ; then
           echo 'started'
       else
           echo 'starting'
       fi
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
