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
            return (!this.res.err);
        });
    }
    add(ma, soLuong, tongGia) {
        return __awaiter(this, void 0, void 0, function* () {
            // this.res = await this._post();
            return false;
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
        this.addModal = new thuoc_modal_1.AddThuocModal("thuoc--add-modal", this.app.thuoc);
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
Object.defineProperty(exports, "__esModule", { value: true });
class AddThuocModal {
    constructor(id, model) {
        this.model = model;
        this.popup = $("#" + id);
        this.popup.load("/layouts/modal-add-thuoc.html");
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvYXBwL0FwcC5qcyIsInNyYy9hcHAvQXV0b0NvbXBsZXRlL2luZGV4LmpzIiwic3JjL2FwcC9LZXlFdmVudC9pbmRleC5qcyIsInNyYy9hcHAvTWVudUNvbnRleHQvaW5kZXguanMiLCJzcmMvYXBwL01vZGVsL0RvblZpL2luZGV4LmpzIiwic3JjL2FwcC9Nb2RlbC9Nb2RlbENsYXNzL2luZGV4LmpzIiwic3JjL2FwcC9Nb2RlbC9UYWJsZURhdGEvaW5kZXguanMiLCJzcmMvYXBwL01vZGVsL1RodW9jL0JhbmdUaHVvYy5qcyIsInNyYy9hcHAvTW9kZWwvVGh1b2MvaW5kZXguanMiLCJzcmMvYXBwL1ZpZXcvVGh1b2NUYWJsZS5qcyIsInNyYy9hcHAvVmlldy9WaWV3VGFibGUuanMiLCJzcmMvYXBwL2Zvcm1WYWwuanMiLCJzcmMvYXBwL25oYXAtaG9hLWRvbi9pbmRleC5qcyIsInNyYy9hcHAvbmhhcC10aHVvYy9pbmRleC5qcyIsInNyYy9hcHAvbmhhcC10aHVvYy90aHVvYy1hZGQtbW9kYWwuanMiLCJzcmMvYXBwL25oYXAtdGh1b2MvdGh1b2MtZWRpdC1tb2RhbC5qcyIsInNyYy9hcHAvbmhhcC10aHVvYy90aHVvYy1lZGl0LXByaWNlLW1vZGFsLmpzIiwic3JjL2FwcC9uaGFwLXRodW9jL3RodW9jLW1vZGFsLmpzIiwic3JjL2FwcC9uaGFwLXRodW9jL3RodW9jLW5ldy1tb2RhbC5qcyIsInNyYy9zY3JpcHQvbWFpbi5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaEVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2SEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN4Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNwREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM1QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaklBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25EQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMzQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNyQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2REE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN4SUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1hBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM3SEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNWQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDL0NBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uKCl7ZnVuY3Rpb24gcihlLG4sdCl7ZnVuY3Rpb24gbyhpLGYpe2lmKCFuW2ldKXtpZighZVtpXSl7dmFyIGM9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZTtpZighZiYmYylyZXR1cm4gYyhpLCEwKTtpZih1KXJldHVybiB1KGksITApO3ZhciBhPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIraStcIidcIik7dGhyb3cgYS5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGF9dmFyIHA9bltpXT17ZXhwb3J0czp7fX07ZVtpXVswXS5jYWxsKHAuZXhwb3J0cyxmdW5jdGlvbihyKXt2YXIgbj1lW2ldWzFdW3JdO3JldHVybiBvKG58fHIpfSxwLHAuZXhwb3J0cyxyLGUsbix0KX1yZXR1cm4gbltpXS5leHBvcnRzfWZvcih2YXIgdT1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlLGk9MDtpPHQubGVuZ3RoO2krKylvKHRbaV0pO3JldHVybiBvfXJldHVybiByfSkoKSIsIlwidXNlIHN0cmljdFwiO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuY29uc3QgS2V5RXZlbnRfMSA9IHJlcXVpcmUoXCIuL0tleUV2ZW50XCIpO1xuY29uc3QgVGh1b2NfMSA9IHJlcXVpcmUoXCIuL01vZGVsL1RodW9jXCIpO1xuY29uc3QgRG9uVmlfMSA9IHJlcXVpcmUoXCIuL01vZGVsL0RvblZpXCIpO1xuY2xhc3MgQXBwIHtcbiAgICAvLyBwdWJsaWMgbmNjOlxuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICB0aGlzLnN3aXRjaFRvUGFnZSh0aGlzLmdldFBhZ2VGcm9tVXJsKCkpO1xuICAgICAgICB0aGlzLmhhbmRsZVN3aXRjaFBhZ2UoKTtcbiAgICAgICAgdGhpcy5rZXlldmVudCA9IG5ldyBLZXlFdmVudF8xLktleUV2ZW50KCk7XG4gICAgICAgIHRoaXMuaGFuZGxlU2V0dGluZygpO1xuICAgICAgICB0aGlzLmhhbmRsZU1vZGFsKCk7XG4gICAgICAgIHRoaXMudGh1b2MgPSBuZXcgVGh1b2NfMS5UaHVvYygpO1xuICAgICAgICB0aGlzLmRvblZpID0gbmV3IERvblZpXzEuRG9uVmkoKTtcbiAgICB9XG4gICAgZ2V0VXNlcm5hbWUoKSB7XG4gICAgICAgIGNvbnN0IHVzZXJuYW1lID0gZG9jdW1lbnQuY29va2llLm1hdGNoKC91c2VybmFtZT0oWzAtOWEtekEtWl9dKykvaSlbMV07XG4gICAgICAgICQoXCIjdXNlcm5hbWVcIikudGV4dCh1c2VybmFtZSk7XG4gICAgfVxuICAgIG9uU2hvcnRjdXRLZXkoY29tYktleSwgcGFnZSwgZnVuYykge1xuICAgICAgICAvLyBmKmtpbmcgaW5jcmVkaWJsZSBzY29wZSB0aGluZ3MhXG4gICAgICAgIHRoaXMua2V5ZXZlbnQub24oY29tYktleSwgKGUpID0+IHtcbiAgICAgICAgICAgIGlmICh0aGlzLnBhZ2UgPT09IHBhZ2UpIHtcbiAgICAgICAgICAgICAgICBmdW5jKGUpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9XG4gICAgZ2V0UGFnZUZyb21VcmwoKSB7XG4gICAgICAgIGxldCBwYWdlID0gbmV3IFVSTCh3aW5kb3cubG9jYXRpb24udG9TdHJpbmcoKSkuc2VhcmNoUGFyYW1zLmdldChcInBhZ2VcIik7XG4gICAgICAgIGlmICghcGFnZSkge1xuICAgICAgICAgICAgcGFnZSA9IFwicGFnZS1uaGFwLWhvYS1kb25cIjtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcGFnZTtcbiAgICB9XG4gICAgaGFuZGxlU3dpdGNoUGFnZSgpIHtcbiAgICAgICAgY29uc3QgJHRoaXMgPSB0aGlzO1xuICAgICAgICAkKFwiLnNpZGViYXItc3dpdGNoLXBhZ2VcIikub24oXCJjbGlja1wiLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBjb25zdCBpZCA9ICQodGhpcykuZGF0YShcInRhcmdldFwiKTtcbiAgICAgICAgICAgICR0aGlzLnN3aXRjaFRvUGFnZShpZCk7XG4gICAgICAgIH0pO1xuICAgIH1cbiAgICBzd2l0Y2hUb1BhZ2UoaWQpIHtcbiAgICAgICAgdGhpcy5wYWdlID0gaWQ7XG4gICAgICAgIHdpbmRvdy5oaXN0b3J5LnJlcGxhY2VTdGF0ZShudWxsLCBpZCwgXCIvP3BhZ2U9XCIgKyBpZCk7XG4gICAgICAgIGNvbnN0IGNvbnRhaW5lciA9ICQoXCIuZnJhbWUtY29udGFpbmVyXCIpO1xuICAgICAgICBjb25zdCBwYWdlID0gJChcIiNcIiArIGlkKTtcbiAgICAgICAgY29udGFpbmVyLmFuaW1hdGUoe1xuICAgICAgICAgICAgc2Nyb2xsVG9wOiBwYWdlLm9mZnNldCgpLnRvcCAtIGNvbnRhaW5lci5vZmZzZXQoKS50b3AgKyBjb250YWluZXIuc2Nyb2xsVG9wKCksXG4gICAgICAgIH0pO1xuICAgIH1cbiAgICBoYW5kbGVTZXR0aW5nKCkge1xuICAgICAgICAvL1xuICAgIH1cbiAgICBoYW5kbGVNb2RhbCgpIHtcbiAgICAgICAgJChcIi5tb2RhbFwiKS5vbihcInNob3duLmJzLm1vZGFsXCIsICgpID0+IHtcbiAgICAgICAgICAgIHRoaXMua2V5ZXZlbnQuYmxvY2soKTtcbiAgICAgICAgfSk7XG4gICAgICAgICQoXCIubW9kYWxcIikub24oXCJoaWRkZW4uYnMubW9kYWxcIiwgKCkgPT4ge1xuICAgICAgICAgICAgdGhpcy5rZXlldmVudC51bmJsb2NrKCk7XG4gICAgICAgIH0pO1xuICAgIH1cbn1cbmV4cG9ydHMuQXBwID0gQXBwO1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9QXBwLmpzLm1hcCIsIlwidXNlIHN0cmljdFwiO1xudmFyIF9fYXdhaXRlciA9ICh0aGlzICYmIHRoaXMuX19hd2FpdGVyKSB8fCBmdW5jdGlvbiAodGhpc0FyZywgX2FyZ3VtZW50cywgUCwgZ2VuZXJhdG9yKSB7XG4gICAgcmV0dXJuIG5ldyAoUCB8fCAoUCA9IFByb21pc2UpKShmdW5jdGlvbiAocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgICAgIGZ1bmN0aW9uIGZ1bGZpbGxlZCh2YWx1ZSkgeyB0cnkgeyBzdGVwKGdlbmVyYXRvci5uZXh0KHZhbHVlKSk7IH0gY2F0Y2ggKGUpIHsgcmVqZWN0KGUpOyB9IH1cbiAgICAgICAgZnVuY3Rpb24gcmVqZWN0ZWQodmFsdWUpIHsgdHJ5IHsgc3RlcChnZW5lcmF0b3JbXCJ0aHJvd1wiXSh2YWx1ZSkpOyB9IGNhdGNoIChlKSB7IHJlamVjdChlKTsgfSB9XG4gICAgICAgIGZ1bmN0aW9uIHN0ZXAocmVzdWx0KSB7IHJlc3VsdC5kb25lID8gcmVzb2x2ZShyZXN1bHQudmFsdWUpIDogbmV3IFAoZnVuY3Rpb24gKHJlc29sdmUpIHsgcmVzb2x2ZShyZXN1bHQudmFsdWUpOyB9KS50aGVuKGZ1bGZpbGxlZCwgcmVqZWN0ZWQpOyB9XG4gICAgICAgIHN0ZXAoKGdlbmVyYXRvciA9IGdlbmVyYXRvci5hcHBseSh0aGlzQXJnLCBfYXJndW1lbnRzIHx8IFtdKSkubmV4dCgpKTtcbiAgICB9KTtcbn07XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5jbGFzcyBBdXRvQ29tcGxldGUge1xuICAgIGNvbnN0cnVjdG9yKHRhcmdldCwgbW9kZWwpIHtcbiAgICAgICAgaWYgKHR5cGVvZiB0YXJnZXQgPT09IFwic3RyaW5nXCIpIHtcbiAgICAgICAgICAgIHRoaXMudGFyZ2V0ID0gJChcIiNcIiArIHRhcmdldCk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICB0aGlzLnRhcmdldCA9IHRhcmdldDtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLnRhcmdldC5hdHRyKFwiYXV0b2NvbXBsZXRlXCIsIFwib2ZmXCIpO1xuICAgICAgICB0aGlzLm1vZGVsID0gbW9kZWw7XG4gICAgfVxuICAgIG9uQ2hvb3NlKGZ1bmMpIHtcbiAgICAgICAgdGhpcy5mdW5jT25DaG9vc2UgPSBmdW5jO1xuICAgIH1cbiAgICBpc1Nob3dlZCgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZWxlbWVudC5jaGlsZHJlbi5sZW5ndGggPiAwO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBzZXQgZmllbGRuYW1lIHRvIHNob3dcbiAgICAgKiBAcGFyYW0gbG9va3VwIHtmaWVsZE5hbWU6IEVsZW1lbnRJZH1cbiAgICAgKi9cbiAgICBzZXRMb29rdXAobG9va3VwKSB7XG4gICAgICAgIHRoaXMubG9va3VwID0gbG9va3VwO1xuICAgIH1cbiAgICBsaXN0ZW4oKSB7XG4gICAgICAgIHRoaXMudGFyZ2V0Lm9uKFwia2V5dXBcIiwgKGUpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IGtleSA9IGUua2V5O1xuICAgICAgICAgICAgc3dpdGNoIChrZXkpIHtcbiAgICAgICAgICAgICAgICBjYXNlIFwiRW50ZXJcIjoge1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgY2FzZSBcIkVzY2FwZVwiOiB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMucmVtb3ZlKCk7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBjYXNlIFwiQXJyb3dVcFwiOiB7XG4gICAgICAgICAgICAgICAgICAgIC8vIHRvIGRvXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBjYXNlIFwiQXJyb3dEb3duXCI6IHtcbiAgICAgICAgICAgICAgICAgICAgLy8gdG8gZG9cbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGRlZmF1bHQ6IHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgdmFsID0gdGhpcy50YXJnZXQudmFsKCk7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMucmVtb3ZlKCk7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMucmVuZGVyKHZhbCkudGhlbigoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnNob3coKTtcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9XG4gICAgcmVuZGVyKHNlYXJjaCkge1xuICAgICAgICByZXR1cm4gX19hd2FpdGVyKHRoaXMsIHZvaWQgMCwgdm9pZCAwLCBmdW5jdGlvbiogKCkge1xuICAgICAgICAgICAgdGhpcy5lbGVtZW50ID0gJChcIjx1bC8+XCIpLmFkZENsYXNzKFwibXktYXV0b2NvbXBsZXRlIHNoYWRvdy1sZyByb3VuZGVkXCIpO1xuICAgICAgICAgICAgdGhpcy5lbGVtZW50LmNzcyh7XG4gICAgICAgICAgICAgICAgdG9wOiB0aGlzLnRhcmdldC5vZmZzZXQoKS50b3AgKyB0aGlzLnRhcmdldC5vdXRlckhlaWdodCgpLFxuICAgICAgICAgICAgICAgIGxlZnQ6IHRoaXMudGFyZ2V0Lm9mZnNldCgpLmxlZnQsXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIGNvbnN0IGRhdGEgPSB5aWVsZCB0aGlzLmdldERhdGEoc2VhcmNoKTtcbiAgICAgICAgICAgIHRoaXMuY3VycmVudE9mZnNldCA9IDA7XG4gICAgICAgICAgICBsZXQgb2Zmc2V0ID0gMDtcbiAgICAgICAgICAgIGZvciAoY29uc3QgZGF0YVJvdyBvZiBkYXRhKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgZGF0YVJvd0ZpbHRlcmVkID0gdGhpcy5maWx0ZXJEYXRhV2l0aExvb2t1cChkYXRhUm93KTtcbiAgICAgICAgICAgICAgICBjb25zdCByb3dFbGVtZW50ID0gdGhpcy5yZW5kZXJSb3coZGF0YVJvd0ZpbHRlcmVkLCBvZmZzZXQrKyk7XG4gICAgICAgICAgICAgICAgcm93RWxlbWVudC5vbihcImNsaWNrIGtleWRvd25cIiwgKGUpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGUudHlwZSA9PT0gXCJjbGlja1wiIHx8IGUua2V5ID09PSBcIkVudGVyXCIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGUuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmZ1bmNPbkNob29zZShkYXRhUm93KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMucmVtb3ZlKCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB0aGlzLmVsZW1lbnQuYXBwZW5kKHJvd0VsZW1lbnQpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9XG4gICAgc2hvdygpIHtcbiAgICAgICAgJChcImJvZHlcIikuYXBwZW5kKHRoaXMuZWxlbWVudCk7XG4gICAgfVxuICAgIHJlbW92ZSgpIHtcbiAgICAgICAgJChcIi5teS1hdXRvY29tcGxldGVcIikucmVtb3ZlKCk7XG4gICAgfVxuICAgIGdldERhdGEoc2VhcmNoKSB7XG4gICAgICAgIHJldHVybiBfX2F3YWl0ZXIodGhpcywgdm9pZCAwLCB2b2lkIDAsIGZ1bmN0aW9uKiAoKSB7XG4gICAgICAgICAgICBjb25zdCBkYXRhID0geWllbGQgdGhpcy5tb2RlbC5nZXQoc2VhcmNoLCAwLCAyMCk7IC8vIDIwIGlzIGZvciB0ZXN0IGZpcnN0LCB3aWxsIGRldmVsb3AgaW4gZnV0dXJlXG4gICAgICAgICAgICByZXR1cm4gZGF0YTtcbiAgICAgICAgfSk7XG4gICAgfVxuICAgIHJlbmRlclJvdyhkYXRhUm93LCBvZmZzZXQpIHtcbiAgICAgICAgY29uc3Qgcm93ID0gJChcIjxsaS8+XCIpLmRhdGEoXCJvZmZzZXRcIiwgb2Zmc2V0KTtcbiAgICAgICAgZm9yIChjb25zdCBmaWVsZCBvZiBPYmplY3Qua2V5cyhkYXRhUm93KSkge1xuICAgICAgICAgICAgY29uc3QgdmFsID0gZGF0YVJvd1tmaWVsZF07XG4gICAgICAgICAgICByb3cuYXBwZW5kKCQoXCI8ZGl2Lz5cIikudGV4dCh2YWwpKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcm93O1xuICAgIH1cbiAgICBmaWx0ZXJEYXRhV2l0aExvb2t1cChkYXRhUm93KSB7XG4gICAgICAgIGNvbnN0IGZpbHRlcmVkRGF0YSA9IHt9O1xuICAgICAgICBmb3IgKGNvbnN0IGtleSBvZiB0aGlzLmxvb2t1cCkge1xuICAgICAgICAgICAgaWYgKGRhdGFSb3cuaGFzT3duUHJvcGVydHkoa2V5KSkge1xuICAgICAgICAgICAgICAgIGZpbHRlcmVkRGF0YVtrZXldID0gZGF0YVJvd1trZXldO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBmaWx0ZXJlZERhdGE7XG4gICAgfVxufVxuZXhwb3J0cy5BdXRvQ29tcGxldGUgPSBBdXRvQ29tcGxldGU7XG4vLyMgc291cmNlTWFwcGluZ1VSTD1pbmRleC5qcy5tYXAiLCJcInVzZSBzdHJpY3RcIjtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmNsYXNzIEtleUV2ZW50IHtcbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgdGhpcy5ldmVudEF0dGFjaCA9IHt9O1xuICAgICAgICB0aGlzLmlzQmxvY2tpbmcgPSBmYWxzZTtcbiAgICAgICAgJChkb2N1bWVudCkub24oXCJrZXlkb3duXCIsIChlKSA9PiB7XG4gICAgICAgICAgICBpZiAodGhpcy5pc0Jsb2NraW5nKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgbGV0IGNvbWJLZXkgPSBcIlwiO1xuICAgICAgICAgICAgaWYgKGUuY3RybEtleSkge1xuICAgICAgICAgICAgICAgIGNvbWJLZXkgPSBcImN0cmwrXCI7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjb21iS2V5ICs9IGUua2V5O1xuICAgICAgICAgICAgY29uc29sZS5sb2coY29tYktleSk7XG4gICAgICAgICAgICBpZiAodGhpcy5ldmVudEF0dGFjaC5oYXNPd25Qcm9wZXJ0eShjb21iS2V5KSkge1xuICAgICAgICAgICAgICAgIGNvbnN0IGxpc3RGdW5jID0gdGhpcy5ldmVudEF0dGFjaFtjb21iS2V5XTtcbiAgICAgICAgICAgICAgICBmb3IgKGNvbnN0IGZ1bmMgb2YgbGlzdEZ1bmMpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHR5cGVvZiBmdW5jID09PSBcImZ1bmN0aW9uXCIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGZ1bmMoZSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH1cbiAgICBvbihjb21iS2V5LCBmdW5jKSB7XG4gICAgICAgIGlmICghdGhpcy5ldmVudEF0dGFjaFtjb21iS2V5XSkge1xuICAgICAgICAgICAgdGhpcy5ldmVudEF0dGFjaFtjb21iS2V5XSA9IFtdO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuZXZlbnRBdHRhY2hbY29tYktleV0ucHVzaChmdW5jKTtcbiAgICB9XG4gICAgYmxvY2soKSB7XG4gICAgICAgIHRoaXMuaXNCbG9ja2luZyA9IHRydWU7XG4gICAgfVxuICAgIHVuYmxvY2soKSB7XG4gICAgICAgIHRoaXMuaXNCbG9ja2luZyA9IGZhbHNlO1xuICAgIH1cbn1cbmV4cG9ydHMuS2V5RXZlbnQgPSBLZXlFdmVudDtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWluZGV4LmpzLm1hcCIsIlwidXNlIHN0cmljdFwiO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuY2xhc3MgTWVudUNvbnRleHQge1xuICAgIGNvbnN0cnVjdG9yKHRhcmdldCkge1xuICAgICAgICBpZiAodHlwZW9mIHRhcmdldCA9PT0gXCJzdHJpbmdcIikge1xuICAgICAgICAgICAgdGhpcy50YXJnZXQgPSAkKFwiI1wiICsgdGFyZ2V0KTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMudGFyZ2V0ID0gdGFyZ2V0O1xuICAgICAgICB9XG4gICAgICAgIHRoaXMudGFyZ2V0Lm9uKFwiY29udGV4dG1lbnVcIiwgKGUpID0+IHtcbiAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgIGUuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgICAgICAgICB0aGlzLnJlbW92ZSgpLnJlbmRlcih7IHg6IGUuY2xpZW50WCwgeTogZS5jbGllbnRZIH0pLnNob3coKTtcbiAgICAgICAgfSk7XG4gICAgICAgIHRoaXMubWVudSA9IFtdO1xuICAgIH1cbiAgICBhZGRDb250ZXh0KHByb3ApIHtcbiAgICAgICAgdGhpcy5tZW51LnB1c2gocHJvcCk7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cbiAgICByZW5kZXIocG9zKSB7XG4gICAgICAgIHRoaXMuZWxlbWVudCA9ICQoXCI8dWwvPlwiKS5hZGRDbGFzcyhcInNoYWRvdy1sZyByb3VuZGVkIG15LWNvbnRleHRtZW51XCIpO1xuICAgICAgICB0aGlzLmVsZW1lbnQuY3NzKFwidG9wXCIsIHBvcy55ICsgXCJweFwiKTtcbiAgICAgICAgdGhpcy5lbGVtZW50LmNzcyhcImxlZnRcIiwgcG9zLnggKyBcInB4XCIpO1xuICAgICAgICBmb3IgKGNvbnN0IGN0eCBvZiB0aGlzLm1lbnUpIHtcbiAgICAgICAgICAgIHRoaXMuZWxlbWVudC5hcHBlbmQodGhpcy5yZW5kZXJDb250ZXh0KGN0eCkpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuZWxlbWVudC5oaWRlKCk7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cbiAgICBzaG93KCkge1xuICAgICAgICAkKFwiYm9keVwiKS5hcHBlbmQodGhpcy5lbGVtZW50KTtcbiAgICAgICAgdGhpcy5lbGVtZW50LnNsaWRlRG93bigwLjUpO1xuICAgICAgICAkKGRvY3VtZW50KS5vZmYoXCJjbGlja1wiLCB0aGlzLnJlbW92ZSkub24oXCJjbGlja1wiLCB0aGlzLnJlbW92ZSk7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cbiAgICByZW1vdmUoKSB7XG4gICAgICAgICQoXCIubXktY29udGV4dG1lbnVcIikucmVtb3ZlKCk7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cbiAgICByZW5kZXJDb250ZXh0KHByb3ApIHtcbiAgICAgICAgY29uc3QgY29udGV4dCA9ICQoXCI8bGkvPlwiKTtcbiAgICAgICAgY29udGV4dC5odG1sKGA8aSBjbGFzcz0nJHtwcm9wLmljb259ICR7cHJvcC5jbGFzc05hbWV9Jz48L2k+ICR7cHJvcC50aXRsZX1gKTtcbiAgICAgICAgY29udGV4dC5vbihcImNsaWNrXCIsIChlKSA9PiB7XG4gICAgICAgICAgICB0aGlzLnJlbW92ZSgpO1xuICAgICAgICAgICAgcHJvcC5jbGljayhlKTtcbiAgICAgICAgfSk7XG4gICAgICAgIHJldHVybiBjb250ZXh0O1xuICAgIH1cbn1cbmV4cG9ydHMuTWVudUNvbnRleHQgPSBNZW51Q29udGV4dDtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWluZGV4LmpzLm1hcCIsIlwidXNlIHN0cmljdFwiO1xudmFyIF9fYXdhaXRlciA9ICh0aGlzICYmIHRoaXMuX19hd2FpdGVyKSB8fCBmdW5jdGlvbiAodGhpc0FyZywgX2FyZ3VtZW50cywgUCwgZ2VuZXJhdG9yKSB7XG4gICAgcmV0dXJuIG5ldyAoUCB8fCAoUCA9IFByb21pc2UpKShmdW5jdGlvbiAocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgICAgIGZ1bmN0aW9uIGZ1bGZpbGxlZCh2YWx1ZSkgeyB0cnkgeyBzdGVwKGdlbmVyYXRvci5uZXh0KHZhbHVlKSk7IH0gY2F0Y2ggKGUpIHsgcmVqZWN0KGUpOyB9IH1cbiAgICAgICAgZnVuY3Rpb24gcmVqZWN0ZWQodmFsdWUpIHsgdHJ5IHsgc3RlcChnZW5lcmF0b3JbXCJ0aHJvd1wiXSh2YWx1ZSkpOyB9IGNhdGNoIChlKSB7IHJlamVjdChlKTsgfSB9XG4gICAgICAgIGZ1bmN0aW9uIHN0ZXAocmVzdWx0KSB7IHJlc3VsdC5kb25lID8gcmVzb2x2ZShyZXN1bHQudmFsdWUpIDogbmV3IFAoZnVuY3Rpb24gKHJlc29sdmUpIHsgcmVzb2x2ZShyZXN1bHQudmFsdWUpOyB9KS50aGVuKGZ1bGZpbGxlZCwgcmVqZWN0ZWQpOyB9XG4gICAgICAgIHN0ZXAoKGdlbmVyYXRvciA9IGdlbmVyYXRvci5hcHBseSh0aGlzQXJnLCBfYXJndW1lbnRzIHx8IFtdKSkubmV4dCgpKTtcbiAgICB9KTtcbn07XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5jb25zdCBNb2RlbENsYXNzXzEgPSByZXF1aXJlKFwiLi4vTW9kZWxDbGFzc1wiKTtcbmNsYXNzIERvblZpIGV4dGVuZHMgTW9kZWxDbGFzc18xLk1vZGVsIHtcbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgc3VwZXIoKTtcbiAgICAgICAgdGhpcy5kYXRhYmFzZSA9IFwiL2FwaS9kb25fdmkvXCI7XG4gICAgfVxuICAgIGdldChjYWxsYmFjaykge1xuICAgICAgICByZXR1cm4gX19hd2FpdGVyKHRoaXMsIHZvaWQgMCwgdm9pZCAwLCBmdW5jdGlvbiogKCkge1xuICAgICAgICAgICAgY29uc3QgZGF0YSA9IHlpZWxkIHRoaXMuX2dldCh7fSk7XG4gICAgICAgICAgICB0aGlzLmRhdGEgPSBkYXRhO1xuICAgICAgICAgICAgaWYgKHR5cGVvZiBjYWxsYmFjayA9PT0gXCJmdW5jdGlvblwiKSB7XG4gICAgICAgICAgICAgICAgY2FsbGJhY2soZGF0YSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5kYXRhO1xuICAgICAgICB9KTtcbiAgICB9XG59XG5leHBvcnRzLkRvblZpID0gRG9uVmk7XG4vLyMgc291cmNlTWFwcGluZ1VSTD1pbmRleC5qcy5tYXAiLCJcInVzZSBzdHJpY3RcIjtcbnZhciBfX2F3YWl0ZXIgPSAodGhpcyAmJiB0aGlzLl9fYXdhaXRlcikgfHwgZnVuY3Rpb24gKHRoaXNBcmcsIF9hcmd1bWVudHMsIFAsIGdlbmVyYXRvcikge1xuICAgIHJldHVybiBuZXcgKFAgfHwgKFAgPSBQcm9taXNlKSkoZnVuY3Rpb24gKHJlc29sdmUsIHJlamVjdCkge1xuICAgICAgICBmdW5jdGlvbiBmdWxmaWxsZWQodmFsdWUpIHsgdHJ5IHsgc3RlcChnZW5lcmF0b3IubmV4dCh2YWx1ZSkpOyB9IGNhdGNoIChlKSB7IHJlamVjdChlKTsgfSB9XG4gICAgICAgIGZ1bmN0aW9uIHJlamVjdGVkKHZhbHVlKSB7IHRyeSB7IHN0ZXAoZ2VuZXJhdG9yW1widGhyb3dcIl0odmFsdWUpKTsgfSBjYXRjaCAoZSkgeyByZWplY3QoZSk7IH0gfVxuICAgICAgICBmdW5jdGlvbiBzdGVwKHJlc3VsdCkgeyByZXN1bHQuZG9uZSA/IHJlc29sdmUocmVzdWx0LnZhbHVlKSA6IG5ldyBQKGZ1bmN0aW9uIChyZXNvbHZlKSB7IHJlc29sdmUocmVzdWx0LnZhbHVlKTsgfSkudGhlbihmdWxmaWxsZWQsIHJlamVjdGVkKTsgfVxuICAgICAgICBzdGVwKChnZW5lcmF0b3IgPSBnZW5lcmF0b3IuYXBwbHkodGhpc0FyZywgX2FyZ3VtZW50cyB8fCBbXSkpLm5leHQoKSk7XG4gICAgfSk7XG59O1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuY2xhc3MgTW9kZWwge1xuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICB0aGlzLmRhdGFiYXNlID0gXCJcIjtcbiAgICAgICAgdGhpcy5kYXRhID0gW107XG4gICAgfVxuICAgIGdldCBmZXRjaERhdGEoKSB7XG4gICAgICAgIHJldHVybiBPYmplY3QuYXNzaWduKHt9LCB0aGlzLmRhdGEpO1xuICAgIH1cbiAgICBnZXQgcmVzcG9uc2UoKSB7XG4gICAgICAgIHJldHVybiBPYmplY3QuYXNzaWduKHt9LCB0aGlzLnJlcyk7XG4gICAgfVxuICAgIC8vID09PT09PT09PT09PT09PSBJTkhFUklUIEZVTkNcbiAgICBnZXQocGFyYW1zLCBvZmZzZXQsIGxpbWl0KSB7XG4gICAgICAgIHJldHVybiBfX2F3YWl0ZXIodGhpcywgdm9pZCAwLCB2b2lkIDAsIGZ1bmN0aW9uKiAoKSB7XG4gICAgICAgICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgICAgICB9KTtcbiAgICB9XG4gICAgY3JlYXRlKGRhdGEpIHtcbiAgICAgICAgcmV0dXJuIF9fYXdhaXRlcih0aGlzLCB2b2lkIDAsIHZvaWQgMCwgZnVuY3Rpb24qICgpIHtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfSk7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIHVwZGF0ZSByZWNvcmRcbiAgICAgKiBAcGFyYW0gZmllbGRNYXRjaCBtYXRjaCBmaWVsZCB0byB1cGRhdGUgcmVjb3JkXG4gICAgICogQHBhcmFtIGZpZWxkVXBkYXRlIHRoZSBkYXRhIG5lZWQgdXBkYXRlXG4gICAgICovXG4gICAgdXBkYXRlKGZpZWxkTWF0Y2gsIGZpZWxkVXBkYXRlKSB7XG4gICAgICAgIHJldHVybiBfX2F3YWl0ZXIodGhpcywgdm9pZCAwLCB2b2lkIDAsIGZ1bmN0aW9uKiAoKSB7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH0pO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiByZW1vdmUgYSByZWNvcmRcbiAgICAgKiBAcGFyYW0gZmllbGRNYXRjaCBmaWVsZCBtYXRjaCB0byByZW1vdmVcbiAgICAgKiBAcmV0dXJuIHRydWUgb2YgZmFsc2VcbiAgICAgKi9cbiAgICByZW1vdmUoZmllbGRNYXRjaCkge1xuICAgICAgICByZXR1cm4gX19hd2FpdGVyKHRoaXMsIHZvaWQgMCwgdm9pZCAwLCBmdW5jdGlvbiogKCkge1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9KTtcbiAgICB9XG4gICAgLy8gPT09PT09PT09PT09PT09IENPUkUgRlVOQ1xuICAgIC8qKlxuICAgICAqIGZldGNoIGRhdGEgZnJvbSBkYXRhYmFzZSBhbmQgZG8gdGhpbmdcbiAgICAgKiBAcGFyYW0gcGFyYW1zXG4gICAgICogQHBhcmFtIGNhbGxiYWNrIGNhbGxiYWNrIGZ1bmN0aW9uXG4gICAgICovXG4gICAgX2dldChwYXJhbXMsIGNhbGxiYWNrKSB7XG4gICAgICAgIHJldHVybiBfX2F3YWl0ZXIodGhpcywgdm9pZCAwLCB2b2lkIDAsIGZ1bmN0aW9uKiAoKSB7XG4gICAgICAgICAgICB0aGlzLmRhdGEgPSBbXTtcbiAgICAgICAgICAgIGNvbnN0IHJlcXVlc3RVUkwgPSB0aGlzLmRhdGFiYXNlICsgXCI/XCIgKyB0aGlzLl91cmxwYXJhbXMocGFyYW1zKTtcbiAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgY29uc3QgcmVzID0geWllbGQgZmV0Y2gocmVxdWVzdFVSTCwgeyBjcmVkZW50aWFsczogXCJpbmNsdWRlXCIgfSk7XG4gICAgICAgICAgICAgICAgY29uc3QganNvbiA9IHlpZWxkIHJlcy5qc29uKCk7XG4gICAgICAgICAgICAgICAgaWYgKGpzb24uZXJyKSB7XG4gICAgICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihqc29uLm1zZyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHRoaXMuZGF0YSA9IGpzb24uZGF0YTtcbiAgICAgICAgICAgICAgICBpZiAodHlwZW9mIGNhbGxiYWNrID09PSBcImZ1bmN0aW9uXCIpIHtcbiAgICAgICAgICAgICAgICAgICAgY2FsbGJhY2soZmFsc2UsIGpzb24uZGF0YSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHJldHVybiBqc29uLmRhdGE7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjYXRjaCAoZXJyKSB7XG4gICAgICAgICAgICAgICAgaWYgKHR5cGVvZiBjYWxsYmFjayA9PT0gXCJmdW5jdGlvblwiKSB7XG4gICAgICAgICAgICAgICAgICAgIGNhbGxiYWNrKGVycik7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICB0aHJvdyBlcnI7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogcG9zdCByZXF1ZXN0XG4gICAgICogQHBhcmFtIHthbnl9IGRhdGFcbiAgICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBbY2FsbGJhY2tdXG4gICAgICovXG4gICAgX3Bvc3QoZGF0YSwgY2FsbGJhY2spIHtcbiAgICAgICAgcmV0dXJuIF9fYXdhaXRlcih0aGlzLCB2b2lkIDAsIHZvaWQgMCwgZnVuY3Rpb24qICgpIHtcbiAgICAgICAgICAgIHRoaXMucmVzID0gXCJcIjtcbiAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgY29uc3QgcmVzID0geWllbGQgZmV0Y2godGhpcy5kYXRhYmFzZSwge1xuICAgICAgICAgICAgICAgICAgICBib2R5OiBKU09OLnN0cmluZ2lmeShkYXRhKSxcbiAgICAgICAgICAgICAgICAgICAgY3JlZGVudGlhbHM6IFwiaW5jbHVkZVwiLFxuICAgICAgICAgICAgICAgICAgICBoZWFkZXJzOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBcIkNvbnRlbnQtVHlwZVwiOiBcImFwcGxpY2F0aW9uL2pzb25cIixcbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgbWV0aG9kOiBcIlBPU1RcIixcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICBjb25zdCBqc29uID0geWllbGQgcmVzLmpzb24oKTtcbiAgICAgICAgICAgICAgICBpZiAoanNvbi5lcnIpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGpzb24ubXNnKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgdGhpcy5yZXMgPSBqc29uLmRhdGE7XG4gICAgICAgICAgICAgICAgaWYgKHR5cGVvZiBjYWxsYmFjayA9PT0gXCJmdW5jdGlvblwiKSB7XG4gICAgICAgICAgICAgICAgICAgIGNhbGxiYWNrKGZhbHNlLCBqc29uLmRhdGEpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICByZXR1cm4ganNvbi5kYXRhO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY2F0Y2ggKGVycikge1xuICAgICAgICAgICAgICAgIGlmICh0eXBlb2YgY2FsbGJhY2sgPT09IFwiZnVuY3Rpb25cIikge1xuICAgICAgICAgICAgICAgICAgICBjYWxsYmFjayhlcnIpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgdGhyb3cgZXJyO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfVxuICAgIF91cmxwYXJhbXMocGFyYW1zKSB7XG4gICAgICAgIGNvbnN0IHVybCA9IE9iamVjdC5rZXlzKHBhcmFtcykubWFwKChrKSA9PiB7XG4gICAgICAgICAgICByZXR1cm4gZW5jb2RlVVJJQ29tcG9uZW50KGspICsgXCI9XCIgKyBlbmNvZGVVUklDb21wb25lbnQocGFyYW1zW2tdKTtcbiAgICAgICAgfSkuam9pbihcIiZcIik7XG4gICAgICAgIHJldHVybiB1cmw7XG4gICAgfVxufVxuZXhwb3J0cy5Nb2RlbCA9IE1vZGVsO1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9aW5kZXguanMubWFwIiwiXCJ1c2Ugc3RyaWN0XCI7XG52YXIgX19hd2FpdGVyID0gKHRoaXMgJiYgdGhpcy5fX2F3YWl0ZXIpIHx8IGZ1bmN0aW9uICh0aGlzQXJnLCBfYXJndW1lbnRzLCBQLCBnZW5lcmF0b3IpIHtcbiAgICByZXR1cm4gbmV3IChQIHx8IChQID0gUHJvbWlzZSkpKGZ1bmN0aW9uIChyZXNvbHZlLCByZWplY3QpIHtcbiAgICAgICAgZnVuY3Rpb24gZnVsZmlsbGVkKHZhbHVlKSB7IHRyeSB7IHN0ZXAoZ2VuZXJhdG9yLm5leHQodmFsdWUpKTsgfSBjYXRjaCAoZSkgeyByZWplY3QoZSk7IH0gfVxuICAgICAgICBmdW5jdGlvbiByZWplY3RlZCh2YWx1ZSkgeyB0cnkgeyBzdGVwKGdlbmVyYXRvcltcInRocm93XCJdKHZhbHVlKSk7IH0gY2F0Y2ggKGUpIHsgcmVqZWN0KGUpOyB9IH1cbiAgICAgICAgZnVuY3Rpb24gc3RlcChyZXN1bHQpIHsgcmVzdWx0LmRvbmUgPyByZXNvbHZlKHJlc3VsdC52YWx1ZSkgOiBuZXcgUChmdW5jdGlvbiAocmVzb2x2ZSkgeyByZXNvbHZlKHJlc3VsdC52YWx1ZSk7IH0pLnRoZW4oZnVsZmlsbGVkLCByZWplY3RlZCk7IH1cbiAgICAgICAgc3RlcCgoZ2VuZXJhdG9yID0gZ2VuZXJhdG9yLmFwcGx5KHRoaXNBcmcsIF9hcmd1bWVudHMgfHwgW10pKS5uZXh0KCkpO1xuICAgIH0pO1xufTtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbi8qKlxuICogRGlzcGxheSBkYXRhIHVuZGVyIHRhYmxlXG4gKi9cbmNsYXNzIFRhYmxlRGF0YSB7XG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHRoaXMuX21hcCA9IHt9O1xuICAgICAgICB0aGlzLl9saXN0ID0gW107XG4gICAgICAgIHRoaXMuX2lzQ29ubmVjdCA9IGZhbHNlO1xuICAgICAgICB0aGlzLl9jb25uZWN0U3RhdHVzID0gXCJcIjtcbiAgICAgICAgdGhpcy5faXNGZXRjaGVkID0gZmFsc2U7XG4gICAgICAgIHRoaXMuX2RiVVJMID0gXCJcIjtcbiAgICB9XG4gICAgZ2V0RGF0YSgpIHtcbiAgICAgICAgcmV0dXJuIF9fYXdhaXRlcih0aGlzLCB2b2lkIDAsIHZvaWQgMCwgZnVuY3Rpb24qICgpIHtcbiAgICAgICAgICAgIGxldCByZXMgPSB5aWVsZCBmZXRjaCh0aGlzLl9kYlVSTCwgeyBtZXRob2Q6IFwiR0VUXCIsIGNyZWRlbnRpYWxzOiAnaW5jbHVkZScgfSk7XG4gICAgICAgICAgICBpZiAoIXJlcy5vaykge1xuICAgICAgICAgICAgICAgIHRoaXMuX2lzQ29ubmVjdCA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIHRoaXMuX2Nvbm5lY3RTdGF0dXMgPSByZXMuc3RhdHVzVGV4dDtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLl9pc0Nvbm5lY3QgPSB0cnVlO1xuICAgICAgICAgICAgdGhpcy5fY29ubmVjdFN0YXR1cyA9IFwiXCI7XG4gICAgICAgICAgICBsZXQganNvbiA9IHlpZWxkIHJlcy5qc29uKCk7XG4gICAgICAgICAgICBpZiAoISFqc29uLmVycikge1xuICAgICAgICAgICAgICAgIHRoaXMuX2lzRmV0Y2hlZCA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIHRoaXMuX2Nvbm5lY3RTdGF0dXMgPSBqc29uLm1zZztcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLl9pc0ZldGNoZWQgPSB0cnVlO1xuICAgICAgICAgICAgdGhpcy5fY29ubmVjdFN0YXR1cyA9IFwiT0tcIjtcbiAgICAgICAgICAgIHRoaXMuX2xpc3QgPSBqc29uLmRhdGE7XG4gICAgICAgIH0pO1xuICAgIH1cbiAgICBnZXQgdGFibGUoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9tYXA7XG4gICAgfVxuICAgIGdldCBsaXN0KCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fbGlzdDtcbiAgICB9XG59XG5leHBvcnRzLmRlZmF1bHQgPSBUYWJsZURhdGE7XG4vLyMgc291cmNlTWFwcGluZ1VSTD1pbmRleC5qcy5tYXAiLCJcInVzZSBzdHJpY3RcIjtcbnZhciBfX2F3YWl0ZXIgPSAodGhpcyAmJiB0aGlzLl9fYXdhaXRlcikgfHwgZnVuY3Rpb24gKHRoaXNBcmcsIF9hcmd1bWVudHMsIFAsIGdlbmVyYXRvcikge1xuICAgIHJldHVybiBuZXcgKFAgfHwgKFAgPSBQcm9taXNlKSkoZnVuY3Rpb24gKHJlc29sdmUsIHJlamVjdCkge1xuICAgICAgICBmdW5jdGlvbiBmdWxmaWxsZWQodmFsdWUpIHsgdHJ5IHsgc3RlcChnZW5lcmF0b3IubmV4dCh2YWx1ZSkpOyB9IGNhdGNoIChlKSB7IHJlamVjdChlKTsgfSB9XG4gICAgICAgIGZ1bmN0aW9uIHJlamVjdGVkKHZhbHVlKSB7IHRyeSB7IHN0ZXAoZ2VuZXJhdG9yW1widGhyb3dcIl0odmFsdWUpKTsgfSBjYXRjaCAoZSkgeyByZWplY3QoZSk7IH0gfVxuICAgICAgICBmdW5jdGlvbiBzdGVwKHJlc3VsdCkgeyByZXN1bHQuZG9uZSA/IHJlc29sdmUocmVzdWx0LnZhbHVlKSA6IG5ldyBQKGZ1bmN0aW9uIChyZXNvbHZlKSB7IHJlc29sdmUocmVzdWx0LnZhbHVlKTsgfSkudGhlbihmdWxmaWxsZWQsIHJlamVjdGVkKTsgfVxuICAgICAgICBzdGVwKChnZW5lcmF0b3IgPSBnZW5lcmF0b3IuYXBwbHkodGhpc0FyZywgX2FyZ3VtZW50cyB8fCBbXSkpLm5leHQoKSk7XG4gICAgfSk7XG59O1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuY29uc3QgVGFibGVEYXRhXzEgPSByZXF1aXJlKFwiLi4vVGFibGVEYXRhXCIpO1xuY2xhc3MgQmFuZ1RodW9jIGV4dGVuZHMgVGFibGVEYXRhXzEuZGVmYXVsdCB7XG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHN1cGVyKCk7XG4gICAgICAgIHRoaXMuX2RiVVJMID0gXCIvYXBpL3RodW9jL1wiO1xuICAgIH1cbiAgICB1cGRhdGUoKSB7XG4gICAgICAgIHJldHVybiBfX2F3YWl0ZXIodGhpcywgdm9pZCAwLCB2b2lkIDAsIGZ1bmN0aW9uKiAoKSB7XG4gICAgICAgICAgICB5aWVsZCB0aGlzLmdldERhdGEoKTtcbiAgICAgICAgICAgIGZvciAobGV0IHJvdyBvZiB0aGlzLl9saXN0KSB7XG4gICAgICAgICAgICAgICAgbGV0IGlkID0gcm93WydpZCddO1xuICAgICAgICAgICAgICAgIHRoaXMuX21hcFtpZF0gPSByb3c7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH1cbn1cbmV4cG9ydHMuQmFuZ1RodW9jID0gQmFuZ1RodW9jO1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9QmFuZ1RodW9jLmpzLm1hcCIsIlwidXNlIHN0cmljdFwiO1xudmFyIF9fYXdhaXRlciA9ICh0aGlzICYmIHRoaXMuX19hd2FpdGVyKSB8fCBmdW5jdGlvbiAodGhpc0FyZywgX2FyZ3VtZW50cywgUCwgZ2VuZXJhdG9yKSB7XG4gICAgcmV0dXJuIG5ldyAoUCB8fCAoUCA9IFByb21pc2UpKShmdW5jdGlvbiAocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgICAgIGZ1bmN0aW9uIGZ1bGZpbGxlZCh2YWx1ZSkgeyB0cnkgeyBzdGVwKGdlbmVyYXRvci5uZXh0KHZhbHVlKSk7IH0gY2F0Y2ggKGUpIHsgcmVqZWN0KGUpOyB9IH1cbiAgICAgICAgZnVuY3Rpb24gcmVqZWN0ZWQodmFsdWUpIHsgdHJ5IHsgc3RlcChnZW5lcmF0b3JbXCJ0aHJvd1wiXSh2YWx1ZSkpOyB9IGNhdGNoIChlKSB7IHJlamVjdChlKTsgfSB9XG4gICAgICAgIGZ1bmN0aW9uIHN0ZXAocmVzdWx0KSB7IHJlc3VsdC5kb25lID8gcmVzb2x2ZShyZXN1bHQudmFsdWUpIDogbmV3IFAoZnVuY3Rpb24gKHJlc29sdmUpIHsgcmVzb2x2ZShyZXN1bHQudmFsdWUpOyB9KS50aGVuKGZ1bGZpbGxlZCwgcmVqZWN0ZWQpOyB9XG4gICAgICAgIHN0ZXAoKGdlbmVyYXRvciA9IGdlbmVyYXRvci5hcHBseSh0aGlzQXJnLCBfYXJndW1lbnRzIHx8IFtdKSkubmV4dCgpKTtcbiAgICB9KTtcbn07XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5jb25zdCBNb2RlbENsYXNzXzEgPSByZXF1aXJlKFwiLi4vTW9kZWxDbGFzc1wiKTtcbmNvbnN0IEJhbmdUaHVvY18xID0gcmVxdWlyZShcIi4vQmFuZ1RodW9jXCIpO1xuZXhwb3J0cy5CYW5nVGh1b2MgPSBCYW5nVGh1b2NfMS5CYW5nVGh1b2M7XG5jbGFzcyBUaHVvYyBleHRlbmRzIE1vZGVsQ2xhc3NfMS5Nb2RlbCB7XG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHN1cGVyKCk7XG4gICAgICAgIHRoaXMuZGF0YWJhc2UgPSBcIi9hcGkvdGh1b2MvXCI7XG4gICAgfVxuICAgIGdldChwYXJhbXMsIG9mZnNldCwgbGltaXQpIHtcbiAgICAgICAgcmV0dXJuIF9fYXdhaXRlcih0aGlzLCB2b2lkIDAsIHZvaWQgMCwgZnVuY3Rpb24qICgpIHtcbiAgICAgICAgICAgIHJldHVybiB5aWVsZCB0aGlzLl9nZXQoeyBxOiBwYXJhbXMsIG9mZnNldCwgbGltaXQgfSk7XG4gICAgICAgIH0pO1xuICAgIH1cbiAgICBjcmVhdGUoZGF0YSkge1xuICAgICAgICByZXR1cm4gX19hd2FpdGVyKHRoaXMsIHZvaWQgMCwgdm9pZCAwLCBmdW5jdGlvbiogKCkge1xuICAgICAgICAgICAgdGhpcy5yZXMgPSB5aWVsZCB0aGlzLl9wb3N0KGRhdGEpO1xuICAgICAgICAgICAgcmV0dXJuICghdGhpcy5yZXMuZXJyKTtcbiAgICAgICAgfSk7XG4gICAgfVxuICAgIGFkZChtYSwgc29MdW9uZywgdG9uZ0dpYSkge1xuICAgICAgICByZXR1cm4gX19hd2FpdGVyKHRoaXMsIHZvaWQgMCwgdm9pZCAwLCBmdW5jdGlvbiogKCkge1xuICAgICAgICAgICAgLy8gdGhpcy5yZXMgPSBhd2FpdCB0aGlzLl9wb3N0KCk7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH0pO1xuICAgIH1cbn1cbmV4cG9ydHMuVGh1b2MgPSBUaHVvYztcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWluZGV4LmpzLm1hcCIsIlwidXNlIHN0cmljdFwiO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuY29uc3QgVGh1b2NfMSA9IHJlcXVpcmUoXCIuLi9Nb2RlbC9UaHVvY1wiKTtcbmNvbnN0IFZpZXdUYWJsZV8xID0gcmVxdWlyZShcIi4vVmlld1RhYmxlXCIpO1xuY29uc3QgTWVudUNvbnRleHRfMSA9IHJlcXVpcmUoXCIuLi9NZW51Q29udGV4dFwiKTtcbmNsYXNzIFRodW9jVGFibGUgZXh0ZW5kcyBWaWV3VGFibGVfMS5WaWV3VGFibGUge1xuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICBzdXBlcigpO1xuICAgICAgICB0aGlzLmVsZW1lbnQgPSAkKFwiPHRhYmxlLz5cIikuYWRkQ2xhc3MoXCJ0YWJsZSB0YWJsZS1zdHJpcGVkIHRhYmxlLXZpZXdcIik7XG4gICAgICAgIHRoaXMuZWxlbWVudC5odG1sKGBcbiAgICAgICAgPHRoZWFkPlxuICAgICAgICAgICAgPHRyPlxuICAgICAgICAgICAgICAgIDx0aD5NYSBUaHVvYzwvdGg+XG4gICAgICAgICAgICAgICAgPHRoPlRlbiBUaHVvYzwvdGg+XG4gICAgICAgICAgICA8L3RyPlxuICAgICAgICA8L3RoZWFkPlxuICAgICAgICA8dGJvZHk+PC90Ym9keT5cbiAgICAgICAgYCk7XG4gICAgICAgIHRoaXMubW9kZWwgPSBuZXcgVGh1b2NfMS5UaHVvYygpO1xuICAgIH1cbiAgICBvbkNvbnRleHRBZGQoZnVuYykge1xuICAgICAgICB0aGlzLmZ1bmNDdHhBZGQgPSBmdW5jO1xuICAgIH1cbiAgICBvbkNvbnRleHRFZGl0KGZ1bmMpIHtcbiAgICAgICAgdGhpcy5mdW5jQ3R4RWRpdCA9IGZ1bmM7XG4gICAgfVxuICAgIG9uQ29udGV4dEVkaXRQcmljZShmdW5jKSB7XG4gICAgICAgIHRoaXMuZnVuY0N0eEVkaXRQcmljZSA9IGZ1bmM7XG4gICAgfVxuICAgIGN1c3RvbUNyZWF0ZVJvdyhyb3cpIHtcbiAgICAgICAgY29uc3QgY29udGV4dG1lbnUgPSBuZXcgTWVudUNvbnRleHRfMS5NZW51Q29udGV4dChyb3cpO1xuICAgICAgICBjb250ZXh0bWVudS5hZGRDb250ZXh0KHtcbiAgICAgICAgICAgIHRpdGxlOiBcIm5o4bqtcCB0aMOqbSB0aHXhu5FjXCIsXG4gICAgICAgICAgICBjbGFzc05hbWU6IFwidGV4dC1zdWNjZXNzXCIsXG4gICAgICAgICAgICBpY29uOiBcImZhcyBmYS1wbHVzLWNpcmNsZVwiLFxuICAgICAgICAgICAgY2xpY2s6IChlKSA9PiB7XG4gICAgICAgICAgICAgICAgdGhpcy5mdW5jQ3R4QWRkKCk7XG4gICAgICAgICAgICB9LFxuICAgICAgICB9KS5hZGRDb250ZXh0KHtcbiAgICAgICAgICAgIHRpdGxlOiBcInPhu61hIHRow7RuZyB0aW5cIixcbiAgICAgICAgICAgIGNsYXNzTmFtZTogXCJ0ZXh0LXByaW1hcnlcIixcbiAgICAgICAgICAgIGljb246IFwiZmFzIGZhLXBlbi1zcXVhcmVcIixcbiAgICAgICAgICAgIGNsaWNrOiAoZSkgPT4ge1xuICAgICAgICAgICAgICAgIHRoaXMuZnVuY0N0eEVkaXQoKTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgIH0pLmFkZENvbnRleHQoe1xuICAgICAgICAgICAgdGl0bGU6IFwiY2jhu4luaCBnacOhXCIsXG4gICAgICAgICAgICBpY29uOiBcImZhIGZhLWRvbGxhci1zaWduXCIsXG4gICAgICAgICAgICBjbGljazogKGUpID0+IHtcbiAgICAgICAgICAgICAgICB0aGlzLmZ1bmNDdHhFZGl0UHJpY2UoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfVxufVxuZXhwb3J0cy5UaHVvY1RhYmxlID0gVGh1b2NUYWJsZTtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPVRodW9jVGFibGUuanMubWFwIiwiXCJ1c2Ugc3RyaWN0XCI7XG52YXIgX19hd2FpdGVyID0gKHRoaXMgJiYgdGhpcy5fX2F3YWl0ZXIpIHx8IGZ1bmN0aW9uICh0aGlzQXJnLCBfYXJndW1lbnRzLCBQLCBnZW5lcmF0b3IpIHtcbiAgICByZXR1cm4gbmV3IChQIHx8IChQID0gUHJvbWlzZSkpKGZ1bmN0aW9uIChyZXNvbHZlLCByZWplY3QpIHtcbiAgICAgICAgZnVuY3Rpb24gZnVsZmlsbGVkKHZhbHVlKSB7IHRyeSB7IHN0ZXAoZ2VuZXJhdG9yLm5leHQodmFsdWUpKTsgfSBjYXRjaCAoZSkgeyByZWplY3QoZSk7IH0gfVxuICAgICAgICBmdW5jdGlvbiByZWplY3RlZCh2YWx1ZSkgeyB0cnkgeyBzdGVwKGdlbmVyYXRvcltcInRocm93XCJdKHZhbHVlKSk7IH0gY2F0Y2ggKGUpIHsgcmVqZWN0KGUpOyB9IH1cbiAgICAgICAgZnVuY3Rpb24gc3RlcChyZXN1bHQpIHsgcmVzdWx0LmRvbmUgPyByZXNvbHZlKHJlc3VsdC52YWx1ZSkgOiBuZXcgUChmdW5jdGlvbiAocmVzb2x2ZSkgeyByZXNvbHZlKHJlc3VsdC52YWx1ZSk7IH0pLnRoZW4oZnVsZmlsbGVkLCByZWplY3RlZCk7IH1cbiAgICAgICAgc3RlcCgoZ2VuZXJhdG9yID0gZ2VuZXJhdG9yLmFwcGx5KHRoaXNBcmcsIF9hcmd1bWVudHMgfHwgW10pKS5uZXh0KCkpO1xuICAgIH0pO1xufTtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmNsYXNzIFZpZXdUYWJsZSB7XG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIC8vIGNvbnN0cnVjdFxuICAgICAgICB0aGlzLm9mZnNldCA9IDA7XG4gICAgICAgIHRoaXMubGltaXQgPSAxMDtcbiAgICB9XG4gICAgLyoqXG4gICAgICogZ2V0IGRhdGEgd2l0aCBzZWFyY2ggdmFsdWVcbiAgICAgKiBAcGFyYW0gc2VhcmNoIGZpZWxkPXZhbHVlXG4gICAgICovXG4gICAgdXBkYXRlKHNlYXJjaCkge1xuICAgICAgICByZXR1cm4gX19hd2FpdGVyKHRoaXMsIHZvaWQgMCwgdm9pZCAwLCBmdW5jdGlvbiogKCkge1xuICAgICAgICAgICAgLy8gcmVuZGVyIGRhdGEgdG8gZWxlbWVudFxuICAgICAgICAgICAgY29uc3QgcmF3RGF0YSA9IHlpZWxkIHRoaXMubW9kZWwuZ2V0KHNlYXJjaCwgdGhpcy5vZmZzZXQsIHRoaXMubGltaXQpO1xuICAgICAgICAgICAgdGhpcy5kYXRhID0gQXJyYXkuZnJvbShyYXdEYXRhKS5tYXAoKHZhbCkgPT4ge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmZpbHRlckRhdGFSb3codmFsKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgdGhpcy5zaXplT2ZSZWNvcmQgPSB0aGlzLmRhdGEubGVuZ3RoO1xuICAgICAgICAgICAgdGhpcy5jdXJyZW50UG9zID0gLTE7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5kYXRhO1xuICAgICAgICB9KTtcbiAgICB9XG4gICAgcmVuZGVyKHNlYXJjaCkge1xuICAgICAgICByZXR1cm4gX19hd2FpdGVyKHRoaXMsIHZvaWQgMCwgdm9pZCAwLCBmdW5jdGlvbiogKCkge1xuICAgICAgICAgICAgY29uc3QgZGF0YSA9IHlpZWxkIHRoaXMudXBkYXRlKHNlYXJjaCk7XG4gICAgICAgICAgICBjb25zdCB0Ym9keSA9IHRoaXMuX2NyZWF0ZVRhYmxlQm9keShkYXRhKTtcbiAgICAgICAgICAgIHRoaXMuZWxlbWVudC5maW5kKFwidGJvZHlcIikuaHRtbChcIlwiKS5hcHBlbmQodGJvZHkuY2hpbGRyZW4oKSk7XG4gICAgICAgIH0pO1xuICAgIH1cbiAgICBzZXRFbGVtZW50KGVsKSB7XG4gICAgICAgIHRoaXMuZWxlbWVudCA9IGVsO1xuICAgIH1cbiAgICBnZXRFbGVtZW50KCkge1xuICAgICAgICByZXR1cm4gdGhpcy5lbGVtZW50O1xuICAgIH1cbiAgICBjdXJyZW50RGF0YSgpIHtcbiAgICAgICAgaWYgKCF0aGlzLmN1cnJlbnRSb3dEYXRhKSB7XG4gICAgICAgICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBPYmplY3QuYXNzaWduKHt9LCB0aGlzLmN1cnJlbnRSb3dEYXRhKTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogYXR0YWNoIGV2ZW50IG9mIGNob29zZVxuICAgICAqIEBwYXJhbSBjYWxsYmFjayBjYWxsYmFjayBmdW5jdGlvbiB3aGVuIHRoZSByb3cgb2YgcmVjb3JkIGlzIGNob29zZWRcbiAgICAgKi9cbiAgICBvbkNob29zZShjYWxsYmFjaykge1xuICAgICAgICB0aGlzLmZ1bmNPbkNob29zZSA9IGNhbGxiYWNrO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBhdHRhY2ggZXZlbnQgb2YgaG92ZXJcbiAgICAgKiBAcGFyYW0gY2FsbGJhY2sgY2FsbGJhY2sgZnVuY3Rpb24gd2hlbiB0aGUgcm93IG9mIHJlY29yZCBpcyBob3ZlciBvblxuICAgICAqL1xuICAgIG9uRm9jdXMoY2FsbGJhY2spIHtcbiAgICAgICAgdGhpcy5mdW5jT25Gb2N1cyA9IGNhbGxiYWNrO1xuICAgIH1cbiAgICBzZWxlY3REb3duKCkge1xuICAgICAgICBpZiAodGhpcy5jdXJyZW50UG9zIDwgdGhpcy5zaXplT2ZSZWNvcmQgLSAxKSB7XG4gICAgICAgICAgICArK3RoaXMuY3VycmVudFBvcztcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmVsZW1lbnQuZmluZChgdHJbZGF0YS1wb3M9JHt0aGlzLmN1cnJlbnRQb3N9XWApLmZvY3VzKCk7XG4gICAgfVxuICAgIHNlbGVjdFVwKCkge1xuICAgICAgICBpZiAodGhpcy5jdXJyZW50UG9zID4gMCkge1xuICAgICAgICAgICAgLS10aGlzLmN1cnJlbnRQb3M7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5lbGVtZW50LmZpbmQoYHRyW2RhdGEtcG9zPSR7dGhpcy5jdXJyZW50UG9zfV1gKS5mb2N1cygpO1xuICAgIH1cbiAgICBuZXh0UGFnZShzZWFyY2ggPSBcIlwiKSB7XG4gICAgICAgIHRoaXMub2Zmc2V0ICs9IHRoaXMubGltaXQ7XG4gICAgICAgIHRoaXMucmVuZGVyKHNlYXJjaCk7XG4gICAgfVxuICAgIHNldExpbWl0UGVyUGFnZShsaW1pdCkge1xuICAgICAgICB0aGlzLmxpbWl0ID0gbGltaXQ7XG4gICAgfVxuICAgIHNldE9mZnNldChvZmZzZXQpIHtcbiAgICAgICAgdGhpcy5vZmZzZXQgPSBvZmZzZXQ7XG4gICAgfVxuICAgIGZpbHRlckRhdGFSb3coZGF0YVJvdykge1xuICAgICAgICAvLyBub3RoaW5nIGhlcmUsIGp1c3QgcmF3XG4gICAgICAgIHJldHVybiBkYXRhUm93O1xuICAgIH1cbiAgICBfY3JlYXRlUm93KGRhdGFSb3csIHBvcykge1xuICAgICAgICBjb25zdCByb3cgPSAkKFwiPHRyLz5cIikuYXR0cihcInRhYmluZGV4XCIsIC0xKS5hdHRyKFwiZGF0YS1wb3NcIiwgcG9zKTtcbiAgICAgICAgZm9yIChjb25zdCBmaWVsZCBvZiBPYmplY3Qua2V5cyhkYXRhUm93KSkge1xuICAgICAgICAgICAgY29uc3QgY2VsbCA9ICQoXCI8dGQvPlwiKS5hdHRyKFwibmFtZVwiLCBmaWVsZCkudGV4dChkYXRhUm93W2ZpZWxkXSk7XG4gICAgICAgICAgICByb3cuYXBwZW5kKGNlbGwpO1xuICAgICAgICB9XG4gICAgICAgIC8vIGNob29zZSBldmVudFxuICAgICAgICB0aGlzLl9yb3dPbkNob29zZShyb3csICgpID0+IHtcbiAgICAgICAgICAgIHRoaXMuZnVuY09uQ2hvb3NlKGRhdGFSb3cpO1xuICAgICAgICB9KTtcbiAgICAgICAgLy8gaG92ZXIgZXZlbnRcbiAgICAgICAgcm93Lm9uKFwiY2xpY2sgZm9jdXNcIiwgKGUpID0+IHtcbiAgICAgICAgICAgIHRoaXMuZWxlbWVudC5maW5kKFwidHJcIikucmVtb3ZlQ2xhc3MoXCJhY3RpdmVcIik7XG4gICAgICAgICAgICByb3cuYWRkQ2xhc3MoXCJhY3RpdmVcIik7XG4gICAgICAgICAgICB0aGlzLmN1cnJlbnRQb3MgPSBwb3M7XG4gICAgICAgICAgICB0aGlzLmN1cnJlbnRSb3dEYXRhID0gZGF0YVJvdztcbiAgICAgICAgICAgIHRoaXMuZnVuY09uRm9jdXMoZGF0YVJvdyk7XG4gICAgICAgIH0pO1xuICAgICAgICB0aGlzLmN1c3RvbUNyZWF0ZVJvdyhyb3cpO1xuICAgICAgICByZXR1cm4gcm93O1xuICAgIH1cbiAgICBfY3JlYXRlVGFibGVCb2R5KGRhdGEpIHtcbiAgICAgICAgY29uc3QgdGJvZHkgPSAkKFwiPHRib2R5Lz5cIik7XG4gICAgICAgIGxldCBwb3MgPSAwO1xuICAgICAgICBmb3IgKGNvbnN0IHJvd0RhdGEgb2YgZGF0YSkge1xuICAgICAgICAgICAgY29uc3QgdHJvdyA9IHRoaXMuX2NyZWF0ZVJvdyhyb3dEYXRhLCBwb3MrKyk7XG4gICAgICAgICAgICB0Ym9keS5hcHBlbmQodHJvdyk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRib2R5O1xuICAgIH1cbiAgICBjdXN0b21DcmVhdGVSb3cocm93KSB7XG4gICAgICAgIC8vIG5vdGhpbmcgaGVyZSwgd2lsbCBjaGFuZ2UgaW4gaW5oZXJpdGFuY2VcbiAgICB9XG4gICAgX3Jvd09uQ2hvb3NlKHJvdywgY2FsbGJhY2spIHtcbiAgICAgICAgcm93Lm9uKFwia2V5ZG93blwiLCAoZSkgPT4ge1xuICAgICAgICAgICAgaWYgKGUua2V5Q29kZSA9PT0gMTMpIHtcbiAgICAgICAgICAgICAgICBjYWxsYmFjaygpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgcm93Lm9uKFwiZGJsY2xpY2tcIiwgKCkgPT4ge1xuICAgICAgICAgICAgY2FsbGJhY2soKTtcbiAgICAgICAgfSk7XG4gICAgfVxufVxuZXhwb3J0cy5WaWV3VGFibGUgPSBWaWV3VGFibGU7XG4vLyMgc291cmNlTWFwcGluZ1VSTD1WaWV3VGFibGUuanMubWFwIiwiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5mdW5jdGlvbiBnZXRGb3JtVmFsdWUoZm9ybSkge1xuICAgIGNvbnN0IGFyciA9IGZvcm0uc2VyaWFsaXplQXJyYXkoKTtcbiAgICBjb25zdCB2YWwgPSB7fTtcbiAgICBmb3IgKGNvbnN0IGlucHV0IG9mIGFycikge1xuICAgICAgICB2YWxbaW5wdXQubmFtZV0gPSBpbnB1dC52YWx1ZTtcbiAgICB9XG4gICAgcmV0dXJuIHZhbDtcbn1cbmV4cG9ydHMuZ2V0Rm9ybVZhbHVlID0gZ2V0Rm9ybVZhbHVlO1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9Zm9ybVZhbC5qcy5tYXAiLCJcInVzZSBzdHJpY3RcIjtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmNvbnN0IEF1dG9Db21wbGV0ZV8xID0gcmVxdWlyZShcIi4uL0F1dG9Db21wbGV0ZVwiKTtcbmZ1bmN0aW9uIGluaXQoYXBwKSB7XG4gICAgY29uc3QgYXV0b2NvbXBsZXRlID0gbmV3IEF1dG9Db21wbGV0ZV8xLkF1dG9Db21wbGV0ZShcIm5oYXBfaG9hX2Rvbi0tdGVuX3RodW9jXCIsIGFwcC50aHVvYyk7XG4gICAgYXV0b2NvbXBsZXRlLnNldExvb2t1cChbXCJtYVwiLCBcInRlblwiLCBcIm5jY1wiLCBcImRvbl92aVwiLCBcImRvbl9naWFcIl0pO1xuICAgIGF1dG9jb21wbGV0ZS5saXN0ZW4oKTtcbiAgICBhdXRvY29tcGxldGUub25DaG9vc2UoKGRhdGEpID0+IHtcbiAgICAgICAgJChcIiNuaGFwX2hvYV9kb24tLW1hX3RodW9jXCIpLnZhbChkYXRhLm1hKTtcbiAgICAgICAgJChcIiNuaGFwX2hvYV9kb24tLXRlbl90aHVvY1wiKS52YWwoZGF0YS50ZW4pO1xuICAgICAgICAkKFwiI25oYXBfaG9hX2Rvbi0tbmNjXCIpLnZhbChkYXRhLm5jYyk7XG4gICAgICAgICQoXCIjbmhhcF9ob2FfZG9uLS1naWFcIikudmFsKGRhdGEuZG9uX2dpYSk7XG4gICAgICAgICQoXCIjbmhhcF9ob2FfZG9uLS1kb25fdmlcIikudmFsKGRhdGEuZG9uX3ZpKTtcbiAgICB9KTtcbn1cbmV4cG9ydHMuaW5pdCA9IGluaXQ7XG4vLyMgc291cmNlTWFwcGluZ1VSTD1pbmRleC5qcy5tYXAiLCJcInVzZSBzdHJpY3RcIjtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmNvbnN0IFRodW9jVGFibGVfMSA9IHJlcXVpcmUoXCIuLi9WaWV3L1RodW9jVGFibGVcIik7XG5jb25zdCB0aHVvY19tb2RhbF8xID0gcmVxdWlyZShcIi4vdGh1b2MtbW9kYWxcIik7XG5jb25zdCBQQUdFX0lEID0gXCJwYWdlLW5oYXAtdGh1b2NcIjtcbmNsYXNzIEluaXQge1xuICAgIGNvbnN0cnVjdG9yKGFwcCkge1xuICAgICAgICBjb25zdCB0aHVvY1RhYmxlID0gbmV3IFRodW9jVGFibGVfMS5UaHVvY1RhYmxlKCk7XG4gICAgICAgIHRoaXMudGh1b2NUYWJsZSA9IHRodW9jVGFibGU7XG4gICAgICAgIHRoaXMuYXBwID0gYXBwO1xuICAgICAgICB0aHVvY1RhYmxlLnNldEVsZW1lbnQoJChcIiNuaGFwX3RodW9jLS10YWJsZVwiKSk7XG4gICAgICAgIHRodW9jVGFibGUuc2V0TGltaXRQZXJQYWdlKDEwMCk7XG4gICAgICAgIHRodW9jVGFibGUub25DaG9vc2UoKGRhdGEpID0+IHtcbiAgICAgICAgICAgIHRoaXMuYWRkVGh1b2MoZGF0YSk7XG4gICAgICAgIH0pO1xuICAgICAgICB0aHVvY1RhYmxlLm9uRm9jdXMoKGRhdGEpID0+IHtcbiAgICAgICAgICAgICQoXCIudGh1b2MtLWJ1dHRvblwiKS5yZW1vdmVBdHRyKFwiZGlzYWJsZWRcIik7XG4gICAgICAgIH0pO1xuICAgICAgICB0aHVvY1RhYmxlLm9uQ29udGV4dEFkZCgoKSA9PiB7XG4gICAgICAgICAgICB0aGlzLmFkZFRodW9jKHRodW9jVGFibGUuY3VycmVudERhdGEoKSk7XG4gICAgICAgIH0pO1xuICAgICAgICB0aHVvY1RhYmxlLm9uQ29udGV4dEVkaXQoKCkgPT4ge1xuICAgICAgICAgICAgdGhpcy5lZGl0VGh1b2ModGh1b2NUYWJsZS5jdXJyZW50RGF0YSgpKTtcbiAgICAgICAgfSk7XG4gICAgICAgIHRodW9jVGFibGUub25Db250ZXh0RWRpdFByaWNlKCgpID0+IHtcbiAgICAgICAgICAgIHRoaXMuZWRpdFByaWNlVGh1b2ModGh1b2NUYWJsZS5jdXJyZW50RGF0YSgpKTtcbiAgICAgICAgfSk7XG4gICAgICAgIHRodW9jVGFibGUucmVuZGVyKFwiXCIpO1xuICAgICAgICB0aGlzLmhhbmRsZUNvbnRyb2xLZXkoYXBwKTtcbiAgICAgICAgdGhpcy5oYW5kbGVTZWxlY3RLZXkoYXBwKTtcbiAgICAgICAgdGhpcy5oYW5kbGVNb2RhbEV2ZW50KCk7XG4gICAgICAgIHRoaXMuaGFuZGxlU2VhcmNoSW5wdXQoKTtcbiAgICAgICAgY29uc3QgJHRoaXMgPSB0aGlzO1xuICAgICAgICAkKFwiLnRodW9jLS1idXR0b25cIikub24oXCJjbGlja1wiLCBmdW5jdGlvbiBCdXR0b25DbGljaygpIHtcbiAgICAgICAgICAgIGNvbnN0IHJvbGUgPSAkKHRoaXMpLmF0dHIoXCJhcHAtcm9sZVwiKTtcbiAgICAgICAgICAgIHN3aXRjaCAocm9sZSkge1xuICAgICAgICAgICAgICAgIGNhc2UgXCJuZXdcIjpcbiAgICAgICAgICAgICAgICAgICAgJHRoaXMubmV3VGh1b2MoKTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgY2FzZSBcImVkaXRcIjpcbiAgICAgICAgICAgICAgICAgICAgJHRoaXMuZWRpdFRodW9jKHRodW9jVGFibGUuY3VycmVudERhdGEoKSk7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGNhc2UgXCJhZGRcIjpcbiAgICAgICAgICAgICAgICAgICAgJHRoaXMuYWRkVGh1b2ModGh1b2NUYWJsZS5jdXJyZW50RGF0YSgpKTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgY2FzZSBcImNoaW5oLWdpYVwiOlxuICAgICAgICAgICAgICAgICAgICAkdGhpcy5lZGl0UHJpY2VUaHVvYyh0aHVvY1RhYmxlLmN1cnJlbnREYXRhKCkpO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfVxuICAgIGhhbmRsZVNlbGVjdEtleShhcHApIHtcbiAgICAgICAgYXBwLm9uU2hvcnRjdXRLZXkoXCJBcnJvd1VwXCIsIFBBR0VfSUQsIChlKSA9PiB7XG4gICAgICAgICAgICB0aGlzLnRodW9jVGFibGUuc2VsZWN0VXAoKTtcbiAgICAgICAgfSk7XG4gICAgICAgIGFwcC5vblNob3J0Y3V0S2V5KFwiQXJyb3dEb3duXCIsIFBBR0VfSUQsIChlKSA9PiB7XG4gICAgICAgICAgICB0aGlzLnRodW9jVGFibGUuc2VsZWN0RG93bigpO1xuICAgICAgICB9KTtcbiAgICB9XG4gICAgaGFuZGxlQ29udHJvbEtleShhcHApIHtcbiAgICAgICAgYXBwLm9uU2hvcnRjdXRLZXkoXCJjdHJsK2RcIiwgUEFHRV9JRCwgKGUpID0+IHtcbiAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgIHRoaXMubmV3VGh1b2MoKTtcbiAgICAgICAgfSk7XG4gICAgICAgIGFwcC5vblNob3J0Y3V0S2V5KFwiY3RybCtlXCIsIFBBR0VfSUQsIChlKSA9PiB7XG4gICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICB0aGlzLmVkaXRUaHVvYyh0aGlzLnRodW9jVGFibGUuY3VycmVudERhdGEoKSk7XG4gICAgICAgIH0pO1xuICAgICAgICBhcHAub25TaG9ydGN1dEtleShcImN0cmwrZ1wiLCBQQUdFX0lELCAoZSkgPT4ge1xuICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgdGhpcy5lZGl0UHJpY2VUaHVvYyh0aGlzLnRodW9jVGFibGUuY3VycmVudERhdGEoKSk7XG4gICAgICAgIH0pO1xuICAgICAgICBhcHAub25TaG9ydGN1dEtleShcImN0cmwrZlwiLCBQQUdFX0lELCAoZSkgPT4ge1xuICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgJChcIiN0aHVvYy0tc2VhcmNoXCIpLmZvY3VzKCk7XG4gICAgICAgIH0pO1xuICAgIH1cbiAgICBoYW5kbGVTZWFyY2hJbnB1dCgpIHtcbiAgICAgICAgY29uc3QgJHRoaXMgPSB0aGlzO1xuICAgICAgICAkKFwiI3RodW9jLS1zZWFyY2hcIikub24oXCJrZXl1cFwiLCBmdW5jdGlvbiBTZWFyY2hpbmcoKSB7XG4gICAgICAgICAgICBjb25zdCB2YWwgPSAkKHRoaXMpLnZhbCgpO1xuICAgICAgICAgICAgJHRoaXMudGh1b2NUYWJsZS5yZW5kZXIodmFsKTtcbiAgICAgICAgfSk7XG4gICAgfVxuICAgIGhhbmRsZU1vZGFsRXZlbnQoKSB7XG4gICAgICAgIHRoaXMuYWRkTW9kYWwgPSBuZXcgdGh1b2NfbW9kYWxfMS5BZGRUaHVvY01vZGFsKFwidGh1b2MtLWFkZC1tb2RhbFwiLCB0aGlzLmFwcC50aHVvYyk7XG4gICAgICAgIHRoaXMubmV3TW9kYWwgPSBuZXcgdGh1b2NfbW9kYWxfMS5OZXdUaHVvY01vZGFsKFwidGh1b2MtLW5ldy1tb2RhbFwiLCB0aGlzLmFwcCk7XG4gICAgICAgIHRoaXMuZWRpdE1vZGFsID0gbmV3IHRodW9jX21vZGFsXzEuRWRpdFRodW9jTW9kYWwoXCJ0aHVvYy0tZWRpdC1tb2RhbFwiLCB0aGlzLmFwcC50aHVvYyk7XG4gICAgICAgIHRoaXMuZWRpdFByaWNlTW9kYWwgPSBuZXcgdGh1b2NfbW9kYWxfMS5FZGl0UHJpY2VUaHVvY01vZGFsKFwidGh1b2MtLWVkaXQtcHJpY2UtbW9kYWxcIiwgdGhpcy5hcHAudGh1b2MpO1xuICAgIH1cbiAgICBlZGl0VGh1b2MoZGF0YSkge1xuICAgICAgICBpZiAoIWRhdGEpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICAkKFwiI3RodW9jLS1lZGl0LW1vZGFsXCIpLm1vZGFsKFwic2hvd1wiKTtcbiAgICAgICAgJChcIiN0aHVvYy0tZWRpdC1tYXRodW9jXCIpLnZhbChkYXRhLm1hKTtcbiAgICAgICAgJChcIiN0aHVvYy0tZWRpdC10ZW50aHVvY1wiKS52YWwoZGF0YS50ZW4pO1xuICAgICAgICAkKFwiI3RodW9jLS1lZGl0LW5jY1wiKS52YWwoZGF0YS50ZW5fbmNjKTtcbiAgICB9XG4gICAgbmV3VGh1b2MoKSB7XG4gICAgICAgICQoXCIjdGh1b2MtLW5ldy1tb2RhbFwiKS5tb2RhbChcInNob3dcIik7XG4gICAgfVxuICAgIGFkZFRodW9jKGRhdGEpIHtcbiAgICAgICAgaWYgKCFkYXRhKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgJChcIiN0aHVvYy0tYWRkLW1vZGFsXCIpLm1vZGFsKFwic2hvd1wiKTtcbiAgICAgICAgJChcIiN0aHVvYy0tYWRkLW1hdGh1b2NcIikudmFsKGRhdGEubWEpO1xuICAgICAgICAkKFwiI3RodW9jLS1hZGQtdGVudGh1b2NcIikudmFsKGRhdGEudGVuKTtcbiAgICAgICAgJChcIiN0aHVvYy0tYWRkLW5jY1wiKS52YWwoZGF0YS50ZW5fbmNjKTtcbiAgICAgICAgJChcIiN0aHVvYy0tYWRkLXNvbHVvbmdcIikudmFsKGRhdGEuc29fbHVvbmcpO1xuICAgIH1cbiAgICBlZGl0UHJpY2VUaHVvYyhkYXRhKSB7XG4gICAgICAgIGlmICghZGF0YSkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgICQoXCIjdGh1b2MtLWVkaXQtcHJpY2UtbW9kYWxcIikubW9kYWwoXCJzaG93XCIpO1xuICAgICAgICAkKFwiI3RodW9jLS1lZGl0LXByaWNlLW1hdGh1b2NcIikudmFsKGRhdGEubWEpO1xuICAgICAgICAkKFwiI3RodW9jLS1lZGl0LXByaWNlLXRlbnRodW9jXCIpLnZhbChkYXRhLnRlbik7XG4gICAgfVxufVxuZnVuY3Rpb24gaW5pdChhcHApIHtcbiAgICByZXR1cm4gbmV3IEluaXQoYXBwKTtcbn1cbmV4cG9ydHMuaW5pdCA9IGluaXQ7XG4vLyMgc291cmNlTWFwcGluZ1VSTD1pbmRleC5qcy5tYXAiLCJcInVzZSBzdHJpY3RcIjtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmNsYXNzIEFkZFRodW9jTW9kYWwge1xuICAgIGNvbnN0cnVjdG9yKGlkLCBtb2RlbCkge1xuICAgICAgICB0aGlzLm1vZGVsID0gbW9kZWw7XG4gICAgICAgIHRoaXMucG9wdXAgPSAkKFwiI1wiICsgaWQpO1xuICAgICAgICB0aGlzLnBvcHVwLmxvYWQoXCIvbGF5b3V0cy9tb2RhbC1hZGQtdGh1b2MuaHRtbFwiKTtcbiAgICB9XG4gICAgc2hvdygpIHtcbiAgICAgICAgdGhpcy5wb3B1cC5tb2RhbChcInNob3dcIik7XG4gICAgfVxuICAgIGhpZGUoKSB7XG4gICAgICAgIHRoaXMucG9wdXAubW9kYWwoXCJoaWRlXCIpO1xuICAgIH1cbn1cbmV4cG9ydHMuQWRkVGh1b2NNb2RhbCA9IEFkZFRodW9jTW9kYWw7XG4vLyMgc291cmNlTWFwcGluZ1VSTD10aHVvYy1hZGQtbW9kYWwuanMubWFwIiwiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5jbGFzcyBFZGl0VGh1b2NNb2RhbCB7XG4gICAgY29uc3RydWN0b3IoaWQsIG1vZGVsKSB7XG4gICAgICAgIHRoaXMubW9kZWwgPSBtb2RlbDtcbiAgICAgICAgdGhpcy5wb3B1cCA9ICQoXCIjXCIgKyBpZCk7XG4gICAgICAgIHRoaXMucG9wdXAubG9hZChcIi9sYXlvdXRzL21vZGFsLWVkaXQtdGh1b2MuaHRtbFwiKTtcbiAgICB9XG4gICAgc2hvdygpIHtcbiAgICAgICAgdGhpcy5wb3B1cC5tb2RhbChcInNob3dcIik7XG4gICAgfVxuICAgIGhpZGUoKSB7XG4gICAgICAgIHRoaXMucG9wdXAubW9kYWwoXCJoaWRlXCIpO1xuICAgIH1cbn1cbmV4cG9ydHMuRWRpdFRodW9jTW9kYWwgPSBFZGl0VGh1b2NNb2RhbDtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPXRodW9jLWVkaXQtbW9kYWwuanMubWFwIiwiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5jbGFzcyBFZGl0UHJpY2VUaHVvY01vZGFsIHtcbiAgICBjb25zdHJ1Y3RvcihpZCwgbW9kZWwpIHtcbiAgICAgICAgdGhpcy5tb2RlbCA9IG1vZGVsO1xuICAgICAgICB0aGlzLnBvcHVwID0gJChcIiNcIiArIGlkKTtcbiAgICAgICAgdGhpcy5wb3B1cC5sb2FkKFwiL2xheW91dHMvbW9kYWwtZWRpdC1wcmljZS10aHVvYy5odG1sXCIpO1xuICAgIH1cbiAgICBzaG93KCkge1xuICAgICAgICB0aGlzLnBvcHVwLm1vZGFsKFwic2hvd1wiKTtcbiAgICB9XG4gICAgaGlkZSgpIHtcbiAgICAgICAgdGhpcy5wb3B1cC5tb2RhbChcImhpZGVcIik7XG4gICAgfVxufVxuZXhwb3J0cy5FZGl0UHJpY2VUaHVvY01vZGFsID0gRWRpdFByaWNlVGh1b2NNb2RhbDtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPXRodW9jLWVkaXQtcHJpY2UtbW9kYWwuanMubWFwIiwiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5jb25zdCB0aHVvY19hZGRfbW9kYWxfMSA9IHJlcXVpcmUoXCIuL3RodW9jLWFkZC1tb2RhbFwiKTtcbmV4cG9ydHMuQWRkVGh1b2NNb2RhbCA9IHRodW9jX2FkZF9tb2RhbF8xLkFkZFRodW9jTW9kYWw7XG5jb25zdCB0aHVvY19lZGl0X21vZGFsXzEgPSByZXF1aXJlKFwiLi90aHVvYy1lZGl0LW1vZGFsXCIpO1xuZXhwb3J0cy5FZGl0VGh1b2NNb2RhbCA9IHRodW9jX2VkaXRfbW9kYWxfMS5FZGl0VGh1b2NNb2RhbDtcbmNvbnN0IHRodW9jX25ld19tb2RhbF8xID0gcmVxdWlyZShcIi4vdGh1b2MtbmV3LW1vZGFsXCIpO1xuZXhwb3J0cy5OZXdUaHVvY01vZGFsID0gdGh1b2NfbmV3X21vZGFsXzEuTmV3VGh1b2NNb2RhbDtcbmNvbnN0IHRodW9jX2VkaXRfcHJpY2VfbW9kYWxfMSA9IHJlcXVpcmUoXCIuL3RodW9jLWVkaXQtcHJpY2UtbW9kYWxcIik7XG5leHBvcnRzLkVkaXRQcmljZVRodW9jTW9kYWwgPSB0aHVvY19lZGl0X3ByaWNlX21vZGFsXzEuRWRpdFByaWNlVGh1b2NNb2RhbDtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPXRodW9jLW1vZGFsLmpzLm1hcCIsIlwidXNlIHN0cmljdFwiO1xudmFyIF9fYXdhaXRlciA9ICh0aGlzICYmIHRoaXMuX19hd2FpdGVyKSB8fCBmdW5jdGlvbiAodGhpc0FyZywgX2FyZ3VtZW50cywgUCwgZ2VuZXJhdG9yKSB7XG4gICAgcmV0dXJuIG5ldyAoUCB8fCAoUCA9IFByb21pc2UpKShmdW5jdGlvbiAocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgICAgIGZ1bmN0aW9uIGZ1bGZpbGxlZCh2YWx1ZSkgeyB0cnkgeyBzdGVwKGdlbmVyYXRvci5uZXh0KHZhbHVlKSk7IH0gY2F0Y2ggKGUpIHsgcmVqZWN0KGUpOyB9IH1cbiAgICAgICAgZnVuY3Rpb24gcmVqZWN0ZWQodmFsdWUpIHsgdHJ5IHsgc3RlcChnZW5lcmF0b3JbXCJ0aHJvd1wiXSh2YWx1ZSkpOyB9IGNhdGNoIChlKSB7IHJlamVjdChlKTsgfSB9XG4gICAgICAgIGZ1bmN0aW9uIHN0ZXAocmVzdWx0KSB7IHJlc3VsdC5kb25lID8gcmVzb2x2ZShyZXN1bHQudmFsdWUpIDogbmV3IFAoZnVuY3Rpb24gKHJlc29sdmUpIHsgcmVzb2x2ZShyZXN1bHQudmFsdWUpOyB9KS50aGVuKGZ1bGZpbGxlZCwgcmVqZWN0ZWQpOyB9XG4gICAgICAgIHN0ZXAoKGdlbmVyYXRvciA9IGdlbmVyYXRvci5hcHBseSh0aGlzQXJnLCBfYXJndW1lbnRzIHx8IFtdKSkubmV4dCgpKTtcbiAgICB9KTtcbn07XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5jb25zdCBmb3JtVmFsXzEgPSByZXF1aXJlKFwiLi4vZm9ybVZhbFwiKTtcbmNsYXNzIE5ld1RodW9jTW9kYWwge1xuICAgIGNvbnN0cnVjdG9yKGlkLCBhcHApIHtcbiAgICAgICAgdGhpcy5hcHAgPSBhcHA7XG4gICAgICAgIHRoaXMucG9wdXAgPSAkKFwiI1wiICsgaWQpO1xuICAgICAgICB0aGlzLnBvcHVwLmxvYWQoXCIvbGF5b3V0cy9tb2RhbC1uZXctdGh1b2MuaHRtbFwiLCAoKSA9PiB7XG4gICAgICAgICAgICB0aGlzLmFwcC5kb25WaS5nZXQoKGRhdGEpID0+IHtcbiAgICAgICAgICAgICAgICBjb25zdCBzZWxlY3RJbnB1dCA9IHRoaXMucG9wdXAuZmluZChcIltjb21wb25lbnQ9J0RvblZpJ11cIik7XG4gICAgICAgICAgICAgICAgc2VsZWN0SW5wdXQuY2hpbGRyZW4oKS5yZW1vdmUoKTtcbiAgICAgICAgICAgICAgICBmb3IgKGNvbnN0IHJvdyBvZiBkYXRhKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IG9wdCA9ICQoXCI8b3B0aW9uLz5cIikudmFsKHJvdy5pZCkudGV4dChyb3cudGVuKTtcbiAgICAgICAgICAgICAgICAgICAgc2VsZWN0SW5wdXQuYXBwZW5kKG9wdCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHNlbGVjdElucHV0LmNoaWxkcmVuKCkuZXEoMCkuYXR0cihcImNoZWNrZWRcIiwgXCJ0cnVlXCIpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB0aGlzLnBvcHVwLmZpbmQoXCJmb3JtXCIpLm9uKFwic3VibWl0XCIsIGZ1bmN0aW9uIChlKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIF9fYXdhaXRlcih0aGlzLCB2b2lkIDAsIHZvaWQgMCwgZnVuY3Rpb24qICgpIHtcbiAgICAgICAgICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBmb3JtVmFsID0gZm9ybVZhbF8xLmdldEZvcm1WYWx1ZSgkKHRoaXMpKTtcbiAgICAgICAgICAgICAgICAgICAgeWllbGQgYXBwLnRodW9jLmNyZWF0ZShmb3JtVmFsKS5jYXRjaCgoZXJyKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBhbGVydChlcnIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhyb3cgZXJyO1xuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgYWxlcnQoXCJzdWNjZXNzXCIpO1xuICAgICAgICAgICAgICAgICAgICB3aW5kb3cubG9jYXRpb24ucmVsb2FkKCk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgfVxuICAgIHNob3coKSB7XG4gICAgICAgIHRoaXMucG9wdXAubW9kYWwoXCJzaG93XCIpO1xuICAgIH1cbiAgICBoaWRlKCkge1xuICAgICAgICB0aGlzLnBvcHVwLm1vZGFsKFwiaGlkZVwiKTtcbiAgICB9XG59XG5leHBvcnRzLk5ld1RodW9jTW9kYWwgPSBOZXdUaHVvY01vZGFsO1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9dGh1b2MtbmV3LW1vZGFsLmpzLm1hcCIsImNvbnN0IHtBcHB9ID0gcmVxdWlyZSgnLi4vYXBwL0FwcCcpO1xuXG4kKGRvY3VtZW50KS5yZWFkeSgoKT0+e1xuICAgIGNvbnN0IGFwcCA9IG5ldyBBcHAoKTtcblxuICAgIHJlcXVpcmUoXCIuLi9hcHAvbmhhcC1ob2EtZG9uXCIpLmluaXQoYXBwKTtcbiAgICByZXF1aXJlKFwiLi4vYXBwL25oYXAtdGh1b2NcIikuaW5pdChhcHApO1xufSk7XG4iXX0=
