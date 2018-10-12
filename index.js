// Include All Dependency
require('dotenv').config();
const CloudFlare = require('./src/ddns-cloudflare');
const MyIp = require('./src/my-ip');
const colorLog = require('./src/colorlog');

class Main {
    constructor(setting) {
        // Print out Welcome Message to screen 
        colorLog('Welcome To DDNS Updater We are starting now....','green');
        this.setting = setting;
        this.email = process.env.CLOUD_FLARE_EMAIL;
        this.apiKey = process.env.CLOUD_FLARE_KEY;
        this.mainDomain = process.env.MAIN_DOMAIN;
        this.domain = process.env.TARGET_DOMAIN;
        this.recordType = process.env.RECORD_TYPE;
        this.ipServerArray = [process.env.IP_SERVER];

        this.initRetry = 0;
        this.init();
    }

    async init() {
        this.myIp = new MyIp(this.ipServerArray);
        this.cloudFlare = new CloudFlare(this.email,this.apiKey);

        try {
            await this.myIp.getIp(); // Try getting Ip
            colorLog('Local Ip is retrived', 'yellow');

            await this.cloudFlare.init(); // Try conntected and resolve domain from CloudFlare
            this.cloudFlare.setMainDomain(this.mainDomain);
            colorLog('Initailize Cloudflare Updater Done','yellow');

            setInterval(this.checkAndSetNewIP.bind(this), this.setting.updateInterval); 
        } catch(e) {
            console.error(e);
            this.initRetry++;
            if(this.initRetry < this.setting.noOfRetry) setTimeout(this.init.bind(this), this.setting.timeBeforeRetry);
        }
    }

    async checkAndSetNewIP() {
        try {
            const record = await this.cloudFlare.getRecordId(this.domain,this.recordType).then( record => { return record; } );
            const ip = this.myIp.currentIp;

            if(record.content != ip) {
                await this.cloudFlare.updateRecord(ip, this.domain, this.recordType, record.id);
                colorLog(`Ip is updated to ${ip}`,'blue');
            }
        } catch(e) {
            console.error(e)
        }
    }
}

const nodeEnv = process.env.NODE_ENV || 'production';
const setting = {};

if ( nodeEnv === 'production' ) {
    setting.noOfRetry = 20;
    setting.timeBeforeRetry = 20000;
    setting.updateInterval = 30000;
} else {
    setting.noOfRetry = 50;
    setting.timeBeforeRetry = 1000;
    setting.updateInterval = 1000;
}

new Main(setting);