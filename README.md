# ddns-cloudflare
Script to update DNS record on cloudflare

### Prerequisites
- [nodejs](https://nodejs.org/en/)
- Forever install globally ```npm install forever -g```

### Get start
- rename .env.example file to .env and put your cloudFlare credential and targeted domain
- run following command 
```
npm install
forever start index.js
```

Enjoy
