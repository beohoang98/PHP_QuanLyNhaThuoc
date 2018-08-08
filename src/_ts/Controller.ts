import {DonVi} 	from './DonVi.js';
import {Thuoc} 	from './Thuoc.js';
import {Nsx} 	from './Nsx.js';

const _Controller = class {
	constructor() {
		this._componentList = {};
		this._event = {};
	}

	/**
	 * @param {string} name name of model 
	 * @param {string} typename type of model (DonVi | Thuoc | Nsx)
	 */
	addModel(name, typename) {
		if (this._componentList.hasOwnProperty(name)) {
			throw Error(name + " is existing model");
		}

		let newObj = null;
		switch (typename) {
			case "DonVi": newObj = new DonVi();break;
			case "Thuoc": newObj = new Thuoc();break;
			case "Nsx": newObj = new Nsx();break;
			default: {
				throw Error("unknown typename: "+ typename);
			}
		}

		this._componentList[name] = newObj;
		this._event[name] = [];
	}

	/**
	 * @param {string} compoName component name
	 * @param {Function} func callback function
	 * @return {void}
	 */
	addUpdateFunc(compoName, func = (err, data)=>any) {
		if (!this._event.hasOwnProperty(compoName))
		{
			console.log("Not found "+compoName);
		}
		this._event[compoName].push(func);
	}

	/**
	 * update all model and call callback event
	 */
	onUpdateAll() {
		for (const compoName of Object.keys(this._componentList)) {
			const that = this;
			this._componentList[compoName].update(function(err, data) {
				for (const func of that._event[compoName]) {
					func(err, data);
				}
			});
		}
	}
}

export {_Controller as Controller};

