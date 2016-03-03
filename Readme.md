# Client on a raspberry

Clone the repo

```
git clone https://github.com/christophehurpeau/raspberry-client.git
```

Install dependencies

```
cd raspberry-client
npm install --production
```

Create supervisor config file

```
[program:node-raspberry-client]
command=node --es_staging .../raspberry-client --port=3002 --host=myhostname
autostart=true
autorestart=true
redirect_stderr=true
stdout_logfile=..../logs/raspberry-client.log
user=evaneos
```

Start the client

```
sudo supervisorctl reread && sudo supervisorctl update
```
