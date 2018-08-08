(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
class BangDonVi {
	constructor() {
		this._map = Object();
		this._list = Array();
		this._isConnect = false;
		this._connectStatus = "";
		this._isFetched = false;
		this._dbURL = "";
	}

	addDatabaseURL(url) {
		this._dbURL = url;
	}

	async update(url) {
		let res = await fetch('/public/api/getDonvi.php', {credentials: 'include'});
		
		if (!res.ok) {
			this._isConnect = false;
			this._connectStatus = res.responseText;
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

		for (let row of json.data)
		{
			let id = row['id'];
			this._map[id] = {
				data: row,
				ten: row['ten'],
				donvi_quydoi: null,
				heso: null,
				quydoiText: "đơn vị cơ bản"
			};
		}

		for (let id of Object.keys(this._map)) {
			let id_coban = this._map[id].data['id_quy_doi'];
			let heso = +this._map[id].data['he_so_quydoi'];

			if (id_coban == null) {
				continue;
			}

			while (this._map[id_coban].data['id_quy_doi'] != null)
			{
				heso *= +this._map[id_coban].data['he_so_quydoi'];
				id_coban = this._map[id_coban].data['id_quy_doi'];
			}

			this._map[id]['donvi_quydoi'] = this._map[id_coban];
			this._map[id]['heso'] = heso;
			this._map[id]['quydoiText'] = "= " + heso + "x [" 
										+ this._map[id_coban].ten + "]";
		}
	}

	get table() {
		return this._map;
	}

	get list() {
		return this._list;
	}
}
},{}]},{},[1]);