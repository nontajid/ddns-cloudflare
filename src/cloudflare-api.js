const fetch = require('node-fetch');

class CloudFlareApi {
    constructor(email,apiKey,url = 'https://api.cloudflare.com/client/v4') {
        this.url   = url;
        this.email = email;
        this.apiKey = apiKey
        
        this.setHeader();
    }

    setHeader() {
        this.header = {
            'X-Auth-Email': this.email,
            'X-Auth-Key': this.apiKey,
            'Content-Type': 'application/json'
        }
    }

    init() {
        return new Promise((resolve,reject)=>{
            this.getZoneId()
            .then( data => { return data.json(); } )
            .then( zones => {
                    if (zones.result && zones.success) {
                        this.zones = zones.result;
                        resolve(zones);
                    } else {
                        reject(zones.errors);
                    }   
                })
            .catch( e => {
                reject(e);
            } );
        });
    }

    getZoneId() {
        const url = this.url + '/zones';
        const args = {
            method: 'GET',
            headers: this.header,
        };

        return fetch(url,args);
    }

    getRecordId(domain,recordType) {
        const url = this.url + '/zones/' + this.zoneId + '/dns_records';
        const args = {
            method: 'GET',
            headers: this.header,
        };
        return new Promise((resolve,reject)=>{
             fetch(url,args)
             .then( json => { return json.json() })
             .then( records => {
                if (records.result && records.success) {
                    const record = records.result.find( 
                        record => record.name == domain && record.type == recordType 
                    );

                    if( record ) {
                        resolve(record);
                    } else {
                        reject('record not found');
                    }
                }
             })
             .catch( e => { reject(e); });
        });
    }

    setMainDomain(domainName) {
        this.mainDomain = domainName;
        this.zone = this.zones.find( zone => zone.name == domainName);
        this.zoneId = this.zone.id;
        return this.zone;
    }

    updateRecord(ip, domain, recordType, dnsId) {
        const url = this.url + '/zones/' + this.zoneId + '/dns_records/' + dnsId;
        const data = {
            'type': recordType,
            'name': domain,
            'content': ip,
            'ttl': 1,
        };
        const args = {
            method: 'PUT',
            headers: this.header,
            body: JSON.stringify(data)
        };

        return new Promise((resolve,reject)=>{
            fetch(url,args)
            .then( json => { return json.json(); } )
            .then( data => {
                if(data.success) {
                    resolve();
                } else {
                    reject(data.errors)
                }
            })
            .catch( e => { reject(e); } );
        });
    }
}

module.exports = CloudFlareApi;