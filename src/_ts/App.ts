import {Controller} from './Controller.js';
import inputPreview2 from './inputPreview2';


const _QLNT = class extends Controller {
	constructor() {
		super();
		this.addModel('DonVi', 'DonVi');
		this.addModel('Thuoc', 'Thuoc');
		this.addModel('Nsx', 'Nsx');
	}

	addTable(element) {
		let nameTHs = element.querySelectorAll("th");
		let compoName = element.getAttribute('component');

		const lookName = Array.from(nameTHs)
		.map((val: any)=>val.getAttribute('for'));

		const updateTable = function(err, data) {
			if (err) return;

			let body = element.querySelector('tbody');

			// delete old row
			let trbody = element.querySelectorAll('tbody tr');
			if (trbody && trbody.length) {
				for (let el of trbody) el.removeChild();
			}

			// updata new row
			for (let row of data) {
				let rowEl = document.createElement('tr');
				for (let name of lookName) {
					let newTD = document.createElement('td');
					newTD.textContent = row[name];
					rowEl.appendChild(newTD);
				}

				body.appendChild(rowEl);
			}
		};

		this.addUpdateFunc(compoName, updateTable);
	}

	addNameInputThuoc(idElement, optListen, optChange) {
		const preview = new inputPreview2();
		preview.addLookup(optListen);
		preview.listen(idElement, (data)=>{
			for (let idEl in optChange)	{
				if (!optChange.hasOwnProperty(idEl)) continue;
				$('#'+idEl).val(data[optChange[idEl]]);
			}
		});

		const onUpdate = function(err, data) {
			if (err) {
				console.log(err);
				return;
			}
			preview.addData(data);
		};

		this.addUpdateFunc('Thuoc', onUpdate);
	}

	addSelectInput(element, opt) {
		let valueKey = opt.value;
		let titleKey = opt.title;

		let compoName = element.getAttribute('component');

		const onUpdate = function(err, data) {
			if (err) {
				console.log(err);
				return;
			}

			// remove old options
			let oldOpt = element.childNodes;
			if (oldOpt.length) oldOpt.forEach((val)=>val.remove());

			// add updated option
			for (let row of data) {
				let value = row[valueKey];
				let title = row[titleKey];

				let newOpt = document.createElement("option");
				newOpt.value = value;
				newOpt.textContent = title;

				element.appendChild(newOpt);
			}
		};

		this.addUpdateFunc(compoName, onUpdate);
	}
};

export {_QLNT as QLNT};
