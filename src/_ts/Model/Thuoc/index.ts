import {Model} from "../ModelClass";
import {BangThuoc} from "./BangThuoc";

class _Thuoc extends Model {

	constructor()
	{
		super();
		this._database = "/api/thuoc/";
	}

	public get(callback)
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

export { _Thuoc as Thuoc, BangThuoc as BangThuoc };