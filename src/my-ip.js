const fetch = require('node-fetch');

class MyIp {
    constructor(servers) {
        this.servers = servers;
    }

    getRandomServer() {
        const index = Math.floor(Math.random() * this.servers.length);
        return this.servers[index];
    }

    getIp() {
        const url = this.getRandomServer();
        return new Promise( (resolve,reject) => {
            fetch(url).then( json => { return json.json() } )
            .then( ip => { 
                this.ip = ip.ip;
                resolve(this.ip);
            }).catch( e => { reject(e) } );
        });
    }

    get currentIp() {
        this.getIp();
        return this.ip;
    }
}

module.exports = MyIp;