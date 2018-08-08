class inputPreview {
	constructor(target = document) {
		this._list = Object({});
		this._host = String("");
		this._lookup = Object({});
		this._target = target;
		this._preview_div = null;
		this._fetchData = null;
		//constructor    
		document.addEventListener("click", (e)=>{
			if (!e.target.classList.hasOwnProperty("preview-row"))
				this._deletePreview();
		});
	}

	/**
	 * add lookup to json name
	 * @param {JSON} arr object to lookup data name to element input name
	 */
	addLookup (arr) {
		if (typeof arr != "object") {
			// console.log(Object.call(arr));
			throw new Error("parameter must be json obj");
			return;
		}
		for (let key of Object.keys(arr)) {
			this._lookup[key] = arr[key];
			let el = this._target.getElementById(key);
			if (!!el === false) {
				console.log(Error(`Cannot find #${key} element`));
			}
			else {
				this._list[key] = el;
			}
		}
	};

	/**
	 * add host to fetch database
	 * @param {string} url asd
	 */
	addHost (url) {
		if (typeof (url) != "string") {
			throw new Error("parameter must be string");
			return;
		}
		// if (!url.match(/(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9]\.[^\s]{2,})/)) {
		// 	throw new Error("url invalid");
		// 	return;
		// }
		this._host = url;
	};

	listen(id, callback) {
		let element = document.getElementById(id);
		element.addEventListener("keydown", (e)=>{
			let code = e.keyCode;
			if (code == 27) //esc
			{
				this._deletePreview();
			}
			else if (code == 38 || code == 40) //up -down
			{
				e.preventDefault();
				let cur = +this._preview_div.getAttribute('cur');
				
				this._preview_div.children[cur]
						.classList.remove("preview-row-active");

				if (code == 38) --cur;
				else ++cur;

				let len = this._preview_div.children.length;
				if (cur < 0) cur = len-1;
				if (cur > len-1) cur = 0;

				this._preview_div.children[cur]
						.classList.add("preview-row-active");

				this._preview_div.setAttribute("cur", cur);
			}
			else if (code == 13)
			{
				e.preventDefault();
				let cur = +this._preview_div.getAttribute("cur");

				callback(this._fetchData[cur]);
				this._deletePreview();
			}
			else {
				this.fetchOn(id, callback);
			}
		});
	}
	

	/**
	 *
	 * fetch database and show in input
	 * @param {string} id id of html element input need to fetch by value
	 */
	async fetchOn (id, callback) {
		this._deletePreview();
		if (this._list.hasOwnProperty(id)) {
			let input = this._list[id];
			input.setAttribute('autocomplete', 'off');

			let input_preview = this._createFlyWrap(input);
			this._preview_div = input_preview;
			document.body.appendChild(input_preview);

			let value = input.value;
			let res = await fetch(this._host + value, { credentials: "same-origin" });
			let json = await res.json();

			if (!!json.err) {
				return;
			}
			this._fetchData = json.data;
			
			for (let row of json.data) {
				let arr = [];
				for (let name of Object.keys(this._lookup)) {
					let lookupName = this._lookup[name];
					arr.push(row[lookupName]);
				}
				
				let newRow = this._createFlyRow(arr);
				newRow.addEventListener("click", (e)=>{
					callback(row);
					this._deletePreview();
				});
				input_preview.appendChild(newRow);
			}
		}
		else {
			console.log("cannot find id");
		}
	};

	/**
	 * @param {HTMLDivElement} element 
	 * @param {string} value 
	 */
	_createFlyWrap(element) {
		if (!element) return null;
		let rect = element.getBoundingClientRect();

		let div = document.createElement("div");
		div.className = "preview-input";
		div.style.minWidth = rect.width + "px";
		div.style.top = +rect.top + rect.height + "px";
		div.style.left = +rect.left + "px";
		div.setAttribute("cur", 0);	

		return div;
	}

	/**
	 * @param {Array} arrValues 
	 */
	_createFlyRow(arrValues) {
		if (!Array.isArray(arrValues)){
			return null;
		}
		
		let row = document.createElement("div");
		row.className = "preview-row";

		for (let value of arrValues)
		{
			let col = document.createElement("div");
			col.style.margin = "auto";
			col.textContent = value;
			row.appendChild(col);
		}

		return row;
	}

	_deletePreview() {
		document.querySelectorAll(".preview-input").forEach((val)=>{
			val.remove();
		});
	}
}
