
require('dotenv').config();

const DDNSCloudFlare = require('./src/ddns-cloudflare');

let setting = {
    "ipServerArray": [process.env.IP_SERVER],
    "noOfRetry" : 1,
    "timeBeforeRetry" : 0,
    "updateInterval" : 0,
    "updateRecord": {
        "domain": process.env.TARGET_DOMAIN,
        "recordType": process.env.RECORD_TYPE    
    },
    "credential": {
        "email": process.env.CLOUD_FLARE_EMAIL,
        "apiKey": process.env.CLOUD_FLARE_KEY,
        "mainDomain": process.env.MAIN_DOMAIN    
    },
    "once": true
}

new DDNSCloudFlare(setting);