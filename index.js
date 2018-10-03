require('dotenv').config();
const CloudFlare = require('./src/ddns-cloudflare');
const MyIp = require('./src/my-ip');

const noOfRetry = 5;
const timeBeforeRetry = 10000;
const updateInterval = 15000;
class Main {
    constructor() {
        console.log('Welcome To DDNS Updater We are starting now....');
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
            console.log('Connected To Ip Server');
            this.initUpdater(); //Get Initial Ip StartUpdater
        }).catch( error => {
            console.log(error);
            this.initRetry++;
            if(this.initRetry < noOfRetry) setTimeout(this.init.bind(this), timeBeforeRetry);
        });
    }

    initUpdater() {
        this.cloudFlare.init()
        .then( zone => {
            console.log('Initailize Updater Done');
            this.cloudFlare.setMainDomain(this.mainDomain);
            setInterval(this.checkAndSetNewIP.bind(this), updateInterval);
        }).catch( error => {
            console.log(error);
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
                .then( () => console.log(`updater Ip to ${ip}`))
                .catch( e => console.log(e));
            }
        }).catch( e => console.log(e));
    }
}

new Main();