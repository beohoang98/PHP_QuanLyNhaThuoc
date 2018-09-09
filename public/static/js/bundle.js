(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const KeyEvent_1 = require("./KeyEvent");
const Thuoc_1 = require("./Model/Thuoc");
const DonVi_1 = require("./Model/DonVi");
class App {
    // public ncc:
    constructor() {
        this.switchToPage(this.getPageFromUrl());
        this.handleSwitchPage();
        this.keyevent = new KeyEvent_1.KeyEvent();
        this.handleSetting();
        this.handleModal();
        this.thuoc = new Thuoc_1.Thuoc();
        this.donVi = new DonVi_1.DonVi();
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

},{"./KeyEvent":3,"./Model/DonVi":5,"./Model/Thuoc":9}],2:[function(require,module,exports){
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
}
exports.DonVi = DonVi;

},{"../ModelClass":6}],6:[function(require,module,exports){
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

},{}],7:[function(require,module,exports){
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
/**
 * Display data under table
 */
class TableData {
    constructor() {
        this._map = {};
        this._list = [];
        this._isConnect = false;
        this._connectStatus = "";
        this._isFetched = false;
        this._dbURL = "";
    }
    getData() {
        return __awaiter(this, void 0, void 0, function* () {
            let res = yield fetch(this._dbURL, { method: "GET", credentials: 'include' });
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
        });
    }
    get table() {
        return this._map;
    }
    get list() {
        return this._list;
    }
}
exports.default = TableData;

},{}],8:[function(require,module,exports){
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
const TableData_1 = require("../TableData");
class BangThuoc extends TableData_1.default {
    constructor() {
        super();
        this._dbURL = "/api/thuoc/";
    }
    update() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.getData();
            for (let row of this._list) {
                let id = row['id'];
                this._map[id] = row;
            }
        });
    }
}
exports.BangThuoc = BangThuoc;

},{"../TableData":7}],9:[function(require,module,exports){
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
const BangThuoc_1 = require("./BangThuoc");
exports.BangThuoc = BangThuoc_1.BangThuoc;
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

},{"../ModelClass":6,"./BangThuoc":8}],10:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Thuoc_1 = require("../Model/Thuoc");
const ViewTable_1 = require("./ViewTable");
const MenuContext_1 = require("../MenuContext");
class ThuocTable extends ViewTable_1.ViewTable {
    constructor() {
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
        this.model = new Thuoc_1.Thuoc();
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
            }
        });
    }
}
exports.ThuocTable = ThuocTable;

},{"../MenuContext":4,"../Model/Thuoc":9,"./ViewTable":11}],11:[function(require,module,exports){
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

},{}],12:[function(require,module,exports){
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

},{}],13:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const AutoComplete_1 = require("../AutoComplete");
function init(app) {
    const autocomplete = new AutoComplete_1.AutoComplete("nhap_hoa_don--ten_thuoc", app.thuoc);
    autocomplete.setLookup(["ma", "ten", "ncc", "don_vi", "don_gia"]);
    autocomplete.listen();
    autocomplete.onChoose((data) => {
        $("#nhap_hoa_don--ma_thuoc").val(data.ma);
        $("#nhap_hoa_don--ten_thuoc").val(data.ten);
        $("#nhap_hoa_don--ncc").val(data.ncc);
        $("#nhap_hoa_don--gia").val(data.don_gia);
        $("#nhap_hoa_don--don_vi").val(data.don_vi);
    });
}
exports.init = init;

},{"../AutoComplete":2}],14:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ThuocTable_1 = require("../View/ThuocTable");
const thuoc_modal_1 = require("./thuoc-modal");
const PAGE_ID = "page-nhap-thuoc";
class Init {
    constructor(app) {
        const thuocTable = new ThuocTable_1.ThuocTable();
        this.thuocTable = thuocTable;
        this.app = app;
        thuocTable.setElement($("#nhap_thuoc--table"));
        thuocTable.setLimitPerPage(100);
        thuocTable.onChoose((data) => {
            this.addThuoc(data);
        });
        thuocTable.onFocus((data) => {
            $(".thuoc--button").removeAttr("disabled");
        });
        thuocTable.onContextAdd(() => {
            this.addThuoc(thuocTable.currentData());
        });
        thuocTable.onContextEdit(() => {
            this.editThuoc(thuocTable.currentData());
        });
        thuocTable.onContextEditPrice(() => {
            this.editPriceThuoc(thuocTable.currentData());
        });
        thuocTable.render("");
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
                    $this.editThuoc(thuocTable.currentData());
                    break;
                case "add":
                    $this.addThuoc(thuocTable.currentData());
                    break;
                case "chinh-gia":
                    $this.editPriceThuoc(thuocTable.currentData());
                    break;
            }
        });
    }
    handleSelectKey(app) {
        app.onShortcutKey("ArrowUp", PAGE_ID, (e) => {
            this.thuocTable.selectUp();
        });
        app.onShortcutKey("ArrowDown", PAGE_ID, (e) => {
            this.thuocTable.selectDown();
        });
    }
    handleControlKey(app) {
        app.onShortcutKey("ctrl+d", PAGE_ID, (e) => {
            e.preventDefault();
            this.newThuoc();
        });
        app.onShortcutKey("ctrl+e", PAGE_ID, (e) => {
            e.preventDefault();
            this.editThuoc(this.thuocTable.currentData());
        });
        app.onShortcutKey("ctrl+g", PAGE_ID, (e) => {
            e.preventDefault();
            this.editPriceThuoc(this.thuocTable.currentData());
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
            $this.thuocTable.render(val);
        });
    }
    handleModalEvent() {
        this.addModal = new thuoc_modal_1.AddThuocModal("thuoc--add-modal", this.app);
        this.newModal = new thuoc_modal_1.NewThuocModal("thuoc--new-modal", this.app);
        this.editModal = new thuoc_modal_1.EditThuocModal("thuoc--edit-modal", this.app);
        this.editPriceModal = new thuoc_modal_1.EditPriceThuocModal("thuoc--edit-price-modal", this.app.thuoc);
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

},{"../View/ThuocTable":10,"./thuoc-modal":18}],15:[function(require,module,exports){
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
                const res = yield this.app.thuoc.add(data.ma, data.so_luong, data.tong_gia);
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

},{}],16:[function(require,module,exports){
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
class EditThuocModal {
    constructor(id, app) {
        this.app = app;
        this.popup = $("#" + id);
        this.popup.load("/layouts/modal-edit-thuoc.html", () => {
            this.popup.find("form").on("submit", (e) => {
                e.preventDefault();
                this.formSubmitHandle(e);
            });
        });
    }
    formSubmitHandle(e) {
        return __awaiter(this, void 0, void 0, function* () {
            const form = $(e.target);
            const data = formVal_1.getFormValue(form);
            // truong hop thay doi ma_thuoc, can 1 ma_thuoc truoc de update
            const maThuocDeUpdate = form.attr("id_value");
            try {
                const res = yield this.app.thuoc.update(maThuocDeUpdate, data);
                alert("Success: " + res + " record(s)");
                window.location.reload();
            }
            catch (e) {
                alert("Error: " + e);
            }
        });
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

},{"../formVal":12}],17:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class EditPriceThuocModal {
    constructor(id, model) {
        this.model = model;
        this.popup = $("#" + id);
        this.popup.load("/layouts/modal-edit-price-thuoc.html");
    }
    show() {
        this.popup.modal("show");
    }
    hide() {
        this.popup.modal("hide");
    }
}
exports.EditPriceThuocModal = EditPriceThuocModal;

},{}],18:[function(require,module,exports){
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

},{"./thuoc-add-modal":15,"./thuoc-edit-modal":16,"./thuoc-edit-price-modal":17,"./thuoc-new-modal":19}],19:[function(require,module,exports){
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
            this.app.donVi.get((data) => {
                const selectInput = this.popup.find("[component='DonVi']");
                selectInput.children().remove();
                for (const row of data) {
                    const opt = $("<option/>").val(row.id).text(row.ten);
                    selectInput.append(opt);
                }
                selectInput.children().eq(0).attr("checked", "true");
            });
            this.popup.find("form").on("submit", function (e) {
                return __awaiter(this, void 0, void 0, function* () {
                    e.preventDefault();
                    const formVal = formVal_1.getFormValue($(this));
                    yield app.thuoc.create(formVal).catch((err) => {
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

},{"../formVal":12}],20:[function(require,module,exports){
const {App} = require('../app/App');

$(document).ready(()=>{
    const app = new App();

    require("../app/nhap-hoa-don").init(app);
    require("../app/nhap-thuoc").init(app);
});

},{"../app/App":1,"../app/nhap-hoa-don":13,"../app/nhap-thuoc":14}]},{},[20])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvYXBwL0FwcC5qcyIsInNyYy9hcHAvQXV0b0NvbXBsZXRlL2luZGV4LmpzIiwic3JjL2FwcC9LZXlFdmVudC9pbmRleC5qcyIsInNyYy9hcHAvTWVudUNvbnRleHQvaW5kZXguanMiLCJzcmMvYXBwL01vZGVsL0RvblZpL2luZGV4LmpzIiwic3JjL2FwcC9Nb2RlbC9Nb2RlbENsYXNzL2luZGV4LmpzIiwic3JjL2FwcC9Nb2RlbC9UYWJsZURhdGEvaW5kZXguanMiLCJzcmMvYXBwL01vZGVsL1RodW9jL0JhbmdUaHVvYy5qcyIsInNyYy9hcHAvTW9kZWwvVGh1b2MvaW5kZXguanMiLCJzcmMvYXBwL1ZpZXcvVGh1b2NUYWJsZS5qcyIsInNyYy9hcHAvVmlldy9WaWV3VGFibGUuanMiLCJzcmMvYXBwL2Zvcm1WYWwuanMiLCJzcmMvYXBwL25oYXAtaG9hLWRvbi9pbmRleC5qcyIsInNyYy9hcHAvbmhhcC10aHVvYy9pbmRleC5qcyIsInNyYy9hcHAvbmhhcC10aHVvYy90aHVvYy1hZGQtbW9kYWwuanMiLCJzcmMvYXBwL25oYXAtdGh1b2MvdGh1b2MtZWRpdC1tb2RhbC5qcyIsInNyYy9hcHAvbmhhcC10aHVvYy90aHVvYy1lZGl0LXByaWNlLW1vZGFsLmpzIiwic3JjL2FwcC9uaGFwLXRodW9jL3RodW9jLW1vZGFsLmpzIiwic3JjL2FwcC9uaGFwLXRodW9jL3RodW9jLW5ldy1tb2RhbC5qcyIsInNyYy9zY3JpcHQvbWFpbi5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaEVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2SEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN4Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNwREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM1QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDekpBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25EQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMzQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2REE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN4SUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1hBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMxSEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQy9DQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbERBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDVkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQy9DQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbigpe2Z1bmN0aW9uIHIoZSxuLHQpe2Z1bmN0aW9uIG8oaSxmKXtpZighbltpXSl7aWYoIWVbaV0pe3ZhciBjPVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmU7aWYoIWYmJmMpcmV0dXJuIGMoaSwhMCk7aWYodSlyZXR1cm4gdShpLCEwKTt2YXIgYT1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK2krXCInXCIpO3Rocm93IGEuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixhfXZhciBwPW5baV09e2V4cG9ydHM6e319O2VbaV1bMF0uY2FsbChwLmV4cG9ydHMsZnVuY3Rpb24ocil7dmFyIG49ZVtpXVsxXVtyXTtyZXR1cm4gbyhufHxyKX0scCxwLmV4cG9ydHMscixlLG4sdCl9cmV0dXJuIG5baV0uZXhwb3J0c31mb3IodmFyIHU9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZSxpPTA7aTx0Lmxlbmd0aDtpKyspbyh0W2ldKTtyZXR1cm4gb31yZXR1cm4gcn0pKCkiLCJcInVzZSBzdHJpY3RcIjtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmNvbnN0IEtleUV2ZW50XzEgPSByZXF1aXJlKFwiLi9LZXlFdmVudFwiKTtcbmNvbnN0IFRodW9jXzEgPSByZXF1aXJlKFwiLi9Nb2RlbC9UaHVvY1wiKTtcbmNvbnN0IERvblZpXzEgPSByZXF1aXJlKFwiLi9Nb2RlbC9Eb25WaVwiKTtcbmNsYXNzIEFwcCB7XG4gICAgLy8gcHVibGljIG5jYzpcbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgdGhpcy5zd2l0Y2hUb1BhZ2UodGhpcy5nZXRQYWdlRnJvbVVybCgpKTtcbiAgICAgICAgdGhpcy5oYW5kbGVTd2l0Y2hQYWdlKCk7XG4gICAgICAgIHRoaXMua2V5ZXZlbnQgPSBuZXcgS2V5RXZlbnRfMS5LZXlFdmVudCgpO1xuICAgICAgICB0aGlzLmhhbmRsZVNldHRpbmcoKTtcbiAgICAgICAgdGhpcy5oYW5kbGVNb2RhbCgpO1xuICAgICAgICB0aGlzLnRodW9jID0gbmV3IFRodW9jXzEuVGh1b2MoKTtcbiAgICAgICAgdGhpcy5kb25WaSA9IG5ldyBEb25WaV8xLkRvblZpKCk7XG4gICAgfVxuICAgIGdldFVzZXJuYW1lKCkge1xuICAgICAgICBjb25zdCB1c2VybmFtZSA9IGRvY3VtZW50LmNvb2tpZS5tYXRjaCgvdXNlcm5hbWU9KFswLTlhLXpBLVpfXSspL2kpWzFdO1xuICAgICAgICAkKFwiI3VzZXJuYW1lXCIpLnRleHQodXNlcm5hbWUpO1xuICAgIH1cbiAgICBvblNob3J0Y3V0S2V5KGNvbWJLZXksIHBhZ2UsIGZ1bmMpIHtcbiAgICAgICAgLy8gZipraW5nIGluY3JlZGlibGUgc2NvcGUgdGhpbmdzIVxuICAgICAgICB0aGlzLmtleWV2ZW50Lm9uKGNvbWJLZXksIChlKSA9PiB7XG4gICAgICAgICAgICBpZiAodGhpcy5wYWdlID09PSBwYWdlKSB7XG4gICAgICAgICAgICAgICAgZnVuYyhlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfVxuICAgIGdldFBhZ2VGcm9tVXJsKCkge1xuICAgICAgICBsZXQgcGFnZSA9IG5ldyBVUkwod2luZG93LmxvY2F0aW9uLnRvU3RyaW5nKCkpLnNlYXJjaFBhcmFtcy5nZXQoXCJwYWdlXCIpO1xuICAgICAgICBpZiAoIXBhZ2UpIHtcbiAgICAgICAgICAgIHBhZ2UgPSBcInBhZ2UtbmhhcC1ob2EtZG9uXCI7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHBhZ2U7XG4gICAgfVxuICAgIGhhbmRsZVN3aXRjaFBhZ2UoKSB7XG4gICAgICAgIGNvbnN0ICR0aGlzID0gdGhpcztcbiAgICAgICAgJChcIi5zaWRlYmFyLXN3aXRjaC1wYWdlXCIpLm9uKFwiY2xpY2tcIiwgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgY29uc3QgaWQgPSAkKHRoaXMpLmRhdGEoXCJ0YXJnZXRcIik7XG4gICAgICAgICAgICAkdGhpcy5zd2l0Y2hUb1BhZ2UoaWQpO1xuICAgICAgICB9KTtcbiAgICB9XG4gICAgc3dpdGNoVG9QYWdlKGlkKSB7XG4gICAgICAgIHRoaXMucGFnZSA9IGlkO1xuICAgICAgICB3aW5kb3cuaGlzdG9yeS5yZXBsYWNlU3RhdGUobnVsbCwgaWQsIFwiLz9wYWdlPVwiICsgaWQpO1xuICAgICAgICBjb25zdCBjb250YWluZXIgPSAkKFwiLmZyYW1lLWNvbnRhaW5lclwiKTtcbiAgICAgICAgY29uc3QgcGFnZSA9ICQoXCIjXCIgKyBpZCk7XG4gICAgICAgIGNvbnRhaW5lci5hbmltYXRlKHtcbiAgICAgICAgICAgIHNjcm9sbFRvcDogcGFnZS5vZmZzZXQoKS50b3AgLSBjb250YWluZXIub2Zmc2V0KCkudG9wICsgY29udGFpbmVyLnNjcm9sbFRvcCgpLFxuICAgICAgICB9KTtcbiAgICB9XG4gICAgaGFuZGxlU2V0dGluZygpIHtcbiAgICAgICAgLy9cbiAgICB9XG4gICAgaGFuZGxlTW9kYWwoKSB7XG4gICAgICAgICQoXCIubW9kYWxcIikub24oXCJzaG93bi5icy5tb2RhbFwiLCAoKSA9PiB7XG4gICAgICAgICAgICB0aGlzLmtleWV2ZW50LmJsb2NrKCk7XG4gICAgICAgIH0pO1xuICAgICAgICAkKFwiLm1vZGFsXCIpLm9uKFwiaGlkZGVuLmJzLm1vZGFsXCIsICgpID0+IHtcbiAgICAgICAgICAgIHRoaXMua2V5ZXZlbnQudW5ibG9jaygpO1xuICAgICAgICB9KTtcbiAgICB9XG59XG5leHBvcnRzLkFwcCA9IEFwcDtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPUFwcC5qcy5tYXAiLCJcInVzZSBzdHJpY3RcIjtcbnZhciBfX2F3YWl0ZXIgPSAodGhpcyAmJiB0aGlzLl9fYXdhaXRlcikgfHwgZnVuY3Rpb24gKHRoaXNBcmcsIF9hcmd1bWVudHMsIFAsIGdlbmVyYXRvcikge1xuICAgIHJldHVybiBuZXcgKFAgfHwgKFAgPSBQcm9taXNlKSkoZnVuY3Rpb24gKHJlc29sdmUsIHJlamVjdCkge1xuICAgICAgICBmdW5jdGlvbiBmdWxmaWxsZWQodmFsdWUpIHsgdHJ5IHsgc3RlcChnZW5lcmF0b3IubmV4dCh2YWx1ZSkpOyB9IGNhdGNoIChlKSB7IHJlamVjdChlKTsgfSB9XG4gICAgICAgIGZ1bmN0aW9uIHJlamVjdGVkKHZhbHVlKSB7IHRyeSB7IHN0ZXAoZ2VuZXJhdG9yW1widGhyb3dcIl0odmFsdWUpKTsgfSBjYXRjaCAoZSkgeyByZWplY3QoZSk7IH0gfVxuICAgICAgICBmdW5jdGlvbiBzdGVwKHJlc3VsdCkgeyByZXN1bHQuZG9uZSA/IHJlc29sdmUocmVzdWx0LnZhbHVlKSA6IG5ldyBQKGZ1bmN0aW9uIChyZXNvbHZlKSB7IHJlc29sdmUocmVzdWx0LnZhbHVlKTsgfSkudGhlbihmdWxmaWxsZWQsIHJlamVjdGVkKTsgfVxuICAgICAgICBzdGVwKChnZW5lcmF0b3IgPSBnZW5lcmF0b3IuYXBwbHkodGhpc0FyZywgX2FyZ3VtZW50cyB8fCBbXSkpLm5leHQoKSk7XG4gICAgfSk7XG59O1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuY2xhc3MgQXV0b0NvbXBsZXRlIHtcbiAgICBjb25zdHJ1Y3Rvcih0YXJnZXQsIG1vZGVsKSB7XG4gICAgICAgIGlmICh0eXBlb2YgdGFyZ2V0ID09PSBcInN0cmluZ1wiKSB7XG4gICAgICAgICAgICB0aGlzLnRhcmdldCA9ICQoXCIjXCIgKyB0YXJnZXQpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgdGhpcy50YXJnZXQgPSB0YXJnZXQ7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy50YXJnZXQuYXR0cihcImF1dG9jb21wbGV0ZVwiLCBcIm9mZlwiKTtcbiAgICAgICAgdGhpcy5tb2RlbCA9IG1vZGVsO1xuICAgIH1cbiAgICBvbkNob29zZShmdW5jKSB7XG4gICAgICAgIHRoaXMuZnVuY09uQ2hvb3NlID0gZnVuYztcbiAgICB9XG4gICAgaXNTaG93ZWQoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmVsZW1lbnQuY2hpbGRyZW4ubGVuZ3RoID4gMDtcbiAgICB9XG4gICAgLyoqXG4gICAgICogc2V0IGZpZWxkbmFtZSB0byBzaG93XG4gICAgICogQHBhcmFtIGxvb2t1cCB7ZmllbGROYW1lOiBFbGVtZW50SWR9XG4gICAgICovXG4gICAgc2V0TG9va3VwKGxvb2t1cCkge1xuICAgICAgICB0aGlzLmxvb2t1cCA9IGxvb2t1cDtcbiAgICB9XG4gICAgbGlzdGVuKCkge1xuICAgICAgICB0aGlzLnRhcmdldC5vbihcImtleXVwXCIsIChlKSA9PiB7XG4gICAgICAgICAgICBjb25zdCBrZXkgPSBlLmtleTtcbiAgICAgICAgICAgIHN3aXRjaCAoa2V5KSB7XG4gICAgICAgICAgICAgICAgY2FzZSBcIkVudGVyXCI6IHtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGNhc2UgXCJFc2NhcGVcIjoge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnJlbW92ZSgpO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgY2FzZSBcIkFycm93VXBcIjoge1xuICAgICAgICAgICAgICAgICAgICAvLyB0byBkb1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgY2FzZSBcIkFycm93RG93blwiOiB7XG4gICAgICAgICAgICAgICAgICAgIC8vIHRvIGRvXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBkZWZhdWx0OiB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHZhbCA9IHRoaXMudGFyZ2V0LnZhbCgpO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnJlbW92ZSgpO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnJlbmRlcih2YWwpLnRoZW4oKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5zaG93KCk7XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfVxuICAgIHJlbmRlcihzZWFyY2gpIHtcbiAgICAgICAgcmV0dXJuIF9fYXdhaXRlcih0aGlzLCB2b2lkIDAsIHZvaWQgMCwgZnVuY3Rpb24qICgpIHtcbiAgICAgICAgICAgIHRoaXMuZWxlbWVudCA9ICQoXCI8dWwvPlwiKS5hZGRDbGFzcyhcIm15LWF1dG9jb21wbGV0ZSBzaGFkb3ctbGcgcm91bmRlZFwiKTtcbiAgICAgICAgICAgIHRoaXMuZWxlbWVudC5jc3Moe1xuICAgICAgICAgICAgICAgIHRvcDogdGhpcy50YXJnZXQub2Zmc2V0KCkudG9wICsgdGhpcy50YXJnZXQub3V0ZXJIZWlnaHQoKSxcbiAgICAgICAgICAgICAgICBsZWZ0OiB0aGlzLnRhcmdldC5vZmZzZXQoKS5sZWZ0LFxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBjb25zdCBkYXRhID0geWllbGQgdGhpcy5nZXREYXRhKHNlYXJjaCk7XG4gICAgICAgICAgICB0aGlzLmN1cnJlbnRPZmZzZXQgPSAwO1xuICAgICAgICAgICAgbGV0IG9mZnNldCA9IDA7XG4gICAgICAgICAgICBmb3IgKGNvbnN0IGRhdGFSb3cgb2YgZGF0YSkge1xuICAgICAgICAgICAgICAgIGNvbnN0IGRhdGFSb3dGaWx0ZXJlZCA9IHRoaXMuZmlsdGVyRGF0YVdpdGhMb29rdXAoZGF0YVJvdyk7XG4gICAgICAgICAgICAgICAgY29uc3Qgcm93RWxlbWVudCA9IHRoaXMucmVuZGVyUm93KGRhdGFSb3dGaWx0ZXJlZCwgb2Zmc2V0KyspO1xuICAgICAgICAgICAgICAgIHJvd0VsZW1lbnQub24oXCJjbGljayBrZXlkb3duXCIsIChlKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChlLnR5cGUgPT09IFwiY2xpY2tcIiB8fCBlLmtleSA9PT0gXCJFbnRlclwiKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICAgICAgICAgICAgICBlLnN0b3BQcm9wYWdhdGlvbigpO1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5mdW5jT25DaG9vc2UoZGF0YVJvdyk7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnJlbW92ZSgpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgdGhpcy5lbGVtZW50LmFwcGVuZChyb3dFbGVtZW50KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfVxuICAgIHNob3coKSB7XG4gICAgICAgICQoXCJib2R5XCIpLmFwcGVuZCh0aGlzLmVsZW1lbnQpO1xuICAgIH1cbiAgICByZW1vdmUoKSB7XG4gICAgICAgICQoXCIubXktYXV0b2NvbXBsZXRlXCIpLnJlbW92ZSgpO1xuICAgIH1cbiAgICBnZXREYXRhKHNlYXJjaCkge1xuICAgICAgICByZXR1cm4gX19hd2FpdGVyKHRoaXMsIHZvaWQgMCwgdm9pZCAwLCBmdW5jdGlvbiogKCkge1xuICAgICAgICAgICAgY29uc3QgZGF0YSA9IHlpZWxkIHRoaXMubW9kZWwuZ2V0KHNlYXJjaCwgMCwgMjApOyAvLyAyMCBpcyBmb3IgdGVzdCBmaXJzdCwgd2lsbCBkZXZlbG9wIGluIGZ1dHVyZVxuICAgICAgICAgICAgcmV0dXJuIGRhdGE7XG4gICAgICAgIH0pO1xuICAgIH1cbiAgICByZW5kZXJSb3coZGF0YVJvdywgb2Zmc2V0KSB7XG4gICAgICAgIGNvbnN0IHJvdyA9ICQoXCI8bGkvPlwiKS5kYXRhKFwib2Zmc2V0XCIsIG9mZnNldCk7XG4gICAgICAgIGZvciAoY29uc3QgZmllbGQgb2YgT2JqZWN0LmtleXMoZGF0YVJvdykpIHtcbiAgICAgICAgICAgIGNvbnN0IHZhbCA9IGRhdGFSb3dbZmllbGRdO1xuICAgICAgICAgICAgcm93LmFwcGVuZCgkKFwiPGRpdi8+XCIpLnRleHQodmFsKSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHJvdztcbiAgICB9XG4gICAgZmlsdGVyRGF0YVdpdGhMb29rdXAoZGF0YVJvdykge1xuICAgICAgICBjb25zdCBmaWx0ZXJlZERhdGEgPSB7fTtcbiAgICAgICAgZm9yIChjb25zdCBrZXkgb2YgdGhpcy5sb29rdXApIHtcbiAgICAgICAgICAgIGlmIChkYXRhUm93Lmhhc093blByb3BlcnR5KGtleSkpIHtcbiAgICAgICAgICAgICAgICBmaWx0ZXJlZERhdGFba2V5XSA9IGRhdGFSb3dba2V5XTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZmlsdGVyZWREYXRhO1xuICAgIH1cbn1cbmV4cG9ydHMuQXV0b0NvbXBsZXRlID0gQXV0b0NvbXBsZXRlO1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9aW5kZXguanMubWFwIiwiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5jbGFzcyBLZXlFdmVudCB7XG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHRoaXMuZXZlbnRBdHRhY2ggPSB7fTtcbiAgICAgICAgdGhpcy5pc0Jsb2NraW5nID0gZmFsc2U7XG4gICAgICAgICQoZG9jdW1lbnQpLm9uKFwia2V5ZG93blwiLCAoZSkgPT4ge1xuICAgICAgICAgICAgaWYgKHRoaXMuaXNCbG9ja2luZykge1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGxldCBjb21iS2V5ID0gXCJcIjtcbiAgICAgICAgICAgIGlmIChlLmN0cmxLZXkpIHtcbiAgICAgICAgICAgICAgICBjb21iS2V5ID0gXCJjdHJsK1wiO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY29tYktleSArPSBlLmtleTtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKGNvbWJLZXkpO1xuICAgICAgICAgICAgaWYgKHRoaXMuZXZlbnRBdHRhY2guaGFzT3duUHJvcGVydHkoY29tYktleSkpIHtcbiAgICAgICAgICAgICAgICBjb25zdCBsaXN0RnVuYyA9IHRoaXMuZXZlbnRBdHRhY2hbY29tYktleV07XG4gICAgICAgICAgICAgICAgZm9yIChjb25zdCBmdW5jIG9mIGxpc3RGdW5jKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmICh0eXBlb2YgZnVuYyA9PT0gXCJmdW5jdGlvblwiKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBmdW5jKGUpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9XG4gICAgb24oY29tYktleSwgZnVuYykge1xuICAgICAgICBpZiAoIXRoaXMuZXZlbnRBdHRhY2hbY29tYktleV0pIHtcbiAgICAgICAgICAgIHRoaXMuZXZlbnRBdHRhY2hbY29tYktleV0gPSBbXTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmV2ZW50QXR0YWNoW2NvbWJLZXldLnB1c2goZnVuYyk7XG4gICAgfVxuICAgIGJsb2NrKCkge1xuICAgICAgICB0aGlzLmlzQmxvY2tpbmcgPSB0cnVlO1xuICAgIH1cbiAgICB1bmJsb2NrKCkge1xuICAgICAgICB0aGlzLmlzQmxvY2tpbmcgPSBmYWxzZTtcbiAgICB9XG59XG5leHBvcnRzLktleUV2ZW50ID0gS2V5RXZlbnQ7XG4vLyMgc291cmNlTWFwcGluZ1VSTD1pbmRleC5qcy5tYXAiLCJcInVzZSBzdHJpY3RcIjtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmNsYXNzIE1lbnVDb250ZXh0IHtcbiAgICBjb25zdHJ1Y3Rvcih0YXJnZXQpIHtcbiAgICAgICAgaWYgKHR5cGVvZiB0YXJnZXQgPT09IFwic3RyaW5nXCIpIHtcbiAgICAgICAgICAgIHRoaXMudGFyZ2V0ID0gJChcIiNcIiArIHRhcmdldCk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICB0aGlzLnRhcmdldCA9IHRhcmdldDtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLnRhcmdldC5vbihcImNvbnRleHRtZW51XCIsIChlKSA9PiB7XG4gICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICBlLnN0b3BQcm9wYWdhdGlvbigpO1xuICAgICAgICAgICAgdGhpcy5yZW1vdmUoKS5yZW5kZXIoeyB4OiBlLmNsaWVudFgsIHk6IGUuY2xpZW50WSB9KS5zaG93KCk7XG4gICAgICAgIH0pO1xuICAgICAgICB0aGlzLm1lbnUgPSBbXTtcbiAgICB9XG4gICAgYWRkQ29udGV4dChwcm9wKSB7XG4gICAgICAgIHRoaXMubWVudS5wdXNoKHByb3ApO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG4gICAgcmVuZGVyKHBvcykge1xuICAgICAgICB0aGlzLmVsZW1lbnQgPSAkKFwiPHVsLz5cIikuYWRkQ2xhc3MoXCJzaGFkb3ctbGcgcm91bmRlZCBteS1jb250ZXh0bWVudVwiKTtcbiAgICAgICAgdGhpcy5lbGVtZW50LmNzcyhcInRvcFwiLCBwb3MueSArIFwicHhcIik7XG4gICAgICAgIHRoaXMuZWxlbWVudC5jc3MoXCJsZWZ0XCIsIHBvcy54ICsgXCJweFwiKTtcbiAgICAgICAgZm9yIChjb25zdCBjdHggb2YgdGhpcy5tZW51KSB7XG4gICAgICAgICAgICB0aGlzLmVsZW1lbnQuYXBwZW5kKHRoaXMucmVuZGVyQ29udGV4dChjdHgpKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmVsZW1lbnQuaGlkZSgpO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG4gICAgc2hvdygpIHtcbiAgICAgICAgJChcImJvZHlcIikuYXBwZW5kKHRoaXMuZWxlbWVudCk7XG4gICAgICAgIHRoaXMuZWxlbWVudC5zbGlkZURvd24oMC41KTtcbiAgICAgICAgJChkb2N1bWVudCkub2ZmKFwiY2xpY2tcIiwgdGhpcy5yZW1vdmUpLm9uKFwiY2xpY2tcIiwgdGhpcy5yZW1vdmUpO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG4gICAgcmVtb3ZlKCkge1xuICAgICAgICAkKFwiLm15LWNvbnRleHRtZW51XCIpLnJlbW92ZSgpO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG4gICAgcmVuZGVyQ29udGV4dChwcm9wKSB7XG4gICAgICAgIGNvbnN0IGNvbnRleHQgPSAkKFwiPGxpLz5cIik7XG4gICAgICAgIGNvbnRleHQuaHRtbChgPGkgY2xhc3M9JyR7cHJvcC5pY29ufSAke3Byb3AuY2xhc3NOYW1lfSc+PC9pPiAke3Byb3AudGl0bGV9YCk7XG4gICAgICAgIGNvbnRleHQub24oXCJjbGlja1wiLCAoZSkgPT4ge1xuICAgICAgICAgICAgdGhpcy5yZW1vdmUoKTtcbiAgICAgICAgICAgIHByb3AuY2xpY2soZSk7XG4gICAgICAgIH0pO1xuICAgICAgICByZXR1cm4gY29udGV4dDtcbiAgICB9XG59XG5leHBvcnRzLk1lbnVDb250ZXh0ID0gTWVudUNvbnRleHQ7XG4vLyMgc291cmNlTWFwcGluZ1VSTD1pbmRleC5qcy5tYXAiLCJcInVzZSBzdHJpY3RcIjtcbnZhciBfX2F3YWl0ZXIgPSAodGhpcyAmJiB0aGlzLl9fYXdhaXRlcikgfHwgZnVuY3Rpb24gKHRoaXNBcmcsIF9hcmd1bWVudHMsIFAsIGdlbmVyYXRvcikge1xuICAgIHJldHVybiBuZXcgKFAgfHwgKFAgPSBQcm9taXNlKSkoZnVuY3Rpb24gKHJlc29sdmUsIHJlamVjdCkge1xuICAgICAgICBmdW5jdGlvbiBmdWxmaWxsZWQodmFsdWUpIHsgdHJ5IHsgc3RlcChnZW5lcmF0b3IubmV4dCh2YWx1ZSkpOyB9IGNhdGNoIChlKSB7IHJlamVjdChlKTsgfSB9XG4gICAgICAgIGZ1bmN0aW9uIHJlamVjdGVkKHZhbHVlKSB7IHRyeSB7IHN0ZXAoZ2VuZXJhdG9yW1widGhyb3dcIl0odmFsdWUpKTsgfSBjYXRjaCAoZSkgeyByZWplY3QoZSk7IH0gfVxuICAgICAgICBmdW5jdGlvbiBzdGVwKHJlc3VsdCkgeyByZXN1bHQuZG9uZSA/IHJlc29sdmUocmVzdWx0LnZhbHVlKSA6IG5ldyBQKGZ1bmN0aW9uIChyZXNvbHZlKSB7IHJlc29sdmUocmVzdWx0LnZhbHVlKTsgfSkudGhlbihmdWxmaWxsZWQsIHJlamVjdGVkKTsgfVxuICAgICAgICBzdGVwKChnZW5lcmF0b3IgPSBnZW5lcmF0b3IuYXBwbHkodGhpc0FyZywgX2FyZ3VtZW50cyB8fCBbXSkpLm5leHQoKSk7XG4gICAgfSk7XG59O1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuY29uc3QgTW9kZWxDbGFzc18xID0gcmVxdWlyZShcIi4uL01vZGVsQ2xhc3NcIik7XG5jbGFzcyBEb25WaSBleHRlbmRzIE1vZGVsQ2xhc3NfMS5Nb2RlbCB7XG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHN1cGVyKCk7XG4gICAgICAgIHRoaXMuZGF0YWJhc2UgPSBcIi9hcGkvZG9uX3ZpL1wiO1xuICAgIH1cbiAgICBnZXQoY2FsbGJhY2spIHtcbiAgICAgICAgcmV0dXJuIF9fYXdhaXRlcih0aGlzLCB2b2lkIDAsIHZvaWQgMCwgZnVuY3Rpb24qICgpIHtcbiAgICAgICAgICAgIGNvbnN0IGRhdGEgPSB5aWVsZCB0aGlzLl9nZXQoe30pO1xuICAgICAgICAgICAgdGhpcy5kYXRhID0gZGF0YTtcbiAgICAgICAgICAgIGlmICh0eXBlb2YgY2FsbGJhY2sgPT09IFwiZnVuY3Rpb25cIikge1xuICAgICAgICAgICAgICAgIGNhbGxiYWNrKGRhdGEpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuZGF0YTtcbiAgICAgICAgfSk7XG4gICAgfVxufVxuZXhwb3J0cy5Eb25WaSA9IERvblZpO1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9aW5kZXguanMubWFwIiwiXCJ1c2Ugc3RyaWN0XCI7XG52YXIgX19hd2FpdGVyID0gKHRoaXMgJiYgdGhpcy5fX2F3YWl0ZXIpIHx8IGZ1bmN0aW9uICh0aGlzQXJnLCBfYXJndW1lbnRzLCBQLCBnZW5lcmF0b3IpIHtcbiAgICByZXR1cm4gbmV3IChQIHx8IChQID0gUHJvbWlzZSkpKGZ1bmN0aW9uIChyZXNvbHZlLCByZWplY3QpIHtcbiAgICAgICAgZnVuY3Rpb24gZnVsZmlsbGVkKHZhbHVlKSB7IHRyeSB7IHN0ZXAoZ2VuZXJhdG9yLm5leHQodmFsdWUpKTsgfSBjYXRjaCAoZSkgeyByZWplY3QoZSk7IH0gfVxuICAgICAgICBmdW5jdGlvbiByZWplY3RlZCh2YWx1ZSkgeyB0cnkgeyBzdGVwKGdlbmVyYXRvcltcInRocm93XCJdKHZhbHVlKSk7IH0gY2F0Y2ggKGUpIHsgcmVqZWN0KGUpOyB9IH1cbiAgICAgICAgZnVuY3Rpb24gc3RlcChyZXN1bHQpIHsgcmVzdWx0LmRvbmUgPyByZXNvbHZlKHJlc3VsdC52YWx1ZSkgOiBuZXcgUChmdW5jdGlvbiAocmVzb2x2ZSkgeyByZXNvbHZlKHJlc3VsdC52YWx1ZSk7IH0pLnRoZW4oZnVsZmlsbGVkLCByZWplY3RlZCk7IH1cbiAgICAgICAgc3RlcCgoZ2VuZXJhdG9yID0gZ2VuZXJhdG9yLmFwcGx5KHRoaXNBcmcsIF9hcmd1bWVudHMgfHwgW10pKS5uZXh0KCkpO1xuICAgIH0pO1xufTtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmNsYXNzIE1vZGVsIHtcbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgdGhpcy5kYXRhYmFzZSA9IFwiXCI7XG4gICAgICAgIHRoaXMuZGF0YSA9IFtdO1xuICAgIH1cbiAgICBnZXQgZmV0Y2hEYXRhKCkge1xuICAgICAgICByZXR1cm4gT2JqZWN0LmFzc2lnbih7fSwgdGhpcy5kYXRhKTtcbiAgICB9XG4gICAgZ2V0IHJlc3BvbnNlKCkge1xuICAgICAgICByZXR1cm4gT2JqZWN0LmFzc2lnbih7fSwgdGhpcy5yZXMpO1xuICAgIH1cbiAgICAvLyA9PT09PT09PT09PT09PT0gSU5IRVJJVCBGVU5DXG4gICAgZ2V0KHBhcmFtcywgb2Zmc2V0LCBsaW1pdCkge1xuICAgICAgICByZXR1cm4gX19hd2FpdGVyKHRoaXMsIHZvaWQgMCwgdm9pZCAwLCBmdW5jdGlvbiogKCkge1xuICAgICAgICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICAgICAgfSk7XG4gICAgfVxuICAgIGNyZWF0ZShkYXRhKSB7XG4gICAgICAgIHJldHVybiBfX2F3YWl0ZXIodGhpcywgdm9pZCAwLCB2b2lkIDAsIGZ1bmN0aW9uKiAoKSB7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH0pO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiB1cGRhdGUgcmVjb3JkXG4gICAgICogQHBhcmFtIGZpZWxkTWF0Y2ggbWF0Y2ggZmllbGQgdG8gdXBkYXRlIHJlY29yZFxuICAgICAqIEBwYXJhbSBmaWVsZFVwZGF0ZSB0aGUgZGF0YSBuZWVkIHVwZGF0ZVxuICAgICAqL1xuICAgIHVwZGF0ZShmaWVsZE1hdGNoLCBmaWVsZFVwZGF0ZSkge1xuICAgICAgICByZXR1cm4gX19hd2FpdGVyKHRoaXMsIHZvaWQgMCwgdm9pZCAwLCBmdW5jdGlvbiogKCkge1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9KTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogcmVtb3ZlIGEgcmVjb3JkXG4gICAgICogQHBhcmFtIGZpZWxkTWF0Y2ggZmllbGQgbWF0Y2ggdG8gcmVtb3ZlXG4gICAgICogQHJldHVybiB0cnVlIG9mIGZhbHNlXG4gICAgICovXG4gICAgcmVtb3ZlKGZpZWxkTWF0Y2gpIHtcbiAgICAgICAgcmV0dXJuIF9fYXdhaXRlcih0aGlzLCB2b2lkIDAsIHZvaWQgMCwgZnVuY3Rpb24qICgpIHtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfSk7XG4gICAgfVxuICAgIC8vID09PT09PT09PT09PT09PSBDT1JFIEZVTkNcbiAgICAvKipcbiAgICAgKiBmZXRjaCBkYXRhIGZyb20gZGF0YWJhc2UgYW5kIGRvIHRoaW5nXG4gICAgICogQHBhcmFtIHBhcmFtc1xuICAgICAqIEBwYXJhbSBjYWxsYmFjayBjYWxsYmFjayBmdW5jdGlvblxuICAgICAqL1xuICAgIF9nZXQocGFyYW1zLCBjYWxsYmFjaykge1xuICAgICAgICByZXR1cm4gX19hd2FpdGVyKHRoaXMsIHZvaWQgMCwgdm9pZCAwLCBmdW5jdGlvbiogKCkge1xuICAgICAgICAgICAgdGhpcy5kYXRhID0gW107XG4gICAgICAgICAgICBjb25zdCByZXF1ZXN0VVJMID0gdGhpcy5kYXRhYmFzZSArIFwiP1wiICsgdGhpcy5fdXJscGFyYW1zKHBhcmFtcyk7XG4gICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgIGNvbnN0IHJlcyA9IHlpZWxkIGZldGNoKHJlcXVlc3RVUkwsIHsgY3JlZGVudGlhbHM6IFwiaW5jbHVkZVwiIH0pO1xuICAgICAgICAgICAgICAgIGNvbnN0IGpzb24gPSB5aWVsZCByZXMuanNvbigpO1xuICAgICAgICAgICAgICAgIGlmIChqc29uLmVycikge1xuICAgICAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoanNvbi5tc2cpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB0aGlzLmRhdGEgPSBqc29uLmRhdGE7XG4gICAgICAgICAgICAgICAgaWYgKHR5cGVvZiBjYWxsYmFjayA9PT0gXCJmdW5jdGlvblwiKSB7XG4gICAgICAgICAgICAgICAgICAgIGNhbGxiYWNrKGZhbHNlLCBqc29uLmRhdGEpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICByZXR1cm4ganNvbi5kYXRhO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY2F0Y2ggKGVycikge1xuICAgICAgICAgICAgICAgIGlmICh0eXBlb2YgY2FsbGJhY2sgPT09IFwiZnVuY3Rpb25cIikge1xuICAgICAgICAgICAgICAgICAgICBjYWxsYmFjayhlcnIpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgdGhyb3cgZXJyO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIHBvc3QgcmVxdWVzdFxuICAgICAqIEBwYXJhbSB7YW55fSBkYXRhXG4gICAgICogQHBhcmFtIHtGdW5jdGlvbn0gW2NhbGxiYWNrXVxuICAgICAqL1xuICAgIF9wb3N0KGRhdGEsIGNhbGxiYWNrKSB7XG4gICAgICAgIHJldHVybiBfX2F3YWl0ZXIodGhpcywgdm9pZCAwLCB2b2lkIDAsIGZ1bmN0aW9uKiAoKSB7XG4gICAgICAgICAgICB0aGlzLnJlcyA9IFwiXCI7XG4gICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgIGNvbnN0IHJlcyA9IHlpZWxkIGZldGNoKHRoaXMuZGF0YWJhc2UsIHtcbiAgICAgICAgICAgICAgICAgICAgYm9keTogSlNPTi5zdHJpbmdpZnkoZGF0YSksXG4gICAgICAgICAgICAgICAgICAgIGNyZWRlbnRpYWxzOiBcImluY2x1ZGVcIixcbiAgICAgICAgICAgICAgICAgICAgaGVhZGVyczoge1xuICAgICAgICAgICAgICAgICAgICAgICAgXCJDb250ZW50LVR5cGVcIjogXCJhcHBsaWNhdGlvbi9qc29uXCIsXG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgIG1ldGhvZDogXCJQT1NUXCIsXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgY29uc3QganNvbiA9IHlpZWxkIHJlcy5qc29uKCk7XG4gICAgICAgICAgICAgICAgaWYgKGpzb24uZXJyKSB7XG4gICAgICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihqc29uLm1zZyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHRoaXMucmVzID0ganNvbi5kYXRhO1xuICAgICAgICAgICAgICAgIGlmICh0eXBlb2YgY2FsbGJhY2sgPT09IFwiZnVuY3Rpb25cIikge1xuICAgICAgICAgICAgICAgICAgICBjYWxsYmFjayhmYWxzZSwganNvbi5kYXRhKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcmV0dXJuIGpzb24uZGF0YTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNhdGNoIChlcnIpIHtcbiAgICAgICAgICAgICAgICBpZiAodHlwZW9mIGNhbGxiYWNrID09PSBcImZ1bmN0aW9uXCIpIHtcbiAgICAgICAgICAgICAgICAgICAgY2FsbGJhY2soZXJyKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHRocm93IGVycjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH1cbiAgICBfcHV0KGRhdGEpIHtcbiAgICAgICAgcmV0dXJuIF9fYXdhaXRlcih0aGlzLCB2b2lkIDAsIHZvaWQgMCwgZnVuY3Rpb24qICgpIHtcbiAgICAgICAgICAgIHRoaXMucmVzID0gXCJcIjtcbiAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgY29uc3QgcmVzID0geWllbGQgZmV0Y2godGhpcy5kYXRhYmFzZSwge1xuICAgICAgICAgICAgICAgICAgICBib2R5OiBKU09OLnN0cmluZ2lmeShkYXRhKSxcbiAgICAgICAgICAgICAgICAgICAgY3JlZGVudGlhbHM6IFwiaW5jbHVkZVwiLFxuICAgICAgICAgICAgICAgICAgICBoZWFkZXJzOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBcIkNvbnRlbnQtVHlwZVwiOiBcImFwcGxpY2F0aW9uL2pzb25cIixcbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgbWV0aG9kOiBcIlBVVFwiLFxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIGNvbnN0IGpzb24gPSB5aWVsZCByZXMuanNvbigpO1xuICAgICAgICAgICAgICAgIGlmIChqc29uLmVycikge1xuICAgICAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoanNvbi5tc2cpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB0aGlzLnJlcyA9IGpzb24uZGF0YTtcbiAgICAgICAgICAgICAgICByZXR1cm4ganNvbi5kYXRhO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY2F0Y2ggKGVycikge1xuICAgICAgICAgICAgICAgIHRocm93IGVycjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfVxuICAgIF91cmxwYXJhbXMocGFyYW1zKSB7XG4gICAgICAgIGNvbnN0IHVybCA9IE9iamVjdC5rZXlzKHBhcmFtcykubWFwKChrKSA9PiB7XG4gICAgICAgICAgICByZXR1cm4gZW5jb2RlVVJJQ29tcG9uZW50KGspICsgXCI9XCIgKyBlbmNvZGVVUklDb21wb25lbnQocGFyYW1zW2tdKTtcbiAgICAgICAgfSkuam9pbihcIiZcIik7XG4gICAgICAgIHJldHVybiB1cmw7XG4gICAgfVxufVxuZXhwb3J0cy5Nb2RlbCA9IE1vZGVsO1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9aW5kZXguanMubWFwIiwiXCJ1c2Ugc3RyaWN0XCI7XG52YXIgX19hd2FpdGVyID0gKHRoaXMgJiYgdGhpcy5fX2F3YWl0ZXIpIHx8IGZ1bmN0aW9uICh0aGlzQXJnLCBfYXJndW1lbnRzLCBQLCBnZW5lcmF0b3IpIHtcbiAgICByZXR1cm4gbmV3IChQIHx8IChQID0gUHJvbWlzZSkpKGZ1bmN0aW9uIChyZXNvbHZlLCByZWplY3QpIHtcbiAgICAgICAgZnVuY3Rpb24gZnVsZmlsbGVkKHZhbHVlKSB7IHRyeSB7IHN0ZXAoZ2VuZXJhdG9yLm5leHQodmFsdWUpKTsgfSBjYXRjaCAoZSkgeyByZWplY3QoZSk7IH0gfVxuICAgICAgICBmdW5jdGlvbiByZWplY3RlZCh2YWx1ZSkgeyB0cnkgeyBzdGVwKGdlbmVyYXRvcltcInRocm93XCJdKHZhbHVlKSk7IH0gY2F0Y2ggKGUpIHsgcmVqZWN0KGUpOyB9IH1cbiAgICAgICAgZnVuY3Rpb24gc3RlcChyZXN1bHQpIHsgcmVzdWx0LmRvbmUgPyByZXNvbHZlKHJlc3VsdC52YWx1ZSkgOiBuZXcgUChmdW5jdGlvbiAocmVzb2x2ZSkgeyByZXNvbHZlKHJlc3VsdC52YWx1ZSk7IH0pLnRoZW4oZnVsZmlsbGVkLCByZWplY3RlZCk7IH1cbiAgICAgICAgc3RlcCgoZ2VuZXJhdG9yID0gZ2VuZXJhdG9yLmFwcGx5KHRoaXNBcmcsIF9hcmd1bWVudHMgfHwgW10pKS5uZXh0KCkpO1xuICAgIH0pO1xufTtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbi8qKlxuICogRGlzcGxheSBkYXRhIHVuZGVyIHRhYmxlXG4gKi9cbmNsYXNzIFRhYmxlRGF0YSB7XG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHRoaXMuX21hcCA9IHt9O1xuICAgICAgICB0aGlzLl9saXN0ID0gW107XG4gICAgICAgIHRoaXMuX2lzQ29ubmVjdCA9IGZhbHNlO1xuICAgICAgICB0aGlzLl9jb25uZWN0U3RhdHVzID0gXCJcIjtcbiAgICAgICAgdGhpcy5faXNGZXRjaGVkID0gZmFsc2U7XG4gICAgICAgIHRoaXMuX2RiVVJMID0gXCJcIjtcbiAgICB9XG4gICAgZ2V0RGF0YSgpIHtcbiAgICAgICAgcmV0dXJuIF9fYXdhaXRlcih0aGlzLCB2b2lkIDAsIHZvaWQgMCwgZnVuY3Rpb24qICgpIHtcbiAgICAgICAgICAgIGxldCByZXMgPSB5aWVsZCBmZXRjaCh0aGlzLl9kYlVSTCwgeyBtZXRob2Q6IFwiR0VUXCIsIGNyZWRlbnRpYWxzOiAnaW5jbHVkZScgfSk7XG4gICAgICAgICAgICBpZiAoIXJlcy5vaykge1xuICAgICAgICAgICAgICAgIHRoaXMuX2lzQ29ubmVjdCA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIHRoaXMuX2Nvbm5lY3RTdGF0dXMgPSByZXMuc3RhdHVzVGV4dDtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLl9pc0Nvbm5lY3QgPSB0cnVlO1xuICAgICAgICAgICAgdGhpcy5fY29ubmVjdFN0YXR1cyA9IFwiXCI7XG4gICAgICAgICAgICBsZXQganNvbiA9IHlpZWxkIHJlcy5qc29uKCk7XG4gICAgICAgICAgICBpZiAoISFqc29uLmVycikge1xuICAgICAgICAgICAgICAgIHRoaXMuX2lzRmV0Y2hlZCA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIHRoaXMuX2Nvbm5lY3RTdGF0dXMgPSBqc29uLm1zZztcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLl9pc0ZldGNoZWQgPSB0cnVlO1xuICAgICAgICAgICAgdGhpcy5fY29ubmVjdFN0YXR1cyA9IFwiT0tcIjtcbiAgICAgICAgICAgIHRoaXMuX2xpc3QgPSBqc29uLmRhdGE7XG4gICAgICAgIH0pO1xuICAgIH1cbiAgICBnZXQgdGFibGUoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9tYXA7XG4gICAgfVxuICAgIGdldCBsaXN0KCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fbGlzdDtcbiAgICB9XG59XG5leHBvcnRzLmRlZmF1bHQgPSBUYWJsZURhdGE7XG4vLyMgc291cmNlTWFwcGluZ1VSTD1pbmRleC5qcy5tYXAiLCJcInVzZSBzdHJpY3RcIjtcbnZhciBfX2F3YWl0ZXIgPSAodGhpcyAmJiB0aGlzLl9fYXdhaXRlcikgfHwgZnVuY3Rpb24gKHRoaXNBcmcsIF9hcmd1bWVudHMsIFAsIGdlbmVyYXRvcikge1xuICAgIHJldHVybiBuZXcgKFAgfHwgKFAgPSBQcm9taXNlKSkoZnVuY3Rpb24gKHJlc29sdmUsIHJlamVjdCkge1xuICAgICAgICBmdW5jdGlvbiBmdWxmaWxsZWQodmFsdWUpIHsgdHJ5IHsgc3RlcChnZW5lcmF0b3IubmV4dCh2YWx1ZSkpOyB9IGNhdGNoIChlKSB7IHJlamVjdChlKTsgfSB9XG4gICAgICAgIGZ1bmN0aW9uIHJlamVjdGVkKHZhbHVlKSB7IHRyeSB7IHN0ZXAoZ2VuZXJhdG9yW1widGhyb3dcIl0odmFsdWUpKTsgfSBjYXRjaCAoZSkgeyByZWplY3QoZSk7IH0gfVxuICAgICAgICBmdW5jdGlvbiBzdGVwKHJlc3VsdCkgeyByZXN1bHQuZG9uZSA/IHJlc29sdmUocmVzdWx0LnZhbHVlKSA6IG5ldyBQKGZ1bmN0aW9uIChyZXNvbHZlKSB7IHJlc29sdmUocmVzdWx0LnZhbHVlKTsgfSkudGhlbihmdWxmaWxsZWQsIHJlamVjdGVkKTsgfVxuICAgICAgICBzdGVwKChnZW5lcmF0b3IgPSBnZW5lcmF0b3IuYXBwbHkodGhpc0FyZywgX2FyZ3VtZW50cyB8fCBbXSkpLm5leHQoKSk7XG4gICAgfSk7XG59O1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuY29uc3QgVGFibGVEYXRhXzEgPSByZXF1aXJlKFwiLi4vVGFibGVEYXRhXCIpO1xuY2xhc3MgQmFuZ1RodW9jIGV4dGVuZHMgVGFibGVEYXRhXzEuZGVmYXVsdCB7XG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHN1cGVyKCk7XG4gICAgICAgIHRoaXMuX2RiVVJMID0gXCIvYXBpL3RodW9jL1wiO1xuICAgIH1cbiAgICB1cGRhdGUoKSB7XG4gICAgICAgIHJldHVybiBfX2F3YWl0ZXIodGhpcywgdm9pZCAwLCB2b2lkIDAsIGZ1bmN0aW9uKiAoKSB7XG4gICAgICAgICAgICB5aWVsZCB0aGlzLmdldERhdGEoKTtcbiAgICAgICAgICAgIGZvciAobGV0IHJvdyBvZiB0aGlzLl9saXN0KSB7XG4gICAgICAgICAgICAgICAgbGV0IGlkID0gcm93WydpZCddO1xuICAgICAgICAgICAgICAgIHRoaXMuX21hcFtpZF0gPSByb3c7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH1cbn1cbmV4cG9ydHMuQmFuZ1RodW9jID0gQmFuZ1RodW9jO1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9QmFuZ1RodW9jLmpzLm1hcCIsIlwidXNlIHN0cmljdFwiO1xudmFyIF9fYXdhaXRlciA9ICh0aGlzICYmIHRoaXMuX19hd2FpdGVyKSB8fCBmdW5jdGlvbiAodGhpc0FyZywgX2FyZ3VtZW50cywgUCwgZ2VuZXJhdG9yKSB7XG4gICAgcmV0dXJuIG5ldyAoUCB8fCAoUCA9IFByb21pc2UpKShmdW5jdGlvbiAocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgICAgIGZ1bmN0aW9uIGZ1bGZpbGxlZCh2YWx1ZSkgeyB0cnkgeyBzdGVwKGdlbmVyYXRvci5uZXh0KHZhbHVlKSk7IH0gY2F0Y2ggKGUpIHsgcmVqZWN0KGUpOyB9IH1cbiAgICAgICAgZnVuY3Rpb24gcmVqZWN0ZWQodmFsdWUpIHsgdHJ5IHsgc3RlcChnZW5lcmF0b3JbXCJ0aHJvd1wiXSh2YWx1ZSkpOyB9IGNhdGNoIChlKSB7IHJlamVjdChlKTsgfSB9XG4gICAgICAgIGZ1bmN0aW9uIHN0ZXAocmVzdWx0KSB7IHJlc3VsdC5kb25lID8gcmVzb2x2ZShyZXN1bHQudmFsdWUpIDogbmV3IFAoZnVuY3Rpb24gKHJlc29sdmUpIHsgcmVzb2x2ZShyZXN1bHQudmFsdWUpOyB9KS50aGVuKGZ1bGZpbGxlZCwgcmVqZWN0ZWQpOyB9XG4gICAgICAgIHN0ZXAoKGdlbmVyYXRvciA9IGdlbmVyYXRvci5hcHBseSh0aGlzQXJnLCBfYXJndW1lbnRzIHx8IFtdKSkubmV4dCgpKTtcbiAgICB9KTtcbn07XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5jb25zdCBNb2RlbENsYXNzXzEgPSByZXF1aXJlKFwiLi4vTW9kZWxDbGFzc1wiKTtcbmNvbnN0IEJhbmdUaHVvY18xID0gcmVxdWlyZShcIi4vQmFuZ1RodW9jXCIpO1xuZXhwb3J0cy5CYW5nVGh1b2MgPSBCYW5nVGh1b2NfMS5CYW5nVGh1b2M7XG5jbGFzcyBUaHVvYyBleHRlbmRzIE1vZGVsQ2xhc3NfMS5Nb2RlbCB7XG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHN1cGVyKCk7XG4gICAgICAgIHRoaXMuZGF0YWJhc2UgPSBcIi9hcGkvdGh1b2MvXCI7XG4gICAgfVxuICAgIGdldChwYXJhbXMsIG9mZnNldCwgbGltaXQpIHtcbiAgICAgICAgcmV0dXJuIF9fYXdhaXRlcih0aGlzLCB2b2lkIDAsIHZvaWQgMCwgZnVuY3Rpb24qICgpIHtcbiAgICAgICAgICAgIHJldHVybiB5aWVsZCB0aGlzLl9nZXQoeyBxOiBwYXJhbXMsIG9mZnNldCwgbGltaXQgfSk7XG4gICAgICAgIH0pO1xuICAgIH1cbiAgICBjcmVhdGUoZGF0YSkge1xuICAgICAgICByZXR1cm4gX19hd2FpdGVyKHRoaXMsIHZvaWQgMCwgdm9pZCAwLCBmdW5jdGlvbiogKCkge1xuICAgICAgICAgICAgdGhpcy5yZXMgPSB5aWVsZCB0aGlzLl9wb3N0KGRhdGEpO1xuICAgICAgICAgICAgcmV0dXJuICh0aGlzLnJlcyk7XG4gICAgICAgIH0pO1xuICAgIH1cbiAgICBhZGQobWEsIHNvTHVvbmcsIHRvbmdHaWEpIHtcbiAgICAgICAgcmV0dXJuIF9fYXdhaXRlcih0aGlzLCB2b2lkIDAsIHZvaWQgMCwgZnVuY3Rpb24qICgpIHtcbiAgICAgICAgICAgIHRoaXMucmVzID0geWllbGQgdGhpcy5fcG9zdCh7XG4gICAgICAgICAgICAgICAgbWEsXG4gICAgICAgICAgICAgICAgc29fbHVvbmc6IHNvTHVvbmcsXG4gICAgICAgICAgICAgICAgdG9uZ19naWE6IHRvbmdHaWEsXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnJlcztcbiAgICAgICAgfSk7XG4gICAgfVxuICAgIHVwZGF0ZShtYSwgZWRpdEluZm8pIHtcbiAgICAgICAgcmV0dXJuIF9fYXdhaXRlcih0aGlzLCB2b2lkIDAsIHZvaWQgMCwgZnVuY3Rpb24qICgpIHtcbiAgICAgICAgICAgIHRoaXMucmVzID0geWllbGQgdGhpcy5fcHV0KHtcbiAgICAgICAgICAgICAgICBtYSwgZWRpdEluZm8sXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnJlcztcbiAgICAgICAgfSk7XG4gICAgfVxufVxuZXhwb3J0cy5UaHVvYyA9IFRodW9jO1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9aW5kZXguanMubWFwIiwiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5jb25zdCBUaHVvY18xID0gcmVxdWlyZShcIi4uL01vZGVsL1RodW9jXCIpO1xuY29uc3QgVmlld1RhYmxlXzEgPSByZXF1aXJlKFwiLi9WaWV3VGFibGVcIik7XG5jb25zdCBNZW51Q29udGV4dF8xID0gcmVxdWlyZShcIi4uL01lbnVDb250ZXh0XCIpO1xuY2xhc3MgVGh1b2NUYWJsZSBleHRlbmRzIFZpZXdUYWJsZV8xLlZpZXdUYWJsZSB7XG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHN1cGVyKCk7XG4gICAgICAgIHRoaXMuZWxlbWVudCA9ICQoXCI8dGFibGUvPlwiKS5hZGRDbGFzcyhcInRhYmxlIHRhYmxlLXN0cmlwZWQgdGFibGUtdmlld1wiKTtcbiAgICAgICAgdGhpcy5lbGVtZW50Lmh0bWwoYFxuICAgICAgICA8dGhlYWQ+XG4gICAgICAgICAgICA8dHI+XG4gICAgICAgICAgICAgICAgPHRoPk1hIFRodW9jPC90aD5cbiAgICAgICAgICAgICAgICA8dGg+VGVuIFRodW9jPC90aD5cbiAgICAgICAgICAgIDwvdHI+XG4gICAgICAgIDwvdGhlYWQ+XG4gICAgICAgIDx0Ym9keT48L3Rib2R5PlxuICAgICAgICBgKTtcbiAgICAgICAgdGhpcy5tb2RlbCA9IG5ldyBUaHVvY18xLlRodW9jKCk7XG4gICAgfVxuICAgIG9uQ29udGV4dEFkZChmdW5jKSB7XG4gICAgICAgIHRoaXMuZnVuY0N0eEFkZCA9IGZ1bmM7XG4gICAgfVxuICAgIG9uQ29udGV4dEVkaXQoZnVuYykge1xuICAgICAgICB0aGlzLmZ1bmNDdHhFZGl0ID0gZnVuYztcbiAgICB9XG4gICAgb25Db250ZXh0RWRpdFByaWNlKGZ1bmMpIHtcbiAgICAgICAgdGhpcy5mdW5jQ3R4RWRpdFByaWNlID0gZnVuYztcbiAgICB9XG4gICAgY3VzdG9tQ3JlYXRlUm93KHJvdykge1xuICAgICAgICBjb25zdCBjb250ZXh0bWVudSA9IG5ldyBNZW51Q29udGV4dF8xLk1lbnVDb250ZXh0KHJvdyk7XG4gICAgICAgIGNvbnRleHRtZW51LmFkZENvbnRleHQoe1xuICAgICAgICAgICAgdGl0bGU6IFwibmjhuq1wIHRow6ptIHRodeG7kWNcIixcbiAgICAgICAgICAgIGNsYXNzTmFtZTogXCJ0ZXh0LXN1Y2Nlc3NcIixcbiAgICAgICAgICAgIGljb246IFwiZmFzIGZhLXBsdXMtY2lyY2xlXCIsXG4gICAgICAgICAgICBjbGljazogKGUpID0+IHtcbiAgICAgICAgICAgICAgICB0aGlzLmZ1bmNDdHhBZGQoKTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgIH0pLmFkZENvbnRleHQoe1xuICAgICAgICAgICAgdGl0bGU6IFwic+G7rWEgdGjDtG5nIHRpblwiLFxuICAgICAgICAgICAgY2xhc3NOYW1lOiBcInRleHQtcHJpbWFyeVwiLFxuICAgICAgICAgICAgaWNvbjogXCJmYXMgZmEtcGVuLXNxdWFyZVwiLFxuICAgICAgICAgICAgY2xpY2s6IChlKSA9PiB7XG4gICAgICAgICAgICAgICAgdGhpcy5mdW5jQ3R4RWRpdCgpO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgfSkuYWRkQ29udGV4dCh7XG4gICAgICAgICAgICB0aXRsZTogXCJjaOG7iW5oIGdpw6FcIixcbiAgICAgICAgICAgIGljb246IFwiZmEgZmEtZG9sbGFyLXNpZ25cIixcbiAgICAgICAgICAgIGNsaWNrOiAoZSkgPT4ge1xuICAgICAgICAgICAgICAgIHRoaXMuZnVuY0N0eEVkaXRQcmljZSgpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9XG59XG5leHBvcnRzLlRodW9jVGFibGUgPSBUaHVvY1RhYmxlO1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9VGh1b2NUYWJsZS5qcy5tYXAiLCJcInVzZSBzdHJpY3RcIjtcbnZhciBfX2F3YWl0ZXIgPSAodGhpcyAmJiB0aGlzLl9fYXdhaXRlcikgfHwgZnVuY3Rpb24gKHRoaXNBcmcsIF9hcmd1bWVudHMsIFAsIGdlbmVyYXRvcikge1xuICAgIHJldHVybiBuZXcgKFAgfHwgKFAgPSBQcm9taXNlKSkoZnVuY3Rpb24gKHJlc29sdmUsIHJlamVjdCkge1xuICAgICAgICBmdW5jdGlvbiBmdWxmaWxsZWQodmFsdWUpIHsgdHJ5IHsgc3RlcChnZW5lcmF0b3IubmV4dCh2YWx1ZSkpOyB9IGNhdGNoIChlKSB7IHJlamVjdChlKTsgfSB9XG4gICAgICAgIGZ1bmN0aW9uIHJlamVjdGVkKHZhbHVlKSB7IHRyeSB7IHN0ZXAoZ2VuZXJhdG9yW1widGhyb3dcIl0odmFsdWUpKTsgfSBjYXRjaCAoZSkgeyByZWplY3QoZSk7IH0gfVxuICAgICAgICBmdW5jdGlvbiBzdGVwKHJlc3VsdCkgeyByZXN1bHQuZG9uZSA/IHJlc29sdmUocmVzdWx0LnZhbHVlKSA6IG5ldyBQKGZ1bmN0aW9uIChyZXNvbHZlKSB7IHJlc29sdmUocmVzdWx0LnZhbHVlKTsgfSkudGhlbihmdWxmaWxsZWQsIHJlamVjdGVkKTsgfVxuICAgICAgICBzdGVwKChnZW5lcmF0b3IgPSBnZW5lcmF0b3IuYXBwbHkodGhpc0FyZywgX2FyZ3VtZW50cyB8fCBbXSkpLm5leHQoKSk7XG4gICAgfSk7XG59O1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuY2xhc3MgVmlld1RhYmxlIHtcbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgLy8gY29uc3RydWN0XG4gICAgICAgIHRoaXMub2Zmc2V0ID0gMDtcbiAgICAgICAgdGhpcy5saW1pdCA9IDEwO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBnZXQgZGF0YSB3aXRoIHNlYXJjaCB2YWx1ZVxuICAgICAqIEBwYXJhbSBzZWFyY2ggZmllbGQ9dmFsdWVcbiAgICAgKi9cbiAgICB1cGRhdGUoc2VhcmNoKSB7XG4gICAgICAgIHJldHVybiBfX2F3YWl0ZXIodGhpcywgdm9pZCAwLCB2b2lkIDAsIGZ1bmN0aW9uKiAoKSB7XG4gICAgICAgICAgICAvLyByZW5kZXIgZGF0YSB0byBlbGVtZW50XG4gICAgICAgICAgICBjb25zdCByYXdEYXRhID0geWllbGQgdGhpcy5tb2RlbC5nZXQoc2VhcmNoLCB0aGlzLm9mZnNldCwgdGhpcy5saW1pdCk7XG4gICAgICAgICAgICB0aGlzLmRhdGEgPSBBcnJheS5mcm9tKHJhd0RhdGEpLm1hcCgodmFsKSA9PiB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuZmlsdGVyRGF0YVJvdyh2YWwpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB0aGlzLnNpemVPZlJlY29yZCA9IHRoaXMuZGF0YS5sZW5ndGg7XG4gICAgICAgICAgICB0aGlzLmN1cnJlbnRQb3MgPSAtMTtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmRhdGE7XG4gICAgICAgIH0pO1xuICAgIH1cbiAgICByZW5kZXIoc2VhcmNoKSB7XG4gICAgICAgIHJldHVybiBfX2F3YWl0ZXIodGhpcywgdm9pZCAwLCB2b2lkIDAsIGZ1bmN0aW9uKiAoKSB7XG4gICAgICAgICAgICBjb25zdCBkYXRhID0geWllbGQgdGhpcy51cGRhdGUoc2VhcmNoKTtcbiAgICAgICAgICAgIGNvbnN0IHRib2R5ID0gdGhpcy5fY3JlYXRlVGFibGVCb2R5KGRhdGEpO1xuICAgICAgICAgICAgdGhpcy5lbGVtZW50LmZpbmQoXCJ0Ym9keVwiKS5odG1sKFwiXCIpLmFwcGVuZCh0Ym9keS5jaGlsZHJlbigpKTtcbiAgICAgICAgfSk7XG4gICAgfVxuICAgIHNldEVsZW1lbnQoZWwpIHtcbiAgICAgICAgdGhpcy5lbGVtZW50ID0gZWw7XG4gICAgfVxuICAgIGdldEVsZW1lbnQoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmVsZW1lbnQ7XG4gICAgfVxuICAgIGN1cnJlbnREYXRhKCkge1xuICAgICAgICBpZiAoIXRoaXMuY3VycmVudFJvd0RhdGEpIHtcbiAgICAgICAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIE9iamVjdC5hc3NpZ24oe30sIHRoaXMuY3VycmVudFJvd0RhdGEpO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBhdHRhY2ggZXZlbnQgb2YgY2hvb3NlXG4gICAgICogQHBhcmFtIGNhbGxiYWNrIGNhbGxiYWNrIGZ1bmN0aW9uIHdoZW4gdGhlIHJvdyBvZiByZWNvcmQgaXMgY2hvb3NlZFxuICAgICAqL1xuICAgIG9uQ2hvb3NlKGNhbGxiYWNrKSB7XG4gICAgICAgIHRoaXMuZnVuY09uQ2hvb3NlID0gY2FsbGJhY2s7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIGF0dGFjaCBldmVudCBvZiBob3ZlclxuICAgICAqIEBwYXJhbSBjYWxsYmFjayBjYWxsYmFjayBmdW5jdGlvbiB3aGVuIHRoZSByb3cgb2YgcmVjb3JkIGlzIGhvdmVyIG9uXG4gICAgICovXG4gICAgb25Gb2N1cyhjYWxsYmFjaykge1xuICAgICAgICB0aGlzLmZ1bmNPbkZvY3VzID0gY2FsbGJhY2s7XG4gICAgfVxuICAgIHNlbGVjdERvd24oKSB7XG4gICAgICAgIGlmICh0aGlzLmN1cnJlbnRQb3MgPCB0aGlzLnNpemVPZlJlY29yZCAtIDEpIHtcbiAgICAgICAgICAgICsrdGhpcy5jdXJyZW50UG9zO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuZWxlbWVudC5maW5kKGB0cltkYXRhLXBvcz0ke3RoaXMuY3VycmVudFBvc31dYCkuZm9jdXMoKTtcbiAgICB9XG4gICAgc2VsZWN0VXAoKSB7XG4gICAgICAgIGlmICh0aGlzLmN1cnJlbnRQb3MgPiAwKSB7XG4gICAgICAgICAgICAtLXRoaXMuY3VycmVudFBvcztcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmVsZW1lbnQuZmluZChgdHJbZGF0YS1wb3M9JHt0aGlzLmN1cnJlbnRQb3N9XWApLmZvY3VzKCk7XG4gICAgfVxuICAgIG5leHRQYWdlKHNlYXJjaCA9IFwiXCIpIHtcbiAgICAgICAgdGhpcy5vZmZzZXQgKz0gdGhpcy5saW1pdDtcbiAgICAgICAgdGhpcy5yZW5kZXIoc2VhcmNoKTtcbiAgICB9XG4gICAgc2V0TGltaXRQZXJQYWdlKGxpbWl0KSB7XG4gICAgICAgIHRoaXMubGltaXQgPSBsaW1pdDtcbiAgICB9XG4gICAgc2V0T2Zmc2V0KG9mZnNldCkge1xuICAgICAgICB0aGlzLm9mZnNldCA9IG9mZnNldDtcbiAgICB9XG4gICAgZmlsdGVyRGF0YVJvdyhkYXRhUm93KSB7XG4gICAgICAgIC8vIG5vdGhpbmcgaGVyZSwganVzdCByYXdcbiAgICAgICAgcmV0dXJuIGRhdGFSb3c7XG4gICAgfVxuICAgIF9jcmVhdGVSb3coZGF0YVJvdywgcG9zKSB7XG4gICAgICAgIGNvbnN0IHJvdyA9ICQoXCI8dHIvPlwiKS5hdHRyKFwidGFiaW5kZXhcIiwgLTEpLmF0dHIoXCJkYXRhLXBvc1wiLCBwb3MpO1xuICAgICAgICBmb3IgKGNvbnN0IGZpZWxkIG9mIE9iamVjdC5rZXlzKGRhdGFSb3cpKSB7XG4gICAgICAgICAgICBjb25zdCBjZWxsID0gJChcIjx0ZC8+XCIpLmF0dHIoXCJuYW1lXCIsIGZpZWxkKS50ZXh0KGRhdGFSb3dbZmllbGRdKTtcbiAgICAgICAgICAgIHJvdy5hcHBlbmQoY2VsbCk7XG4gICAgICAgIH1cbiAgICAgICAgLy8gY2hvb3NlIGV2ZW50XG4gICAgICAgIHRoaXMuX3Jvd09uQ2hvb3NlKHJvdywgKCkgPT4ge1xuICAgICAgICAgICAgdGhpcy5mdW5jT25DaG9vc2UoZGF0YVJvdyk7XG4gICAgICAgIH0pO1xuICAgICAgICAvLyBob3ZlciBldmVudFxuICAgICAgICByb3cub24oXCJjbGljayBmb2N1c1wiLCAoZSkgPT4ge1xuICAgICAgICAgICAgdGhpcy5lbGVtZW50LmZpbmQoXCJ0clwiKS5yZW1vdmVDbGFzcyhcImFjdGl2ZVwiKTtcbiAgICAgICAgICAgIHJvdy5hZGRDbGFzcyhcImFjdGl2ZVwiKTtcbiAgICAgICAgICAgIHRoaXMuY3VycmVudFBvcyA9IHBvcztcbiAgICAgICAgICAgIHRoaXMuY3VycmVudFJvd0RhdGEgPSBkYXRhUm93O1xuICAgICAgICAgICAgdGhpcy5mdW5jT25Gb2N1cyhkYXRhUm93KTtcbiAgICAgICAgfSk7XG4gICAgICAgIHRoaXMuY3VzdG9tQ3JlYXRlUm93KHJvdyk7XG4gICAgICAgIHJldHVybiByb3c7XG4gICAgfVxuICAgIF9jcmVhdGVUYWJsZUJvZHkoZGF0YSkge1xuICAgICAgICBjb25zdCB0Ym9keSA9ICQoXCI8dGJvZHkvPlwiKTtcbiAgICAgICAgbGV0IHBvcyA9IDA7XG4gICAgICAgIGZvciAoY29uc3Qgcm93RGF0YSBvZiBkYXRhKSB7XG4gICAgICAgICAgICBjb25zdCB0cm93ID0gdGhpcy5fY3JlYXRlUm93KHJvd0RhdGEsIHBvcysrKTtcbiAgICAgICAgICAgIHRib2R5LmFwcGVuZCh0cm93KTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGJvZHk7XG4gICAgfVxuICAgIGN1c3RvbUNyZWF0ZVJvdyhyb3cpIHtcbiAgICAgICAgLy8gbm90aGluZyBoZXJlLCB3aWxsIGNoYW5nZSBpbiBpbmhlcml0YW5jZVxuICAgIH1cbiAgICBfcm93T25DaG9vc2Uocm93LCBjYWxsYmFjaykge1xuICAgICAgICByb3cub24oXCJrZXlkb3duXCIsIChlKSA9PiB7XG4gICAgICAgICAgICBpZiAoZS5rZXlDb2RlID09PSAxMykge1xuICAgICAgICAgICAgICAgIGNhbGxiYWNrKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgICByb3cub24oXCJkYmxjbGlja1wiLCAoKSA9PiB7XG4gICAgICAgICAgICBjYWxsYmFjaygpO1xuICAgICAgICB9KTtcbiAgICB9XG59XG5leHBvcnRzLlZpZXdUYWJsZSA9IFZpZXdUYWJsZTtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPVZpZXdUYWJsZS5qcy5tYXAiLCJcInVzZSBzdHJpY3RcIjtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmZ1bmN0aW9uIGdldEZvcm1WYWx1ZShmb3JtKSB7XG4gICAgY29uc3QgYXJyID0gZm9ybS5zZXJpYWxpemVBcnJheSgpO1xuICAgIGNvbnN0IHZhbCA9IHt9O1xuICAgIGZvciAoY29uc3QgaW5wdXQgb2YgYXJyKSB7XG4gICAgICAgIHZhbFtpbnB1dC5uYW1lXSA9IGlucHV0LnZhbHVlO1xuICAgIH1cbiAgICByZXR1cm4gdmFsO1xufVxuZXhwb3J0cy5nZXRGb3JtVmFsdWUgPSBnZXRGb3JtVmFsdWU7XG4vLyMgc291cmNlTWFwcGluZ1VSTD1mb3JtVmFsLmpzLm1hcCIsIlwidXNlIHN0cmljdFwiO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuY29uc3QgQXV0b0NvbXBsZXRlXzEgPSByZXF1aXJlKFwiLi4vQXV0b0NvbXBsZXRlXCIpO1xuZnVuY3Rpb24gaW5pdChhcHApIHtcbiAgICBjb25zdCBhdXRvY29tcGxldGUgPSBuZXcgQXV0b0NvbXBsZXRlXzEuQXV0b0NvbXBsZXRlKFwibmhhcF9ob2FfZG9uLS10ZW5fdGh1b2NcIiwgYXBwLnRodW9jKTtcbiAgICBhdXRvY29tcGxldGUuc2V0TG9va3VwKFtcIm1hXCIsIFwidGVuXCIsIFwibmNjXCIsIFwiZG9uX3ZpXCIsIFwiZG9uX2dpYVwiXSk7XG4gICAgYXV0b2NvbXBsZXRlLmxpc3RlbigpO1xuICAgIGF1dG9jb21wbGV0ZS5vbkNob29zZSgoZGF0YSkgPT4ge1xuICAgICAgICAkKFwiI25oYXBfaG9hX2Rvbi0tbWFfdGh1b2NcIikudmFsKGRhdGEubWEpO1xuICAgICAgICAkKFwiI25oYXBfaG9hX2Rvbi0tdGVuX3RodW9jXCIpLnZhbChkYXRhLnRlbik7XG4gICAgICAgICQoXCIjbmhhcF9ob2FfZG9uLS1uY2NcIikudmFsKGRhdGEubmNjKTtcbiAgICAgICAgJChcIiNuaGFwX2hvYV9kb24tLWdpYVwiKS52YWwoZGF0YS5kb25fZ2lhKTtcbiAgICAgICAgJChcIiNuaGFwX2hvYV9kb24tLWRvbl92aVwiKS52YWwoZGF0YS5kb25fdmkpO1xuICAgIH0pO1xufVxuZXhwb3J0cy5pbml0ID0gaW5pdDtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWluZGV4LmpzLm1hcCIsIlwidXNlIHN0cmljdFwiO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuY29uc3QgVGh1b2NUYWJsZV8xID0gcmVxdWlyZShcIi4uL1ZpZXcvVGh1b2NUYWJsZVwiKTtcbmNvbnN0IHRodW9jX21vZGFsXzEgPSByZXF1aXJlKFwiLi90aHVvYy1tb2RhbFwiKTtcbmNvbnN0IFBBR0VfSUQgPSBcInBhZ2UtbmhhcC10aHVvY1wiO1xuY2xhc3MgSW5pdCB7XG4gICAgY29uc3RydWN0b3IoYXBwKSB7XG4gICAgICAgIGNvbnN0IHRodW9jVGFibGUgPSBuZXcgVGh1b2NUYWJsZV8xLlRodW9jVGFibGUoKTtcbiAgICAgICAgdGhpcy50aHVvY1RhYmxlID0gdGh1b2NUYWJsZTtcbiAgICAgICAgdGhpcy5hcHAgPSBhcHA7XG4gICAgICAgIHRodW9jVGFibGUuc2V0RWxlbWVudCgkKFwiI25oYXBfdGh1b2MtLXRhYmxlXCIpKTtcbiAgICAgICAgdGh1b2NUYWJsZS5zZXRMaW1pdFBlclBhZ2UoMTAwKTtcbiAgICAgICAgdGh1b2NUYWJsZS5vbkNob29zZSgoZGF0YSkgPT4ge1xuICAgICAgICAgICAgdGhpcy5hZGRUaHVvYyhkYXRhKTtcbiAgICAgICAgfSk7XG4gICAgICAgIHRodW9jVGFibGUub25Gb2N1cygoZGF0YSkgPT4ge1xuICAgICAgICAgICAgJChcIi50aHVvYy0tYnV0dG9uXCIpLnJlbW92ZUF0dHIoXCJkaXNhYmxlZFwiKTtcbiAgICAgICAgfSk7XG4gICAgICAgIHRodW9jVGFibGUub25Db250ZXh0QWRkKCgpID0+IHtcbiAgICAgICAgICAgIHRoaXMuYWRkVGh1b2ModGh1b2NUYWJsZS5jdXJyZW50RGF0YSgpKTtcbiAgICAgICAgfSk7XG4gICAgICAgIHRodW9jVGFibGUub25Db250ZXh0RWRpdCgoKSA9PiB7XG4gICAgICAgICAgICB0aGlzLmVkaXRUaHVvYyh0aHVvY1RhYmxlLmN1cnJlbnREYXRhKCkpO1xuICAgICAgICB9KTtcbiAgICAgICAgdGh1b2NUYWJsZS5vbkNvbnRleHRFZGl0UHJpY2UoKCkgPT4ge1xuICAgICAgICAgICAgdGhpcy5lZGl0UHJpY2VUaHVvYyh0aHVvY1RhYmxlLmN1cnJlbnREYXRhKCkpO1xuICAgICAgICB9KTtcbiAgICAgICAgdGh1b2NUYWJsZS5yZW5kZXIoXCJcIik7XG4gICAgICAgIHRoaXMuaGFuZGxlQ29udHJvbEtleShhcHApO1xuICAgICAgICB0aGlzLmhhbmRsZVNlbGVjdEtleShhcHApO1xuICAgICAgICB0aGlzLmhhbmRsZU1vZGFsRXZlbnQoKTtcbiAgICAgICAgdGhpcy5oYW5kbGVTZWFyY2hJbnB1dCgpO1xuICAgICAgICBjb25zdCAkdGhpcyA9IHRoaXM7XG4gICAgICAgICQoXCIudGh1b2MtLWJ1dHRvblwiKS5vbihcImNsaWNrXCIsIGZ1bmN0aW9uIEJ1dHRvbkNsaWNrKCkge1xuICAgICAgICAgICAgY29uc3Qgcm9sZSA9ICQodGhpcykuYXR0cihcImFwcC1yb2xlXCIpO1xuICAgICAgICAgICAgc3dpdGNoIChyb2xlKSB7XG4gICAgICAgICAgICAgICAgY2FzZSBcIm5ld1wiOlxuICAgICAgICAgICAgICAgICAgICAkdGhpcy5uZXdUaHVvYygpO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBjYXNlIFwiZWRpdFwiOlxuICAgICAgICAgICAgICAgICAgICAkdGhpcy5lZGl0VGh1b2ModGh1b2NUYWJsZS5jdXJyZW50RGF0YSgpKTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgY2FzZSBcImFkZFwiOlxuICAgICAgICAgICAgICAgICAgICAkdGhpcy5hZGRUaHVvYyh0aHVvY1RhYmxlLmN1cnJlbnREYXRhKCkpO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBjYXNlIFwiY2hpbmgtZ2lhXCI6XG4gICAgICAgICAgICAgICAgICAgICR0aGlzLmVkaXRQcmljZVRodW9jKHRodW9jVGFibGUuY3VycmVudERhdGEoKSk7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9XG4gICAgaGFuZGxlU2VsZWN0S2V5KGFwcCkge1xuICAgICAgICBhcHAub25TaG9ydGN1dEtleShcIkFycm93VXBcIiwgUEFHRV9JRCwgKGUpID0+IHtcbiAgICAgICAgICAgIHRoaXMudGh1b2NUYWJsZS5zZWxlY3RVcCgpO1xuICAgICAgICB9KTtcbiAgICAgICAgYXBwLm9uU2hvcnRjdXRLZXkoXCJBcnJvd0Rvd25cIiwgUEFHRV9JRCwgKGUpID0+IHtcbiAgICAgICAgICAgIHRoaXMudGh1b2NUYWJsZS5zZWxlY3REb3duKCk7XG4gICAgICAgIH0pO1xuICAgIH1cbiAgICBoYW5kbGVDb250cm9sS2V5KGFwcCkge1xuICAgICAgICBhcHAub25TaG9ydGN1dEtleShcImN0cmwrZFwiLCBQQUdFX0lELCAoZSkgPT4ge1xuICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgdGhpcy5uZXdUaHVvYygpO1xuICAgICAgICB9KTtcbiAgICAgICAgYXBwLm9uU2hvcnRjdXRLZXkoXCJjdHJsK2VcIiwgUEFHRV9JRCwgKGUpID0+IHtcbiAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgIHRoaXMuZWRpdFRodW9jKHRoaXMudGh1b2NUYWJsZS5jdXJyZW50RGF0YSgpKTtcbiAgICAgICAgfSk7XG4gICAgICAgIGFwcC5vblNob3J0Y3V0S2V5KFwiY3RybCtnXCIsIFBBR0VfSUQsIChlKSA9PiB7XG4gICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICB0aGlzLmVkaXRQcmljZVRodW9jKHRoaXMudGh1b2NUYWJsZS5jdXJyZW50RGF0YSgpKTtcbiAgICAgICAgfSk7XG4gICAgICAgIGFwcC5vblNob3J0Y3V0S2V5KFwiY3RybCtmXCIsIFBBR0VfSUQsIChlKSA9PiB7XG4gICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICAkKFwiI3RodW9jLS1zZWFyY2hcIikuZm9jdXMoKTtcbiAgICAgICAgfSk7XG4gICAgfVxuICAgIGhhbmRsZVNlYXJjaElucHV0KCkge1xuICAgICAgICBjb25zdCAkdGhpcyA9IHRoaXM7XG4gICAgICAgICQoXCIjdGh1b2MtLXNlYXJjaFwiKS5vbihcImtleXVwXCIsIGZ1bmN0aW9uIFNlYXJjaGluZygpIHtcbiAgICAgICAgICAgIGNvbnN0IHZhbCA9ICQodGhpcykudmFsKCk7XG4gICAgICAgICAgICAkdGhpcy50aHVvY1RhYmxlLnJlbmRlcih2YWwpO1xuICAgICAgICB9KTtcbiAgICB9XG4gICAgaGFuZGxlTW9kYWxFdmVudCgpIHtcbiAgICAgICAgdGhpcy5hZGRNb2RhbCA9IG5ldyB0aHVvY19tb2RhbF8xLkFkZFRodW9jTW9kYWwoXCJ0aHVvYy0tYWRkLW1vZGFsXCIsIHRoaXMuYXBwKTtcbiAgICAgICAgdGhpcy5uZXdNb2RhbCA9IG5ldyB0aHVvY19tb2RhbF8xLk5ld1RodW9jTW9kYWwoXCJ0aHVvYy0tbmV3LW1vZGFsXCIsIHRoaXMuYXBwKTtcbiAgICAgICAgdGhpcy5lZGl0TW9kYWwgPSBuZXcgdGh1b2NfbW9kYWxfMS5FZGl0VGh1b2NNb2RhbChcInRodW9jLS1lZGl0LW1vZGFsXCIsIHRoaXMuYXBwKTtcbiAgICAgICAgdGhpcy5lZGl0UHJpY2VNb2RhbCA9IG5ldyB0aHVvY19tb2RhbF8xLkVkaXRQcmljZVRodW9jTW9kYWwoXCJ0aHVvYy0tZWRpdC1wcmljZS1tb2RhbFwiLCB0aGlzLmFwcC50aHVvYyk7XG4gICAgfVxuICAgIGVkaXRUaHVvYyhkYXRhKSB7XG4gICAgICAgIGlmICghZGF0YSkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuZWRpdE1vZGFsLnNob3coZGF0YSk7XG4gICAgfVxuICAgIG5ld1RodW9jKCkge1xuICAgICAgICAkKFwiI3RodW9jLS1uZXctbW9kYWxcIikubW9kYWwoXCJzaG93XCIpO1xuICAgIH1cbiAgICBhZGRUaHVvYyhkYXRhKSB7XG4gICAgICAgIGlmICghZGF0YSkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgICQoXCIjdGh1b2MtLWFkZC1tb2RhbFwiKS5tb2RhbChcInNob3dcIik7XG4gICAgICAgICQoXCIjdGh1b2MtLWFkZC1tYXRodW9jXCIpLnZhbChkYXRhLm1hKTtcbiAgICAgICAgJChcIiN0aHVvYy0tYWRkLXRlbnRodW9jXCIpLnZhbChkYXRhLnRlbik7XG4gICAgICAgICQoXCIjdGh1b2MtLWFkZC1uY2NcIikudmFsKGRhdGEudGVuX25jYyk7XG4gICAgICAgICQoXCIjdGh1b2MtLWFkZC1zb2x1b25nXCIpLnZhbChkYXRhLnNvX2x1b25nKTtcbiAgICB9XG4gICAgZWRpdFByaWNlVGh1b2MoZGF0YSkge1xuICAgICAgICBpZiAoIWRhdGEpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICAkKFwiI3RodW9jLS1lZGl0LXByaWNlLW1vZGFsXCIpLm1vZGFsKFwic2hvd1wiKTtcbiAgICAgICAgJChcIiN0aHVvYy0tZWRpdC1wcmljZS1tYXRodW9jXCIpLnZhbChkYXRhLm1hKTtcbiAgICAgICAgJChcIiN0aHVvYy0tZWRpdC1wcmljZS10ZW50aHVvY1wiKS52YWwoZGF0YS50ZW4pO1xuICAgIH1cbn1cbmZ1bmN0aW9uIGluaXQoYXBwKSB7XG4gICAgcmV0dXJuIG5ldyBJbml0KGFwcCk7XG59XG5leHBvcnRzLmluaXQgPSBpbml0O1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9aW5kZXguanMubWFwIiwiXCJ1c2Ugc3RyaWN0XCI7XG52YXIgX19hd2FpdGVyID0gKHRoaXMgJiYgdGhpcy5fX2F3YWl0ZXIpIHx8IGZ1bmN0aW9uICh0aGlzQXJnLCBfYXJndW1lbnRzLCBQLCBnZW5lcmF0b3IpIHtcbiAgICByZXR1cm4gbmV3IChQIHx8IChQID0gUHJvbWlzZSkpKGZ1bmN0aW9uIChyZXNvbHZlLCByZWplY3QpIHtcbiAgICAgICAgZnVuY3Rpb24gZnVsZmlsbGVkKHZhbHVlKSB7IHRyeSB7IHN0ZXAoZ2VuZXJhdG9yLm5leHQodmFsdWUpKTsgfSBjYXRjaCAoZSkgeyByZWplY3QoZSk7IH0gfVxuICAgICAgICBmdW5jdGlvbiByZWplY3RlZCh2YWx1ZSkgeyB0cnkgeyBzdGVwKGdlbmVyYXRvcltcInRocm93XCJdKHZhbHVlKSk7IH0gY2F0Y2ggKGUpIHsgcmVqZWN0KGUpOyB9IH1cbiAgICAgICAgZnVuY3Rpb24gc3RlcChyZXN1bHQpIHsgcmVzdWx0LmRvbmUgPyByZXNvbHZlKHJlc3VsdC52YWx1ZSkgOiBuZXcgUChmdW5jdGlvbiAocmVzb2x2ZSkgeyByZXNvbHZlKHJlc3VsdC52YWx1ZSk7IH0pLnRoZW4oZnVsZmlsbGVkLCByZWplY3RlZCk7IH1cbiAgICAgICAgc3RlcCgoZ2VuZXJhdG9yID0gZ2VuZXJhdG9yLmFwcGx5KHRoaXNBcmcsIF9hcmd1bWVudHMgfHwgW10pKS5uZXh0KCkpO1xuICAgIH0pO1xufTtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmNsYXNzIEFkZFRodW9jTW9kYWwge1xuICAgIGNvbnN0cnVjdG9yKGlkLCBhcHApIHtcbiAgICAgICAgdGhpcy5hcHAgPSBhcHA7XG4gICAgICAgIHRoaXMucG9wdXAgPSAkKFwiI1wiICsgaWQpO1xuICAgICAgICB0aGlzLnBvcHVwLmxvYWQoXCIvbGF5b3V0cy9tb2RhbC1hZGQtdGh1b2MuaHRtbFwiLCAoKSA9PiB7XG4gICAgICAgICAgICB0aGlzLnBvcHVwLmZpbmQoXCJmb3JtXCIpLm9uKFwic3VibWl0XCIsIChlKSA9PiB7XG4gICAgICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgICAgIHRoaXMuZm9ybVN1Ym1pdEhhbmRsZShlKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICB9XG4gICAgZm9ybVN1Ym1pdEhhbmRsZShlKSB7XG4gICAgICAgIHJldHVybiBfX2F3YWl0ZXIodGhpcywgdm9pZCAwLCB2b2lkIDAsIGZ1bmN0aW9uKiAoKSB7XG4gICAgICAgICAgICBjb25zdCBmb3JtID0gJChlLnRhcmdldCk7XG4gICAgICAgICAgICBjb25zdCBkYXRhID0ge1xuICAgICAgICAgICAgICAgIG1hOiBmb3JtLmZpbmQoXCJbbmFtZT1tYV1cIikudmFsKCksXG4gICAgICAgICAgICAgICAgc29fbHVvbmc6ICtmb3JtLmZpbmQoXCJbbmFtZT0nc29fbHVvbmcnXVwiKS52YWwoKSxcbiAgICAgICAgICAgICAgICB0b25nX2dpYTogK2Zvcm0uZmluZChcIltuYW1lPSd0b25nX2dpYSddXCIpLnZhbCgpLFxuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgY29uc3QgcmVzID0geWllbGQgdGhpcy5hcHAudGh1b2MuYWRkKGRhdGEubWEsIGRhdGEuc29fbHVvbmcsIGRhdGEudG9uZ19naWEpO1xuICAgICAgICAgICAgICAgIGFsZXJ0KFwic3VjY2VzczogXCIgKyByZXMubWEgKyBcIj0+XCIgKyByZXMuc29fbHVvbmdfbW9pKTtcbiAgICAgICAgICAgICAgICB3aW5kb3cubG9jYXRpb24ucmVsb2FkKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjYXRjaCAoZSkge1xuICAgICAgICAgICAgICAgIGFsZXJ0KFwiRXJyb3I6IFwiICsgZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH1cbiAgICBzaG93KCkge1xuICAgICAgICB0aGlzLnBvcHVwLm1vZGFsKFwic2hvd1wiKTtcbiAgICB9XG4gICAgaGlkZSgpIHtcbiAgICAgICAgdGhpcy5wb3B1cC5tb2RhbChcImhpZGVcIik7XG4gICAgfVxufVxuZXhwb3J0cy5BZGRUaHVvY01vZGFsID0gQWRkVGh1b2NNb2RhbDtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPXRodW9jLWFkZC1tb2RhbC5qcy5tYXAiLCJcInVzZSBzdHJpY3RcIjtcbnZhciBfX2F3YWl0ZXIgPSAodGhpcyAmJiB0aGlzLl9fYXdhaXRlcikgfHwgZnVuY3Rpb24gKHRoaXNBcmcsIF9hcmd1bWVudHMsIFAsIGdlbmVyYXRvcikge1xuICAgIHJldHVybiBuZXcgKFAgfHwgKFAgPSBQcm9taXNlKSkoZnVuY3Rpb24gKHJlc29sdmUsIHJlamVjdCkge1xuICAgICAgICBmdW5jdGlvbiBmdWxmaWxsZWQodmFsdWUpIHsgdHJ5IHsgc3RlcChnZW5lcmF0b3IubmV4dCh2YWx1ZSkpOyB9IGNhdGNoIChlKSB7IHJlamVjdChlKTsgfSB9XG4gICAgICAgIGZ1bmN0aW9uIHJlamVjdGVkKHZhbHVlKSB7IHRyeSB7IHN0ZXAoZ2VuZXJhdG9yW1widGhyb3dcIl0odmFsdWUpKTsgfSBjYXRjaCAoZSkgeyByZWplY3QoZSk7IH0gfVxuICAgICAgICBmdW5jdGlvbiBzdGVwKHJlc3VsdCkgeyByZXN1bHQuZG9uZSA/IHJlc29sdmUocmVzdWx0LnZhbHVlKSA6IG5ldyBQKGZ1bmN0aW9uIChyZXNvbHZlKSB7IHJlc29sdmUocmVzdWx0LnZhbHVlKTsgfSkudGhlbihmdWxmaWxsZWQsIHJlamVjdGVkKTsgfVxuICAgICAgICBzdGVwKChnZW5lcmF0b3IgPSBnZW5lcmF0b3IuYXBwbHkodGhpc0FyZywgX2FyZ3VtZW50cyB8fCBbXSkpLm5leHQoKSk7XG4gICAgfSk7XG59O1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuY29uc3QgZm9ybVZhbF8xID0gcmVxdWlyZShcIi4uL2Zvcm1WYWxcIik7XG5jbGFzcyBFZGl0VGh1b2NNb2RhbCB7XG4gICAgY29uc3RydWN0b3IoaWQsIGFwcCkge1xuICAgICAgICB0aGlzLmFwcCA9IGFwcDtcbiAgICAgICAgdGhpcy5wb3B1cCA9ICQoXCIjXCIgKyBpZCk7XG4gICAgICAgIHRoaXMucG9wdXAubG9hZChcIi9sYXlvdXRzL21vZGFsLWVkaXQtdGh1b2MuaHRtbFwiLCAoKSA9PiB7XG4gICAgICAgICAgICB0aGlzLnBvcHVwLmZpbmQoXCJmb3JtXCIpLm9uKFwic3VibWl0XCIsIChlKSA9PiB7XG4gICAgICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgICAgIHRoaXMuZm9ybVN1Ym1pdEhhbmRsZShlKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICB9XG4gICAgZm9ybVN1Ym1pdEhhbmRsZShlKSB7XG4gICAgICAgIHJldHVybiBfX2F3YWl0ZXIodGhpcywgdm9pZCAwLCB2b2lkIDAsIGZ1bmN0aW9uKiAoKSB7XG4gICAgICAgICAgICBjb25zdCBmb3JtID0gJChlLnRhcmdldCk7XG4gICAgICAgICAgICBjb25zdCBkYXRhID0gZm9ybVZhbF8xLmdldEZvcm1WYWx1ZShmb3JtKTtcbiAgICAgICAgICAgIC8vIHRydW9uZyBob3AgdGhheSBkb2kgbWFfdGh1b2MsIGNhbiAxIG1hX3RodW9jIHRydW9jIGRlIHVwZGF0ZVxuICAgICAgICAgICAgY29uc3QgbWFUaHVvY0RlVXBkYXRlID0gZm9ybS5hdHRyKFwiaWRfdmFsdWVcIik7XG4gICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgIGNvbnN0IHJlcyA9IHlpZWxkIHRoaXMuYXBwLnRodW9jLnVwZGF0ZShtYVRodW9jRGVVcGRhdGUsIGRhdGEpO1xuICAgICAgICAgICAgICAgIGFsZXJ0KFwiU3VjY2VzczogXCIgKyByZXMgKyBcIiByZWNvcmQocylcIik7XG4gICAgICAgICAgICAgICAgd2luZG93LmxvY2F0aW9uLnJlbG9hZCgpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY2F0Y2ggKGUpIHtcbiAgICAgICAgICAgICAgICBhbGVydChcIkVycm9yOiBcIiArIGUpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9XG4gICAgc2hvdyhkYXRhKSB7XG4gICAgICAgIHRoaXMucG9wdXAuZmluZChcImZvcm1cIikuYXR0cihcImlkX3ZhbHVlXCIsIGRhdGEubWEpO1xuICAgICAgICB0aGlzLnBvcHVwLmZpbmQoXCJbbmFtZT1tYV1cIikudmFsKGRhdGEubWEpO1xuICAgICAgICB0aGlzLnBvcHVwLmZpbmQoXCJbbmFtZT10ZW5dXCIpLnZhbChkYXRhLnRlbik7XG4gICAgICAgIHRoaXMucG9wdXAuZmluZChcIltuYW1lPW5jY11cIikudmFsKGRhdGEudGVuX25jYyk7XG4gICAgICAgIHRoaXMucG9wdXAubW9kYWwoXCJzaG93XCIpO1xuICAgIH1cbiAgICBoaWRlKCkge1xuICAgICAgICB0aGlzLnBvcHVwLm1vZGFsKFwiaGlkZVwiKTtcbiAgICB9XG59XG5leHBvcnRzLkVkaXRUaHVvY01vZGFsID0gRWRpdFRodW9jTW9kYWw7XG4vLyMgc291cmNlTWFwcGluZ1VSTD10aHVvYy1lZGl0LW1vZGFsLmpzLm1hcCIsIlwidXNlIHN0cmljdFwiO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuY2xhc3MgRWRpdFByaWNlVGh1b2NNb2RhbCB7XG4gICAgY29uc3RydWN0b3IoaWQsIG1vZGVsKSB7XG4gICAgICAgIHRoaXMubW9kZWwgPSBtb2RlbDtcbiAgICAgICAgdGhpcy5wb3B1cCA9ICQoXCIjXCIgKyBpZCk7XG4gICAgICAgIHRoaXMucG9wdXAubG9hZChcIi9sYXlvdXRzL21vZGFsLWVkaXQtcHJpY2UtdGh1b2MuaHRtbFwiKTtcbiAgICB9XG4gICAgc2hvdygpIHtcbiAgICAgICAgdGhpcy5wb3B1cC5tb2RhbChcInNob3dcIik7XG4gICAgfVxuICAgIGhpZGUoKSB7XG4gICAgICAgIHRoaXMucG9wdXAubW9kYWwoXCJoaWRlXCIpO1xuICAgIH1cbn1cbmV4cG9ydHMuRWRpdFByaWNlVGh1b2NNb2RhbCA9IEVkaXRQcmljZVRodW9jTW9kYWw7XG4vLyMgc291cmNlTWFwcGluZ1VSTD10aHVvYy1lZGl0LXByaWNlLW1vZGFsLmpzLm1hcCIsIlwidXNlIHN0cmljdFwiO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuY29uc3QgdGh1b2NfYWRkX21vZGFsXzEgPSByZXF1aXJlKFwiLi90aHVvYy1hZGQtbW9kYWxcIik7XG5leHBvcnRzLkFkZFRodW9jTW9kYWwgPSB0aHVvY19hZGRfbW9kYWxfMS5BZGRUaHVvY01vZGFsO1xuY29uc3QgdGh1b2NfZWRpdF9tb2RhbF8xID0gcmVxdWlyZShcIi4vdGh1b2MtZWRpdC1tb2RhbFwiKTtcbmV4cG9ydHMuRWRpdFRodW9jTW9kYWwgPSB0aHVvY19lZGl0X21vZGFsXzEuRWRpdFRodW9jTW9kYWw7XG5jb25zdCB0aHVvY19uZXdfbW9kYWxfMSA9IHJlcXVpcmUoXCIuL3RodW9jLW5ldy1tb2RhbFwiKTtcbmV4cG9ydHMuTmV3VGh1b2NNb2RhbCA9IHRodW9jX25ld19tb2RhbF8xLk5ld1RodW9jTW9kYWw7XG5jb25zdCB0aHVvY19lZGl0X3ByaWNlX21vZGFsXzEgPSByZXF1aXJlKFwiLi90aHVvYy1lZGl0LXByaWNlLW1vZGFsXCIpO1xuZXhwb3J0cy5FZGl0UHJpY2VUaHVvY01vZGFsID0gdGh1b2NfZWRpdF9wcmljZV9tb2RhbF8xLkVkaXRQcmljZVRodW9jTW9kYWw7XG4vLyMgc291cmNlTWFwcGluZ1VSTD10aHVvYy1tb2RhbC5qcy5tYXAiLCJcInVzZSBzdHJpY3RcIjtcbnZhciBfX2F3YWl0ZXIgPSAodGhpcyAmJiB0aGlzLl9fYXdhaXRlcikgfHwgZnVuY3Rpb24gKHRoaXNBcmcsIF9hcmd1bWVudHMsIFAsIGdlbmVyYXRvcikge1xuICAgIHJldHVybiBuZXcgKFAgfHwgKFAgPSBQcm9taXNlKSkoZnVuY3Rpb24gKHJlc29sdmUsIHJlamVjdCkge1xuICAgICAgICBmdW5jdGlvbiBmdWxmaWxsZWQodmFsdWUpIHsgdHJ5IHsgc3RlcChnZW5lcmF0b3IubmV4dCh2YWx1ZSkpOyB9IGNhdGNoIChlKSB7IHJlamVjdChlKTsgfSB9XG4gICAgICAgIGZ1bmN0aW9uIHJlamVjdGVkKHZhbHVlKSB7IHRyeSB7IHN0ZXAoZ2VuZXJhdG9yW1widGhyb3dcIl0odmFsdWUpKTsgfSBjYXRjaCAoZSkgeyByZWplY3QoZSk7IH0gfVxuICAgICAgICBmdW5jdGlvbiBzdGVwKHJlc3VsdCkgeyByZXN1bHQuZG9uZSA/IHJlc29sdmUocmVzdWx0LnZhbHVlKSA6IG5ldyBQKGZ1bmN0aW9uIChyZXNvbHZlKSB7IHJlc29sdmUocmVzdWx0LnZhbHVlKTsgfSkudGhlbihmdWxmaWxsZWQsIHJlamVjdGVkKTsgfVxuICAgICAgICBzdGVwKChnZW5lcmF0b3IgPSBnZW5lcmF0b3IuYXBwbHkodGhpc0FyZywgX2FyZ3VtZW50cyB8fCBbXSkpLm5leHQoKSk7XG4gICAgfSk7XG59O1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuY29uc3QgZm9ybVZhbF8xID0gcmVxdWlyZShcIi4uL2Zvcm1WYWxcIik7XG5jbGFzcyBOZXdUaHVvY01vZGFsIHtcbiAgICBjb25zdHJ1Y3RvcihpZCwgYXBwKSB7XG4gICAgICAgIHRoaXMuYXBwID0gYXBwO1xuICAgICAgICB0aGlzLnBvcHVwID0gJChcIiNcIiArIGlkKTtcbiAgICAgICAgdGhpcy5wb3B1cC5sb2FkKFwiL2xheW91dHMvbW9kYWwtbmV3LXRodW9jLmh0bWxcIiwgKCkgPT4ge1xuICAgICAgICAgICAgdGhpcy5hcHAuZG9uVmkuZ2V0KChkYXRhKSA9PiB7XG4gICAgICAgICAgICAgICAgY29uc3Qgc2VsZWN0SW5wdXQgPSB0aGlzLnBvcHVwLmZpbmQoXCJbY29tcG9uZW50PSdEb25WaSddXCIpO1xuICAgICAgICAgICAgICAgIHNlbGVjdElucHV0LmNoaWxkcmVuKCkucmVtb3ZlKCk7XG4gICAgICAgICAgICAgICAgZm9yIChjb25zdCByb3cgb2YgZGF0YSkge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBvcHQgPSAkKFwiPG9wdGlvbi8+XCIpLnZhbChyb3cuaWQpLnRleHQocm93LnRlbik7XG4gICAgICAgICAgICAgICAgICAgIHNlbGVjdElucHV0LmFwcGVuZChvcHQpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBzZWxlY3RJbnB1dC5jaGlsZHJlbigpLmVxKDApLmF0dHIoXCJjaGVja2VkXCIsIFwidHJ1ZVwiKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgdGhpcy5wb3B1cC5maW5kKFwiZm9ybVwiKS5vbihcInN1Ym1pdFwiLCBmdW5jdGlvbiAoZSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBfX2F3YWl0ZXIodGhpcywgdm9pZCAwLCB2b2lkIDAsIGZ1bmN0aW9uKiAoKSB7XG4gICAgICAgICAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgZm9ybVZhbCA9IGZvcm1WYWxfMS5nZXRGb3JtVmFsdWUoJCh0aGlzKSk7XG4gICAgICAgICAgICAgICAgICAgIHlpZWxkIGFwcC50aHVvYy5jcmVhdGUoZm9ybVZhbCkuY2F0Y2goKGVycikgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgYWxlcnQoZXJyKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRocm93IGVycjtcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgIGFsZXJ0KFwic3VjY2Vzc1wiKTtcbiAgICAgICAgICAgICAgICAgICAgd2luZG93LmxvY2F0aW9uLnJlbG9hZCgpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgIH1cbiAgICBzaG93KCkge1xuICAgICAgICB0aGlzLnBvcHVwLm1vZGFsKFwic2hvd1wiKTtcbiAgICB9XG4gICAgaGlkZSgpIHtcbiAgICAgICAgdGhpcy5wb3B1cC5tb2RhbChcImhpZGVcIik7XG4gICAgfVxufVxuZXhwb3J0cy5OZXdUaHVvY01vZGFsID0gTmV3VGh1b2NNb2RhbDtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPXRodW9jLW5ldy1tb2RhbC5qcy5tYXAiLCJjb25zdCB7QXBwfSA9IHJlcXVpcmUoJy4uL2FwcC9BcHAnKTtcblxuJChkb2N1bWVudCkucmVhZHkoKCk9PntcbiAgICBjb25zdCBhcHAgPSBuZXcgQXBwKCk7XG5cbiAgICByZXF1aXJlKFwiLi4vYXBwL25oYXAtaG9hLWRvblwiKS5pbml0KGFwcCk7XG4gICAgcmVxdWlyZShcIi4uL2FwcC9uaGFwLXRodW9jXCIpLmluaXQoYXBwKTtcbn0pO1xuIl19
