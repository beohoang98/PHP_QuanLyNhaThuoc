import { Model } from "../ModelClass";

class CTHoaDon extends Model {
    private maHoaDon: number;

    public constructor(maHoaDon: number) {
        super();
        this.maHoaDon = maHoaDon;
        this.database = "/api/hoa_don";
    }

    public async get() {
        const data = await this._get({q: this.maHoaDon});
        return data;
    }

    public edit(field, value) {
        if (this.data.hasOwnProperty(field)) {
            this.data[field] = value;
        } else {
            throw new Error("No '" + field + "' in data");
        }
    }

    public async update() {
        const res = await this._put(this.data);
        return res;
    }
}

export {CTHoaDon};
