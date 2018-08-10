import {Model} from "../Model";

class _DonVi extends Model {
	private _fetchData: any;

	public constructor() {
		super();
		this._database = "/public/api/don_vi/";
		this._fetchData = null;
	}

	public update(callback) {
		this._get({}, (err, data)=>{
			if (!!err) {
				console.log(err);
				return;
			}
			this._fetchData = this._filter(data);
			callback(err, this._fetchData);
		});
	}

	_filter(rawData) {
		let newData = rawData.slice();
		let map = {};

		for (let row of newData) {
			map[row['id']] = row;
			let heso = row['he_so_quydoi'];

			if (!heso)
			{
				row['textQuyDoi'] = "đơn vị cơ bản";
			}
			else {
				row['textQuyDoi'] = "";
			}
			
		}

		for (let row of newData) {
			let id_co_ban = row['id_quy_doi'];
			let heso = +row['he_so_quydoi'];

			if (map.hasOwnProperty(id_co_ban))
			{
				while (map.hasOwnProperty(id_co_ban))
				{
					row['textQuyDoi'] += `=${heso}x[${map[id_co_ban]['ten']}]`;
					heso *= +map[id_co_ban]['he_so_quydoi'];
					id_co_ban = map[id_co_ban]['id_quy_doi'];
				}
			}	
		}

		return newData;
	}
}

export {_DonVi as DonVi};