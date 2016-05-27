# Client on a raspberry

## Install

```
npm install -g raspberry-client
```

## Create supervisor config file

```
[program:node-raspberry-client]
environment=NODE_ENV="production"
command=raspberry-client --port=3002 --host=myhostname
autostart=true
autorestart=true
redirect_stderr=true
stdout_logfile=..../logs/raspberry-client.log
user=evaneos
```

## Start the client

```
sudo supervisorctl reread && sudo supervisorctl update
```
