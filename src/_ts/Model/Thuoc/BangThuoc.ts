import TableData from "../TableData";

class BangThuoc extends TableData {
    public constructor() {
        super();
        this._dbURL = "/public/api/thuoc/";
    }

    public async update() {
		await this.getData();
		
		for (let row of this._list) {
			let id = row['id'];
			this._map[id] = row;
		}
	}
}

export {BangThuoc};
