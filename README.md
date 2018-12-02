# ddns-cloudflare
Script to update DNS record on cloudflare

### Prerequisites
- [nodejs](https://nodejs.org/en/)
- Forever install globally ```npm install forever -g```

### Get start
- rename .env.example file to .env and put your cloudFlare credential and targeted domain
- for IP_SERVER put in url that will return your current ip in json in theses form __Try__ [api.ipify.org](https://api.ipify.org/?format=json)
```
{"ip":"1.1.1.1"}
```
- run following command 
```
npm install
forever start index.js
```

Enjoy
