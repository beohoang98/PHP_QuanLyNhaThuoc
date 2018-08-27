import {Model} from "../ModelClass";

class _Nsx extends Model {

    public constructor() {
        super();
        this.database = "/api/ncc/";
    }

    /**
     * get data of nsx
     * @param callback callback function
     */
    public async get(params, offset, limit): Promise<any[]> {
        const data = await this._get({params, offset, limit});
        return data;
    }
}

export { _Nsx as Nsx };