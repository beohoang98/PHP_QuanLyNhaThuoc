(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const KeyEvent_1 = require("./KeyEvent");
const Thuoc_1 = require("./Model/Thuoc");
const HoaDon_1 = require("./Model/HoaDon");
const DonVi_1 = require("./Model/DonVi");
const Ncc_1 = require("./Model/Ncc");
const BangGia_1 = require("./Model/BangGia");
const ThuocTable_1 = require("./View/ThuocTable");
class App {
    constructor() {
        this.switchToPage(this.getPageFromUrl());
        this.handleSwitchPage();
        this.keyevent = new KeyEvent_1.KeyEvent();
        this.handleSetting();
        this.handleModal();
        this.model = {
            thuoc: new Thuoc_1.Thuoc(),
            ncc: new Ncc_1.Ncc(),
            donVi: new DonVi_1.DonVi(),
            hoaDon: new HoaDon_1.HoaDon(),
            bangGia: new BangGia_1.BangGia(),
        };
        this.view = {
            thuoc: new ThuocTable_1.ThuocTable(this.model.thuoc),
            hoaDon: null,
        };
    }
    getUsername() {
        const username = document.cookie.match(/username=([0-9a-zA-Z_]+)/i)[1];
        $("#username").text(username);
    }
    onShortcutKey(combKey, page, func) {
        // f*king incredible scope things!
        this.keyevent.on(combKey, (e) => {
            if (this.page === page) {
                func(e);
            }
        });
    }
    getPageFromUrl() {
        let page = new URL(window.location.toString()).searchParams.get("page");
        if (!page) {
            page = "page-nhap-hoa-don";
        }
        return page;
    }
    handleSwitchPage() {
        const $this = this;
        $(".sidebar-switch-page").on("click", function () {
            const id = $(this).data("target");
            $this.switchToPage(id);
        });
    }
    switchToPage(id) {
        this.page = id;
        window.history.replaceState(null, id, "/?page=" + id);
        const container = $(".frame-container");
        const page = $("#" + id);
        container.animate({
            scrollTop: page.offset().top - container.offset().top + container.scrollTop(),
        });
    }
    handleSetting() {
        //
    }
    handleModal() {
        $(".modal").on("shown.bs.modal", () => {
            this.keyevent.block();
        });
        $(".modal").on("hidden.bs.modal", () => {
            this.keyevent.unblock();
        });
    }
}
exports.App = App;

},{"./KeyEvent":3,"./Model/BangGia":5,"./Model/DonVi":6,"./Model/HoaDon":7,"./Model/Ncc":9,"./Model/Thuoc":10,"./View/ThuocTable":12}],2:[function(require,module,exports){
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
class AutoComplete {
    constructor(target, model) {
        if (typeof target === "string") {
            this.target = $("#" + target);
        }
        else {
            this.target = target;
        }
        this.target.attr("autocomplete", "off");
        this.model = model;
    }
    onChoose(func) {
        this.funcOnChoose = func;
    }
    isShowed() {
        return this.element.children.length > 0;
    }
    /**
     * set fieldname to show
     * @param lookup {fieldName: ElementId}
     */
    setLookup(lookup) {
        this.lookup = lookup;
    }
    listen() {
        this.target.on("keyup", (e) => {
            const key = e.key;
            switch (key) {
                case "Enter": {
                    break;
                }
                case "Escape": {
                    this.remove();
                    break;
                }
                case "ArrowUp": {
                    // to do
                    break;
                }
                case "ArrowDown": {
                    // to do
                    break;
                }
                default: {
                    const val = this.target.val();
                    this.remove();
                    this.render(val).then(() => {
                        this.show();
                    });
                }
            }
        });
    }
    render(search) {
        return __awaiter(this, void 0, void 0, function* () {
            this.element = $("<ul/>").addClass("my-autocomplete shadow-lg rounded");
            this.element.css({
                top: this.target.offset().top + this.target.outerHeight(),
                left: this.target.offset().left,
            });
            const data = yield this.getData(search);
            this.currentOffset = 0;
            let offset = 0;
            for (const dataRow of data) {
                const dataRowFiltered = this.filterDataWithLookup(dataRow);
                const rowElement = this.renderRow(dataRowFiltered, offset++);
                rowElement.on("click keydown", (e) => {
                    if (e.type === "click" || e.key === "Enter") {
                        e.preventDefault();
                        e.stopPropagation();
                        this.funcOnChoose(dataRow);
                        this.remove();
                    }
                });
                this.element.append(rowElement);
            }
        });
    }
    show() {
        $("body").append(this.element);
    }
    remove() {
        $(".my-autocomplete").remove();
    }
    getData(search) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield this.model.get(search, 0, 20); // 20 is for test first, will develop in future
            return data;
        });
    }
    renderRow(dataRow, offset) {
        const row = $("<li/>").data("offset", offset);
        for (const field of Object.keys(dataRow)) {
            const val = dataRow[field];
            row.append($("<div/>").text(val));
        }
        return row;
    }
    filterDataWithLookup(dataRow) {
        const filteredData = {};
        for (const key of this.lookup) {
            if (dataRow.hasOwnProperty(key)) {
                filteredData[key] = dataRow[key];
            }
        }
        return filteredData;
    }
}
exports.AutoComplete = AutoComplete;

},{}],3:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class KeyEvent {
    constructor() {
        this.eventAttach = {};
        this.isBlocking = false;
        $(document).on("keydown", (e) => {
            if (this.isBlocking) {
                return;
            }
            let combKey = "";
            if (e.ctrlKey) {
                combKey = "ctrl+";
            }
            combKey += e.key;
            console.log(combKey);
            if (this.eventAttach.hasOwnProperty(combKey)) {
                const listFunc = this.eventAttach[combKey];
                for (const func of listFunc) {
                    if (typeof func === "function") {
                        func(e);
                    }
                }
            }
        });
    }
    on(combKey, func) {
        if (!this.eventAttach[combKey]) {
            this.eventAttach[combKey] = [];
        }
        this.eventAttach[combKey].push(func);
    }
    block() {
        this.isBlocking = true;
    }
    unblock() {
        this.isBlocking = false;
    }
}
exports.KeyEvent = KeyEvent;

},{}],4:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class MenuContext {
    constructor(target) {
        if (typeof target === "string") {
            this.target = $("#" + target);
        }
        else {
            this.target = target;
        }
        this.target.on("contextmenu", (e) => {
            e.preventDefault();
            e.stopPropagation();
            this.remove().render({ x: e.clientX, y: e.clientY }).show();
        });
        this.menu = [];
    }
    addContext(prop) {
        this.menu.push(prop);
        return this;
    }
    render(pos) {
        this.element = $("<ul/>").addClass("shadow-lg rounded my-contextmenu");
        this.element.css("top", pos.y + "px");
        this.element.css("left", pos.x + "px");
        for (const ctx of this.menu) {
            this.element.append(this.renderContext(ctx));
        }
        this.element.hide();
        return this;
    }
    show() {
        $("body").append(this.element);
        this.element.slideDown(0.5);
        $(document).off("click", this.remove).on("click", this.remove);
        return this;
    }
    remove() {
        $(".my-contextmenu").remove();
        return this;
    }
    renderContext(prop) {
        const context = $("<li/>");
        context.html(`<i class='${prop.icon} ${prop.className}'></i> ${prop.title}`);
        context.on("click", (e) => {
            this.remove();
            prop.click(e);
        });
        return context;
    }
}
exports.MenuContext = MenuContext;

},{}],5:[function(require,module,exports){
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
const ModelClass_1 = require("../ModelClass");
class BangGia extends ModelClass_1.Model {
    constructor() {
        super();
        this.database = "/api/price/";
    }
    get(maThuoc) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield this._get({ ma: maThuoc });
            return data;
        });
    }
    add(maThuoc, giaMoi) {
        return __awaiter(this, void 0, void 0, function* () {
            const res = yield this._post({ ma: maThuoc, price: giaMoi });
            return res;
        });
    }
}
exports.BangGia = BangGia;

},{"../ModelClass":8}],6:[function(require,module,exports){
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
const ModelClass_1 = require("../ModelClass");
class DonVi extends ModelClass_1.Model {
    constructor() {
        super();
        this.database = "/api/don_vi/";
    }
    get(callback) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield this._get({});
            this.data = data;
            if (typeof callback === "function") {
                callback(data);
            }
            return this.data;
        });
    }
    renderSelectInput(target) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield this.get();
            target.html("");
            for (const row of data) {
                const opt = $("<option/>").val(row.id).text(row.ten);
                target.append(opt);
            }
            target.children().eq(0).attr("checked", "true");
        });
    }
}
exports.DonVi = DonVi;

},{"../ModelClass":8}],7:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ModelClass_1 = require("../ModelClass");
class HoaDon extends ModelClass_1.Model {
    constructor() {
        super();
        this.database = "/api/hoa_don/";
    }
}
exports.HoaDon = HoaDon;

},{"../ModelClass":8}],8:[function(require,module,exports){
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
class Model {
    constructor() {
        this.database = "";
        this.data = [];
    }
    get fetchData() {
        return Object.assign({}, this.data);
    }
    get response() {
        return Object.assign({}, this.res);
    }
    // =============== INHERIT FUNC
    get(params, offset, limit) {
        return __awaiter(this, void 0, void 0, function* () {
            return undefined;
        });
    }
    create(data) {
        return __awaiter(this, void 0, void 0, function* () {
            return false;
        });
    }
    /**
     * update record
     * @param fieldMatch match field to update record
     * @param fieldUpdate the data need update
     */
    update(fieldMatch, fieldUpdate) {
        return __awaiter(this, void 0, void 0, function* () {
            return false;
        });
    }
    /**
     * remove a record
     * @param fieldMatch field match to remove
     * @return true of false
     */
    remove(fieldMatch) {
        return __awaiter(this, void 0, void 0, function* () {
            return false;
        });
    }
    // =============== CORE FUNC
    /**
     * fetch data from database and do thing
     * @param params
     * @param callback callback function
     */
    _get(params, callback) {
        return __awaiter(this, void 0, void 0, function* () {
            this.data = [];
            const requestURL = this.database + "?" + this._urlparams(params);
            try {
                const res = yield fetch(requestURL, { credentials: "include" });
                const json = yield res.json();
                if (json.err) {
                    throw new Error(json.msg);
                }
                this.data = json.data;
                if (typeof callback === "function") {
                    callback(false, json.data);
                }
                return json.data;
            }
            catch (err) {
                if (typeof callback === "function") {
                    callback(err);
                }
                else {
                    throw err;
                }
            }
        });
    }
    /**
     * post request
     * @param {any} data
     * @param {Function} [callback]
     */
    _post(data, callback) {
        return __awaiter(this, void 0, void 0, function* () {
            this.res = "";
            try {
                const res = yield fetch(this.database, {
                    body: JSON.stringify(data),
                    credentials: "include",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    method: "POST",
                });
                const json = yield res.json();
                if (json.err) {
                    throw new Error(json.msg);
                }
                this.res = json.data;
                if (typeof callback === "function") {
                    callback(false, json.data);
                }
                return json.data;
            }
            catch (err) {
                if (typeof callback === "function") {
                    callback(err);
                }
                else {
                    throw err;
                }
            }
        });
    }
    _put(data) {
        return __awaiter(this, void 0, void 0, function* () {
            this.res = "";
            try {
                const res = yield fetch(this.database, {
                    body: JSON.stringify(data),
                    credentials: "include",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    method: "PUT",
                });
                const json = yield res.json();
                if (json.err) {
                    throw new Error(json.msg);
                }
                this.res = json.data;
                return json.data;
            }
            catch (err) {
                throw err;
            }
        });
    }
    _urlparams(params) {
        const url = Object.keys(params).map((k) => {
            return encodeURIComponent(k) + "=" + encodeURIComponent(params[k]);
        }).join("&");
        return url;
    }
}
exports.Model = Model;

},{}],9:[function(require,module,exports){
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
const ModelClass_1 = require("../ModelClass");
class Ncc extends ModelClass_1.Model {
    constructor() {
        super();
        this.database = "/api/ncc/";
    }
    /**
     * get data of nsx
     * @param callback callback function
     */
    get(params) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield this._get({ q: params });
            return data;
        });
    }
}
exports.Ncc = Ncc;

},{"../ModelClass":8}],10:[function(require,module,exports){
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
const ModelClass_1 = require("../ModelClass");
class Thuoc extends ModelClass_1.Model {
    constructor() {
        super();
        this.database = "/api/thuoc/";
    }
    get(params, offset, limit) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this._get({ q: params, offset, limit });
        });
    }
    create(data) {
        return __awaiter(this, void 0, void 0, function* () {
            this.res = yield this._post(data);
            return (this.res);
        });
    }
    add(ma, soLuong, tongGia) {
        return __awaiter(this, void 0, void 0, function* () {
            this.res = yield this._post({
                ma,
                so_luong: soLuong,
                tong_gia: tongGia,
            });
            return this.res;
        });
    }
    update(ma, editInfo) {
        return __awaiter(this, void 0, void 0, function* () {
            this.res = yield this._put({
                ma, editInfo,
            });
            return this.res;
        });
    }
}
exports.Thuoc = Thuoc;

},{"../ModelClass":8}],11:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class HoaDonNhap {
    constructor(target) {
        this.element = null;
        this.data = [];
        this.current = null;
        this.funcUpdateGia = (gia) => { return; };
        this.setView(target);
        this.updateTable();
    }
    setView(target) {
        if (typeof (target) === "string") {
            this.element = $("#" + target);
        }
        else {
            this.element = target;
        }
    }
    updateTable() {
        this.element.find("tbody").remove();
        this.element.append(this.renderTable());
    }
    newHoaDon() {
        this.data = [];
        this.updateTable();
        this.updateGia();
    }
    addHoaDon(cthd) {
        this.data.push(cthd);
        this.element.append(this.renderRow(cthd));
        this.updateGia();
    }
    getTongGia() {
        let gia = 0;
        for (const cthd of this.data) {
            gia += cthd.thanh_tien;
        }
        return gia;
    }
    setKieu(kieu) {
        this.kieu = kieu;
        this.updateGia();
    }
    updateGia() {
        const gia = +this.getTongGia();
        this.funcUpdateGia(gia);
    }
    onUpdateTongGia(func) {
        this.funcUpdateGia = func;
    }
    renderTable() {
        const body = $("<tbody/>");
        for (const row of this.data) {
            const tr = this.renderRow(row);
            body.append(tr);
        }
        return body;
    }
    renderRow(row) {
        const tr = $("<tr/>");
        tr.html(`
        <td>${row.ma_thuoc}</td>
        <td>${row.ten_thuoc}</td>
        <td>${row.so_luong}</td>
        <td>${row.thanh_tien}</td>
        `);
        return tr;
    }
}
exports.HoaDonNhap = HoaDonNhap;

},{}],12:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ViewTable_1 = require("./ViewTable");
const MenuContext_1 = require("../MenuContext");
class ThuocTable extends ViewTable_1.ViewTable {
    constructor(thuocModel) {
        super();
        this.element = $("<table/>").addClass("table table-striped table-view");
        this.element.html(`
        <thead>
            <tr>
                <th>Ma Thuoc</th>
                <th>Ten Thuoc</th>
            </tr>
        </thead>
        <tbody></tbody>
        `);
        this.model = thuocModel;
    }
    onContextAdd(func) {
        this.funcCtxAdd = func;
    }
    onContextEdit(func) {
        this.funcCtxEdit = func;
    }
    onContextEditPrice(func) {
        this.funcCtxEditPrice = func;
    }
    customCreateRow(row) {
        const contextmenu = new MenuContext_1.MenuContext(row);
        contextmenu.addContext({
            title: "nhập thêm thuốc",
            className: "text-success",
            icon: "fas fa-plus-circle",
            click: (e) => {
                this.funcCtxAdd();
            },
        }).addContext({
            title: "sửa thông tin",
            className: "text-primary",
            icon: "fas fa-pen-square",
            click: (e) => {
                this.funcCtxEdit();
            },
        }).addContext({
            title: "chỉnh giá",
            icon: "fa fa-dollar-sign",
            click: (e) => {
                this.funcCtxEditPrice();
            },
        });
    }
}
exports.ThuocTable = ThuocTable;

},{"../MenuContext":4,"./ViewTable":13}],13:[function(require,module,exports){
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
class ViewTable {
    constructor() {
        // construct
        this.offset = 0;
        this.limit = 10;
    }
    /**
     * get data with search value
     * @param search field=value
     */
    update(search) {
        return __awaiter(this, void 0, void 0, function* () {
            // render data to element
            const rawData = yield this.model.get(search, this.offset, this.limit);
            this.data = Array.from(rawData).map((val) => {
                return this.filterDataRow(val);
            });
            this.sizeOfRecord = this.data.length;
            this.currentPos = -1;
            return this.data;
        });
    }
    render(search) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield this.update(search);
            const tbody = this._createTableBody(data);
            this.element.find("tbody").html("").append(tbody.children());
        });
    }
    setElement(el) {
        this.element = el;
    }
    getElement() {
        return this.element;
    }
    currentData() {
        if (!this.currentRowData) {
            return undefined;
        }
        return Object.assign({}, this.currentRowData);
    }
    /**
     * attach event of choose
     * @param callback callback function when the row of record is choosed
     */
    onChoose(callback) {
        this.funcOnChoose = callback;
    }
    /**
     * attach event of hover
     * @param callback callback function when the row of record is hover on
     */
    onFocus(callback) {
        this.funcOnFocus = callback;
    }
    selectDown() {
        if (this.currentPos < this.sizeOfRecord - 1) {
            ++this.currentPos;
        }
        this.element.find(`tr[data-pos=${this.currentPos}]`).focus();
    }
    selectUp() {
        if (this.currentPos > 0) {
            --this.currentPos;
        }
        this.element.find(`tr[data-pos=${this.currentPos}]`).focus();
    }
    nextPage(search = "") {
        this.offset += this.limit;
        this.render(search);
    }
    setLimitPerPage(limit) {
        this.limit = limit;
    }
    setOffset(offset) {
        this.offset = offset;
    }
    filterDataRow(dataRow) {
        // nothing here, just raw
        return dataRow;
    }
    _createRow(dataRow, pos) {
        const row = $("<tr/>").attr("tabindex", -1).attr("data-pos", pos);
        for (const field of Object.keys(dataRow)) {
            const cell = $("<td/>").attr("name", field).text(dataRow[field]);
            row.append(cell);
        }
        // choose event
        this._rowOnChoose(row, () => {
            this.funcOnChoose(dataRow);
        });
        // hover event
        row.on("click focus", (e) => {
            this.element.find("tr").removeClass("active");
            row.addClass("active");
            this.currentPos = pos;
            this.currentRowData = dataRow;
            this.funcOnFocus(dataRow);
        });
        this.customCreateRow(row);
        return row;
    }
    _createTableBody(data) {
        const tbody = $("<tbody/>");
        let pos = 0;
        for (const rowData of data) {
            const trow = this._createRow(rowData, pos++);
            tbody.append(trow);
        }
        return tbody;
    }
    customCreateRow(row) {
        // nothing here, will change in inheritance
    }
    _rowOnChoose(row, callback) {
        row.on("keydown", (e) => {
            if (e.keyCode === 13) {
                callback();
            }
        });
        row.on("dblclick", () => {
            callback();
        });
    }
}
exports.ViewTable = ViewTable;

},{}],14:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function getFormValue(form) {
    const arr = form.serializeArray();
    const val = {};
    for (const input of arr) {
        val[input.name] = input.value;
    }
    return val;
}
exports.getFormValue = getFormValue;

},{}],15:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const AutoComplete_1 = require("../AutoComplete");
const formVal_1 = require("../formVal");
const HoaDonNhap_1 = require("../View/HoaDonNhap");
function init(app) {
    handleTenThuocInput(app);
    handleDonViSelectInput(app);
    handleForm(app);
}
exports.addThuocHandle = init;
function handleTenThuocInput(app) {
    const autocomplete = new AutoComplete_1.AutoComplete("nhap_hoa_don--ten_thuoc", app.model.thuoc);
    autocomplete.setLookup(["ma", "ten", "ncc", "don_vi", "don_gia"]);
    autocomplete.listen();
    autocomplete.onChoose((data) => {
        $("#nhap_hoa_don--ma_thuoc").val(data.ma);
        $("#nhap_hoa_don--ten_thuoc").val(data.ten);
        $("#nhap_hoa_don--ncc").val(data.ncc);
        $("#nhap_hoa_don--gia").val(data.don_gia);
        $("#nhap_hoa_don--don_vi").val(data.id_don_vi);
    });
}
function handleDonViSelectInput(app) {
    app.model.donVi.renderSelectInput($("#nhap_hoa_don--don_vi"));
}
function handleForm(app) {
    app.view.hoaDon = new HoaDonNhap_1.HoaDonNhap("nhap_hoa_don--table");
    app.view.hoaDon.onUpdateTongGia((gia) => {
        $("#nhap_hoa_don--tong_gia").val(gia);
    });
    $("#nhap_hoa_don--them_thuoc").on("submit", (e) => {
        e.preventDefault();
        const form = $(e.target);
        const data = formVal_1.getFormValue(form);
        form.find("input[type=text]").val("");
        form.find("input[name=ten_thuoc]").focus();
        app.view.hoaDon.addHoaDon({
            ma_thuoc: data.ma_thuoc,
            ten_thuoc: data.ten_thuoc,
            so_luong: data.so_luong,
            don_gia: data.don_gia,
            thanh_tien: data.don_gia * data.so_luong,
        });
    });
    $("input[name='kieu-ban']").on("change", function () {
        const kieu = "" + $(this).val();
        app.view.hoaDon.setKieu(kieu);
    });
}

},{"../AutoComplete":2,"../View/HoaDonNhap":11,"../formVal":14}],16:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const addThuocHandle_1 = require("./addThuocHandle");
const submitHoaDon_1 = require("./submitHoaDon");
function init(app) {
    addThuocHandle_1.addThuocHandle(app);
    submitHoaDon_1.submitHoaDonHandle(app);
}
exports.init = init;

},{"./addThuocHandle":15,"./submitHoaDon":17}],17:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function submitHoaDonHandle(app) {
    $("#nhap_hoa_don--submit").on("click", (e) => {
        e.preventDefault();
        alert("just in testing");
    });
}
exports.submitHoaDonHandle = submitHoaDonHandle;

},{}],18:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const thuoc_modal_1 = require("./thuoc-modal");
const PAGE_ID = "page-nhap-thuoc";
class Init {
    constructor(app) {
        this.app = app;
        app.view.thuoc.setElement($("#nhap_thuoc--table"));
        app.view.thuoc.setLimitPerPage(100);
        app.view.thuoc.onChoose((data) => {
            this.addThuoc(data);
        });
        app.view.thuoc.onFocus((data) => {
            $(".thuoc--button").removeAttr("disabled");
        });
        app.view.thuoc.onContextAdd(() => {
            this.addThuoc(app.view.thuoc.currentData());
        });
        app.view.thuoc.onContextEdit(() => {
            this.editThuoc(app.view.thuoc.currentData());
        });
        app.view.thuoc.onContextEditPrice(() => {
            this.editPriceThuoc(app.view.thuoc.currentData());
        });
        app.view.thuoc.render("");
        this.handleControlKey(app);
        this.handleSelectKey(app);
        this.handleModalEvent();
        this.handleSearchInput();
        const $this = this;
        $(".thuoc--button").on("click", function ButtonClick() {
            const role = $(this).attr("app-role");
            switch (role) {
                case "new":
                    $this.newThuoc();
                    break;
                case "edit":
                    $this.editThuoc(app.view.thuoc.currentData());
                    break;
                case "add":
                    $this.addThuoc(app.view.thuoc.currentData());
                    break;
                case "chinh-gia":
                    $this.editPriceThuoc(app.view.thuoc.currentData());
                    break;
            }
        });
    }
    handleSelectKey(app) {
        app.onShortcutKey("ArrowUp", PAGE_ID, (e) => {
            this.app.view.thuoc.selectUp();
        });
        app.onShortcutKey("ArrowDown", PAGE_ID, (e) => {
            this.app.view.thuoc.selectDown();
        });
    }
    handleControlKey(app) {
        app.onShortcutKey("ctrl+d", PAGE_ID, (e) => {
            e.preventDefault();
            this.newThuoc();
        });
        app.onShortcutKey("ctrl+e", PAGE_ID, (e) => {
            e.preventDefault();
            this.editThuoc(this.app.view.thuoc.currentData());
        });
        app.onShortcutKey("ctrl+g", PAGE_ID, (e) => {
            e.preventDefault();
            this.editPriceThuoc(this.app.view.thuoc.currentData());
        });
        app.onShortcutKey("ctrl+f", PAGE_ID, (e) => {
            e.preventDefault();
            $("#thuoc--search").focus();
        });
    }
    handleSearchInput() {
        const $this = this;
        $("#thuoc--search").on("keyup", function Searching() {
            const val = $(this).val();
            $this.app.view.thuoc.render(val);
        });
    }
    handleModalEvent() {
        this.addModal = new thuoc_modal_1.AddThuocModal("thuoc--add-modal", this.app);
        this.newModal = new thuoc_modal_1.NewThuocModal("thuoc--new-modal", this.app);
        this.editModal = new thuoc_modal_1.EditThuocModal("thuoc--edit-modal", this.app);
        this.editPriceModal = new thuoc_modal_1.EditPriceThuocModal("thuoc--edit-price-modal", this.app);
    }
    editThuoc(data) {
        if (!data) {
            return;
        }
        this.editModal.show(data);
    }
    newThuoc() {
        $("#thuoc--new-modal").modal("show");
    }
    addThuoc(data) {
        if (!data) {
            return;
        }
        $("#thuoc--add-modal").modal("show");
        $("#thuoc--add-mathuoc").val(data.ma);
        $("#thuoc--add-tenthuoc").val(data.ten);
        $("#thuoc--add-ncc").val(data.ten_ncc);
        $("#thuoc--add-soluong").val(data.so_luong);
    }
    editPriceThuoc(data) {
        if (!data) {
            return;
        }
        $("#thuoc--edit-price-modal").modal("show");
        $("#thuoc--edit-price-mathuoc").val(data.ma);
        $("#thuoc--edit-price-tenthuoc").val(data.ten);
    }
}
function init(app) {
    return new Init(app);
}
exports.init = init;

},{"./thuoc-modal":22}],19:[function(require,module,exports){
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
class AddThuocModal {
    constructor(id, app) {
        this.app = app;
        this.popup = $("#" + id);
        this.popup.load("/layouts/modal-add-thuoc.html", () => {
            this.popup.find("form").on("submit", (e) => {
                e.preventDefault();
                this.formSubmitHandle(e);
            });
        });
    }
    formSubmitHandle(e) {
        return __awaiter(this, void 0, void 0, function* () {
            const form = $(e.target);
            const data = {
                ma: form.find("[name=ma]").val(),
                so_luong: +form.find("[name='so_luong']").val(),
                tong_gia: +form.find("[name='tong_gia']").val(),
            };
            try {
                const res = yield this.app.model.thuoc.add(data.ma, data.so_luong, data.tong_gia);
                alert("success: " + res.ma + "=>" + res.so_luong_moi);
                window.location.reload();
            }
            catch (e) {
                alert("Error: " + e);
            }
        });
    }
    show() {
        this.popup.modal("show");
    }
    hide() {
        this.popup.modal("hide");
    }
}
exports.AddThuocModal = AddThuocModal;

},{}],20:[function(require,module,exports){
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
const formVal_1 = require("../formVal");
const AutoComplete_1 = require("../AutoComplete");
class EditThuocModal {
    constructor(id, app) {
        this.app = app;
        this.popup = $("#" + id);
        this.popup.load("/layouts/modal-edit-thuoc.html", () => {
            this.popup.find("form").on("submit", (e) => {
                e.preventDefault();
                this.formSubmitHandle(e);
            });
            this.handleNccInput(this.popup.find("[name=ncc]"));
            this.handleDonViSelect(this.popup.find("[name=id_don_vi]"));
        });
    }
    formSubmitHandle(e) {
        return __awaiter(this, void 0, void 0, function* () {
            const form = $(e.target);
            const data = formVal_1.getFormValue(form);
            // truong hop thay doi ma_thuoc, can 1 ma_thuoc truoc de update
            const maThuocDeUpdate = form.attr("id_value");
            try {
                const res = yield this.app.model.thuoc.update(maThuocDeUpdate, data);
                alert("Success: " + res + " record(s)");
                window.location.reload();
            }
            catch (e) {
                alert("Error: " + e);
            }
        });
    }
    handleNccInput(target) {
        const autocomplete = new AutoComplete_1.AutoComplete(target, this.app.model.ncc);
        autocomplete.setLookup(["ten"]);
        autocomplete.onChoose((data) => {
            target.val(data.ten);
        });
        autocomplete.listen();
    }
    handleDonViSelect(target) {
        target.html("");
        this.app.model.donVi.renderSelectInput(target);
    }
    show(data) {
        this.popup.find("form").attr("id_value", data.ma);
        this.popup.find("[name=ma]").val(data.ma);
        this.popup.find("[name=ten]").val(data.ten);
        this.popup.find("[name=ncc]").val(data.ten_ncc);
        this.popup.modal("show");
    }
    hide() {
        this.popup.modal("hide");
    }
}
exports.EditThuocModal = EditThuocModal;

},{"../AutoComplete":2,"../formVal":14}],21:[function(require,module,exports){
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
class EditPriceThuocModal {
    constructor(id, app) {
        this.app = app;
        this.popup = $("#" + id);
        this.popup.load("/layouts/modal-edit-price-thuoc.html", () => {
            //
            this.popup.find("form").on("submit", (e) => {
                e.preventDefault();
                this.formSubmitHandle(e);
            });
        });
    }
    formSubmitHandle(e) {
        return __awaiter(this, void 0, void 0, function* () {
            const form = $(e.target);
            const ma = "" + form.find("[name=ma_thuoc]").val();
            const price = +form.find("[name=price]").val();
            try {
                const res = yield this.app.model.bangGia.add(ma, price);
                alert("Success");
                window.location.reload();
            }
            catch (err) {
                alert("" + err);
            }
        });
    }
    show() {
        this.popup.modal("show");
    }
    hide() {
        this.popup.modal("hide");
    }
}
exports.EditPriceThuocModal = EditPriceThuocModal;

},{}],22:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const thuoc_add_modal_1 = require("./thuoc-add-modal");
exports.AddThuocModal = thuoc_add_modal_1.AddThuocModal;
const thuoc_edit_modal_1 = require("./thuoc-edit-modal");
exports.EditThuocModal = thuoc_edit_modal_1.EditThuocModal;
const thuoc_new_modal_1 = require("./thuoc-new-modal");
exports.NewThuocModal = thuoc_new_modal_1.NewThuocModal;
const thuoc_edit_price_modal_1 = require("./thuoc-edit-price-modal");
exports.EditPriceThuocModal = thuoc_edit_price_modal_1.EditPriceThuocModal;

},{"./thuoc-add-modal":19,"./thuoc-edit-modal":20,"./thuoc-edit-price-modal":21,"./thuoc-new-modal":23}],23:[function(require,module,exports){
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
const formVal_1 = require("../formVal");
class NewThuocModal {
    constructor(id, app) {
        this.app = app;
        this.popup = $("#" + id);
        this.popup.load("/layouts/modal-new-thuoc.html", () => {
            this.app.model.donVi.renderSelectInput(this.popup.find("[name=id_don_vi]"));
            this.popup.find("form").on("submit", function (e) {
                return __awaiter(this, void 0, void 0, function* () {
                    e.preventDefault();
                    const formVal = formVal_1.getFormValue($(this));
                    yield app.model.thuoc.create(formVal).catch((err) => {
                        alert(err);
                        throw err;
                    });
                    alert("success");
                    window.location.reload();
                });
            });
        });
    }
    show() {
        this.popup.modal("show");
    }
    hide() {
        this.popup.modal("hide");
    }
}
exports.NewThuocModal = NewThuocModal;

},{"../formVal":14}],24:[function(require,module,exports){
const {App} = require('../app/App');

$(document).ready(()=>{
    const app = new App();

    require("../app/nhap-hoa-don").init(app);
    require("../app/nhap-thuoc").init(app);
});

},{"../app/App":1,"../app/nhap-hoa-don":16,"../app/nhap-thuoc":18}]},{},[24])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvYXBwL0FwcC5qcyIsInNyYy9hcHAvQXV0b0NvbXBsZXRlL2luZGV4LmpzIiwic3JjL2FwcC9LZXlFdmVudC9pbmRleC5qcyIsInNyYy9hcHAvTWVudUNvbnRleHQvaW5kZXguanMiLCJzcmMvYXBwL01vZGVsL0JhbmdHaWEvaW5kZXguanMiLCJzcmMvYXBwL01vZGVsL0RvblZpL2luZGV4LmpzIiwic3JjL2FwcC9Nb2RlbC9Ib2FEb24vaW5kZXguanMiLCJzcmMvYXBwL01vZGVsL01vZGVsQ2xhc3MvaW5kZXguanMiLCJzcmMvYXBwL01vZGVsL05jYy9pbmRleC5qcyIsInNyYy9hcHAvTW9kZWwvVGh1b2MvaW5kZXguanMiLCJzcmMvYXBwL1ZpZXcvSG9hRG9uTmhhcC5qcyIsInNyYy9hcHAvVmlldy9UaHVvY1RhYmxlLmpzIiwic3JjL2FwcC9WaWV3L1ZpZXdUYWJsZS5qcyIsInNyYy9hcHAvZm9ybVZhbC5qcyIsInNyYy9hcHAvbmhhcC1ob2EtZG9uL2FkZFRodW9jSGFuZGxlLmpzIiwic3JjL2FwcC9uaGFwLWhvYS1kb24vaW5kZXguanMiLCJzcmMvYXBwL25oYXAtaG9hLWRvbi9zdWJtaXRIb2FEb24uanMiLCJzcmMvYXBwL25oYXAtdGh1b2MvaW5kZXguanMiLCJzcmMvYXBwL25oYXAtdGh1b2MvdGh1b2MtYWRkLW1vZGFsLmpzIiwic3JjL2FwcC9uaGFwLXRodW9jL3RodW9jLWVkaXQtbW9kYWwuanMiLCJzcmMvYXBwL25oYXAtdGh1b2MvdGh1b2MtZWRpdC1wcmljZS1tb2RhbC5qcyIsInNyYy9hcHAvbmhhcC10aHVvYy90aHVvYy1tb2RhbC5qcyIsInNyYy9hcHAvbmhhcC10aHVvYy90aHVvYy1uZXctbW9kYWwuanMiLCJzcmMvc2NyaXB0L21haW4uanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzVFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdkhBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDeENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcERBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzlCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNWQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN6SkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM1QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQy9DQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdkVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3REQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3hJQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDWEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNUQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNUQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdkhBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMvQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM3Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNWQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24oKXtmdW5jdGlvbiByKGUsbix0KXtmdW5jdGlvbiBvKGksZil7aWYoIW5baV0pe2lmKCFlW2ldKXt2YXIgYz1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlO2lmKCFmJiZjKXJldHVybiBjKGksITApO2lmKHUpcmV0dXJuIHUoaSwhMCk7dmFyIGE9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitpK1wiJ1wiKTt0aHJvdyBhLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsYX12YXIgcD1uW2ldPXtleHBvcnRzOnt9fTtlW2ldWzBdLmNhbGwocC5leHBvcnRzLGZ1bmN0aW9uKHIpe3ZhciBuPWVbaV1bMV1bcl07cmV0dXJuIG8obnx8cil9LHAscC5leHBvcnRzLHIsZSxuLHQpfXJldHVybiBuW2ldLmV4cG9ydHN9Zm9yKHZhciB1PVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmUsaT0wO2k8dC5sZW5ndGg7aSsrKW8odFtpXSk7cmV0dXJuIG99cmV0dXJuIHJ9KSgpIiwiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5jb25zdCBLZXlFdmVudF8xID0gcmVxdWlyZShcIi4vS2V5RXZlbnRcIik7XG5jb25zdCBUaHVvY18xID0gcmVxdWlyZShcIi4vTW9kZWwvVGh1b2NcIik7XG5jb25zdCBIb2FEb25fMSA9IHJlcXVpcmUoXCIuL01vZGVsL0hvYURvblwiKTtcbmNvbnN0IERvblZpXzEgPSByZXF1aXJlKFwiLi9Nb2RlbC9Eb25WaVwiKTtcbmNvbnN0IE5jY18xID0gcmVxdWlyZShcIi4vTW9kZWwvTmNjXCIpO1xuY29uc3QgQmFuZ0dpYV8xID0gcmVxdWlyZShcIi4vTW9kZWwvQmFuZ0dpYVwiKTtcbmNvbnN0IFRodW9jVGFibGVfMSA9IHJlcXVpcmUoXCIuL1ZpZXcvVGh1b2NUYWJsZVwiKTtcbmNsYXNzIEFwcCB7XG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHRoaXMuc3dpdGNoVG9QYWdlKHRoaXMuZ2V0UGFnZUZyb21VcmwoKSk7XG4gICAgICAgIHRoaXMuaGFuZGxlU3dpdGNoUGFnZSgpO1xuICAgICAgICB0aGlzLmtleWV2ZW50ID0gbmV3IEtleUV2ZW50XzEuS2V5RXZlbnQoKTtcbiAgICAgICAgdGhpcy5oYW5kbGVTZXR0aW5nKCk7XG4gICAgICAgIHRoaXMuaGFuZGxlTW9kYWwoKTtcbiAgICAgICAgdGhpcy5tb2RlbCA9IHtcbiAgICAgICAgICAgIHRodW9jOiBuZXcgVGh1b2NfMS5UaHVvYygpLFxuICAgICAgICAgICAgbmNjOiBuZXcgTmNjXzEuTmNjKCksXG4gICAgICAgICAgICBkb25WaTogbmV3IERvblZpXzEuRG9uVmkoKSxcbiAgICAgICAgICAgIGhvYURvbjogbmV3IEhvYURvbl8xLkhvYURvbigpLFxuICAgICAgICAgICAgYmFuZ0dpYTogbmV3IEJhbmdHaWFfMS5CYW5nR2lhKCksXG4gICAgICAgIH07XG4gICAgICAgIHRoaXMudmlldyA9IHtcbiAgICAgICAgICAgIHRodW9jOiBuZXcgVGh1b2NUYWJsZV8xLlRodW9jVGFibGUodGhpcy5tb2RlbC50aHVvYyksXG4gICAgICAgICAgICBob2FEb246IG51bGwsXG4gICAgICAgIH07XG4gICAgfVxuICAgIGdldFVzZXJuYW1lKCkge1xuICAgICAgICBjb25zdCB1c2VybmFtZSA9IGRvY3VtZW50LmNvb2tpZS5tYXRjaCgvdXNlcm5hbWU9KFswLTlhLXpBLVpfXSspL2kpWzFdO1xuICAgICAgICAkKFwiI3VzZXJuYW1lXCIpLnRleHQodXNlcm5hbWUpO1xuICAgIH1cbiAgICBvblNob3J0Y3V0S2V5KGNvbWJLZXksIHBhZ2UsIGZ1bmMpIHtcbiAgICAgICAgLy8gZipraW5nIGluY3JlZGlibGUgc2NvcGUgdGhpbmdzIVxuICAgICAgICB0aGlzLmtleWV2ZW50Lm9uKGNvbWJLZXksIChlKSA9PiB7XG4gICAgICAgICAgICBpZiAodGhpcy5wYWdlID09PSBwYWdlKSB7XG4gICAgICAgICAgICAgICAgZnVuYyhlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfVxuICAgIGdldFBhZ2VGcm9tVXJsKCkge1xuICAgICAgICBsZXQgcGFnZSA9IG5ldyBVUkwod2luZG93LmxvY2F0aW9uLnRvU3RyaW5nKCkpLnNlYXJjaFBhcmFtcy5nZXQoXCJwYWdlXCIpO1xuICAgICAgICBpZiAoIXBhZ2UpIHtcbiAgICAgICAgICAgIHBhZ2UgPSBcInBhZ2UtbmhhcC1ob2EtZG9uXCI7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHBhZ2U7XG4gICAgfVxuICAgIGhhbmRsZVN3aXRjaFBhZ2UoKSB7XG4gICAgICAgIGNvbnN0ICR0aGlzID0gdGhpcztcbiAgICAgICAgJChcIi5zaWRlYmFyLXN3aXRjaC1wYWdlXCIpLm9uKFwiY2xpY2tcIiwgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgY29uc3QgaWQgPSAkKHRoaXMpLmRhdGEoXCJ0YXJnZXRcIik7XG4gICAgICAgICAgICAkdGhpcy5zd2l0Y2hUb1BhZ2UoaWQpO1xuICAgICAgICB9KTtcbiAgICB9XG4gICAgc3dpdGNoVG9QYWdlKGlkKSB7XG4gICAgICAgIHRoaXMucGFnZSA9IGlkO1xuICAgICAgICB3aW5kb3cuaGlzdG9yeS5yZXBsYWNlU3RhdGUobnVsbCwgaWQsIFwiLz9wYWdlPVwiICsgaWQpO1xuICAgICAgICBjb25zdCBjb250YWluZXIgPSAkKFwiLmZyYW1lLWNvbnRhaW5lclwiKTtcbiAgICAgICAgY29uc3QgcGFnZSA9ICQoXCIjXCIgKyBpZCk7XG4gICAgICAgIGNvbnRhaW5lci5hbmltYXRlKHtcbiAgICAgICAgICAgIHNjcm9sbFRvcDogcGFnZS5vZmZzZXQoKS50b3AgLSBjb250YWluZXIub2Zmc2V0KCkudG9wICsgY29udGFpbmVyLnNjcm9sbFRvcCgpLFxuICAgICAgICB9KTtcbiAgICB9XG4gICAgaGFuZGxlU2V0dGluZygpIHtcbiAgICAgICAgLy9cbiAgICB9XG4gICAgaGFuZGxlTW9kYWwoKSB7XG4gICAgICAgICQoXCIubW9kYWxcIikub24oXCJzaG93bi5icy5tb2RhbFwiLCAoKSA9PiB7XG4gICAgICAgICAgICB0aGlzLmtleWV2ZW50LmJsb2NrKCk7XG4gICAgICAgIH0pO1xuICAgICAgICAkKFwiLm1vZGFsXCIpLm9uKFwiaGlkZGVuLmJzLm1vZGFsXCIsICgpID0+IHtcbiAgICAgICAgICAgIHRoaXMua2V5ZXZlbnQudW5ibG9jaygpO1xuICAgICAgICB9KTtcbiAgICB9XG59XG5leHBvcnRzLkFwcCA9IEFwcDtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPUFwcC5qcy5tYXAiLCJcInVzZSBzdHJpY3RcIjtcbnZhciBfX2F3YWl0ZXIgPSAodGhpcyAmJiB0aGlzLl9fYXdhaXRlcikgfHwgZnVuY3Rpb24gKHRoaXNBcmcsIF9hcmd1bWVudHMsIFAsIGdlbmVyYXRvcikge1xuICAgIHJldHVybiBuZXcgKFAgfHwgKFAgPSBQcm9taXNlKSkoZnVuY3Rpb24gKHJlc29sdmUsIHJlamVjdCkge1xuICAgICAgICBmdW5jdGlvbiBmdWxmaWxsZWQodmFsdWUpIHsgdHJ5IHsgc3RlcChnZW5lcmF0b3IubmV4dCh2YWx1ZSkpOyB9IGNhdGNoIChlKSB7IHJlamVjdChlKTsgfSB9XG4gICAgICAgIGZ1bmN0aW9uIHJlamVjdGVkKHZhbHVlKSB7IHRyeSB7IHN0ZXAoZ2VuZXJhdG9yW1widGhyb3dcIl0odmFsdWUpKTsgfSBjYXRjaCAoZSkgeyByZWplY3QoZSk7IH0gfVxuICAgICAgICBmdW5jdGlvbiBzdGVwKHJlc3VsdCkgeyByZXN1bHQuZG9uZSA/IHJlc29sdmUocmVzdWx0LnZhbHVlKSA6IG5ldyBQKGZ1bmN0aW9uIChyZXNvbHZlKSB7IHJlc29sdmUocmVzdWx0LnZhbHVlKTsgfSkudGhlbihmdWxmaWxsZWQsIHJlamVjdGVkKTsgfVxuICAgICAgICBzdGVwKChnZW5lcmF0b3IgPSBnZW5lcmF0b3IuYXBwbHkodGhpc0FyZywgX2FyZ3VtZW50cyB8fCBbXSkpLm5leHQoKSk7XG4gICAgfSk7XG59O1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuY2xhc3MgQXV0b0NvbXBsZXRlIHtcbiAgICBjb25zdHJ1Y3Rvcih0YXJnZXQsIG1vZGVsKSB7XG4gICAgICAgIGlmICh0eXBlb2YgdGFyZ2V0ID09PSBcInN0cmluZ1wiKSB7XG4gICAgICAgICAgICB0aGlzLnRhcmdldCA9ICQoXCIjXCIgKyB0YXJnZXQpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgdGhpcy50YXJnZXQgPSB0YXJnZXQ7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy50YXJnZXQuYXR0cihcImF1dG9jb21wbGV0ZVwiLCBcIm9mZlwiKTtcbiAgICAgICAgdGhpcy5tb2RlbCA9IG1vZGVsO1xuICAgIH1cbiAgICBvbkNob29zZShmdW5jKSB7XG4gICAgICAgIHRoaXMuZnVuY09uQ2hvb3NlID0gZnVuYztcbiAgICB9XG4gICAgaXNTaG93ZWQoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmVsZW1lbnQuY2hpbGRyZW4ubGVuZ3RoID4gMDtcbiAgICB9XG4gICAgLyoqXG4gICAgICogc2V0IGZpZWxkbmFtZSB0byBzaG93XG4gICAgICogQHBhcmFtIGxvb2t1cCB7ZmllbGROYW1lOiBFbGVtZW50SWR9XG4gICAgICovXG4gICAgc2V0TG9va3VwKGxvb2t1cCkge1xuICAgICAgICB0aGlzLmxvb2t1cCA9IGxvb2t1cDtcbiAgICB9XG4gICAgbGlzdGVuKCkge1xuICAgICAgICB0aGlzLnRhcmdldC5vbihcImtleXVwXCIsIChlKSA9PiB7XG4gICAgICAgICAgICBjb25zdCBrZXkgPSBlLmtleTtcbiAgICAgICAgICAgIHN3aXRjaCAoa2V5KSB7XG4gICAgICAgICAgICAgICAgY2FzZSBcIkVudGVyXCI6IHtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGNhc2UgXCJFc2NhcGVcIjoge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnJlbW92ZSgpO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgY2FzZSBcIkFycm93VXBcIjoge1xuICAgICAgICAgICAgICAgICAgICAvLyB0byBkb1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgY2FzZSBcIkFycm93RG93blwiOiB7XG4gICAgICAgICAgICAgICAgICAgIC8vIHRvIGRvXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBkZWZhdWx0OiB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHZhbCA9IHRoaXMudGFyZ2V0LnZhbCgpO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnJlbW92ZSgpO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnJlbmRlcih2YWwpLnRoZW4oKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5zaG93KCk7XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfVxuICAgIHJlbmRlcihzZWFyY2gpIHtcbiAgICAgICAgcmV0dXJuIF9fYXdhaXRlcih0aGlzLCB2b2lkIDAsIHZvaWQgMCwgZnVuY3Rpb24qICgpIHtcbiAgICAgICAgICAgIHRoaXMuZWxlbWVudCA9ICQoXCI8dWwvPlwiKS5hZGRDbGFzcyhcIm15LWF1dG9jb21wbGV0ZSBzaGFkb3ctbGcgcm91bmRlZFwiKTtcbiAgICAgICAgICAgIHRoaXMuZWxlbWVudC5jc3Moe1xuICAgICAgICAgICAgICAgIHRvcDogdGhpcy50YXJnZXQub2Zmc2V0KCkudG9wICsgdGhpcy50YXJnZXQub3V0ZXJIZWlnaHQoKSxcbiAgICAgICAgICAgICAgICBsZWZ0OiB0aGlzLnRhcmdldC5vZmZzZXQoKS5sZWZ0LFxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBjb25zdCBkYXRhID0geWllbGQgdGhpcy5nZXREYXRhKHNlYXJjaCk7XG4gICAgICAgICAgICB0aGlzLmN1cnJlbnRPZmZzZXQgPSAwO1xuICAgICAgICAgICAgbGV0IG9mZnNldCA9IDA7XG4gICAgICAgICAgICBmb3IgKGNvbnN0IGRhdGFSb3cgb2YgZGF0YSkge1xuICAgICAgICAgICAgICAgIGNvbnN0IGRhdGFSb3dGaWx0ZXJlZCA9IHRoaXMuZmlsdGVyRGF0YVdpdGhMb29rdXAoZGF0YVJvdyk7XG4gICAgICAgICAgICAgICAgY29uc3Qgcm93RWxlbWVudCA9IHRoaXMucmVuZGVyUm93KGRhdGFSb3dGaWx0ZXJlZCwgb2Zmc2V0KyspO1xuICAgICAgICAgICAgICAgIHJvd0VsZW1lbnQub24oXCJjbGljayBrZXlkb3duXCIsIChlKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChlLnR5cGUgPT09IFwiY2xpY2tcIiB8fCBlLmtleSA9PT0gXCJFbnRlclwiKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICAgICAgICAgICAgICBlLnN0b3BQcm9wYWdhdGlvbigpO1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5mdW5jT25DaG9vc2UoZGF0YVJvdyk7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnJlbW92ZSgpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgdGhpcy5lbGVtZW50LmFwcGVuZChyb3dFbGVtZW50KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfVxuICAgIHNob3coKSB7XG4gICAgICAgICQoXCJib2R5XCIpLmFwcGVuZCh0aGlzLmVsZW1lbnQpO1xuICAgIH1cbiAgICByZW1vdmUoKSB7XG4gICAgICAgICQoXCIubXktYXV0b2NvbXBsZXRlXCIpLnJlbW92ZSgpO1xuICAgIH1cbiAgICBnZXREYXRhKHNlYXJjaCkge1xuICAgICAgICByZXR1cm4gX19hd2FpdGVyKHRoaXMsIHZvaWQgMCwgdm9pZCAwLCBmdW5jdGlvbiogKCkge1xuICAgICAgICAgICAgY29uc3QgZGF0YSA9IHlpZWxkIHRoaXMubW9kZWwuZ2V0KHNlYXJjaCwgMCwgMjApOyAvLyAyMCBpcyBmb3IgdGVzdCBmaXJzdCwgd2lsbCBkZXZlbG9wIGluIGZ1dHVyZVxuICAgICAgICAgICAgcmV0dXJuIGRhdGE7XG4gICAgICAgIH0pO1xuICAgIH1cbiAgICByZW5kZXJSb3coZGF0YVJvdywgb2Zmc2V0KSB7XG4gICAgICAgIGNvbnN0IHJvdyA9ICQoXCI8bGkvPlwiKS5kYXRhKFwib2Zmc2V0XCIsIG9mZnNldCk7XG4gICAgICAgIGZvciAoY29uc3QgZmllbGQgb2YgT2JqZWN0LmtleXMoZGF0YVJvdykpIHtcbiAgICAgICAgICAgIGNvbnN0IHZhbCA9IGRhdGFSb3dbZmllbGRdO1xuICAgICAgICAgICAgcm93LmFwcGVuZCgkKFwiPGRpdi8+XCIpLnRleHQodmFsKSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHJvdztcbiAgICB9XG4gICAgZmlsdGVyRGF0YVdpdGhMb29rdXAoZGF0YVJvdykge1xuICAgICAgICBjb25zdCBmaWx0ZXJlZERhdGEgPSB7fTtcbiAgICAgICAgZm9yIChjb25zdCBrZXkgb2YgdGhpcy5sb29rdXApIHtcbiAgICAgICAgICAgIGlmIChkYXRhUm93Lmhhc093blByb3BlcnR5KGtleSkpIHtcbiAgICAgICAgICAgICAgICBmaWx0ZXJlZERhdGFba2V5XSA9IGRhdGFSb3dba2V5XTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZmlsdGVyZWREYXRhO1xuICAgIH1cbn1cbmV4cG9ydHMuQXV0b0NvbXBsZXRlID0gQXV0b0NvbXBsZXRlO1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9aW5kZXguanMubWFwIiwiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5jbGFzcyBLZXlFdmVudCB7XG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHRoaXMuZXZlbnRBdHRhY2ggPSB7fTtcbiAgICAgICAgdGhpcy5pc0Jsb2NraW5nID0gZmFsc2U7XG4gICAgICAgICQoZG9jdW1lbnQpLm9uKFwia2V5ZG93blwiLCAoZSkgPT4ge1xuICAgICAgICAgICAgaWYgKHRoaXMuaXNCbG9ja2luZykge1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGxldCBjb21iS2V5ID0gXCJcIjtcbiAgICAgICAgICAgIGlmIChlLmN0cmxLZXkpIHtcbiAgICAgICAgICAgICAgICBjb21iS2V5ID0gXCJjdHJsK1wiO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY29tYktleSArPSBlLmtleTtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKGNvbWJLZXkpO1xuICAgICAgICAgICAgaWYgKHRoaXMuZXZlbnRBdHRhY2guaGFzT3duUHJvcGVydHkoY29tYktleSkpIHtcbiAgICAgICAgICAgICAgICBjb25zdCBsaXN0RnVuYyA9IHRoaXMuZXZlbnRBdHRhY2hbY29tYktleV07XG4gICAgICAgICAgICAgICAgZm9yIChjb25zdCBmdW5jIG9mIGxpc3RGdW5jKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmICh0eXBlb2YgZnVuYyA9PT0gXCJmdW5jdGlvblwiKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBmdW5jKGUpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9XG4gICAgb24oY29tYktleSwgZnVuYykge1xuICAgICAgICBpZiAoIXRoaXMuZXZlbnRBdHRhY2hbY29tYktleV0pIHtcbiAgICAgICAgICAgIHRoaXMuZXZlbnRBdHRhY2hbY29tYktleV0gPSBbXTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmV2ZW50QXR0YWNoW2NvbWJLZXldLnB1c2goZnVuYyk7XG4gICAgfVxuICAgIGJsb2NrKCkge1xuICAgICAgICB0aGlzLmlzQmxvY2tpbmcgPSB0cnVlO1xuICAgIH1cbiAgICB1bmJsb2NrKCkge1xuICAgICAgICB0aGlzLmlzQmxvY2tpbmcgPSBmYWxzZTtcbiAgICB9XG59XG5leHBvcnRzLktleUV2ZW50ID0gS2V5RXZlbnQ7XG4vLyMgc291cmNlTWFwcGluZ1VSTD1pbmRleC5qcy5tYXAiLCJcInVzZSBzdHJpY3RcIjtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmNsYXNzIE1lbnVDb250ZXh0IHtcbiAgICBjb25zdHJ1Y3Rvcih0YXJnZXQpIHtcbiAgICAgICAgaWYgKHR5cGVvZiB0YXJnZXQgPT09IFwic3RyaW5nXCIpIHtcbiAgICAgICAgICAgIHRoaXMudGFyZ2V0ID0gJChcIiNcIiArIHRhcmdldCk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICB0aGlzLnRhcmdldCA9IHRhcmdldDtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLnRhcmdldC5vbihcImNvbnRleHRtZW51XCIsIChlKSA9PiB7XG4gICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICBlLnN0b3BQcm9wYWdhdGlvbigpO1xuICAgICAgICAgICAgdGhpcy5yZW1vdmUoKS5yZW5kZXIoeyB4OiBlLmNsaWVudFgsIHk6IGUuY2xpZW50WSB9KS5zaG93KCk7XG4gICAgICAgIH0pO1xuICAgICAgICB0aGlzLm1lbnUgPSBbXTtcbiAgICB9XG4gICAgYWRkQ29udGV4dChwcm9wKSB7XG4gICAgICAgIHRoaXMubWVudS5wdXNoKHByb3ApO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG4gICAgcmVuZGVyKHBvcykge1xuICAgICAgICB0aGlzLmVsZW1lbnQgPSAkKFwiPHVsLz5cIikuYWRkQ2xhc3MoXCJzaGFkb3ctbGcgcm91bmRlZCBteS1jb250ZXh0bWVudVwiKTtcbiAgICAgICAgdGhpcy5lbGVtZW50LmNzcyhcInRvcFwiLCBwb3MueSArIFwicHhcIik7XG4gICAgICAgIHRoaXMuZWxlbWVudC5jc3MoXCJsZWZ0XCIsIHBvcy54ICsgXCJweFwiKTtcbiAgICAgICAgZm9yIChjb25zdCBjdHggb2YgdGhpcy5tZW51KSB7XG4gICAgICAgICAgICB0aGlzLmVsZW1lbnQuYXBwZW5kKHRoaXMucmVuZGVyQ29udGV4dChjdHgpKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmVsZW1lbnQuaGlkZSgpO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG4gICAgc2hvdygpIHtcbiAgICAgICAgJChcImJvZHlcIikuYXBwZW5kKHRoaXMuZWxlbWVudCk7XG4gICAgICAgIHRoaXMuZWxlbWVudC5zbGlkZURvd24oMC41KTtcbiAgICAgICAgJChkb2N1bWVudCkub2ZmKFwiY2xpY2tcIiwgdGhpcy5yZW1vdmUpLm9uKFwiY2xpY2tcIiwgdGhpcy5yZW1vdmUpO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG4gICAgcmVtb3ZlKCkge1xuICAgICAgICAkKFwiLm15LWNvbnRleHRtZW51XCIpLnJlbW92ZSgpO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG4gICAgcmVuZGVyQ29udGV4dChwcm9wKSB7XG4gICAgICAgIGNvbnN0IGNvbnRleHQgPSAkKFwiPGxpLz5cIik7XG4gICAgICAgIGNvbnRleHQuaHRtbChgPGkgY2xhc3M9JyR7cHJvcC5pY29ufSAke3Byb3AuY2xhc3NOYW1lfSc+PC9pPiAke3Byb3AudGl0bGV9YCk7XG4gICAgICAgIGNvbnRleHQub24oXCJjbGlja1wiLCAoZSkgPT4ge1xuICAgICAgICAgICAgdGhpcy5yZW1vdmUoKTtcbiAgICAgICAgICAgIHByb3AuY2xpY2soZSk7XG4gICAgICAgIH0pO1xuICAgICAgICByZXR1cm4gY29udGV4dDtcbiAgICB9XG59XG5leHBvcnRzLk1lbnVDb250ZXh0ID0gTWVudUNvbnRleHQ7XG4vLyMgc291cmNlTWFwcGluZ1VSTD1pbmRleC5qcy5tYXAiLCJcInVzZSBzdHJpY3RcIjtcbnZhciBfX2F3YWl0ZXIgPSAodGhpcyAmJiB0aGlzLl9fYXdhaXRlcikgfHwgZnVuY3Rpb24gKHRoaXNBcmcsIF9hcmd1bWVudHMsIFAsIGdlbmVyYXRvcikge1xuICAgIHJldHVybiBuZXcgKFAgfHwgKFAgPSBQcm9taXNlKSkoZnVuY3Rpb24gKHJlc29sdmUsIHJlamVjdCkge1xuICAgICAgICBmdW5jdGlvbiBmdWxmaWxsZWQodmFsdWUpIHsgdHJ5IHsgc3RlcChnZW5lcmF0b3IubmV4dCh2YWx1ZSkpOyB9IGNhdGNoIChlKSB7IHJlamVjdChlKTsgfSB9XG4gICAgICAgIGZ1bmN0aW9uIHJlamVjdGVkKHZhbHVlKSB7IHRyeSB7IHN0ZXAoZ2VuZXJhdG9yW1widGhyb3dcIl0odmFsdWUpKTsgfSBjYXRjaCAoZSkgeyByZWplY3QoZSk7IH0gfVxuICAgICAgICBmdW5jdGlvbiBzdGVwKHJlc3VsdCkgeyByZXN1bHQuZG9uZSA/IHJlc29sdmUocmVzdWx0LnZhbHVlKSA6IG5ldyBQKGZ1bmN0aW9uIChyZXNvbHZlKSB7IHJlc29sdmUocmVzdWx0LnZhbHVlKTsgfSkudGhlbihmdWxmaWxsZWQsIHJlamVjdGVkKTsgfVxuICAgICAgICBzdGVwKChnZW5lcmF0b3IgPSBnZW5lcmF0b3IuYXBwbHkodGhpc0FyZywgX2FyZ3VtZW50cyB8fCBbXSkpLm5leHQoKSk7XG4gICAgfSk7XG59O1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuY29uc3QgTW9kZWxDbGFzc18xID0gcmVxdWlyZShcIi4uL01vZGVsQ2xhc3NcIik7XG5jbGFzcyBCYW5nR2lhIGV4dGVuZHMgTW9kZWxDbGFzc18xLk1vZGVsIHtcbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgc3VwZXIoKTtcbiAgICAgICAgdGhpcy5kYXRhYmFzZSA9IFwiL2FwaS9wcmljZS9cIjtcbiAgICB9XG4gICAgZ2V0KG1hVGh1b2MpIHtcbiAgICAgICAgcmV0dXJuIF9fYXdhaXRlcih0aGlzLCB2b2lkIDAsIHZvaWQgMCwgZnVuY3Rpb24qICgpIHtcbiAgICAgICAgICAgIGNvbnN0IGRhdGEgPSB5aWVsZCB0aGlzLl9nZXQoeyBtYTogbWFUaHVvYyB9KTtcbiAgICAgICAgICAgIHJldHVybiBkYXRhO1xuICAgICAgICB9KTtcbiAgICB9XG4gICAgYWRkKG1hVGh1b2MsIGdpYU1vaSkge1xuICAgICAgICByZXR1cm4gX19hd2FpdGVyKHRoaXMsIHZvaWQgMCwgdm9pZCAwLCBmdW5jdGlvbiogKCkge1xuICAgICAgICAgICAgY29uc3QgcmVzID0geWllbGQgdGhpcy5fcG9zdCh7IG1hOiBtYVRodW9jLCBwcmljZTogZ2lhTW9pIH0pO1xuICAgICAgICAgICAgcmV0dXJuIHJlcztcbiAgICAgICAgfSk7XG4gICAgfVxufVxuZXhwb3J0cy5CYW5nR2lhID0gQmFuZ0dpYTtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWluZGV4LmpzLm1hcCIsIlwidXNlIHN0cmljdFwiO1xudmFyIF9fYXdhaXRlciA9ICh0aGlzICYmIHRoaXMuX19hd2FpdGVyKSB8fCBmdW5jdGlvbiAodGhpc0FyZywgX2FyZ3VtZW50cywgUCwgZ2VuZXJhdG9yKSB7XG4gICAgcmV0dXJuIG5ldyAoUCB8fCAoUCA9IFByb21pc2UpKShmdW5jdGlvbiAocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgICAgIGZ1bmN0aW9uIGZ1bGZpbGxlZCh2YWx1ZSkgeyB0cnkgeyBzdGVwKGdlbmVyYXRvci5uZXh0KHZhbHVlKSk7IH0gY2F0Y2ggKGUpIHsgcmVqZWN0KGUpOyB9IH1cbiAgICAgICAgZnVuY3Rpb24gcmVqZWN0ZWQodmFsdWUpIHsgdHJ5IHsgc3RlcChnZW5lcmF0b3JbXCJ0aHJvd1wiXSh2YWx1ZSkpOyB9IGNhdGNoIChlKSB7IHJlamVjdChlKTsgfSB9XG4gICAgICAgIGZ1bmN0aW9uIHN0ZXAocmVzdWx0KSB7IHJlc3VsdC5kb25lID8gcmVzb2x2ZShyZXN1bHQudmFsdWUpIDogbmV3IFAoZnVuY3Rpb24gKHJlc29sdmUpIHsgcmVzb2x2ZShyZXN1bHQudmFsdWUpOyB9KS50aGVuKGZ1bGZpbGxlZCwgcmVqZWN0ZWQpOyB9XG4gICAgICAgIHN0ZXAoKGdlbmVyYXRvciA9IGdlbmVyYXRvci5hcHBseSh0aGlzQXJnLCBfYXJndW1lbnRzIHx8IFtdKSkubmV4dCgpKTtcbiAgICB9KTtcbn07XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5jb25zdCBNb2RlbENsYXNzXzEgPSByZXF1aXJlKFwiLi4vTW9kZWxDbGFzc1wiKTtcbmNsYXNzIERvblZpIGV4dGVuZHMgTW9kZWxDbGFzc18xLk1vZGVsIHtcbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgc3VwZXIoKTtcbiAgICAgICAgdGhpcy5kYXRhYmFzZSA9IFwiL2FwaS9kb25fdmkvXCI7XG4gICAgfVxuICAgIGdldChjYWxsYmFjaykge1xuICAgICAgICByZXR1cm4gX19hd2FpdGVyKHRoaXMsIHZvaWQgMCwgdm9pZCAwLCBmdW5jdGlvbiogKCkge1xuICAgICAgICAgICAgY29uc3QgZGF0YSA9IHlpZWxkIHRoaXMuX2dldCh7fSk7XG4gICAgICAgICAgICB0aGlzLmRhdGEgPSBkYXRhO1xuICAgICAgICAgICAgaWYgKHR5cGVvZiBjYWxsYmFjayA9PT0gXCJmdW5jdGlvblwiKSB7XG4gICAgICAgICAgICAgICAgY2FsbGJhY2soZGF0YSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5kYXRhO1xuICAgICAgICB9KTtcbiAgICB9XG4gICAgcmVuZGVyU2VsZWN0SW5wdXQodGFyZ2V0KSB7XG4gICAgICAgIHJldHVybiBfX2F3YWl0ZXIodGhpcywgdm9pZCAwLCB2b2lkIDAsIGZ1bmN0aW9uKiAoKSB7XG4gICAgICAgICAgICBjb25zdCBkYXRhID0geWllbGQgdGhpcy5nZXQoKTtcbiAgICAgICAgICAgIHRhcmdldC5odG1sKFwiXCIpO1xuICAgICAgICAgICAgZm9yIChjb25zdCByb3cgb2YgZGF0YSkge1xuICAgICAgICAgICAgICAgIGNvbnN0IG9wdCA9ICQoXCI8b3B0aW9uLz5cIikudmFsKHJvdy5pZCkudGV4dChyb3cudGVuKTtcbiAgICAgICAgICAgICAgICB0YXJnZXQuYXBwZW5kKG9wdCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0YXJnZXQuY2hpbGRyZW4oKS5lcSgwKS5hdHRyKFwiY2hlY2tlZFwiLCBcInRydWVcIik7XG4gICAgICAgIH0pO1xuICAgIH1cbn1cbmV4cG9ydHMuRG9uVmkgPSBEb25WaTtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWluZGV4LmpzLm1hcCIsIlwidXNlIHN0cmljdFwiO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuY29uc3QgTW9kZWxDbGFzc18xID0gcmVxdWlyZShcIi4uL01vZGVsQ2xhc3NcIik7XG5jbGFzcyBIb2FEb24gZXh0ZW5kcyBNb2RlbENsYXNzXzEuTW9kZWwge1xuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICBzdXBlcigpO1xuICAgICAgICB0aGlzLmRhdGFiYXNlID0gXCIvYXBpL2hvYV9kb24vXCI7XG4gICAgfVxufVxuZXhwb3J0cy5Ib2FEb24gPSBIb2FEb247XG4vLyMgc291cmNlTWFwcGluZ1VSTD1pbmRleC5qcy5tYXAiLCJcInVzZSBzdHJpY3RcIjtcbnZhciBfX2F3YWl0ZXIgPSAodGhpcyAmJiB0aGlzLl9fYXdhaXRlcikgfHwgZnVuY3Rpb24gKHRoaXNBcmcsIF9hcmd1bWVudHMsIFAsIGdlbmVyYXRvcikge1xuICAgIHJldHVybiBuZXcgKFAgfHwgKFAgPSBQcm9taXNlKSkoZnVuY3Rpb24gKHJlc29sdmUsIHJlamVjdCkge1xuICAgICAgICBmdW5jdGlvbiBmdWxmaWxsZWQodmFsdWUpIHsgdHJ5IHsgc3RlcChnZW5lcmF0b3IubmV4dCh2YWx1ZSkpOyB9IGNhdGNoIChlKSB7IHJlamVjdChlKTsgfSB9XG4gICAgICAgIGZ1bmN0aW9uIHJlamVjdGVkKHZhbHVlKSB7IHRyeSB7IHN0ZXAoZ2VuZXJhdG9yW1widGhyb3dcIl0odmFsdWUpKTsgfSBjYXRjaCAoZSkgeyByZWplY3QoZSk7IH0gfVxuICAgICAgICBmdW5jdGlvbiBzdGVwKHJlc3VsdCkgeyByZXN1bHQuZG9uZSA/IHJlc29sdmUocmVzdWx0LnZhbHVlKSA6IG5ldyBQKGZ1bmN0aW9uIChyZXNvbHZlKSB7IHJlc29sdmUocmVzdWx0LnZhbHVlKTsgfSkudGhlbihmdWxmaWxsZWQsIHJlamVjdGVkKTsgfVxuICAgICAgICBzdGVwKChnZW5lcmF0b3IgPSBnZW5lcmF0b3IuYXBwbHkodGhpc0FyZywgX2FyZ3VtZW50cyB8fCBbXSkpLm5leHQoKSk7XG4gICAgfSk7XG59O1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuY2xhc3MgTW9kZWwge1xuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICB0aGlzLmRhdGFiYXNlID0gXCJcIjtcbiAgICAgICAgdGhpcy5kYXRhID0gW107XG4gICAgfVxuICAgIGdldCBmZXRjaERhdGEoKSB7XG4gICAgICAgIHJldHVybiBPYmplY3QuYXNzaWduKHt9LCB0aGlzLmRhdGEpO1xuICAgIH1cbiAgICBnZXQgcmVzcG9uc2UoKSB7XG4gICAgICAgIHJldHVybiBPYmplY3QuYXNzaWduKHt9LCB0aGlzLnJlcyk7XG4gICAgfVxuICAgIC8vID09PT09PT09PT09PT09PSBJTkhFUklUIEZVTkNcbiAgICBnZXQocGFyYW1zLCBvZmZzZXQsIGxpbWl0KSB7XG4gICAgICAgIHJldHVybiBfX2F3YWl0ZXIodGhpcywgdm9pZCAwLCB2b2lkIDAsIGZ1bmN0aW9uKiAoKSB7XG4gICAgICAgICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgICAgICB9KTtcbiAgICB9XG4gICAgY3JlYXRlKGRhdGEpIHtcbiAgICAgICAgcmV0dXJuIF9fYXdhaXRlcih0aGlzLCB2b2lkIDAsIHZvaWQgMCwgZnVuY3Rpb24qICgpIHtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfSk7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIHVwZGF0ZSByZWNvcmRcbiAgICAgKiBAcGFyYW0gZmllbGRNYXRjaCBtYXRjaCBmaWVsZCB0byB1cGRhdGUgcmVjb3JkXG4gICAgICogQHBhcmFtIGZpZWxkVXBkYXRlIHRoZSBkYXRhIG5lZWQgdXBkYXRlXG4gICAgICovXG4gICAgdXBkYXRlKGZpZWxkTWF0Y2gsIGZpZWxkVXBkYXRlKSB7XG4gICAgICAgIHJldHVybiBfX2F3YWl0ZXIodGhpcywgdm9pZCAwLCB2b2lkIDAsIGZ1bmN0aW9uKiAoKSB7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH0pO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiByZW1vdmUgYSByZWNvcmRcbiAgICAgKiBAcGFyYW0gZmllbGRNYXRjaCBmaWVsZCBtYXRjaCB0byByZW1vdmVcbiAgICAgKiBAcmV0dXJuIHRydWUgb2YgZmFsc2VcbiAgICAgKi9cbiAgICByZW1vdmUoZmllbGRNYXRjaCkge1xuICAgICAgICByZXR1cm4gX19hd2FpdGVyKHRoaXMsIHZvaWQgMCwgdm9pZCAwLCBmdW5jdGlvbiogKCkge1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9KTtcbiAgICB9XG4gICAgLy8gPT09PT09PT09PT09PT09IENPUkUgRlVOQ1xuICAgIC8qKlxuICAgICAqIGZldGNoIGRhdGEgZnJvbSBkYXRhYmFzZSBhbmQgZG8gdGhpbmdcbiAgICAgKiBAcGFyYW0gcGFyYW1zXG4gICAgICogQHBhcmFtIGNhbGxiYWNrIGNhbGxiYWNrIGZ1bmN0aW9uXG4gICAgICovXG4gICAgX2dldChwYXJhbXMsIGNhbGxiYWNrKSB7XG4gICAgICAgIHJldHVybiBfX2F3YWl0ZXIodGhpcywgdm9pZCAwLCB2b2lkIDAsIGZ1bmN0aW9uKiAoKSB7XG4gICAgICAgICAgICB0aGlzLmRhdGEgPSBbXTtcbiAgICAgICAgICAgIGNvbnN0IHJlcXVlc3RVUkwgPSB0aGlzLmRhdGFiYXNlICsgXCI/XCIgKyB0aGlzLl91cmxwYXJhbXMocGFyYW1zKTtcbiAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgY29uc3QgcmVzID0geWllbGQgZmV0Y2gocmVxdWVzdFVSTCwgeyBjcmVkZW50aWFsczogXCJpbmNsdWRlXCIgfSk7XG4gICAgICAgICAgICAgICAgY29uc3QganNvbiA9IHlpZWxkIHJlcy5qc29uKCk7XG4gICAgICAgICAgICAgICAgaWYgKGpzb24uZXJyKSB7XG4gICAgICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihqc29uLm1zZyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHRoaXMuZGF0YSA9IGpzb24uZGF0YTtcbiAgICAgICAgICAgICAgICBpZiAodHlwZW9mIGNhbGxiYWNrID09PSBcImZ1bmN0aW9uXCIpIHtcbiAgICAgICAgICAgICAgICAgICAgY2FsbGJhY2soZmFsc2UsIGpzb24uZGF0YSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHJldHVybiBqc29uLmRhdGE7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjYXRjaCAoZXJyKSB7XG4gICAgICAgICAgICAgICAgaWYgKHR5cGVvZiBjYWxsYmFjayA9PT0gXCJmdW5jdGlvblwiKSB7XG4gICAgICAgICAgICAgICAgICAgIGNhbGxiYWNrKGVycik7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICB0aHJvdyBlcnI7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogcG9zdCByZXF1ZXN0XG4gICAgICogQHBhcmFtIHthbnl9IGRhdGFcbiAgICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBbY2FsbGJhY2tdXG4gICAgICovXG4gICAgX3Bvc3QoZGF0YSwgY2FsbGJhY2spIHtcbiAgICAgICAgcmV0dXJuIF9fYXdhaXRlcih0aGlzLCB2b2lkIDAsIHZvaWQgMCwgZnVuY3Rpb24qICgpIHtcbiAgICAgICAgICAgIHRoaXMucmVzID0gXCJcIjtcbiAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgY29uc3QgcmVzID0geWllbGQgZmV0Y2godGhpcy5kYXRhYmFzZSwge1xuICAgICAgICAgICAgICAgICAgICBib2R5OiBKU09OLnN0cmluZ2lmeShkYXRhKSxcbiAgICAgICAgICAgICAgICAgICAgY3JlZGVudGlhbHM6IFwiaW5jbHVkZVwiLFxuICAgICAgICAgICAgICAgICAgICBoZWFkZXJzOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBcIkNvbnRlbnQtVHlwZVwiOiBcImFwcGxpY2F0aW9uL2pzb25cIixcbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgbWV0aG9kOiBcIlBPU1RcIixcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICBjb25zdCBqc29uID0geWllbGQgcmVzLmpzb24oKTtcbiAgICAgICAgICAgICAgICBpZiAoanNvbi5lcnIpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGpzb24ubXNnKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgdGhpcy5yZXMgPSBqc29uLmRhdGE7XG4gICAgICAgICAgICAgICAgaWYgKHR5cGVvZiBjYWxsYmFjayA9PT0gXCJmdW5jdGlvblwiKSB7XG4gICAgICAgICAgICAgICAgICAgIGNhbGxiYWNrKGZhbHNlLCBqc29uLmRhdGEpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICByZXR1cm4ganNvbi5kYXRhO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY2F0Y2ggKGVycikge1xuICAgICAgICAgICAgICAgIGlmICh0eXBlb2YgY2FsbGJhY2sgPT09IFwiZnVuY3Rpb25cIikge1xuICAgICAgICAgICAgICAgICAgICBjYWxsYmFjayhlcnIpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgdGhyb3cgZXJyO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfVxuICAgIF9wdXQoZGF0YSkge1xuICAgICAgICByZXR1cm4gX19hd2FpdGVyKHRoaXMsIHZvaWQgMCwgdm9pZCAwLCBmdW5jdGlvbiogKCkge1xuICAgICAgICAgICAgdGhpcy5yZXMgPSBcIlwiO1xuICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICBjb25zdCByZXMgPSB5aWVsZCBmZXRjaCh0aGlzLmRhdGFiYXNlLCB7XG4gICAgICAgICAgICAgICAgICAgIGJvZHk6IEpTT04uc3RyaW5naWZ5KGRhdGEpLFxuICAgICAgICAgICAgICAgICAgICBjcmVkZW50aWFsczogXCJpbmNsdWRlXCIsXG4gICAgICAgICAgICAgICAgICAgIGhlYWRlcnM6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiQ29udGVudC1UeXBlXCI6IFwiYXBwbGljYXRpb24vanNvblwiLFxuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICBtZXRob2Q6IFwiUFVUXCIsXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgY29uc3QganNvbiA9IHlpZWxkIHJlcy5qc29uKCk7XG4gICAgICAgICAgICAgICAgaWYgKGpzb24uZXJyKSB7XG4gICAgICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihqc29uLm1zZyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHRoaXMucmVzID0ganNvbi5kYXRhO1xuICAgICAgICAgICAgICAgIHJldHVybiBqc29uLmRhdGE7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjYXRjaCAoZXJyKSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgZXJyO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9XG4gICAgX3VybHBhcmFtcyhwYXJhbXMpIHtcbiAgICAgICAgY29uc3QgdXJsID0gT2JqZWN0LmtleXMocGFyYW1zKS5tYXAoKGspID0+IHtcbiAgICAgICAgICAgIHJldHVybiBlbmNvZGVVUklDb21wb25lbnQoaykgKyBcIj1cIiArIGVuY29kZVVSSUNvbXBvbmVudChwYXJhbXNba10pO1xuICAgICAgICB9KS5qb2luKFwiJlwiKTtcbiAgICAgICAgcmV0dXJuIHVybDtcbiAgICB9XG59XG5leHBvcnRzLk1vZGVsID0gTW9kZWw7XG4vLyMgc291cmNlTWFwcGluZ1VSTD1pbmRleC5qcy5tYXAiLCJcInVzZSBzdHJpY3RcIjtcbnZhciBfX2F3YWl0ZXIgPSAodGhpcyAmJiB0aGlzLl9fYXdhaXRlcikgfHwgZnVuY3Rpb24gKHRoaXNBcmcsIF9hcmd1bWVudHMsIFAsIGdlbmVyYXRvcikge1xuICAgIHJldHVybiBuZXcgKFAgfHwgKFAgPSBQcm9taXNlKSkoZnVuY3Rpb24gKHJlc29sdmUsIHJlamVjdCkge1xuICAgICAgICBmdW5jdGlvbiBmdWxmaWxsZWQodmFsdWUpIHsgdHJ5IHsgc3RlcChnZW5lcmF0b3IubmV4dCh2YWx1ZSkpOyB9IGNhdGNoIChlKSB7IHJlamVjdChlKTsgfSB9XG4gICAgICAgIGZ1bmN0aW9uIHJlamVjdGVkKHZhbHVlKSB7IHRyeSB7IHN0ZXAoZ2VuZXJhdG9yW1widGhyb3dcIl0odmFsdWUpKTsgfSBjYXRjaCAoZSkgeyByZWplY3QoZSk7IH0gfVxuICAgICAgICBmdW5jdGlvbiBzdGVwKHJlc3VsdCkgeyByZXN1bHQuZG9uZSA/IHJlc29sdmUocmVzdWx0LnZhbHVlKSA6IG5ldyBQKGZ1bmN0aW9uIChyZXNvbHZlKSB7IHJlc29sdmUocmVzdWx0LnZhbHVlKTsgfSkudGhlbihmdWxmaWxsZWQsIHJlamVjdGVkKTsgfVxuICAgICAgICBzdGVwKChnZW5lcmF0b3IgPSBnZW5lcmF0b3IuYXBwbHkodGhpc0FyZywgX2FyZ3VtZW50cyB8fCBbXSkpLm5leHQoKSk7XG4gICAgfSk7XG59O1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuY29uc3QgTW9kZWxDbGFzc18xID0gcmVxdWlyZShcIi4uL01vZGVsQ2xhc3NcIik7XG5jbGFzcyBOY2MgZXh0ZW5kcyBNb2RlbENsYXNzXzEuTW9kZWwge1xuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICBzdXBlcigpO1xuICAgICAgICB0aGlzLmRhdGFiYXNlID0gXCIvYXBpL25jYy9cIjtcbiAgICB9XG4gICAgLyoqXG4gICAgICogZ2V0IGRhdGEgb2YgbnN4XG4gICAgICogQHBhcmFtIGNhbGxiYWNrIGNhbGxiYWNrIGZ1bmN0aW9uXG4gICAgICovXG4gICAgZ2V0KHBhcmFtcykge1xuICAgICAgICByZXR1cm4gX19hd2FpdGVyKHRoaXMsIHZvaWQgMCwgdm9pZCAwLCBmdW5jdGlvbiogKCkge1xuICAgICAgICAgICAgY29uc3QgZGF0YSA9IHlpZWxkIHRoaXMuX2dldCh7IHE6IHBhcmFtcyB9KTtcbiAgICAgICAgICAgIHJldHVybiBkYXRhO1xuICAgICAgICB9KTtcbiAgICB9XG59XG5leHBvcnRzLk5jYyA9IE5jYztcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWluZGV4LmpzLm1hcCIsIlwidXNlIHN0cmljdFwiO1xudmFyIF9fYXdhaXRlciA9ICh0aGlzICYmIHRoaXMuX19hd2FpdGVyKSB8fCBmdW5jdGlvbiAodGhpc0FyZywgX2FyZ3VtZW50cywgUCwgZ2VuZXJhdG9yKSB7XG4gICAgcmV0dXJuIG5ldyAoUCB8fCAoUCA9IFByb21pc2UpKShmdW5jdGlvbiAocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgICAgIGZ1bmN0aW9uIGZ1bGZpbGxlZCh2YWx1ZSkgeyB0cnkgeyBzdGVwKGdlbmVyYXRvci5uZXh0KHZhbHVlKSk7IH0gY2F0Y2ggKGUpIHsgcmVqZWN0KGUpOyB9IH1cbiAgICAgICAgZnVuY3Rpb24gcmVqZWN0ZWQodmFsdWUpIHsgdHJ5IHsgc3RlcChnZW5lcmF0b3JbXCJ0aHJvd1wiXSh2YWx1ZSkpOyB9IGNhdGNoIChlKSB7IHJlamVjdChlKTsgfSB9XG4gICAgICAgIGZ1bmN0aW9uIHN0ZXAocmVzdWx0KSB7IHJlc3VsdC5kb25lID8gcmVzb2x2ZShyZXN1bHQudmFsdWUpIDogbmV3IFAoZnVuY3Rpb24gKHJlc29sdmUpIHsgcmVzb2x2ZShyZXN1bHQudmFsdWUpOyB9KS50aGVuKGZ1bGZpbGxlZCwgcmVqZWN0ZWQpOyB9XG4gICAgICAgIHN0ZXAoKGdlbmVyYXRvciA9IGdlbmVyYXRvci5hcHBseSh0aGlzQXJnLCBfYXJndW1lbnRzIHx8IFtdKSkubmV4dCgpKTtcbiAgICB9KTtcbn07XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5jb25zdCBNb2RlbENsYXNzXzEgPSByZXF1aXJlKFwiLi4vTW9kZWxDbGFzc1wiKTtcbmNsYXNzIFRodW9jIGV4dGVuZHMgTW9kZWxDbGFzc18xLk1vZGVsIHtcbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgc3VwZXIoKTtcbiAgICAgICAgdGhpcy5kYXRhYmFzZSA9IFwiL2FwaS90aHVvYy9cIjtcbiAgICB9XG4gICAgZ2V0KHBhcmFtcywgb2Zmc2V0LCBsaW1pdCkge1xuICAgICAgICByZXR1cm4gX19hd2FpdGVyKHRoaXMsIHZvaWQgMCwgdm9pZCAwLCBmdW5jdGlvbiogKCkge1xuICAgICAgICAgICAgcmV0dXJuIHlpZWxkIHRoaXMuX2dldCh7IHE6IHBhcmFtcywgb2Zmc2V0LCBsaW1pdCB9KTtcbiAgICAgICAgfSk7XG4gICAgfVxuICAgIGNyZWF0ZShkYXRhKSB7XG4gICAgICAgIHJldHVybiBfX2F3YWl0ZXIodGhpcywgdm9pZCAwLCB2b2lkIDAsIGZ1bmN0aW9uKiAoKSB7XG4gICAgICAgICAgICB0aGlzLnJlcyA9IHlpZWxkIHRoaXMuX3Bvc3QoZGF0YSk7XG4gICAgICAgICAgICByZXR1cm4gKHRoaXMucmVzKTtcbiAgICAgICAgfSk7XG4gICAgfVxuICAgIGFkZChtYSwgc29MdW9uZywgdG9uZ0dpYSkge1xuICAgICAgICByZXR1cm4gX19hd2FpdGVyKHRoaXMsIHZvaWQgMCwgdm9pZCAwLCBmdW5jdGlvbiogKCkge1xuICAgICAgICAgICAgdGhpcy5yZXMgPSB5aWVsZCB0aGlzLl9wb3N0KHtcbiAgICAgICAgICAgICAgICBtYSxcbiAgICAgICAgICAgICAgICBzb19sdW9uZzogc29MdW9uZyxcbiAgICAgICAgICAgICAgICB0b25nX2dpYTogdG9uZ0dpYSxcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMucmVzO1xuICAgICAgICB9KTtcbiAgICB9XG4gICAgdXBkYXRlKG1hLCBlZGl0SW5mbykge1xuICAgICAgICByZXR1cm4gX19hd2FpdGVyKHRoaXMsIHZvaWQgMCwgdm9pZCAwLCBmdW5jdGlvbiogKCkge1xuICAgICAgICAgICAgdGhpcy5yZXMgPSB5aWVsZCB0aGlzLl9wdXQoe1xuICAgICAgICAgICAgICAgIG1hLCBlZGl0SW5mbyxcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMucmVzO1xuICAgICAgICB9KTtcbiAgICB9XG59XG5leHBvcnRzLlRodW9jID0gVGh1b2M7XG4vLyMgc291cmNlTWFwcGluZ1VSTD1pbmRleC5qcy5tYXAiLCJcInVzZSBzdHJpY3RcIjtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmNsYXNzIEhvYURvbk5oYXAge1xuICAgIGNvbnN0cnVjdG9yKHRhcmdldCkge1xuICAgICAgICB0aGlzLmVsZW1lbnQgPSBudWxsO1xuICAgICAgICB0aGlzLmRhdGEgPSBbXTtcbiAgICAgICAgdGhpcy5jdXJyZW50ID0gbnVsbDtcbiAgICAgICAgdGhpcy5mdW5jVXBkYXRlR2lhID0gKGdpYSkgPT4geyByZXR1cm47IH07XG4gICAgICAgIHRoaXMuc2V0Vmlldyh0YXJnZXQpO1xuICAgICAgICB0aGlzLnVwZGF0ZVRhYmxlKCk7XG4gICAgfVxuICAgIHNldFZpZXcodGFyZ2V0KSB7XG4gICAgICAgIGlmICh0eXBlb2YgKHRhcmdldCkgPT09IFwic3RyaW5nXCIpIHtcbiAgICAgICAgICAgIHRoaXMuZWxlbWVudCA9ICQoXCIjXCIgKyB0YXJnZXQpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5lbGVtZW50ID0gdGFyZ2V0O1xuICAgICAgICB9XG4gICAgfVxuICAgIHVwZGF0ZVRhYmxlKCkge1xuICAgICAgICB0aGlzLmVsZW1lbnQuZmluZChcInRib2R5XCIpLnJlbW92ZSgpO1xuICAgICAgICB0aGlzLmVsZW1lbnQuYXBwZW5kKHRoaXMucmVuZGVyVGFibGUoKSk7XG4gICAgfVxuICAgIG5ld0hvYURvbigpIHtcbiAgICAgICAgdGhpcy5kYXRhID0gW107XG4gICAgICAgIHRoaXMudXBkYXRlVGFibGUoKTtcbiAgICAgICAgdGhpcy51cGRhdGVHaWEoKTtcbiAgICB9XG4gICAgYWRkSG9hRG9uKGN0aGQpIHtcbiAgICAgICAgdGhpcy5kYXRhLnB1c2goY3RoZCk7XG4gICAgICAgIHRoaXMuZWxlbWVudC5hcHBlbmQodGhpcy5yZW5kZXJSb3coY3RoZCkpO1xuICAgICAgICB0aGlzLnVwZGF0ZUdpYSgpO1xuICAgIH1cbiAgICBnZXRUb25nR2lhKCkge1xuICAgICAgICBsZXQgZ2lhID0gMDtcbiAgICAgICAgZm9yIChjb25zdCBjdGhkIG9mIHRoaXMuZGF0YSkge1xuICAgICAgICAgICAgZ2lhICs9IGN0aGQudGhhbmhfdGllbjtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZ2lhO1xuICAgIH1cbiAgICBzZXRLaWV1KGtpZXUpIHtcbiAgICAgICAgdGhpcy5raWV1ID0ga2lldTtcbiAgICAgICAgdGhpcy51cGRhdGVHaWEoKTtcbiAgICB9XG4gICAgdXBkYXRlR2lhKCkge1xuICAgICAgICBjb25zdCBnaWEgPSArdGhpcy5nZXRUb25nR2lhKCk7XG4gICAgICAgIHRoaXMuZnVuY1VwZGF0ZUdpYShnaWEpO1xuICAgIH1cbiAgICBvblVwZGF0ZVRvbmdHaWEoZnVuYykge1xuICAgICAgICB0aGlzLmZ1bmNVcGRhdGVHaWEgPSBmdW5jO1xuICAgIH1cbiAgICByZW5kZXJUYWJsZSgpIHtcbiAgICAgICAgY29uc3QgYm9keSA9ICQoXCI8dGJvZHkvPlwiKTtcbiAgICAgICAgZm9yIChjb25zdCByb3cgb2YgdGhpcy5kYXRhKSB7XG4gICAgICAgICAgICBjb25zdCB0ciA9IHRoaXMucmVuZGVyUm93KHJvdyk7XG4gICAgICAgICAgICBib2R5LmFwcGVuZCh0cik7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGJvZHk7XG4gICAgfVxuICAgIHJlbmRlclJvdyhyb3cpIHtcbiAgICAgICAgY29uc3QgdHIgPSAkKFwiPHRyLz5cIik7XG4gICAgICAgIHRyLmh0bWwoYFxuICAgICAgICA8dGQ+JHtyb3cubWFfdGh1b2N9PC90ZD5cbiAgICAgICAgPHRkPiR7cm93LnRlbl90aHVvY308L3RkPlxuICAgICAgICA8dGQ+JHtyb3cuc29fbHVvbmd9PC90ZD5cbiAgICAgICAgPHRkPiR7cm93LnRoYW5oX3RpZW59PC90ZD5cbiAgICAgICAgYCk7XG4gICAgICAgIHJldHVybiB0cjtcbiAgICB9XG59XG5leHBvcnRzLkhvYURvbk5oYXAgPSBIb2FEb25OaGFwO1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9SG9hRG9uTmhhcC5qcy5tYXAiLCJcInVzZSBzdHJpY3RcIjtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmNvbnN0IFZpZXdUYWJsZV8xID0gcmVxdWlyZShcIi4vVmlld1RhYmxlXCIpO1xuY29uc3QgTWVudUNvbnRleHRfMSA9IHJlcXVpcmUoXCIuLi9NZW51Q29udGV4dFwiKTtcbmNsYXNzIFRodW9jVGFibGUgZXh0ZW5kcyBWaWV3VGFibGVfMS5WaWV3VGFibGUge1xuICAgIGNvbnN0cnVjdG9yKHRodW9jTW9kZWwpIHtcbiAgICAgICAgc3VwZXIoKTtcbiAgICAgICAgdGhpcy5lbGVtZW50ID0gJChcIjx0YWJsZS8+XCIpLmFkZENsYXNzKFwidGFibGUgdGFibGUtc3RyaXBlZCB0YWJsZS12aWV3XCIpO1xuICAgICAgICB0aGlzLmVsZW1lbnQuaHRtbChgXG4gICAgICAgIDx0aGVhZD5cbiAgICAgICAgICAgIDx0cj5cbiAgICAgICAgICAgICAgICA8dGg+TWEgVGh1b2M8L3RoPlxuICAgICAgICAgICAgICAgIDx0aD5UZW4gVGh1b2M8L3RoPlxuICAgICAgICAgICAgPC90cj5cbiAgICAgICAgPC90aGVhZD5cbiAgICAgICAgPHRib2R5PjwvdGJvZHk+XG4gICAgICAgIGApO1xuICAgICAgICB0aGlzLm1vZGVsID0gdGh1b2NNb2RlbDtcbiAgICB9XG4gICAgb25Db250ZXh0QWRkKGZ1bmMpIHtcbiAgICAgICAgdGhpcy5mdW5jQ3R4QWRkID0gZnVuYztcbiAgICB9XG4gICAgb25Db250ZXh0RWRpdChmdW5jKSB7XG4gICAgICAgIHRoaXMuZnVuY0N0eEVkaXQgPSBmdW5jO1xuICAgIH1cbiAgICBvbkNvbnRleHRFZGl0UHJpY2UoZnVuYykge1xuICAgICAgICB0aGlzLmZ1bmNDdHhFZGl0UHJpY2UgPSBmdW5jO1xuICAgIH1cbiAgICBjdXN0b21DcmVhdGVSb3cocm93KSB7XG4gICAgICAgIGNvbnN0IGNvbnRleHRtZW51ID0gbmV3IE1lbnVDb250ZXh0XzEuTWVudUNvbnRleHQocm93KTtcbiAgICAgICAgY29udGV4dG1lbnUuYWRkQ29udGV4dCh7XG4gICAgICAgICAgICB0aXRsZTogXCJuaOG6rXAgdGjDqm0gdGh14buRY1wiLFxuICAgICAgICAgICAgY2xhc3NOYW1lOiBcInRleHQtc3VjY2Vzc1wiLFxuICAgICAgICAgICAgaWNvbjogXCJmYXMgZmEtcGx1cy1jaXJjbGVcIixcbiAgICAgICAgICAgIGNsaWNrOiAoZSkgPT4ge1xuICAgICAgICAgICAgICAgIHRoaXMuZnVuY0N0eEFkZCgpO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgfSkuYWRkQ29udGV4dCh7XG4gICAgICAgICAgICB0aXRsZTogXCJz4butYSB0aMO0bmcgdGluXCIsXG4gICAgICAgICAgICBjbGFzc05hbWU6IFwidGV4dC1wcmltYXJ5XCIsXG4gICAgICAgICAgICBpY29uOiBcImZhcyBmYS1wZW4tc3F1YXJlXCIsXG4gICAgICAgICAgICBjbGljazogKGUpID0+IHtcbiAgICAgICAgICAgICAgICB0aGlzLmZ1bmNDdHhFZGl0KCk7XG4gICAgICAgICAgICB9LFxuICAgICAgICB9KS5hZGRDb250ZXh0KHtcbiAgICAgICAgICAgIHRpdGxlOiBcImNo4buJbmggZ2nDoVwiLFxuICAgICAgICAgICAgaWNvbjogXCJmYSBmYS1kb2xsYXItc2lnblwiLFxuICAgICAgICAgICAgY2xpY2s6IChlKSA9PiB7XG4gICAgICAgICAgICAgICAgdGhpcy5mdW5jQ3R4RWRpdFByaWNlKCk7XG4gICAgICAgICAgICB9LFxuICAgICAgICB9KTtcbiAgICB9XG59XG5leHBvcnRzLlRodW9jVGFibGUgPSBUaHVvY1RhYmxlO1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9VGh1b2NUYWJsZS5qcy5tYXAiLCJcInVzZSBzdHJpY3RcIjtcbnZhciBfX2F3YWl0ZXIgPSAodGhpcyAmJiB0aGlzLl9fYXdhaXRlcikgfHwgZnVuY3Rpb24gKHRoaXNBcmcsIF9hcmd1bWVudHMsIFAsIGdlbmVyYXRvcikge1xuICAgIHJldHVybiBuZXcgKFAgfHwgKFAgPSBQcm9taXNlKSkoZnVuY3Rpb24gKHJlc29sdmUsIHJlamVjdCkge1xuICAgICAgICBmdW5jdGlvbiBmdWxmaWxsZWQodmFsdWUpIHsgdHJ5IHsgc3RlcChnZW5lcmF0b3IubmV4dCh2YWx1ZSkpOyB9IGNhdGNoIChlKSB7IHJlamVjdChlKTsgfSB9XG4gICAgICAgIGZ1bmN0aW9uIHJlamVjdGVkKHZhbHVlKSB7IHRyeSB7IHN0ZXAoZ2VuZXJhdG9yW1widGhyb3dcIl0odmFsdWUpKTsgfSBjYXRjaCAoZSkgeyByZWplY3QoZSk7IH0gfVxuICAgICAgICBmdW5jdGlvbiBzdGVwKHJlc3VsdCkgeyByZXN1bHQuZG9uZSA/IHJlc29sdmUocmVzdWx0LnZhbHVlKSA6IG5ldyBQKGZ1bmN0aW9uIChyZXNvbHZlKSB7IHJlc29sdmUocmVzdWx0LnZhbHVlKTsgfSkudGhlbihmdWxmaWxsZWQsIHJlamVjdGVkKTsgfVxuICAgICAgICBzdGVwKChnZW5lcmF0b3IgPSBnZW5lcmF0b3IuYXBwbHkodGhpc0FyZywgX2FyZ3VtZW50cyB8fCBbXSkpLm5leHQoKSk7XG4gICAgfSk7XG59O1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuY2xhc3MgVmlld1RhYmxlIHtcbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgLy8gY29uc3RydWN0XG4gICAgICAgIHRoaXMub2Zmc2V0ID0gMDtcbiAgICAgICAgdGhpcy5saW1pdCA9IDEwO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBnZXQgZGF0YSB3aXRoIHNlYXJjaCB2YWx1ZVxuICAgICAqIEBwYXJhbSBzZWFyY2ggZmllbGQ9dmFsdWVcbiAgICAgKi9cbiAgICB1cGRhdGUoc2VhcmNoKSB7XG4gICAgICAgIHJldHVybiBfX2F3YWl0ZXIodGhpcywgdm9pZCAwLCB2b2lkIDAsIGZ1bmN0aW9uKiAoKSB7XG4gICAgICAgICAgICAvLyByZW5kZXIgZGF0YSB0byBlbGVtZW50XG4gICAgICAgICAgICBjb25zdCByYXdEYXRhID0geWllbGQgdGhpcy5tb2RlbC5nZXQoc2VhcmNoLCB0aGlzLm9mZnNldCwgdGhpcy5saW1pdCk7XG4gICAgICAgICAgICB0aGlzLmRhdGEgPSBBcnJheS5mcm9tKHJhd0RhdGEpLm1hcCgodmFsKSA9PiB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuZmlsdGVyRGF0YVJvdyh2YWwpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB0aGlzLnNpemVPZlJlY29yZCA9IHRoaXMuZGF0YS5sZW5ndGg7XG4gICAgICAgICAgICB0aGlzLmN1cnJlbnRQb3MgPSAtMTtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmRhdGE7XG4gICAgICAgIH0pO1xuICAgIH1cbiAgICByZW5kZXIoc2VhcmNoKSB7XG4gICAgICAgIHJldHVybiBfX2F3YWl0ZXIodGhpcywgdm9pZCAwLCB2b2lkIDAsIGZ1bmN0aW9uKiAoKSB7XG4gICAgICAgICAgICBjb25zdCBkYXRhID0geWllbGQgdGhpcy51cGRhdGUoc2VhcmNoKTtcbiAgICAgICAgICAgIGNvbnN0IHRib2R5ID0gdGhpcy5fY3JlYXRlVGFibGVCb2R5KGRhdGEpO1xuICAgICAgICAgICAgdGhpcy5lbGVtZW50LmZpbmQoXCJ0Ym9keVwiKS5odG1sKFwiXCIpLmFwcGVuZCh0Ym9keS5jaGlsZHJlbigpKTtcbiAgICAgICAgfSk7XG4gICAgfVxuICAgIHNldEVsZW1lbnQoZWwpIHtcbiAgICAgICAgdGhpcy5lbGVtZW50ID0gZWw7XG4gICAgfVxuICAgIGdldEVsZW1lbnQoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmVsZW1lbnQ7XG4gICAgfVxuICAgIGN1cnJlbnREYXRhKCkge1xuICAgICAgICBpZiAoIXRoaXMuY3VycmVudFJvd0RhdGEpIHtcbiAgICAgICAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIE9iamVjdC5hc3NpZ24oe30sIHRoaXMuY3VycmVudFJvd0RhdGEpO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBhdHRhY2ggZXZlbnQgb2YgY2hvb3NlXG4gICAgICogQHBhcmFtIGNhbGxiYWNrIGNhbGxiYWNrIGZ1bmN0aW9uIHdoZW4gdGhlIHJvdyBvZiByZWNvcmQgaXMgY2hvb3NlZFxuICAgICAqL1xuICAgIG9uQ2hvb3NlKGNhbGxiYWNrKSB7XG4gICAgICAgIHRoaXMuZnVuY09uQ2hvb3NlID0gY2FsbGJhY2s7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIGF0dGFjaCBldmVudCBvZiBob3ZlclxuICAgICAqIEBwYXJhbSBjYWxsYmFjayBjYWxsYmFjayBmdW5jdGlvbiB3aGVuIHRoZSByb3cgb2YgcmVjb3JkIGlzIGhvdmVyIG9uXG4gICAgICovXG4gICAgb25Gb2N1cyhjYWxsYmFjaykge1xuICAgICAgICB0aGlzLmZ1bmNPbkZvY3VzID0gY2FsbGJhY2s7XG4gICAgfVxuICAgIHNlbGVjdERvd24oKSB7XG4gICAgICAgIGlmICh0aGlzLmN1cnJlbnRQb3MgPCB0aGlzLnNpemVPZlJlY29yZCAtIDEpIHtcbiAgICAgICAgICAgICsrdGhpcy5jdXJyZW50UG9zO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuZWxlbWVudC5maW5kKGB0cltkYXRhLXBvcz0ke3RoaXMuY3VycmVudFBvc31dYCkuZm9jdXMoKTtcbiAgICB9XG4gICAgc2VsZWN0VXAoKSB7XG4gICAgICAgIGlmICh0aGlzLmN1cnJlbnRQb3MgPiAwKSB7XG4gICAgICAgICAgICAtLXRoaXMuY3VycmVudFBvcztcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmVsZW1lbnQuZmluZChgdHJbZGF0YS1wb3M9JHt0aGlzLmN1cnJlbnRQb3N9XWApLmZvY3VzKCk7XG4gICAgfVxuICAgIG5leHRQYWdlKHNlYXJjaCA9IFwiXCIpIHtcbiAgICAgICAgdGhpcy5vZmZzZXQgKz0gdGhpcy5saW1pdDtcbiAgICAgICAgdGhpcy5yZW5kZXIoc2VhcmNoKTtcbiAgICB9XG4gICAgc2V0TGltaXRQZXJQYWdlKGxpbWl0KSB7XG4gICAgICAgIHRoaXMubGltaXQgPSBsaW1pdDtcbiAgICB9XG4gICAgc2V0T2Zmc2V0KG9mZnNldCkge1xuICAgICAgICB0aGlzLm9mZnNldCA9IG9mZnNldDtcbiAgICB9XG4gICAgZmlsdGVyRGF0YVJvdyhkYXRhUm93KSB7XG4gICAgICAgIC8vIG5vdGhpbmcgaGVyZSwganVzdCByYXdcbiAgICAgICAgcmV0dXJuIGRhdGFSb3c7XG4gICAgfVxuICAgIF9jcmVhdGVSb3coZGF0YVJvdywgcG9zKSB7XG4gICAgICAgIGNvbnN0IHJvdyA9ICQoXCI8dHIvPlwiKS5hdHRyKFwidGFiaW5kZXhcIiwgLTEpLmF0dHIoXCJkYXRhLXBvc1wiLCBwb3MpO1xuICAgICAgICBmb3IgKGNvbnN0IGZpZWxkIG9mIE9iamVjdC5rZXlzKGRhdGFSb3cpKSB7XG4gICAgICAgICAgICBjb25zdCBjZWxsID0gJChcIjx0ZC8+XCIpLmF0dHIoXCJuYW1lXCIsIGZpZWxkKS50ZXh0KGRhdGFSb3dbZmllbGRdKTtcbiAgICAgICAgICAgIHJvdy5hcHBlbmQoY2VsbCk7XG4gICAgICAgIH1cbiAgICAgICAgLy8gY2hvb3NlIGV2ZW50XG4gICAgICAgIHRoaXMuX3Jvd09uQ2hvb3NlKHJvdywgKCkgPT4ge1xuICAgICAgICAgICAgdGhpcy5mdW5jT25DaG9vc2UoZGF0YVJvdyk7XG4gICAgICAgIH0pO1xuICAgICAgICAvLyBob3ZlciBldmVudFxuICAgICAgICByb3cub24oXCJjbGljayBmb2N1c1wiLCAoZSkgPT4ge1xuICAgICAgICAgICAgdGhpcy5lbGVtZW50LmZpbmQoXCJ0clwiKS5yZW1vdmVDbGFzcyhcImFjdGl2ZVwiKTtcbiAgICAgICAgICAgIHJvdy5hZGRDbGFzcyhcImFjdGl2ZVwiKTtcbiAgICAgICAgICAgIHRoaXMuY3VycmVudFBvcyA9IHBvcztcbiAgICAgICAgICAgIHRoaXMuY3VycmVudFJvd0RhdGEgPSBkYXRhUm93O1xuICAgICAgICAgICAgdGhpcy5mdW5jT25Gb2N1cyhkYXRhUm93KTtcbiAgICAgICAgfSk7XG4gICAgICAgIHRoaXMuY3VzdG9tQ3JlYXRlUm93KHJvdyk7XG4gICAgICAgIHJldHVybiByb3c7XG4gICAgfVxuICAgIF9jcmVhdGVUYWJsZUJvZHkoZGF0YSkge1xuICAgICAgICBjb25zdCB0Ym9keSA9ICQoXCI8dGJvZHkvPlwiKTtcbiAgICAgICAgbGV0IHBvcyA9IDA7XG4gICAgICAgIGZvciAoY29uc3Qgcm93RGF0YSBvZiBkYXRhKSB7XG4gICAgICAgICAgICBjb25zdCB0cm93ID0gdGhpcy5fY3JlYXRlUm93KHJvd0RhdGEsIHBvcysrKTtcbiAgICAgICAgICAgIHRib2R5LmFwcGVuZCh0cm93KTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGJvZHk7XG4gICAgfVxuICAgIGN1c3RvbUNyZWF0ZVJvdyhyb3cpIHtcbiAgICAgICAgLy8gbm90aGluZyBoZXJlLCB3aWxsIGNoYW5nZSBpbiBpbmhlcml0YW5jZVxuICAgIH1cbiAgICBfcm93T25DaG9vc2Uocm93LCBjYWxsYmFjaykge1xuICAgICAgICByb3cub24oXCJrZXlkb3duXCIsIChlKSA9PiB7XG4gICAgICAgICAgICBpZiAoZS5rZXlDb2RlID09PSAxMykge1xuICAgICAgICAgICAgICAgIGNhbGxiYWNrKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgICByb3cub24oXCJkYmxjbGlja1wiLCAoKSA9PiB7XG4gICAgICAgICAgICBjYWxsYmFjaygpO1xuICAgICAgICB9KTtcbiAgICB9XG59XG5leHBvcnRzLlZpZXdUYWJsZSA9IFZpZXdUYWJsZTtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPVZpZXdUYWJsZS5qcy5tYXAiLCJcInVzZSBzdHJpY3RcIjtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmZ1bmN0aW9uIGdldEZvcm1WYWx1ZShmb3JtKSB7XG4gICAgY29uc3QgYXJyID0gZm9ybS5zZXJpYWxpemVBcnJheSgpO1xuICAgIGNvbnN0IHZhbCA9IHt9O1xuICAgIGZvciAoY29uc3QgaW5wdXQgb2YgYXJyKSB7XG4gICAgICAgIHZhbFtpbnB1dC5uYW1lXSA9IGlucHV0LnZhbHVlO1xuICAgIH1cbiAgICByZXR1cm4gdmFsO1xufVxuZXhwb3J0cy5nZXRGb3JtVmFsdWUgPSBnZXRGb3JtVmFsdWU7XG4vLyMgc291cmNlTWFwcGluZ1VSTD1mb3JtVmFsLmpzLm1hcCIsIlwidXNlIHN0cmljdFwiO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuY29uc3QgQXV0b0NvbXBsZXRlXzEgPSByZXF1aXJlKFwiLi4vQXV0b0NvbXBsZXRlXCIpO1xuY29uc3QgZm9ybVZhbF8xID0gcmVxdWlyZShcIi4uL2Zvcm1WYWxcIik7XG5jb25zdCBIb2FEb25OaGFwXzEgPSByZXF1aXJlKFwiLi4vVmlldy9Ib2FEb25OaGFwXCIpO1xuZnVuY3Rpb24gaW5pdChhcHApIHtcbiAgICBoYW5kbGVUZW5UaHVvY0lucHV0KGFwcCk7XG4gICAgaGFuZGxlRG9uVmlTZWxlY3RJbnB1dChhcHApO1xuICAgIGhhbmRsZUZvcm0oYXBwKTtcbn1cbmV4cG9ydHMuYWRkVGh1b2NIYW5kbGUgPSBpbml0O1xuZnVuY3Rpb24gaGFuZGxlVGVuVGh1b2NJbnB1dChhcHApIHtcbiAgICBjb25zdCBhdXRvY29tcGxldGUgPSBuZXcgQXV0b0NvbXBsZXRlXzEuQXV0b0NvbXBsZXRlKFwibmhhcF9ob2FfZG9uLS10ZW5fdGh1b2NcIiwgYXBwLm1vZGVsLnRodW9jKTtcbiAgICBhdXRvY29tcGxldGUuc2V0TG9va3VwKFtcIm1hXCIsIFwidGVuXCIsIFwibmNjXCIsIFwiZG9uX3ZpXCIsIFwiZG9uX2dpYVwiXSk7XG4gICAgYXV0b2NvbXBsZXRlLmxpc3RlbigpO1xuICAgIGF1dG9jb21wbGV0ZS5vbkNob29zZSgoZGF0YSkgPT4ge1xuICAgICAgICAkKFwiI25oYXBfaG9hX2Rvbi0tbWFfdGh1b2NcIikudmFsKGRhdGEubWEpO1xuICAgICAgICAkKFwiI25oYXBfaG9hX2Rvbi0tdGVuX3RodW9jXCIpLnZhbChkYXRhLnRlbik7XG4gICAgICAgICQoXCIjbmhhcF9ob2FfZG9uLS1uY2NcIikudmFsKGRhdGEubmNjKTtcbiAgICAgICAgJChcIiNuaGFwX2hvYV9kb24tLWdpYVwiKS52YWwoZGF0YS5kb25fZ2lhKTtcbiAgICAgICAgJChcIiNuaGFwX2hvYV9kb24tLWRvbl92aVwiKS52YWwoZGF0YS5pZF9kb25fdmkpO1xuICAgIH0pO1xufVxuZnVuY3Rpb24gaGFuZGxlRG9uVmlTZWxlY3RJbnB1dChhcHApIHtcbiAgICBhcHAubW9kZWwuZG9uVmkucmVuZGVyU2VsZWN0SW5wdXQoJChcIiNuaGFwX2hvYV9kb24tLWRvbl92aVwiKSk7XG59XG5mdW5jdGlvbiBoYW5kbGVGb3JtKGFwcCkge1xuICAgIGFwcC52aWV3LmhvYURvbiA9IG5ldyBIb2FEb25OaGFwXzEuSG9hRG9uTmhhcChcIm5oYXBfaG9hX2Rvbi0tdGFibGVcIik7XG4gICAgYXBwLnZpZXcuaG9hRG9uLm9uVXBkYXRlVG9uZ0dpYSgoZ2lhKSA9PiB7XG4gICAgICAgICQoXCIjbmhhcF9ob2FfZG9uLS10b25nX2dpYVwiKS52YWwoZ2lhKTtcbiAgICB9KTtcbiAgICAkKFwiI25oYXBfaG9hX2Rvbi0tdGhlbV90aHVvY1wiKS5vbihcInN1Ym1pdFwiLCAoZSkgPT4ge1xuICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgIGNvbnN0IGZvcm0gPSAkKGUudGFyZ2V0KTtcbiAgICAgICAgY29uc3QgZGF0YSA9IGZvcm1WYWxfMS5nZXRGb3JtVmFsdWUoZm9ybSk7XG4gICAgICAgIGZvcm0uZmluZChcImlucHV0W3R5cGU9dGV4dF1cIikudmFsKFwiXCIpO1xuICAgICAgICBmb3JtLmZpbmQoXCJpbnB1dFtuYW1lPXRlbl90aHVvY11cIikuZm9jdXMoKTtcbiAgICAgICAgYXBwLnZpZXcuaG9hRG9uLmFkZEhvYURvbih7XG4gICAgICAgICAgICBtYV90aHVvYzogZGF0YS5tYV90aHVvYyxcbiAgICAgICAgICAgIHRlbl90aHVvYzogZGF0YS50ZW5fdGh1b2MsXG4gICAgICAgICAgICBzb19sdW9uZzogZGF0YS5zb19sdW9uZyxcbiAgICAgICAgICAgIGRvbl9naWE6IGRhdGEuZG9uX2dpYSxcbiAgICAgICAgICAgIHRoYW5oX3RpZW46IGRhdGEuZG9uX2dpYSAqIGRhdGEuc29fbHVvbmcsXG4gICAgICAgIH0pO1xuICAgIH0pO1xuICAgICQoXCJpbnB1dFtuYW1lPSdraWV1LWJhbiddXCIpLm9uKFwiY2hhbmdlXCIsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgY29uc3Qga2lldSA9IFwiXCIgKyAkKHRoaXMpLnZhbCgpO1xuICAgICAgICBhcHAudmlldy5ob2FEb24uc2V0S2lldShraWV1KTtcbiAgICB9KTtcbn1cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWFkZFRodW9jSGFuZGxlLmpzLm1hcCIsIlwidXNlIHN0cmljdFwiO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuY29uc3QgYWRkVGh1b2NIYW5kbGVfMSA9IHJlcXVpcmUoXCIuL2FkZFRodW9jSGFuZGxlXCIpO1xuY29uc3Qgc3VibWl0SG9hRG9uXzEgPSByZXF1aXJlKFwiLi9zdWJtaXRIb2FEb25cIik7XG5mdW5jdGlvbiBpbml0KGFwcCkge1xuICAgIGFkZFRodW9jSGFuZGxlXzEuYWRkVGh1b2NIYW5kbGUoYXBwKTtcbiAgICBzdWJtaXRIb2FEb25fMS5zdWJtaXRIb2FEb25IYW5kbGUoYXBwKTtcbn1cbmV4cG9ydHMuaW5pdCA9IGluaXQ7XG4vLyMgc291cmNlTWFwcGluZ1VSTD1pbmRleC5qcy5tYXAiLCJcInVzZSBzdHJpY3RcIjtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmZ1bmN0aW9uIHN1Ym1pdEhvYURvbkhhbmRsZShhcHApIHtcbiAgICAkKFwiI25oYXBfaG9hX2Rvbi0tc3VibWl0XCIpLm9uKFwiY2xpY2tcIiwgKGUpID0+IHtcbiAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICBhbGVydChcImp1c3QgaW4gdGVzdGluZ1wiKTtcbiAgICB9KTtcbn1cbmV4cG9ydHMuc3VibWl0SG9hRG9uSGFuZGxlID0gc3VibWl0SG9hRG9uSGFuZGxlO1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9c3VibWl0SG9hRG9uLmpzLm1hcCIsIlwidXNlIHN0cmljdFwiO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuY29uc3QgdGh1b2NfbW9kYWxfMSA9IHJlcXVpcmUoXCIuL3RodW9jLW1vZGFsXCIpO1xuY29uc3QgUEFHRV9JRCA9IFwicGFnZS1uaGFwLXRodW9jXCI7XG5jbGFzcyBJbml0IHtcbiAgICBjb25zdHJ1Y3RvcihhcHApIHtcbiAgICAgICAgdGhpcy5hcHAgPSBhcHA7XG4gICAgICAgIGFwcC52aWV3LnRodW9jLnNldEVsZW1lbnQoJChcIiNuaGFwX3RodW9jLS10YWJsZVwiKSk7XG4gICAgICAgIGFwcC52aWV3LnRodW9jLnNldExpbWl0UGVyUGFnZSgxMDApO1xuICAgICAgICBhcHAudmlldy50aHVvYy5vbkNob29zZSgoZGF0YSkgPT4ge1xuICAgICAgICAgICAgdGhpcy5hZGRUaHVvYyhkYXRhKTtcbiAgICAgICAgfSk7XG4gICAgICAgIGFwcC52aWV3LnRodW9jLm9uRm9jdXMoKGRhdGEpID0+IHtcbiAgICAgICAgICAgICQoXCIudGh1b2MtLWJ1dHRvblwiKS5yZW1vdmVBdHRyKFwiZGlzYWJsZWRcIik7XG4gICAgICAgIH0pO1xuICAgICAgICBhcHAudmlldy50aHVvYy5vbkNvbnRleHRBZGQoKCkgPT4ge1xuICAgICAgICAgICAgdGhpcy5hZGRUaHVvYyhhcHAudmlldy50aHVvYy5jdXJyZW50RGF0YSgpKTtcbiAgICAgICAgfSk7XG4gICAgICAgIGFwcC52aWV3LnRodW9jLm9uQ29udGV4dEVkaXQoKCkgPT4ge1xuICAgICAgICAgICAgdGhpcy5lZGl0VGh1b2MoYXBwLnZpZXcudGh1b2MuY3VycmVudERhdGEoKSk7XG4gICAgICAgIH0pO1xuICAgICAgICBhcHAudmlldy50aHVvYy5vbkNvbnRleHRFZGl0UHJpY2UoKCkgPT4ge1xuICAgICAgICAgICAgdGhpcy5lZGl0UHJpY2VUaHVvYyhhcHAudmlldy50aHVvYy5jdXJyZW50RGF0YSgpKTtcbiAgICAgICAgfSk7XG4gICAgICAgIGFwcC52aWV3LnRodW9jLnJlbmRlcihcIlwiKTtcbiAgICAgICAgdGhpcy5oYW5kbGVDb250cm9sS2V5KGFwcCk7XG4gICAgICAgIHRoaXMuaGFuZGxlU2VsZWN0S2V5KGFwcCk7XG4gICAgICAgIHRoaXMuaGFuZGxlTW9kYWxFdmVudCgpO1xuICAgICAgICB0aGlzLmhhbmRsZVNlYXJjaElucHV0KCk7XG4gICAgICAgIGNvbnN0ICR0aGlzID0gdGhpcztcbiAgICAgICAgJChcIi50aHVvYy0tYnV0dG9uXCIpLm9uKFwiY2xpY2tcIiwgZnVuY3Rpb24gQnV0dG9uQ2xpY2soKSB7XG4gICAgICAgICAgICBjb25zdCByb2xlID0gJCh0aGlzKS5hdHRyKFwiYXBwLXJvbGVcIik7XG4gICAgICAgICAgICBzd2l0Y2ggKHJvbGUpIHtcbiAgICAgICAgICAgICAgICBjYXNlIFwibmV3XCI6XG4gICAgICAgICAgICAgICAgICAgICR0aGlzLm5ld1RodW9jKCk7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGNhc2UgXCJlZGl0XCI6XG4gICAgICAgICAgICAgICAgICAgICR0aGlzLmVkaXRUaHVvYyhhcHAudmlldy50aHVvYy5jdXJyZW50RGF0YSgpKTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgY2FzZSBcImFkZFwiOlxuICAgICAgICAgICAgICAgICAgICAkdGhpcy5hZGRUaHVvYyhhcHAudmlldy50aHVvYy5jdXJyZW50RGF0YSgpKTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgY2FzZSBcImNoaW5oLWdpYVwiOlxuICAgICAgICAgICAgICAgICAgICAkdGhpcy5lZGl0UHJpY2VUaHVvYyhhcHAudmlldy50aHVvYy5jdXJyZW50RGF0YSgpKTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH1cbiAgICBoYW5kbGVTZWxlY3RLZXkoYXBwKSB7XG4gICAgICAgIGFwcC5vblNob3J0Y3V0S2V5KFwiQXJyb3dVcFwiLCBQQUdFX0lELCAoZSkgPT4ge1xuICAgICAgICAgICAgdGhpcy5hcHAudmlldy50aHVvYy5zZWxlY3RVcCgpO1xuICAgICAgICB9KTtcbiAgICAgICAgYXBwLm9uU2hvcnRjdXRLZXkoXCJBcnJvd0Rvd25cIiwgUEFHRV9JRCwgKGUpID0+IHtcbiAgICAgICAgICAgIHRoaXMuYXBwLnZpZXcudGh1b2Muc2VsZWN0RG93bigpO1xuICAgICAgICB9KTtcbiAgICB9XG4gICAgaGFuZGxlQ29udHJvbEtleShhcHApIHtcbiAgICAgICAgYXBwLm9uU2hvcnRjdXRLZXkoXCJjdHJsK2RcIiwgUEFHRV9JRCwgKGUpID0+IHtcbiAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgIHRoaXMubmV3VGh1b2MoKTtcbiAgICAgICAgfSk7XG4gICAgICAgIGFwcC5vblNob3J0Y3V0S2V5KFwiY3RybCtlXCIsIFBBR0VfSUQsIChlKSA9PiB7XG4gICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICB0aGlzLmVkaXRUaHVvYyh0aGlzLmFwcC52aWV3LnRodW9jLmN1cnJlbnREYXRhKCkpO1xuICAgICAgICB9KTtcbiAgICAgICAgYXBwLm9uU2hvcnRjdXRLZXkoXCJjdHJsK2dcIiwgUEFHRV9JRCwgKGUpID0+IHtcbiAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgIHRoaXMuZWRpdFByaWNlVGh1b2ModGhpcy5hcHAudmlldy50aHVvYy5jdXJyZW50RGF0YSgpKTtcbiAgICAgICAgfSk7XG4gICAgICAgIGFwcC5vblNob3J0Y3V0S2V5KFwiY3RybCtmXCIsIFBBR0VfSUQsIChlKSA9PiB7XG4gICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICAkKFwiI3RodW9jLS1zZWFyY2hcIikuZm9jdXMoKTtcbiAgICAgICAgfSk7XG4gICAgfVxuICAgIGhhbmRsZVNlYXJjaElucHV0KCkge1xuICAgICAgICBjb25zdCAkdGhpcyA9IHRoaXM7XG4gICAgICAgICQoXCIjdGh1b2MtLXNlYXJjaFwiKS5vbihcImtleXVwXCIsIGZ1bmN0aW9uIFNlYXJjaGluZygpIHtcbiAgICAgICAgICAgIGNvbnN0IHZhbCA9ICQodGhpcykudmFsKCk7XG4gICAgICAgICAgICAkdGhpcy5hcHAudmlldy50aHVvYy5yZW5kZXIodmFsKTtcbiAgICAgICAgfSk7XG4gICAgfVxuICAgIGhhbmRsZU1vZGFsRXZlbnQoKSB7XG4gICAgICAgIHRoaXMuYWRkTW9kYWwgPSBuZXcgdGh1b2NfbW9kYWxfMS5BZGRUaHVvY01vZGFsKFwidGh1b2MtLWFkZC1tb2RhbFwiLCB0aGlzLmFwcCk7XG4gICAgICAgIHRoaXMubmV3TW9kYWwgPSBuZXcgdGh1b2NfbW9kYWxfMS5OZXdUaHVvY01vZGFsKFwidGh1b2MtLW5ldy1tb2RhbFwiLCB0aGlzLmFwcCk7XG4gICAgICAgIHRoaXMuZWRpdE1vZGFsID0gbmV3IHRodW9jX21vZGFsXzEuRWRpdFRodW9jTW9kYWwoXCJ0aHVvYy0tZWRpdC1tb2RhbFwiLCB0aGlzLmFwcCk7XG4gICAgICAgIHRoaXMuZWRpdFByaWNlTW9kYWwgPSBuZXcgdGh1b2NfbW9kYWxfMS5FZGl0UHJpY2VUaHVvY01vZGFsKFwidGh1b2MtLWVkaXQtcHJpY2UtbW9kYWxcIiwgdGhpcy5hcHApO1xuICAgIH1cbiAgICBlZGl0VGh1b2MoZGF0YSkge1xuICAgICAgICBpZiAoIWRhdGEpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmVkaXRNb2RhbC5zaG93KGRhdGEpO1xuICAgIH1cbiAgICBuZXdUaHVvYygpIHtcbiAgICAgICAgJChcIiN0aHVvYy0tbmV3LW1vZGFsXCIpLm1vZGFsKFwic2hvd1wiKTtcbiAgICB9XG4gICAgYWRkVGh1b2MoZGF0YSkge1xuICAgICAgICBpZiAoIWRhdGEpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICAkKFwiI3RodW9jLS1hZGQtbW9kYWxcIikubW9kYWwoXCJzaG93XCIpO1xuICAgICAgICAkKFwiI3RodW9jLS1hZGQtbWF0aHVvY1wiKS52YWwoZGF0YS5tYSk7XG4gICAgICAgICQoXCIjdGh1b2MtLWFkZC10ZW50aHVvY1wiKS52YWwoZGF0YS50ZW4pO1xuICAgICAgICAkKFwiI3RodW9jLS1hZGQtbmNjXCIpLnZhbChkYXRhLnRlbl9uY2MpO1xuICAgICAgICAkKFwiI3RodW9jLS1hZGQtc29sdW9uZ1wiKS52YWwoZGF0YS5zb19sdW9uZyk7XG4gICAgfVxuICAgIGVkaXRQcmljZVRodW9jKGRhdGEpIHtcbiAgICAgICAgaWYgKCFkYXRhKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgJChcIiN0aHVvYy0tZWRpdC1wcmljZS1tb2RhbFwiKS5tb2RhbChcInNob3dcIik7XG4gICAgICAgICQoXCIjdGh1b2MtLWVkaXQtcHJpY2UtbWF0aHVvY1wiKS52YWwoZGF0YS5tYSk7XG4gICAgICAgICQoXCIjdGh1b2MtLWVkaXQtcHJpY2UtdGVudGh1b2NcIikudmFsKGRhdGEudGVuKTtcbiAgICB9XG59XG5mdW5jdGlvbiBpbml0KGFwcCkge1xuICAgIHJldHVybiBuZXcgSW5pdChhcHApO1xufVxuZXhwb3J0cy5pbml0ID0gaW5pdDtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWluZGV4LmpzLm1hcCIsIlwidXNlIHN0cmljdFwiO1xudmFyIF9fYXdhaXRlciA9ICh0aGlzICYmIHRoaXMuX19hd2FpdGVyKSB8fCBmdW5jdGlvbiAodGhpc0FyZywgX2FyZ3VtZW50cywgUCwgZ2VuZXJhdG9yKSB7XG4gICAgcmV0dXJuIG5ldyAoUCB8fCAoUCA9IFByb21pc2UpKShmdW5jdGlvbiAocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgICAgIGZ1bmN0aW9uIGZ1bGZpbGxlZCh2YWx1ZSkgeyB0cnkgeyBzdGVwKGdlbmVyYXRvci5uZXh0KHZhbHVlKSk7IH0gY2F0Y2ggKGUpIHsgcmVqZWN0KGUpOyB9IH1cbiAgICAgICAgZnVuY3Rpb24gcmVqZWN0ZWQodmFsdWUpIHsgdHJ5IHsgc3RlcChnZW5lcmF0b3JbXCJ0aHJvd1wiXSh2YWx1ZSkpOyB9IGNhdGNoIChlKSB7IHJlamVjdChlKTsgfSB9XG4gICAgICAgIGZ1bmN0aW9uIHN0ZXAocmVzdWx0KSB7IHJlc3VsdC5kb25lID8gcmVzb2x2ZShyZXN1bHQudmFsdWUpIDogbmV3IFAoZnVuY3Rpb24gKHJlc29sdmUpIHsgcmVzb2x2ZShyZXN1bHQudmFsdWUpOyB9KS50aGVuKGZ1bGZpbGxlZCwgcmVqZWN0ZWQpOyB9XG4gICAgICAgIHN0ZXAoKGdlbmVyYXRvciA9IGdlbmVyYXRvci5hcHBseSh0aGlzQXJnLCBfYXJndW1lbnRzIHx8IFtdKSkubmV4dCgpKTtcbiAgICB9KTtcbn07XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5jbGFzcyBBZGRUaHVvY01vZGFsIHtcbiAgICBjb25zdHJ1Y3RvcihpZCwgYXBwKSB7XG4gICAgICAgIHRoaXMuYXBwID0gYXBwO1xuICAgICAgICB0aGlzLnBvcHVwID0gJChcIiNcIiArIGlkKTtcbiAgICAgICAgdGhpcy5wb3B1cC5sb2FkKFwiL2xheW91dHMvbW9kYWwtYWRkLXRodW9jLmh0bWxcIiwgKCkgPT4ge1xuICAgICAgICAgICAgdGhpcy5wb3B1cC5maW5kKFwiZm9ybVwiKS5vbihcInN1Ym1pdFwiLCAoZSkgPT4ge1xuICAgICAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgICAgICB0aGlzLmZvcm1TdWJtaXRIYW5kbGUoZSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgfVxuICAgIGZvcm1TdWJtaXRIYW5kbGUoZSkge1xuICAgICAgICByZXR1cm4gX19hd2FpdGVyKHRoaXMsIHZvaWQgMCwgdm9pZCAwLCBmdW5jdGlvbiogKCkge1xuICAgICAgICAgICAgY29uc3QgZm9ybSA9ICQoZS50YXJnZXQpO1xuICAgICAgICAgICAgY29uc3QgZGF0YSA9IHtcbiAgICAgICAgICAgICAgICBtYTogZm9ybS5maW5kKFwiW25hbWU9bWFdXCIpLnZhbCgpLFxuICAgICAgICAgICAgICAgIHNvX2x1b25nOiArZm9ybS5maW5kKFwiW25hbWU9J3NvX2x1b25nJ11cIikudmFsKCksXG4gICAgICAgICAgICAgICAgdG9uZ19naWE6ICtmb3JtLmZpbmQoXCJbbmFtZT0ndG9uZ19naWEnXVwiKS52YWwoKSxcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgIGNvbnN0IHJlcyA9IHlpZWxkIHRoaXMuYXBwLm1vZGVsLnRodW9jLmFkZChkYXRhLm1hLCBkYXRhLnNvX2x1b25nLCBkYXRhLnRvbmdfZ2lhKTtcbiAgICAgICAgICAgICAgICBhbGVydChcInN1Y2Nlc3M6IFwiICsgcmVzLm1hICsgXCI9PlwiICsgcmVzLnNvX2x1b25nX21vaSk7XG4gICAgICAgICAgICAgICAgd2luZG93LmxvY2F0aW9uLnJlbG9hZCgpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY2F0Y2ggKGUpIHtcbiAgICAgICAgICAgICAgICBhbGVydChcIkVycm9yOiBcIiArIGUpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9XG4gICAgc2hvdygpIHtcbiAgICAgICAgdGhpcy5wb3B1cC5tb2RhbChcInNob3dcIik7XG4gICAgfVxuICAgIGhpZGUoKSB7XG4gICAgICAgIHRoaXMucG9wdXAubW9kYWwoXCJoaWRlXCIpO1xuICAgIH1cbn1cbmV4cG9ydHMuQWRkVGh1b2NNb2RhbCA9IEFkZFRodW9jTW9kYWw7XG4vLyMgc291cmNlTWFwcGluZ1VSTD10aHVvYy1hZGQtbW9kYWwuanMubWFwIiwiXCJ1c2Ugc3RyaWN0XCI7XG52YXIgX19hd2FpdGVyID0gKHRoaXMgJiYgdGhpcy5fX2F3YWl0ZXIpIHx8IGZ1bmN0aW9uICh0aGlzQXJnLCBfYXJndW1lbnRzLCBQLCBnZW5lcmF0b3IpIHtcbiAgICByZXR1cm4gbmV3IChQIHx8IChQID0gUHJvbWlzZSkpKGZ1bmN0aW9uIChyZXNvbHZlLCByZWplY3QpIHtcbiAgICAgICAgZnVuY3Rpb24gZnVsZmlsbGVkKHZhbHVlKSB7IHRyeSB7IHN0ZXAoZ2VuZXJhdG9yLm5leHQodmFsdWUpKTsgfSBjYXRjaCAoZSkgeyByZWplY3QoZSk7IH0gfVxuICAgICAgICBmdW5jdGlvbiByZWplY3RlZCh2YWx1ZSkgeyB0cnkgeyBzdGVwKGdlbmVyYXRvcltcInRocm93XCJdKHZhbHVlKSk7IH0gY2F0Y2ggKGUpIHsgcmVqZWN0KGUpOyB9IH1cbiAgICAgICAgZnVuY3Rpb24gc3RlcChyZXN1bHQpIHsgcmVzdWx0LmRvbmUgPyByZXNvbHZlKHJlc3VsdC52YWx1ZSkgOiBuZXcgUChmdW5jdGlvbiAocmVzb2x2ZSkgeyByZXNvbHZlKHJlc3VsdC52YWx1ZSk7IH0pLnRoZW4oZnVsZmlsbGVkLCByZWplY3RlZCk7IH1cbiAgICAgICAgc3RlcCgoZ2VuZXJhdG9yID0gZ2VuZXJhdG9yLmFwcGx5KHRoaXNBcmcsIF9hcmd1bWVudHMgfHwgW10pKS5uZXh0KCkpO1xuICAgIH0pO1xufTtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmNvbnN0IGZvcm1WYWxfMSA9IHJlcXVpcmUoXCIuLi9mb3JtVmFsXCIpO1xuY29uc3QgQXV0b0NvbXBsZXRlXzEgPSByZXF1aXJlKFwiLi4vQXV0b0NvbXBsZXRlXCIpO1xuY2xhc3MgRWRpdFRodW9jTW9kYWwge1xuICAgIGNvbnN0cnVjdG9yKGlkLCBhcHApIHtcbiAgICAgICAgdGhpcy5hcHAgPSBhcHA7XG4gICAgICAgIHRoaXMucG9wdXAgPSAkKFwiI1wiICsgaWQpO1xuICAgICAgICB0aGlzLnBvcHVwLmxvYWQoXCIvbGF5b3V0cy9tb2RhbC1lZGl0LXRodW9jLmh0bWxcIiwgKCkgPT4ge1xuICAgICAgICAgICAgdGhpcy5wb3B1cC5maW5kKFwiZm9ybVwiKS5vbihcInN1Ym1pdFwiLCAoZSkgPT4ge1xuICAgICAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgICAgICB0aGlzLmZvcm1TdWJtaXRIYW5kbGUoZSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHRoaXMuaGFuZGxlTmNjSW5wdXQodGhpcy5wb3B1cC5maW5kKFwiW25hbWU9bmNjXVwiKSk7XG4gICAgICAgICAgICB0aGlzLmhhbmRsZURvblZpU2VsZWN0KHRoaXMucG9wdXAuZmluZChcIltuYW1lPWlkX2Rvbl92aV1cIikpO1xuICAgICAgICB9KTtcbiAgICB9XG4gICAgZm9ybVN1Ym1pdEhhbmRsZShlKSB7XG4gICAgICAgIHJldHVybiBfX2F3YWl0ZXIodGhpcywgdm9pZCAwLCB2b2lkIDAsIGZ1bmN0aW9uKiAoKSB7XG4gICAgICAgICAgICBjb25zdCBmb3JtID0gJChlLnRhcmdldCk7XG4gICAgICAgICAgICBjb25zdCBkYXRhID0gZm9ybVZhbF8xLmdldEZvcm1WYWx1ZShmb3JtKTtcbiAgICAgICAgICAgIC8vIHRydW9uZyBob3AgdGhheSBkb2kgbWFfdGh1b2MsIGNhbiAxIG1hX3RodW9jIHRydW9jIGRlIHVwZGF0ZVxuICAgICAgICAgICAgY29uc3QgbWFUaHVvY0RlVXBkYXRlID0gZm9ybS5hdHRyKFwiaWRfdmFsdWVcIik7XG4gICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgIGNvbnN0IHJlcyA9IHlpZWxkIHRoaXMuYXBwLm1vZGVsLnRodW9jLnVwZGF0ZShtYVRodW9jRGVVcGRhdGUsIGRhdGEpO1xuICAgICAgICAgICAgICAgIGFsZXJ0KFwiU3VjY2VzczogXCIgKyByZXMgKyBcIiByZWNvcmQocylcIik7XG4gICAgICAgICAgICAgICAgd2luZG93LmxvY2F0aW9uLnJlbG9hZCgpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY2F0Y2ggKGUpIHtcbiAgICAgICAgICAgICAgICBhbGVydChcIkVycm9yOiBcIiArIGUpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9XG4gICAgaGFuZGxlTmNjSW5wdXQodGFyZ2V0KSB7XG4gICAgICAgIGNvbnN0IGF1dG9jb21wbGV0ZSA9IG5ldyBBdXRvQ29tcGxldGVfMS5BdXRvQ29tcGxldGUodGFyZ2V0LCB0aGlzLmFwcC5tb2RlbC5uY2MpO1xuICAgICAgICBhdXRvY29tcGxldGUuc2V0TG9va3VwKFtcInRlblwiXSk7XG4gICAgICAgIGF1dG9jb21wbGV0ZS5vbkNob29zZSgoZGF0YSkgPT4ge1xuICAgICAgICAgICAgdGFyZ2V0LnZhbChkYXRhLnRlbik7XG4gICAgICAgIH0pO1xuICAgICAgICBhdXRvY29tcGxldGUubGlzdGVuKCk7XG4gICAgfVxuICAgIGhhbmRsZURvblZpU2VsZWN0KHRhcmdldCkge1xuICAgICAgICB0YXJnZXQuaHRtbChcIlwiKTtcbiAgICAgICAgdGhpcy5hcHAubW9kZWwuZG9uVmkucmVuZGVyU2VsZWN0SW5wdXQodGFyZ2V0KTtcbiAgICB9XG4gICAgc2hvdyhkYXRhKSB7XG4gICAgICAgIHRoaXMucG9wdXAuZmluZChcImZvcm1cIikuYXR0cihcImlkX3ZhbHVlXCIsIGRhdGEubWEpO1xuICAgICAgICB0aGlzLnBvcHVwLmZpbmQoXCJbbmFtZT1tYV1cIikudmFsKGRhdGEubWEpO1xuICAgICAgICB0aGlzLnBvcHVwLmZpbmQoXCJbbmFtZT10ZW5dXCIpLnZhbChkYXRhLnRlbik7XG4gICAgICAgIHRoaXMucG9wdXAuZmluZChcIltuYW1lPW5jY11cIikudmFsKGRhdGEudGVuX25jYyk7XG4gICAgICAgIHRoaXMucG9wdXAubW9kYWwoXCJzaG93XCIpO1xuICAgIH1cbiAgICBoaWRlKCkge1xuICAgICAgICB0aGlzLnBvcHVwLm1vZGFsKFwiaGlkZVwiKTtcbiAgICB9XG59XG5leHBvcnRzLkVkaXRUaHVvY01vZGFsID0gRWRpdFRodW9jTW9kYWw7XG4vLyMgc291cmNlTWFwcGluZ1VSTD10aHVvYy1lZGl0LW1vZGFsLmpzLm1hcCIsIlwidXNlIHN0cmljdFwiO1xudmFyIF9fYXdhaXRlciA9ICh0aGlzICYmIHRoaXMuX19hd2FpdGVyKSB8fCBmdW5jdGlvbiAodGhpc0FyZywgX2FyZ3VtZW50cywgUCwgZ2VuZXJhdG9yKSB7XG4gICAgcmV0dXJuIG5ldyAoUCB8fCAoUCA9IFByb21pc2UpKShmdW5jdGlvbiAocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgICAgIGZ1bmN0aW9uIGZ1bGZpbGxlZCh2YWx1ZSkgeyB0cnkgeyBzdGVwKGdlbmVyYXRvci5uZXh0KHZhbHVlKSk7IH0gY2F0Y2ggKGUpIHsgcmVqZWN0KGUpOyB9IH1cbiAgICAgICAgZnVuY3Rpb24gcmVqZWN0ZWQodmFsdWUpIHsgdHJ5IHsgc3RlcChnZW5lcmF0b3JbXCJ0aHJvd1wiXSh2YWx1ZSkpOyB9IGNhdGNoIChlKSB7IHJlamVjdChlKTsgfSB9XG4gICAgICAgIGZ1bmN0aW9uIHN0ZXAocmVzdWx0KSB7IHJlc3VsdC5kb25lID8gcmVzb2x2ZShyZXN1bHQudmFsdWUpIDogbmV3IFAoZnVuY3Rpb24gKHJlc29sdmUpIHsgcmVzb2x2ZShyZXN1bHQudmFsdWUpOyB9KS50aGVuKGZ1bGZpbGxlZCwgcmVqZWN0ZWQpOyB9XG4gICAgICAgIHN0ZXAoKGdlbmVyYXRvciA9IGdlbmVyYXRvci5hcHBseSh0aGlzQXJnLCBfYXJndW1lbnRzIHx8IFtdKSkubmV4dCgpKTtcbiAgICB9KTtcbn07XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5jbGFzcyBFZGl0UHJpY2VUaHVvY01vZGFsIHtcbiAgICBjb25zdHJ1Y3RvcihpZCwgYXBwKSB7XG4gICAgICAgIHRoaXMuYXBwID0gYXBwO1xuICAgICAgICB0aGlzLnBvcHVwID0gJChcIiNcIiArIGlkKTtcbiAgICAgICAgdGhpcy5wb3B1cC5sb2FkKFwiL2xheW91dHMvbW9kYWwtZWRpdC1wcmljZS10aHVvYy5odG1sXCIsICgpID0+IHtcbiAgICAgICAgICAgIC8vXG4gICAgICAgICAgICB0aGlzLnBvcHVwLmZpbmQoXCJmb3JtXCIpLm9uKFwic3VibWl0XCIsIChlKSA9PiB7XG4gICAgICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgICAgIHRoaXMuZm9ybVN1Ym1pdEhhbmRsZShlKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICB9XG4gICAgZm9ybVN1Ym1pdEhhbmRsZShlKSB7XG4gICAgICAgIHJldHVybiBfX2F3YWl0ZXIodGhpcywgdm9pZCAwLCB2b2lkIDAsIGZ1bmN0aW9uKiAoKSB7XG4gICAgICAgICAgICBjb25zdCBmb3JtID0gJChlLnRhcmdldCk7XG4gICAgICAgICAgICBjb25zdCBtYSA9IFwiXCIgKyBmb3JtLmZpbmQoXCJbbmFtZT1tYV90aHVvY11cIikudmFsKCk7XG4gICAgICAgICAgICBjb25zdCBwcmljZSA9ICtmb3JtLmZpbmQoXCJbbmFtZT1wcmljZV1cIikudmFsKCk7XG4gICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgIGNvbnN0IHJlcyA9IHlpZWxkIHRoaXMuYXBwLm1vZGVsLmJhbmdHaWEuYWRkKG1hLCBwcmljZSk7XG4gICAgICAgICAgICAgICAgYWxlcnQoXCJTdWNjZXNzXCIpO1xuICAgICAgICAgICAgICAgIHdpbmRvdy5sb2NhdGlvbi5yZWxvYWQoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNhdGNoIChlcnIpIHtcbiAgICAgICAgICAgICAgICBhbGVydChcIlwiICsgZXJyKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfVxuICAgIHNob3coKSB7XG4gICAgICAgIHRoaXMucG9wdXAubW9kYWwoXCJzaG93XCIpO1xuICAgIH1cbiAgICBoaWRlKCkge1xuICAgICAgICB0aGlzLnBvcHVwLm1vZGFsKFwiaGlkZVwiKTtcbiAgICB9XG59XG5leHBvcnRzLkVkaXRQcmljZVRodW9jTW9kYWwgPSBFZGl0UHJpY2VUaHVvY01vZGFsO1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9dGh1b2MtZWRpdC1wcmljZS1tb2RhbC5qcy5tYXAiLCJcInVzZSBzdHJpY3RcIjtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmNvbnN0IHRodW9jX2FkZF9tb2RhbF8xID0gcmVxdWlyZShcIi4vdGh1b2MtYWRkLW1vZGFsXCIpO1xuZXhwb3J0cy5BZGRUaHVvY01vZGFsID0gdGh1b2NfYWRkX21vZGFsXzEuQWRkVGh1b2NNb2RhbDtcbmNvbnN0IHRodW9jX2VkaXRfbW9kYWxfMSA9IHJlcXVpcmUoXCIuL3RodW9jLWVkaXQtbW9kYWxcIik7XG5leHBvcnRzLkVkaXRUaHVvY01vZGFsID0gdGh1b2NfZWRpdF9tb2RhbF8xLkVkaXRUaHVvY01vZGFsO1xuY29uc3QgdGh1b2NfbmV3X21vZGFsXzEgPSByZXF1aXJlKFwiLi90aHVvYy1uZXctbW9kYWxcIik7XG5leHBvcnRzLk5ld1RodW9jTW9kYWwgPSB0aHVvY19uZXdfbW9kYWxfMS5OZXdUaHVvY01vZGFsO1xuY29uc3QgdGh1b2NfZWRpdF9wcmljZV9tb2RhbF8xID0gcmVxdWlyZShcIi4vdGh1b2MtZWRpdC1wcmljZS1tb2RhbFwiKTtcbmV4cG9ydHMuRWRpdFByaWNlVGh1b2NNb2RhbCA9IHRodW9jX2VkaXRfcHJpY2VfbW9kYWxfMS5FZGl0UHJpY2VUaHVvY01vZGFsO1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9dGh1b2MtbW9kYWwuanMubWFwIiwiXCJ1c2Ugc3RyaWN0XCI7XG52YXIgX19hd2FpdGVyID0gKHRoaXMgJiYgdGhpcy5fX2F3YWl0ZXIpIHx8IGZ1bmN0aW9uICh0aGlzQXJnLCBfYXJndW1lbnRzLCBQLCBnZW5lcmF0b3IpIHtcbiAgICByZXR1cm4gbmV3IChQIHx8IChQID0gUHJvbWlzZSkpKGZ1bmN0aW9uIChyZXNvbHZlLCByZWplY3QpIHtcbiAgICAgICAgZnVuY3Rpb24gZnVsZmlsbGVkKHZhbHVlKSB7IHRyeSB7IHN0ZXAoZ2VuZXJhdG9yLm5leHQodmFsdWUpKTsgfSBjYXRjaCAoZSkgeyByZWplY3QoZSk7IH0gfVxuICAgICAgICBmdW5jdGlvbiByZWplY3RlZCh2YWx1ZSkgeyB0cnkgeyBzdGVwKGdlbmVyYXRvcltcInRocm93XCJdKHZhbHVlKSk7IH0gY2F0Y2ggKGUpIHsgcmVqZWN0KGUpOyB9IH1cbiAgICAgICAgZnVuY3Rpb24gc3RlcChyZXN1bHQpIHsgcmVzdWx0LmRvbmUgPyByZXNvbHZlKHJlc3VsdC52YWx1ZSkgOiBuZXcgUChmdW5jdGlvbiAocmVzb2x2ZSkgeyByZXNvbHZlKHJlc3VsdC52YWx1ZSk7IH0pLnRoZW4oZnVsZmlsbGVkLCByZWplY3RlZCk7IH1cbiAgICAgICAgc3RlcCgoZ2VuZXJhdG9yID0gZ2VuZXJhdG9yLmFwcGx5KHRoaXNBcmcsIF9hcmd1bWVudHMgfHwgW10pKS5uZXh0KCkpO1xuICAgIH0pO1xufTtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmNvbnN0IGZvcm1WYWxfMSA9IHJlcXVpcmUoXCIuLi9mb3JtVmFsXCIpO1xuY2xhc3MgTmV3VGh1b2NNb2RhbCB7XG4gICAgY29uc3RydWN0b3IoaWQsIGFwcCkge1xuICAgICAgICB0aGlzLmFwcCA9IGFwcDtcbiAgICAgICAgdGhpcy5wb3B1cCA9ICQoXCIjXCIgKyBpZCk7XG4gICAgICAgIHRoaXMucG9wdXAubG9hZChcIi9sYXlvdXRzL21vZGFsLW5ldy10aHVvYy5odG1sXCIsICgpID0+IHtcbiAgICAgICAgICAgIHRoaXMuYXBwLm1vZGVsLmRvblZpLnJlbmRlclNlbGVjdElucHV0KHRoaXMucG9wdXAuZmluZChcIltuYW1lPWlkX2Rvbl92aV1cIikpO1xuICAgICAgICAgICAgdGhpcy5wb3B1cC5maW5kKFwiZm9ybVwiKS5vbihcInN1Ym1pdFwiLCBmdW5jdGlvbiAoZSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBfX2F3YWl0ZXIodGhpcywgdm9pZCAwLCB2b2lkIDAsIGZ1bmN0aW9uKiAoKSB7XG4gICAgICAgICAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgZm9ybVZhbCA9IGZvcm1WYWxfMS5nZXRGb3JtVmFsdWUoJCh0aGlzKSk7XG4gICAgICAgICAgICAgICAgICAgIHlpZWxkIGFwcC5tb2RlbC50aHVvYy5jcmVhdGUoZm9ybVZhbCkuY2F0Y2goKGVycikgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgYWxlcnQoZXJyKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRocm93IGVycjtcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgIGFsZXJ0KFwic3VjY2Vzc1wiKTtcbiAgICAgICAgICAgICAgICAgICAgd2luZG93LmxvY2F0aW9uLnJlbG9hZCgpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgIH1cbiAgICBzaG93KCkge1xuICAgICAgICB0aGlzLnBvcHVwLm1vZGFsKFwic2hvd1wiKTtcbiAgICB9XG4gICAgaGlkZSgpIHtcbiAgICAgICAgdGhpcy5wb3B1cC5tb2RhbChcImhpZGVcIik7XG4gICAgfVxufVxuZXhwb3J0cy5OZXdUaHVvY01vZGFsID0gTmV3VGh1b2NNb2RhbDtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPXRodW9jLW5ldy1tb2RhbC5qcy5tYXAiLCJjb25zdCB7QXBwfSA9IHJlcXVpcmUoJy4uL2FwcC9BcHAnKTtcblxuJChkb2N1bWVudCkucmVhZHkoKCk9PntcbiAgICBjb25zdCBhcHAgPSBuZXcgQXBwKCk7XG5cbiAgICByZXF1aXJlKFwiLi4vYXBwL25oYXAtaG9hLWRvblwiKS5pbml0KGFwcCk7XG4gICAgcmVxdWlyZShcIi4uL2FwcC9uaGFwLXRodW9jXCIpLmluaXQoYXBwKTtcbn0pO1xuIl19
