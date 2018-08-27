class Model {

    protected database: string;
    protected data: Array<{}>;
    protected res: any;

    public constructor() {
        this.database = "";
        this.data = [];
    }

    get response() {
        return Object.assign({}, this.res);
    }

    // =============== INHERIT FUNC
    public async get(params: any, offset: number, limit: number): Promise<any[]> {
        return undefined;
    }

    public async create(data: any): Promise<boolean> {
        return false;
    }

    /**
     * update record
     * @param fieldMatch match field to update record
     * @param fieldUpdate the data need update
     */
    public async update(fieldMatch: any, fieldUpdate: any): Promise<boolean> {
        return false;
    }

    /**
     * remove a record
     * @param fieldMatch field match to remove
     * @return true of false
     */
    public async remove(fieldMatch: any): Promise<boolean> {
        return false;
    }

    // =============== CORE FUNC

    /**
     * fetch data from database and do thing
     * @param params
     * @param callback callback function
     */
    protected async _get(params: any, callback?: (err: boolean, data ?: any) => any): Promise<any[]> {
        this.data = [];
        const requestURL = this.database + "?" + this._urlparams(params);
        try {
            const res = await fetch(requestURL, {credentials: "include"});
            const json = await res.json();
            if (json.err) {
                throw new Error(json.msg);
            }

            this.data = json.data;
            if (typeof callback === "function") {
                callback(false, json.data);
            }
            return json.data;
        } catch (err) {
            if (typeof callback === "function") {
                callback(err);
            } else {
                throw err;
            }
        }
    }

    /**
     * post request
     * @param {any} data
     * @param {Function} [callback]
     */
    protected async _post(data: any, callback?: (err: boolean, res?: any) => any): Promise<any[]> {
        this.res = "";
        try {
            const res = await fetch(this.database, {
                body: JSON.stringify(data),
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
                method: "POST",
            });
            const json = await res.json();
            if (json.err) {
                throw new Error(json.msg);
            }

            this.res = json.data;
            if (typeof callback === "function") {
                callback(false, json.data);
            }
            return json.data;
        } catch (err) {
            if (typeof callback === "function") {
                callback(err);
            } else {
                throw err;
            }
        }
    }

    protected _urlparams(params) {
        const url = Object.keys(params).map((k) => {
            return encodeURIComponent(k) + "=" + encodeURIComponent(params[k]);
        }).join("&");
        return url;
    }
}

export {Model};
