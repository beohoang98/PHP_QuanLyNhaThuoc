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
        this.editModal = new thuoc_modal_1.EditThuocModal("thuoc--edit-modal", this.app.thuoc);
        this.editPriceModal = new thuoc_modal_1.EditPriceThuocModal("thuoc--edit-price-modal", this.app.thuoc);
    }
    editThuoc(data) {
        if (!data) {
            return;
        }
        $("#thuoc--edit-modal").modal("show");
        $("#thuoc--edit-mathuoc").val(data.ma);
        $("#thuoc--edit-tenthuoc").val(data.ten);
        $("#thuoc--edit-ncc").val(data.ten_ncc);
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
Object.defineProperty(exports, "__esModule", { value: true });
class EditThuocModal {
    constructor(id, model) {
        this.model = model;
        this.popup = $("#" + id);
        this.popup.load("/layouts/modal-edit-thuoc.html");
    }
    show() {
        this.popup.modal("show");
    }
    hide() {
        this.popup.modal("hide");
    }
}
exports.EditThuocModal = EditThuocModal;

},{}],17:[function(require,module,exports){
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvYXBwL0FwcC5qcyIsInNyYy9hcHAvQXV0b0NvbXBsZXRlL2luZGV4LmpzIiwic3JjL2FwcC9LZXlFdmVudC9pbmRleC5qcyIsInNyYy9hcHAvTWVudUNvbnRleHQvaW5kZXguanMiLCJzcmMvYXBwL01vZGVsL0RvblZpL2luZGV4LmpzIiwic3JjL2FwcC9Nb2RlbC9Nb2RlbENsYXNzL2luZGV4LmpzIiwic3JjL2FwcC9Nb2RlbC9UYWJsZURhdGEvaW5kZXguanMiLCJzcmMvYXBwL01vZGVsL1RodW9jL0JhbmdUaHVvYy5qcyIsInNyYy9hcHAvTW9kZWwvVGh1b2MvaW5kZXguanMiLCJzcmMvYXBwL1ZpZXcvVGh1b2NUYWJsZS5qcyIsInNyYy9hcHAvVmlldy9WaWV3VGFibGUuanMiLCJzcmMvYXBwL2Zvcm1WYWwuanMiLCJzcmMvYXBwL25oYXAtaG9hLWRvbi9pbmRleC5qcyIsInNyYy9hcHAvbmhhcC10aHVvYy9pbmRleC5qcyIsInNyYy9hcHAvbmhhcC10aHVvYy90aHVvYy1hZGQtbW9kYWwuanMiLCJzcmMvYXBwL25oYXAtdGh1b2MvdGh1b2MtZWRpdC1tb2RhbC5qcyIsInNyYy9hcHAvbmhhcC10aHVvYy90aHVvYy1lZGl0LXByaWNlLW1vZGFsLmpzIiwic3JjL2FwcC9uaGFwLXRodW9jL3RodW9jLW1vZGFsLmpzIiwic3JjL2FwcC9uaGFwLXRodW9jL3RodW9jLW5ldy1tb2RhbC5qcyIsInNyYy9zY3JpcHQvbWFpbi5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaEVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2SEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN4Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNwREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM1QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaklBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25EQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMzQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3pDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3ZEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3hJQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDWEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzdIQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDL0NBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDVkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQy9DQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbigpe2Z1bmN0aW9uIHIoZSxuLHQpe2Z1bmN0aW9uIG8oaSxmKXtpZighbltpXSl7aWYoIWVbaV0pe3ZhciBjPVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmU7aWYoIWYmJmMpcmV0dXJuIGMoaSwhMCk7aWYodSlyZXR1cm4gdShpLCEwKTt2YXIgYT1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK2krXCInXCIpO3Rocm93IGEuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixhfXZhciBwPW5baV09e2V4cG9ydHM6e319O2VbaV1bMF0uY2FsbChwLmV4cG9ydHMsZnVuY3Rpb24ocil7dmFyIG49ZVtpXVsxXVtyXTtyZXR1cm4gbyhufHxyKX0scCxwLmV4cG9ydHMscixlLG4sdCl9cmV0dXJuIG5baV0uZXhwb3J0c31mb3IodmFyIHU9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZSxpPTA7aTx0Lmxlbmd0aDtpKyspbyh0W2ldKTtyZXR1cm4gb31yZXR1cm4gcn0pKCkiLCJcInVzZSBzdHJpY3RcIjtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmNvbnN0IEtleUV2ZW50XzEgPSByZXF1aXJlKFwiLi9LZXlFdmVudFwiKTtcbmNvbnN0IFRodW9jXzEgPSByZXF1aXJlKFwiLi9Nb2RlbC9UaHVvY1wiKTtcbmNvbnN0IERvblZpXzEgPSByZXF1aXJlKFwiLi9Nb2RlbC9Eb25WaVwiKTtcbmNsYXNzIEFwcCB7XG4gICAgLy8gcHVibGljIG5jYzpcbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgdGhpcy5zd2l0Y2hUb1BhZ2UodGhpcy5nZXRQYWdlRnJvbVVybCgpKTtcbiAgICAgICAgdGhpcy5oYW5kbGVTd2l0Y2hQYWdlKCk7XG4gICAgICAgIHRoaXMua2V5ZXZlbnQgPSBuZXcgS2V5RXZlbnRfMS5LZXlFdmVudCgpO1xuICAgICAgICB0aGlzLmhhbmRsZVNldHRpbmcoKTtcbiAgICAgICAgdGhpcy5oYW5kbGVNb2RhbCgpO1xuICAgICAgICB0aGlzLnRodW9jID0gbmV3IFRodW9jXzEuVGh1b2MoKTtcbiAgICAgICAgdGhpcy5kb25WaSA9IG5ldyBEb25WaV8xLkRvblZpKCk7XG4gICAgfVxuICAgIGdldFVzZXJuYW1lKCkge1xuICAgICAgICBjb25zdCB1c2VybmFtZSA9IGRvY3VtZW50LmNvb2tpZS5tYXRjaCgvdXNlcm5hbWU9KFswLTlhLXpBLVpfXSspL2kpWzFdO1xuICAgICAgICAkKFwiI3VzZXJuYW1lXCIpLnRleHQodXNlcm5hbWUpO1xuICAgIH1cbiAgICBvblNob3J0Y3V0S2V5KGNvbWJLZXksIHBhZ2UsIGZ1bmMpIHtcbiAgICAgICAgLy8gZipraW5nIGluY3JlZGlibGUgc2NvcGUgdGhpbmdzIVxuICAgICAgICB0aGlzLmtleWV2ZW50Lm9uKGNvbWJLZXksIChlKSA9PiB7XG4gICAgICAgICAgICBpZiAodGhpcy5wYWdlID09PSBwYWdlKSB7XG4gICAgICAgICAgICAgICAgZnVuYyhlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfVxuICAgIGdldFBhZ2VGcm9tVXJsKCkge1xuICAgICAgICBsZXQgcGFnZSA9IG5ldyBVUkwod2luZG93LmxvY2F0aW9uLnRvU3RyaW5nKCkpLnNlYXJjaFBhcmFtcy5nZXQoXCJwYWdlXCIpO1xuICAgICAgICBpZiAoIXBhZ2UpIHtcbiAgICAgICAgICAgIHBhZ2UgPSBcInBhZ2UtbmhhcC1ob2EtZG9uXCI7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHBhZ2U7XG4gICAgfVxuICAgIGhhbmRsZVN3aXRjaFBhZ2UoKSB7XG4gICAgICAgIGNvbnN0ICR0aGlzID0gdGhpcztcbiAgICAgICAgJChcIi5zaWRlYmFyLXN3aXRjaC1wYWdlXCIpLm9uKFwiY2xpY2tcIiwgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgY29uc3QgaWQgPSAkKHRoaXMpLmRhdGEoXCJ0YXJnZXRcIik7XG4gICAgICAgICAgICAkdGhpcy5zd2l0Y2hUb1BhZ2UoaWQpO1xuICAgICAgICB9KTtcbiAgICB9XG4gICAgc3dpdGNoVG9QYWdlKGlkKSB7XG4gICAgICAgIHRoaXMucGFnZSA9IGlkO1xuICAgICAgICB3aW5kb3cuaGlzdG9yeS5yZXBsYWNlU3RhdGUobnVsbCwgaWQsIFwiLz9wYWdlPVwiICsgaWQpO1xuICAgICAgICBjb25zdCBjb250YWluZXIgPSAkKFwiLmZyYW1lLWNvbnRhaW5lclwiKTtcbiAgICAgICAgY29uc3QgcGFnZSA9ICQoXCIjXCIgKyBpZCk7XG4gICAgICAgIGNvbnRhaW5lci5hbmltYXRlKHtcbiAgICAgICAgICAgIHNjcm9sbFRvcDogcGFnZS5vZmZzZXQoKS50b3AgLSBjb250YWluZXIub2Zmc2V0KCkudG9wICsgY29udGFpbmVyLnNjcm9sbFRvcCgpLFxuICAgICAgICB9KTtcbiAgICB9XG4gICAgaGFuZGxlU2V0dGluZygpIHtcbiAgICAgICAgLy9cbiAgICB9XG4gICAgaGFuZGxlTW9kYWwoKSB7XG4gICAgICAgICQoXCIubW9kYWxcIikub24oXCJzaG93bi5icy5tb2RhbFwiLCAoKSA9PiB7XG4gICAgICAgICAgICB0aGlzLmtleWV2ZW50LmJsb2NrKCk7XG4gICAgICAgIH0pO1xuICAgICAgICAkKFwiLm1vZGFsXCIpLm9uKFwiaGlkZGVuLmJzLm1vZGFsXCIsICgpID0+IHtcbiAgICAgICAgICAgIHRoaXMua2V5ZXZlbnQudW5ibG9jaygpO1xuICAgICAgICB9KTtcbiAgICB9XG59XG5leHBvcnRzLkFwcCA9IEFwcDtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPUFwcC5qcy5tYXAiLCJcInVzZSBzdHJpY3RcIjtcbnZhciBfX2F3YWl0ZXIgPSAodGhpcyAmJiB0aGlzLl9fYXdhaXRlcikgfHwgZnVuY3Rpb24gKHRoaXNBcmcsIF9hcmd1bWVudHMsIFAsIGdlbmVyYXRvcikge1xuICAgIHJldHVybiBuZXcgKFAgfHwgKFAgPSBQcm9taXNlKSkoZnVuY3Rpb24gKHJlc29sdmUsIHJlamVjdCkge1xuICAgICAgICBmdW5jdGlvbiBmdWxmaWxsZWQodmFsdWUpIHsgdHJ5IHsgc3RlcChnZW5lcmF0b3IubmV4dCh2YWx1ZSkpOyB9IGNhdGNoIChlKSB7IHJlamVjdChlKTsgfSB9XG4gICAgICAgIGZ1bmN0aW9uIHJlamVjdGVkKHZhbHVlKSB7IHRyeSB7IHN0ZXAoZ2VuZXJhdG9yW1widGhyb3dcIl0odmFsdWUpKTsgfSBjYXRjaCAoZSkgeyByZWplY3QoZSk7IH0gfVxuICAgICAgICBmdW5jdGlvbiBzdGVwKHJlc3VsdCkgeyByZXN1bHQuZG9uZSA/IHJlc29sdmUocmVzdWx0LnZhbHVlKSA6IG5ldyBQKGZ1bmN0aW9uIChyZXNvbHZlKSB7IHJlc29sdmUocmVzdWx0LnZhbHVlKTsgfSkudGhlbihmdWxmaWxsZWQsIHJlamVjdGVkKTsgfVxuICAgICAgICBzdGVwKChnZW5lcmF0b3IgPSBnZW5lcmF0b3IuYXBwbHkodGhpc0FyZywgX2FyZ3VtZW50cyB8fCBbXSkpLm5leHQoKSk7XG4gICAgfSk7XG59O1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuY2xhc3MgQXV0b0NvbXBsZXRlIHtcbiAgICBjb25zdHJ1Y3Rvcih0YXJnZXQsIG1vZGVsKSB7XG4gICAgICAgIGlmICh0eXBlb2YgdGFyZ2V0ID09PSBcInN0cmluZ1wiKSB7XG4gICAgICAgICAgICB0aGlzLnRhcmdldCA9ICQoXCIjXCIgKyB0YXJnZXQpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgdGhpcy50YXJnZXQgPSB0YXJnZXQ7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy50YXJnZXQuYXR0cihcImF1dG9jb21wbGV0ZVwiLCBcIm9mZlwiKTtcbiAgICAgICAgdGhpcy5tb2RlbCA9IG1vZGVsO1xuICAgIH1cbiAgICBvbkNob29zZShmdW5jKSB7XG4gICAgICAgIHRoaXMuZnVuY09uQ2hvb3NlID0gZnVuYztcbiAgICB9XG4gICAgaXNTaG93ZWQoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmVsZW1lbnQuY2hpbGRyZW4ubGVuZ3RoID4gMDtcbiAgICB9XG4gICAgLyoqXG4gICAgICogc2V0IGZpZWxkbmFtZSB0byBzaG93XG4gICAgICogQHBhcmFtIGxvb2t1cCB7ZmllbGROYW1lOiBFbGVtZW50SWR9XG4gICAgICovXG4gICAgc2V0TG9va3VwKGxvb2t1cCkge1xuICAgICAgICB0aGlzLmxvb2t1cCA9IGxvb2t1cDtcbiAgICB9XG4gICAgbGlzdGVuKCkge1xuICAgICAgICB0aGlzLnRhcmdldC5vbihcImtleXVwXCIsIChlKSA9PiB7XG4gICAgICAgICAgICBjb25zdCBrZXkgPSBlLmtleTtcbiAgICAgICAgICAgIHN3aXRjaCAoa2V5KSB7XG4gICAgICAgICAgICAgICAgY2FzZSBcIkVudGVyXCI6IHtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGNhc2UgXCJFc2NhcGVcIjoge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnJlbW92ZSgpO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgY2FzZSBcIkFycm93VXBcIjoge1xuICAgICAgICAgICAgICAgICAgICAvLyB0byBkb1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgY2FzZSBcIkFycm93RG93blwiOiB7XG4gICAgICAgICAgICAgICAgICAgIC8vIHRvIGRvXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBkZWZhdWx0OiB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHZhbCA9IHRoaXMudGFyZ2V0LnZhbCgpO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnJlbW92ZSgpO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnJlbmRlcih2YWwpLnRoZW4oKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5zaG93KCk7XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfVxuICAgIHJlbmRlcihzZWFyY2gpIHtcbiAgICAgICAgcmV0dXJuIF9fYXdhaXRlcih0aGlzLCB2b2lkIDAsIHZvaWQgMCwgZnVuY3Rpb24qICgpIHtcbiAgICAgICAgICAgIHRoaXMuZWxlbWVudCA9ICQoXCI8dWwvPlwiKS5hZGRDbGFzcyhcIm15LWF1dG9jb21wbGV0ZSBzaGFkb3ctbGcgcm91bmRlZFwiKTtcbiAgICAgICAgICAgIHRoaXMuZWxlbWVudC5jc3Moe1xuICAgICAgICAgICAgICAgIHRvcDogdGhpcy50YXJnZXQub2Zmc2V0KCkudG9wICsgdGhpcy50YXJnZXQub3V0ZXJIZWlnaHQoKSxcbiAgICAgICAgICAgICAgICBsZWZ0OiB0aGlzLnRhcmdldC5vZmZzZXQoKS5sZWZ0LFxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBjb25zdCBkYXRhID0geWllbGQgdGhpcy5nZXREYXRhKHNlYXJjaCk7XG4gICAgICAgICAgICB0aGlzLmN1cnJlbnRPZmZzZXQgPSAwO1xuICAgICAgICAgICAgbGV0IG9mZnNldCA9IDA7XG4gICAgICAgICAgICBmb3IgKGNvbnN0IGRhdGFSb3cgb2YgZGF0YSkge1xuICAgICAgICAgICAgICAgIGNvbnN0IGRhdGFSb3dGaWx0ZXJlZCA9IHRoaXMuZmlsdGVyRGF0YVdpdGhMb29rdXAoZGF0YVJvdyk7XG4gICAgICAgICAgICAgICAgY29uc3Qgcm93RWxlbWVudCA9IHRoaXMucmVuZGVyUm93KGRhdGFSb3dGaWx0ZXJlZCwgb2Zmc2V0KyspO1xuICAgICAgICAgICAgICAgIHJvd0VsZW1lbnQub24oXCJjbGljayBrZXlkb3duXCIsIChlKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChlLnR5cGUgPT09IFwiY2xpY2tcIiB8fCBlLmtleSA9PT0gXCJFbnRlclwiKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICAgICAgICAgICAgICBlLnN0b3BQcm9wYWdhdGlvbigpO1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5mdW5jT25DaG9vc2UoZGF0YVJvdyk7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnJlbW92ZSgpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgdGhpcy5lbGVtZW50LmFwcGVuZChyb3dFbGVtZW50KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfVxuICAgIHNob3coKSB7XG4gICAgICAgICQoXCJib2R5XCIpLmFwcGVuZCh0aGlzLmVsZW1lbnQpO1xuICAgIH1cbiAgICByZW1vdmUoKSB7XG4gICAgICAgICQoXCIubXktYXV0b2NvbXBsZXRlXCIpLnJlbW92ZSgpO1xuICAgIH1cbiAgICBnZXREYXRhKHNlYXJjaCkge1xuICAgICAgICByZXR1cm4gX19hd2FpdGVyKHRoaXMsIHZvaWQgMCwgdm9pZCAwLCBmdW5jdGlvbiogKCkge1xuICAgICAgICAgICAgY29uc3QgZGF0YSA9IHlpZWxkIHRoaXMubW9kZWwuZ2V0KHNlYXJjaCwgMCwgMjApOyAvLyAyMCBpcyBmb3IgdGVzdCBmaXJzdCwgd2lsbCBkZXZlbG9wIGluIGZ1dHVyZVxuICAgICAgICAgICAgcmV0dXJuIGRhdGE7XG4gICAgICAgIH0pO1xuICAgIH1cbiAgICByZW5kZXJSb3coZGF0YVJvdywgb2Zmc2V0KSB7XG4gICAgICAgIGNvbnN0IHJvdyA9ICQoXCI8bGkvPlwiKS5kYXRhKFwib2Zmc2V0XCIsIG9mZnNldCk7XG4gICAgICAgIGZvciAoY29uc3QgZmllbGQgb2YgT2JqZWN0LmtleXMoZGF0YVJvdykpIHtcbiAgICAgICAgICAgIGNvbnN0IHZhbCA9IGRhdGFSb3dbZmllbGRdO1xuICAgICAgICAgICAgcm93LmFwcGVuZCgkKFwiPGRpdi8+XCIpLnRleHQodmFsKSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHJvdztcbiAgICB9XG4gICAgZmlsdGVyRGF0YVdpdGhMb29rdXAoZGF0YVJvdykge1xuICAgICAgICBjb25zdCBmaWx0ZXJlZERhdGEgPSB7fTtcbiAgICAgICAgZm9yIChjb25zdCBrZXkgb2YgdGhpcy5sb29rdXApIHtcbiAgICAgICAgICAgIGlmIChkYXRhUm93Lmhhc093blByb3BlcnR5KGtleSkpIHtcbiAgICAgICAgICAgICAgICBmaWx0ZXJlZERhdGFba2V5XSA9IGRhdGFSb3dba2V5XTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZmlsdGVyZWREYXRhO1xuICAgIH1cbn1cbmV4cG9ydHMuQXV0b0NvbXBsZXRlID0gQXV0b0NvbXBsZXRlO1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9aW5kZXguanMubWFwIiwiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5jbGFzcyBLZXlFdmVudCB7XG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHRoaXMuZXZlbnRBdHRhY2ggPSB7fTtcbiAgICAgICAgdGhpcy5pc0Jsb2NraW5nID0gZmFsc2U7XG4gICAgICAgICQoZG9jdW1lbnQpLm9uKFwia2V5ZG93blwiLCAoZSkgPT4ge1xuICAgICAgICAgICAgaWYgKHRoaXMuaXNCbG9ja2luZykge1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGxldCBjb21iS2V5ID0gXCJcIjtcbiAgICAgICAgICAgIGlmIChlLmN0cmxLZXkpIHtcbiAgICAgICAgICAgICAgICBjb21iS2V5ID0gXCJjdHJsK1wiO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY29tYktleSArPSBlLmtleTtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKGNvbWJLZXkpO1xuICAgICAgICAgICAgaWYgKHRoaXMuZXZlbnRBdHRhY2guaGFzT3duUHJvcGVydHkoY29tYktleSkpIHtcbiAgICAgICAgICAgICAgICBjb25zdCBsaXN0RnVuYyA9IHRoaXMuZXZlbnRBdHRhY2hbY29tYktleV07XG4gICAgICAgICAgICAgICAgZm9yIChjb25zdCBmdW5jIG9mIGxpc3RGdW5jKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmICh0eXBlb2YgZnVuYyA9PT0gXCJmdW5jdGlvblwiKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBmdW5jKGUpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9XG4gICAgb24oY29tYktleSwgZnVuYykge1xuICAgICAgICBpZiAoIXRoaXMuZXZlbnRBdHRhY2hbY29tYktleV0pIHtcbiAgICAgICAgICAgIHRoaXMuZXZlbnRBdHRhY2hbY29tYktleV0gPSBbXTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmV2ZW50QXR0YWNoW2NvbWJLZXldLnB1c2goZnVuYyk7XG4gICAgfVxuICAgIGJsb2NrKCkge1xuICAgICAgICB0aGlzLmlzQmxvY2tpbmcgPSB0cnVlO1xuICAgIH1cbiAgICB1bmJsb2NrKCkge1xuICAgICAgICB0aGlzLmlzQmxvY2tpbmcgPSBmYWxzZTtcbiAgICB9XG59XG5leHBvcnRzLktleUV2ZW50ID0gS2V5RXZlbnQ7XG4vLyMgc291cmNlTWFwcGluZ1VSTD1pbmRleC5qcy5tYXAiLCJcInVzZSBzdHJpY3RcIjtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmNsYXNzIE1lbnVDb250ZXh0IHtcbiAgICBjb25zdHJ1Y3Rvcih0YXJnZXQpIHtcbiAgICAgICAgaWYgKHR5cGVvZiB0YXJnZXQgPT09IFwic3RyaW5nXCIpIHtcbiAgICAgICAgICAgIHRoaXMudGFyZ2V0ID0gJChcIiNcIiArIHRhcmdldCk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICB0aGlzLnRhcmdldCA9IHRhcmdldDtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLnRhcmdldC5vbihcImNvbnRleHRtZW51XCIsIChlKSA9PiB7XG4gICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICBlLnN0b3BQcm9wYWdhdGlvbigpO1xuICAgICAgICAgICAgdGhpcy5yZW1vdmUoKS5yZW5kZXIoeyB4OiBlLmNsaWVudFgsIHk6IGUuY2xpZW50WSB9KS5zaG93KCk7XG4gICAgICAgIH0pO1xuICAgICAgICB0aGlzLm1lbnUgPSBbXTtcbiAgICB9XG4gICAgYWRkQ29udGV4dChwcm9wKSB7XG4gICAgICAgIHRoaXMubWVudS5wdXNoKHByb3ApO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG4gICAgcmVuZGVyKHBvcykge1xuICAgICAgICB0aGlzLmVsZW1lbnQgPSAkKFwiPHVsLz5cIikuYWRkQ2xhc3MoXCJzaGFkb3ctbGcgcm91bmRlZCBteS1jb250ZXh0bWVudVwiKTtcbiAgICAgICAgdGhpcy5lbGVtZW50LmNzcyhcInRvcFwiLCBwb3MueSArIFwicHhcIik7XG4gICAgICAgIHRoaXMuZWxlbWVudC5jc3MoXCJsZWZ0XCIsIHBvcy54ICsgXCJweFwiKTtcbiAgICAgICAgZm9yIChjb25zdCBjdHggb2YgdGhpcy5tZW51KSB7XG4gICAgICAgICAgICB0aGlzLmVsZW1lbnQuYXBwZW5kKHRoaXMucmVuZGVyQ29udGV4dChjdHgpKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmVsZW1lbnQuaGlkZSgpO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG4gICAgc2hvdygpIHtcbiAgICAgICAgJChcImJvZHlcIikuYXBwZW5kKHRoaXMuZWxlbWVudCk7XG4gICAgICAgIHRoaXMuZWxlbWVudC5zbGlkZURvd24oMC41KTtcbiAgICAgICAgJChkb2N1bWVudCkub2ZmKFwiY2xpY2tcIiwgdGhpcy5yZW1vdmUpLm9uKFwiY2xpY2tcIiwgdGhpcy5yZW1vdmUpO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG4gICAgcmVtb3ZlKCkge1xuICAgICAgICAkKFwiLm15LWNvbnRleHRtZW51XCIpLnJlbW92ZSgpO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG4gICAgcmVuZGVyQ29udGV4dChwcm9wKSB7XG4gICAgICAgIGNvbnN0IGNvbnRleHQgPSAkKFwiPGxpLz5cIik7XG4gICAgICAgIGNvbnRleHQuaHRtbChgPGkgY2xhc3M9JyR7cHJvcC5pY29ufSAke3Byb3AuY2xhc3NOYW1lfSc+PC9pPiAke3Byb3AudGl0bGV9YCk7XG4gICAgICAgIGNvbnRleHQub24oXCJjbGlja1wiLCAoZSkgPT4ge1xuICAgICAgICAgICAgdGhpcy5yZW1vdmUoKTtcbiAgICAgICAgICAgIHByb3AuY2xpY2soZSk7XG4gICAgICAgIH0pO1xuICAgICAgICByZXR1cm4gY29udGV4dDtcbiAgICB9XG59XG5leHBvcnRzLk1lbnVDb250ZXh0ID0gTWVudUNvbnRleHQ7XG4vLyMgc291cmNlTWFwcGluZ1VSTD1pbmRleC5qcy5tYXAiLCJcInVzZSBzdHJpY3RcIjtcbnZhciBfX2F3YWl0ZXIgPSAodGhpcyAmJiB0aGlzLl9fYXdhaXRlcikgfHwgZnVuY3Rpb24gKHRoaXNBcmcsIF9hcmd1bWVudHMsIFAsIGdlbmVyYXRvcikge1xuICAgIHJldHVybiBuZXcgKFAgfHwgKFAgPSBQcm9taXNlKSkoZnVuY3Rpb24gKHJlc29sdmUsIHJlamVjdCkge1xuICAgICAgICBmdW5jdGlvbiBmdWxmaWxsZWQodmFsdWUpIHsgdHJ5IHsgc3RlcChnZW5lcmF0b3IubmV4dCh2YWx1ZSkpOyB9IGNhdGNoIChlKSB7IHJlamVjdChlKTsgfSB9XG4gICAgICAgIGZ1bmN0aW9uIHJlamVjdGVkKHZhbHVlKSB7IHRyeSB7IHN0ZXAoZ2VuZXJhdG9yW1widGhyb3dcIl0odmFsdWUpKTsgfSBjYXRjaCAoZSkgeyByZWplY3QoZSk7IH0gfVxuICAgICAgICBmdW5jdGlvbiBzdGVwKHJlc3VsdCkgeyByZXN1bHQuZG9uZSA/IHJlc29sdmUocmVzdWx0LnZhbHVlKSA6IG5ldyBQKGZ1bmN0aW9uIChyZXNvbHZlKSB7IHJlc29sdmUocmVzdWx0LnZhbHVlKTsgfSkudGhlbihmdWxmaWxsZWQsIHJlamVjdGVkKTsgfVxuICAgICAgICBzdGVwKChnZW5lcmF0b3IgPSBnZW5lcmF0b3IuYXBwbHkodGhpc0FyZywgX2FyZ3VtZW50cyB8fCBbXSkpLm5leHQoKSk7XG4gICAgfSk7XG59O1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuY29uc3QgTW9kZWxDbGFzc18xID0gcmVxdWlyZShcIi4uL01vZGVsQ2xhc3NcIik7XG5jbGFzcyBEb25WaSBleHRlbmRzIE1vZGVsQ2xhc3NfMS5Nb2RlbCB7XG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHN1cGVyKCk7XG4gICAgICAgIHRoaXMuZGF0YWJhc2UgPSBcIi9hcGkvZG9uX3ZpL1wiO1xuICAgIH1cbiAgICBnZXQoY2FsbGJhY2spIHtcbiAgICAgICAgcmV0dXJuIF9fYXdhaXRlcih0aGlzLCB2b2lkIDAsIHZvaWQgMCwgZnVuY3Rpb24qICgpIHtcbiAgICAgICAgICAgIGNvbnN0IGRhdGEgPSB5aWVsZCB0aGlzLl9nZXQoe30pO1xuICAgICAgICAgICAgdGhpcy5kYXRhID0gZGF0YTtcbiAgICAgICAgICAgIGlmICh0eXBlb2YgY2FsbGJhY2sgPT09IFwiZnVuY3Rpb25cIikge1xuICAgICAgICAgICAgICAgIGNhbGxiYWNrKGRhdGEpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuZGF0YTtcbiAgICAgICAgfSk7XG4gICAgfVxufVxuZXhwb3J0cy5Eb25WaSA9IERvblZpO1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9aW5kZXguanMubWFwIiwiXCJ1c2Ugc3RyaWN0XCI7XG52YXIgX19hd2FpdGVyID0gKHRoaXMgJiYgdGhpcy5fX2F3YWl0ZXIpIHx8IGZ1bmN0aW9uICh0aGlzQXJnLCBfYXJndW1lbnRzLCBQLCBnZW5lcmF0b3IpIHtcbiAgICByZXR1cm4gbmV3IChQIHx8IChQID0gUHJvbWlzZSkpKGZ1bmN0aW9uIChyZXNvbHZlLCByZWplY3QpIHtcbiAgICAgICAgZnVuY3Rpb24gZnVsZmlsbGVkKHZhbHVlKSB7IHRyeSB7IHN0ZXAoZ2VuZXJhdG9yLm5leHQodmFsdWUpKTsgfSBjYXRjaCAoZSkgeyByZWplY3QoZSk7IH0gfVxuICAgICAgICBmdW5jdGlvbiByZWplY3RlZCh2YWx1ZSkgeyB0cnkgeyBzdGVwKGdlbmVyYXRvcltcInRocm93XCJdKHZhbHVlKSk7IH0gY2F0Y2ggKGUpIHsgcmVqZWN0KGUpOyB9IH1cbiAgICAgICAgZnVuY3Rpb24gc3RlcChyZXN1bHQpIHsgcmVzdWx0LmRvbmUgPyByZXNvbHZlKHJlc3VsdC52YWx1ZSkgOiBuZXcgUChmdW5jdGlvbiAocmVzb2x2ZSkgeyByZXNvbHZlKHJlc3VsdC52YWx1ZSk7IH0pLnRoZW4oZnVsZmlsbGVkLCByZWplY3RlZCk7IH1cbiAgICAgICAgc3RlcCgoZ2VuZXJhdG9yID0gZ2VuZXJhdG9yLmFwcGx5KHRoaXNBcmcsIF9hcmd1bWVudHMgfHwgW10pKS5uZXh0KCkpO1xuICAgIH0pO1xufTtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmNsYXNzIE1vZGVsIHtcbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgdGhpcy5kYXRhYmFzZSA9IFwiXCI7XG4gICAgICAgIHRoaXMuZGF0YSA9IFtdO1xuICAgIH1cbiAgICBnZXQgZmV0Y2hEYXRhKCkge1xuICAgICAgICByZXR1cm4gT2JqZWN0LmFzc2lnbih7fSwgdGhpcy5kYXRhKTtcbiAgICB9XG4gICAgZ2V0IHJlc3BvbnNlKCkge1xuICAgICAgICByZXR1cm4gT2JqZWN0LmFzc2lnbih7fSwgdGhpcy5yZXMpO1xuICAgIH1cbiAgICAvLyA9PT09PT09PT09PT09PT0gSU5IRVJJVCBGVU5DXG4gICAgZ2V0KHBhcmFtcywgb2Zmc2V0LCBsaW1pdCkge1xuICAgICAgICByZXR1cm4gX19hd2FpdGVyKHRoaXMsIHZvaWQgMCwgdm9pZCAwLCBmdW5jdGlvbiogKCkge1xuICAgICAgICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICAgICAgfSk7XG4gICAgfVxuICAgIGNyZWF0ZShkYXRhKSB7XG4gICAgICAgIHJldHVybiBfX2F3YWl0ZXIodGhpcywgdm9pZCAwLCB2b2lkIDAsIGZ1bmN0aW9uKiAoKSB7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH0pO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiB1cGRhdGUgcmVjb3JkXG4gICAgICogQHBhcmFtIGZpZWxkTWF0Y2ggbWF0Y2ggZmllbGQgdG8gdXBkYXRlIHJlY29yZFxuICAgICAqIEBwYXJhbSBmaWVsZFVwZGF0ZSB0aGUgZGF0YSBuZWVkIHVwZGF0ZVxuICAgICAqL1xuICAgIHVwZGF0ZShmaWVsZE1hdGNoLCBmaWVsZFVwZGF0ZSkge1xuICAgICAgICByZXR1cm4gX19hd2FpdGVyKHRoaXMsIHZvaWQgMCwgdm9pZCAwLCBmdW5jdGlvbiogKCkge1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9KTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogcmVtb3ZlIGEgcmVjb3JkXG4gICAgICogQHBhcmFtIGZpZWxkTWF0Y2ggZmllbGQgbWF0Y2ggdG8gcmVtb3ZlXG4gICAgICogQHJldHVybiB0cnVlIG9mIGZhbHNlXG4gICAgICovXG4gICAgcmVtb3ZlKGZpZWxkTWF0Y2gpIHtcbiAgICAgICAgcmV0dXJuIF9fYXdhaXRlcih0aGlzLCB2b2lkIDAsIHZvaWQgMCwgZnVuY3Rpb24qICgpIHtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfSk7XG4gICAgfVxuICAgIC8vID09PT09PT09PT09PT09PSBDT1JFIEZVTkNcbiAgICAvKipcbiAgICAgKiBmZXRjaCBkYXRhIGZyb20gZGF0YWJhc2UgYW5kIGRvIHRoaW5nXG4gICAgICogQHBhcmFtIHBhcmFtc1xuICAgICAqIEBwYXJhbSBjYWxsYmFjayBjYWxsYmFjayBmdW5jdGlvblxuICAgICAqL1xuICAgIF9nZXQocGFyYW1zLCBjYWxsYmFjaykge1xuICAgICAgICByZXR1cm4gX19hd2FpdGVyKHRoaXMsIHZvaWQgMCwgdm9pZCAwLCBmdW5jdGlvbiogKCkge1xuICAgICAgICAgICAgdGhpcy5kYXRhID0gW107XG4gICAgICAgICAgICBjb25zdCByZXF1ZXN0VVJMID0gdGhpcy5kYXRhYmFzZSArIFwiP1wiICsgdGhpcy5fdXJscGFyYW1zKHBhcmFtcyk7XG4gICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgIGNvbnN0IHJlcyA9IHlpZWxkIGZldGNoKHJlcXVlc3RVUkwsIHsgY3JlZGVudGlhbHM6IFwiaW5jbHVkZVwiIH0pO1xuICAgICAgICAgICAgICAgIGNvbnN0IGpzb24gPSB5aWVsZCByZXMuanNvbigpO1xuICAgICAgICAgICAgICAgIGlmIChqc29uLmVycikge1xuICAgICAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoanNvbi5tc2cpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB0aGlzLmRhdGEgPSBqc29uLmRhdGE7XG4gICAgICAgICAgICAgICAgaWYgKHR5cGVvZiBjYWxsYmFjayA9PT0gXCJmdW5jdGlvblwiKSB7XG4gICAgICAgICAgICAgICAgICAgIGNhbGxiYWNrKGZhbHNlLCBqc29uLmRhdGEpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICByZXR1cm4ganNvbi5kYXRhO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY2F0Y2ggKGVycikge1xuICAgICAgICAgICAgICAgIGlmICh0eXBlb2YgY2FsbGJhY2sgPT09IFwiZnVuY3Rpb25cIikge1xuICAgICAgICAgICAgICAgICAgICBjYWxsYmFjayhlcnIpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgdGhyb3cgZXJyO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIHBvc3QgcmVxdWVzdFxuICAgICAqIEBwYXJhbSB7YW55fSBkYXRhXG4gICAgICogQHBhcmFtIHtGdW5jdGlvbn0gW2NhbGxiYWNrXVxuICAgICAqL1xuICAgIF9wb3N0KGRhdGEsIGNhbGxiYWNrKSB7XG4gICAgICAgIHJldHVybiBfX2F3YWl0ZXIodGhpcywgdm9pZCAwLCB2b2lkIDAsIGZ1bmN0aW9uKiAoKSB7XG4gICAgICAgICAgICB0aGlzLnJlcyA9IFwiXCI7XG4gICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgIGNvbnN0IHJlcyA9IHlpZWxkIGZldGNoKHRoaXMuZGF0YWJhc2UsIHtcbiAgICAgICAgICAgICAgICAgICAgYm9keTogSlNPTi5zdHJpbmdpZnkoZGF0YSksXG4gICAgICAgICAgICAgICAgICAgIGNyZWRlbnRpYWxzOiBcImluY2x1ZGVcIixcbiAgICAgICAgICAgICAgICAgICAgaGVhZGVyczoge1xuICAgICAgICAgICAgICAgICAgICAgICAgXCJDb250ZW50LVR5cGVcIjogXCJhcHBsaWNhdGlvbi9qc29uXCIsXG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgIG1ldGhvZDogXCJQT1NUXCIsXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgY29uc3QganNvbiA9IHlpZWxkIHJlcy5qc29uKCk7XG4gICAgICAgICAgICAgICAgaWYgKGpzb24uZXJyKSB7XG4gICAgICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihqc29uLm1zZyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHRoaXMucmVzID0ganNvbi5kYXRhO1xuICAgICAgICAgICAgICAgIGlmICh0eXBlb2YgY2FsbGJhY2sgPT09IFwiZnVuY3Rpb25cIikge1xuICAgICAgICAgICAgICAgICAgICBjYWxsYmFjayhmYWxzZSwganNvbi5kYXRhKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcmV0dXJuIGpzb24uZGF0YTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNhdGNoIChlcnIpIHtcbiAgICAgICAgICAgICAgICBpZiAodHlwZW9mIGNhbGxiYWNrID09PSBcImZ1bmN0aW9uXCIpIHtcbiAgICAgICAgICAgICAgICAgICAgY2FsbGJhY2soZXJyKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHRocm93IGVycjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH1cbiAgICBfdXJscGFyYW1zKHBhcmFtcykge1xuICAgICAgICBjb25zdCB1cmwgPSBPYmplY3Qua2V5cyhwYXJhbXMpLm1hcCgoaykgPT4ge1xuICAgICAgICAgICAgcmV0dXJuIGVuY29kZVVSSUNvbXBvbmVudChrKSArIFwiPVwiICsgZW5jb2RlVVJJQ29tcG9uZW50KHBhcmFtc1trXSk7XG4gICAgICAgIH0pLmpvaW4oXCImXCIpO1xuICAgICAgICByZXR1cm4gdXJsO1xuICAgIH1cbn1cbmV4cG9ydHMuTW9kZWwgPSBNb2RlbDtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWluZGV4LmpzLm1hcCIsIlwidXNlIHN0cmljdFwiO1xudmFyIF9fYXdhaXRlciA9ICh0aGlzICYmIHRoaXMuX19hd2FpdGVyKSB8fCBmdW5jdGlvbiAodGhpc0FyZywgX2FyZ3VtZW50cywgUCwgZ2VuZXJhdG9yKSB7XG4gICAgcmV0dXJuIG5ldyAoUCB8fCAoUCA9IFByb21pc2UpKShmdW5jdGlvbiAocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgICAgIGZ1bmN0aW9uIGZ1bGZpbGxlZCh2YWx1ZSkgeyB0cnkgeyBzdGVwKGdlbmVyYXRvci5uZXh0KHZhbHVlKSk7IH0gY2F0Y2ggKGUpIHsgcmVqZWN0KGUpOyB9IH1cbiAgICAgICAgZnVuY3Rpb24gcmVqZWN0ZWQodmFsdWUpIHsgdHJ5IHsgc3RlcChnZW5lcmF0b3JbXCJ0aHJvd1wiXSh2YWx1ZSkpOyB9IGNhdGNoIChlKSB7IHJlamVjdChlKTsgfSB9XG4gICAgICAgIGZ1bmN0aW9uIHN0ZXAocmVzdWx0KSB7IHJlc3VsdC5kb25lID8gcmVzb2x2ZShyZXN1bHQudmFsdWUpIDogbmV3IFAoZnVuY3Rpb24gKHJlc29sdmUpIHsgcmVzb2x2ZShyZXN1bHQudmFsdWUpOyB9KS50aGVuKGZ1bGZpbGxlZCwgcmVqZWN0ZWQpOyB9XG4gICAgICAgIHN0ZXAoKGdlbmVyYXRvciA9IGdlbmVyYXRvci5hcHBseSh0aGlzQXJnLCBfYXJndW1lbnRzIHx8IFtdKSkubmV4dCgpKTtcbiAgICB9KTtcbn07XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG4vKipcbiAqIERpc3BsYXkgZGF0YSB1bmRlciB0YWJsZVxuICovXG5jbGFzcyBUYWJsZURhdGEge1xuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICB0aGlzLl9tYXAgPSB7fTtcbiAgICAgICAgdGhpcy5fbGlzdCA9IFtdO1xuICAgICAgICB0aGlzLl9pc0Nvbm5lY3QgPSBmYWxzZTtcbiAgICAgICAgdGhpcy5fY29ubmVjdFN0YXR1cyA9IFwiXCI7XG4gICAgICAgIHRoaXMuX2lzRmV0Y2hlZCA9IGZhbHNlO1xuICAgICAgICB0aGlzLl9kYlVSTCA9IFwiXCI7XG4gICAgfVxuICAgIGdldERhdGEoKSB7XG4gICAgICAgIHJldHVybiBfX2F3YWl0ZXIodGhpcywgdm9pZCAwLCB2b2lkIDAsIGZ1bmN0aW9uKiAoKSB7XG4gICAgICAgICAgICBsZXQgcmVzID0geWllbGQgZmV0Y2godGhpcy5fZGJVUkwsIHsgbWV0aG9kOiBcIkdFVFwiLCBjcmVkZW50aWFsczogJ2luY2x1ZGUnIH0pO1xuICAgICAgICAgICAgaWYgKCFyZXMub2spIHtcbiAgICAgICAgICAgICAgICB0aGlzLl9pc0Nvbm5lY3QgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICB0aGlzLl9jb25uZWN0U3RhdHVzID0gcmVzLnN0YXR1c1RleHQ7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5faXNDb25uZWN0ID0gdHJ1ZTtcbiAgICAgICAgICAgIHRoaXMuX2Nvbm5lY3RTdGF0dXMgPSBcIlwiO1xuICAgICAgICAgICAgbGV0IGpzb24gPSB5aWVsZCByZXMuanNvbigpO1xuICAgICAgICAgICAgaWYgKCEhanNvbi5lcnIpIHtcbiAgICAgICAgICAgICAgICB0aGlzLl9pc0ZldGNoZWQgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICB0aGlzLl9jb25uZWN0U3RhdHVzID0ganNvbi5tc2c7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5faXNGZXRjaGVkID0gdHJ1ZTtcbiAgICAgICAgICAgIHRoaXMuX2Nvbm5lY3RTdGF0dXMgPSBcIk9LXCI7XG4gICAgICAgICAgICB0aGlzLl9saXN0ID0ganNvbi5kYXRhO1xuICAgICAgICB9KTtcbiAgICB9XG4gICAgZ2V0IHRhYmxlKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fbWFwO1xuICAgIH1cbiAgICBnZXQgbGlzdCgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2xpc3Q7XG4gICAgfVxufVxuZXhwb3J0cy5kZWZhdWx0ID0gVGFibGVEYXRhO1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9aW5kZXguanMubWFwIiwiXCJ1c2Ugc3RyaWN0XCI7XG52YXIgX19hd2FpdGVyID0gKHRoaXMgJiYgdGhpcy5fX2F3YWl0ZXIpIHx8IGZ1bmN0aW9uICh0aGlzQXJnLCBfYXJndW1lbnRzLCBQLCBnZW5lcmF0b3IpIHtcbiAgICByZXR1cm4gbmV3IChQIHx8IChQID0gUHJvbWlzZSkpKGZ1bmN0aW9uIChyZXNvbHZlLCByZWplY3QpIHtcbiAgICAgICAgZnVuY3Rpb24gZnVsZmlsbGVkKHZhbHVlKSB7IHRyeSB7IHN0ZXAoZ2VuZXJhdG9yLm5leHQodmFsdWUpKTsgfSBjYXRjaCAoZSkgeyByZWplY3QoZSk7IH0gfVxuICAgICAgICBmdW5jdGlvbiByZWplY3RlZCh2YWx1ZSkgeyB0cnkgeyBzdGVwKGdlbmVyYXRvcltcInRocm93XCJdKHZhbHVlKSk7IH0gY2F0Y2ggKGUpIHsgcmVqZWN0KGUpOyB9IH1cbiAgICAgICAgZnVuY3Rpb24gc3RlcChyZXN1bHQpIHsgcmVzdWx0LmRvbmUgPyByZXNvbHZlKHJlc3VsdC52YWx1ZSkgOiBuZXcgUChmdW5jdGlvbiAocmVzb2x2ZSkgeyByZXNvbHZlKHJlc3VsdC52YWx1ZSk7IH0pLnRoZW4oZnVsZmlsbGVkLCByZWplY3RlZCk7IH1cbiAgICAgICAgc3RlcCgoZ2VuZXJhdG9yID0gZ2VuZXJhdG9yLmFwcGx5KHRoaXNBcmcsIF9hcmd1bWVudHMgfHwgW10pKS5uZXh0KCkpO1xuICAgIH0pO1xufTtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmNvbnN0IFRhYmxlRGF0YV8xID0gcmVxdWlyZShcIi4uL1RhYmxlRGF0YVwiKTtcbmNsYXNzIEJhbmdUaHVvYyBleHRlbmRzIFRhYmxlRGF0YV8xLmRlZmF1bHQge1xuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICBzdXBlcigpO1xuICAgICAgICB0aGlzLl9kYlVSTCA9IFwiL2FwaS90aHVvYy9cIjtcbiAgICB9XG4gICAgdXBkYXRlKCkge1xuICAgICAgICByZXR1cm4gX19hd2FpdGVyKHRoaXMsIHZvaWQgMCwgdm9pZCAwLCBmdW5jdGlvbiogKCkge1xuICAgICAgICAgICAgeWllbGQgdGhpcy5nZXREYXRhKCk7XG4gICAgICAgICAgICBmb3IgKGxldCByb3cgb2YgdGhpcy5fbGlzdCkge1xuICAgICAgICAgICAgICAgIGxldCBpZCA9IHJvd1snaWQnXTtcbiAgICAgICAgICAgICAgICB0aGlzLl9tYXBbaWRdID0gcm93O1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9XG59XG5leHBvcnRzLkJhbmdUaHVvYyA9IEJhbmdUaHVvYztcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPUJhbmdUaHVvYy5qcy5tYXAiLCJcInVzZSBzdHJpY3RcIjtcbnZhciBfX2F3YWl0ZXIgPSAodGhpcyAmJiB0aGlzLl9fYXdhaXRlcikgfHwgZnVuY3Rpb24gKHRoaXNBcmcsIF9hcmd1bWVudHMsIFAsIGdlbmVyYXRvcikge1xuICAgIHJldHVybiBuZXcgKFAgfHwgKFAgPSBQcm9taXNlKSkoZnVuY3Rpb24gKHJlc29sdmUsIHJlamVjdCkge1xuICAgICAgICBmdW5jdGlvbiBmdWxmaWxsZWQodmFsdWUpIHsgdHJ5IHsgc3RlcChnZW5lcmF0b3IubmV4dCh2YWx1ZSkpOyB9IGNhdGNoIChlKSB7IHJlamVjdChlKTsgfSB9XG4gICAgICAgIGZ1bmN0aW9uIHJlamVjdGVkKHZhbHVlKSB7IHRyeSB7IHN0ZXAoZ2VuZXJhdG9yW1widGhyb3dcIl0odmFsdWUpKTsgfSBjYXRjaCAoZSkgeyByZWplY3QoZSk7IH0gfVxuICAgICAgICBmdW5jdGlvbiBzdGVwKHJlc3VsdCkgeyByZXN1bHQuZG9uZSA/IHJlc29sdmUocmVzdWx0LnZhbHVlKSA6IG5ldyBQKGZ1bmN0aW9uIChyZXNvbHZlKSB7IHJlc29sdmUocmVzdWx0LnZhbHVlKTsgfSkudGhlbihmdWxmaWxsZWQsIHJlamVjdGVkKTsgfVxuICAgICAgICBzdGVwKChnZW5lcmF0b3IgPSBnZW5lcmF0b3IuYXBwbHkodGhpc0FyZywgX2FyZ3VtZW50cyB8fCBbXSkpLm5leHQoKSk7XG4gICAgfSk7XG59O1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuY29uc3QgTW9kZWxDbGFzc18xID0gcmVxdWlyZShcIi4uL01vZGVsQ2xhc3NcIik7XG5jb25zdCBCYW5nVGh1b2NfMSA9IHJlcXVpcmUoXCIuL0JhbmdUaHVvY1wiKTtcbmV4cG9ydHMuQmFuZ1RodW9jID0gQmFuZ1RodW9jXzEuQmFuZ1RodW9jO1xuY2xhc3MgVGh1b2MgZXh0ZW5kcyBNb2RlbENsYXNzXzEuTW9kZWwge1xuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICBzdXBlcigpO1xuICAgICAgICB0aGlzLmRhdGFiYXNlID0gXCIvYXBpL3RodW9jL1wiO1xuICAgIH1cbiAgICBnZXQocGFyYW1zLCBvZmZzZXQsIGxpbWl0KSB7XG4gICAgICAgIHJldHVybiBfX2F3YWl0ZXIodGhpcywgdm9pZCAwLCB2b2lkIDAsIGZ1bmN0aW9uKiAoKSB7XG4gICAgICAgICAgICByZXR1cm4geWllbGQgdGhpcy5fZ2V0KHsgcTogcGFyYW1zLCBvZmZzZXQsIGxpbWl0IH0pO1xuICAgICAgICB9KTtcbiAgICB9XG4gICAgY3JlYXRlKGRhdGEpIHtcbiAgICAgICAgcmV0dXJuIF9fYXdhaXRlcih0aGlzLCB2b2lkIDAsIHZvaWQgMCwgZnVuY3Rpb24qICgpIHtcbiAgICAgICAgICAgIHRoaXMucmVzID0geWllbGQgdGhpcy5fcG9zdChkYXRhKTtcbiAgICAgICAgICAgIHJldHVybiAodGhpcy5yZXMpO1xuICAgICAgICB9KTtcbiAgICB9XG4gICAgYWRkKG1hLCBzb0x1b25nLCB0b25nR2lhKSB7XG4gICAgICAgIHJldHVybiBfX2F3YWl0ZXIodGhpcywgdm9pZCAwLCB2b2lkIDAsIGZ1bmN0aW9uKiAoKSB7XG4gICAgICAgICAgICB0aGlzLnJlcyA9IHlpZWxkIHRoaXMuX3Bvc3Qoe1xuICAgICAgICAgICAgICAgIG1hLFxuICAgICAgICAgICAgICAgIHNvX2x1b25nOiBzb0x1b25nLFxuICAgICAgICAgICAgICAgIHRvbmdfZ2lhOiB0b25nR2lhLFxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5yZXM7XG4gICAgICAgIH0pO1xuICAgIH1cbn1cbmV4cG9ydHMuVGh1b2MgPSBUaHVvYztcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWluZGV4LmpzLm1hcCIsIlwidXNlIHN0cmljdFwiO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuY29uc3QgVGh1b2NfMSA9IHJlcXVpcmUoXCIuLi9Nb2RlbC9UaHVvY1wiKTtcbmNvbnN0IFZpZXdUYWJsZV8xID0gcmVxdWlyZShcIi4vVmlld1RhYmxlXCIpO1xuY29uc3QgTWVudUNvbnRleHRfMSA9IHJlcXVpcmUoXCIuLi9NZW51Q29udGV4dFwiKTtcbmNsYXNzIFRodW9jVGFibGUgZXh0ZW5kcyBWaWV3VGFibGVfMS5WaWV3VGFibGUge1xuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICBzdXBlcigpO1xuICAgICAgICB0aGlzLmVsZW1lbnQgPSAkKFwiPHRhYmxlLz5cIikuYWRkQ2xhc3MoXCJ0YWJsZSB0YWJsZS1zdHJpcGVkIHRhYmxlLXZpZXdcIik7XG4gICAgICAgIHRoaXMuZWxlbWVudC5odG1sKGBcbiAgICAgICAgPHRoZWFkPlxuICAgICAgICAgICAgPHRyPlxuICAgICAgICAgICAgICAgIDx0aD5NYSBUaHVvYzwvdGg+XG4gICAgICAgICAgICAgICAgPHRoPlRlbiBUaHVvYzwvdGg+XG4gICAgICAgICAgICA8L3RyPlxuICAgICAgICA8L3RoZWFkPlxuICAgICAgICA8dGJvZHk+PC90Ym9keT5cbiAgICAgICAgYCk7XG4gICAgICAgIHRoaXMubW9kZWwgPSBuZXcgVGh1b2NfMS5UaHVvYygpO1xuICAgIH1cbiAgICBvbkNvbnRleHRBZGQoZnVuYykge1xuICAgICAgICB0aGlzLmZ1bmNDdHhBZGQgPSBmdW5jO1xuICAgIH1cbiAgICBvbkNvbnRleHRFZGl0KGZ1bmMpIHtcbiAgICAgICAgdGhpcy5mdW5jQ3R4RWRpdCA9IGZ1bmM7XG4gICAgfVxuICAgIG9uQ29udGV4dEVkaXRQcmljZShmdW5jKSB7XG4gICAgICAgIHRoaXMuZnVuY0N0eEVkaXRQcmljZSA9IGZ1bmM7XG4gICAgfVxuICAgIGN1c3RvbUNyZWF0ZVJvdyhyb3cpIHtcbiAgICAgICAgY29uc3QgY29udGV4dG1lbnUgPSBuZXcgTWVudUNvbnRleHRfMS5NZW51Q29udGV4dChyb3cpO1xuICAgICAgICBjb250ZXh0bWVudS5hZGRDb250ZXh0KHtcbiAgICAgICAgICAgIHRpdGxlOiBcIm5o4bqtcCB0aMOqbSB0aHXhu5FjXCIsXG4gICAgICAgICAgICBjbGFzc05hbWU6IFwidGV4dC1zdWNjZXNzXCIsXG4gICAgICAgICAgICBpY29uOiBcImZhcyBmYS1wbHVzLWNpcmNsZVwiLFxuICAgICAgICAgICAgY2xpY2s6IChlKSA9PiB7XG4gICAgICAgICAgICAgICAgdGhpcy5mdW5jQ3R4QWRkKCk7XG4gICAgICAgICAgICB9LFxuICAgICAgICB9KS5hZGRDb250ZXh0KHtcbiAgICAgICAgICAgIHRpdGxlOiBcInPhu61hIHRow7RuZyB0aW5cIixcbiAgICAgICAgICAgIGNsYXNzTmFtZTogXCJ0ZXh0LXByaW1hcnlcIixcbiAgICAgICAgICAgIGljb246IFwiZmFzIGZhLXBlbi1zcXVhcmVcIixcbiAgICAgICAgICAgIGNsaWNrOiAoZSkgPT4ge1xuICAgICAgICAgICAgICAgIHRoaXMuZnVuY0N0eEVkaXQoKTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgIH0pLmFkZENvbnRleHQoe1xuICAgICAgICAgICAgdGl0bGU6IFwiY2jhu4luaCBnacOhXCIsXG4gICAgICAgICAgICBpY29uOiBcImZhIGZhLWRvbGxhci1zaWduXCIsXG4gICAgICAgICAgICBjbGljazogKGUpID0+IHtcbiAgICAgICAgICAgICAgICB0aGlzLmZ1bmNDdHhFZGl0UHJpY2UoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfVxufVxuZXhwb3J0cy5UaHVvY1RhYmxlID0gVGh1b2NUYWJsZTtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPVRodW9jVGFibGUuanMubWFwIiwiXCJ1c2Ugc3RyaWN0XCI7XG52YXIgX19hd2FpdGVyID0gKHRoaXMgJiYgdGhpcy5fX2F3YWl0ZXIpIHx8IGZ1bmN0aW9uICh0aGlzQXJnLCBfYXJndW1lbnRzLCBQLCBnZW5lcmF0b3IpIHtcbiAgICByZXR1cm4gbmV3IChQIHx8IChQID0gUHJvbWlzZSkpKGZ1bmN0aW9uIChyZXNvbHZlLCByZWplY3QpIHtcbiAgICAgICAgZnVuY3Rpb24gZnVsZmlsbGVkKHZhbHVlKSB7IHRyeSB7IHN0ZXAoZ2VuZXJhdG9yLm5leHQodmFsdWUpKTsgfSBjYXRjaCAoZSkgeyByZWplY3QoZSk7IH0gfVxuICAgICAgICBmdW5jdGlvbiByZWplY3RlZCh2YWx1ZSkgeyB0cnkgeyBzdGVwKGdlbmVyYXRvcltcInRocm93XCJdKHZhbHVlKSk7IH0gY2F0Y2ggKGUpIHsgcmVqZWN0KGUpOyB9IH1cbiAgICAgICAgZnVuY3Rpb24gc3RlcChyZXN1bHQpIHsgcmVzdWx0LmRvbmUgPyByZXNvbHZlKHJlc3VsdC52YWx1ZSkgOiBuZXcgUChmdW5jdGlvbiAocmVzb2x2ZSkgeyByZXNvbHZlKHJlc3VsdC52YWx1ZSk7IH0pLnRoZW4oZnVsZmlsbGVkLCByZWplY3RlZCk7IH1cbiAgICAgICAgc3RlcCgoZ2VuZXJhdG9yID0gZ2VuZXJhdG9yLmFwcGx5KHRoaXNBcmcsIF9hcmd1bWVudHMgfHwgW10pKS5uZXh0KCkpO1xuICAgIH0pO1xufTtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmNsYXNzIFZpZXdUYWJsZSB7XG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIC8vIGNvbnN0cnVjdFxuICAgICAgICB0aGlzLm9mZnNldCA9IDA7XG4gICAgICAgIHRoaXMubGltaXQgPSAxMDtcbiAgICB9XG4gICAgLyoqXG4gICAgICogZ2V0IGRhdGEgd2l0aCBzZWFyY2ggdmFsdWVcbiAgICAgKiBAcGFyYW0gc2VhcmNoIGZpZWxkPXZhbHVlXG4gICAgICovXG4gICAgdXBkYXRlKHNlYXJjaCkge1xuICAgICAgICByZXR1cm4gX19hd2FpdGVyKHRoaXMsIHZvaWQgMCwgdm9pZCAwLCBmdW5jdGlvbiogKCkge1xuICAgICAgICAgICAgLy8gcmVuZGVyIGRhdGEgdG8gZWxlbWVudFxuICAgICAgICAgICAgY29uc3QgcmF3RGF0YSA9IHlpZWxkIHRoaXMubW9kZWwuZ2V0KHNlYXJjaCwgdGhpcy5vZmZzZXQsIHRoaXMubGltaXQpO1xuICAgICAgICAgICAgdGhpcy5kYXRhID0gQXJyYXkuZnJvbShyYXdEYXRhKS5tYXAoKHZhbCkgPT4ge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmZpbHRlckRhdGFSb3codmFsKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgdGhpcy5zaXplT2ZSZWNvcmQgPSB0aGlzLmRhdGEubGVuZ3RoO1xuICAgICAgICAgICAgdGhpcy5jdXJyZW50UG9zID0gLTE7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5kYXRhO1xuICAgICAgICB9KTtcbiAgICB9XG4gICAgcmVuZGVyKHNlYXJjaCkge1xuICAgICAgICByZXR1cm4gX19hd2FpdGVyKHRoaXMsIHZvaWQgMCwgdm9pZCAwLCBmdW5jdGlvbiogKCkge1xuICAgICAgICAgICAgY29uc3QgZGF0YSA9IHlpZWxkIHRoaXMudXBkYXRlKHNlYXJjaCk7XG4gICAgICAgICAgICBjb25zdCB0Ym9keSA9IHRoaXMuX2NyZWF0ZVRhYmxlQm9keShkYXRhKTtcbiAgICAgICAgICAgIHRoaXMuZWxlbWVudC5maW5kKFwidGJvZHlcIikuaHRtbChcIlwiKS5hcHBlbmQodGJvZHkuY2hpbGRyZW4oKSk7XG4gICAgICAgIH0pO1xuICAgIH1cbiAgICBzZXRFbGVtZW50KGVsKSB7XG4gICAgICAgIHRoaXMuZWxlbWVudCA9IGVsO1xuICAgIH1cbiAgICBnZXRFbGVtZW50KCkge1xuICAgICAgICByZXR1cm4gdGhpcy5lbGVtZW50O1xuICAgIH1cbiAgICBjdXJyZW50RGF0YSgpIHtcbiAgICAgICAgaWYgKCF0aGlzLmN1cnJlbnRSb3dEYXRhKSB7XG4gICAgICAgICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBPYmplY3QuYXNzaWduKHt9LCB0aGlzLmN1cnJlbnRSb3dEYXRhKTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogYXR0YWNoIGV2ZW50IG9mIGNob29zZVxuICAgICAqIEBwYXJhbSBjYWxsYmFjayBjYWxsYmFjayBmdW5jdGlvbiB3aGVuIHRoZSByb3cgb2YgcmVjb3JkIGlzIGNob29zZWRcbiAgICAgKi9cbiAgICBvbkNob29zZShjYWxsYmFjaykge1xuICAgICAgICB0aGlzLmZ1bmNPbkNob29zZSA9IGNhbGxiYWNrO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBhdHRhY2ggZXZlbnQgb2YgaG92ZXJcbiAgICAgKiBAcGFyYW0gY2FsbGJhY2sgY2FsbGJhY2sgZnVuY3Rpb24gd2hlbiB0aGUgcm93IG9mIHJlY29yZCBpcyBob3ZlciBvblxuICAgICAqL1xuICAgIG9uRm9jdXMoY2FsbGJhY2spIHtcbiAgICAgICAgdGhpcy5mdW5jT25Gb2N1cyA9IGNhbGxiYWNrO1xuICAgIH1cbiAgICBzZWxlY3REb3duKCkge1xuICAgICAgICBpZiAodGhpcy5jdXJyZW50UG9zIDwgdGhpcy5zaXplT2ZSZWNvcmQgLSAxKSB7XG4gICAgICAgICAgICArK3RoaXMuY3VycmVudFBvcztcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmVsZW1lbnQuZmluZChgdHJbZGF0YS1wb3M9JHt0aGlzLmN1cnJlbnRQb3N9XWApLmZvY3VzKCk7XG4gICAgfVxuICAgIHNlbGVjdFVwKCkge1xuICAgICAgICBpZiAodGhpcy5jdXJyZW50UG9zID4gMCkge1xuICAgICAgICAgICAgLS10aGlzLmN1cnJlbnRQb3M7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5lbGVtZW50LmZpbmQoYHRyW2RhdGEtcG9zPSR7dGhpcy5jdXJyZW50UG9zfV1gKS5mb2N1cygpO1xuICAgIH1cbiAgICBuZXh0UGFnZShzZWFyY2ggPSBcIlwiKSB7XG4gICAgICAgIHRoaXMub2Zmc2V0ICs9IHRoaXMubGltaXQ7XG4gICAgICAgIHRoaXMucmVuZGVyKHNlYXJjaCk7XG4gICAgfVxuICAgIHNldExpbWl0UGVyUGFnZShsaW1pdCkge1xuICAgICAgICB0aGlzLmxpbWl0ID0gbGltaXQ7XG4gICAgfVxuICAgIHNldE9mZnNldChvZmZzZXQpIHtcbiAgICAgICAgdGhpcy5vZmZzZXQgPSBvZmZzZXQ7XG4gICAgfVxuICAgIGZpbHRlckRhdGFSb3coZGF0YVJvdykge1xuICAgICAgICAvLyBub3RoaW5nIGhlcmUsIGp1c3QgcmF3XG4gICAgICAgIHJldHVybiBkYXRhUm93O1xuICAgIH1cbiAgICBfY3JlYXRlUm93KGRhdGFSb3csIHBvcykge1xuICAgICAgICBjb25zdCByb3cgPSAkKFwiPHRyLz5cIikuYXR0cihcInRhYmluZGV4XCIsIC0xKS5hdHRyKFwiZGF0YS1wb3NcIiwgcG9zKTtcbiAgICAgICAgZm9yIChjb25zdCBmaWVsZCBvZiBPYmplY3Qua2V5cyhkYXRhUm93KSkge1xuICAgICAgICAgICAgY29uc3QgY2VsbCA9ICQoXCI8dGQvPlwiKS5hdHRyKFwibmFtZVwiLCBmaWVsZCkudGV4dChkYXRhUm93W2ZpZWxkXSk7XG4gICAgICAgICAgICByb3cuYXBwZW5kKGNlbGwpO1xuICAgICAgICB9XG4gICAgICAgIC8vIGNob29zZSBldmVudFxuICAgICAgICB0aGlzLl9yb3dPbkNob29zZShyb3csICgpID0+IHtcbiAgICAgICAgICAgIHRoaXMuZnVuY09uQ2hvb3NlKGRhdGFSb3cpO1xuICAgICAgICB9KTtcbiAgICAgICAgLy8gaG92ZXIgZXZlbnRcbiAgICAgICAgcm93Lm9uKFwiY2xpY2sgZm9jdXNcIiwgKGUpID0+IHtcbiAgICAgICAgICAgIHRoaXMuZWxlbWVudC5maW5kKFwidHJcIikucmVtb3ZlQ2xhc3MoXCJhY3RpdmVcIik7XG4gICAgICAgICAgICByb3cuYWRkQ2xhc3MoXCJhY3RpdmVcIik7XG4gICAgICAgICAgICB0aGlzLmN1cnJlbnRQb3MgPSBwb3M7XG4gICAgICAgICAgICB0aGlzLmN1cnJlbnRSb3dEYXRhID0gZGF0YVJvdztcbiAgICAgICAgICAgIHRoaXMuZnVuY09uRm9jdXMoZGF0YVJvdyk7XG4gICAgICAgIH0pO1xuICAgICAgICB0aGlzLmN1c3RvbUNyZWF0ZVJvdyhyb3cpO1xuICAgICAgICByZXR1cm4gcm93O1xuICAgIH1cbiAgICBfY3JlYXRlVGFibGVCb2R5KGRhdGEpIHtcbiAgICAgICAgY29uc3QgdGJvZHkgPSAkKFwiPHRib2R5Lz5cIik7XG4gICAgICAgIGxldCBwb3MgPSAwO1xuICAgICAgICBmb3IgKGNvbnN0IHJvd0RhdGEgb2YgZGF0YSkge1xuICAgICAgICAgICAgY29uc3QgdHJvdyA9IHRoaXMuX2NyZWF0ZVJvdyhyb3dEYXRhLCBwb3MrKyk7XG4gICAgICAgICAgICB0Ym9keS5hcHBlbmQodHJvdyk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRib2R5O1xuICAgIH1cbiAgICBjdXN0b21DcmVhdGVSb3cocm93KSB7XG4gICAgICAgIC8vIG5vdGhpbmcgaGVyZSwgd2lsbCBjaGFuZ2UgaW4gaW5oZXJpdGFuY2VcbiAgICB9XG4gICAgX3Jvd09uQ2hvb3NlKHJvdywgY2FsbGJhY2spIHtcbiAgICAgICAgcm93Lm9uKFwia2V5ZG93blwiLCAoZSkgPT4ge1xuICAgICAgICAgICAgaWYgKGUua2V5Q29kZSA9PT0gMTMpIHtcbiAgICAgICAgICAgICAgICBjYWxsYmFjaygpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgcm93Lm9uKFwiZGJsY2xpY2tcIiwgKCkgPT4ge1xuICAgICAgICAgICAgY2FsbGJhY2soKTtcbiAgICAgICAgfSk7XG4gICAgfVxufVxuZXhwb3J0cy5WaWV3VGFibGUgPSBWaWV3VGFibGU7XG4vLyMgc291cmNlTWFwcGluZ1VSTD1WaWV3VGFibGUuanMubWFwIiwiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5mdW5jdGlvbiBnZXRGb3JtVmFsdWUoZm9ybSkge1xuICAgIGNvbnN0IGFyciA9IGZvcm0uc2VyaWFsaXplQXJyYXkoKTtcbiAgICBjb25zdCB2YWwgPSB7fTtcbiAgICBmb3IgKGNvbnN0IGlucHV0IG9mIGFycikge1xuICAgICAgICB2YWxbaW5wdXQubmFtZV0gPSBpbnB1dC52YWx1ZTtcbiAgICB9XG4gICAgcmV0dXJuIHZhbDtcbn1cbmV4cG9ydHMuZ2V0Rm9ybVZhbHVlID0gZ2V0Rm9ybVZhbHVlO1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9Zm9ybVZhbC5qcy5tYXAiLCJcInVzZSBzdHJpY3RcIjtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmNvbnN0IEF1dG9Db21wbGV0ZV8xID0gcmVxdWlyZShcIi4uL0F1dG9Db21wbGV0ZVwiKTtcbmZ1bmN0aW9uIGluaXQoYXBwKSB7XG4gICAgY29uc3QgYXV0b2NvbXBsZXRlID0gbmV3IEF1dG9Db21wbGV0ZV8xLkF1dG9Db21wbGV0ZShcIm5oYXBfaG9hX2Rvbi0tdGVuX3RodW9jXCIsIGFwcC50aHVvYyk7XG4gICAgYXV0b2NvbXBsZXRlLnNldExvb2t1cChbXCJtYVwiLCBcInRlblwiLCBcIm5jY1wiLCBcImRvbl92aVwiLCBcImRvbl9naWFcIl0pO1xuICAgIGF1dG9jb21wbGV0ZS5saXN0ZW4oKTtcbiAgICBhdXRvY29tcGxldGUub25DaG9vc2UoKGRhdGEpID0+IHtcbiAgICAgICAgJChcIiNuaGFwX2hvYV9kb24tLW1hX3RodW9jXCIpLnZhbChkYXRhLm1hKTtcbiAgICAgICAgJChcIiNuaGFwX2hvYV9kb24tLXRlbl90aHVvY1wiKS52YWwoZGF0YS50ZW4pO1xuICAgICAgICAkKFwiI25oYXBfaG9hX2Rvbi0tbmNjXCIpLnZhbChkYXRhLm5jYyk7XG4gICAgICAgICQoXCIjbmhhcF9ob2FfZG9uLS1naWFcIikudmFsKGRhdGEuZG9uX2dpYSk7XG4gICAgICAgICQoXCIjbmhhcF9ob2FfZG9uLS1kb25fdmlcIikudmFsKGRhdGEuZG9uX3ZpKTtcbiAgICB9KTtcbn1cbmV4cG9ydHMuaW5pdCA9IGluaXQ7XG4vLyMgc291cmNlTWFwcGluZ1VSTD1pbmRleC5qcy5tYXAiLCJcInVzZSBzdHJpY3RcIjtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmNvbnN0IFRodW9jVGFibGVfMSA9IHJlcXVpcmUoXCIuLi9WaWV3L1RodW9jVGFibGVcIik7XG5jb25zdCB0aHVvY19tb2RhbF8xID0gcmVxdWlyZShcIi4vdGh1b2MtbW9kYWxcIik7XG5jb25zdCBQQUdFX0lEID0gXCJwYWdlLW5oYXAtdGh1b2NcIjtcbmNsYXNzIEluaXQge1xuICAgIGNvbnN0cnVjdG9yKGFwcCkge1xuICAgICAgICBjb25zdCB0aHVvY1RhYmxlID0gbmV3IFRodW9jVGFibGVfMS5UaHVvY1RhYmxlKCk7XG4gICAgICAgIHRoaXMudGh1b2NUYWJsZSA9IHRodW9jVGFibGU7XG4gICAgICAgIHRoaXMuYXBwID0gYXBwO1xuICAgICAgICB0aHVvY1RhYmxlLnNldEVsZW1lbnQoJChcIiNuaGFwX3RodW9jLS10YWJsZVwiKSk7XG4gICAgICAgIHRodW9jVGFibGUuc2V0TGltaXRQZXJQYWdlKDEwMCk7XG4gICAgICAgIHRodW9jVGFibGUub25DaG9vc2UoKGRhdGEpID0+IHtcbiAgICAgICAgICAgIHRoaXMuYWRkVGh1b2MoZGF0YSk7XG4gICAgICAgIH0pO1xuICAgICAgICB0aHVvY1RhYmxlLm9uRm9jdXMoKGRhdGEpID0+IHtcbiAgICAgICAgICAgICQoXCIudGh1b2MtLWJ1dHRvblwiKS5yZW1vdmVBdHRyKFwiZGlzYWJsZWRcIik7XG4gICAgICAgIH0pO1xuICAgICAgICB0aHVvY1RhYmxlLm9uQ29udGV4dEFkZCgoKSA9PiB7XG4gICAgICAgICAgICB0aGlzLmFkZFRodW9jKHRodW9jVGFibGUuY3VycmVudERhdGEoKSk7XG4gICAgICAgIH0pO1xuICAgICAgICB0aHVvY1RhYmxlLm9uQ29udGV4dEVkaXQoKCkgPT4ge1xuICAgICAgICAgICAgdGhpcy5lZGl0VGh1b2ModGh1b2NUYWJsZS5jdXJyZW50RGF0YSgpKTtcbiAgICAgICAgfSk7XG4gICAgICAgIHRodW9jVGFibGUub25Db250ZXh0RWRpdFByaWNlKCgpID0+IHtcbiAgICAgICAgICAgIHRoaXMuZWRpdFByaWNlVGh1b2ModGh1b2NUYWJsZS5jdXJyZW50RGF0YSgpKTtcbiAgICAgICAgfSk7XG4gICAgICAgIHRodW9jVGFibGUucmVuZGVyKFwiXCIpO1xuICAgICAgICB0aGlzLmhhbmRsZUNvbnRyb2xLZXkoYXBwKTtcbiAgICAgICAgdGhpcy5oYW5kbGVTZWxlY3RLZXkoYXBwKTtcbiAgICAgICAgdGhpcy5oYW5kbGVNb2RhbEV2ZW50KCk7XG4gICAgICAgIHRoaXMuaGFuZGxlU2VhcmNoSW5wdXQoKTtcbiAgICAgICAgY29uc3QgJHRoaXMgPSB0aGlzO1xuICAgICAgICAkKFwiLnRodW9jLS1idXR0b25cIikub24oXCJjbGlja1wiLCBmdW5jdGlvbiBCdXR0b25DbGljaygpIHtcbiAgICAgICAgICAgIGNvbnN0IHJvbGUgPSAkKHRoaXMpLmF0dHIoXCJhcHAtcm9sZVwiKTtcbiAgICAgICAgICAgIHN3aXRjaCAocm9sZSkge1xuICAgICAgICAgICAgICAgIGNhc2UgXCJuZXdcIjpcbiAgICAgICAgICAgICAgICAgICAgJHRoaXMubmV3VGh1b2MoKTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgY2FzZSBcImVkaXRcIjpcbiAgICAgICAgICAgICAgICAgICAgJHRoaXMuZWRpdFRodW9jKHRodW9jVGFibGUuY3VycmVudERhdGEoKSk7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGNhc2UgXCJhZGRcIjpcbiAgICAgICAgICAgICAgICAgICAgJHRoaXMuYWRkVGh1b2ModGh1b2NUYWJsZS5jdXJyZW50RGF0YSgpKTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgY2FzZSBcImNoaW5oLWdpYVwiOlxuICAgICAgICAgICAgICAgICAgICAkdGhpcy5lZGl0UHJpY2VUaHVvYyh0aHVvY1RhYmxlLmN1cnJlbnREYXRhKCkpO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfVxuICAgIGhhbmRsZVNlbGVjdEtleShhcHApIHtcbiAgICAgICAgYXBwLm9uU2hvcnRjdXRLZXkoXCJBcnJvd1VwXCIsIFBBR0VfSUQsIChlKSA9PiB7XG4gICAgICAgICAgICB0aGlzLnRodW9jVGFibGUuc2VsZWN0VXAoKTtcbiAgICAgICAgfSk7XG4gICAgICAgIGFwcC5vblNob3J0Y3V0S2V5KFwiQXJyb3dEb3duXCIsIFBBR0VfSUQsIChlKSA9PiB7XG4gICAgICAgICAgICB0aGlzLnRodW9jVGFibGUuc2VsZWN0RG93bigpO1xuICAgICAgICB9KTtcbiAgICB9XG4gICAgaGFuZGxlQ29udHJvbEtleShhcHApIHtcbiAgICAgICAgYXBwLm9uU2hvcnRjdXRLZXkoXCJjdHJsK2RcIiwgUEFHRV9JRCwgKGUpID0+IHtcbiAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgIHRoaXMubmV3VGh1b2MoKTtcbiAgICAgICAgfSk7XG4gICAgICAgIGFwcC5vblNob3J0Y3V0S2V5KFwiY3RybCtlXCIsIFBBR0VfSUQsIChlKSA9PiB7XG4gICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICB0aGlzLmVkaXRUaHVvYyh0aGlzLnRodW9jVGFibGUuY3VycmVudERhdGEoKSk7XG4gICAgICAgIH0pO1xuICAgICAgICBhcHAub25TaG9ydGN1dEtleShcImN0cmwrZ1wiLCBQQUdFX0lELCAoZSkgPT4ge1xuICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgdGhpcy5lZGl0UHJpY2VUaHVvYyh0aGlzLnRodW9jVGFibGUuY3VycmVudERhdGEoKSk7XG4gICAgICAgIH0pO1xuICAgICAgICBhcHAub25TaG9ydGN1dEtleShcImN0cmwrZlwiLCBQQUdFX0lELCAoZSkgPT4ge1xuICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgJChcIiN0aHVvYy0tc2VhcmNoXCIpLmZvY3VzKCk7XG4gICAgICAgIH0pO1xuICAgIH1cbiAgICBoYW5kbGVTZWFyY2hJbnB1dCgpIHtcbiAgICAgICAgY29uc3QgJHRoaXMgPSB0aGlzO1xuICAgICAgICAkKFwiI3RodW9jLS1zZWFyY2hcIikub24oXCJrZXl1cFwiLCBmdW5jdGlvbiBTZWFyY2hpbmcoKSB7XG4gICAgICAgICAgICBjb25zdCB2YWwgPSAkKHRoaXMpLnZhbCgpO1xuICAgICAgICAgICAgJHRoaXMudGh1b2NUYWJsZS5yZW5kZXIodmFsKTtcbiAgICAgICAgfSk7XG4gICAgfVxuICAgIGhhbmRsZU1vZGFsRXZlbnQoKSB7XG4gICAgICAgIHRoaXMuYWRkTW9kYWwgPSBuZXcgdGh1b2NfbW9kYWxfMS5BZGRUaHVvY01vZGFsKFwidGh1b2MtLWFkZC1tb2RhbFwiLCB0aGlzLmFwcCk7XG4gICAgICAgIHRoaXMubmV3TW9kYWwgPSBuZXcgdGh1b2NfbW9kYWxfMS5OZXdUaHVvY01vZGFsKFwidGh1b2MtLW5ldy1tb2RhbFwiLCB0aGlzLmFwcCk7XG4gICAgICAgIHRoaXMuZWRpdE1vZGFsID0gbmV3IHRodW9jX21vZGFsXzEuRWRpdFRodW9jTW9kYWwoXCJ0aHVvYy0tZWRpdC1tb2RhbFwiLCB0aGlzLmFwcC50aHVvYyk7XG4gICAgICAgIHRoaXMuZWRpdFByaWNlTW9kYWwgPSBuZXcgdGh1b2NfbW9kYWxfMS5FZGl0UHJpY2VUaHVvY01vZGFsKFwidGh1b2MtLWVkaXQtcHJpY2UtbW9kYWxcIiwgdGhpcy5hcHAudGh1b2MpO1xuICAgIH1cbiAgICBlZGl0VGh1b2MoZGF0YSkge1xuICAgICAgICBpZiAoIWRhdGEpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICAkKFwiI3RodW9jLS1lZGl0LW1vZGFsXCIpLm1vZGFsKFwic2hvd1wiKTtcbiAgICAgICAgJChcIiN0aHVvYy0tZWRpdC1tYXRodW9jXCIpLnZhbChkYXRhLm1hKTtcbiAgICAgICAgJChcIiN0aHVvYy0tZWRpdC10ZW50aHVvY1wiKS52YWwoZGF0YS50ZW4pO1xuICAgICAgICAkKFwiI3RodW9jLS1lZGl0LW5jY1wiKS52YWwoZGF0YS50ZW5fbmNjKTtcbiAgICB9XG4gICAgbmV3VGh1b2MoKSB7XG4gICAgICAgICQoXCIjdGh1b2MtLW5ldy1tb2RhbFwiKS5tb2RhbChcInNob3dcIik7XG4gICAgfVxuICAgIGFkZFRodW9jKGRhdGEpIHtcbiAgICAgICAgaWYgKCFkYXRhKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgJChcIiN0aHVvYy0tYWRkLW1vZGFsXCIpLm1vZGFsKFwic2hvd1wiKTtcbiAgICAgICAgJChcIiN0aHVvYy0tYWRkLW1hdGh1b2NcIikudmFsKGRhdGEubWEpO1xuICAgICAgICAkKFwiI3RodW9jLS1hZGQtdGVudGh1b2NcIikudmFsKGRhdGEudGVuKTtcbiAgICAgICAgJChcIiN0aHVvYy0tYWRkLW5jY1wiKS52YWwoZGF0YS50ZW5fbmNjKTtcbiAgICAgICAgJChcIiN0aHVvYy0tYWRkLXNvbHVvbmdcIikudmFsKGRhdGEuc29fbHVvbmcpO1xuICAgIH1cbiAgICBlZGl0UHJpY2VUaHVvYyhkYXRhKSB7XG4gICAgICAgIGlmICghZGF0YSkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgICQoXCIjdGh1b2MtLWVkaXQtcHJpY2UtbW9kYWxcIikubW9kYWwoXCJzaG93XCIpO1xuICAgICAgICAkKFwiI3RodW9jLS1lZGl0LXByaWNlLW1hdGh1b2NcIikudmFsKGRhdGEubWEpO1xuICAgICAgICAkKFwiI3RodW9jLS1lZGl0LXByaWNlLXRlbnRodW9jXCIpLnZhbChkYXRhLnRlbik7XG4gICAgfVxufVxuZnVuY3Rpb24gaW5pdChhcHApIHtcbiAgICByZXR1cm4gbmV3IEluaXQoYXBwKTtcbn1cbmV4cG9ydHMuaW5pdCA9IGluaXQ7XG4vLyMgc291cmNlTWFwcGluZ1VSTD1pbmRleC5qcy5tYXAiLCJcInVzZSBzdHJpY3RcIjtcbnZhciBfX2F3YWl0ZXIgPSAodGhpcyAmJiB0aGlzLl9fYXdhaXRlcikgfHwgZnVuY3Rpb24gKHRoaXNBcmcsIF9hcmd1bWVudHMsIFAsIGdlbmVyYXRvcikge1xuICAgIHJldHVybiBuZXcgKFAgfHwgKFAgPSBQcm9taXNlKSkoZnVuY3Rpb24gKHJlc29sdmUsIHJlamVjdCkge1xuICAgICAgICBmdW5jdGlvbiBmdWxmaWxsZWQodmFsdWUpIHsgdHJ5IHsgc3RlcChnZW5lcmF0b3IubmV4dCh2YWx1ZSkpOyB9IGNhdGNoIChlKSB7IHJlamVjdChlKTsgfSB9XG4gICAgICAgIGZ1bmN0aW9uIHJlamVjdGVkKHZhbHVlKSB7IHRyeSB7IHN0ZXAoZ2VuZXJhdG9yW1widGhyb3dcIl0odmFsdWUpKTsgfSBjYXRjaCAoZSkgeyByZWplY3QoZSk7IH0gfVxuICAgICAgICBmdW5jdGlvbiBzdGVwKHJlc3VsdCkgeyByZXN1bHQuZG9uZSA/IHJlc29sdmUocmVzdWx0LnZhbHVlKSA6IG5ldyBQKGZ1bmN0aW9uIChyZXNvbHZlKSB7IHJlc29sdmUocmVzdWx0LnZhbHVlKTsgfSkudGhlbihmdWxmaWxsZWQsIHJlamVjdGVkKTsgfVxuICAgICAgICBzdGVwKChnZW5lcmF0b3IgPSBnZW5lcmF0b3IuYXBwbHkodGhpc0FyZywgX2FyZ3VtZW50cyB8fCBbXSkpLm5leHQoKSk7XG4gICAgfSk7XG59O1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuY2xhc3MgQWRkVGh1b2NNb2RhbCB7XG4gICAgY29uc3RydWN0b3IoaWQsIGFwcCkge1xuICAgICAgICB0aGlzLmFwcCA9IGFwcDtcbiAgICAgICAgdGhpcy5wb3B1cCA9ICQoXCIjXCIgKyBpZCk7XG4gICAgICAgIHRoaXMucG9wdXAubG9hZChcIi9sYXlvdXRzL21vZGFsLWFkZC10aHVvYy5odG1sXCIsICgpID0+IHtcbiAgICAgICAgICAgIHRoaXMucG9wdXAuZmluZChcImZvcm1cIikub24oXCJzdWJtaXRcIiwgKGUpID0+IHtcbiAgICAgICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICAgICAgdGhpcy5mb3JtU3VibWl0SGFuZGxlKGUpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgIH1cbiAgICBmb3JtU3VibWl0SGFuZGxlKGUpIHtcbiAgICAgICAgcmV0dXJuIF9fYXdhaXRlcih0aGlzLCB2b2lkIDAsIHZvaWQgMCwgZnVuY3Rpb24qICgpIHtcbiAgICAgICAgICAgIGNvbnN0IGZvcm0gPSAkKGUudGFyZ2V0KTtcbiAgICAgICAgICAgIGNvbnN0IGRhdGEgPSB7XG4gICAgICAgICAgICAgICAgbWE6IGZvcm0uZmluZChcIltuYW1lPW1hXVwiKS52YWwoKSxcbiAgICAgICAgICAgICAgICBzb19sdW9uZzogK2Zvcm0uZmluZChcIltuYW1lPSdzb19sdW9uZyddXCIpLnZhbCgpLFxuICAgICAgICAgICAgICAgIHRvbmdfZ2lhOiArZm9ybS5maW5kKFwiW25hbWU9J3RvbmdfZ2lhJ11cIikudmFsKCksXG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICBjb25zdCByZXMgPSB5aWVsZCB0aGlzLmFwcC50aHVvYy5hZGQoZGF0YS5tYSwgZGF0YS5zb19sdW9uZywgZGF0YS50b25nX2dpYSk7XG4gICAgICAgICAgICAgICAgYWxlcnQoXCJzdWNjZXNzOiBcIiArIHJlcy5tYSArIFwiPT5cIiArIHJlcy5zb19sdW9uZ19tb2kpO1xuICAgICAgICAgICAgICAgIHdpbmRvdy5sb2NhdGlvbi5yZWxvYWQoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNhdGNoIChlKSB7XG4gICAgICAgICAgICAgICAgYWxlcnQoXCJFcnJvcjogXCIgKyBlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfVxuICAgIHNob3coKSB7XG4gICAgICAgIHRoaXMucG9wdXAubW9kYWwoXCJzaG93XCIpO1xuICAgIH1cbiAgICBoaWRlKCkge1xuICAgICAgICB0aGlzLnBvcHVwLm1vZGFsKFwiaGlkZVwiKTtcbiAgICB9XG59XG5leHBvcnRzLkFkZFRodW9jTW9kYWwgPSBBZGRUaHVvY01vZGFsO1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9dGh1b2MtYWRkLW1vZGFsLmpzLm1hcCIsIlwidXNlIHN0cmljdFwiO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuY2xhc3MgRWRpdFRodW9jTW9kYWwge1xuICAgIGNvbnN0cnVjdG9yKGlkLCBtb2RlbCkge1xuICAgICAgICB0aGlzLm1vZGVsID0gbW9kZWw7XG4gICAgICAgIHRoaXMucG9wdXAgPSAkKFwiI1wiICsgaWQpO1xuICAgICAgICB0aGlzLnBvcHVwLmxvYWQoXCIvbGF5b3V0cy9tb2RhbC1lZGl0LXRodW9jLmh0bWxcIik7XG4gICAgfVxuICAgIHNob3coKSB7XG4gICAgICAgIHRoaXMucG9wdXAubW9kYWwoXCJzaG93XCIpO1xuICAgIH1cbiAgICBoaWRlKCkge1xuICAgICAgICB0aGlzLnBvcHVwLm1vZGFsKFwiaGlkZVwiKTtcbiAgICB9XG59XG5leHBvcnRzLkVkaXRUaHVvY01vZGFsID0gRWRpdFRodW9jTW9kYWw7XG4vLyMgc291cmNlTWFwcGluZ1VSTD10aHVvYy1lZGl0LW1vZGFsLmpzLm1hcCIsIlwidXNlIHN0cmljdFwiO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuY2xhc3MgRWRpdFByaWNlVGh1b2NNb2RhbCB7XG4gICAgY29uc3RydWN0b3IoaWQsIG1vZGVsKSB7XG4gICAgICAgIHRoaXMubW9kZWwgPSBtb2RlbDtcbiAgICAgICAgdGhpcy5wb3B1cCA9ICQoXCIjXCIgKyBpZCk7XG4gICAgICAgIHRoaXMucG9wdXAubG9hZChcIi9sYXlvdXRzL21vZGFsLWVkaXQtcHJpY2UtdGh1b2MuaHRtbFwiKTtcbiAgICB9XG4gICAgc2hvdygpIHtcbiAgICAgICAgdGhpcy5wb3B1cC5tb2RhbChcInNob3dcIik7XG4gICAgfVxuICAgIGhpZGUoKSB7XG4gICAgICAgIHRoaXMucG9wdXAubW9kYWwoXCJoaWRlXCIpO1xuICAgIH1cbn1cbmV4cG9ydHMuRWRpdFByaWNlVGh1b2NNb2RhbCA9IEVkaXRQcmljZVRodW9jTW9kYWw7XG4vLyMgc291cmNlTWFwcGluZ1VSTD10aHVvYy1lZGl0LXByaWNlLW1vZGFsLmpzLm1hcCIsIlwidXNlIHN0cmljdFwiO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuY29uc3QgdGh1b2NfYWRkX21vZGFsXzEgPSByZXF1aXJlKFwiLi90aHVvYy1hZGQtbW9kYWxcIik7XG5leHBvcnRzLkFkZFRodW9jTW9kYWwgPSB0aHVvY19hZGRfbW9kYWxfMS5BZGRUaHVvY01vZGFsO1xuY29uc3QgdGh1b2NfZWRpdF9tb2RhbF8xID0gcmVxdWlyZShcIi4vdGh1b2MtZWRpdC1tb2RhbFwiKTtcbmV4cG9ydHMuRWRpdFRodW9jTW9kYWwgPSB0aHVvY19lZGl0X21vZGFsXzEuRWRpdFRodW9jTW9kYWw7XG5jb25zdCB0aHVvY19uZXdfbW9kYWxfMSA9IHJlcXVpcmUoXCIuL3RodW9jLW5ldy1tb2RhbFwiKTtcbmV4cG9ydHMuTmV3VGh1b2NNb2RhbCA9IHRodW9jX25ld19tb2RhbF8xLk5ld1RodW9jTW9kYWw7XG5jb25zdCB0aHVvY19lZGl0X3ByaWNlX21vZGFsXzEgPSByZXF1aXJlKFwiLi90aHVvYy1lZGl0LXByaWNlLW1vZGFsXCIpO1xuZXhwb3J0cy5FZGl0UHJpY2VUaHVvY01vZGFsID0gdGh1b2NfZWRpdF9wcmljZV9tb2RhbF8xLkVkaXRQcmljZVRodW9jTW9kYWw7XG4vLyMgc291cmNlTWFwcGluZ1VSTD10aHVvYy1tb2RhbC5qcy5tYXAiLCJcInVzZSBzdHJpY3RcIjtcbnZhciBfX2F3YWl0ZXIgPSAodGhpcyAmJiB0aGlzLl9fYXdhaXRlcikgfHwgZnVuY3Rpb24gKHRoaXNBcmcsIF9hcmd1bWVudHMsIFAsIGdlbmVyYXRvcikge1xuICAgIHJldHVybiBuZXcgKFAgfHwgKFAgPSBQcm9taXNlKSkoZnVuY3Rpb24gKHJlc29sdmUsIHJlamVjdCkge1xuICAgICAgICBmdW5jdGlvbiBmdWxmaWxsZWQodmFsdWUpIHsgdHJ5IHsgc3RlcChnZW5lcmF0b3IubmV4dCh2YWx1ZSkpOyB9IGNhdGNoIChlKSB7IHJlamVjdChlKTsgfSB9XG4gICAgICAgIGZ1bmN0aW9uIHJlamVjdGVkKHZhbHVlKSB7IHRyeSB7IHN0ZXAoZ2VuZXJhdG9yW1widGhyb3dcIl0odmFsdWUpKTsgfSBjYXRjaCAoZSkgeyByZWplY3QoZSk7IH0gfVxuICAgICAgICBmdW5jdGlvbiBzdGVwKHJlc3VsdCkgeyByZXN1bHQuZG9uZSA/IHJlc29sdmUocmVzdWx0LnZhbHVlKSA6IG5ldyBQKGZ1bmN0aW9uIChyZXNvbHZlKSB7IHJlc29sdmUocmVzdWx0LnZhbHVlKTsgfSkudGhlbihmdWxmaWxsZWQsIHJlamVjdGVkKTsgfVxuICAgICAgICBzdGVwKChnZW5lcmF0b3IgPSBnZW5lcmF0b3IuYXBwbHkodGhpc0FyZywgX2FyZ3VtZW50cyB8fCBbXSkpLm5leHQoKSk7XG4gICAgfSk7XG59O1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuY29uc3QgZm9ybVZhbF8xID0gcmVxdWlyZShcIi4uL2Zvcm1WYWxcIik7XG5jbGFzcyBOZXdUaHVvY01vZGFsIHtcbiAgICBjb25zdHJ1Y3RvcihpZCwgYXBwKSB7XG4gICAgICAgIHRoaXMuYXBwID0gYXBwO1xuICAgICAgICB0aGlzLnBvcHVwID0gJChcIiNcIiArIGlkKTtcbiAgICAgICAgdGhpcy5wb3B1cC5sb2FkKFwiL2xheW91dHMvbW9kYWwtbmV3LXRodW9jLmh0bWxcIiwgKCkgPT4ge1xuICAgICAgICAgICAgdGhpcy5hcHAuZG9uVmkuZ2V0KChkYXRhKSA9PiB7XG4gICAgICAgICAgICAgICAgY29uc3Qgc2VsZWN0SW5wdXQgPSB0aGlzLnBvcHVwLmZpbmQoXCJbY29tcG9uZW50PSdEb25WaSddXCIpO1xuICAgICAgICAgICAgICAgIHNlbGVjdElucHV0LmNoaWxkcmVuKCkucmVtb3ZlKCk7XG4gICAgICAgICAgICAgICAgZm9yIChjb25zdCByb3cgb2YgZGF0YSkge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBvcHQgPSAkKFwiPG9wdGlvbi8+XCIpLnZhbChyb3cuaWQpLnRleHQocm93LnRlbik7XG4gICAgICAgICAgICAgICAgICAgIHNlbGVjdElucHV0LmFwcGVuZChvcHQpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBzZWxlY3RJbnB1dC5jaGlsZHJlbigpLmVxKDApLmF0dHIoXCJjaGVja2VkXCIsIFwidHJ1ZVwiKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgdGhpcy5wb3B1cC5maW5kKFwiZm9ybVwiKS5vbihcInN1Ym1pdFwiLCBmdW5jdGlvbiAoZSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBfX2F3YWl0ZXIodGhpcywgdm9pZCAwLCB2b2lkIDAsIGZ1bmN0aW9uKiAoKSB7XG4gICAgICAgICAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgZm9ybVZhbCA9IGZvcm1WYWxfMS5nZXRGb3JtVmFsdWUoJCh0aGlzKSk7XG4gICAgICAgICAgICAgICAgICAgIHlpZWxkIGFwcC50aHVvYy5jcmVhdGUoZm9ybVZhbCkuY2F0Y2goKGVycikgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgYWxlcnQoZXJyKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRocm93IGVycjtcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgIGFsZXJ0KFwic3VjY2Vzc1wiKTtcbiAgICAgICAgICAgICAgICAgICAgd2luZG93LmxvY2F0aW9uLnJlbG9hZCgpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgIH1cbiAgICBzaG93KCkge1xuICAgICAgICB0aGlzLnBvcHVwLm1vZGFsKFwic2hvd1wiKTtcbiAgICB9XG4gICAgaGlkZSgpIHtcbiAgICAgICAgdGhpcy5wb3B1cC5tb2RhbChcImhpZGVcIik7XG4gICAgfVxufVxuZXhwb3J0cy5OZXdUaHVvY01vZGFsID0gTmV3VGh1b2NNb2RhbDtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPXRodW9jLW5ldy1tb2RhbC5qcy5tYXAiLCJjb25zdCB7QXBwfSA9IHJlcXVpcmUoJy4uL2FwcC9BcHAnKTtcblxuJChkb2N1bWVudCkucmVhZHkoKCk9PntcbiAgICBjb25zdCBhcHAgPSBuZXcgQXBwKCk7XG5cbiAgICByZXF1aXJlKFwiLi4vYXBwL25oYXAtaG9hLWRvblwiKS5pbml0KGFwcCk7XG4gICAgcmVxdWlyZShcIi4uL2FwcC9uaGFwLXRodW9jXCIpLmluaXQoYXBwKTtcbn0pO1xuIl19
