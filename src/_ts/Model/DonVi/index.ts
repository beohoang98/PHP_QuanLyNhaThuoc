import {Model} from "../ModelClass";

class DonVi extends Model {
    public constructor() {
        super();
        this.database = "/api/don_vi/";
    }

    public async get(callback: (data?: any) => any) {
        const data = await this._get({});
        this.data = data;
        if (typeof callback === "function") {
            callback(data);
        }
        return this.data;
    }
}

export {DonVi};
