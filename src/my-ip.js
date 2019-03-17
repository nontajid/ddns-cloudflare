const fetch = require('node-fetch');
const exec = require('child_process').exec;

class MyIp {    
    constructor(servers) {
        this.isGetIpByDig = false;
        this.servers = servers;
        
        if (this.servers.length < 1) {
            this.isGetIpByDig = true; 
        }
    }

    getRandomServer() {
        const index = Math.floor(Math.random() * this.servers.length);
        return this.servers[index];
    }

    getIp() {
        if (this.isGetIpByDig) {
            return this.getIpByDig();
        } else {
            return this.getIpByHttp();
        }
    }

    getIpByHttp() {
        const url = this.getRandomServer();
        return new Promise( (resolve,reject) => {
            fetch(url).then( json => { return json.json() } )
            .then( ip => {
                this.ip = ip.ip;
                resolve(this.ip);
            }).catch( e => { reject(e) } );
        });
    }

    getIpByDig() {
        return new Promise( (resolve, reject) => {
            exec("dig +short myip.opendns.com @resolver1.opendns.com", (error, stdout) => {
                if (error !== null) {
                    reject(`exec error: ${error}`);
                }                    

                if ( stdout ) {
                    this.ip = stdout.toString().trim();
                    resolve(this.ip);
                }
            });                  
        });
    }

    get currentIp() {
        this.getIp();
        return this.ip;
    }
}

module.exports = MyIp;