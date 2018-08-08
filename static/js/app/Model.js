const _Model = class {
    constructor() {
        this._database = "";
        this._data = [];
    }
    get rawData() {
        return Object.assign({}, this._data);
    }
    /**
     * fetch data from database and do thing
     * @param { Function (err, rawData) } callback callback function
     *
     */
    _update(callback) {
        this._data = [];
        const that = this;
        fetch(this._database, {
            credentials: 'include',
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json"
            }
        }).then(res => {
            if (!res.ok) {
                callback(res, null);
                return null;
            }
            return res.json();
        }).then(json => {
            if (!json || !!json.err) {
                callback(json, null);
                return;
            }
            that._data = json.data;
            callback(null, json.data);
        }).catch(err => {
            callback(err, null);
        });
    }
};
export { _Model as Model };
