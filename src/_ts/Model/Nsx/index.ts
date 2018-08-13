import {Model} from "../ModelClass";

class _Nsx extends Model {

	public constructor() {
		super();
		this._database = "/api/nsx/";
	}

	/**
	 * get data of nsx
	 * @param callback callback function 
	 */
	public async get(callback: Function) {
		const data = await this._get({}).catch((err)=>{
			if (typeof callback === "function") callback(err);
			else throw err;
		});

		if (typeof callback === "function") callback(false, data);
		return data;
	}

	public async update(callback: Function) {

	}

	public async create(callback: Function) {

	}

	public async remove(callback: Function) {

	}
}

export { _Nsx as Nsx };