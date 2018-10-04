require('dotenv').config();
const CloudFlare = require('./src/ddns-cloudflare');
const MyIp = require('./src/my-ip');

const noOfRetry = 20;
const timeBeforeRetry = 20000;
const updateInterval = 30000;

const colorLog = (message, color) => {
    const logColor = {    
        reset : "\x1b[0m",
        black : "\x1b[30m",
        red : "\x1b[31m",
        green : "\x1b[32m",
        yellow : "\x1b[33m",
        blue : "\x1b[34m",
        magenta : "\x1b[35m",
        cyan : "\x1b[36m",
        white : "\x1b[37m"
    }
    color = color? color in logColor? logColor[color] : logColor.black : logColor.black;
    return message? console.log(color, message , logColor.reset ) : null;
}

class Main {
    constructor() {
        colorLog('Welcome To DDNS Updater We are starting now....','green');
        this.email = process.env.CLOUD_FLARE_EMAIL;
        this.apiKey = process.env.CLOUD_FLARE_KEY;
        this.mainDomain = process.env.MAIN_DOMAIN;
        this.domain = process.env.TARGET_DOMAIN;
        this.recordType = process.env.RECORD_TYPE;
        this.ipServerArray = [process.env.IP_SERVER];

        this.initRetry = 0;
        this.init();
    }

    init() {
        this.myIp = new MyIp(this.ipServerArray);
        this.cloudFlare = new CloudFlare(this.email,this.apiKey);

        this.myIp.getIp()
        .then( () => {
            colorLog('Local Ip is retrived', 'yellow');
            this.initUpdater(); //Get Initial Ip StartUpdater
        }).catch( error => {
            console.error(error);
            this.initRetry++;
            if(this.initRetry < noOfRetry) setTimeout(this.init.bind(this), timeBeforeRetry);
        });
    }

    initUpdater() {
        this.cloudFlare.init()
        .then( zone => {
            colorLog('Initailize Cloudflare Updater Done','yellow');
            this.cloudFlare.setMainDomain(this.mainDomain);
            setInterval(this.checkAndSetNewIP.bind(this), updateInterval);
        }).catch( error => {
            console.error(error);
            this.initRetry++;
            if(this.initRetry < noOfRetry) setTimeout(this.initUpdater.bind(this), timeBeforeRetry);
        });
    }

    checkAndSetNewIP() {
        this.cloudFlare.getRecordId(this.domain,this.recordType)
        .then( record => {
            let ip = this.myIp.currentIp;
            if(record.content != ip) {
                this.cloudFlare.updateRecord(ip, this.domain, this.recordType, record.id)
                .then( () => colorLog(`Ip is updated to ${ip}`,'blue'))
                .catch( e => console.error(e));
            }
        }).catch( e => console.error(e));
    }
}

new Main();