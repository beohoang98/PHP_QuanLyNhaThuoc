(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Controller_js_1 = require("./Controller.js");
const inputPreview2_1 = require("./inputPreview2");
const _QLNT = class extends Controller_js_1.Controller {
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
            .map((val) => val.getAttribute('for'));
        const updateTable = function (err, data) {
            if (err)
                return;
            let body = element.querySelector('tbody');
            // delete old row
            let trbody = element.querySelectorAll('tbody tr');
            if (trbody && trbody.length) {
                for (let el of trbody)
                    el.removeChild();
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
        const preview = new inputPreview2_1.default();
        preview.addLookup(optListen);
        preview.listen(idElement, (data) => {
            for (let idEl in optChange) {
                if (!optChange.hasOwnProperty(idEl))
                    continue;
                $('#' + idEl).val(data[optChange[idEl]]);
            }
        });
        const onUpdate = function (err, data) {
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
        const onUpdate = function (err, data) {
            if (err) {
                console.log(err);
                return;
            }
            // remove old options
            let oldOpt = element.childNodes;
            if (oldOpt.length)
                oldOpt.forEach((val) => val.remove());
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
exports.QLNT = _QLNT;

},{"./Controller.js":4,"./inputPreview2":10}],2:[function(require,module,exports){
"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
class BangDonVi {
    constructor() {
        this._map = {};
        this._list = [];
        this._isConnect = false;
        this._connectStatus = "";
        this._isFetched = false;
        this._dbURL = "";
    }
    addDatabaseURL(url) {
        this._dbURL = url;
    }
    update(url) {
        return __awaiter(this, void 0, void 0, function* () {
            let res = yield fetch('/public/api/getDonvi.php', { credentials: 'include' });
            if (!res.ok) {
                this._isConnect = false;
                this._connectStatus = res.statusText;
                return;
            }
            this._isConnect = true;
            this._connectStatus = "";
            let json = yield res.json();
            if (!!json.err) {
                this._isFetched = false;
                this._connectStatus = json.msg;
                return;
            }
            this._isFetched = true;
            this._connectStatus = "OK";
            this._list = json.data;
            for (let row of json.data) {
                let id = row['id'];
                this._map[id] = {
                    data: row,
                    ten: row['ten'],
                    donvi_quydoi: null,
                    heso: null,
                    quydoiText: "đơn vị cơ bản",
                };
            }
            for (let id of Object.keys(this._map)) {
                let idCoban = this._map[id].data['id_quy_doi'];
                let heso = +this._map[id].data['he_so_quydoi'];
                if (idCoban == null) {
                    continue;
                }
                while (this._map[idCoban].data['id_quy_doi'] != null) {
                    heso *= +this._map[idCoban].data['he_so_quydoi'];
                    idCoban = this._map[idCoban].data['id_quy_doi'];
                }
                this._map[id]['donvi_quydoi'] = this._map[idCoban];
                this._map[id]['heso'] = heso;
                this._map[id]['quydoiText'] = "= " + heso + "x ["
                    + this._map[idCoban].ten + "]";
            }
        });
    }
    get table() {
        return this._map;
    }
    get list() {
        return this._list;
    }
}
exports.default = BangDonVi;

},{}],3:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _CTHoaDon = class {
    constructor(ma = -1, ten = "", donvi = -1, sl = 0, thanhtien = 0) {
        this.ma = ma;
        this.ten = ten;
        this.donvi = donvi;
        this.sl = sl;
        this.thanhtien = thanhtien;
        this._childElement = {};
        this._element = null;
        this.createElement();
        this.updateAllValue(ma, ten, donvi, sl, thanhtien);
    }
    /**
     * create row element for table
     */
    createElement() {
        this._element = document.createElement('tr');
        const maTD = document.createElement('td');
        const tenTD = document.createElement('td');
        const donviTD = document.createElement('td');
        const slTD = document.createElement('td');
        const tienTD = document.createElement('td');
        maTD.classList.add('cthd-mthuoc');
        tenTD.classList.add('cthd-tthuoc');
        donviTD.classList.add('cthd-donvi');
        slTD.classList.add('cthd-sl');
        tienTD.classList.add('cthd-gia');
        this._element.appendChild(maTD);
        this._element.appendChild(tenTD);
        this._element.appendChild(donviTD);
        this._element.appendChild(slTD);
        this._element.appendChild(tienTD);
        this._childElement = {
            "ma_thuoc": maTD,
            "ten_thuoc": tenTD,
            "don_vi": donviTD,
            "so_luong": slTD,
            "thanhtien": tienTD
        };
    }
    getRowElement() {
        return this._element;
    }
    /**
     *
     */
    remove() {
        if (!this._element)
            return;
        const parent = this._element.parentNode;
        if (parent)
            parent.removeChild(this._element);
    }
    /**
     * get json data for post form
     */
    getDataJSON() {
        return {
            'ma_thuoc': this.ma,
            'ten_thuoc': this.ten,
            'don_vi': this.donvi,
            'so_luong': this.sl
        };
    }
    /**
     *
     * @param ma
     * @param ten
     * @param donvi
     * @param sl
     * @param thanhtien
     */
    updateAllValue(ma, ten, donvi, sl, thanhtien) {
        this.ma = ma;
        this.ten = ten;
        this.donvi = donvi;
        this.sl = sl;
        this.thanhtien = thanhtien;
        this._childElement['ma_thuoc'].textContent = ma + "";
        this._childElement['ten_thuoc'].textContent = ten + "";
        this._childElement['don_vi'].textContent = donvi + "";
        this._childElement['so_luong'].textContent = sl + "";
        this._childElement['thanhtien'].textContent = thanhtien + "";
    }
    updateValue(name, value) {
        switch (name) {
            case "ma_thuoc":
                this.ma = value;
                break;
            case "ten_thuoc":
                this.ten = value;
                break;
            case "don_vi":
                this.donvi = value;
                break;
            case "so_luong":
                this.sl = value;
                break;
            case "thanh_tien":
                this.thanhtien = value;
                break;
        }
        this._childElement[name].textContent = value;
    }
};
exports.CTHoaDon = _CTHoaDon;

},{}],4:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const DonVi_js_1 = require("./DonVi.js");
const Thuoc_js_1 = require("./Thuoc.js");
const Nsx_js_1 = require("./Nsx.js");
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
            case "DonVi":
                newObj = new DonVi_js_1.DonVi();
                break;
            case "Thuoc":
                newObj = new Thuoc_js_1.Thuoc();
                break;
            case "Nsx":
                newObj = new Nsx_js_1.Nsx();
                break;
            default: {
                throw Error("unknown typename: " + typename);
            }
        }
        this._componentList[name] = newObj;
        this._event[name] = [];
    }
    /**
     * @param {string} compoName component name
     * @param {Function} func callback function
     * @return {(err, data)=>{}}
     */
    addUpdateFunc(compoName, func = (err, data) => { }) {
        if (!this._event.hasOwnProperty(compoName)) {
            console.log("Not found " + compoName);
        }
        this._event[compoName].push(func);
    }
    /**
     * update all model and call callback event
     */
    onUpdateAll() {
        for (const compoName of Object.keys(this._componentList)) {
            const that = this;
            this._componentList[compoName].update(function (err, data) {
                for (const func of that._event[compoName]) {
                    func(err, data);
                }
            });
        }
    }
};
exports.Controller = _Controller;

},{"./DonVi.js":5,"./Nsx.js":8,"./Thuoc.js":9}],5:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Model_1 = require("./Model");
class _DonVi extends Model_1.Model {
    constructor() {
        super();
        this._database = "/public/api/getDonvi.php";
        this._fetchData = null;
    }
    update(callback) {
        let $this = this;
        $this._update(function (err, data) {
            if (err != null) {
                console.log(err);
                return;
            }
            $this._fetchData = $this._filter(data);
            callback(false, $this._fetchData);
        });
    }
    _filter(rawData) {
        let newData = rawData.slice();
        let map = {};
        for (let row of newData) {
            map[row['id']] = row;
            let heso = row['he_so_quydoi'];
            if (!heso) {
                row['textQuyDoi'] = "đơn vị cơ bản";
            }
            else {
                row['textQuyDoi'] = "";
            }
        }
        for (let row of newData) {
            let id_co_ban = row['id_quy_doi'];
            let heso = +row['he_so_quydoi'];
            if (map.hasOwnProperty(id_co_ban)) {
                while (map.hasOwnProperty(id_co_ban)) {
                    row['textQuyDoi'] += `=${heso}x[${map[id_co_ban]['ten']}]`;
                    heso *= +map[id_co_ban]['he_so_quydoi'];
                    id_co_ban = map[id_co_ban]['id_quy_doi'];
                }
            }
        }
        return newData;
    }
}
exports.DonVi = _DonVi;

},{"./Model":7}],6:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const CTHoaDon_js_1 = require("./CTHoaDon.js");
// import $ from 'jquery';
/**
 * Hóa Đơn Form
 */
const _HoaDonForm = class {
    constructor() {
        this._database = "/public/api/addHoaDon.php";
        const match = document.cookie.match(/username=(\w+)/);
        this._username = match ? match[1] : "";
        this._listCTHD = {}; //Object because data has key 'ma_thuoc'
        this._headerForm = undefined;
        this._CTHDTable = undefined;
        this._ghiChu = "";
    }
    setHeader(element) {
        this._headerForm = element;
        this._headerForm.addEventListener('submit', (e) => {
            e.preventDefault();
            if (!e.target)
                return;
            const dataArr = $(e.target).serializeArray();
            const dataObj = {};
            dataArr.forEach((val) => {
                dataObj[val.name] = val.value;
            });
            this.addCTHD(+dataObj['ma_thuoc'], dataObj['ten_thuoc'], +dataObj['so_luong'], +dataObj['don_vi'], +dataObj['cost']);
        });
    }
    setTable(element) {
        this._CTHDTable = element;
    }
    getUsername() {
        return this._username;
    }
    newHoaDon() {
        for (let el in this._listCTHD) {
            this._listCTHD[el].remove();
        }
    }
    /**
     * get total cash of 1 HoaDon
     */
    getTotalCash() {
        let sum = 0;
        for (const ma_thuoc of Array.from(Object.keys(this._listCTHD))) {
            const cthd = this._listCTHD[ma_thuoc];
            sum += cthd.totalCash;
        }
        return sum;
    }
    /**
     *
     * @param {number} ma_thuoc
     * @param {number} soluong
     * @param {number} donvi
     * @param {number} totalCash
     */
    addCTHD(ma_thuoc, ten_thuoc, soluong, donvi, totalCash) {
        if (this._listCTHD.hasOwnProperty(ma_thuoc)) {
            const newSl = this._listCTHD[ma_thuoc].sl + soluong;
            this._listCTHD.ma_thuoc.updateValue('so_luong', newSl);
        }
        else {
            const newCTHD = new CTHoaDon_js_1.CTHoaDon(ma_thuoc, ten_thuoc, donvi, soluong, totalCash * soluong);
            this._listCTHD[ma_thuoc] = newCTHD;
            const rowElement = newCTHD.getRowElement();
            if (!this._CTHDTable || !rowElement)
                return;
            this._CTHDTable.tBodies[0].insertBefore(rowElement, this._CTHDTable.tBodies[0].childNodes[0]);
        }
    }
    /**
     *
     */
    pushToDatabase(successCallback, errorCallback) {
        const hoaDonInfo = {
            username: this._username,
            time: (new Date()).getTime(),
            ghichu: this._ghiChu
        };
        const data = {
            hoa_don: hoaDonInfo,
            cthd: this._listCTHD
        };
        $.ajax(this._database, {
            method: 'POST',
            xhrFields: {
                withCredentials: true
            },
            data: "data=" + JSON.stringify(data),
            dataType: "json",
            success: (json) => {
                if (!!json.err) {
                    errorCallback(json.msg);
                    return;
                }
                successCallback();
            },
            error: (err) => {
                errorCallback(err);
            }
        });
    }
};
exports.HoaDonForm = _HoaDonForm;

},{"./CTHoaDon.js":3}],7:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _Model = class {
    constructor() {
        this._database = "";
        this._data = [];
    }
    get rawData() {
        return Object.assign({}, this._data);
    }
    /**
     * fetch data from database and do thing
     * @param { Function (err, rawData) } callback callback function
     *
     */
    _update(callback) {
        this._data = [];
        const that = this;
        fetch(this._database, {
            credentials: 'include',
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json"
            }
        }).then(res => {
            if (!res.ok) {
                callback(res, null);
                return null;
            }
            return res.json();
        }).then(json => {
            if (!json || !!json.err) {
                callback(json, null);
                return;
            }
            that._data = json.data;
            callback(null, json.data);
        }).catch(err => {
            callback(err, null);
        });
    }
};
exports.Model = _Model;

},{}],8:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Model_js_1 = require("./Model.js");
const _Nsx = class extends Model_js_1.Model {
    constructor() {
        super();
        this._database = "/public/api/getNsx.php";
    }
    update(callback) {
        let $this = this;
        $this._update(function (err, data) {
            if (err != null) {
                console.log(err);
                return;
            }
            callback(false, data);
        });
    }
};
exports.Nsx = _Nsx;

},{"./Model.js":7}],9:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Model_js_1 = require("./Model.js");
const _Thuoc = class extends Model_js_1.Model {
    constructor() {
        super();
        this._database = "/public/api/getAllInfoThuoc.php";
    }
    update(callback) {
        let $this = this;
        $this._update(function (err, data) {
            if (err != null) {
                console.log(err);
                return;
            }
            callback(false, data);
        });
    }
};
exports.Thuoc = _Thuoc;

},{"./Model.js":7}],10:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class inputPreview2 {
    constructor(target = document) {
        this._list = {};
        this._data = [];
        this._lookup = {};
        this._target = target;
        this._preview_div = null;
        this._currentPreviewData = [];
        // constructor    
        document.addEventListener("click", (e) => {
            const target = e.target;
            if (!target.classList.hasOwnProperty("preview-row"))
                this._deletePreview();
        });
    }
    /**
     * add lookup to json name
     * @param {{idEl: String}} arr { id_element : name_of_field}
     */
    addLookup(arr) {
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
            let value = input.value;
            for (const row of this._data) {
                if (!this._isLike(row[this._lookup[id]], value))
                    continue;
                this._currentPreviewData.push(row);
                let arr = [];
                for (const name in this._lookup) {
                    if (!this._lookup[name])
                        continue;
                    const field = this._lookup[name];
                    arr.push(row[field]);
                }
                let newRow = this._createFlyRow(arr);
                newRow.addEventListener("click", (e) => {
                    callback(row);
                    this._deletePreview();
                });
                input_preview.appendChild(newRow);
                document.body.appendChild(input_preview);
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
exports.default = inputPreview2;

},{}],11:[function(require,module,exports){
const BangDonVi = require('../app/BangDonVi').default;

function fetchToTable(data) {
    $("#nhap_don_vi--table-body").children().remove();
    $('.will-be-update').remove();

    for (let id of Object.keys(data)) {
        let ten = data[id]['ten'];
        let quydoiText = data[id]['quydoiText'];

        let row = $("<tr/>");
        row.append($('<td/>').text(id))
            .append($('<td/>').text(ten))
            .append($('<td/>').text(quydoiText));

        let opt = $('<option/>').val(id).text(ten).addClass('will-be-update');
        $("#nhap_don_vi--id_quy_doi").append(opt);
        $('#nhap_don_vi--table-body').append(row);
    }
}

$(document).ready(async ()=>{
    const bangDonvi = new BangDonVi();
    bangDonvi.addDatabaseURL('/public/api/getDonvi.php');
    await bangDonvi.update();
    fetchToTable(bangDonvi.table);

    const popup = new StatusPopup();
    popup.create();

    $("#nhap_don_vi--form").on('submit', (e)=>{
        e.preventDefault();

        const tenDonVi = $('#nhap_don_vi--ten_don_vi').val();
        const idQuyDoi = $('#nhap_don_vi--id_quy_doi').val();
        const heSoQuyDoi = idQuyDoi == "null" ? 0 : $("#nhap_don_vi--he_so_quydoi").val();

        $.ajax('/api/addDonvi.php', {
            method: 'post',
            xhrFields: {
                withCredentials: 'include',
            },
            data: `ten_don_vi=${tenDonVi}&id_quy_doi=${idQuyDoi}&he_so_quydoi=${heSoQuyDoi}`,
            success: function(json) {
                if (!!json.err) {
                    popup.setStatus(false, json.msg);
                    popup.show();
                    return;
                }

                parent.postMessage({
                    msg: 'update',
                }, "*");

                popup.setStatus(true, json.msg);
                popup.show();
                setTimeout(()=>{
                    popup.hide();
                }, 1000);

                $("#nhap_don_vi--form input").val("");
                $("#nhap_don_vi--id_quy_doi").val("null");
            },
            error: function(err) {
                popup.setStatus(false, err.responseText);
                popup.show();

                return;
            },
        });
    });


    // on input quy doi don vi
    $('#nhap_don_vi--id_quy_doi').on('change', function ChangeOnInputDonVi(e) {
        let val = $(this).val();
        $('#nhap_don_vi--he_so_quydoi').prop('disabled', val == 'null');
    });

    // update data request
    window.addEventListener('message', async function(e) {
        let data = e.data;
        if (data.msg == 'update') {
            await bangDonvi.update();
            fetchToTable(bangDonvi.table);
        }
    });
});

},{"../app/BangDonVi":2}],12:[function(require,module,exports){
const {HoaDonForm} = require('../app/HoaDonForm');
const {QLNT} = require('../app/App');

const hoaDonForm = new HoaDonForm();
const App = new QLNT();

function displayTime() {
    let now = new Date();
    $("#time-date").text(now.toLocaleDateString());
    $("#time-time").text(now.toLocaleTimeString());
}

function loopShowTime() {
    let id = setInterval(()=>{
        displayTime();
    }, 1000);
}

function displayUser() {
    let username = hoaDonForm.getUsername();
    $("#nhap_hoa_don--username").text(username);
}

function focusTenThuocFirst() {
    $("#nhap_hoa_don--ten-thuoc").focus();
}

function updateTongGia()
{
    let tong = 0;
    let list = document.querySelectorAll('.cthd-gia');
    for (let val of list) {
        let gia = parseInt(val.textContent.replace(/\D/, ''));
        tong += gia;
    }
    const val = tong.toLocaleString()+' VNĐ';

    $("#nhap_hoa_don--sum").attr('curVal', val);
    if (!$('#kieu-lieu')[0].checked) $('#nhap_hoa_don--sum').val(val);
}

function updateTienThoi() {
    let sum = $("#nhap_hoa_don--sum").val().replace(/[\D\s]/g, '');
    let tienkh = $("#nhap_hoa_don--tienkh-tra").val().replace(/[\D\s]/g, '');

    let tienThoi = parseInt(tienkh) - parseInt(sum);
    tienThoi = tienThoi >= 0 ? tienThoi.toLocaleString() : '~loi';

    $("#nhap_hoa_don--thoitien").val(tienThoi);
}

$(document).ready(function() {
    loopShowTime();
    displayUser();
    focusTenThuocFirst();
    const popup = new StatusPopup();
    popup.create();

    App.addSelectInput($('#nhap_hoa_don--don_vi')[0], {
        title: 'ten',
        value: 'id',
    });
    App.onUpdateAll();

    hoaDonForm.setHeader($("#nhap_hoa_don--form-nhap").get(0));
    hoaDonForm.setTable($("#table-nhap").get(0));

    $('#nhap_hoa_don--tienkh-tra').moneyInput().on('keyup', ()=>{
        updateTienThoi();
    });

    $('#nhap_hoa_don--hoadon-form').submit((e)=>{
        e.preventDefault();

        hoaDonForm.pushToDatabase(function() {
            $('#nhap_hoa_don--hoadon-form').find('input, select').val('');
            $('#nhap_hoa_don--form-nhap').find('input, select').val('');
            hoaDonForm.newHoaDon();
            console.log(hoaDonForm);
            popup.setStatus(true, "OK");
            popup.show();
        }, (err)=>{
            popup.setStatus(false, err.messageText);
            popup.show();

            console.log(err);
        });
    });

    App.addNameInputThuoc("nhap_hoa_don--ten_thuoc", {
        "nhap_hoa_don--ma_thuoc": "ma_thuoc",
        "nhap_hoa_don--ten_thuoc": "ten_thuoc",
        "nhap_hoa_don--don_vi": "ten_don_vi",
        "nhap_hoa_don--cost": "don_gia",
    }, {
        "nhap_hoa_don--ten_thuoc": "ten_thuoc",
        "nhap_hoa_don--ma_thuoc": "ma_thuoc",
        "nhap_hoa_don--don_vi": "id_don_vi",
        "nhap_hoa_don--cost": "don_gia",
    });

    $("#nhap_hoa_don--form-nhap").on('submit', (e)=>{
        e.preventDefault();
        $("#nhap_hoa_don--form-nhap").find('input, select').val('');
        updateTongGia();
    });

    $("#kieu-lieu").click(() => {
        $('#nhap_hoa_don--sum').val(8000)
    });
    $('#kieu-banle').click(() => {
        const sum = $('#sum');
        const val = sum.attr('curVal');
        sum.val(val);
    });
    // -----------------------
});

},{"../app/App":1,"../app/HoaDonForm":6}],13:[function(require,module,exports){
const InputPreview2 = require('../app/inputPreview2.js').default;

$(document).ready(function() {
    let popup = new StatusPopup();
    popup.create();

    const preview = new InputPreview2();
    preview.addLookup({
        "ten_nsx": "ten",
    });
    preview.listen("ten_nsx", (data)=>{
        $("#ten_nsx").val(data["ten"]);
    });

    function updateNSX() {
        fetch("/public/api/getNsx.php", {credentials: "include"})
        .then((res)=>{
            return res.json();
        }).then((json)=>{
            preview.addData(json.data);
        });
    }

    function updateDonvi() {
        $("#don_vi").children().remove();
        fetch("/public/api/getDonvi.php", {credentials: "include"})
        .then((res)=>{
            return res.json();
        })
        .then((json)=>{
            if (!!json.err) console.log(json.msg);
            else {
                for (let row of json.data) {
                    let name = row['ten'];
                    let id = row['id'];
                    let newOpt = $("<option/>").val(id).text(name);

                    $("#don_vi").append(newOpt);
                }
                $("#don_vi").find("option:first-child").attr("selected", "");
            }
        });
    }

    $("#don_gia").moneyInput();
    updateNSX();
    updateDonvi();


    $("#form").on('submit', (e)=>{
        e.preventDefault();

        $.ajax({
            type: "POST",
            url: "/public/api/addThuoc.php",
            data: $("#form").serialize(),
            dataType: "json",
            xhrFields: {
                withCredentials: true, // for session cookie
            },
            success: (json)=>{
                if (!!json.err) {
                    popup.setStatus(false, json.msg);
                    popup.show();
                    console.log('Post failed: ', json.msg);
                } else {
                    popup.setStatus(true, 'Thêm thành công');
                    popup.show();
                    setTimeout(function() {
                        popup.hide();
                    }, 1000);

                    console.log('success');
                    $("input").val("");

                    parent.postMessage({
                        msg: 'update',
                    }, '*');
                }
            },
            error: (err)=>{
                console.log(err);
            },
        });
    });

    // update data request
    window.addEventListener('message', function(e) {
        let data = e.data;
        if (data.msg == 'update') {
            updateNSX();
            updateDonvi();
        }
    });

    // shortcut key event
    document.addEventListener('keydown', (e)=>{
        console.log("nhap thuoc: ", e.keyCode);
        parent.postMessage({
            msg: 'shortcut_key',
            key: e.keyCode,
            shift: e.shiftKey,
        }, "*");
    });
});

},{"../app/inputPreview2.js":10}]},{},[11,12,13])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvYXBwL0FwcC5qcyIsInNyYy9hcHAvQmFuZ0RvblZpLmpzIiwic3JjL2FwcC9DVEhvYURvbi5qcyIsInNyYy9hcHAvQ29udHJvbGxlci5qcyIsInNyYy9hcHAvRG9uVmkuanMiLCJzcmMvYXBwL0hvYURvbkZvcm0uanMiLCJzcmMvYXBwL01vZGVsLmpzIiwic3JjL2FwcC9Oc3guanMiLCJzcmMvYXBwL1RodW9jLmpzIiwic3JjL2FwcC9pbnB1dFByZXZpZXcyLmpzIiwic3JjL3NjcmlwdC9uaGFwLWRvbi12aS5qcyIsInNyYy9zY3JpcHQvbmhhcC1ob2EtZG9uLmpzIiwic3JjL3NjcmlwdC9uaGFwLXRodW9jLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNyRkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM1RUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDNUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM5REE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaERBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzVHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzNDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNwQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3pMQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3hGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNySEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbigpe2Z1bmN0aW9uIHIoZSxuLHQpe2Z1bmN0aW9uIG8oaSxmKXtpZighbltpXSl7aWYoIWVbaV0pe3ZhciBjPVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmU7aWYoIWYmJmMpcmV0dXJuIGMoaSwhMCk7aWYodSlyZXR1cm4gdShpLCEwKTt2YXIgYT1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK2krXCInXCIpO3Rocm93IGEuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixhfXZhciBwPW5baV09e2V4cG9ydHM6e319O2VbaV1bMF0uY2FsbChwLmV4cG9ydHMsZnVuY3Rpb24ocil7dmFyIG49ZVtpXVsxXVtyXTtyZXR1cm4gbyhufHxyKX0scCxwLmV4cG9ydHMscixlLG4sdCl9cmV0dXJuIG5baV0uZXhwb3J0c31mb3IodmFyIHU9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZSxpPTA7aTx0Lmxlbmd0aDtpKyspbyh0W2ldKTtyZXR1cm4gb31yZXR1cm4gcn0pKCkiLCJcInVzZSBzdHJpY3RcIjtcclxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xyXG5jb25zdCBDb250cm9sbGVyX2pzXzEgPSByZXF1aXJlKFwiLi9Db250cm9sbGVyLmpzXCIpO1xyXG5jb25zdCBpbnB1dFByZXZpZXcyXzEgPSByZXF1aXJlKFwiLi9pbnB1dFByZXZpZXcyXCIpO1xyXG5jb25zdCBfUUxOVCA9IGNsYXNzIGV4dGVuZHMgQ29udHJvbGxlcl9qc18xLkNvbnRyb2xsZXIge1xyXG4gICAgY29uc3RydWN0b3IoKSB7XHJcbiAgICAgICAgc3VwZXIoKTtcclxuICAgICAgICB0aGlzLmFkZE1vZGVsKCdEb25WaScsICdEb25WaScpO1xyXG4gICAgICAgIHRoaXMuYWRkTW9kZWwoJ1RodW9jJywgJ1RodW9jJyk7XHJcbiAgICAgICAgdGhpcy5hZGRNb2RlbCgnTnN4JywgJ05zeCcpO1xyXG4gICAgfVxyXG4gICAgYWRkVGFibGUoZWxlbWVudCkge1xyXG4gICAgICAgIGxldCBuYW1lVEhzID0gZWxlbWVudC5xdWVyeVNlbGVjdG9yQWxsKFwidGhcIik7XHJcbiAgICAgICAgbGV0IGNvbXBvTmFtZSA9IGVsZW1lbnQuZ2V0QXR0cmlidXRlKCdjb21wb25lbnQnKTtcclxuICAgICAgICBjb25zdCBsb29rTmFtZSA9IEFycmF5LmZyb20obmFtZVRIcylcclxuICAgICAgICAgICAgLm1hcCgodmFsKSA9PiB2YWwuZ2V0QXR0cmlidXRlKCdmb3InKSk7XHJcbiAgICAgICAgY29uc3QgdXBkYXRlVGFibGUgPSBmdW5jdGlvbiAoZXJyLCBkYXRhKSB7XHJcbiAgICAgICAgICAgIGlmIChlcnIpXHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIGxldCBib2R5ID0gZWxlbWVudC5xdWVyeVNlbGVjdG9yKCd0Ym9keScpO1xyXG4gICAgICAgICAgICAvLyBkZWxldGUgb2xkIHJvd1xyXG4gICAgICAgICAgICBsZXQgdHJib2R5ID0gZWxlbWVudC5xdWVyeVNlbGVjdG9yQWxsKCd0Ym9keSB0cicpO1xyXG4gICAgICAgICAgICBpZiAodHJib2R5ICYmIHRyYm9keS5sZW5ndGgpIHtcclxuICAgICAgICAgICAgICAgIGZvciAobGV0IGVsIG9mIHRyYm9keSlcclxuICAgICAgICAgICAgICAgICAgICBlbC5yZW1vdmVDaGlsZCgpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIC8vIHVwZGF0YSBuZXcgcm93XHJcbiAgICAgICAgICAgIGZvciAobGV0IHJvdyBvZiBkYXRhKSB7XHJcbiAgICAgICAgICAgICAgICBsZXQgcm93RWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCd0cicpO1xyXG4gICAgICAgICAgICAgICAgZm9yIChsZXQgbmFtZSBvZiBsb29rTmFtZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGxldCBuZXdURCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3RkJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgbmV3VEQudGV4dENvbnRlbnQgPSByb3dbbmFtZV07XHJcbiAgICAgICAgICAgICAgICAgICAgcm93RWwuYXBwZW5kQ2hpbGQobmV3VEQpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgYm9keS5hcHBlbmRDaGlsZChyb3dFbCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9O1xyXG4gICAgICAgIHRoaXMuYWRkVXBkYXRlRnVuYyhjb21wb05hbWUsIHVwZGF0ZVRhYmxlKTtcclxuICAgIH1cclxuICAgIGFkZE5hbWVJbnB1dFRodW9jKGlkRWxlbWVudCwgb3B0TGlzdGVuLCBvcHRDaGFuZ2UpIHtcclxuICAgICAgICBjb25zdCBwcmV2aWV3ID0gbmV3IGlucHV0UHJldmlldzJfMS5kZWZhdWx0KCk7XHJcbiAgICAgICAgcHJldmlldy5hZGRMb29rdXAob3B0TGlzdGVuKTtcclxuICAgICAgICBwcmV2aWV3Lmxpc3RlbihpZEVsZW1lbnQsIChkYXRhKSA9PiB7XHJcbiAgICAgICAgICAgIGZvciAobGV0IGlkRWwgaW4gb3B0Q2hhbmdlKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoIW9wdENoYW5nZS5oYXNPd25Qcm9wZXJ0eShpZEVsKSlcclxuICAgICAgICAgICAgICAgICAgICBjb250aW51ZTtcclxuICAgICAgICAgICAgICAgICQoJyMnICsgaWRFbCkudmFsKGRhdGFbb3B0Q2hhbmdlW2lkRWxdXSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgICAgICBjb25zdCBvblVwZGF0ZSA9IGZ1bmN0aW9uIChlcnIsIGRhdGEpIHtcclxuICAgICAgICAgICAgaWYgKGVycikge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coZXJyKTtcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBwcmV2aWV3LmFkZERhdGEoZGF0YSk7XHJcbiAgICAgICAgfTtcclxuICAgICAgICB0aGlzLmFkZFVwZGF0ZUZ1bmMoJ1RodW9jJywgb25VcGRhdGUpO1xyXG4gICAgfVxyXG4gICAgYWRkU2VsZWN0SW5wdXQoZWxlbWVudCwgb3B0KSB7XHJcbiAgICAgICAgbGV0IHZhbHVlS2V5ID0gb3B0LnZhbHVlO1xyXG4gICAgICAgIGxldCB0aXRsZUtleSA9IG9wdC50aXRsZTtcclxuICAgICAgICBsZXQgY29tcG9OYW1lID0gZWxlbWVudC5nZXRBdHRyaWJ1dGUoJ2NvbXBvbmVudCcpO1xyXG4gICAgICAgIGNvbnN0IG9uVXBkYXRlID0gZnVuY3Rpb24gKGVyciwgZGF0YSkge1xyXG4gICAgICAgICAgICBpZiAoZXJyKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhlcnIpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIC8vIHJlbW92ZSBvbGQgb3B0aW9uc1xyXG4gICAgICAgICAgICBsZXQgb2xkT3B0ID0gZWxlbWVudC5jaGlsZE5vZGVzO1xyXG4gICAgICAgICAgICBpZiAob2xkT3B0Lmxlbmd0aClcclxuICAgICAgICAgICAgICAgIG9sZE9wdC5mb3JFYWNoKCh2YWwpID0+IHZhbC5yZW1vdmUoKSk7XHJcbiAgICAgICAgICAgIC8vIGFkZCB1cGRhdGVkIG9wdGlvblxyXG4gICAgICAgICAgICBmb3IgKGxldCByb3cgb2YgZGF0YSkge1xyXG4gICAgICAgICAgICAgICAgbGV0IHZhbHVlID0gcm93W3ZhbHVlS2V5XTtcclxuICAgICAgICAgICAgICAgIGxldCB0aXRsZSA9IHJvd1t0aXRsZUtleV07XHJcbiAgICAgICAgICAgICAgICBsZXQgbmV3T3B0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcIm9wdGlvblwiKTtcclxuICAgICAgICAgICAgICAgIG5ld09wdC52YWx1ZSA9IHZhbHVlO1xyXG4gICAgICAgICAgICAgICAgbmV3T3B0LnRleHRDb250ZW50ID0gdGl0bGU7XHJcbiAgICAgICAgICAgICAgICBlbGVtZW50LmFwcGVuZENoaWxkKG5ld09wdCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9O1xyXG4gICAgICAgIHRoaXMuYWRkVXBkYXRlRnVuYyhjb21wb05hbWUsIG9uVXBkYXRlKTtcclxuICAgIH1cclxufTtcclxuZXhwb3J0cy5RTE5UID0gX1FMTlQ7XHJcbiIsIlwidXNlIHN0cmljdFwiO1xyXG52YXIgX19hd2FpdGVyID0gKHRoaXMgJiYgdGhpcy5fX2F3YWl0ZXIpIHx8IGZ1bmN0aW9uICh0aGlzQXJnLCBfYXJndW1lbnRzLCBQLCBnZW5lcmF0b3IpIHtcclxuICAgIHJldHVybiBuZXcgKFAgfHwgKFAgPSBQcm9taXNlKSkoZnVuY3Rpb24gKHJlc29sdmUsIHJlamVjdCkge1xyXG4gICAgICAgIGZ1bmN0aW9uIGZ1bGZpbGxlZCh2YWx1ZSkgeyB0cnkgeyBzdGVwKGdlbmVyYXRvci5uZXh0KHZhbHVlKSk7IH0gY2F0Y2ggKGUpIHsgcmVqZWN0KGUpOyB9IH1cclxuICAgICAgICBmdW5jdGlvbiByZWplY3RlZCh2YWx1ZSkgeyB0cnkgeyBzdGVwKGdlbmVyYXRvcltcInRocm93XCJdKHZhbHVlKSk7IH0gY2F0Y2ggKGUpIHsgcmVqZWN0KGUpOyB9IH1cclxuICAgICAgICBmdW5jdGlvbiBzdGVwKHJlc3VsdCkgeyByZXN1bHQuZG9uZSA/IHJlc29sdmUocmVzdWx0LnZhbHVlKSA6IG5ldyBQKGZ1bmN0aW9uIChyZXNvbHZlKSB7IHJlc29sdmUocmVzdWx0LnZhbHVlKTsgfSkudGhlbihmdWxmaWxsZWQsIHJlamVjdGVkKTsgfVxyXG4gICAgICAgIHN0ZXAoKGdlbmVyYXRvciA9IGdlbmVyYXRvci5hcHBseSh0aGlzQXJnLCBfYXJndW1lbnRzIHx8IFtdKSkubmV4dCgpKTtcclxuICAgIH0pO1xyXG59O1xyXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XHJcbmNsYXNzIEJhbmdEb25WaSB7XHJcbiAgICBjb25zdHJ1Y3RvcigpIHtcclxuICAgICAgICB0aGlzLl9tYXAgPSB7fTtcclxuICAgICAgICB0aGlzLl9saXN0ID0gW107XHJcbiAgICAgICAgdGhpcy5faXNDb25uZWN0ID0gZmFsc2U7XHJcbiAgICAgICAgdGhpcy5fY29ubmVjdFN0YXR1cyA9IFwiXCI7XHJcbiAgICAgICAgdGhpcy5faXNGZXRjaGVkID0gZmFsc2U7XHJcbiAgICAgICAgdGhpcy5fZGJVUkwgPSBcIlwiO1xyXG4gICAgfVxyXG4gICAgYWRkRGF0YWJhc2VVUkwodXJsKSB7XHJcbiAgICAgICAgdGhpcy5fZGJVUkwgPSB1cmw7XHJcbiAgICB9XHJcbiAgICB1cGRhdGUodXJsKSB7XHJcbiAgICAgICAgcmV0dXJuIF9fYXdhaXRlcih0aGlzLCB2b2lkIDAsIHZvaWQgMCwgZnVuY3Rpb24qICgpIHtcclxuICAgICAgICAgICAgbGV0IHJlcyA9IHlpZWxkIGZldGNoKCcvcHVibGljL2FwaS9nZXREb252aS5waHAnLCB7IGNyZWRlbnRpYWxzOiAnaW5jbHVkZScgfSk7XHJcbiAgICAgICAgICAgIGlmICghcmVzLm9rKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9pc0Nvbm5lY3QgPSBmYWxzZTtcclxuICAgICAgICAgICAgICAgIHRoaXMuX2Nvbm5lY3RTdGF0dXMgPSByZXMuc3RhdHVzVGV4dDtcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB0aGlzLl9pc0Nvbm5lY3QgPSB0cnVlO1xyXG4gICAgICAgICAgICB0aGlzLl9jb25uZWN0U3RhdHVzID0gXCJcIjtcclxuICAgICAgICAgICAgbGV0IGpzb24gPSB5aWVsZCByZXMuanNvbigpO1xyXG4gICAgICAgICAgICBpZiAoISFqc29uLmVycikge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5faXNGZXRjaGVkID0gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9jb25uZWN0U3RhdHVzID0ganNvbi5tc2c7XHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdGhpcy5faXNGZXRjaGVkID0gdHJ1ZTtcclxuICAgICAgICAgICAgdGhpcy5fY29ubmVjdFN0YXR1cyA9IFwiT0tcIjtcclxuICAgICAgICAgICAgdGhpcy5fbGlzdCA9IGpzb24uZGF0YTtcclxuICAgICAgICAgICAgZm9yIChsZXQgcm93IG9mIGpzb24uZGF0YSkge1xyXG4gICAgICAgICAgICAgICAgbGV0IGlkID0gcm93WydpZCddO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fbWFwW2lkXSA9IHtcclxuICAgICAgICAgICAgICAgICAgICBkYXRhOiByb3csXHJcbiAgICAgICAgICAgICAgICAgICAgdGVuOiByb3dbJ3RlbiddLFxyXG4gICAgICAgICAgICAgICAgICAgIGRvbnZpX3F1eWRvaTogbnVsbCxcclxuICAgICAgICAgICAgICAgICAgICBoZXNvOiBudWxsLFxyXG4gICAgICAgICAgICAgICAgICAgIHF1eWRvaVRleHQ6IFwixJHGoW4gduG7iyBjxqEgYuG6o25cIixcclxuICAgICAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZm9yIChsZXQgaWQgb2YgT2JqZWN0LmtleXModGhpcy5fbWFwKSkge1xyXG4gICAgICAgICAgICAgICAgbGV0IGlkQ29iYW4gPSB0aGlzLl9tYXBbaWRdLmRhdGFbJ2lkX3F1eV9kb2knXTtcclxuICAgICAgICAgICAgICAgIGxldCBoZXNvID0gK3RoaXMuX21hcFtpZF0uZGF0YVsnaGVfc29fcXV5ZG9pJ107XHJcbiAgICAgICAgICAgICAgICBpZiAoaWRDb2JhbiA9PSBudWxsKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29udGludWU7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB3aGlsZSAodGhpcy5fbWFwW2lkQ29iYW5dLmRhdGFbJ2lkX3F1eV9kb2knXSAhPSBudWxsKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaGVzbyAqPSArdGhpcy5fbWFwW2lkQ29iYW5dLmRhdGFbJ2hlX3NvX3F1eWRvaSddO1xyXG4gICAgICAgICAgICAgICAgICAgIGlkQ29iYW4gPSB0aGlzLl9tYXBbaWRDb2Jhbl0uZGF0YVsnaWRfcXV5X2RvaSddO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgdGhpcy5fbWFwW2lkXVsnZG9udmlfcXV5ZG9pJ10gPSB0aGlzLl9tYXBbaWRDb2Jhbl07XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9tYXBbaWRdWydoZXNvJ10gPSBoZXNvO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fbWFwW2lkXVsncXV5ZG9pVGV4dCddID0gXCI9IFwiICsgaGVzbyArIFwieCBbXCJcclxuICAgICAgICAgICAgICAgICAgICArIHRoaXMuX21hcFtpZENvYmFuXS50ZW4gKyBcIl1cIjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG4gICAgZ2V0IHRhYmxlKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9tYXA7XHJcbiAgICB9XHJcbiAgICBnZXQgbGlzdCgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fbGlzdDtcclxuICAgIH1cclxufVxyXG5leHBvcnRzLmRlZmF1bHQgPSBCYW5nRG9uVmk7XHJcbiIsIlwidXNlIHN0cmljdFwiO1xyXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XHJcbmNvbnN0IF9DVEhvYURvbiA9IGNsYXNzIHtcclxuICAgIGNvbnN0cnVjdG9yKG1hID0gLTEsIHRlbiA9IFwiXCIsIGRvbnZpID0gLTEsIHNsID0gMCwgdGhhbmh0aWVuID0gMCkge1xyXG4gICAgICAgIHRoaXMubWEgPSBtYTtcclxuICAgICAgICB0aGlzLnRlbiA9IHRlbjtcclxuICAgICAgICB0aGlzLmRvbnZpID0gZG9udmk7XHJcbiAgICAgICAgdGhpcy5zbCA9IHNsO1xyXG4gICAgICAgIHRoaXMudGhhbmh0aWVuID0gdGhhbmh0aWVuO1xyXG4gICAgICAgIHRoaXMuX2NoaWxkRWxlbWVudCA9IHt9O1xyXG4gICAgICAgIHRoaXMuX2VsZW1lbnQgPSBudWxsO1xyXG4gICAgICAgIHRoaXMuY3JlYXRlRWxlbWVudCgpO1xyXG4gICAgICAgIHRoaXMudXBkYXRlQWxsVmFsdWUobWEsIHRlbiwgZG9udmksIHNsLCB0aGFuaHRpZW4pO1xyXG4gICAgfVxyXG4gICAgLyoqXHJcbiAgICAgKiBjcmVhdGUgcm93IGVsZW1lbnQgZm9yIHRhYmxlXHJcbiAgICAgKi9cclxuICAgIGNyZWF0ZUVsZW1lbnQoKSB7XHJcbiAgICAgICAgdGhpcy5fZWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3RyJyk7XHJcbiAgICAgICAgY29uc3QgbWFURCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3RkJyk7XHJcbiAgICAgICAgY29uc3QgdGVuVEQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCd0ZCcpO1xyXG4gICAgICAgIGNvbnN0IGRvbnZpVEQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCd0ZCcpO1xyXG4gICAgICAgIGNvbnN0IHNsVEQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCd0ZCcpO1xyXG4gICAgICAgIGNvbnN0IHRpZW5URCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3RkJyk7XHJcbiAgICAgICAgbWFURC5jbGFzc0xpc3QuYWRkKCdjdGhkLW10aHVvYycpO1xyXG4gICAgICAgIHRlblRELmNsYXNzTGlzdC5hZGQoJ2N0aGQtdHRodW9jJyk7XHJcbiAgICAgICAgZG9udmlURC5jbGFzc0xpc3QuYWRkKCdjdGhkLWRvbnZpJyk7XHJcbiAgICAgICAgc2xURC5jbGFzc0xpc3QuYWRkKCdjdGhkLXNsJyk7XHJcbiAgICAgICAgdGllblRELmNsYXNzTGlzdC5hZGQoJ2N0aGQtZ2lhJyk7XHJcbiAgICAgICAgdGhpcy5fZWxlbWVudC5hcHBlbmRDaGlsZChtYVREKTtcclxuICAgICAgICB0aGlzLl9lbGVtZW50LmFwcGVuZENoaWxkKHRlblREKTtcclxuICAgICAgICB0aGlzLl9lbGVtZW50LmFwcGVuZENoaWxkKGRvbnZpVEQpO1xyXG4gICAgICAgIHRoaXMuX2VsZW1lbnQuYXBwZW5kQ2hpbGQoc2xURCk7XHJcbiAgICAgICAgdGhpcy5fZWxlbWVudC5hcHBlbmRDaGlsZCh0aWVuVEQpO1xyXG4gICAgICAgIHRoaXMuX2NoaWxkRWxlbWVudCA9IHtcclxuICAgICAgICAgICAgXCJtYV90aHVvY1wiOiBtYVRELFxyXG4gICAgICAgICAgICBcInRlbl90aHVvY1wiOiB0ZW5URCxcclxuICAgICAgICAgICAgXCJkb25fdmlcIjogZG9udmlURCxcclxuICAgICAgICAgICAgXCJzb19sdW9uZ1wiOiBzbFRELFxyXG4gICAgICAgICAgICBcInRoYW5odGllblwiOiB0aWVuVERcclxuICAgICAgICB9O1xyXG4gICAgfVxyXG4gICAgZ2V0Um93RWxlbWVudCgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fZWxlbWVudDtcclxuICAgIH1cclxuICAgIC8qKlxyXG4gICAgICpcclxuICAgICAqL1xyXG4gICAgcmVtb3ZlKCkge1xyXG4gICAgICAgIGlmICghdGhpcy5fZWxlbWVudClcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIGNvbnN0IHBhcmVudCA9IHRoaXMuX2VsZW1lbnQucGFyZW50Tm9kZTtcclxuICAgICAgICBpZiAocGFyZW50KVxyXG4gICAgICAgICAgICBwYXJlbnQucmVtb3ZlQ2hpbGQodGhpcy5fZWxlbWVudCk7XHJcbiAgICB9XHJcbiAgICAvKipcclxuICAgICAqIGdldCBqc29uIGRhdGEgZm9yIHBvc3QgZm9ybVxyXG4gICAgICovXHJcbiAgICBnZXREYXRhSlNPTigpIHtcclxuICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICAnbWFfdGh1b2MnOiB0aGlzLm1hLFxyXG4gICAgICAgICAgICAndGVuX3RodW9jJzogdGhpcy50ZW4sXHJcbiAgICAgICAgICAgICdkb25fdmknOiB0aGlzLmRvbnZpLFxyXG4gICAgICAgICAgICAnc29fbHVvbmcnOiB0aGlzLnNsXHJcbiAgICAgICAgfTtcclxuICAgIH1cclxuICAgIC8qKlxyXG4gICAgICpcclxuICAgICAqIEBwYXJhbSBtYVxyXG4gICAgICogQHBhcmFtIHRlblxyXG4gICAgICogQHBhcmFtIGRvbnZpXHJcbiAgICAgKiBAcGFyYW0gc2xcclxuICAgICAqIEBwYXJhbSB0aGFuaHRpZW5cclxuICAgICAqL1xyXG4gICAgdXBkYXRlQWxsVmFsdWUobWEsIHRlbiwgZG9udmksIHNsLCB0aGFuaHRpZW4pIHtcclxuICAgICAgICB0aGlzLm1hID0gbWE7XHJcbiAgICAgICAgdGhpcy50ZW4gPSB0ZW47XHJcbiAgICAgICAgdGhpcy5kb252aSA9IGRvbnZpO1xyXG4gICAgICAgIHRoaXMuc2wgPSBzbDtcclxuICAgICAgICB0aGlzLnRoYW5odGllbiA9IHRoYW5odGllbjtcclxuICAgICAgICB0aGlzLl9jaGlsZEVsZW1lbnRbJ21hX3RodW9jJ10udGV4dENvbnRlbnQgPSBtYSArIFwiXCI7XHJcbiAgICAgICAgdGhpcy5fY2hpbGRFbGVtZW50Wyd0ZW5fdGh1b2MnXS50ZXh0Q29udGVudCA9IHRlbiArIFwiXCI7XHJcbiAgICAgICAgdGhpcy5fY2hpbGRFbGVtZW50Wydkb25fdmknXS50ZXh0Q29udGVudCA9IGRvbnZpICsgXCJcIjtcclxuICAgICAgICB0aGlzLl9jaGlsZEVsZW1lbnRbJ3NvX2x1b25nJ10udGV4dENvbnRlbnQgPSBzbCArIFwiXCI7XHJcbiAgICAgICAgdGhpcy5fY2hpbGRFbGVtZW50Wyd0aGFuaHRpZW4nXS50ZXh0Q29udGVudCA9IHRoYW5odGllbiArIFwiXCI7XHJcbiAgICB9XHJcbiAgICB1cGRhdGVWYWx1ZShuYW1lLCB2YWx1ZSkge1xyXG4gICAgICAgIHN3aXRjaCAobmFtZSkge1xyXG4gICAgICAgICAgICBjYXNlIFwibWFfdGh1b2NcIjpcclxuICAgICAgICAgICAgICAgIHRoaXMubWEgPSB2YWx1ZTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlIFwidGVuX3RodW9jXCI6XHJcbiAgICAgICAgICAgICAgICB0aGlzLnRlbiA9IHZhbHVlO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgXCJkb25fdmlcIjpcclxuICAgICAgICAgICAgICAgIHRoaXMuZG9udmkgPSB2YWx1ZTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlIFwic29fbHVvbmdcIjpcclxuICAgICAgICAgICAgICAgIHRoaXMuc2wgPSB2YWx1ZTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlIFwidGhhbmhfdGllblwiOlxyXG4gICAgICAgICAgICAgICAgdGhpcy50aGFuaHRpZW4gPSB2YWx1ZTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLl9jaGlsZEVsZW1lbnRbbmFtZV0udGV4dENvbnRlbnQgPSB2YWx1ZTtcclxuICAgIH1cclxufTtcclxuZXhwb3J0cy5DVEhvYURvbiA9IF9DVEhvYURvbjtcclxuIiwiXCJ1c2Ugc3RyaWN0XCI7XHJcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcclxuY29uc3QgRG9uVmlfanNfMSA9IHJlcXVpcmUoXCIuL0RvblZpLmpzXCIpO1xyXG5jb25zdCBUaHVvY19qc18xID0gcmVxdWlyZShcIi4vVGh1b2MuanNcIik7XHJcbmNvbnN0IE5zeF9qc18xID0gcmVxdWlyZShcIi4vTnN4LmpzXCIpO1xyXG5jb25zdCBfQ29udHJvbGxlciA9IGNsYXNzIHtcclxuICAgIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgICAgIHRoaXMuX2NvbXBvbmVudExpc3QgPSB7fTtcclxuICAgICAgICB0aGlzLl9ldmVudCA9IHt9O1xyXG4gICAgfVxyXG4gICAgLyoqXHJcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gbmFtZSBuYW1lIG9mIG1vZGVsXHJcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gdHlwZW5hbWUgdHlwZSBvZiBtb2RlbCAoRG9uVmkgfCBUaHVvYyB8IE5zeClcclxuICAgICAqL1xyXG4gICAgYWRkTW9kZWwobmFtZSwgdHlwZW5hbWUpIHtcclxuICAgICAgICBpZiAodGhpcy5fY29tcG9uZW50TGlzdC5oYXNPd25Qcm9wZXJ0eShuYW1lKSkge1xyXG4gICAgICAgICAgICB0aHJvdyBFcnJvcihuYW1lICsgXCIgaXMgZXhpc3RpbmcgbW9kZWxcIik7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGxldCBuZXdPYmogPSBudWxsO1xyXG4gICAgICAgIHN3aXRjaCAodHlwZW5hbWUpIHtcclxuICAgICAgICAgICAgY2FzZSBcIkRvblZpXCI6XHJcbiAgICAgICAgICAgICAgICBuZXdPYmogPSBuZXcgRG9uVmlfanNfMS5Eb25WaSgpO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgXCJUaHVvY1wiOlxyXG4gICAgICAgICAgICAgICAgbmV3T2JqID0gbmV3IFRodW9jX2pzXzEuVGh1b2MoKTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlIFwiTnN4XCI6XHJcbiAgICAgICAgICAgICAgICBuZXdPYmogPSBuZXcgTnN4X2pzXzEuTnN4KCk7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgZGVmYXVsdDoge1xyXG4gICAgICAgICAgICAgICAgdGhyb3cgRXJyb3IoXCJ1bmtub3duIHR5cGVuYW1lOiBcIiArIHR5cGVuYW1lKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLl9jb21wb25lbnRMaXN0W25hbWVdID0gbmV3T2JqO1xyXG4gICAgICAgIHRoaXMuX2V2ZW50W25hbWVdID0gW107XHJcbiAgICB9XHJcbiAgICAvKipcclxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBjb21wb05hbWUgY29tcG9uZW50IG5hbWVcclxuICAgICAqIEBwYXJhbSB7RnVuY3Rpb259IGZ1bmMgY2FsbGJhY2sgZnVuY3Rpb25cclxuICAgICAqIEByZXR1cm4geyhlcnIsIGRhdGEpPT57fX1cclxuICAgICAqL1xyXG4gICAgYWRkVXBkYXRlRnVuYyhjb21wb05hbWUsIGZ1bmMgPSAoZXJyLCBkYXRhKSA9PiB7IH0pIHtcclxuICAgICAgICBpZiAoIXRoaXMuX2V2ZW50Lmhhc093blByb3BlcnR5KGNvbXBvTmFtZSkpIHtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coXCJOb3QgZm91bmQgXCIgKyBjb21wb05hbWUpO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLl9ldmVudFtjb21wb05hbWVdLnB1c2goZnVuYyk7XHJcbiAgICB9XHJcbiAgICAvKipcclxuICAgICAqIHVwZGF0ZSBhbGwgbW9kZWwgYW5kIGNhbGwgY2FsbGJhY2sgZXZlbnRcclxuICAgICAqL1xyXG4gICAgb25VcGRhdGVBbGwoKSB7XHJcbiAgICAgICAgZm9yIChjb25zdCBjb21wb05hbWUgb2YgT2JqZWN0LmtleXModGhpcy5fY29tcG9uZW50TGlzdCkpIHtcclxuICAgICAgICAgICAgY29uc3QgdGhhdCA9IHRoaXM7XHJcbiAgICAgICAgICAgIHRoaXMuX2NvbXBvbmVudExpc3RbY29tcG9OYW1lXS51cGRhdGUoZnVuY3Rpb24gKGVyciwgZGF0YSkge1xyXG4gICAgICAgICAgICAgICAgZm9yIChjb25zdCBmdW5jIG9mIHRoYXQuX2V2ZW50W2NvbXBvTmFtZV0pIHtcclxuICAgICAgICAgICAgICAgICAgICBmdW5jKGVyciwgZGF0YSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufTtcclxuZXhwb3J0cy5Db250cm9sbGVyID0gX0NvbnRyb2xsZXI7XHJcbiIsIlwidXNlIHN0cmljdFwiO1xyXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XHJcbmNvbnN0IE1vZGVsXzEgPSByZXF1aXJlKFwiLi9Nb2RlbFwiKTtcclxuY2xhc3MgX0RvblZpIGV4dGVuZHMgTW9kZWxfMS5Nb2RlbCB7XHJcbiAgICBjb25zdHJ1Y3RvcigpIHtcclxuICAgICAgICBzdXBlcigpO1xyXG4gICAgICAgIHRoaXMuX2RhdGFiYXNlID0gXCIvcHVibGljL2FwaS9nZXREb252aS5waHBcIjtcclxuICAgICAgICB0aGlzLl9mZXRjaERhdGEgPSBudWxsO1xyXG4gICAgfVxyXG4gICAgdXBkYXRlKGNhbGxiYWNrKSB7XHJcbiAgICAgICAgbGV0ICR0aGlzID0gdGhpcztcclxuICAgICAgICAkdGhpcy5fdXBkYXRlKGZ1bmN0aW9uIChlcnIsIGRhdGEpIHtcclxuICAgICAgICAgICAgaWYgKGVyciAhPSBudWxsKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhlcnIpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICR0aGlzLl9mZXRjaERhdGEgPSAkdGhpcy5fZmlsdGVyKGRhdGEpO1xyXG4gICAgICAgICAgICBjYWxsYmFjayhmYWxzZSwgJHRoaXMuX2ZldGNoRGF0YSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcbiAgICBfZmlsdGVyKHJhd0RhdGEpIHtcclxuICAgICAgICBsZXQgbmV3RGF0YSA9IHJhd0RhdGEuc2xpY2UoKTtcclxuICAgICAgICBsZXQgbWFwID0ge307XHJcbiAgICAgICAgZm9yIChsZXQgcm93IG9mIG5ld0RhdGEpIHtcclxuICAgICAgICAgICAgbWFwW3Jvd1snaWQnXV0gPSByb3c7XHJcbiAgICAgICAgICAgIGxldCBoZXNvID0gcm93WydoZV9zb19xdXlkb2knXTtcclxuICAgICAgICAgICAgaWYgKCFoZXNvKSB7XHJcbiAgICAgICAgICAgICAgICByb3dbJ3RleHRRdXlEb2knXSA9IFwixJHGoW4gduG7iyBjxqEgYuG6o25cIjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHJvd1sndGV4dFF1eURvaSddID0gXCJcIjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBmb3IgKGxldCByb3cgb2YgbmV3RGF0YSkge1xyXG4gICAgICAgICAgICBsZXQgaWRfY29fYmFuID0gcm93WydpZF9xdXlfZG9pJ107XHJcbiAgICAgICAgICAgIGxldCBoZXNvID0gK3Jvd1snaGVfc29fcXV5ZG9pJ107XHJcbiAgICAgICAgICAgIGlmIChtYXAuaGFzT3duUHJvcGVydHkoaWRfY29fYmFuKSkge1xyXG4gICAgICAgICAgICAgICAgd2hpbGUgKG1hcC5oYXNPd25Qcm9wZXJ0eShpZF9jb19iYW4pKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcm93Wyd0ZXh0UXV5RG9pJ10gKz0gYD0ke2hlc299eFske21hcFtpZF9jb19iYW5dWyd0ZW4nXX1dYDtcclxuICAgICAgICAgICAgICAgICAgICBoZXNvICo9ICttYXBbaWRfY29fYmFuXVsnaGVfc29fcXV5ZG9pJ107XHJcbiAgICAgICAgICAgICAgICAgICAgaWRfY29fYmFuID0gbWFwW2lkX2NvX2Jhbl1bJ2lkX3F1eV9kb2knXTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gbmV3RGF0YTtcclxuICAgIH1cclxufVxyXG5leHBvcnRzLkRvblZpID0gX0RvblZpO1xyXG4iLCJcInVzZSBzdHJpY3RcIjtcclxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xyXG5jb25zdCBDVEhvYURvbl9qc18xID0gcmVxdWlyZShcIi4vQ1RIb2FEb24uanNcIik7XHJcbi8vIGltcG9ydCAkIGZyb20gJ2pxdWVyeSc7XHJcbi8qKlxyXG4gKiBIw7NhIMSQxqFuIEZvcm1cclxuICovXHJcbmNvbnN0IF9Ib2FEb25Gb3JtID0gY2xhc3Mge1xyXG4gICAgY29uc3RydWN0b3IoKSB7XHJcbiAgICAgICAgdGhpcy5fZGF0YWJhc2UgPSBcIi9wdWJsaWMvYXBpL2FkZEhvYURvbi5waHBcIjtcclxuICAgICAgICBjb25zdCBtYXRjaCA9IGRvY3VtZW50LmNvb2tpZS5tYXRjaCgvdXNlcm5hbWU9KFxcdyspLyk7XHJcbiAgICAgICAgdGhpcy5fdXNlcm5hbWUgPSBtYXRjaCA/IG1hdGNoWzFdIDogXCJcIjtcclxuICAgICAgICB0aGlzLl9saXN0Q1RIRCA9IHt9OyAvL09iamVjdCBiZWNhdXNlIGRhdGEgaGFzIGtleSAnbWFfdGh1b2MnXHJcbiAgICAgICAgdGhpcy5faGVhZGVyRm9ybSA9IHVuZGVmaW5lZDtcclxuICAgICAgICB0aGlzLl9DVEhEVGFibGUgPSB1bmRlZmluZWQ7XHJcbiAgICAgICAgdGhpcy5fZ2hpQ2h1ID0gXCJcIjtcclxuICAgIH1cclxuICAgIHNldEhlYWRlcihlbGVtZW50KSB7XHJcbiAgICAgICAgdGhpcy5faGVhZGVyRm9ybSA9IGVsZW1lbnQ7XHJcbiAgICAgICAgdGhpcy5faGVhZGVyRm9ybS5hZGRFdmVudExpc3RlbmVyKCdzdWJtaXQnLCAoZSkgPT4ge1xyXG4gICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgICAgICAgIGlmICghZS50YXJnZXQpXHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIGNvbnN0IGRhdGFBcnIgPSAkKGUudGFyZ2V0KS5zZXJpYWxpemVBcnJheSgpO1xyXG4gICAgICAgICAgICBjb25zdCBkYXRhT2JqID0ge307XHJcbiAgICAgICAgICAgIGRhdGFBcnIuZm9yRWFjaCgodmFsKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBkYXRhT2JqW3ZhbC5uYW1lXSA9IHZhbC52YWx1ZTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIHRoaXMuYWRkQ1RIRCgrZGF0YU9ialsnbWFfdGh1b2MnXSwgZGF0YU9ialsndGVuX3RodW9jJ10sICtkYXRhT2JqWydzb19sdW9uZyddLCArZGF0YU9ialsnZG9uX3ZpJ10sICtkYXRhT2JqWydjb3N0J10pO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG4gICAgc2V0VGFibGUoZWxlbWVudCkge1xyXG4gICAgICAgIHRoaXMuX0NUSERUYWJsZSA9IGVsZW1lbnQ7XHJcbiAgICB9XHJcbiAgICBnZXRVc2VybmFtZSgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fdXNlcm5hbWU7XHJcbiAgICB9XHJcbiAgICBuZXdIb2FEb24oKSB7XHJcbiAgICAgICAgZm9yIChsZXQgZWwgaW4gdGhpcy5fbGlzdENUSEQpIHtcclxuICAgICAgICAgICAgdGhpcy5fbGlzdENUSERbZWxdLnJlbW92ZSgpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIC8qKlxyXG4gICAgICogZ2V0IHRvdGFsIGNhc2ggb2YgMSBIb2FEb25cclxuICAgICAqL1xyXG4gICAgZ2V0VG90YWxDYXNoKCkge1xyXG4gICAgICAgIGxldCBzdW0gPSAwO1xyXG4gICAgICAgIGZvciAoY29uc3QgbWFfdGh1b2Mgb2YgQXJyYXkuZnJvbShPYmplY3Qua2V5cyh0aGlzLl9saXN0Q1RIRCkpKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IGN0aGQgPSB0aGlzLl9saXN0Q1RIRFttYV90aHVvY107XHJcbiAgICAgICAgICAgIHN1bSArPSBjdGhkLnRvdGFsQ2FzaDtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHN1bTtcclxuICAgIH1cclxuICAgIC8qKlxyXG4gICAgICpcclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBtYV90aHVvY1xyXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IHNvbHVvbmdcclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBkb252aVxyXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IHRvdGFsQ2FzaFxyXG4gICAgICovXHJcbiAgICBhZGRDVEhEKG1hX3RodW9jLCB0ZW5fdGh1b2MsIHNvbHVvbmcsIGRvbnZpLCB0b3RhbENhc2gpIHtcclxuICAgICAgICBpZiAodGhpcy5fbGlzdENUSEQuaGFzT3duUHJvcGVydHkobWFfdGh1b2MpKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IG5ld1NsID0gdGhpcy5fbGlzdENUSERbbWFfdGh1b2NdLnNsICsgc29sdW9uZztcclxuICAgICAgICAgICAgdGhpcy5fbGlzdENUSEQubWFfdGh1b2MudXBkYXRlVmFsdWUoJ3NvX2x1b25nJywgbmV3U2wpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgY29uc3QgbmV3Q1RIRCA9IG5ldyBDVEhvYURvbl9qc18xLkNUSG9hRG9uKG1hX3RodW9jLCB0ZW5fdGh1b2MsIGRvbnZpLCBzb2x1b25nLCB0b3RhbENhc2ggKiBzb2x1b25nKTtcclxuICAgICAgICAgICAgdGhpcy5fbGlzdENUSERbbWFfdGh1b2NdID0gbmV3Q1RIRDtcclxuICAgICAgICAgICAgY29uc3Qgcm93RWxlbWVudCA9IG5ld0NUSEQuZ2V0Um93RWxlbWVudCgpO1xyXG4gICAgICAgICAgICBpZiAoIXRoaXMuX0NUSERUYWJsZSB8fCAhcm93RWxlbWVudClcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgdGhpcy5fQ1RIRFRhYmxlLnRCb2RpZXNbMF0uaW5zZXJ0QmVmb3JlKHJvd0VsZW1lbnQsIHRoaXMuX0NUSERUYWJsZS50Qm9kaWVzWzBdLmNoaWxkTm9kZXNbMF0pO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIC8qKlxyXG4gICAgICpcclxuICAgICAqL1xyXG4gICAgcHVzaFRvRGF0YWJhc2Uoc3VjY2Vzc0NhbGxiYWNrLCBlcnJvckNhbGxiYWNrKSB7XHJcbiAgICAgICAgY29uc3QgaG9hRG9uSW5mbyA9IHtcclxuICAgICAgICAgICAgdXNlcm5hbWU6IHRoaXMuX3VzZXJuYW1lLFxyXG4gICAgICAgICAgICB0aW1lOiAobmV3IERhdGUoKSkuZ2V0VGltZSgpLFxyXG4gICAgICAgICAgICBnaGljaHU6IHRoaXMuX2doaUNodVxyXG4gICAgICAgIH07XHJcbiAgICAgICAgY29uc3QgZGF0YSA9IHtcclxuICAgICAgICAgICAgaG9hX2RvbjogaG9hRG9uSW5mbyxcclxuICAgICAgICAgICAgY3RoZDogdGhpcy5fbGlzdENUSERcclxuICAgICAgICB9O1xyXG4gICAgICAgICQuYWpheCh0aGlzLl9kYXRhYmFzZSwge1xyXG4gICAgICAgICAgICBtZXRob2Q6ICdQT1NUJyxcclxuICAgICAgICAgICAgeGhyRmllbGRzOiB7XHJcbiAgICAgICAgICAgICAgICB3aXRoQ3JlZGVudGlhbHM6IHRydWVcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgZGF0YTogXCJkYXRhPVwiICsgSlNPTi5zdHJpbmdpZnkoZGF0YSksXHJcbiAgICAgICAgICAgIGRhdGFUeXBlOiBcImpzb25cIixcclxuICAgICAgICAgICAgc3VjY2VzczogKGpzb24pID0+IHtcclxuICAgICAgICAgICAgICAgIGlmICghIWpzb24uZXJyKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgZXJyb3JDYWxsYmFjayhqc29uLm1zZyk7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgc3VjY2Vzc0NhbGxiYWNrKCk7XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIGVycm9yOiAoZXJyKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBlcnJvckNhbGxiYWNrKGVycik7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgIH1cclxufTtcclxuZXhwb3J0cy5Ib2FEb25Gb3JtID0gX0hvYURvbkZvcm07XHJcbiIsIlwidXNlIHN0cmljdFwiO1xyXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XHJcbmNvbnN0IF9Nb2RlbCA9IGNsYXNzIHtcclxuICAgIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgICAgIHRoaXMuX2RhdGFiYXNlID0gXCJcIjtcclxuICAgICAgICB0aGlzLl9kYXRhID0gW107XHJcbiAgICB9XHJcbiAgICBnZXQgcmF3RGF0YSgpIHtcclxuICAgICAgICByZXR1cm4gT2JqZWN0LmFzc2lnbih7fSwgdGhpcy5fZGF0YSk7XHJcbiAgICB9XHJcbiAgICAvKipcclxuICAgICAqIGZldGNoIGRhdGEgZnJvbSBkYXRhYmFzZSBhbmQgZG8gdGhpbmdcclxuICAgICAqIEBwYXJhbSB7IEZ1bmN0aW9uIChlcnIsIHJhd0RhdGEpIH0gY2FsbGJhY2sgY2FsbGJhY2sgZnVuY3Rpb25cclxuICAgICAqXHJcbiAgICAgKi9cclxuICAgIF91cGRhdGUoY2FsbGJhY2spIHtcclxuICAgICAgICB0aGlzLl9kYXRhID0gW107XHJcbiAgICAgICAgY29uc3QgdGhhdCA9IHRoaXM7XHJcbiAgICAgICAgZmV0Y2godGhpcy5fZGF0YWJhc2UsIHtcclxuICAgICAgICAgICAgY3JlZGVudGlhbHM6ICdpbmNsdWRlJyxcclxuICAgICAgICAgICAgaGVhZGVyczoge1xyXG4gICAgICAgICAgICAgICAgXCJBY2NlcHRcIjogXCJhcHBsaWNhdGlvbi9qc29uXCIsXHJcbiAgICAgICAgICAgICAgICBcIkNvbnRlbnQtVHlwZVwiOiBcImFwcGxpY2F0aW9uL2pzb25cIlxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSkudGhlbihyZXMgPT4ge1xyXG4gICAgICAgICAgICBpZiAoIXJlcy5vaykge1xyXG4gICAgICAgICAgICAgICAgY2FsbGJhY2socmVzLCBudWxsKTtcclxuICAgICAgICAgICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiByZXMuanNvbigpO1xyXG4gICAgICAgIH0pLnRoZW4oanNvbiA9PiB7XHJcbiAgICAgICAgICAgIGlmICghanNvbiB8fCAhIWpzb24uZXJyKSB7XHJcbiAgICAgICAgICAgICAgICBjYWxsYmFjayhqc29uLCBudWxsKTtcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB0aGF0Ll9kYXRhID0ganNvbi5kYXRhO1xyXG4gICAgICAgICAgICBjYWxsYmFjayhudWxsLCBqc29uLmRhdGEpO1xyXG4gICAgICAgIH0pLmNhdGNoKGVyciA9PiB7XHJcbiAgICAgICAgICAgIGNhbGxiYWNrKGVyciwgbnVsbCk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcbn07XHJcbmV4cG9ydHMuTW9kZWwgPSBfTW9kZWw7XHJcbiIsIlwidXNlIHN0cmljdFwiO1xyXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XHJcbmNvbnN0IE1vZGVsX2pzXzEgPSByZXF1aXJlKFwiLi9Nb2RlbC5qc1wiKTtcclxuY29uc3QgX05zeCA9IGNsYXNzIGV4dGVuZHMgTW9kZWxfanNfMS5Nb2RlbCB7XHJcbiAgICBjb25zdHJ1Y3RvcigpIHtcclxuICAgICAgICBzdXBlcigpO1xyXG4gICAgICAgIHRoaXMuX2RhdGFiYXNlID0gXCIvcHVibGljL2FwaS9nZXROc3gucGhwXCI7XHJcbiAgICB9XHJcbiAgICB1cGRhdGUoY2FsbGJhY2spIHtcclxuICAgICAgICBsZXQgJHRoaXMgPSB0aGlzO1xyXG4gICAgICAgICR0aGlzLl91cGRhdGUoZnVuY3Rpb24gKGVyciwgZGF0YSkge1xyXG4gICAgICAgICAgICBpZiAoZXJyICE9IG51bGwpIHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGVycik7XHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgY2FsbGJhY2soZmFsc2UsIGRhdGEpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG59O1xyXG5leHBvcnRzLk5zeCA9IF9Oc3g7XHJcbiIsIlwidXNlIHN0cmljdFwiO1xyXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XHJcbmNvbnN0IE1vZGVsX2pzXzEgPSByZXF1aXJlKFwiLi9Nb2RlbC5qc1wiKTtcclxuY29uc3QgX1RodW9jID0gY2xhc3MgZXh0ZW5kcyBNb2RlbF9qc18xLk1vZGVsIHtcclxuICAgIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgICAgIHN1cGVyKCk7XHJcbiAgICAgICAgdGhpcy5fZGF0YWJhc2UgPSBcIi9wdWJsaWMvYXBpL2dldEFsbEluZm9UaHVvYy5waHBcIjtcclxuICAgIH1cclxuICAgIHVwZGF0ZShjYWxsYmFjaykge1xyXG4gICAgICAgIGxldCAkdGhpcyA9IHRoaXM7XHJcbiAgICAgICAgJHRoaXMuX3VwZGF0ZShmdW5jdGlvbiAoZXJyLCBkYXRhKSB7XHJcbiAgICAgICAgICAgIGlmIChlcnIgIT0gbnVsbCkge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coZXJyKTtcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBjYWxsYmFjayhmYWxzZSwgZGF0YSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcbn07XHJcbmV4cG9ydHMuVGh1b2MgPSBfVGh1b2M7XHJcbiIsIlwidXNlIHN0cmljdFwiO1xyXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XHJcbmNsYXNzIGlucHV0UHJldmlldzIge1xyXG4gICAgY29uc3RydWN0b3IodGFyZ2V0ID0gZG9jdW1lbnQpIHtcclxuICAgICAgICB0aGlzLl9saXN0ID0ge307XHJcbiAgICAgICAgdGhpcy5fZGF0YSA9IFtdO1xyXG4gICAgICAgIHRoaXMuX2xvb2t1cCA9IHt9O1xyXG4gICAgICAgIHRoaXMuX3RhcmdldCA9IHRhcmdldDtcclxuICAgICAgICB0aGlzLl9wcmV2aWV3X2RpdiA9IG51bGw7XHJcbiAgICAgICAgdGhpcy5fY3VycmVudFByZXZpZXdEYXRhID0gW107XHJcbiAgICAgICAgLy8gY29uc3RydWN0b3IgICAgXHJcbiAgICAgICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIChlKSA9PiB7XHJcbiAgICAgICAgICAgIGNvbnN0IHRhcmdldCA9IGUudGFyZ2V0O1xyXG4gICAgICAgICAgICBpZiAoIXRhcmdldC5jbGFzc0xpc3QuaGFzT3duUHJvcGVydHkoXCJwcmV2aWV3LXJvd1wiKSlcclxuICAgICAgICAgICAgICAgIHRoaXMuX2RlbGV0ZVByZXZpZXcoKTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuICAgIC8qKlxyXG4gICAgICogYWRkIGxvb2t1cCB0byBqc29uIG5hbWVcclxuICAgICAqIEBwYXJhbSB7e2lkRWw6IFN0cmluZ319IGFyciB7IGlkX2VsZW1lbnQgOiBuYW1lX29mX2ZpZWxkfVxyXG4gICAgICovXHJcbiAgICBhZGRMb29rdXAoYXJyKSB7XHJcbiAgICAgICAgaWYgKHR5cGVvZiBhcnIgIT0gXCJvYmplY3RcIikge1xyXG4gICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhPYmplY3QuY2FsbChhcnIpKTtcclxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwicGFyYW1ldGVyIG11c3QgYmUganNvbiBvYmpcIik7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcbiAgICAgICAgZm9yIChsZXQga2V5IG9mIE9iamVjdC5rZXlzKGFycikpIHtcclxuICAgICAgICAgICAgdGhpcy5fbG9va3VwW2tleV0gPSBhcnJba2V5XTtcclxuICAgICAgICAgICAgbGV0IGVsID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoa2V5KTtcclxuICAgICAgICAgICAgaWYgKCFlbCkge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coRXJyb3IoYENhbm5vdCBmaW5kICMke2tleX0gZWxlbWVudGApKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuX2xpc3Rba2V5XSA9IGVsO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgO1xyXG4gICAgLyoqXHJcbiAgICAgKiBhZGQgaG9zdCB0byBmZXRjaCBkYXRhYmFzZVxyXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IHVybCBhc2RcclxuICAgICAqL1xyXG4gICAgYWRkRGF0YShkYXRhKSB7XHJcbiAgICAgICAgaWYgKHR5cGVvZiAoZGF0YSkgIT0gXCJvYmplY3RcIikge1xyXG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJwYXJhbWV0ZXIgbXVzdCBiZSBqc29uXCIpO1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMuX2RhdGEgPSBkYXRhO1xyXG4gICAgfVxyXG4gICAgO1xyXG4gICAgbGlzdGVuKGlkLCBjYWxsYmFjaykge1xyXG4gICAgICAgIGxldCBlbGVtZW50ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoaWQpO1xyXG4gICAgICAgIGVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcImtleWRvd25cIiwgKGUpID0+IHtcclxuICAgICAgICAgICAgbGV0IGNvZGUgPSBlLmtleUNvZGU7XHJcbiAgICAgICAgICAgIGlmIChjb2RlID09IDI3KSAvL2VzY1xyXG4gICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fZGVsZXRlUHJldmlldygpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2UgaWYgKGNvZGUgPT0gMzggfHwgY29kZSA9PSA0MCkgLy91cCAtZG93blxyXG4gICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAgICAgICAgICAgbGV0IGN1ciA9ICt0aGlzLl9wcmV2aWV3X2Rpdi5nZXRBdHRyaWJ1dGUoJ2N1cicpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fcHJldmlld19kaXYuY2hpbGRyZW5bY3VyXVxyXG4gICAgICAgICAgICAgICAgICAgIC5jbGFzc0xpc3QucmVtb3ZlKFwicHJldmlldy1yb3ctYWN0aXZlXCIpO1xyXG4gICAgICAgICAgICAgICAgaWYgKGNvZGUgPT0gMzgpXHJcbiAgICAgICAgICAgICAgICAgICAgLS1jdXI7XHJcbiAgICAgICAgICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgICAgICAgICAgKytjdXI7XHJcbiAgICAgICAgICAgICAgICBsZXQgbGVuID0gdGhpcy5fcHJldmlld19kaXYuY2hpbGRyZW4ubGVuZ3RoO1xyXG4gICAgICAgICAgICAgICAgaWYgKGN1ciA8IDApXHJcbiAgICAgICAgICAgICAgICAgICAgY3VyID0gbGVuIC0gMTtcclxuICAgICAgICAgICAgICAgIGlmIChjdXIgPiBsZW4gLSAxKVxyXG4gICAgICAgICAgICAgICAgICAgIGN1ciA9IDA7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9wcmV2aWV3X2Rpdi5jaGlsZHJlbltjdXJdXHJcbiAgICAgICAgICAgICAgICAgICAgLmNsYXNzTGlzdC5hZGQoXCJwcmV2aWV3LXJvdy1hY3RpdmVcIik7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9wcmV2aWV3X2Rpdi5zZXRBdHRyaWJ1dGUoXCJjdXJcIiwgY3VyICsgXCJcIik7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSBpZiAoY29kZSA9PSAxMykge1xyXG4gICAgICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAgICAgICAgICAgbGV0IGN1ciA9ICt0aGlzLl9wcmV2aWV3X2Rpdi5nZXRBdHRyaWJ1dGUoXCJjdXJcIik7XHJcbiAgICAgICAgICAgICAgICBjYWxsYmFjayh0aGlzLl9jdXJyZW50UHJldmlld0RhdGFbY3VyXSk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9kZWxldGVQcmV2aWV3KCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmZldGNoT24oaWQsIGNhbGxiYWNrKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG4gICAgLyoqXHJcbiAgICAgKlxyXG4gICAgICogZmV0Y2ggZGF0YWJhc2UgYW5kIHNob3cgaW4gaW5wdXRcclxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBpZCBpZCBvZiBodG1sIGVsZW1lbnQgaW5wdXQgbmVlZCB0byBmZXRjaCBieSB2YWx1ZVxyXG4gICAgICovXHJcbiAgICBmZXRjaE9uKGlkLCBjYWxsYmFjaykge1xyXG4gICAgICAgIHRoaXMuX2RlbGV0ZVByZXZpZXcoKTtcclxuICAgICAgICB0aGlzLl9jdXJyZW50UHJldmlld0RhdGEubGVuZ3RoID0gMDsgLy9jbGVhciBjdXJyZW50IHByZXZpZXcgc3VnZ2VzdCBuYW1lXHJcbiAgICAgICAgaWYgKHRoaXMuX2xpc3QuaGFzT3duUHJvcGVydHkoaWQpKSB7XHJcbiAgICAgICAgICAgIGxldCBpbnB1dCA9IHRoaXMuX2xpc3RbaWRdO1xyXG4gICAgICAgICAgICBpbnB1dC5zZXRBdHRyaWJ1dGUoJ2F1dG9jb21wbGV0ZScsICdvZmYnKTtcclxuICAgICAgICAgICAgbGV0IGlucHV0X3ByZXZpZXcgPSB0aGlzLl9jcmVhdGVGbHlXcmFwKGlucHV0KTtcclxuICAgICAgICAgICAgdGhpcy5fcHJldmlld19kaXYgPSBpbnB1dF9wcmV2aWV3O1xyXG4gICAgICAgICAgICBsZXQgdmFsdWUgPSBpbnB1dC52YWx1ZTtcclxuICAgICAgICAgICAgZm9yIChjb25zdCByb3cgb2YgdGhpcy5fZGF0YSkge1xyXG4gICAgICAgICAgICAgICAgaWYgKCF0aGlzLl9pc0xpa2Uocm93W3RoaXMuX2xvb2t1cFtpZF1dLCB2YWx1ZSkpXHJcbiAgICAgICAgICAgICAgICAgICAgY29udGludWU7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9jdXJyZW50UHJldmlld0RhdGEucHVzaChyb3cpO1xyXG4gICAgICAgICAgICAgICAgbGV0IGFyciA9IFtdO1xyXG4gICAgICAgICAgICAgICAgZm9yIChjb25zdCBuYW1lIGluIHRoaXMuX2xvb2t1cCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmICghdGhpcy5fbG9va3VwW25hbWVdKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb250aW51ZTtcclxuICAgICAgICAgICAgICAgICAgICBjb25zdCBmaWVsZCA9IHRoaXMuX2xvb2t1cFtuYW1lXTtcclxuICAgICAgICAgICAgICAgICAgICBhcnIucHVzaChyb3dbZmllbGRdKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGxldCBuZXdSb3cgPSB0aGlzLl9jcmVhdGVGbHlSb3coYXJyKTtcclxuICAgICAgICAgICAgICAgIG5ld1Jvdy5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKGUpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICBjYWxsYmFjayhyb3cpO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2RlbGV0ZVByZXZpZXcoKTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgaW5wdXRfcHJldmlldy5hcHBlbmRDaGlsZChuZXdSb3cpO1xyXG4gICAgICAgICAgICAgICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChpbnB1dF9wcmV2aWV3KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coXCJjYW5ub3QgZmluZCBpZFwiKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICA7XHJcbiAgICAvKipcclxuICAgICAqIEBwYXJhbSB7SFRNTERpdkVsZW1lbnR9IGVsZW1lbnRcclxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSB2YWx1ZVxyXG4gICAgICovXHJcbiAgICBfY3JlYXRlRmx5V3JhcChlbGVtZW50KSB7XHJcbiAgICAgICAgaWYgKCFlbGVtZW50KVxyXG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgICAgICBsZXQgcmVjdCA9IGVsZW1lbnQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XHJcbiAgICAgICAgbGV0IGRpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XHJcbiAgICAgICAgZGl2LmNsYXNzTmFtZSA9IFwicHJldmlldy1pbnB1dFwiO1xyXG4gICAgICAgIGRpdi5zdHlsZS5taW5XaWR0aCA9IHJlY3Qud2lkdGggKyBcInB4XCI7XHJcbiAgICAgICAgZGl2LnN0eWxlLnRvcCA9ICtyZWN0LnRvcCArIHJlY3QuaGVpZ2h0ICsgXCJweFwiO1xyXG4gICAgICAgIGRpdi5zdHlsZS5sZWZ0ID0gK3JlY3QubGVmdCArIFwicHhcIjtcclxuICAgICAgICBkaXYuc2V0QXR0cmlidXRlKFwiY3VyXCIsIFwiMFwiKTtcclxuICAgICAgICByZXR1cm4gZGl2O1xyXG4gICAgfVxyXG4gICAgLyoqXHJcbiAgICAgKiBAcmV0dXJuIHt0cnVlfSBpZiBzdHIxIGxpa2Ugc3RyMlxyXG4gICAgICogQHBhcmFtIHtTdHJpbmd9IHN0cjFcclxuICAgICAqIEBwYXJhbSB7U3RyaW5nfSBzdHIyXHJcbiAgICAgKi9cclxuICAgIF9pc0xpa2Uoc3RyMSwgc3RyMikge1xyXG4gICAgICAgIHN0cjEgPSBzdHIxLnRyaW0oKTtcclxuICAgICAgICBzdHIyID0gc3RyMi50cmltKCk7XHJcbiAgICAgICAgaWYgKHN0cjEgPT0gXCJcIiB8fCBzdHIyID09IFwiXCIpXHJcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICBzdHIxID0gc3RyMS5ub3JtYWxpemUoKTtcclxuICAgICAgICBzdHIyID0gc3RyMi5ub3JtYWxpemUoKTtcclxuICAgICAgICBzdHIxID0gc3RyMS50b0xvd2VyQ2FzZSgpO1xyXG4gICAgICAgIHN0cjIgPSBzdHIyLnRvTG93ZXJDYXNlKCk7XHJcbiAgICAgICAgbGV0IHJlZyA9IG5ldyBSZWdFeHAoYF4uKiR7c3RyMn0uKiRgKTtcclxuICAgICAgICByZXR1cm4gc3RyMS5tYXRjaChyZWcpO1xyXG4gICAgfVxyXG4gICAgLyoqXHJcbiAgICAgKiBAcGFyYW0ge0FycmF5fSBhcnJWYWx1ZXNcclxuICAgICAqL1xyXG4gICAgX2NyZWF0ZUZseVJvdyhhcnJWYWx1ZXMpIHtcclxuICAgICAgICBpZiAoIUFycmF5LmlzQXJyYXkoYXJyVmFsdWVzKSkge1xyXG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgICAgICB9XHJcbiAgICAgICAgbGV0IHJvdyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XHJcbiAgICAgICAgcm93LmNsYXNzTmFtZSA9IFwicHJldmlldy1yb3dcIjtcclxuICAgICAgICBmb3IgKGxldCB2YWx1ZSBvZiBhcnJWYWx1ZXMpIHtcclxuICAgICAgICAgICAgbGV0IGNvbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XHJcbiAgICAgICAgICAgIGNvbC5zdHlsZS5tYXJnaW4gPSBcImF1dG9cIjtcclxuICAgICAgICAgICAgY29sLnRleHRDb250ZW50ID0gdmFsdWU7XHJcbiAgICAgICAgICAgIHJvdy5hcHBlbmRDaGlsZChjb2wpO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gcm93O1xyXG4gICAgfVxyXG4gICAgX2RlbGV0ZVByZXZpZXcoKSB7XHJcbiAgICAgICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcIi5wcmV2aWV3LWlucHV0XCIpLmZvckVhY2goKHZhbCkgPT4ge1xyXG4gICAgICAgICAgICB2YWwucmVtb3ZlKCk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcbn1cclxuZXhwb3J0cy5kZWZhdWx0ID0gaW5wdXRQcmV2aWV3MjtcclxuIiwiY29uc3QgQmFuZ0RvblZpID0gcmVxdWlyZSgnLi4vYXBwL0JhbmdEb25WaScpLmRlZmF1bHQ7XG5cbmZ1bmN0aW9uIGZldGNoVG9UYWJsZShkYXRhKSB7XG4gICAgJChcIiNuaGFwX2Rvbl92aS0tdGFibGUtYm9keVwiKS5jaGlsZHJlbigpLnJlbW92ZSgpO1xuICAgICQoJy53aWxsLWJlLXVwZGF0ZScpLnJlbW92ZSgpO1xuXG4gICAgZm9yIChsZXQgaWQgb2YgT2JqZWN0LmtleXMoZGF0YSkpIHtcbiAgICAgICAgbGV0IHRlbiA9IGRhdGFbaWRdWyd0ZW4nXTtcbiAgICAgICAgbGV0IHF1eWRvaVRleHQgPSBkYXRhW2lkXVsncXV5ZG9pVGV4dCddO1xuXG4gICAgICAgIGxldCByb3cgPSAkKFwiPHRyLz5cIik7XG4gICAgICAgIHJvdy5hcHBlbmQoJCgnPHRkLz4nKS50ZXh0KGlkKSlcbiAgICAgICAgICAgIC5hcHBlbmQoJCgnPHRkLz4nKS50ZXh0KHRlbikpXG4gICAgICAgICAgICAuYXBwZW5kKCQoJzx0ZC8+JykudGV4dChxdXlkb2lUZXh0KSk7XG5cbiAgICAgICAgbGV0IG9wdCA9ICQoJzxvcHRpb24vPicpLnZhbChpZCkudGV4dCh0ZW4pLmFkZENsYXNzKCd3aWxsLWJlLXVwZGF0ZScpO1xuICAgICAgICAkKFwiI25oYXBfZG9uX3ZpLS1pZF9xdXlfZG9pXCIpLmFwcGVuZChvcHQpO1xuICAgICAgICAkKCcjbmhhcF9kb25fdmktLXRhYmxlLWJvZHknKS5hcHBlbmQocm93KTtcbiAgICB9XG59XG5cbiQoZG9jdW1lbnQpLnJlYWR5KGFzeW5jICgpPT57XG4gICAgY29uc3QgYmFuZ0RvbnZpID0gbmV3IEJhbmdEb25WaSgpO1xuICAgIGJhbmdEb252aS5hZGREYXRhYmFzZVVSTCgnL3B1YmxpYy9hcGkvZ2V0RG9udmkucGhwJyk7XG4gICAgYXdhaXQgYmFuZ0RvbnZpLnVwZGF0ZSgpO1xuICAgIGZldGNoVG9UYWJsZShiYW5nRG9udmkudGFibGUpO1xuXG4gICAgY29uc3QgcG9wdXAgPSBuZXcgU3RhdHVzUG9wdXAoKTtcbiAgICBwb3B1cC5jcmVhdGUoKTtcblxuICAgICQoXCIjbmhhcF9kb25fdmktLWZvcm1cIikub24oJ3N1Ym1pdCcsIChlKT0+e1xuICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG5cbiAgICAgICAgY29uc3QgdGVuRG9uVmkgPSAkKCcjbmhhcF9kb25fdmktLXRlbl9kb25fdmknKS52YWwoKTtcbiAgICAgICAgY29uc3QgaWRRdXlEb2kgPSAkKCcjbmhhcF9kb25fdmktLWlkX3F1eV9kb2knKS52YWwoKTtcbiAgICAgICAgY29uc3QgaGVTb1F1eURvaSA9IGlkUXV5RG9pID09IFwibnVsbFwiID8gMCA6ICQoXCIjbmhhcF9kb25fdmktLWhlX3NvX3F1eWRvaVwiKS52YWwoKTtcblxuICAgICAgICAkLmFqYXgoJy9hcGkvYWRkRG9udmkucGhwJywge1xuICAgICAgICAgICAgbWV0aG9kOiAncG9zdCcsXG4gICAgICAgICAgICB4aHJGaWVsZHM6IHtcbiAgICAgICAgICAgICAgICB3aXRoQ3JlZGVudGlhbHM6ICdpbmNsdWRlJyxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBkYXRhOiBgdGVuX2Rvbl92aT0ke3RlbkRvblZpfSZpZF9xdXlfZG9pPSR7aWRRdXlEb2l9JmhlX3NvX3F1eWRvaT0ke2hlU29RdXlEb2l9YCxcbiAgICAgICAgICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uKGpzb24pIHtcbiAgICAgICAgICAgICAgICBpZiAoISFqc29uLmVycikge1xuICAgICAgICAgICAgICAgICAgICBwb3B1cC5zZXRTdGF0dXMoZmFsc2UsIGpzb24ubXNnKTtcbiAgICAgICAgICAgICAgICAgICAgcG9wdXAuc2hvdygpO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgcGFyZW50LnBvc3RNZXNzYWdlKHtcbiAgICAgICAgICAgICAgICAgICAgbXNnOiAndXBkYXRlJyxcbiAgICAgICAgICAgICAgICB9LCBcIipcIik7XG5cbiAgICAgICAgICAgICAgICBwb3B1cC5zZXRTdGF0dXModHJ1ZSwganNvbi5tc2cpO1xuICAgICAgICAgICAgICAgIHBvcHVwLnNob3coKTtcbiAgICAgICAgICAgICAgICBzZXRUaW1lb3V0KCgpPT57XG4gICAgICAgICAgICAgICAgICAgIHBvcHVwLmhpZGUoKTtcbiAgICAgICAgICAgICAgICB9LCAxMDAwKTtcblxuICAgICAgICAgICAgICAgICQoXCIjbmhhcF9kb25fdmktLWZvcm0gaW5wdXRcIikudmFsKFwiXCIpO1xuICAgICAgICAgICAgICAgICQoXCIjbmhhcF9kb25fdmktLWlkX3F1eV9kb2lcIikudmFsKFwibnVsbFwiKTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBlcnJvcjogZnVuY3Rpb24oZXJyKSB7XG4gICAgICAgICAgICAgICAgcG9wdXAuc2V0U3RhdHVzKGZhbHNlLCBlcnIucmVzcG9uc2VUZXh0KTtcbiAgICAgICAgICAgICAgICBwb3B1cC5zaG93KCk7XG5cbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9LFxuICAgICAgICB9KTtcbiAgICB9KTtcblxuXG4gICAgLy8gb24gaW5wdXQgcXV5IGRvaSBkb24gdmlcbiAgICAkKCcjbmhhcF9kb25fdmktLWlkX3F1eV9kb2knKS5vbignY2hhbmdlJywgZnVuY3Rpb24gQ2hhbmdlT25JbnB1dERvblZpKGUpIHtcbiAgICAgICAgbGV0IHZhbCA9ICQodGhpcykudmFsKCk7XG4gICAgICAgICQoJyNuaGFwX2Rvbl92aS0taGVfc29fcXV5ZG9pJykucHJvcCgnZGlzYWJsZWQnLCB2YWwgPT0gJ251bGwnKTtcbiAgICB9KTtcblxuICAgIC8vIHVwZGF0ZSBkYXRhIHJlcXVlc3RcbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignbWVzc2FnZScsIGFzeW5jIGZ1bmN0aW9uKGUpIHtcbiAgICAgICAgbGV0IGRhdGEgPSBlLmRhdGE7XG4gICAgICAgIGlmIChkYXRhLm1zZyA9PSAndXBkYXRlJykge1xuICAgICAgICAgICAgYXdhaXQgYmFuZ0RvbnZpLnVwZGF0ZSgpO1xuICAgICAgICAgICAgZmV0Y2hUb1RhYmxlKGJhbmdEb252aS50YWJsZSk7XG4gICAgICAgIH1cbiAgICB9KTtcbn0pO1xuIiwiY29uc3Qge0hvYURvbkZvcm19ID0gcmVxdWlyZSgnLi4vYXBwL0hvYURvbkZvcm0nKTtcbmNvbnN0IHtRTE5UfSA9IHJlcXVpcmUoJy4uL2FwcC9BcHAnKTtcblxuY29uc3QgaG9hRG9uRm9ybSA9IG5ldyBIb2FEb25Gb3JtKCk7XG5jb25zdCBBcHAgPSBuZXcgUUxOVCgpO1xuXG5mdW5jdGlvbiBkaXNwbGF5VGltZSgpIHtcbiAgICBsZXQgbm93ID0gbmV3IERhdGUoKTtcbiAgICAkKFwiI3RpbWUtZGF0ZVwiKS50ZXh0KG5vdy50b0xvY2FsZURhdGVTdHJpbmcoKSk7XG4gICAgJChcIiN0aW1lLXRpbWVcIikudGV4dChub3cudG9Mb2NhbGVUaW1lU3RyaW5nKCkpO1xufVxuXG5mdW5jdGlvbiBsb29wU2hvd1RpbWUoKSB7XG4gICAgbGV0IGlkID0gc2V0SW50ZXJ2YWwoKCk9PntcbiAgICAgICAgZGlzcGxheVRpbWUoKTtcbiAgICB9LCAxMDAwKTtcbn1cblxuZnVuY3Rpb24gZGlzcGxheVVzZXIoKSB7XG4gICAgbGV0IHVzZXJuYW1lID0gaG9hRG9uRm9ybS5nZXRVc2VybmFtZSgpO1xuICAgICQoXCIjbmhhcF9ob2FfZG9uLS11c2VybmFtZVwiKS50ZXh0KHVzZXJuYW1lKTtcbn1cblxuZnVuY3Rpb24gZm9jdXNUZW5UaHVvY0ZpcnN0KCkge1xuICAgICQoXCIjbmhhcF9ob2FfZG9uLS10ZW4tdGh1b2NcIikuZm9jdXMoKTtcbn1cblxuZnVuY3Rpb24gdXBkYXRlVG9uZ0dpYSgpXG57XG4gICAgbGV0IHRvbmcgPSAwO1xuICAgIGxldCBsaXN0ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLmN0aGQtZ2lhJyk7XG4gICAgZm9yIChsZXQgdmFsIG9mIGxpc3QpIHtcbiAgICAgICAgbGV0IGdpYSA9IHBhcnNlSW50KHZhbC50ZXh0Q29udGVudC5yZXBsYWNlKC9cXEQvLCAnJykpO1xuICAgICAgICB0b25nICs9IGdpYTtcbiAgICB9XG4gICAgY29uc3QgdmFsID0gdG9uZy50b0xvY2FsZVN0cmluZygpKycgVk7EkCc7XG5cbiAgICAkKFwiI25oYXBfaG9hX2Rvbi0tc3VtXCIpLmF0dHIoJ2N1clZhbCcsIHZhbCk7XG4gICAgaWYgKCEkKCcja2lldS1saWV1JylbMF0uY2hlY2tlZCkgJCgnI25oYXBfaG9hX2Rvbi0tc3VtJykudmFsKHZhbCk7XG59XG5cbmZ1bmN0aW9uIHVwZGF0ZVRpZW5UaG9pKCkge1xuICAgIGxldCBzdW0gPSAkKFwiI25oYXBfaG9hX2Rvbi0tc3VtXCIpLnZhbCgpLnJlcGxhY2UoL1tcXERcXHNdL2csICcnKTtcbiAgICBsZXQgdGllbmtoID0gJChcIiNuaGFwX2hvYV9kb24tLXRpZW5raC10cmFcIikudmFsKCkucmVwbGFjZSgvW1xcRFxcc10vZywgJycpO1xuXG4gICAgbGV0IHRpZW5UaG9pID0gcGFyc2VJbnQodGllbmtoKSAtIHBhcnNlSW50KHN1bSk7XG4gICAgdGllblRob2kgPSB0aWVuVGhvaSA+PSAwID8gdGllblRob2kudG9Mb2NhbGVTdHJpbmcoKSA6ICd+bG9pJztcblxuICAgICQoXCIjbmhhcF9ob2FfZG9uLS10aG9pdGllblwiKS52YWwodGllblRob2kpO1xufVxuXG4kKGRvY3VtZW50KS5yZWFkeShmdW5jdGlvbigpIHtcbiAgICBsb29wU2hvd1RpbWUoKTtcbiAgICBkaXNwbGF5VXNlcigpO1xuICAgIGZvY3VzVGVuVGh1b2NGaXJzdCgpO1xuICAgIGNvbnN0IHBvcHVwID0gbmV3IFN0YXR1c1BvcHVwKCk7XG4gICAgcG9wdXAuY3JlYXRlKCk7XG5cbiAgICBBcHAuYWRkU2VsZWN0SW5wdXQoJCgnI25oYXBfaG9hX2Rvbi0tZG9uX3ZpJylbMF0sIHtcbiAgICAgICAgdGl0bGU6ICd0ZW4nLFxuICAgICAgICB2YWx1ZTogJ2lkJyxcbiAgICB9KTtcbiAgICBBcHAub25VcGRhdGVBbGwoKTtcblxuICAgIGhvYURvbkZvcm0uc2V0SGVhZGVyKCQoXCIjbmhhcF9ob2FfZG9uLS1mb3JtLW5oYXBcIikuZ2V0KDApKTtcbiAgICBob2FEb25Gb3JtLnNldFRhYmxlKCQoXCIjdGFibGUtbmhhcFwiKS5nZXQoMCkpO1xuXG4gICAgJCgnI25oYXBfaG9hX2Rvbi0tdGllbmtoLXRyYScpLm1vbmV5SW5wdXQoKS5vbigna2V5dXAnLCAoKT0+e1xuICAgICAgICB1cGRhdGVUaWVuVGhvaSgpO1xuICAgIH0pO1xuXG4gICAgJCgnI25oYXBfaG9hX2Rvbi0taG9hZG9uLWZvcm0nKS5zdWJtaXQoKGUpPT57XG4gICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcblxuICAgICAgICBob2FEb25Gb3JtLnB1c2hUb0RhdGFiYXNlKGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgJCgnI25oYXBfaG9hX2Rvbi0taG9hZG9uLWZvcm0nKS5maW5kKCdpbnB1dCwgc2VsZWN0JykudmFsKCcnKTtcbiAgICAgICAgICAgICQoJyNuaGFwX2hvYV9kb24tLWZvcm0tbmhhcCcpLmZpbmQoJ2lucHV0LCBzZWxlY3QnKS52YWwoJycpO1xuICAgICAgICAgICAgaG9hRG9uRm9ybS5uZXdIb2FEb24oKTtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKGhvYURvbkZvcm0pO1xuICAgICAgICAgICAgcG9wdXAuc2V0U3RhdHVzKHRydWUsIFwiT0tcIik7XG4gICAgICAgICAgICBwb3B1cC5zaG93KCk7XG4gICAgICAgIH0sIChlcnIpPT57XG4gICAgICAgICAgICBwb3B1cC5zZXRTdGF0dXMoZmFsc2UsIGVyci5tZXNzYWdlVGV4dCk7XG4gICAgICAgICAgICBwb3B1cC5zaG93KCk7XG5cbiAgICAgICAgICAgIGNvbnNvbGUubG9nKGVycik7XG4gICAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgQXBwLmFkZE5hbWVJbnB1dFRodW9jKFwibmhhcF9ob2FfZG9uLS10ZW5fdGh1b2NcIiwge1xuICAgICAgICBcIm5oYXBfaG9hX2Rvbi0tbWFfdGh1b2NcIjogXCJtYV90aHVvY1wiLFxuICAgICAgICBcIm5oYXBfaG9hX2Rvbi0tdGVuX3RodW9jXCI6IFwidGVuX3RodW9jXCIsXG4gICAgICAgIFwibmhhcF9ob2FfZG9uLS1kb25fdmlcIjogXCJ0ZW5fZG9uX3ZpXCIsXG4gICAgICAgIFwibmhhcF9ob2FfZG9uLS1jb3N0XCI6IFwiZG9uX2dpYVwiLFxuICAgIH0sIHtcbiAgICAgICAgXCJuaGFwX2hvYV9kb24tLXRlbl90aHVvY1wiOiBcInRlbl90aHVvY1wiLFxuICAgICAgICBcIm5oYXBfaG9hX2Rvbi0tbWFfdGh1b2NcIjogXCJtYV90aHVvY1wiLFxuICAgICAgICBcIm5oYXBfaG9hX2Rvbi0tZG9uX3ZpXCI6IFwiaWRfZG9uX3ZpXCIsXG4gICAgICAgIFwibmhhcF9ob2FfZG9uLS1jb3N0XCI6IFwiZG9uX2dpYVwiLFxuICAgIH0pO1xuXG4gICAgJChcIiNuaGFwX2hvYV9kb24tLWZvcm0tbmhhcFwiKS5vbignc3VibWl0JywgKGUpPT57XG4gICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgJChcIiNuaGFwX2hvYV9kb24tLWZvcm0tbmhhcFwiKS5maW5kKCdpbnB1dCwgc2VsZWN0JykudmFsKCcnKTtcbiAgICAgICAgdXBkYXRlVG9uZ0dpYSgpO1xuICAgIH0pO1xuXG4gICAgJChcIiNraWV1LWxpZXVcIikuY2xpY2soKCkgPT4ge1xuICAgICAgICAkKCcjbmhhcF9ob2FfZG9uLS1zdW0nKS52YWwoODAwMClcbiAgICB9KTtcbiAgICAkKCcja2lldS1iYW5sZScpLmNsaWNrKCgpID0+IHtcbiAgICAgICAgY29uc3Qgc3VtID0gJCgnI3N1bScpO1xuICAgICAgICBjb25zdCB2YWwgPSBzdW0uYXR0cignY3VyVmFsJyk7XG4gICAgICAgIHN1bS52YWwodmFsKTtcbiAgICB9KTtcbiAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxufSk7XG4iLCJjb25zdCBJbnB1dFByZXZpZXcyID0gcmVxdWlyZSgnLi4vYXBwL2lucHV0UHJldmlldzIuanMnKS5kZWZhdWx0O1xyXG5cclxuJChkb2N1bWVudCkucmVhZHkoZnVuY3Rpb24oKSB7XHJcbiAgICBsZXQgcG9wdXAgPSBuZXcgU3RhdHVzUG9wdXAoKTtcclxuICAgIHBvcHVwLmNyZWF0ZSgpO1xyXG5cclxuICAgIGNvbnN0IHByZXZpZXcgPSBuZXcgSW5wdXRQcmV2aWV3MigpO1xyXG4gICAgcHJldmlldy5hZGRMb29rdXAoe1xyXG4gICAgICAgIFwidGVuX25zeFwiOiBcInRlblwiLFxyXG4gICAgfSk7XHJcbiAgICBwcmV2aWV3Lmxpc3RlbihcInRlbl9uc3hcIiwgKGRhdGEpPT57XHJcbiAgICAgICAgJChcIiN0ZW5fbnN4XCIpLnZhbChkYXRhW1widGVuXCJdKTtcclxuICAgIH0pO1xyXG5cclxuICAgIGZ1bmN0aW9uIHVwZGF0ZU5TWCgpIHtcclxuICAgICAgICBmZXRjaChcIi9wdWJsaWMvYXBpL2dldE5zeC5waHBcIiwge2NyZWRlbnRpYWxzOiBcImluY2x1ZGVcIn0pXHJcbiAgICAgICAgLnRoZW4oKHJlcyk9PntcclxuICAgICAgICAgICAgcmV0dXJuIHJlcy5qc29uKCk7XHJcbiAgICAgICAgfSkudGhlbigoanNvbik9PntcclxuICAgICAgICAgICAgcHJldmlldy5hZGREYXRhKGpzb24uZGF0YSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gdXBkYXRlRG9udmkoKSB7XHJcbiAgICAgICAgJChcIiNkb25fdmlcIikuY2hpbGRyZW4oKS5yZW1vdmUoKTtcclxuICAgICAgICBmZXRjaChcIi9wdWJsaWMvYXBpL2dldERvbnZpLnBocFwiLCB7Y3JlZGVudGlhbHM6IFwiaW5jbHVkZVwifSlcclxuICAgICAgICAudGhlbigocmVzKT0+e1xyXG4gICAgICAgICAgICByZXR1cm4gcmVzLmpzb24oKTtcclxuICAgICAgICB9KVxyXG4gICAgICAgIC50aGVuKChqc29uKT0+e1xyXG4gICAgICAgICAgICBpZiAoISFqc29uLmVycikgY29uc29sZS5sb2coanNvbi5tc2cpO1xyXG4gICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGZvciAobGV0IHJvdyBvZiBqc29uLmRhdGEpIHtcclxuICAgICAgICAgICAgICAgICAgICBsZXQgbmFtZSA9IHJvd1sndGVuJ107XHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IGlkID0gcm93WydpZCddO1xyXG4gICAgICAgICAgICAgICAgICAgIGxldCBuZXdPcHQgPSAkKFwiPG9wdGlvbi8+XCIpLnZhbChpZCkudGV4dChuYW1lKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgJChcIiNkb25fdmlcIikuYXBwZW5kKG5ld09wdCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAkKFwiI2Rvbl92aVwiKS5maW5kKFwib3B0aW9uOmZpcnN0LWNoaWxkXCIpLmF0dHIoXCJzZWxlY3RlZFwiLCBcIlwiKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgICQoXCIjZG9uX2dpYVwiKS5tb25leUlucHV0KCk7XHJcbiAgICB1cGRhdGVOU1goKTtcclxuICAgIHVwZGF0ZURvbnZpKCk7XHJcblxyXG5cclxuICAgICQoXCIjZm9ybVwiKS5vbignc3VibWl0JywgKGUpPT57XHJcbiAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG5cclxuICAgICAgICAkLmFqYXgoe1xyXG4gICAgICAgICAgICB0eXBlOiBcIlBPU1RcIixcclxuICAgICAgICAgICAgdXJsOiBcIi9wdWJsaWMvYXBpL2FkZFRodW9jLnBocFwiLFxyXG4gICAgICAgICAgICBkYXRhOiAkKFwiI2Zvcm1cIikuc2VyaWFsaXplKCksXHJcbiAgICAgICAgICAgIGRhdGFUeXBlOiBcImpzb25cIixcclxuICAgICAgICAgICAgeGhyRmllbGRzOiB7XHJcbiAgICAgICAgICAgICAgICB3aXRoQ3JlZGVudGlhbHM6IHRydWUsIC8vIGZvciBzZXNzaW9uIGNvb2tpZVxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBzdWNjZXNzOiAoanNvbik9PntcclxuICAgICAgICAgICAgICAgIGlmICghIWpzb24uZXJyKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcG9wdXAuc2V0U3RhdHVzKGZhbHNlLCBqc29uLm1zZyk7XHJcbiAgICAgICAgICAgICAgICAgICAgcG9wdXAuc2hvdygpO1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdQb3N0IGZhaWxlZDogJywganNvbi5tc2cpO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICBwb3B1cC5zZXRTdGF0dXModHJ1ZSwgJ1Row6ptIHRow6BuaCBjw7RuZycpO1xyXG4gICAgICAgICAgICAgICAgICAgIHBvcHVwLnNob3coKTtcclxuICAgICAgICAgICAgICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBwb3B1cC5oaWRlKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfSwgMTAwMCk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdzdWNjZXNzJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgJChcImlucHV0XCIpLnZhbChcIlwiKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgcGFyZW50LnBvc3RNZXNzYWdlKHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgbXNnOiAndXBkYXRlJyxcclxuICAgICAgICAgICAgICAgICAgICB9LCAnKicpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBlcnJvcjogKGVycik9PntcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGVycik7XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgfSk7XHJcbiAgICB9KTtcclxuXHJcbiAgICAvLyB1cGRhdGUgZGF0YSByZXF1ZXN0XHJcbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignbWVzc2FnZScsIGZ1bmN0aW9uKGUpIHtcclxuICAgICAgICBsZXQgZGF0YSA9IGUuZGF0YTtcclxuICAgICAgICBpZiAoZGF0YS5tc2cgPT0gJ3VwZGF0ZScpIHtcclxuICAgICAgICAgICAgdXBkYXRlTlNYKCk7XHJcbiAgICAgICAgICAgIHVwZGF0ZURvbnZpKCk7XHJcbiAgICAgICAgfVxyXG4gICAgfSk7XHJcblxyXG4gICAgLy8gc2hvcnRjdXQga2V5IGV2ZW50XHJcbiAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdrZXlkb3duJywgKGUpPT57XHJcbiAgICAgICAgY29uc29sZS5sb2coXCJuaGFwIHRodW9jOiBcIiwgZS5rZXlDb2RlKTtcclxuICAgICAgICBwYXJlbnQucG9zdE1lc3NhZ2Uoe1xyXG4gICAgICAgICAgICBtc2c6ICdzaG9ydGN1dF9rZXknLFxyXG4gICAgICAgICAgICBrZXk6IGUua2V5Q29kZSxcclxuICAgICAgICAgICAgc2hpZnQ6IGUuc2hpZnRLZXksXHJcbiAgICAgICAgfSwgXCIqXCIpO1xyXG4gICAgfSk7XHJcbn0pO1xyXG4iXX0=
