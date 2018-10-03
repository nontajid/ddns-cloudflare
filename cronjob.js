require('dotenv').config();
const MyIp = require('./src/my-ip');
const CloudFlare = require('./src/ddns-cloudflare');

const adminEmail = process.env.CLOUD_FLARE_EMAIL;
const cloudFlareKey = process.env.CLOUD_FLARE_KEY;
const mainDomain = process.env.MAIN_DOMAIN;
const domain = process.env.TARGET_DOMAIN;
const recordType = process.env.RECORD_TYPE;

myIp = new MyIp([process.env.IP_SERVER]);
cloudFlare = new CloudFlare(adminEmail,cloudFlareKey);

(async function() {
    const ip = await myIp.getIp();
    await cloudFlare.init();
    cloudFlare.setMainDomain(mainDomain);

    cloudFlare.getRecordId(domain,recordType)
    .then( record => {
        if(record.content != ip) {
            this.cloudFlare.updateRecord(ip, domain, recordType, record.id)
            .catch( e => { console.log(e) } );
        }
    }).catch( e => {
        console.log(e);
    });
})();
  