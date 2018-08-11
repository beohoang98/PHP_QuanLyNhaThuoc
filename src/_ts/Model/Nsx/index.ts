import {Model} from "../ModelClass";

class _Nsx extends Model {

	constructor() {
		super();
		this._database = "/public/api/nsx/";
	}

	update(callback) {
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

export { _Nsx as Nsx };