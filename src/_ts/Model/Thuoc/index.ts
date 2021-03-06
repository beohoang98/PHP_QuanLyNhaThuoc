import {Model} from "../ModelClass";

class Thuoc extends Model {
    constructor() {
        super();
        this.database = "/api/thuoc/";
    }

    public async get(params: any, offset: number, limit: number): Promise<any[]> {
        return await this._get({q: params, offset, limit});
    }

    public async create(data): Promise<any> {
        this.res = await this._post(data);
        return (this.res);
    }

    public async add(ma, soLuong, tongGia): Promise<any> {
        this.res = await this._post({
            ma,
            so_luong: soLuong,
            tong_gia: tongGia,
        });
        return this.res;
    }

    public async update(ma: string, editInfo: any) {
        this.res = await this._put({
            ma, editInfo,
        });
        return this.res;
    }
}

export { Thuoc };
