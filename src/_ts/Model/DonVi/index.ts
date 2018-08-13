import {Model} from "../ModelClass";

class _DonVi extends Model {
	private _fetchData: any;

	public constructor() {
		super();
		this._database = "/api/don_vi/";
		this._fetchData = null;
	}

	public async get(callback = (err: boolean, data?: any)=>{}) {
		try {
			const data = await this._get({});
			this._fetchData = this._filter(data);
			callback(false, this._fetchData);
			return this._fetchData;
		} catch (err) {
			callback(err);
		}
	}

	_filter(rawData) {
		let newData = rawData.slice();
		let map = {};

		for (let row of newData) {
			let heso = row['he_so_quydoi'];
			map[row['id']] = row;
			row['textQuyDoi'] = heso ? "" : "đơn vị cơ bản";			
		}

		for (let row of newData) {
			let id_co_ban = row['id_quy_doi'];
			let heso = +row['he_so_quydoi'];

			while (map.hasOwnProperty(id_co_ban)) {
				row['textQuyDoi'] += `=${heso}x[${map[id_co_ban]['ten']}]`;
				heso *= +map[id_co_ban]['he_so_quydoi'];
				id_co_ban = map[id_co_ban]['id_quy_doi'];
			}
		}

		return newData;
	}
}

export {_DonVi as DonVi};