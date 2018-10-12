// Include All Dependency
const CloudFlareApi = require('./cloudflare-api');
const MyIp = require('./my-ip');
const colorLog = require('./colorlog');

class DDNSCloudFlare {
    constructor(setting) {
        // Print out Welcome Message to screen 
        colorLog('Welcome To DDNS Updater We are starting now....','green');

        this.setting = setting;
        this.initRetry = 0;
        this.init();
    }

    async init() {
        this.myIp = new MyIp(this.setting.ipServerArray);
        this.cloudFlare = new CloudFlareApi(this.setting.credential.email, this.setting.credential.apiKey);

        try {
            await this.myIp.getIp(); // Try getting Ip
            colorLog('Local Ip is retrived', 'yellow');

            await this.cloudFlare.init(); // Try conntected and resolve domain from CloudFlare
            this.cloudFlare.setMainDomain(this.setting.credential.mainDomain);
            colorLog('Initailize Cloudflare Updater Done','yellow');

            this.checkAndSetNewIP();
            if (!this.setting.once) {
                setInterval(this.checkAndSetNewIP.bind(this), this.setting.updateInterval); 
            }
            
        } catch(e) {
            console.error(e);
            this.initRetry++;

            if(this.initRetry < this.setting.noOfRetry) 
                setTimeout(this.init.bind(this), this.setting.timeBeforeRetry);
        }
    }

    async checkAndSetNewIP() {
        const domainToUpdate = this.setting.updateRecord.domain;
        const updatingType = this.setting.updateRecord.recordType;

        try {
            const record = await this.cloudFlare.getRecordId(domainToUpdate,updatingType);
            const ip = this.myIp.currentIp;
            
            if(record.content != ip) {
                // Actual Update IP part
                await this.cloudFlare.updateRecord(ip, domainToUpdate, updatingType, record.id);
                colorLog(`Ip is updated to ${ip}`,'blue');
            }
        } catch(e) {
            console.error(e)
        }
    }
}

module.exports = DDNSCloudFlare;