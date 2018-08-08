import {Model} from "./Model.js";

const _Nsx = class extends Model {

	constructor()
	{
		super();
		this._database = "/public/api/getNsx.php";
	}

	update(callback)
	{
		let $this = this;
		$this._update(function(err, data) {
			if (err != null) {
				console.log(err);
				return;
			}

			callback(false, data);
		});
	}
}

export { _Nsx as Nsx };