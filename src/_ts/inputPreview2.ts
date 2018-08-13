class inputPreview2 {
    _list : Object;
    _data : Array<any>;
    _lookup : Object;
    _target : Document;
    _preview_div : HTMLElement;
    _currentPreviewData : Array<any>;

    constructor(target = document) {
        this._list = {};
        this._data = [];
        this._lookup = {};
        this._target = target;
        this._preview_div = null;
        this._currentPreviewData = [];
        // constructor    
        document.addEventListener("click", (e)=>{
            const target = e.target as HTMLElement;
            if (!target.classList.hasOwnProperty("preview-row"))
                this._deletePreview();
        });
    }

    /**
     * add lookup to json name
     * @param {{idEl: String}} arr { id_element : name_of_field}
     */
    addLookup (arr: string) {
        if (typeof arr != "object") {
            // console.log(Object.call(arr));
            throw new Error("parameter must be json obj");
            return;
        }
        for (let key of Object.keys(arr)) {
            this._lookup[key] = arr[key];
            let el = document.getElementById(key);
            if (!el) {
                console.log(Error(`Cannot find #${key} element`));
            } else {
                this._list[key] = el;
            }
        }
    };

    /**
     * add host to fetch database
     * @param {string} url asd
     */
    addData (data) {
        if (typeof (data) != "object") {
            throw new Error("parameter must be json");
            return;
        }
        this._data = data;
    };

    listen(id, callback) {
        let element = document.getElementById(id);
        element.addEventListener("keydown", (e : KeyboardEvent)=>{
            let code = e.keyCode;
            let cur = +this._preview_div.getAttribute("cur");
            if (code === 27) { // esc
                this._deletePreview();
            } else if (code == 38 || code == 40) { // up-down
                e.preventDefault();
                this._preview_div.children[cur].classList.remove("preview-row-active");
                
                let len = this._preview_div.children.length;
                cur = (code == 38) ? cur -1 : cur + 1;
                if (cur < 0) cur = len - 1;
                if (cur > len - 1) cur = 0;

                this._preview_div.children[cur].classList.add("preview-row-active");
                this._preview_div.setAttribute("cur", cur + "");
            } else if (code == 13) { // enter
                e.preventDefault();
                callback(this._currentPreviewData[cur]);
                this._deletePreview();
            } else {
                this.fetchOn(id, callback);
            }
        });
    }
    

    /**
     *
     * fetch database and show in input
     * @param {string} id id of html element input need to fetch by value
     */
    fetchOn (id: string, callback: Function) {
        this._deletePreview();
        this._currentPreviewData.length = 0; //clear current preview suggest name

        if (!this._list.hasOwnProperty(id)) {
            console.log("Cannot find "+id);
            return;
        };

        let input = this._list[id];
        let input_preview = this._createFlyWrap(input);
        let value = input.value;
        this._preview_div = input_preview;
        input.setAttribute('autocomplete', 'off');

        for (const row of this._data) {
            if (!this._isLike(row[this._lookup[id]], value)) continue;
            this._currentPreviewData.push(row);

            let arr = [];
            for (const name in this._lookup) {
                if (!this._lookup[name]) continue;
                const field = this._lookup[name];
                arr.push(row[field]);
            }
            
            let newRow = this._createFlyRow(arr);
            newRow.addEventListener("click", (e)=>{
                callback(row);
                this._deletePreview();
            });
            input_preview.appendChild(newRow);

            document.body.appendChild(input_preview);
        }
    };

    /**
     * @param {HTMLDivElement} element 
     * @param {string} value 
     */
    private _createFlyWrap(element) {
        if (!element) return null;
        let rect = element.getBoundingClientRect();

        let div = document.createElement("div");
        div.className = "preview-input";
        div.style.minWidth = rect.width + "px";
        div.style.top 	= +rect.top + rect.height + "px";
        div.style.left 	= +rect.left + "px";
        div.setAttribute("cur", "0");

        return div;
    }

    /**
     * @return {true} if str1 like str2
     * @param {String} str1 
     * @param {String} str2 
     */
    private _isLike(str1, str2)
    {
        str1 = str1.trim();
        str2 = str2.trim();
        if (str1 == "" || str2 == "") return false;
        str1 = str1.normalize();
        str2 = str2.normalize();

        str1 = str1.toLowerCase();
        str2 = str2.toLowerCase();
        let reg = new RegExp(`^.*${str2}.*$`);
        return str1.match(reg);
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

export default inputPreview2;
