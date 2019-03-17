
require('dotenv').config();

const DDNSCloudFlare = require('./src/ddns-cloudflare');
const nodeEnv = process.env.NODE_ENV || 'production';

let setting = {};
let ipServer = process.env.IP_SERVER? [process.env.IP_SERVER] : [];

setting = {
    "ipServerArray": ipServer,
    "noOfRetry" : 1000,
    "timeBeforeRetry" : 600000, // Retry every 10 min
    "updateInterval" : 60000, // Update every 1 min
    "updateRecord": {
        "domain": process.env.TARGET_DOMAIN,
        "recordType": process.env.RECORD_TYPE    
    },
    "credential": {
        "email": process.env.CLOUD_FLARE_EMAIL,
        "apiKey": process.env.CLOUD_FLARE_KEY,
        "mainDomain": process.env.MAIN_DOMAIN    
    }
}

if ( nodeEnv != 'production' ) {
    setting.noOfRetry = 50;
    setting.timeBeforeRetry = 1000;
    setting.updateInterval = 1000;
}

new DDNSCloudFlare(setting);