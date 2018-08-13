class _Model {

    protected _database : string;
    protected _data		: Array<any>;
    protected _res      : any;

    public constructor() {
        this._database = "";
        this._data = [];
    }

    get data() {
        return Object.assign({}, this._data);
    }
    get response() {
        return Object.assign({}, this._res);
    }

    /**
     * fetch data from database and do thing
     * @param params
     * @param callback callback function
     * 
     */
    protected async _get(params: any, callback?: (err: boolean, data ?: any)=>any) {
        this._data = [];
        const requestURL = this._database + this._urlparams(params);
        try {
            const res = await fetch(requestURL, {credentials: 'include'});
            const json = await res.json();
            if (json.err) {
                if (typeof callback === "function") callback(json.msg);
                return;
            }
            this._data = json.data;
            if (typeof callback === "function") callback(false, json.data);
            return json.data;
        } catch (err) {
            if (typeof callback === "function") callback(err);
            else throw err;
        }
    }

    /**
     * 
     * @param data 
     * @param callback 
     */
    protected async _post(data: JSON, callback?: (err: boolean, res?: any)=>any) {
        this._res = "";
        try {
            const res = await fetch(this._database, {
                credentials: 'include',
                method: "POST",
                body: JSON.stringify(data),
            });
            const json = await res.json();
            if (json.err) {
                if (typeof callback === "function") callback(json.msg);
                return;
            }
            this._res = json.data;
            if (typeof callback === "function") callback(false, json.data);
            return json.data;
        } catch (err) {
            if (typeof callback === "function") callback(err);
            else throw err;
        }
    }

    protected _urlparams(params) {
        const url = Object.keys(params).map(function(k) {
            return encodeURIComponent(k) + '=' + encodeURIComponent(params[k])
        }).join('&');
        return url;
    }
};
export { _Model as Model };