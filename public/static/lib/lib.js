class inputPreview2 {
    constructor(target = document) {
        this._list = Object({});
        this._data = [];
        this._lookup = Object({});
        this._target = target;
        this._preview_div = null;
        this._currentPreviewData = Array();
        //constructor    
        document.addEventListener("click", (e) => {
            const target = e.target;
            if (!target.classList.hasOwnProperty("preview-row"))
                this._deletePreview();
        });
    }
    /**
     * add lookup to json name
     * @param {JSON} arr object to lookup data name to element input name
     */
    addLookup(arr) {
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
    }
    ;
    /**
     * add host to fetch database
     * @param {string} url asd
     */
    addData(data) {
        if (typeof (data) != "object") {
            throw new Error("parameter must be json");
            return;
        }
        this._data = data;
    }
    ;
    listen(id, callback) {
        let element = document.getElementById(id);
        element.addEventListener("keydown", (e) => {
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
                if (code == 38)
                    --cur;
                else
                    ++cur;
                let len = this._preview_div.children.length;
                if (cur < 0)
                    cur = len - 1;
                if (cur > len - 1)
                    cur = 0;
                this._preview_div.children[cur]
                    .classList.add("preview-row-active");
                this._preview_div.setAttribute("cur", cur + "");
            }
            else if (code == 13) {
                e.preventDefault();
                let cur = +this._preview_div.getAttribute("cur");
                callback(this._currentPreviewData[cur]);
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
    fetchOn(id, callback) {
        this._deletePreview();
        this._currentPreviewData.length = 0; //clear current preview suggest name
        if (this._list.hasOwnProperty(id)) {
            let input = this._list[id];
            input.setAttribute('autocomplete', 'off');
            let input_preview = this._createFlyWrap(input);
            this._preview_div = input_preview;
            document.body.appendChild(input_preview);
            let value = input.value;
            for (let row of this._data) {
                if (!this._isLike(row[this._lookup[id]], value))
                    continue;
                this._currentPreviewData.push(row);
                let arr = [];
                for (let name in this._lookup) {
                    arr.push(row[name]);
                }
                let newRow = this._createFlyRow(arr);
                newRow.addEventListener("click", (e) => {
                    callback(row);
                    this._deletePreview();
                });
                input_preview.appendChild(newRow);
            }
        }
        else {
            console.log("cannot find id");
        }
    }
    ;
    /**
     * @param {HTMLDivElement} element
     * @param {string} value
     */
    _createFlyWrap(element) {
        if (!element)
            return null;
        let rect = element.getBoundingClientRect();
        let div = document.createElement("div");
        div.className = "preview-input";
        div.style.minWidth = rect.width + "px";
        div.style.top = +rect.top + rect.height + "px";
        div.style.left = +rect.left + "px";
        div.setAttribute("cur", "0");
        return div;
    }
    /**
     * @return {true} if str1 like str2
     * @param {String} str1
     * @param {String} str2
     */
    _isLike(str1, str2) {
        str1 = str1.trim();
        str2 = str2.trim();
        if (str1 == "" || str2 == "")
            return false;
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
        if (!Array.isArray(arrValues)) {
            return null;
        }
        let row = document.createElement("div");
        row.className = "preview-row";
        for (let value of arrValues) {
            let col = document.createElement("div");
            col.style.margin = "auto";
            col.textContent = value;
            row.appendChild(col);
        }
        return row;
    }
    _deletePreview() {
        document.querySelectorAll(".preview-input").forEach((val) => {
            val.remove();
        });
    }
}
(function ($) {
    $.prototype.moneyInput = function () {
        this.each((id, el) => {
            $(el).on('keyup', (e) => {
                let val = $(el).val();
                val = val.replace(/[\D\s\,\.]/g, '');
                let val_num = val ? parseInt(val) : 0;
                $(el).val(val_num.toLocaleString());
            });
        });
        return this;
    };
}(jQuery));
class StatusPopup {
    constructor() {
        this.timeEase = 500;
        this._element = document.createElement('div');
        this._element.style.position = "fixed";
        this._element.style.top = "0";
        this._element.style.left = "0";
        this._element.style.zIndex = "9999";
        this._element.style.width = "100%";
        this._element.style.height = "100%";
        this._element.style.backgroundColor = "rgba(0,0,0,0.5)";
        this._element.style.opacity = "0";
        this._element.style.visibility = 'hidden';
        this._element.style.display = "flex";
        this._innerDiv = document.createElement('div');
        this._innerDiv.style.margin = "auto";
        this._innerDiv.style.display = 'inline-flex';
        this._innerDiv.style.position = 'relative';
        this._innerDiv.style.flexFlow = "row";
        this._innerDiv.style.backgroundColor = "white";
        this._innerDiv.style.borderRadius = '10px';
        this._statusIcon = document.createElement('img');
        this._statusIcon.style.width = "50px";
        this._statusIcon.style.height = "50px";
        this._statusIcon.style.margin = "10px";
        this._statusIcon.src = "";
        this._statusString = document.createElement('div');
        this._statusString.style.maxWidth = "200px";
        this._statusString.style.padding = "10px";
        this._closeButton = document.createElement('div');
        this._closeButton.style.position = 'absolute';
        this._closeButton.style.right = '-10px';
        this._closeButton.style.top = '-10px';
        this._closeButton.style.width = "20px";
        this._closeButton.style.height = "20px";
        this._closeButton.style.backgroundColor = "#f55";
        this._closeButton.innerText = "X";
        this._closeButton.style.textAlign = 'center';
        this._closeButton.addEventListener('click', (e) => {
            this.hide();
        });
        this._innerDiv.appendChild(this._statusIcon);
        this._innerDiv.appendChild(this._statusString);
        this._innerDiv.appendChild(this._closeButton);
        this._element.appendChild(this._innerDiv);
    }
    create() {
        document.body.appendChild(this._element);
    }
    setStatus(isSuccess, msg) {
        if (isSuccess == undefined)
            return;
        if (!!isSuccess == true) {
            this._statusIcon.src = "/static/lib/success.svg";
        }
        else {
            this._statusIcon.src = "/static/lib/failed.svg";
        }
        this._statusString.textContent = msg;
    }
    show() {
        this._element.style.visibility = 'visible';
        let count = 0;
        let changeTarget = this._element.style;
        let idInterval = setInterval(() => {
            changeTarget.opacity = count / this.timeEase + "";
            count += 10;
            if (count > this.timeEase)
                clearInterval(idInterval);
        }, 10);
    }
    hide() {
        let count = this.timeEase;
        const changeTarget = this._element.style;
        const idInterval = setInterval(() => {
            changeTarget.opacity = count / this.timeEase + "";
            count -= 10;
            if (count < 0) {
                this._element.style.visibility = 'hidden';
                clearInterval(idInterval);
            }
        }, 10);
    }
    close() {
        this._element.remove();
    }
}
