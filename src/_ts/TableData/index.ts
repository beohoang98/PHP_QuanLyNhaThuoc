/**
 * Display data under table
 */
class TableData {
	protected _map: any;
	protected _list: any;
	protected _isConnect: boolean;
	protected _connectStatus: string;
	protected _isFetched: boolean;
	protected _dbURL: string;

	public constructor() {
		this._map = {};
		this._list = [];
		this._isConnect = false;
		this._connectStatus = "";
		this._isFetched = false;
		this._dbURL = "";
	}

	protected async getData() {
		let res = await fetch(this._dbURL, {method: "GET",credentials: 'include'});

		if (!res.ok) {
			this._isConnect = false;
			this._connectStatus = res.statusText;
			return;
		}
	
		this._isConnect = true;
		this._connectStatus = "";
		
		let json = await res.json();
	
		if (!!json.err) {
			this._isFetched = false;
			this._connectStatus = json.msg;
			return;
		}

		this._isFetched = true;
		this._connectStatus = "OK";
		this._list = json.data;
	}

	protected async update() {
		// nothing here
	}

	protected get table() {
		return this._map;
	}

	protected get list() {
		return this._list;
	}
}

export default TableData;
