import TableData from "../TableData";

class BangDonVi extends TableData {
	constructor() {
		super();
		this._dbURL = "/api/don_vi/";
	}

	public async update() {
		await this.getData();
		
		for (let row of this._list) {
			let id = row['id'];
			this._map[id] = {
				data: row,
				ten: row['ten'],
				donvi_quydoi: null,
				heso: null,
				quydoiText: "đơn vị cơ bản",
			};
		}

		for (let id of Object.keys(this._map)) {
			let idCoban = this._map[id].data['id_quy_doi'];
			let heso = +this._map[id].data['he_so_quydoi'];

			if (idCoban == null) {
				continue;
			}

			while (this._map[idCoban].data['id_quy_doi'] != null)
			{
				heso *= +this._map[idCoban].data['he_so_quydoi'];
				idCoban = this._map[idCoban].data['id_quy_doi'];
			}

			this._map[id]['donvi_quydoi'] = this._map[idCoban];
			this._map[id]['heso'] = heso;
			this._map[id]['quydoiText'] = "= " + heso + "x ["
										+ this._map[idCoban].ten + "]";
		}
	}
}

export default BangDonVi;
