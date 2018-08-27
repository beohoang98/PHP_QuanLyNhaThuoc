import {Model} from "../ModelClass";
import {BangThuoc} from "./BangThuoc";

class Thuoc extends Model {

    constructor() {
        super();
        this.database = "/api/thuoc/";
    }

    public async get(params: any, offset: number, limit: number): Promise<any[]> {
        return await this._get({params, offset, limit});
    }

    public async create(data): Promise<boolean> {
        this.res = await this._post(data);
        return (!this.res.err);
    }
}

export { Thuoc, BangThuoc as BangThuoc };
