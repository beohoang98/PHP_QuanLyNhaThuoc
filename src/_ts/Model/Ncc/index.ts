import {Model} from "../ModelClass";

class Ncc extends Model {

    public constructor() {
        super();
        this.database = "/api/ncc/";
    }

    /**
     * get data of nsx
     * @param callback callback function
     */
    public async get(params): Promise<any[]> {
        const data = await this._get({q: params});
        return data;
    }
}

export { Ncc };
