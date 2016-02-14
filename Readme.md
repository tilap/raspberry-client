#### Client on a raspberry

Clone the repo

```
git clone https://github.com/christophehurpeau/raspberry-client.git
```

Create supervisor config file

```
[program:node-raspberry-client]
command=node --harmony .../raspberry-client --port=3002 --host=myhostname
autostart=true
autorestart=true
redirect_stderr=true
stdout_logfile=..../logs/raspberry-client.log
user=evaneos
```

Install dependencies

```
cd client
npm install --production
```

Start the client

```
sudo supervisorctl reread && sudo supervisorctl reload
```
