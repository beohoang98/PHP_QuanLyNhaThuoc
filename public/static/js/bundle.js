(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const KeyEvent_1 = require("./KeyEvent");
const Thuoc_1 = require("./Model/Thuoc");
class App {
    // public ncc:
    constructor() {
        this.switchToPage(this.getPageFromUrl());
        this.handleSwitchPage();
        this.keyevent = new KeyEvent_1.KeyEvent();
        this.handleSetting();
        this.handleModal();
        this.thuoc = new Thuoc_1.Thuoc();
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

},{"./KeyEvent":3,"./Model/Thuoc":8}],2:[function(require,module,exports){
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
class Model {
    constructor() {
        this.database = "";
        this.data = [];
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

},{}],6:[function(require,module,exports){
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

},{"../TableData":6}],8:[function(require,module,exports){
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

},{"../ModelClass":5,"./BangThuoc":7}],9:[function(require,module,exports){
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

},{"../MenuContext":4,"../Model/Thuoc":8,"./ViewTable":10}],10:[function(require,module,exports){
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

},{}],11:[function(require,module,exports){
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

},{"../AutoComplete":2}],12:[function(require,module,exports){
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
        this.addModal = new thuoc_modal_1.NewThuocModal("thuoc--new-modal", this.app.thuoc);
        this.newModal = new thuoc_modal_1.AddThuocModal("thuoc--add-modal", this.app.thuoc);
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

},{"../View/ThuocTable":9,"./thuoc-modal":16}],13:[function(require,module,exports){
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

},{}],14:[function(require,module,exports){
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

},{}],15:[function(require,module,exports){
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

},{}],16:[function(require,module,exports){
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

},{"./thuoc-add-modal":13,"./thuoc-edit-modal":14,"./thuoc-edit-price-modal":15,"./thuoc-new-modal":17}],17:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class NewThuocModal {
    constructor(id, model) {
        this.model = model;
        this.popup = $("#" + id);
        this.popup.load("/layouts/modal-new-thuoc.html");
    }
    show() {
        this.popup.modal("show");
    }
    hide() {
        this.popup.modal("hide");
    }
}
exports.NewThuocModal = NewThuocModal;

},{}],18:[function(require,module,exports){
const {App} = require('../app/App');

$(document).ready(()=>{
    const app = new App();

    require("../app/nhap-hoa-don").init(app);
    require("../app/nhap-thuoc").init(app);
});

},{"../app/App":1,"../app/nhap-hoa-don":11,"../app/nhap-thuoc":12}]},{},[18])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvYXBwL0FwcC5qcyIsInNyYy9hcHAvQXV0b0NvbXBsZXRlL2luZGV4LmpzIiwic3JjL2FwcC9LZXlFdmVudC9pbmRleC5qcyIsInNyYy9hcHAvTWVudUNvbnRleHQvaW5kZXguanMiLCJzcmMvYXBwL01vZGVsL01vZGVsQ2xhc3MvaW5kZXguanMiLCJzcmMvYXBwL01vZGVsL1RhYmxlRGF0YS9pbmRleC5qcyIsInNyYy9hcHAvTW9kZWwvVGh1b2MvQmFuZ1RodW9jLmpzIiwic3JjL2FwcC9Nb2RlbC9UaHVvYy9pbmRleC5qcyIsInNyYy9hcHAvVmlldy9UaHVvY1RhYmxlLmpzIiwic3JjL2FwcC9WaWV3L1ZpZXdUYWJsZS5qcyIsInNyYy9hcHAvbmhhcC1ob2EtZG9uL2luZGV4LmpzIiwic3JjL2FwcC9uaGFwLXRodW9jL2luZGV4LmpzIiwic3JjL2FwcC9uaGFwLXRodW9jL3RodW9jLWFkZC1tb2RhbC5qcyIsInNyYy9hcHAvbmhhcC10aHVvYy90aHVvYy1lZGl0LW1vZGFsLmpzIiwic3JjL2FwcC9uaGFwLXRodW9jL3RodW9jLWVkaXQtcHJpY2UtbW9kYWwuanMiLCJzcmMvYXBwL25oYXAtdGh1b2MvdGh1b2MtbW9kYWwuanMiLCJzcmMvYXBwL25oYXAtdGh1b2MvdGh1b2MtbmV3LW1vZGFsLmpzIiwic3JjL3NjcmlwdC9tYWluLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzlEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdkhBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDeENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcERBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzlIQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNuREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDM0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDckNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdkRBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDeElBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM3SEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNWQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbigpe2Z1bmN0aW9uIHIoZSxuLHQpe2Z1bmN0aW9uIG8oaSxmKXtpZighbltpXSl7aWYoIWVbaV0pe3ZhciBjPVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmU7aWYoIWYmJmMpcmV0dXJuIGMoaSwhMCk7aWYodSlyZXR1cm4gdShpLCEwKTt2YXIgYT1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK2krXCInXCIpO3Rocm93IGEuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixhfXZhciBwPW5baV09e2V4cG9ydHM6e319O2VbaV1bMF0uY2FsbChwLmV4cG9ydHMsZnVuY3Rpb24ocil7dmFyIG49ZVtpXVsxXVtyXTtyZXR1cm4gbyhufHxyKX0scCxwLmV4cG9ydHMscixlLG4sdCl9cmV0dXJuIG5baV0uZXhwb3J0c31mb3IodmFyIHU9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZSxpPTA7aTx0Lmxlbmd0aDtpKyspbyh0W2ldKTtyZXR1cm4gb31yZXR1cm4gcn0pKCkiLCJcInVzZSBzdHJpY3RcIjtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmNvbnN0IEtleUV2ZW50XzEgPSByZXF1aXJlKFwiLi9LZXlFdmVudFwiKTtcbmNvbnN0IFRodW9jXzEgPSByZXF1aXJlKFwiLi9Nb2RlbC9UaHVvY1wiKTtcbmNsYXNzIEFwcCB7XG4gICAgLy8gcHVibGljIG5jYzpcbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgdGhpcy5zd2l0Y2hUb1BhZ2UodGhpcy5nZXRQYWdlRnJvbVVybCgpKTtcbiAgICAgICAgdGhpcy5oYW5kbGVTd2l0Y2hQYWdlKCk7XG4gICAgICAgIHRoaXMua2V5ZXZlbnQgPSBuZXcgS2V5RXZlbnRfMS5LZXlFdmVudCgpO1xuICAgICAgICB0aGlzLmhhbmRsZVNldHRpbmcoKTtcbiAgICAgICAgdGhpcy5oYW5kbGVNb2RhbCgpO1xuICAgICAgICB0aGlzLnRodW9jID0gbmV3IFRodW9jXzEuVGh1b2MoKTtcbiAgICB9XG4gICAgZ2V0VXNlcm5hbWUoKSB7XG4gICAgICAgIGNvbnN0IHVzZXJuYW1lID0gZG9jdW1lbnQuY29va2llLm1hdGNoKC91c2VybmFtZT0oWzAtOWEtekEtWl9dKykvaSlbMV07XG4gICAgICAgICQoXCIjdXNlcm5hbWVcIikudGV4dCh1c2VybmFtZSk7XG4gICAgfVxuICAgIG9uU2hvcnRjdXRLZXkoY29tYktleSwgcGFnZSwgZnVuYykge1xuICAgICAgICAvLyBmKmtpbmcgaW5jcmVkaWJsZSBzY29wZSB0aGluZ3MhXG4gICAgICAgIHRoaXMua2V5ZXZlbnQub24oY29tYktleSwgKGUpID0+IHtcbiAgICAgICAgICAgIGlmICh0aGlzLnBhZ2UgPT09IHBhZ2UpIHtcbiAgICAgICAgICAgICAgICBmdW5jKGUpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9XG4gICAgZ2V0UGFnZUZyb21VcmwoKSB7XG4gICAgICAgIGxldCBwYWdlID0gbmV3IFVSTCh3aW5kb3cubG9jYXRpb24udG9TdHJpbmcoKSkuc2VhcmNoUGFyYW1zLmdldChcInBhZ2VcIik7XG4gICAgICAgIGlmICghcGFnZSkge1xuICAgICAgICAgICAgcGFnZSA9IFwicGFnZS1uaGFwLWhvYS1kb25cIjtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcGFnZTtcbiAgICB9XG4gICAgaGFuZGxlU3dpdGNoUGFnZSgpIHtcbiAgICAgICAgY29uc3QgJHRoaXMgPSB0aGlzO1xuICAgICAgICAkKFwiLnNpZGViYXItc3dpdGNoLXBhZ2VcIikub24oXCJjbGlja1wiLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBjb25zdCBpZCA9ICQodGhpcykuZGF0YShcInRhcmdldFwiKTtcbiAgICAgICAgICAgICR0aGlzLnN3aXRjaFRvUGFnZShpZCk7XG4gICAgICAgIH0pO1xuICAgIH1cbiAgICBzd2l0Y2hUb1BhZ2UoaWQpIHtcbiAgICAgICAgdGhpcy5wYWdlID0gaWQ7XG4gICAgICAgIHdpbmRvdy5oaXN0b3J5LnJlcGxhY2VTdGF0ZShudWxsLCBpZCwgXCIvP3BhZ2U9XCIgKyBpZCk7XG4gICAgICAgIGNvbnN0IGNvbnRhaW5lciA9ICQoXCIuZnJhbWUtY29udGFpbmVyXCIpO1xuICAgICAgICBjb25zdCBwYWdlID0gJChcIiNcIiArIGlkKTtcbiAgICAgICAgY29udGFpbmVyLmFuaW1hdGUoe1xuICAgICAgICAgICAgc2Nyb2xsVG9wOiBwYWdlLm9mZnNldCgpLnRvcCAtIGNvbnRhaW5lci5vZmZzZXQoKS50b3AgKyBjb250YWluZXIuc2Nyb2xsVG9wKCksXG4gICAgICAgIH0pO1xuICAgIH1cbiAgICBoYW5kbGVTZXR0aW5nKCkge1xuICAgICAgICAvL1xuICAgIH1cbiAgICBoYW5kbGVNb2RhbCgpIHtcbiAgICAgICAgJChcIi5tb2RhbFwiKS5vbihcInNob3duLmJzLm1vZGFsXCIsICgpID0+IHtcbiAgICAgICAgICAgIHRoaXMua2V5ZXZlbnQuYmxvY2soKTtcbiAgICAgICAgfSk7XG4gICAgICAgICQoXCIubW9kYWxcIikub24oXCJoaWRkZW4uYnMubW9kYWxcIiwgKCkgPT4ge1xuICAgICAgICAgICAgdGhpcy5rZXlldmVudC51bmJsb2NrKCk7XG4gICAgICAgIH0pO1xuICAgIH1cbn1cbmV4cG9ydHMuQXBwID0gQXBwO1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9QXBwLmpzLm1hcCIsIlwidXNlIHN0cmljdFwiO1xudmFyIF9fYXdhaXRlciA9ICh0aGlzICYmIHRoaXMuX19hd2FpdGVyKSB8fCBmdW5jdGlvbiAodGhpc0FyZywgX2FyZ3VtZW50cywgUCwgZ2VuZXJhdG9yKSB7XG4gICAgcmV0dXJuIG5ldyAoUCB8fCAoUCA9IFByb21pc2UpKShmdW5jdGlvbiAocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgICAgIGZ1bmN0aW9uIGZ1bGZpbGxlZCh2YWx1ZSkgeyB0cnkgeyBzdGVwKGdlbmVyYXRvci5uZXh0KHZhbHVlKSk7IH0gY2F0Y2ggKGUpIHsgcmVqZWN0KGUpOyB9IH1cbiAgICAgICAgZnVuY3Rpb24gcmVqZWN0ZWQodmFsdWUpIHsgdHJ5IHsgc3RlcChnZW5lcmF0b3JbXCJ0aHJvd1wiXSh2YWx1ZSkpOyB9IGNhdGNoIChlKSB7IHJlamVjdChlKTsgfSB9XG4gICAgICAgIGZ1bmN0aW9uIHN0ZXAocmVzdWx0KSB7IHJlc3VsdC5kb25lID8gcmVzb2x2ZShyZXN1bHQudmFsdWUpIDogbmV3IFAoZnVuY3Rpb24gKHJlc29sdmUpIHsgcmVzb2x2ZShyZXN1bHQudmFsdWUpOyB9KS50aGVuKGZ1bGZpbGxlZCwgcmVqZWN0ZWQpOyB9XG4gICAgICAgIHN0ZXAoKGdlbmVyYXRvciA9IGdlbmVyYXRvci5hcHBseSh0aGlzQXJnLCBfYXJndW1lbnRzIHx8IFtdKSkubmV4dCgpKTtcbiAgICB9KTtcbn07XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5jbGFzcyBBdXRvQ29tcGxldGUge1xuICAgIGNvbnN0cnVjdG9yKHRhcmdldCwgbW9kZWwpIHtcbiAgICAgICAgaWYgKHR5cGVvZiB0YXJnZXQgPT09IFwic3RyaW5nXCIpIHtcbiAgICAgICAgICAgIHRoaXMudGFyZ2V0ID0gJChcIiNcIiArIHRhcmdldCk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICB0aGlzLnRhcmdldCA9IHRhcmdldDtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLnRhcmdldC5hdHRyKFwiYXV0b2NvbXBsZXRlXCIsIFwib2ZmXCIpO1xuICAgICAgICB0aGlzLm1vZGVsID0gbW9kZWw7XG4gICAgfVxuICAgIG9uQ2hvb3NlKGZ1bmMpIHtcbiAgICAgICAgdGhpcy5mdW5jT25DaG9vc2UgPSBmdW5jO1xuICAgIH1cbiAgICBpc1Nob3dlZCgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZWxlbWVudC5jaGlsZHJlbi5sZW5ndGggPiAwO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBzZXQgZmllbGRuYW1lIHRvIHNob3dcbiAgICAgKiBAcGFyYW0gbG9va3VwIHtmaWVsZE5hbWU6IEVsZW1lbnRJZH1cbiAgICAgKi9cbiAgICBzZXRMb29rdXAobG9va3VwKSB7XG4gICAgICAgIHRoaXMubG9va3VwID0gbG9va3VwO1xuICAgIH1cbiAgICBsaXN0ZW4oKSB7XG4gICAgICAgIHRoaXMudGFyZ2V0Lm9uKFwia2V5dXBcIiwgKGUpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IGtleSA9IGUua2V5O1xuICAgICAgICAgICAgc3dpdGNoIChrZXkpIHtcbiAgICAgICAgICAgICAgICBjYXNlIFwiRW50ZXJcIjoge1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgY2FzZSBcIkVzY2FwZVwiOiB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMucmVtb3ZlKCk7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBjYXNlIFwiQXJyb3dVcFwiOiB7XG4gICAgICAgICAgICAgICAgICAgIC8vIHRvIGRvXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBjYXNlIFwiQXJyb3dEb3duXCI6IHtcbiAgICAgICAgICAgICAgICAgICAgLy8gdG8gZG9cbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGRlZmF1bHQ6IHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgdmFsID0gdGhpcy50YXJnZXQudmFsKCk7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMucmVtb3ZlKCk7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMucmVuZGVyKHZhbCkudGhlbigoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnNob3coKTtcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9XG4gICAgcmVuZGVyKHNlYXJjaCkge1xuICAgICAgICByZXR1cm4gX19hd2FpdGVyKHRoaXMsIHZvaWQgMCwgdm9pZCAwLCBmdW5jdGlvbiogKCkge1xuICAgICAgICAgICAgdGhpcy5lbGVtZW50ID0gJChcIjx1bC8+XCIpLmFkZENsYXNzKFwibXktYXV0b2NvbXBsZXRlIHNoYWRvdy1sZyByb3VuZGVkXCIpO1xuICAgICAgICAgICAgdGhpcy5lbGVtZW50LmNzcyh7XG4gICAgICAgICAgICAgICAgdG9wOiB0aGlzLnRhcmdldC5vZmZzZXQoKS50b3AgKyB0aGlzLnRhcmdldC5vdXRlckhlaWdodCgpLFxuICAgICAgICAgICAgICAgIGxlZnQ6IHRoaXMudGFyZ2V0Lm9mZnNldCgpLmxlZnQsXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIGNvbnN0IGRhdGEgPSB5aWVsZCB0aGlzLmdldERhdGEoc2VhcmNoKTtcbiAgICAgICAgICAgIHRoaXMuY3VycmVudE9mZnNldCA9IDA7XG4gICAgICAgICAgICBsZXQgb2Zmc2V0ID0gMDtcbiAgICAgICAgICAgIGZvciAoY29uc3QgZGF0YVJvdyBvZiBkYXRhKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgZGF0YVJvd0ZpbHRlcmVkID0gdGhpcy5maWx0ZXJEYXRhV2l0aExvb2t1cChkYXRhUm93KTtcbiAgICAgICAgICAgICAgICBjb25zdCByb3dFbGVtZW50ID0gdGhpcy5yZW5kZXJSb3coZGF0YVJvd0ZpbHRlcmVkLCBvZmZzZXQrKyk7XG4gICAgICAgICAgICAgICAgcm93RWxlbWVudC5vbihcImNsaWNrIGtleWRvd25cIiwgKGUpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGUudHlwZSA9PT0gXCJjbGlja1wiIHx8IGUua2V5ID09PSBcIkVudGVyXCIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGUuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmZ1bmNPbkNob29zZShkYXRhUm93KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMucmVtb3ZlKCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB0aGlzLmVsZW1lbnQuYXBwZW5kKHJvd0VsZW1lbnQpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9XG4gICAgc2hvdygpIHtcbiAgICAgICAgJChcImJvZHlcIikuYXBwZW5kKHRoaXMuZWxlbWVudCk7XG4gICAgfVxuICAgIHJlbW92ZSgpIHtcbiAgICAgICAgJChcIi5teS1hdXRvY29tcGxldGVcIikucmVtb3ZlKCk7XG4gICAgfVxuICAgIGdldERhdGEoc2VhcmNoKSB7XG4gICAgICAgIHJldHVybiBfX2F3YWl0ZXIodGhpcywgdm9pZCAwLCB2b2lkIDAsIGZ1bmN0aW9uKiAoKSB7XG4gICAgICAgICAgICBjb25zdCBkYXRhID0geWllbGQgdGhpcy5tb2RlbC5nZXQoc2VhcmNoLCAwLCAyMCk7IC8vIDIwIGlzIGZvciB0ZXN0IGZpcnN0LCB3aWxsIGRldmVsb3AgaW4gZnV0dXJlXG4gICAgICAgICAgICByZXR1cm4gZGF0YTtcbiAgICAgICAgfSk7XG4gICAgfVxuICAgIHJlbmRlclJvdyhkYXRhUm93LCBvZmZzZXQpIHtcbiAgICAgICAgY29uc3Qgcm93ID0gJChcIjxsaS8+XCIpLmRhdGEoXCJvZmZzZXRcIiwgb2Zmc2V0KTtcbiAgICAgICAgZm9yIChjb25zdCBmaWVsZCBvZiBPYmplY3Qua2V5cyhkYXRhUm93KSkge1xuICAgICAgICAgICAgY29uc3QgdmFsID0gZGF0YVJvd1tmaWVsZF07XG4gICAgICAgICAgICByb3cuYXBwZW5kKCQoXCI8ZGl2Lz5cIikudGV4dCh2YWwpKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcm93O1xuICAgIH1cbiAgICBmaWx0ZXJEYXRhV2l0aExvb2t1cChkYXRhUm93KSB7XG4gICAgICAgIGNvbnN0IGZpbHRlcmVkRGF0YSA9IHt9O1xuICAgICAgICBmb3IgKGNvbnN0IGtleSBvZiB0aGlzLmxvb2t1cCkge1xuICAgICAgICAgICAgaWYgKGRhdGFSb3cuaGFzT3duUHJvcGVydHkoa2V5KSkge1xuICAgICAgICAgICAgICAgIGZpbHRlcmVkRGF0YVtrZXldID0gZGF0YVJvd1trZXldO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBmaWx0ZXJlZERhdGE7XG4gICAgfVxufVxuZXhwb3J0cy5BdXRvQ29tcGxldGUgPSBBdXRvQ29tcGxldGU7XG4vLyMgc291cmNlTWFwcGluZ1VSTD1pbmRleC5qcy5tYXAiLCJcInVzZSBzdHJpY3RcIjtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmNsYXNzIEtleUV2ZW50IHtcbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgdGhpcy5ldmVudEF0dGFjaCA9IHt9O1xuICAgICAgICB0aGlzLmlzQmxvY2tpbmcgPSBmYWxzZTtcbiAgICAgICAgJChkb2N1bWVudCkub24oXCJrZXlkb3duXCIsIChlKSA9PiB7XG4gICAgICAgICAgICBpZiAodGhpcy5pc0Jsb2NraW5nKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgbGV0IGNvbWJLZXkgPSBcIlwiO1xuICAgICAgICAgICAgaWYgKGUuY3RybEtleSkge1xuICAgICAgICAgICAgICAgIGNvbWJLZXkgPSBcImN0cmwrXCI7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjb21iS2V5ICs9IGUua2V5O1xuICAgICAgICAgICAgY29uc29sZS5sb2coY29tYktleSk7XG4gICAgICAgICAgICBpZiAodGhpcy5ldmVudEF0dGFjaC5oYXNPd25Qcm9wZXJ0eShjb21iS2V5KSkge1xuICAgICAgICAgICAgICAgIGNvbnN0IGxpc3RGdW5jID0gdGhpcy5ldmVudEF0dGFjaFtjb21iS2V5XTtcbiAgICAgICAgICAgICAgICBmb3IgKGNvbnN0IGZ1bmMgb2YgbGlzdEZ1bmMpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHR5cGVvZiBmdW5jID09PSBcImZ1bmN0aW9uXCIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGZ1bmMoZSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH1cbiAgICBvbihjb21iS2V5LCBmdW5jKSB7XG4gICAgICAgIGlmICghdGhpcy5ldmVudEF0dGFjaFtjb21iS2V5XSkge1xuICAgICAgICAgICAgdGhpcy5ldmVudEF0dGFjaFtjb21iS2V5XSA9IFtdO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuZXZlbnRBdHRhY2hbY29tYktleV0ucHVzaChmdW5jKTtcbiAgICB9XG4gICAgYmxvY2soKSB7XG4gICAgICAgIHRoaXMuaXNCbG9ja2luZyA9IHRydWU7XG4gICAgfVxuICAgIHVuYmxvY2soKSB7XG4gICAgICAgIHRoaXMuaXNCbG9ja2luZyA9IGZhbHNlO1xuICAgIH1cbn1cbmV4cG9ydHMuS2V5RXZlbnQgPSBLZXlFdmVudDtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWluZGV4LmpzLm1hcCIsIlwidXNlIHN0cmljdFwiO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuY2xhc3MgTWVudUNvbnRleHQge1xuICAgIGNvbnN0cnVjdG9yKHRhcmdldCkge1xuICAgICAgICBpZiAodHlwZW9mIHRhcmdldCA9PT0gXCJzdHJpbmdcIikge1xuICAgICAgICAgICAgdGhpcy50YXJnZXQgPSAkKFwiI1wiICsgdGFyZ2V0KTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMudGFyZ2V0ID0gdGFyZ2V0O1xuICAgICAgICB9XG4gICAgICAgIHRoaXMudGFyZ2V0Lm9uKFwiY29udGV4dG1lbnVcIiwgKGUpID0+IHtcbiAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgIGUuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgICAgICAgICB0aGlzLnJlbW92ZSgpLnJlbmRlcih7IHg6IGUuY2xpZW50WCwgeTogZS5jbGllbnRZIH0pLnNob3coKTtcbiAgICAgICAgfSk7XG4gICAgICAgIHRoaXMubWVudSA9IFtdO1xuICAgIH1cbiAgICBhZGRDb250ZXh0KHByb3ApIHtcbiAgICAgICAgdGhpcy5tZW51LnB1c2gocHJvcCk7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cbiAgICByZW5kZXIocG9zKSB7XG4gICAgICAgIHRoaXMuZWxlbWVudCA9ICQoXCI8dWwvPlwiKS5hZGRDbGFzcyhcInNoYWRvdy1sZyByb3VuZGVkIG15LWNvbnRleHRtZW51XCIpO1xuICAgICAgICB0aGlzLmVsZW1lbnQuY3NzKFwidG9wXCIsIHBvcy55ICsgXCJweFwiKTtcbiAgICAgICAgdGhpcy5lbGVtZW50LmNzcyhcImxlZnRcIiwgcG9zLnggKyBcInB4XCIpO1xuICAgICAgICBmb3IgKGNvbnN0IGN0eCBvZiB0aGlzLm1lbnUpIHtcbiAgICAgICAgICAgIHRoaXMuZWxlbWVudC5hcHBlbmQodGhpcy5yZW5kZXJDb250ZXh0KGN0eCkpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuZWxlbWVudC5oaWRlKCk7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cbiAgICBzaG93KCkge1xuICAgICAgICAkKFwiYm9keVwiKS5hcHBlbmQodGhpcy5lbGVtZW50KTtcbiAgICAgICAgdGhpcy5lbGVtZW50LnNsaWRlRG93bigwLjUpO1xuICAgICAgICAkKGRvY3VtZW50KS5vZmYoXCJjbGlja1wiLCB0aGlzLnJlbW92ZSkub24oXCJjbGlja1wiLCB0aGlzLnJlbW92ZSk7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cbiAgICByZW1vdmUoKSB7XG4gICAgICAgICQoXCIubXktY29udGV4dG1lbnVcIikucmVtb3ZlKCk7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cbiAgICByZW5kZXJDb250ZXh0KHByb3ApIHtcbiAgICAgICAgY29uc3QgY29udGV4dCA9ICQoXCI8bGkvPlwiKTtcbiAgICAgICAgY29udGV4dC5odG1sKGA8aSBjbGFzcz0nJHtwcm9wLmljb259ICR7cHJvcC5jbGFzc05hbWV9Jz48L2k+ICR7cHJvcC50aXRsZX1gKTtcbiAgICAgICAgY29udGV4dC5vbihcImNsaWNrXCIsIChlKSA9PiB7XG4gICAgICAgICAgICB0aGlzLnJlbW92ZSgpO1xuICAgICAgICAgICAgcHJvcC5jbGljayhlKTtcbiAgICAgICAgfSk7XG4gICAgICAgIHJldHVybiBjb250ZXh0O1xuICAgIH1cbn1cbmV4cG9ydHMuTWVudUNvbnRleHQgPSBNZW51Q29udGV4dDtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWluZGV4LmpzLm1hcCIsIlwidXNlIHN0cmljdFwiO1xudmFyIF9fYXdhaXRlciA9ICh0aGlzICYmIHRoaXMuX19hd2FpdGVyKSB8fCBmdW5jdGlvbiAodGhpc0FyZywgX2FyZ3VtZW50cywgUCwgZ2VuZXJhdG9yKSB7XG4gICAgcmV0dXJuIG5ldyAoUCB8fCAoUCA9IFByb21pc2UpKShmdW5jdGlvbiAocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgICAgIGZ1bmN0aW9uIGZ1bGZpbGxlZCh2YWx1ZSkgeyB0cnkgeyBzdGVwKGdlbmVyYXRvci5uZXh0KHZhbHVlKSk7IH0gY2F0Y2ggKGUpIHsgcmVqZWN0KGUpOyB9IH1cbiAgICAgICAgZnVuY3Rpb24gcmVqZWN0ZWQodmFsdWUpIHsgdHJ5IHsgc3RlcChnZW5lcmF0b3JbXCJ0aHJvd1wiXSh2YWx1ZSkpOyB9IGNhdGNoIChlKSB7IHJlamVjdChlKTsgfSB9XG4gICAgICAgIGZ1bmN0aW9uIHN0ZXAocmVzdWx0KSB7IHJlc3VsdC5kb25lID8gcmVzb2x2ZShyZXN1bHQudmFsdWUpIDogbmV3IFAoZnVuY3Rpb24gKHJlc29sdmUpIHsgcmVzb2x2ZShyZXN1bHQudmFsdWUpOyB9KS50aGVuKGZ1bGZpbGxlZCwgcmVqZWN0ZWQpOyB9XG4gICAgICAgIHN0ZXAoKGdlbmVyYXRvciA9IGdlbmVyYXRvci5hcHBseSh0aGlzQXJnLCBfYXJndW1lbnRzIHx8IFtdKSkubmV4dCgpKTtcbiAgICB9KTtcbn07XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5jbGFzcyBNb2RlbCB7XG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHRoaXMuZGF0YWJhc2UgPSBcIlwiO1xuICAgICAgICB0aGlzLmRhdGEgPSBbXTtcbiAgICB9XG4gICAgZ2V0IHJlc3BvbnNlKCkge1xuICAgICAgICByZXR1cm4gT2JqZWN0LmFzc2lnbih7fSwgdGhpcy5yZXMpO1xuICAgIH1cbiAgICAvLyA9PT09PT09PT09PT09PT0gSU5IRVJJVCBGVU5DXG4gICAgZ2V0KHBhcmFtcywgb2Zmc2V0LCBsaW1pdCkge1xuICAgICAgICByZXR1cm4gX19hd2FpdGVyKHRoaXMsIHZvaWQgMCwgdm9pZCAwLCBmdW5jdGlvbiogKCkge1xuICAgICAgICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICAgICAgfSk7XG4gICAgfVxuICAgIGNyZWF0ZShkYXRhKSB7XG4gICAgICAgIHJldHVybiBfX2F3YWl0ZXIodGhpcywgdm9pZCAwLCB2b2lkIDAsIGZ1bmN0aW9uKiAoKSB7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH0pO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiB1cGRhdGUgcmVjb3JkXG4gICAgICogQHBhcmFtIGZpZWxkTWF0Y2ggbWF0Y2ggZmllbGQgdG8gdXBkYXRlIHJlY29yZFxuICAgICAqIEBwYXJhbSBmaWVsZFVwZGF0ZSB0aGUgZGF0YSBuZWVkIHVwZGF0ZVxuICAgICAqL1xuICAgIHVwZGF0ZShmaWVsZE1hdGNoLCBmaWVsZFVwZGF0ZSkge1xuICAgICAgICByZXR1cm4gX19hd2FpdGVyKHRoaXMsIHZvaWQgMCwgdm9pZCAwLCBmdW5jdGlvbiogKCkge1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9KTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogcmVtb3ZlIGEgcmVjb3JkXG4gICAgICogQHBhcmFtIGZpZWxkTWF0Y2ggZmllbGQgbWF0Y2ggdG8gcmVtb3ZlXG4gICAgICogQHJldHVybiB0cnVlIG9mIGZhbHNlXG4gICAgICovXG4gICAgcmVtb3ZlKGZpZWxkTWF0Y2gpIHtcbiAgICAgICAgcmV0dXJuIF9fYXdhaXRlcih0aGlzLCB2b2lkIDAsIHZvaWQgMCwgZnVuY3Rpb24qICgpIHtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfSk7XG4gICAgfVxuICAgIC8vID09PT09PT09PT09PT09PSBDT1JFIEZVTkNcbiAgICAvKipcbiAgICAgKiBmZXRjaCBkYXRhIGZyb20gZGF0YWJhc2UgYW5kIGRvIHRoaW5nXG4gICAgICogQHBhcmFtIHBhcmFtc1xuICAgICAqIEBwYXJhbSBjYWxsYmFjayBjYWxsYmFjayBmdW5jdGlvblxuICAgICAqL1xuICAgIF9nZXQocGFyYW1zLCBjYWxsYmFjaykge1xuICAgICAgICByZXR1cm4gX19hd2FpdGVyKHRoaXMsIHZvaWQgMCwgdm9pZCAwLCBmdW5jdGlvbiogKCkge1xuICAgICAgICAgICAgdGhpcy5kYXRhID0gW107XG4gICAgICAgICAgICBjb25zdCByZXF1ZXN0VVJMID0gdGhpcy5kYXRhYmFzZSArIFwiP1wiICsgdGhpcy5fdXJscGFyYW1zKHBhcmFtcyk7XG4gICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgIGNvbnN0IHJlcyA9IHlpZWxkIGZldGNoKHJlcXVlc3RVUkwsIHsgY3JlZGVudGlhbHM6IFwiaW5jbHVkZVwiIH0pO1xuICAgICAgICAgICAgICAgIGNvbnN0IGpzb24gPSB5aWVsZCByZXMuanNvbigpO1xuICAgICAgICAgICAgICAgIGlmIChqc29uLmVycikge1xuICAgICAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoanNvbi5tc2cpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB0aGlzLmRhdGEgPSBqc29uLmRhdGE7XG4gICAgICAgICAgICAgICAgaWYgKHR5cGVvZiBjYWxsYmFjayA9PT0gXCJmdW5jdGlvblwiKSB7XG4gICAgICAgICAgICAgICAgICAgIGNhbGxiYWNrKGZhbHNlLCBqc29uLmRhdGEpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICByZXR1cm4ganNvbi5kYXRhO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY2F0Y2ggKGVycikge1xuICAgICAgICAgICAgICAgIGlmICh0eXBlb2YgY2FsbGJhY2sgPT09IFwiZnVuY3Rpb25cIikge1xuICAgICAgICAgICAgICAgICAgICBjYWxsYmFjayhlcnIpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgdGhyb3cgZXJyO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIHBvc3QgcmVxdWVzdFxuICAgICAqIEBwYXJhbSB7YW55fSBkYXRhXG4gICAgICogQHBhcmFtIHtGdW5jdGlvbn0gW2NhbGxiYWNrXVxuICAgICAqL1xuICAgIF9wb3N0KGRhdGEsIGNhbGxiYWNrKSB7XG4gICAgICAgIHJldHVybiBfX2F3YWl0ZXIodGhpcywgdm9pZCAwLCB2b2lkIDAsIGZ1bmN0aW9uKiAoKSB7XG4gICAgICAgICAgICB0aGlzLnJlcyA9IFwiXCI7XG4gICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgIGNvbnN0IHJlcyA9IHlpZWxkIGZldGNoKHRoaXMuZGF0YWJhc2UsIHtcbiAgICAgICAgICAgICAgICAgICAgYm9keTogSlNPTi5zdHJpbmdpZnkoZGF0YSksXG4gICAgICAgICAgICAgICAgICAgIGNyZWRlbnRpYWxzOiBcImluY2x1ZGVcIixcbiAgICAgICAgICAgICAgICAgICAgaGVhZGVyczoge1xuICAgICAgICAgICAgICAgICAgICAgICAgXCJDb250ZW50LVR5cGVcIjogXCJhcHBsaWNhdGlvbi9qc29uXCIsXG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgIG1ldGhvZDogXCJQT1NUXCIsXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgY29uc3QganNvbiA9IHlpZWxkIHJlcy5qc29uKCk7XG4gICAgICAgICAgICAgICAgaWYgKGpzb24uZXJyKSB7XG4gICAgICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihqc29uLm1zZyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHRoaXMucmVzID0ganNvbi5kYXRhO1xuICAgICAgICAgICAgICAgIGlmICh0eXBlb2YgY2FsbGJhY2sgPT09IFwiZnVuY3Rpb25cIikge1xuICAgICAgICAgICAgICAgICAgICBjYWxsYmFjayhmYWxzZSwganNvbi5kYXRhKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcmV0dXJuIGpzb24uZGF0YTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNhdGNoIChlcnIpIHtcbiAgICAgICAgICAgICAgICBpZiAodHlwZW9mIGNhbGxiYWNrID09PSBcImZ1bmN0aW9uXCIpIHtcbiAgICAgICAgICAgICAgICAgICAgY2FsbGJhY2soZXJyKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHRocm93IGVycjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH1cbiAgICBfdXJscGFyYW1zKHBhcmFtcykge1xuICAgICAgICBjb25zdCB1cmwgPSBPYmplY3Qua2V5cyhwYXJhbXMpLm1hcCgoaykgPT4ge1xuICAgICAgICAgICAgcmV0dXJuIGVuY29kZVVSSUNvbXBvbmVudChrKSArIFwiPVwiICsgZW5jb2RlVVJJQ29tcG9uZW50KHBhcmFtc1trXSk7XG4gICAgICAgIH0pLmpvaW4oXCImXCIpO1xuICAgICAgICByZXR1cm4gdXJsO1xuICAgIH1cbn1cbmV4cG9ydHMuTW9kZWwgPSBNb2RlbDtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWluZGV4LmpzLm1hcCIsIlwidXNlIHN0cmljdFwiO1xudmFyIF9fYXdhaXRlciA9ICh0aGlzICYmIHRoaXMuX19hd2FpdGVyKSB8fCBmdW5jdGlvbiAodGhpc0FyZywgX2FyZ3VtZW50cywgUCwgZ2VuZXJhdG9yKSB7XG4gICAgcmV0dXJuIG5ldyAoUCB8fCAoUCA9IFByb21pc2UpKShmdW5jdGlvbiAocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgICAgIGZ1bmN0aW9uIGZ1bGZpbGxlZCh2YWx1ZSkgeyB0cnkgeyBzdGVwKGdlbmVyYXRvci5uZXh0KHZhbHVlKSk7IH0gY2F0Y2ggKGUpIHsgcmVqZWN0KGUpOyB9IH1cbiAgICAgICAgZnVuY3Rpb24gcmVqZWN0ZWQodmFsdWUpIHsgdHJ5IHsgc3RlcChnZW5lcmF0b3JbXCJ0aHJvd1wiXSh2YWx1ZSkpOyB9IGNhdGNoIChlKSB7IHJlamVjdChlKTsgfSB9XG4gICAgICAgIGZ1bmN0aW9uIHN0ZXAocmVzdWx0KSB7IHJlc3VsdC5kb25lID8gcmVzb2x2ZShyZXN1bHQudmFsdWUpIDogbmV3IFAoZnVuY3Rpb24gKHJlc29sdmUpIHsgcmVzb2x2ZShyZXN1bHQudmFsdWUpOyB9KS50aGVuKGZ1bGZpbGxlZCwgcmVqZWN0ZWQpOyB9XG4gICAgICAgIHN0ZXAoKGdlbmVyYXRvciA9IGdlbmVyYXRvci5hcHBseSh0aGlzQXJnLCBfYXJndW1lbnRzIHx8IFtdKSkubmV4dCgpKTtcbiAgICB9KTtcbn07XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG4vKipcbiAqIERpc3BsYXkgZGF0YSB1bmRlciB0YWJsZVxuICovXG5jbGFzcyBUYWJsZURhdGEge1xuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICB0aGlzLl9tYXAgPSB7fTtcbiAgICAgICAgdGhpcy5fbGlzdCA9IFtdO1xuICAgICAgICB0aGlzLl9pc0Nvbm5lY3QgPSBmYWxzZTtcbiAgICAgICAgdGhpcy5fY29ubmVjdFN0YXR1cyA9IFwiXCI7XG4gICAgICAgIHRoaXMuX2lzRmV0Y2hlZCA9IGZhbHNlO1xuICAgICAgICB0aGlzLl9kYlVSTCA9IFwiXCI7XG4gICAgfVxuICAgIGdldERhdGEoKSB7XG4gICAgICAgIHJldHVybiBfX2F3YWl0ZXIodGhpcywgdm9pZCAwLCB2b2lkIDAsIGZ1bmN0aW9uKiAoKSB7XG4gICAgICAgICAgICBsZXQgcmVzID0geWllbGQgZmV0Y2godGhpcy5fZGJVUkwsIHsgbWV0aG9kOiBcIkdFVFwiLCBjcmVkZW50aWFsczogJ2luY2x1ZGUnIH0pO1xuICAgICAgICAgICAgaWYgKCFyZXMub2spIHtcbiAgICAgICAgICAgICAgICB0aGlzLl9pc0Nvbm5lY3QgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICB0aGlzLl9jb25uZWN0U3RhdHVzID0gcmVzLnN0YXR1c1RleHQ7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5faXNDb25uZWN0ID0gdHJ1ZTtcbiAgICAgICAgICAgIHRoaXMuX2Nvbm5lY3RTdGF0dXMgPSBcIlwiO1xuICAgICAgICAgICAgbGV0IGpzb24gPSB5aWVsZCByZXMuanNvbigpO1xuICAgICAgICAgICAgaWYgKCEhanNvbi5lcnIpIHtcbiAgICAgICAgICAgICAgICB0aGlzLl9pc0ZldGNoZWQgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICB0aGlzLl9jb25uZWN0U3RhdHVzID0ganNvbi5tc2c7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5faXNGZXRjaGVkID0gdHJ1ZTtcbiAgICAgICAgICAgIHRoaXMuX2Nvbm5lY3RTdGF0dXMgPSBcIk9LXCI7XG4gICAgICAgICAgICB0aGlzLl9saXN0ID0ganNvbi5kYXRhO1xuICAgICAgICB9KTtcbiAgICB9XG4gICAgZ2V0IHRhYmxlKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fbWFwO1xuICAgIH1cbiAgICBnZXQgbGlzdCgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2xpc3Q7XG4gICAgfVxufVxuZXhwb3J0cy5kZWZhdWx0ID0gVGFibGVEYXRhO1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9aW5kZXguanMubWFwIiwiXCJ1c2Ugc3RyaWN0XCI7XG52YXIgX19hd2FpdGVyID0gKHRoaXMgJiYgdGhpcy5fX2F3YWl0ZXIpIHx8IGZ1bmN0aW9uICh0aGlzQXJnLCBfYXJndW1lbnRzLCBQLCBnZW5lcmF0b3IpIHtcbiAgICByZXR1cm4gbmV3IChQIHx8IChQID0gUHJvbWlzZSkpKGZ1bmN0aW9uIChyZXNvbHZlLCByZWplY3QpIHtcbiAgICAgICAgZnVuY3Rpb24gZnVsZmlsbGVkKHZhbHVlKSB7IHRyeSB7IHN0ZXAoZ2VuZXJhdG9yLm5leHQodmFsdWUpKTsgfSBjYXRjaCAoZSkgeyByZWplY3QoZSk7IH0gfVxuICAgICAgICBmdW5jdGlvbiByZWplY3RlZCh2YWx1ZSkgeyB0cnkgeyBzdGVwKGdlbmVyYXRvcltcInRocm93XCJdKHZhbHVlKSk7IH0gY2F0Y2ggKGUpIHsgcmVqZWN0KGUpOyB9IH1cbiAgICAgICAgZnVuY3Rpb24gc3RlcChyZXN1bHQpIHsgcmVzdWx0LmRvbmUgPyByZXNvbHZlKHJlc3VsdC52YWx1ZSkgOiBuZXcgUChmdW5jdGlvbiAocmVzb2x2ZSkgeyByZXNvbHZlKHJlc3VsdC52YWx1ZSk7IH0pLnRoZW4oZnVsZmlsbGVkLCByZWplY3RlZCk7IH1cbiAgICAgICAgc3RlcCgoZ2VuZXJhdG9yID0gZ2VuZXJhdG9yLmFwcGx5KHRoaXNBcmcsIF9hcmd1bWVudHMgfHwgW10pKS5uZXh0KCkpO1xuICAgIH0pO1xufTtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmNvbnN0IFRhYmxlRGF0YV8xID0gcmVxdWlyZShcIi4uL1RhYmxlRGF0YVwiKTtcbmNsYXNzIEJhbmdUaHVvYyBleHRlbmRzIFRhYmxlRGF0YV8xLmRlZmF1bHQge1xuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICBzdXBlcigpO1xuICAgICAgICB0aGlzLl9kYlVSTCA9IFwiL2FwaS90aHVvYy9cIjtcbiAgICB9XG4gICAgdXBkYXRlKCkge1xuICAgICAgICByZXR1cm4gX19hd2FpdGVyKHRoaXMsIHZvaWQgMCwgdm9pZCAwLCBmdW5jdGlvbiogKCkge1xuICAgICAgICAgICAgeWllbGQgdGhpcy5nZXREYXRhKCk7XG4gICAgICAgICAgICBmb3IgKGxldCByb3cgb2YgdGhpcy5fbGlzdCkge1xuICAgICAgICAgICAgICAgIGxldCBpZCA9IHJvd1snaWQnXTtcbiAgICAgICAgICAgICAgICB0aGlzLl9tYXBbaWRdID0gcm93O1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9XG59XG5leHBvcnRzLkJhbmdUaHVvYyA9IEJhbmdUaHVvYztcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPUJhbmdUaHVvYy5qcy5tYXAiLCJcInVzZSBzdHJpY3RcIjtcbnZhciBfX2F3YWl0ZXIgPSAodGhpcyAmJiB0aGlzLl9fYXdhaXRlcikgfHwgZnVuY3Rpb24gKHRoaXNBcmcsIF9hcmd1bWVudHMsIFAsIGdlbmVyYXRvcikge1xuICAgIHJldHVybiBuZXcgKFAgfHwgKFAgPSBQcm9taXNlKSkoZnVuY3Rpb24gKHJlc29sdmUsIHJlamVjdCkge1xuICAgICAgICBmdW5jdGlvbiBmdWxmaWxsZWQodmFsdWUpIHsgdHJ5IHsgc3RlcChnZW5lcmF0b3IubmV4dCh2YWx1ZSkpOyB9IGNhdGNoIChlKSB7IHJlamVjdChlKTsgfSB9XG4gICAgICAgIGZ1bmN0aW9uIHJlamVjdGVkKHZhbHVlKSB7IHRyeSB7IHN0ZXAoZ2VuZXJhdG9yW1widGhyb3dcIl0odmFsdWUpKTsgfSBjYXRjaCAoZSkgeyByZWplY3QoZSk7IH0gfVxuICAgICAgICBmdW5jdGlvbiBzdGVwKHJlc3VsdCkgeyByZXN1bHQuZG9uZSA/IHJlc29sdmUocmVzdWx0LnZhbHVlKSA6IG5ldyBQKGZ1bmN0aW9uIChyZXNvbHZlKSB7IHJlc29sdmUocmVzdWx0LnZhbHVlKTsgfSkudGhlbihmdWxmaWxsZWQsIHJlamVjdGVkKTsgfVxuICAgICAgICBzdGVwKChnZW5lcmF0b3IgPSBnZW5lcmF0b3IuYXBwbHkodGhpc0FyZywgX2FyZ3VtZW50cyB8fCBbXSkpLm5leHQoKSk7XG4gICAgfSk7XG59O1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuY29uc3QgTW9kZWxDbGFzc18xID0gcmVxdWlyZShcIi4uL01vZGVsQ2xhc3NcIik7XG5jb25zdCBCYW5nVGh1b2NfMSA9IHJlcXVpcmUoXCIuL0JhbmdUaHVvY1wiKTtcbmV4cG9ydHMuQmFuZ1RodW9jID0gQmFuZ1RodW9jXzEuQmFuZ1RodW9jO1xuY2xhc3MgVGh1b2MgZXh0ZW5kcyBNb2RlbENsYXNzXzEuTW9kZWwge1xuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICBzdXBlcigpO1xuICAgICAgICB0aGlzLmRhdGFiYXNlID0gXCIvYXBpL3RodW9jL1wiO1xuICAgIH1cbiAgICBnZXQocGFyYW1zLCBvZmZzZXQsIGxpbWl0KSB7XG4gICAgICAgIHJldHVybiBfX2F3YWl0ZXIodGhpcywgdm9pZCAwLCB2b2lkIDAsIGZ1bmN0aW9uKiAoKSB7XG4gICAgICAgICAgICByZXR1cm4geWllbGQgdGhpcy5fZ2V0KHsgcTogcGFyYW1zLCBvZmZzZXQsIGxpbWl0IH0pO1xuICAgICAgICB9KTtcbiAgICB9XG4gICAgY3JlYXRlKGRhdGEpIHtcbiAgICAgICAgcmV0dXJuIF9fYXdhaXRlcih0aGlzLCB2b2lkIDAsIHZvaWQgMCwgZnVuY3Rpb24qICgpIHtcbiAgICAgICAgICAgIHRoaXMucmVzID0geWllbGQgdGhpcy5fcG9zdChkYXRhKTtcbiAgICAgICAgICAgIHJldHVybiAoIXRoaXMucmVzLmVycik7XG4gICAgICAgIH0pO1xuICAgIH1cbiAgICBhZGQobWEsIHNvTHVvbmcsIHRvbmdHaWEpIHtcbiAgICAgICAgcmV0dXJuIF9fYXdhaXRlcih0aGlzLCB2b2lkIDAsIHZvaWQgMCwgZnVuY3Rpb24qICgpIHtcbiAgICAgICAgICAgIC8vIHRoaXMucmVzID0gYXdhaXQgdGhpcy5fcG9zdCgpO1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9KTtcbiAgICB9XG59XG5leHBvcnRzLlRodW9jID0gVGh1b2M7XG4vLyMgc291cmNlTWFwcGluZ1VSTD1pbmRleC5qcy5tYXAiLCJcInVzZSBzdHJpY3RcIjtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmNvbnN0IFRodW9jXzEgPSByZXF1aXJlKFwiLi4vTW9kZWwvVGh1b2NcIik7XG5jb25zdCBWaWV3VGFibGVfMSA9IHJlcXVpcmUoXCIuL1ZpZXdUYWJsZVwiKTtcbmNvbnN0IE1lbnVDb250ZXh0XzEgPSByZXF1aXJlKFwiLi4vTWVudUNvbnRleHRcIik7XG5jbGFzcyBUaHVvY1RhYmxlIGV4dGVuZHMgVmlld1RhYmxlXzEuVmlld1RhYmxlIHtcbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgc3VwZXIoKTtcbiAgICAgICAgdGhpcy5lbGVtZW50ID0gJChcIjx0YWJsZS8+XCIpLmFkZENsYXNzKFwidGFibGUgdGFibGUtc3RyaXBlZCB0YWJsZS12aWV3XCIpO1xuICAgICAgICB0aGlzLmVsZW1lbnQuaHRtbChgXG4gICAgICAgIDx0aGVhZD5cbiAgICAgICAgICAgIDx0cj5cbiAgICAgICAgICAgICAgICA8dGg+TWEgVGh1b2M8L3RoPlxuICAgICAgICAgICAgICAgIDx0aD5UZW4gVGh1b2M8L3RoPlxuICAgICAgICAgICAgPC90cj5cbiAgICAgICAgPC90aGVhZD5cbiAgICAgICAgPHRib2R5PjwvdGJvZHk+XG4gICAgICAgIGApO1xuICAgICAgICB0aGlzLm1vZGVsID0gbmV3IFRodW9jXzEuVGh1b2MoKTtcbiAgICB9XG4gICAgb25Db250ZXh0QWRkKGZ1bmMpIHtcbiAgICAgICAgdGhpcy5mdW5jQ3R4QWRkID0gZnVuYztcbiAgICB9XG4gICAgb25Db250ZXh0RWRpdChmdW5jKSB7XG4gICAgICAgIHRoaXMuZnVuY0N0eEVkaXQgPSBmdW5jO1xuICAgIH1cbiAgICBvbkNvbnRleHRFZGl0UHJpY2UoZnVuYykge1xuICAgICAgICB0aGlzLmZ1bmNDdHhFZGl0UHJpY2UgPSBmdW5jO1xuICAgIH1cbiAgICBjdXN0b21DcmVhdGVSb3cocm93KSB7XG4gICAgICAgIGNvbnN0IGNvbnRleHRtZW51ID0gbmV3IE1lbnVDb250ZXh0XzEuTWVudUNvbnRleHQocm93KTtcbiAgICAgICAgY29udGV4dG1lbnUuYWRkQ29udGV4dCh7XG4gICAgICAgICAgICB0aXRsZTogXCJuaOG6rXAgdGjDqm0gdGh14buRY1wiLFxuICAgICAgICAgICAgY2xhc3NOYW1lOiBcInRleHQtc3VjY2Vzc1wiLFxuICAgICAgICAgICAgaWNvbjogXCJmYXMgZmEtcGx1cy1jaXJjbGVcIixcbiAgICAgICAgICAgIGNsaWNrOiAoZSkgPT4ge1xuICAgICAgICAgICAgICAgIHRoaXMuZnVuY0N0eEFkZCgpO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgfSkuYWRkQ29udGV4dCh7XG4gICAgICAgICAgICB0aXRsZTogXCJz4butYSB0aMO0bmcgdGluXCIsXG4gICAgICAgICAgICBjbGFzc05hbWU6IFwidGV4dC1wcmltYXJ5XCIsXG4gICAgICAgICAgICBpY29uOiBcImZhcyBmYS1wZW4tc3F1YXJlXCIsXG4gICAgICAgICAgICBjbGljazogKGUpID0+IHtcbiAgICAgICAgICAgICAgICB0aGlzLmZ1bmNDdHhFZGl0KCk7XG4gICAgICAgICAgICB9LFxuICAgICAgICB9KS5hZGRDb250ZXh0KHtcbiAgICAgICAgICAgIHRpdGxlOiBcImNo4buJbmggZ2nDoVwiLFxuICAgICAgICAgICAgaWNvbjogXCJmYSBmYS1kb2xsYXItc2lnblwiLFxuICAgICAgICAgICAgY2xpY2s6IChlKSA9PiB7XG4gICAgICAgICAgICAgICAgdGhpcy5mdW5jQ3R4RWRpdFByaWNlKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH1cbn1cbmV4cG9ydHMuVGh1b2NUYWJsZSA9IFRodW9jVGFibGU7XG4vLyMgc291cmNlTWFwcGluZ1VSTD1UaHVvY1RhYmxlLmpzLm1hcCIsIlwidXNlIHN0cmljdFwiO1xudmFyIF9fYXdhaXRlciA9ICh0aGlzICYmIHRoaXMuX19hd2FpdGVyKSB8fCBmdW5jdGlvbiAodGhpc0FyZywgX2FyZ3VtZW50cywgUCwgZ2VuZXJhdG9yKSB7XG4gICAgcmV0dXJuIG5ldyAoUCB8fCAoUCA9IFByb21pc2UpKShmdW5jdGlvbiAocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgICAgIGZ1bmN0aW9uIGZ1bGZpbGxlZCh2YWx1ZSkgeyB0cnkgeyBzdGVwKGdlbmVyYXRvci5uZXh0KHZhbHVlKSk7IH0gY2F0Y2ggKGUpIHsgcmVqZWN0KGUpOyB9IH1cbiAgICAgICAgZnVuY3Rpb24gcmVqZWN0ZWQodmFsdWUpIHsgdHJ5IHsgc3RlcChnZW5lcmF0b3JbXCJ0aHJvd1wiXSh2YWx1ZSkpOyB9IGNhdGNoIChlKSB7IHJlamVjdChlKTsgfSB9XG4gICAgICAgIGZ1bmN0aW9uIHN0ZXAocmVzdWx0KSB7IHJlc3VsdC5kb25lID8gcmVzb2x2ZShyZXN1bHQudmFsdWUpIDogbmV3IFAoZnVuY3Rpb24gKHJlc29sdmUpIHsgcmVzb2x2ZShyZXN1bHQudmFsdWUpOyB9KS50aGVuKGZ1bGZpbGxlZCwgcmVqZWN0ZWQpOyB9XG4gICAgICAgIHN0ZXAoKGdlbmVyYXRvciA9IGdlbmVyYXRvci5hcHBseSh0aGlzQXJnLCBfYXJndW1lbnRzIHx8IFtdKSkubmV4dCgpKTtcbiAgICB9KTtcbn07XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5jbGFzcyBWaWV3VGFibGUge1xuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICAvLyBjb25zdHJ1Y3RcbiAgICAgICAgdGhpcy5vZmZzZXQgPSAwO1xuICAgICAgICB0aGlzLmxpbWl0ID0gMTA7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIGdldCBkYXRhIHdpdGggc2VhcmNoIHZhbHVlXG4gICAgICogQHBhcmFtIHNlYXJjaCBmaWVsZD12YWx1ZVxuICAgICAqL1xuICAgIHVwZGF0ZShzZWFyY2gpIHtcbiAgICAgICAgcmV0dXJuIF9fYXdhaXRlcih0aGlzLCB2b2lkIDAsIHZvaWQgMCwgZnVuY3Rpb24qICgpIHtcbiAgICAgICAgICAgIC8vIHJlbmRlciBkYXRhIHRvIGVsZW1lbnRcbiAgICAgICAgICAgIGNvbnN0IHJhd0RhdGEgPSB5aWVsZCB0aGlzLm1vZGVsLmdldChzZWFyY2gsIHRoaXMub2Zmc2V0LCB0aGlzLmxpbWl0KTtcbiAgICAgICAgICAgIHRoaXMuZGF0YSA9IEFycmF5LmZyb20ocmF3RGF0YSkubWFwKCh2YWwpID0+IHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5maWx0ZXJEYXRhUm93KHZhbCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHRoaXMuc2l6ZU9mUmVjb3JkID0gdGhpcy5kYXRhLmxlbmd0aDtcbiAgICAgICAgICAgIHRoaXMuY3VycmVudFBvcyA9IC0xO1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuZGF0YTtcbiAgICAgICAgfSk7XG4gICAgfVxuICAgIHJlbmRlcihzZWFyY2gpIHtcbiAgICAgICAgcmV0dXJuIF9fYXdhaXRlcih0aGlzLCB2b2lkIDAsIHZvaWQgMCwgZnVuY3Rpb24qICgpIHtcbiAgICAgICAgICAgIGNvbnN0IGRhdGEgPSB5aWVsZCB0aGlzLnVwZGF0ZShzZWFyY2gpO1xuICAgICAgICAgICAgY29uc3QgdGJvZHkgPSB0aGlzLl9jcmVhdGVUYWJsZUJvZHkoZGF0YSk7XG4gICAgICAgICAgICB0aGlzLmVsZW1lbnQuZmluZChcInRib2R5XCIpLmh0bWwoXCJcIikuYXBwZW5kKHRib2R5LmNoaWxkcmVuKCkpO1xuICAgICAgICB9KTtcbiAgICB9XG4gICAgc2V0RWxlbWVudChlbCkge1xuICAgICAgICB0aGlzLmVsZW1lbnQgPSBlbDtcbiAgICB9XG4gICAgZ2V0RWxlbWVudCgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZWxlbWVudDtcbiAgICB9XG4gICAgY3VycmVudERhdGEoKSB7XG4gICAgICAgIGlmICghdGhpcy5jdXJyZW50Um93RGF0YSkge1xuICAgICAgICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gT2JqZWN0LmFzc2lnbih7fSwgdGhpcy5jdXJyZW50Um93RGF0YSk7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIGF0dGFjaCBldmVudCBvZiBjaG9vc2VcbiAgICAgKiBAcGFyYW0gY2FsbGJhY2sgY2FsbGJhY2sgZnVuY3Rpb24gd2hlbiB0aGUgcm93IG9mIHJlY29yZCBpcyBjaG9vc2VkXG4gICAgICovXG4gICAgb25DaG9vc2UoY2FsbGJhY2spIHtcbiAgICAgICAgdGhpcy5mdW5jT25DaG9vc2UgPSBjYWxsYmFjaztcbiAgICB9XG4gICAgLyoqXG4gICAgICogYXR0YWNoIGV2ZW50IG9mIGhvdmVyXG4gICAgICogQHBhcmFtIGNhbGxiYWNrIGNhbGxiYWNrIGZ1bmN0aW9uIHdoZW4gdGhlIHJvdyBvZiByZWNvcmQgaXMgaG92ZXIgb25cbiAgICAgKi9cbiAgICBvbkZvY3VzKGNhbGxiYWNrKSB7XG4gICAgICAgIHRoaXMuZnVuY09uRm9jdXMgPSBjYWxsYmFjaztcbiAgICB9XG4gICAgc2VsZWN0RG93bigpIHtcbiAgICAgICAgaWYgKHRoaXMuY3VycmVudFBvcyA8IHRoaXMuc2l6ZU9mUmVjb3JkIC0gMSkge1xuICAgICAgICAgICAgKyt0aGlzLmN1cnJlbnRQb3M7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5lbGVtZW50LmZpbmQoYHRyW2RhdGEtcG9zPSR7dGhpcy5jdXJyZW50UG9zfV1gKS5mb2N1cygpO1xuICAgIH1cbiAgICBzZWxlY3RVcCgpIHtcbiAgICAgICAgaWYgKHRoaXMuY3VycmVudFBvcyA+IDApIHtcbiAgICAgICAgICAgIC0tdGhpcy5jdXJyZW50UG9zO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuZWxlbWVudC5maW5kKGB0cltkYXRhLXBvcz0ke3RoaXMuY3VycmVudFBvc31dYCkuZm9jdXMoKTtcbiAgICB9XG4gICAgbmV4dFBhZ2Uoc2VhcmNoID0gXCJcIikge1xuICAgICAgICB0aGlzLm9mZnNldCArPSB0aGlzLmxpbWl0O1xuICAgICAgICB0aGlzLnJlbmRlcihzZWFyY2gpO1xuICAgIH1cbiAgICBzZXRMaW1pdFBlclBhZ2UobGltaXQpIHtcbiAgICAgICAgdGhpcy5saW1pdCA9IGxpbWl0O1xuICAgIH1cbiAgICBzZXRPZmZzZXQob2Zmc2V0KSB7XG4gICAgICAgIHRoaXMub2Zmc2V0ID0gb2Zmc2V0O1xuICAgIH1cbiAgICBmaWx0ZXJEYXRhUm93KGRhdGFSb3cpIHtcbiAgICAgICAgLy8gbm90aGluZyBoZXJlLCBqdXN0IHJhd1xuICAgICAgICByZXR1cm4gZGF0YVJvdztcbiAgICB9XG4gICAgX2NyZWF0ZVJvdyhkYXRhUm93LCBwb3MpIHtcbiAgICAgICAgY29uc3Qgcm93ID0gJChcIjx0ci8+XCIpLmF0dHIoXCJ0YWJpbmRleFwiLCAtMSkuYXR0cihcImRhdGEtcG9zXCIsIHBvcyk7XG4gICAgICAgIGZvciAoY29uc3QgZmllbGQgb2YgT2JqZWN0LmtleXMoZGF0YVJvdykpIHtcbiAgICAgICAgICAgIGNvbnN0IGNlbGwgPSAkKFwiPHRkLz5cIikuYXR0cihcIm5hbWVcIiwgZmllbGQpLnRleHQoZGF0YVJvd1tmaWVsZF0pO1xuICAgICAgICAgICAgcm93LmFwcGVuZChjZWxsKTtcbiAgICAgICAgfVxuICAgICAgICAvLyBjaG9vc2UgZXZlbnRcbiAgICAgICAgdGhpcy5fcm93T25DaG9vc2Uocm93LCAoKSA9PiB7XG4gICAgICAgICAgICB0aGlzLmZ1bmNPbkNob29zZShkYXRhUm93KTtcbiAgICAgICAgfSk7XG4gICAgICAgIC8vIGhvdmVyIGV2ZW50XG4gICAgICAgIHJvdy5vbihcImNsaWNrIGZvY3VzXCIsIChlKSA9PiB7XG4gICAgICAgICAgICB0aGlzLmVsZW1lbnQuZmluZChcInRyXCIpLnJlbW92ZUNsYXNzKFwiYWN0aXZlXCIpO1xuICAgICAgICAgICAgcm93LmFkZENsYXNzKFwiYWN0aXZlXCIpO1xuICAgICAgICAgICAgdGhpcy5jdXJyZW50UG9zID0gcG9zO1xuICAgICAgICAgICAgdGhpcy5jdXJyZW50Um93RGF0YSA9IGRhdGFSb3c7XG4gICAgICAgICAgICB0aGlzLmZ1bmNPbkZvY3VzKGRhdGFSb3cpO1xuICAgICAgICB9KTtcbiAgICAgICAgdGhpcy5jdXN0b21DcmVhdGVSb3cocm93KTtcbiAgICAgICAgcmV0dXJuIHJvdztcbiAgICB9XG4gICAgX2NyZWF0ZVRhYmxlQm9keShkYXRhKSB7XG4gICAgICAgIGNvbnN0IHRib2R5ID0gJChcIjx0Ym9keS8+XCIpO1xuICAgICAgICBsZXQgcG9zID0gMDtcbiAgICAgICAgZm9yIChjb25zdCByb3dEYXRhIG9mIGRhdGEpIHtcbiAgICAgICAgICAgIGNvbnN0IHRyb3cgPSB0aGlzLl9jcmVhdGVSb3cocm93RGF0YSwgcG9zKyspO1xuICAgICAgICAgICAgdGJvZHkuYXBwZW5kKHRyb3cpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0Ym9keTtcbiAgICB9XG4gICAgY3VzdG9tQ3JlYXRlUm93KHJvdykge1xuICAgICAgICAvLyBub3RoaW5nIGhlcmUsIHdpbGwgY2hhbmdlIGluIGluaGVyaXRhbmNlXG4gICAgfVxuICAgIF9yb3dPbkNob29zZShyb3csIGNhbGxiYWNrKSB7XG4gICAgICAgIHJvdy5vbihcImtleWRvd25cIiwgKGUpID0+IHtcbiAgICAgICAgICAgIGlmIChlLmtleUNvZGUgPT09IDEzKSB7XG4gICAgICAgICAgICAgICAgY2FsbGJhY2soKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgIHJvdy5vbihcImRibGNsaWNrXCIsICgpID0+IHtcbiAgICAgICAgICAgIGNhbGxiYWNrKCk7XG4gICAgICAgIH0pO1xuICAgIH1cbn1cbmV4cG9ydHMuVmlld1RhYmxlID0gVmlld1RhYmxlO1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9Vmlld1RhYmxlLmpzLm1hcCIsIlwidXNlIHN0cmljdFwiO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuY29uc3QgQXV0b0NvbXBsZXRlXzEgPSByZXF1aXJlKFwiLi4vQXV0b0NvbXBsZXRlXCIpO1xuZnVuY3Rpb24gaW5pdChhcHApIHtcbiAgICBjb25zdCBhdXRvY29tcGxldGUgPSBuZXcgQXV0b0NvbXBsZXRlXzEuQXV0b0NvbXBsZXRlKFwibmhhcF9ob2FfZG9uLS10ZW5fdGh1b2NcIiwgYXBwLnRodW9jKTtcbiAgICBhdXRvY29tcGxldGUuc2V0TG9va3VwKFtcIm1hXCIsIFwidGVuXCIsIFwibmNjXCIsIFwiZG9uX3ZpXCIsIFwiZG9uX2dpYVwiXSk7XG4gICAgYXV0b2NvbXBsZXRlLmxpc3RlbigpO1xuICAgIGF1dG9jb21wbGV0ZS5vbkNob29zZSgoZGF0YSkgPT4ge1xuICAgICAgICAkKFwiI25oYXBfaG9hX2Rvbi0tbWFfdGh1b2NcIikudmFsKGRhdGEubWEpO1xuICAgICAgICAkKFwiI25oYXBfaG9hX2Rvbi0tdGVuX3RodW9jXCIpLnZhbChkYXRhLnRlbik7XG4gICAgICAgICQoXCIjbmhhcF9ob2FfZG9uLS1uY2NcIikudmFsKGRhdGEubmNjKTtcbiAgICAgICAgJChcIiNuaGFwX2hvYV9kb24tLWdpYVwiKS52YWwoZGF0YS5kb25fZ2lhKTtcbiAgICAgICAgJChcIiNuaGFwX2hvYV9kb24tLWRvbl92aVwiKS52YWwoZGF0YS5kb25fdmkpO1xuICAgIH0pO1xufVxuZXhwb3J0cy5pbml0ID0gaW5pdDtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWluZGV4LmpzLm1hcCIsIlwidXNlIHN0cmljdFwiO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuY29uc3QgVGh1b2NUYWJsZV8xID0gcmVxdWlyZShcIi4uL1ZpZXcvVGh1b2NUYWJsZVwiKTtcbmNvbnN0IHRodW9jX21vZGFsXzEgPSByZXF1aXJlKFwiLi90aHVvYy1tb2RhbFwiKTtcbmNvbnN0IFBBR0VfSUQgPSBcInBhZ2UtbmhhcC10aHVvY1wiO1xuY2xhc3MgSW5pdCB7XG4gICAgY29uc3RydWN0b3IoYXBwKSB7XG4gICAgICAgIGNvbnN0IHRodW9jVGFibGUgPSBuZXcgVGh1b2NUYWJsZV8xLlRodW9jVGFibGUoKTtcbiAgICAgICAgdGhpcy50aHVvY1RhYmxlID0gdGh1b2NUYWJsZTtcbiAgICAgICAgdGhpcy5hcHAgPSBhcHA7XG4gICAgICAgIHRodW9jVGFibGUuc2V0RWxlbWVudCgkKFwiI25oYXBfdGh1b2MtLXRhYmxlXCIpKTtcbiAgICAgICAgdGh1b2NUYWJsZS5zZXRMaW1pdFBlclBhZ2UoMTAwKTtcbiAgICAgICAgdGh1b2NUYWJsZS5vbkNob29zZSgoZGF0YSkgPT4ge1xuICAgICAgICAgICAgdGhpcy5hZGRUaHVvYyhkYXRhKTtcbiAgICAgICAgfSk7XG4gICAgICAgIHRodW9jVGFibGUub25Gb2N1cygoZGF0YSkgPT4ge1xuICAgICAgICAgICAgJChcIi50aHVvYy0tYnV0dG9uXCIpLnJlbW92ZUF0dHIoXCJkaXNhYmxlZFwiKTtcbiAgICAgICAgfSk7XG4gICAgICAgIHRodW9jVGFibGUub25Db250ZXh0QWRkKCgpID0+IHtcbiAgICAgICAgICAgIHRoaXMuYWRkVGh1b2ModGh1b2NUYWJsZS5jdXJyZW50RGF0YSgpKTtcbiAgICAgICAgfSk7XG4gICAgICAgIHRodW9jVGFibGUub25Db250ZXh0RWRpdCgoKSA9PiB7XG4gICAgICAgICAgICB0aGlzLmVkaXRUaHVvYyh0aHVvY1RhYmxlLmN1cnJlbnREYXRhKCkpO1xuICAgICAgICB9KTtcbiAgICAgICAgdGh1b2NUYWJsZS5vbkNvbnRleHRFZGl0UHJpY2UoKCkgPT4ge1xuICAgICAgICAgICAgdGhpcy5lZGl0UHJpY2VUaHVvYyh0aHVvY1RhYmxlLmN1cnJlbnREYXRhKCkpO1xuICAgICAgICB9KTtcbiAgICAgICAgdGh1b2NUYWJsZS5yZW5kZXIoXCJcIik7XG4gICAgICAgIHRoaXMuaGFuZGxlQ29udHJvbEtleShhcHApO1xuICAgICAgICB0aGlzLmhhbmRsZVNlbGVjdEtleShhcHApO1xuICAgICAgICB0aGlzLmhhbmRsZU1vZGFsRXZlbnQoKTtcbiAgICAgICAgdGhpcy5oYW5kbGVTZWFyY2hJbnB1dCgpO1xuICAgICAgICBjb25zdCAkdGhpcyA9IHRoaXM7XG4gICAgICAgICQoXCIudGh1b2MtLWJ1dHRvblwiKS5vbihcImNsaWNrXCIsIGZ1bmN0aW9uIEJ1dHRvbkNsaWNrKCkge1xuICAgICAgICAgICAgY29uc3Qgcm9sZSA9ICQodGhpcykuYXR0cihcImFwcC1yb2xlXCIpO1xuICAgICAgICAgICAgc3dpdGNoIChyb2xlKSB7XG4gICAgICAgICAgICAgICAgY2FzZSBcIm5ld1wiOlxuICAgICAgICAgICAgICAgICAgICAkdGhpcy5uZXdUaHVvYygpO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBjYXNlIFwiZWRpdFwiOlxuICAgICAgICAgICAgICAgICAgICAkdGhpcy5lZGl0VGh1b2ModGh1b2NUYWJsZS5jdXJyZW50RGF0YSgpKTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgY2FzZSBcImFkZFwiOlxuICAgICAgICAgICAgICAgICAgICAkdGhpcy5hZGRUaHVvYyh0aHVvY1RhYmxlLmN1cnJlbnREYXRhKCkpO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBjYXNlIFwiY2hpbmgtZ2lhXCI6XG4gICAgICAgICAgICAgICAgICAgICR0aGlzLmVkaXRQcmljZVRodW9jKHRodW9jVGFibGUuY3VycmVudERhdGEoKSk7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9XG4gICAgaGFuZGxlU2VsZWN0S2V5KGFwcCkge1xuICAgICAgICBhcHAub25TaG9ydGN1dEtleShcIkFycm93VXBcIiwgUEFHRV9JRCwgKGUpID0+IHtcbiAgICAgICAgICAgIHRoaXMudGh1b2NUYWJsZS5zZWxlY3RVcCgpO1xuICAgICAgICB9KTtcbiAgICAgICAgYXBwLm9uU2hvcnRjdXRLZXkoXCJBcnJvd0Rvd25cIiwgUEFHRV9JRCwgKGUpID0+IHtcbiAgICAgICAgICAgIHRoaXMudGh1b2NUYWJsZS5zZWxlY3REb3duKCk7XG4gICAgICAgIH0pO1xuICAgIH1cbiAgICBoYW5kbGVDb250cm9sS2V5KGFwcCkge1xuICAgICAgICBhcHAub25TaG9ydGN1dEtleShcImN0cmwrZFwiLCBQQUdFX0lELCAoZSkgPT4ge1xuICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgdGhpcy5uZXdUaHVvYygpO1xuICAgICAgICB9KTtcbiAgICAgICAgYXBwLm9uU2hvcnRjdXRLZXkoXCJjdHJsK2VcIiwgUEFHRV9JRCwgKGUpID0+IHtcbiAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgIHRoaXMuZWRpdFRodW9jKHRoaXMudGh1b2NUYWJsZS5jdXJyZW50RGF0YSgpKTtcbiAgICAgICAgfSk7XG4gICAgICAgIGFwcC5vblNob3J0Y3V0S2V5KFwiY3RybCtnXCIsIFBBR0VfSUQsIChlKSA9PiB7XG4gICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICB0aGlzLmVkaXRQcmljZVRodW9jKHRoaXMudGh1b2NUYWJsZS5jdXJyZW50RGF0YSgpKTtcbiAgICAgICAgfSk7XG4gICAgICAgIGFwcC5vblNob3J0Y3V0S2V5KFwiY3RybCtmXCIsIFBBR0VfSUQsIChlKSA9PiB7XG4gICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICAkKFwiI3RodW9jLS1zZWFyY2hcIikuZm9jdXMoKTtcbiAgICAgICAgfSk7XG4gICAgfVxuICAgIGhhbmRsZVNlYXJjaElucHV0KCkge1xuICAgICAgICBjb25zdCAkdGhpcyA9IHRoaXM7XG4gICAgICAgICQoXCIjdGh1b2MtLXNlYXJjaFwiKS5vbihcImtleXVwXCIsIGZ1bmN0aW9uIFNlYXJjaGluZygpIHtcbiAgICAgICAgICAgIGNvbnN0IHZhbCA9ICQodGhpcykudmFsKCk7XG4gICAgICAgICAgICAkdGhpcy50aHVvY1RhYmxlLnJlbmRlcih2YWwpO1xuICAgICAgICB9KTtcbiAgICB9XG4gICAgaGFuZGxlTW9kYWxFdmVudCgpIHtcbiAgICAgICAgdGhpcy5hZGRNb2RhbCA9IG5ldyB0aHVvY19tb2RhbF8xLk5ld1RodW9jTW9kYWwoXCJ0aHVvYy0tbmV3LW1vZGFsXCIsIHRoaXMuYXBwLnRodW9jKTtcbiAgICAgICAgdGhpcy5uZXdNb2RhbCA9IG5ldyB0aHVvY19tb2RhbF8xLkFkZFRodW9jTW9kYWwoXCJ0aHVvYy0tYWRkLW1vZGFsXCIsIHRoaXMuYXBwLnRodW9jKTtcbiAgICAgICAgdGhpcy5lZGl0TW9kYWwgPSBuZXcgdGh1b2NfbW9kYWxfMS5FZGl0VGh1b2NNb2RhbChcInRodW9jLS1lZGl0LW1vZGFsXCIsIHRoaXMuYXBwLnRodW9jKTtcbiAgICAgICAgdGhpcy5lZGl0UHJpY2VNb2RhbCA9IG5ldyB0aHVvY19tb2RhbF8xLkVkaXRQcmljZVRodW9jTW9kYWwoXCJ0aHVvYy0tZWRpdC1wcmljZS1tb2RhbFwiLCB0aGlzLmFwcC50aHVvYyk7XG4gICAgfVxuICAgIGVkaXRUaHVvYyhkYXRhKSB7XG4gICAgICAgIGlmICghZGF0YSkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgICQoXCIjdGh1b2MtLWVkaXQtbW9kYWxcIikubW9kYWwoXCJzaG93XCIpO1xuICAgICAgICAkKFwiI3RodW9jLS1lZGl0LW1hdGh1b2NcIikudmFsKGRhdGEubWEpO1xuICAgICAgICAkKFwiI3RodW9jLS1lZGl0LXRlbnRodW9jXCIpLnZhbChkYXRhLnRlbik7XG4gICAgICAgICQoXCIjdGh1b2MtLWVkaXQtbmNjXCIpLnZhbChkYXRhLnRlbl9uY2MpO1xuICAgIH1cbiAgICBuZXdUaHVvYygpIHtcbiAgICAgICAgJChcIiN0aHVvYy0tbmV3LW1vZGFsXCIpLm1vZGFsKFwic2hvd1wiKTtcbiAgICB9XG4gICAgYWRkVGh1b2MoZGF0YSkge1xuICAgICAgICBpZiAoIWRhdGEpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICAkKFwiI3RodW9jLS1hZGQtbW9kYWxcIikubW9kYWwoXCJzaG93XCIpO1xuICAgICAgICAkKFwiI3RodW9jLS1hZGQtbWF0aHVvY1wiKS52YWwoZGF0YS5tYSk7XG4gICAgICAgICQoXCIjdGh1b2MtLWFkZC10ZW50aHVvY1wiKS52YWwoZGF0YS50ZW4pO1xuICAgICAgICAkKFwiI3RodW9jLS1hZGQtbmNjXCIpLnZhbChkYXRhLnRlbl9uY2MpO1xuICAgICAgICAkKFwiI3RodW9jLS1hZGQtc29sdW9uZ1wiKS52YWwoZGF0YS5zb19sdW9uZyk7XG4gICAgfVxuICAgIGVkaXRQcmljZVRodW9jKGRhdGEpIHtcbiAgICAgICAgaWYgKCFkYXRhKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgJChcIiN0aHVvYy0tZWRpdC1wcmljZS1tb2RhbFwiKS5tb2RhbChcInNob3dcIik7XG4gICAgICAgICQoXCIjdGh1b2MtLWVkaXQtcHJpY2UtbWF0aHVvY1wiKS52YWwoZGF0YS5tYSk7XG4gICAgICAgICQoXCIjdGh1b2MtLWVkaXQtcHJpY2UtdGVudGh1b2NcIikudmFsKGRhdGEudGVuKTtcbiAgICB9XG59XG5mdW5jdGlvbiBpbml0KGFwcCkge1xuICAgIHJldHVybiBuZXcgSW5pdChhcHApO1xufVxuZXhwb3J0cy5pbml0ID0gaW5pdDtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWluZGV4LmpzLm1hcCIsIlwidXNlIHN0cmljdFwiO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuY2xhc3MgQWRkVGh1b2NNb2RhbCB7XG4gICAgY29uc3RydWN0b3IoaWQsIG1vZGVsKSB7XG4gICAgICAgIHRoaXMubW9kZWwgPSBtb2RlbDtcbiAgICAgICAgdGhpcy5wb3B1cCA9ICQoXCIjXCIgKyBpZCk7XG4gICAgICAgIHRoaXMucG9wdXAubG9hZChcIi9sYXlvdXRzL21vZGFsLWFkZC10aHVvYy5odG1sXCIpO1xuICAgIH1cbiAgICBzaG93KCkge1xuICAgICAgICB0aGlzLnBvcHVwLm1vZGFsKFwic2hvd1wiKTtcbiAgICB9XG4gICAgaGlkZSgpIHtcbiAgICAgICAgdGhpcy5wb3B1cC5tb2RhbChcImhpZGVcIik7XG4gICAgfVxufVxuZXhwb3J0cy5BZGRUaHVvY01vZGFsID0gQWRkVGh1b2NNb2RhbDtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPXRodW9jLWFkZC1tb2RhbC5qcy5tYXAiLCJcInVzZSBzdHJpY3RcIjtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmNsYXNzIEVkaXRUaHVvY01vZGFsIHtcbiAgICBjb25zdHJ1Y3RvcihpZCwgbW9kZWwpIHtcbiAgICAgICAgdGhpcy5tb2RlbCA9IG1vZGVsO1xuICAgICAgICB0aGlzLnBvcHVwID0gJChcIiNcIiArIGlkKTtcbiAgICAgICAgdGhpcy5wb3B1cC5sb2FkKFwiL2xheW91dHMvbW9kYWwtZWRpdC10aHVvYy5odG1sXCIpO1xuICAgIH1cbiAgICBzaG93KCkge1xuICAgICAgICB0aGlzLnBvcHVwLm1vZGFsKFwic2hvd1wiKTtcbiAgICB9XG4gICAgaGlkZSgpIHtcbiAgICAgICAgdGhpcy5wb3B1cC5tb2RhbChcImhpZGVcIik7XG4gICAgfVxufVxuZXhwb3J0cy5FZGl0VGh1b2NNb2RhbCA9IEVkaXRUaHVvY01vZGFsO1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9dGh1b2MtZWRpdC1tb2RhbC5qcy5tYXAiLCJcInVzZSBzdHJpY3RcIjtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmNsYXNzIEVkaXRQcmljZVRodW9jTW9kYWwge1xuICAgIGNvbnN0cnVjdG9yKGlkLCBtb2RlbCkge1xuICAgICAgICB0aGlzLm1vZGVsID0gbW9kZWw7XG4gICAgICAgIHRoaXMucG9wdXAgPSAkKFwiI1wiICsgaWQpO1xuICAgICAgICB0aGlzLnBvcHVwLmxvYWQoXCIvbGF5b3V0cy9tb2RhbC1lZGl0LXByaWNlLXRodW9jLmh0bWxcIik7XG4gICAgfVxuICAgIHNob3coKSB7XG4gICAgICAgIHRoaXMucG9wdXAubW9kYWwoXCJzaG93XCIpO1xuICAgIH1cbiAgICBoaWRlKCkge1xuICAgICAgICB0aGlzLnBvcHVwLm1vZGFsKFwiaGlkZVwiKTtcbiAgICB9XG59XG5leHBvcnRzLkVkaXRQcmljZVRodW9jTW9kYWwgPSBFZGl0UHJpY2VUaHVvY01vZGFsO1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9dGh1b2MtZWRpdC1wcmljZS1tb2RhbC5qcy5tYXAiLCJcInVzZSBzdHJpY3RcIjtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmNvbnN0IHRodW9jX2FkZF9tb2RhbF8xID0gcmVxdWlyZShcIi4vdGh1b2MtYWRkLW1vZGFsXCIpO1xuZXhwb3J0cy5BZGRUaHVvY01vZGFsID0gdGh1b2NfYWRkX21vZGFsXzEuQWRkVGh1b2NNb2RhbDtcbmNvbnN0IHRodW9jX2VkaXRfbW9kYWxfMSA9IHJlcXVpcmUoXCIuL3RodW9jLWVkaXQtbW9kYWxcIik7XG5leHBvcnRzLkVkaXRUaHVvY01vZGFsID0gdGh1b2NfZWRpdF9tb2RhbF8xLkVkaXRUaHVvY01vZGFsO1xuY29uc3QgdGh1b2NfbmV3X21vZGFsXzEgPSByZXF1aXJlKFwiLi90aHVvYy1uZXctbW9kYWxcIik7XG5leHBvcnRzLk5ld1RodW9jTW9kYWwgPSB0aHVvY19uZXdfbW9kYWxfMS5OZXdUaHVvY01vZGFsO1xuY29uc3QgdGh1b2NfZWRpdF9wcmljZV9tb2RhbF8xID0gcmVxdWlyZShcIi4vdGh1b2MtZWRpdC1wcmljZS1tb2RhbFwiKTtcbmV4cG9ydHMuRWRpdFByaWNlVGh1b2NNb2RhbCA9IHRodW9jX2VkaXRfcHJpY2VfbW9kYWxfMS5FZGl0UHJpY2VUaHVvY01vZGFsO1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9dGh1b2MtbW9kYWwuanMubWFwIiwiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5jbGFzcyBOZXdUaHVvY01vZGFsIHtcbiAgICBjb25zdHJ1Y3RvcihpZCwgbW9kZWwpIHtcbiAgICAgICAgdGhpcy5tb2RlbCA9IG1vZGVsO1xuICAgICAgICB0aGlzLnBvcHVwID0gJChcIiNcIiArIGlkKTtcbiAgICAgICAgdGhpcy5wb3B1cC5sb2FkKFwiL2xheW91dHMvbW9kYWwtbmV3LXRodW9jLmh0bWxcIik7XG4gICAgfVxuICAgIHNob3coKSB7XG4gICAgICAgIHRoaXMucG9wdXAubW9kYWwoXCJzaG93XCIpO1xuICAgIH1cbiAgICBoaWRlKCkge1xuICAgICAgICB0aGlzLnBvcHVwLm1vZGFsKFwiaGlkZVwiKTtcbiAgICB9XG59XG5leHBvcnRzLk5ld1RodW9jTW9kYWwgPSBOZXdUaHVvY01vZGFsO1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9dGh1b2MtbmV3LW1vZGFsLmpzLm1hcCIsImNvbnN0IHtBcHB9ID0gcmVxdWlyZSgnLi4vYXBwL0FwcCcpO1xuXG4kKGRvY3VtZW50KS5yZWFkeSgoKT0+e1xuICAgIGNvbnN0IGFwcCA9IG5ldyBBcHAoKTtcblxuICAgIHJlcXVpcmUoXCIuLi9hcHAvbmhhcC1ob2EtZG9uXCIpLmluaXQoYXBwKTtcbiAgICByZXF1aXJlKFwiLi4vYXBwL25oYXAtdGh1b2NcIikuaW5pdChhcHApO1xufSk7XG4iXX0=
