import {Model} from "./Model.js";

const _DonVi = class extends Model {
	constructor()
	{
		super();
		this._database = "/api/getDonvi.php";
		this._fetchData = null;
	}

	update(callback)
	{
		let $this = this;
		$this._update(function(err, data) {
			if (err != null) {
				console.log(err);
				return;
			}

			$this._fetchData = $this._filter(data);

			callback(false, $this._fetchData);
		});
	}

	_filter(rawData)
	{
		let newData = rawData.slice();
		let map = {};

		for (let row of newData)
		{
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

		for (let row of newData) 
		{
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