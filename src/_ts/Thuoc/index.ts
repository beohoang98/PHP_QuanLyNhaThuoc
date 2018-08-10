import {Model} from "../Model";

class _Thuoc extends Model {

	constructor()
	{
		super();
		this._database = "/public/api/thuoc/";
	}

	update(callback)
	{
		let $this = this;
		$this._get({}, function(err, data) {
			if (err) {
				console.log(err);
				return;
			}

			callback(false, data);
		});
	}
}

export { _Thuoc as Thuoc };