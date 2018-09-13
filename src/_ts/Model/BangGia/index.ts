import { Model } from "../ModelClass";

class BangGia extends Model {
    public constructor() {
        super();
        this.database = "/api/price/";
    }

    public async get(maThuoc: string): Promise<any[]> {
        const data = await this._get({ma: maThuoc});
        return data;
    }

    public async add(maThuoc: string, giaMoi: number) {
        const res = await this._post({ma: maThuoc, price: giaMoi});
        return res;
    }
}

export {BangGia};
