

export class getUsers {


    private token: Promise<string>;
    private url : string;

    constructor() {
        this.token = this.setAuth0Token()
        this.url  = (process.env.AUTH_ISSUER_BASE as string)
    }


    private async setAuth0Token() {
        const id = (process.env.REACT_APP_ID as string)
        const secret = (process.env.REACT_APP_SECRET as string)
        

        const options = {
            method: 'POST',
            url: 'https://lundsnation.eu.auth0.com/oauth/token',
            headers: { 'content-type': 'application/json' },
            body: `{"client_id" : "${id}", "client_secret": "${secret}", "audience" : "https://lundsnation.eu.auth0.com/api/v2/", "grant_type" : "client_credentials"}`,
        }
        const response = await fetch(options.url, options)
        const responseJson = await response.json()
        const parsed = await responseJson.access_token
        return parsed
    }


    downloadJSON = (json: string) => {


        const dataStr = 'data:application/json;charset=utf-8,' + json
        const download = document.createElement('a')
        download.setAttribute('href', dataStr)
        download.setAttribute('download', 'Användare' + '.json')
        document.body.appendChild(download)
        download.click()
        download.remove()

    }

    private async _downloadAllUsers() {

        const token = await this.token
        const options = {
            method: 'GET',
            url: "https://lundsnation.eu.auth0.com/api/v2/users",
            headers: { authorization: 'Bearer ' + token }
        }
        const response = await fetch(options.url, options)
        const data = await response.json()
        const parsed = JSON.stringify(data)


        this.downloadJSON(parsed)
    }

    private async _getSpecificUser(key: string, value: string) {

        const token = await this.token
        const specified = `${key} : "${value}"`
        const options = {
            method: 'GET',
            url: "https://lundsnation.eu.auth0.com/api/v2/users?",
            headers: { authorization: 'Bearer ' + token }
        }

        const searchParams = new URLSearchParams({
            q: specified,
            search_engine: 'v3',
        })
        const response = await fetch(options.url + searchParams.toString(), options)
        const data = await response.json()
        const parser = JSON.parse(JSON.stringify(data))
        console.log(response)
        return parser[0]

    }

    async checkForPrivliges(key: string, value: string) {
        this.getUser(key, value)
    }

    get getAllUsers() {
        return this._downloadAllUsers()
    }

    getUser(key: string, value: string){
        if (!key || !value) {
            return 
        }
        return this._getSpecificUser(key, value)
    }


}