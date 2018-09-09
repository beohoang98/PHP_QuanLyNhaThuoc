import {Model} from "../ModelClass";

class DonVi extends Model {
    public constructor() {
        super();
        this.database = "/api/don_vi/";
    }

    public async get(callback?: (data?: any) => any): Promise<any> {
        const data = await this._get({});
        this.data = data;
        if (typeof callback === "function") {
            callback(data);
        }
        return this.data;
    }

    public async renderSelectInput(target: JQuery<HTMLElement>) {
        const data = await this.get();
        target.html("");
        for (const row of data) {
            const opt = $("<option/>").val(row.id).text(row.ten);
            target.append(opt);
        }
        target.children().eq(0).attr("checked", "true");
    }
}

export {DonVi};
