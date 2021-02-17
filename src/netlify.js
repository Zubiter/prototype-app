// Action Factory
import axios from 'axios';
import crypto from 'crypto-js';

class Site {
    id = null;
    files = {};
    client = null;

    constructor(siteId) {
        this.id = siteId;
    }

    async init() {
        (await this.client.get(`/api/v1/sites/${this.id}/files`)).data.forEach(file => {
            this.files[file.path] = file.sha;
        });
    }

    async uploadFiles(files) {
        function readFileInByte (file) {
            return new Promise((res, rej) => {
                const fileReader = new FileReader();
                
                fileReader.addEventListener('load', evt => {
                    res(evt.target.result)
                });
                fileReader.addEventListener('error', rej)
                
                // XXX
                fileReader.readAsBinaryString(file)
            });
        }

        const filenames = Object.keys(files);
        files = await Promise.all(Object.values(files).map(readFileInByte)).then(filecontents => {
            const files = {}
            for (let i = 0; i < filecontents.length; i++) files[filenames[i]] = filecontents[i];
            return files
        });

        const fileHash = Object.fromEntries(Object.entries(files).map(([filename, filecontent]) => [filename, crypto.SHA1(crypto.enc.Latin1.parse(filecontent)).toString(crypto.enc.Hex)]))

        const deployId = (await this.client.post(`/api/v1/sites/${this.id}/deploys`, {
            files: {
                ...this.files,
                ...fileHash
            }
        })).data.id;

        return Promise.all(Object.entries(files).map(([filename, filecontent]) => {
            return this.client.put(`/api/v1/deploys/${deployId}/files${filename}`, 
            filecontent
            , {
                headers: {
                    'Content-Type': 'application/octet-stream'
                }
            })
        }));
    }
}

export default class Netlify {
    accessToken = null;
    client = null

    constructor(accessToken) {
        this.accessToken = accessToken;
        this.client = axios.create({
            baseURL: 'https://api.netlify.com/',
            headers: {
                'Authorization': 'Bearer ' + accessToken
            }
        });
    }

    async createSite(siteName) {
        const res = await this.client.post('/api/v1/sites', { name: siteName });

        return {
            siteId: res.data.site_id
        };
    }

    async getSite(siteId) {
        const site = new Site(siteId);
        site.client = this.client;
        await site.init();
        return site;
    }    
}