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

},{"./KeyEvent":3,"./Model/DonVi":5,"./Model/Thuoc":7}],2:[function(require,module,exports){
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

},{"../ModelClass":6}],8:[function(require,module,exports){
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

},{"../MenuContext":4,"../Model/Thuoc":7,"./ViewTable":9}],9:[function(require,module,exports){
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

},{}],10:[function(require,module,exports){
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

},{"../View/ThuocTable":8,"./thuoc-modal":16}],13:[function(require,module,exports){
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

},{}],14:[function(require,module,exports){
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

},{"../formVal":10}],15:[function(require,module,exports){
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

},{"../formVal":10}],18:[function(require,module,exports){
const {App} = require('../app/App');

$(document).ready(()=>{
    const app = new App();

    require("../app/nhap-hoa-don").init(app);
    require("../app/nhap-thuoc").init(app);
});

},{"../app/App":1,"../app/nhap-hoa-don":11,"../app/nhap-thuoc":12}]},{},[18])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvYXBwL0FwcC5qcyIsInNyYy9hcHAvQXV0b0NvbXBsZXRlL2luZGV4LmpzIiwic3JjL2FwcC9LZXlFdmVudC9pbmRleC5qcyIsInNyYy9hcHAvTWVudUNvbnRleHQvaW5kZXguanMiLCJzcmMvYXBwL01vZGVsL0RvblZpL2luZGV4LmpzIiwic3JjL2FwcC9Nb2RlbC9Nb2RlbENsYXNzL2luZGV4LmpzIiwic3JjL2FwcC9Nb2RlbC9UaHVvYy9pbmRleC5qcyIsInNyYy9hcHAvVmlldy9UaHVvY1RhYmxlLmpzIiwic3JjL2FwcC9WaWV3L1ZpZXdUYWJsZS5qcyIsInNyYy9hcHAvZm9ybVZhbC5qcyIsInNyYy9hcHAvbmhhcC1ob2EtZG9uL2luZGV4LmpzIiwic3JjL2FwcC9uaGFwLXRodW9jL2luZGV4LmpzIiwic3JjL2FwcC9uaGFwLXRodW9jL3RodW9jLWFkZC1tb2RhbC5qcyIsInNyYy9hcHAvbmhhcC10aHVvYy90aHVvYy1lZGl0LW1vZGFsLmpzIiwic3JjL2FwcC9uaGFwLXRodW9jL3RodW9jLWVkaXQtcHJpY2UtbW9kYWwuanMiLCJzcmMvYXBwL25oYXAtdGh1b2MvdGh1b2MtbW9kYWwuanMiLCJzcmMvYXBwL25oYXAtdGh1b2MvdGh1b2MtbmV3LW1vZGFsLmpzIiwic3JjL3NjcmlwdC9tYWluLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3ZIQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3hDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3BEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzVCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN6SkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQy9DQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3ZEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3hJQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDWEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzFIQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDL0NBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNsREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNWQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDL0NBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uKCl7ZnVuY3Rpb24gcihlLG4sdCl7ZnVuY3Rpb24gbyhpLGYpe2lmKCFuW2ldKXtpZighZVtpXSl7dmFyIGM9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZTtpZighZiYmYylyZXR1cm4gYyhpLCEwKTtpZih1KXJldHVybiB1KGksITApO3ZhciBhPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIraStcIidcIik7dGhyb3cgYS5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGF9dmFyIHA9bltpXT17ZXhwb3J0czp7fX07ZVtpXVswXS5jYWxsKHAuZXhwb3J0cyxmdW5jdGlvbihyKXt2YXIgbj1lW2ldWzFdW3JdO3JldHVybiBvKG58fHIpfSxwLHAuZXhwb3J0cyxyLGUsbix0KX1yZXR1cm4gbltpXS5leHBvcnRzfWZvcih2YXIgdT1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlLGk9MDtpPHQubGVuZ3RoO2krKylvKHRbaV0pO3JldHVybiBvfXJldHVybiByfSkoKSIsIlwidXNlIHN0cmljdFwiO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuY29uc3QgS2V5RXZlbnRfMSA9IHJlcXVpcmUoXCIuL0tleUV2ZW50XCIpO1xuY29uc3QgVGh1b2NfMSA9IHJlcXVpcmUoXCIuL01vZGVsL1RodW9jXCIpO1xuY29uc3QgRG9uVmlfMSA9IHJlcXVpcmUoXCIuL01vZGVsL0RvblZpXCIpO1xuY2xhc3MgQXBwIHtcbiAgICAvLyBwdWJsaWMgbmNjOlxuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICB0aGlzLnN3aXRjaFRvUGFnZSh0aGlzLmdldFBhZ2VGcm9tVXJsKCkpO1xuICAgICAgICB0aGlzLmhhbmRsZVN3aXRjaFBhZ2UoKTtcbiAgICAgICAgdGhpcy5rZXlldmVudCA9IG5ldyBLZXlFdmVudF8xLktleUV2ZW50KCk7XG4gICAgICAgIHRoaXMuaGFuZGxlU2V0dGluZygpO1xuICAgICAgICB0aGlzLmhhbmRsZU1vZGFsKCk7XG4gICAgICAgIHRoaXMudGh1b2MgPSBuZXcgVGh1b2NfMS5UaHVvYygpO1xuICAgICAgICB0aGlzLmRvblZpID0gbmV3IERvblZpXzEuRG9uVmkoKTtcbiAgICB9XG4gICAgZ2V0VXNlcm5hbWUoKSB7XG4gICAgICAgIGNvbnN0IHVzZXJuYW1lID0gZG9jdW1lbnQuY29va2llLm1hdGNoKC91c2VybmFtZT0oWzAtOWEtekEtWl9dKykvaSlbMV07XG4gICAgICAgICQoXCIjdXNlcm5hbWVcIikudGV4dCh1c2VybmFtZSk7XG4gICAgfVxuICAgIG9uU2hvcnRjdXRLZXkoY29tYktleSwgcGFnZSwgZnVuYykge1xuICAgICAgICAvLyBmKmtpbmcgaW5jcmVkaWJsZSBzY29wZSB0aGluZ3MhXG4gICAgICAgIHRoaXMua2V5ZXZlbnQub24oY29tYktleSwgKGUpID0+IHtcbiAgICAgICAgICAgIGlmICh0aGlzLnBhZ2UgPT09IHBhZ2UpIHtcbiAgICAgICAgICAgICAgICBmdW5jKGUpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9XG4gICAgZ2V0UGFnZUZyb21VcmwoKSB7XG4gICAgICAgIGxldCBwYWdlID0gbmV3IFVSTCh3aW5kb3cubG9jYXRpb24udG9TdHJpbmcoKSkuc2VhcmNoUGFyYW1zLmdldChcInBhZ2VcIik7XG4gICAgICAgIGlmICghcGFnZSkge1xuICAgICAgICAgICAgcGFnZSA9IFwicGFnZS1uaGFwLWhvYS1kb25cIjtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcGFnZTtcbiAgICB9XG4gICAgaGFuZGxlU3dpdGNoUGFnZSgpIHtcbiAgICAgICAgY29uc3QgJHRoaXMgPSB0aGlzO1xuICAgICAgICAkKFwiLnNpZGViYXItc3dpdGNoLXBhZ2VcIikub24oXCJjbGlja1wiLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBjb25zdCBpZCA9ICQodGhpcykuZGF0YShcInRhcmdldFwiKTtcbiAgICAgICAgICAgICR0aGlzLnN3aXRjaFRvUGFnZShpZCk7XG4gICAgICAgIH0pO1xuICAgIH1cbiAgICBzd2l0Y2hUb1BhZ2UoaWQpIHtcbiAgICAgICAgdGhpcy5wYWdlID0gaWQ7XG4gICAgICAgIHdpbmRvdy5oaXN0b3J5LnJlcGxhY2VTdGF0ZShudWxsLCBpZCwgXCIvP3BhZ2U9XCIgKyBpZCk7XG4gICAgICAgIGNvbnN0IGNvbnRhaW5lciA9ICQoXCIuZnJhbWUtY29udGFpbmVyXCIpO1xuICAgICAgICBjb25zdCBwYWdlID0gJChcIiNcIiArIGlkKTtcbiAgICAgICAgY29udGFpbmVyLmFuaW1hdGUoe1xuICAgICAgICAgICAgc2Nyb2xsVG9wOiBwYWdlLm9mZnNldCgpLnRvcCAtIGNvbnRhaW5lci5vZmZzZXQoKS50b3AgKyBjb250YWluZXIuc2Nyb2xsVG9wKCksXG4gICAgICAgIH0pO1xuICAgIH1cbiAgICBoYW5kbGVTZXR0aW5nKCkge1xuICAgICAgICAvL1xuICAgIH1cbiAgICBoYW5kbGVNb2RhbCgpIHtcbiAgICAgICAgJChcIi5tb2RhbFwiKS5vbihcInNob3duLmJzLm1vZGFsXCIsICgpID0+IHtcbiAgICAgICAgICAgIHRoaXMua2V5ZXZlbnQuYmxvY2soKTtcbiAgICAgICAgfSk7XG4gICAgICAgICQoXCIubW9kYWxcIikub24oXCJoaWRkZW4uYnMubW9kYWxcIiwgKCkgPT4ge1xuICAgICAgICAgICAgdGhpcy5rZXlldmVudC51bmJsb2NrKCk7XG4gICAgICAgIH0pO1xuICAgIH1cbn1cbmV4cG9ydHMuQXBwID0gQXBwO1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9QXBwLmpzLm1hcCIsIlwidXNlIHN0cmljdFwiO1xudmFyIF9fYXdhaXRlciA9ICh0aGlzICYmIHRoaXMuX19hd2FpdGVyKSB8fCBmdW5jdGlvbiAodGhpc0FyZywgX2FyZ3VtZW50cywgUCwgZ2VuZXJhdG9yKSB7XG4gICAgcmV0dXJuIG5ldyAoUCB8fCAoUCA9IFByb21pc2UpKShmdW5jdGlvbiAocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgICAgIGZ1bmN0aW9uIGZ1bGZpbGxlZCh2YWx1ZSkgeyB0cnkgeyBzdGVwKGdlbmVyYXRvci5uZXh0KHZhbHVlKSk7IH0gY2F0Y2ggKGUpIHsgcmVqZWN0KGUpOyB9IH1cbiAgICAgICAgZnVuY3Rpb24gcmVqZWN0ZWQodmFsdWUpIHsgdHJ5IHsgc3RlcChnZW5lcmF0b3JbXCJ0aHJvd1wiXSh2YWx1ZSkpOyB9IGNhdGNoIChlKSB7IHJlamVjdChlKTsgfSB9XG4gICAgICAgIGZ1bmN0aW9uIHN0ZXAocmVzdWx0KSB7IHJlc3VsdC5kb25lID8gcmVzb2x2ZShyZXN1bHQudmFsdWUpIDogbmV3IFAoZnVuY3Rpb24gKHJlc29sdmUpIHsgcmVzb2x2ZShyZXN1bHQudmFsdWUpOyB9KS50aGVuKGZ1bGZpbGxlZCwgcmVqZWN0ZWQpOyB9XG4gICAgICAgIHN0ZXAoKGdlbmVyYXRvciA9IGdlbmVyYXRvci5hcHBseSh0aGlzQXJnLCBfYXJndW1lbnRzIHx8IFtdKSkubmV4dCgpKTtcbiAgICB9KTtcbn07XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5jbGFzcyBBdXRvQ29tcGxldGUge1xuICAgIGNvbnN0cnVjdG9yKHRhcmdldCwgbW9kZWwpIHtcbiAgICAgICAgaWYgKHR5cGVvZiB0YXJnZXQgPT09IFwic3RyaW5nXCIpIHtcbiAgICAgICAgICAgIHRoaXMudGFyZ2V0ID0gJChcIiNcIiArIHRhcmdldCk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICB0aGlzLnRhcmdldCA9IHRhcmdldDtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLnRhcmdldC5hdHRyKFwiYXV0b2NvbXBsZXRlXCIsIFwib2ZmXCIpO1xuICAgICAgICB0aGlzLm1vZGVsID0gbW9kZWw7XG4gICAgfVxuICAgIG9uQ2hvb3NlKGZ1bmMpIHtcbiAgICAgICAgdGhpcy5mdW5jT25DaG9vc2UgPSBmdW5jO1xuICAgIH1cbiAgICBpc1Nob3dlZCgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZWxlbWVudC5jaGlsZHJlbi5sZW5ndGggPiAwO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBzZXQgZmllbGRuYW1lIHRvIHNob3dcbiAgICAgKiBAcGFyYW0gbG9va3VwIHtmaWVsZE5hbWU6IEVsZW1lbnRJZH1cbiAgICAgKi9cbiAgICBzZXRMb29rdXAobG9va3VwKSB7XG4gICAgICAgIHRoaXMubG9va3VwID0gbG9va3VwO1xuICAgIH1cbiAgICBsaXN0ZW4oKSB7XG4gICAgICAgIHRoaXMudGFyZ2V0Lm9uKFwia2V5dXBcIiwgKGUpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IGtleSA9IGUua2V5O1xuICAgICAgICAgICAgc3dpdGNoIChrZXkpIHtcbiAgICAgICAgICAgICAgICBjYXNlIFwiRW50ZXJcIjoge1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgY2FzZSBcIkVzY2FwZVwiOiB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMucmVtb3ZlKCk7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBjYXNlIFwiQXJyb3dVcFwiOiB7XG4gICAgICAgICAgICAgICAgICAgIC8vIHRvIGRvXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBjYXNlIFwiQXJyb3dEb3duXCI6IHtcbiAgICAgICAgICAgICAgICAgICAgLy8gdG8gZG9cbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGRlZmF1bHQ6IHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgdmFsID0gdGhpcy50YXJnZXQudmFsKCk7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMucmVtb3ZlKCk7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMucmVuZGVyKHZhbCkudGhlbigoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnNob3coKTtcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9XG4gICAgcmVuZGVyKHNlYXJjaCkge1xuICAgICAgICByZXR1cm4gX19hd2FpdGVyKHRoaXMsIHZvaWQgMCwgdm9pZCAwLCBmdW5jdGlvbiogKCkge1xuICAgICAgICAgICAgdGhpcy5lbGVtZW50ID0gJChcIjx1bC8+XCIpLmFkZENsYXNzKFwibXktYXV0b2NvbXBsZXRlIHNoYWRvdy1sZyByb3VuZGVkXCIpO1xuICAgICAgICAgICAgdGhpcy5lbGVtZW50LmNzcyh7XG4gICAgICAgICAgICAgICAgdG9wOiB0aGlzLnRhcmdldC5vZmZzZXQoKS50b3AgKyB0aGlzLnRhcmdldC5vdXRlckhlaWdodCgpLFxuICAgICAgICAgICAgICAgIGxlZnQ6IHRoaXMudGFyZ2V0Lm9mZnNldCgpLmxlZnQsXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIGNvbnN0IGRhdGEgPSB5aWVsZCB0aGlzLmdldERhdGEoc2VhcmNoKTtcbiAgICAgICAgICAgIHRoaXMuY3VycmVudE9mZnNldCA9IDA7XG4gICAgICAgICAgICBsZXQgb2Zmc2V0ID0gMDtcbiAgICAgICAgICAgIGZvciAoY29uc3QgZGF0YVJvdyBvZiBkYXRhKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgZGF0YVJvd0ZpbHRlcmVkID0gdGhpcy5maWx0ZXJEYXRhV2l0aExvb2t1cChkYXRhUm93KTtcbiAgICAgICAgICAgICAgICBjb25zdCByb3dFbGVtZW50ID0gdGhpcy5yZW5kZXJSb3coZGF0YVJvd0ZpbHRlcmVkLCBvZmZzZXQrKyk7XG4gICAgICAgICAgICAgICAgcm93RWxlbWVudC5vbihcImNsaWNrIGtleWRvd25cIiwgKGUpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGUudHlwZSA9PT0gXCJjbGlja1wiIHx8IGUua2V5ID09PSBcIkVudGVyXCIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGUuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmZ1bmNPbkNob29zZShkYXRhUm93KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMucmVtb3ZlKCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB0aGlzLmVsZW1lbnQuYXBwZW5kKHJvd0VsZW1lbnQpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9XG4gICAgc2hvdygpIHtcbiAgICAgICAgJChcImJvZHlcIikuYXBwZW5kKHRoaXMuZWxlbWVudCk7XG4gICAgfVxuICAgIHJlbW92ZSgpIHtcbiAgICAgICAgJChcIi5teS1hdXRvY29tcGxldGVcIikucmVtb3ZlKCk7XG4gICAgfVxuICAgIGdldERhdGEoc2VhcmNoKSB7XG4gICAgICAgIHJldHVybiBfX2F3YWl0ZXIodGhpcywgdm9pZCAwLCB2b2lkIDAsIGZ1bmN0aW9uKiAoKSB7XG4gICAgICAgICAgICBjb25zdCBkYXRhID0geWllbGQgdGhpcy5tb2RlbC5nZXQoc2VhcmNoLCAwLCAyMCk7IC8vIDIwIGlzIGZvciB0ZXN0IGZpcnN0LCB3aWxsIGRldmVsb3AgaW4gZnV0dXJlXG4gICAgICAgICAgICByZXR1cm4gZGF0YTtcbiAgICAgICAgfSk7XG4gICAgfVxuICAgIHJlbmRlclJvdyhkYXRhUm93LCBvZmZzZXQpIHtcbiAgICAgICAgY29uc3Qgcm93ID0gJChcIjxsaS8+XCIpLmRhdGEoXCJvZmZzZXRcIiwgb2Zmc2V0KTtcbiAgICAgICAgZm9yIChjb25zdCBmaWVsZCBvZiBPYmplY3Qua2V5cyhkYXRhUm93KSkge1xuICAgICAgICAgICAgY29uc3QgdmFsID0gZGF0YVJvd1tmaWVsZF07XG4gICAgICAgICAgICByb3cuYXBwZW5kKCQoXCI8ZGl2Lz5cIikudGV4dCh2YWwpKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcm93O1xuICAgIH1cbiAgICBmaWx0ZXJEYXRhV2l0aExvb2t1cChkYXRhUm93KSB7XG4gICAgICAgIGNvbnN0IGZpbHRlcmVkRGF0YSA9IHt9O1xuICAgICAgICBmb3IgKGNvbnN0IGtleSBvZiB0aGlzLmxvb2t1cCkge1xuICAgICAgICAgICAgaWYgKGRhdGFSb3cuaGFzT3duUHJvcGVydHkoa2V5KSkge1xuICAgICAgICAgICAgICAgIGZpbHRlcmVkRGF0YVtrZXldID0gZGF0YVJvd1trZXldO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBmaWx0ZXJlZERhdGE7XG4gICAgfVxufVxuZXhwb3J0cy5BdXRvQ29tcGxldGUgPSBBdXRvQ29tcGxldGU7XG4vLyMgc291cmNlTWFwcGluZ1VSTD1pbmRleC5qcy5tYXAiLCJcInVzZSBzdHJpY3RcIjtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmNsYXNzIEtleUV2ZW50IHtcbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgdGhpcy5ldmVudEF0dGFjaCA9IHt9O1xuICAgICAgICB0aGlzLmlzQmxvY2tpbmcgPSBmYWxzZTtcbiAgICAgICAgJChkb2N1bWVudCkub24oXCJrZXlkb3duXCIsIChlKSA9PiB7XG4gICAgICAgICAgICBpZiAodGhpcy5pc0Jsb2NraW5nKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgbGV0IGNvbWJLZXkgPSBcIlwiO1xuICAgICAgICAgICAgaWYgKGUuY3RybEtleSkge1xuICAgICAgICAgICAgICAgIGNvbWJLZXkgPSBcImN0cmwrXCI7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjb21iS2V5ICs9IGUua2V5O1xuICAgICAgICAgICAgY29uc29sZS5sb2coY29tYktleSk7XG4gICAgICAgICAgICBpZiAodGhpcy5ldmVudEF0dGFjaC5oYXNPd25Qcm9wZXJ0eShjb21iS2V5KSkge1xuICAgICAgICAgICAgICAgIGNvbnN0IGxpc3RGdW5jID0gdGhpcy5ldmVudEF0dGFjaFtjb21iS2V5XTtcbiAgICAgICAgICAgICAgICBmb3IgKGNvbnN0IGZ1bmMgb2YgbGlzdEZ1bmMpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHR5cGVvZiBmdW5jID09PSBcImZ1bmN0aW9uXCIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGZ1bmMoZSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH1cbiAgICBvbihjb21iS2V5LCBmdW5jKSB7XG4gICAgICAgIGlmICghdGhpcy5ldmVudEF0dGFjaFtjb21iS2V5XSkge1xuICAgICAgICAgICAgdGhpcy5ldmVudEF0dGFjaFtjb21iS2V5XSA9IFtdO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuZXZlbnRBdHRhY2hbY29tYktleV0ucHVzaChmdW5jKTtcbiAgICB9XG4gICAgYmxvY2soKSB7XG4gICAgICAgIHRoaXMuaXNCbG9ja2luZyA9IHRydWU7XG4gICAgfVxuICAgIHVuYmxvY2soKSB7XG4gICAgICAgIHRoaXMuaXNCbG9ja2luZyA9IGZhbHNlO1xuICAgIH1cbn1cbmV4cG9ydHMuS2V5RXZlbnQgPSBLZXlFdmVudDtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWluZGV4LmpzLm1hcCIsIlwidXNlIHN0cmljdFwiO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuY2xhc3MgTWVudUNvbnRleHQge1xuICAgIGNvbnN0cnVjdG9yKHRhcmdldCkge1xuICAgICAgICBpZiAodHlwZW9mIHRhcmdldCA9PT0gXCJzdHJpbmdcIikge1xuICAgICAgICAgICAgdGhpcy50YXJnZXQgPSAkKFwiI1wiICsgdGFyZ2V0KTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMudGFyZ2V0ID0gdGFyZ2V0O1xuICAgICAgICB9XG4gICAgICAgIHRoaXMudGFyZ2V0Lm9uKFwiY29udGV4dG1lbnVcIiwgKGUpID0+IHtcbiAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgIGUuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgICAgICAgICB0aGlzLnJlbW92ZSgpLnJlbmRlcih7IHg6IGUuY2xpZW50WCwgeTogZS5jbGllbnRZIH0pLnNob3coKTtcbiAgICAgICAgfSk7XG4gICAgICAgIHRoaXMubWVudSA9IFtdO1xuICAgIH1cbiAgICBhZGRDb250ZXh0KHByb3ApIHtcbiAgICAgICAgdGhpcy5tZW51LnB1c2gocHJvcCk7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cbiAgICByZW5kZXIocG9zKSB7XG4gICAgICAgIHRoaXMuZWxlbWVudCA9ICQoXCI8dWwvPlwiKS5hZGRDbGFzcyhcInNoYWRvdy1sZyByb3VuZGVkIG15LWNvbnRleHRtZW51XCIpO1xuICAgICAgICB0aGlzLmVsZW1lbnQuY3NzKFwidG9wXCIsIHBvcy55ICsgXCJweFwiKTtcbiAgICAgICAgdGhpcy5lbGVtZW50LmNzcyhcImxlZnRcIiwgcG9zLnggKyBcInB4XCIpO1xuICAgICAgICBmb3IgKGNvbnN0IGN0eCBvZiB0aGlzLm1lbnUpIHtcbiAgICAgICAgICAgIHRoaXMuZWxlbWVudC5hcHBlbmQodGhpcy5yZW5kZXJDb250ZXh0KGN0eCkpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuZWxlbWVudC5oaWRlKCk7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cbiAgICBzaG93KCkge1xuICAgICAgICAkKFwiYm9keVwiKS5hcHBlbmQodGhpcy5lbGVtZW50KTtcbiAgICAgICAgdGhpcy5lbGVtZW50LnNsaWRlRG93bigwLjUpO1xuICAgICAgICAkKGRvY3VtZW50KS5vZmYoXCJjbGlja1wiLCB0aGlzLnJlbW92ZSkub24oXCJjbGlja1wiLCB0aGlzLnJlbW92ZSk7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cbiAgICByZW1vdmUoKSB7XG4gICAgICAgICQoXCIubXktY29udGV4dG1lbnVcIikucmVtb3ZlKCk7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cbiAgICByZW5kZXJDb250ZXh0KHByb3ApIHtcbiAgICAgICAgY29uc3QgY29udGV4dCA9ICQoXCI8bGkvPlwiKTtcbiAgICAgICAgY29udGV4dC5odG1sKGA8aSBjbGFzcz0nJHtwcm9wLmljb259ICR7cHJvcC5jbGFzc05hbWV9Jz48L2k+ICR7cHJvcC50aXRsZX1gKTtcbiAgICAgICAgY29udGV4dC5vbihcImNsaWNrXCIsIChlKSA9PiB7XG4gICAgICAgICAgICB0aGlzLnJlbW92ZSgpO1xuICAgICAgICAgICAgcHJvcC5jbGljayhlKTtcbiAgICAgICAgfSk7XG4gICAgICAgIHJldHVybiBjb250ZXh0O1xuICAgIH1cbn1cbmV4cG9ydHMuTWVudUNvbnRleHQgPSBNZW51Q29udGV4dDtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWluZGV4LmpzLm1hcCIsIlwidXNlIHN0cmljdFwiO1xudmFyIF9fYXdhaXRlciA9ICh0aGlzICYmIHRoaXMuX19hd2FpdGVyKSB8fCBmdW5jdGlvbiAodGhpc0FyZywgX2FyZ3VtZW50cywgUCwgZ2VuZXJhdG9yKSB7XG4gICAgcmV0dXJuIG5ldyAoUCB8fCAoUCA9IFByb21pc2UpKShmdW5jdGlvbiAocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgICAgIGZ1bmN0aW9uIGZ1bGZpbGxlZCh2YWx1ZSkgeyB0cnkgeyBzdGVwKGdlbmVyYXRvci5uZXh0KHZhbHVlKSk7IH0gY2F0Y2ggKGUpIHsgcmVqZWN0KGUpOyB9IH1cbiAgICAgICAgZnVuY3Rpb24gcmVqZWN0ZWQodmFsdWUpIHsgdHJ5IHsgc3RlcChnZW5lcmF0b3JbXCJ0aHJvd1wiXSh2YWx1ZSkpOyB9IGNhdGNoIChlKSB7IHJlamVjdChlKTsgfSB9XG4gICAgICAgIGZ1bmN0aW9uIHN0ZXAocmVzdWx0KSB7IHJlc3VsdC5kb25lID8gcmVzb2x2ZShyZXN1bHQudmFsdWUpIDogbmV3IFAoZnVuY3Rpb24gKHJlc29sdmUpIHsgcmVzb2x2ZShyZXN1bHQudmFsdWUpOyB9KS50aGVuKGZ1bGZpbGxlZCwgcmVqZWN0ZWQpOyB9XG4gICAgICAgIHN0ZXAoKGdlbmVyYXRvciA9IGdlbmVyYXRvci5hcHBseSh0aGlzQXJnLCBfYXJndW1lbnRzIHx8IFtdKSkubmV4dCgpKTtcbiAgICB9KTtcbn07XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5jb25zdCBNb2RlbENsYXNzXzEgPSByZXF1aXJlKFwiLi4vTW9kZWxDbGFzc1wiKTtcbmNsYXNzIERvblZpIGV4dGVuZHMgTW9kZWxDbGFzc18xLk1vZGVsIHtcbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgc3VwZXIoKTtcbiAgICAgICAgdGhpcy5kYXRhYmFzZSA9IFwiL2FwaS9kb25fdmkvXCI7XG4gICAgfVxuICAgIGdldChjYWxsYmFjaykge1xuICAgICAgICByZXR1cm4gX19hd2FpdGVyKHRoaXMsIHZvaWQgMCwgdm9pZCAwLCBmdW5jdGlvbiogKCkge1xuICAgICAgICAgICAgY29uc3QgZGF0YSA9IHlpZWxkIHRoaXMuX2dldCh7fSk7XG4gICAgICAgICAgICB0aGlzLmRhdGEgPSBkYXRhO1xuICAgICAgICAgICAgaWYgKHR5cGVvZiBjYWxsYmFjayA9PT0gXCJmdW5jdGlvblwiKSB7XG4gICAgICAgICAgICAgICAgY2FsbGJhY2soZGF0YSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5kYXRhO1xuICAgICAgICB9KTtcbiAgICB9XG59XG5leHBvcnRzLkRvblZpID0gRG9uVmk7XG4vLyMgc291cmNlTWFwcGluZ1VSTD1pbmRleC5qcy5tYXAiLCJcInVzZSBzdHJpY3RcIjtcbnZhciBfX2F3YWl0ZXIgPSAodGhpcyAmJiB0aGlzLl9fYXdhaXRlcikgfHwgZnVuY3Rpb24gKHRoaXNBcmcsIF9hcmd1bWVudHMsIFAsIGdlbmVyYXRvcikge1xuICAgIHJldHVybiBuZXcgKFAgfHwgKFAgPSBQcm9taXNlKSkoZnVuY3Rpb24gKHJlc29sdmUsIHJlamVjdCkge1xuICAgICAgICBmdW5jdGlvbiBmdWxmaWxsZWQodmFsdWUpIHsgdHJ5IHsgc3RlcChnZW5lcmF0b3IubmV4dCh2YWx1ZSkpOyB9IGNhdGNoIChlKSB7IHJlamVjdChlKTsgfSB9XG4gICAgICAgIGZ1bmN0aW9uIHJlamVjdGVkKHZhbHVlKSB7IHRyeSB7IHN0ZXAoZ2VuZXJhdG9yW1widGhyb3dcIl0odmFsdWUpKTsgfSBjYXRjaCAoZSkgeyByZWplY3QoZSk7IH0gfVxuICAgICAgICBmdW5jdGlvbiBzdGVwKHJlc3VsdCkgeyByZXN1bHQuZG9uZSA/IHJlc29sdmUocmVzdWx0LnZhbHVlKSA6IG5ldyBQKGZ1bmN0aW9uIChyZXNvbHZlKSB7IHJlc29sdmUocmVzdWx0LnZhbHVlKTsgfSkudGhlbihmdWxmaWxsZWQsIHJlamVjdGVkKTsgfVxuICAgICAgICBzdGVwKChnZW5lcmF0b3IgPSBnZW5lcmF0b3IuYXBwbHkodGhpc0FyZywgX2FyZ3VtZW50cyB8fCBbXSkpLm5leHQoKSk7XG4gICAgfSk7XG59O1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuY2xhc3MgTW9kZWwge1xuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICB0aGlzLmRhdGFiYXNlID0gXCJcIjtcbiAgICAgICAgdGhpcy5kYXRhID0gW107XG4gICAgfVxuICAgIGdldCBmZXRjaERhdGEoKSB7XG4gICAgICAgIHJldHVybiBPYmplY3QuYXNzaWduKHt9LCB0aGlzLmRhdGEpO1xuICAgIH1cbiAgICBnZXQgcmVzcG9uc2UoKSB7XG4gICAgICAgIHJldHVybiBPYmplY3QuYXNzaWduKHt9LCB0aGlzLnJlcyk7XG4gICAgfVxuICAgIC8vID09PT09PT09PT09PT09PSBJTkhFUklUIEZVTkNcbiAgICBnZXQocGFyYW1zLCBvZmZzZXQsIGxpbWl0KSB7XG4gICAgICAgIHJldHVybiBfX2F3YWl0ZXIodGhpcywgdm9pZCAwLCB2b2lkIDAsIGZ1bmN0aW9uKiAoKSB7XG4gICAgICAgICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgICAgICB9KTtcbiAgICB9XG4gICAgY3JlYXRlKGRhdGEpIHtcbiAgICAgICAgcmV0dXJuIF9fYXdhaXRlcih0aGlzLCB2b2lkIDAsIHZvaWQgMCwgZnVuY3Rpb24qICgpIHtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfSk7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIHVwZGF0ZSByZWNvcmRcbiAgICAgKiBAcGFyYW0gZmllbGRNYXRjaCBtYXRjaCBmaWVsZCB0byB1cGRhdGUgcmVjb3JkXG4gICAgICogQHBhcmFtIGZpZWxkVXBkYXRlIHRoZSBkYXRhIG5lZWQgdXBkYXRlXG4gICAgICovXG4gICAgdXBkYXRlKGZpZWxkTWF0Y2gsIGZpZWxkVXBkYXRlKSB7XG4gICAgICAgIHJldHVybiBfX2F3YWl0ZXIodGhpcywgdm9pZCAwLCB2b2lkIDAsIGZ1bmN0aW9uKiAoKSB7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH0pO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiByZW1vdmUgYSByZWNvcmRcbiAgICAgKiBAcGFyYW0gZmllbGRNYXRjaCBmaWVsZCBtYXRjaCB0byByZW1vdmVcbiAgICAgKiBAcmV0dXJuIHRydWUgb2YgZmFsc2VcbiAgICAgKi9cbiAgICByZW1vdmUoZmllbGRNYXRjaCkge1xuICAgICAgICByZXR1cm4gX19hd2FpdGVyKHRoaXMsIHZvaWQgMCwgdm9pZCAwLCBmdW5jdGlvbiogKCkge1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9KTtcbiAgICB9XG4gICAgLy8gPT09PT09PT09PT09PT09IENPUkUgRlVOQ1xuICAgIC8qKlxuICAgICAqIGZldGNoIGRhdGEgZnJvbSBkYXRhYmFzZSBhbmQgZG8gdGhpbmdcbiAgICAgKiBAcGFyYW0gcGFyYW1zXG4gICAgICogQHBhcmFtIGNhbGxiYWNrIGNhbGxiYWNrIGZ1bmN0aW9uXG4gICAgICovXG4gICAgX2dldChwYXJhbXMsIGNhbGxiYWNrKSB7XG4gICAgICAgIHJldHVybiBfX2F3YWl0ZXIodGhpcywgdm9pZCAwLCB2b2lkIDAsIGZ1bmN0aW9uKiAoKSB7XG4gICAgICAgICAgICB0aGlzLmRhdGEgPSBbXTtcbiAgICAgICAgICAgIGNvbnN0IHJlcXVlc3RVUkwgPSB0aGlzLmRhdGFiYXNlICsgXCI/XCIgKyB0aGlzLl91cmxwYXJhbXMocGFyYW1zKTtcbiAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgY29uc3QgcmVzID0geWllbGQgZmV0Y2gocmVxdWVzdFVSTCwgeyBjcmVkZW50aWFsczogXCJpbmNsdWRlXCIgfSk7XG4gICAgICAgICAgICAgICAgY29uc3QganNvbiA9IHlpZWxkIHJlcy5qc29uKCk7XG4gICAgICAgICAgICAgICAgaWYgKGpzb24uZXJyKSB7XG4gICAgICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihqc29uLm1zZyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHRoaXMuZGF0YSA9IGpzb24uZGF0YTtcbiAgICAgICAgICAgICAgICBpZiAodHlwZW9mIGNhbGxiYWNrID09PSBcImZ1bmN0aW9uXCIpIHtcbiAgICAgICAgICAgICAgICAgICAgY2FsbGJhY2soZmFsc2UsIGpzb24uZGF0YSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHJldHVybiBqc29uLmRhdGE7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjYXRjaCAoZXJyKSB7XG4gICAgICAgICAgICAgICAgaWYgKHR5cGVvZiBjYWxsYmFjayA9PT0gXCJmdW5jdGlvblwiKSB7XG4gICAgICAgICAgICAgICAgICAgIGNhbGxiYWNrKGVycik7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICB0aHJvdyBlcnI7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogcG9zdCByZXF1ZXN0XG4gICAgICogQHBhcmFtIHthbnl9IGRhdGFcbiAgICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBbY2FsbGJhY2tdXG4gICAgICovXG4gICAgX3Bvc3QoZGF0YSwgY2FsbGJhY2spIHtcbiAgICAgICAgcmV0dXJuIF9fYXdhaXRlcih0aGlzLCB2b2lkIDAsIHZvaWQgMCwgZnVuY3Rpb24qICgpIHtcbiAgICAgICAgICAgIHRoaXMucmVzID0gXCJcIjtcbiAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgY29uc3QgcmVzID0geWllbGQgZmV0Y2godGhpcy5kYXRhYmFzZSwge1xuICAgICAgICAgICAgICAgICAgICBib2R5OiBKU09OLnN0cmluZ2lmeShkYXRhKSxcbiAgICAgICAgICAgICAgICAgICAgY3JlZGVudGlhbHM6IFwiaW5jbHVkZVwiLFxuICAgICAgICAgICAgICAgICAgICBoZWFkZXJzOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBcIkNvbnRlbnQtVHlwZVwiOiBcImFwcGxpY2F0aW9uL2pzb25cIixcbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgbWV0aG9kOiBcIlBPU1RcIixcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICBjb25zdCBqc29uID0geWllbGQgcmVzLmpzb24oKTtcbiAgICAgICAgICAgICAgICBpZiAoanNvbi5lcnIpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGpzb24ubXNnKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgdGhpcy5yZXMgPSBqc29uLmRhdGE7XG4gICAgICAgICAgICAgICAgaWYgKHR5cGVvZiBjYWxsYmFjayA9PT0gXCJmdW5jdGlvblwiKSB7XG4gICAgICAgICAgICAgICAgICAgIGNhbGxiYWNrKGZhbHNlLCBqc29uLmRhdGEpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICByZXR1cm4ganNvbi5kYXRhO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY2F0Y2ggKGVycikge1xuICAgICAgICAgICAgICAgIGlmICh0eXBlb2YgY2FsbGJhY2sgPT09IFwiZnVuY3Rpb25cIikge1xuICAgICAgICAgICAgICAgICAgICBjYWxsYmFjayhlcnIpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgdGhyb3cgZXJyO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfVxuICAgIF9wdXQoZGF0YSkge1xuICAgICAgICByZXR1cm4gX19hd2FpdGVyKHRoaXMsIHZvaWQgMCwgdm9pZCAwLCBmdW5jdGlvbiogKCkge1xuICAgICAgICAgICAgdGhpcy5yZXMgPSBcIlwiO1xuICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICBjb25zdCByZXMgPSB5aWVsZCBmZXRjaCh0aGlzLmRhdGFiYXNlLCB7XG4gICAgICAgICAgICAgICAgICAgIGJvZHk6IEpTT04uc3RyaW5naWZ5KGRhdGEpLFxuICAgICAgICAgICAgICAgICAgICBjcmVkZW50aWFsczogXCJpbmNsdWRlXCIsXG4gICAgICAgICAgICAgICAgICAgIGhlYWRlcnM6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiQ29udGVudC1UeXBlXCI6IFwiYXBwbGljYXRpb24vanNvblwiLFxuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICBtZXRob2Q6IFwiUFVUXCIsXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgY29uc3QganNvbiA9IHlpZWxkIHJlcy5qc29uKCk7XG4gICAgICAgICAgICAgICAgaWYgKGpzb24uZXJyKSB7XG4gICAgICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihqc29uLm1zZyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHRoaXMucmVzID0ganNvbi5kYXRhO1xuICAgICAgICAgICAgICAgIHJldHVybiBqc29uLmRhdGE7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjYXRjaCAoZXJyKSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgZXJyO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9XG4gICAgX3VybHBhcmFtcyhwYXJhbXMpIHtcbiAgICAgICAgY29uc3QgdXJsID0gT2JqZWN0LmtleXMocGFyYW1zKS5tYXAoKGspID0+IHtcbiAgICAgICAgICAgIHJldHVybiBlbmNvZGVVUklDb21wb25lbnQoaykgKyBcIj1cIiArIGVuY29kZVVSSUNvbXBvbmVudChwYXJhbXNba10pO1xuICAgICAgICB9KS5qb2luKFwiJlwiKTtcbiAgICAgICAgcmV0dXJuIHVybDtcbiAgICB9XG59XG5leHBvcnRzLk1vZGVsID0gTW9kZWw7XG4vLyMgc291cmNlTWFwcGluZ1VSTD1pbmRleC5qcy5tYXAiLCJcInVzZSBzdHJpY3RcIjtcbnZhciBfX2F3YWl0ZXIgPSAodGhpcyAmJiB0aGlzLl9fYXdhaXRlcikgfHwgZnVuY3Rpb24gKHRoaXNBcmcsIF9hcmd1bWVudHMsIFAsIGdlbmVyYXRvcikge1xuICAgIHJldHVybiBuZXcgKFAgfHwgKFAgPSBQcm9taXNlKSkoZnVuY3Rpb24gKHJlc29sdmUsIHJlamVjdCkge1xuICAgICAgICBmdW5jdGlvbiBmdWxmaWxsZWQodmFsdWUpIHsgdHJ5IHsgc3RlcChnZW5lcmF0b3IubmV4dCh2YWx1ZSkpOyB9IGNhdGNoIChlKSB7IHJlamVjdChlKTsgfSB9XG4gICAgICAgIGZ1bmN0aW9uIHJlamVjdGVkKHZhbHVlKSB7IHRyeSB7IHN0ZXAoZ2VuZXJhdG9yW1widGhyb3dcIl0odmFsdWUpKTsgfSBjYXRjaCAoZSkgeyByZWplY3QoZSk7IH0gfVxuICAgICAgICBmdW5jdGlvbiBzdGVwKHJlc3VsdCkgeyByZXN1bHQuZG9uZSA/IHJlc29sdmUocmVzdWx0LnZhbHVlKSA6IG5ldyBQKGZ1bmN0aW9uIChyZXNvbHZlKSB7IHJlc29sdmUocmVzdWx0LnZhbHVlKTsgfSkudGhlbihmdWxmaWxsZWQsIHJlamVjdGVkKTsgfVxuICAgICAgICBzdGVwKChnZW5lcmF0b3IgPSBnZW5lcmF0b3IuYXBwbHkodGhpc0FyZywgX2FyZ3VtZW50cyB8fCBbXSkpLm5leHQoKSk7XG4gICAgfSk7XG59O1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuY29uc3QgTW9kZWxDbGFzc18xID0gcmVxdWlyZShcIi4uL01vZGVsQ2xhc3NcIik7XG5jbGFzcyBUaHVvYyBleHRlbmRzIE1vZGVsQ2xhc3NfMS5Nb2RlbCB7XG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHN1cGVyKCk7XG4gICAgICAgIHRoaXMuZGF0YWJhc2UgPSBcIi9hcGkvdGh1b2MvXCI7XG4gICAgfVxuICAgIGdldChwYXJhbXMsIG9mZnNldCwgbGltaXQpIHtcbiAgICAgICAgcmV0dXJuIF9fYXdhaXRlcih0aGlzLCB2b2lkIDAsIHZvaWQgMCwgZnVuY3Rpb24qICgpIHtcbiAgICAgICAgICAgIHJldHVybiB5aWVsZCB0aGlzLl9nZXQoeyBxOiBwYXJhbXMsIG9mZnNldCwgbGltaXQgfSk7XG4gICAgICAgIH0pO1xuICAgIH1cbiAgICBjcmVhdGUoZGF0YSkge1xuICAgICAgICByZXR1cm4gX19hd2FpdGVyKHRoaXMsIHZvaWQgMCwgdm9pZCAwLCBmdW5jdGlvbiogKCkge1xuICAgICAgICAgICAgdGhpcy5yZXMgPSB5aWVsZCB0aGlzLl9wb3N0KGRhdGEpO1xuICAgICAgICAgICAgcmV0dXJuICh0aGlzLnJlcyk7XG4gICAgICAgIH0pO1xuICAgIH1cbiAgICBhZGQobWEsIHNvTHVvbmcsIHRvbmdHaWEpIHtcbiAgICAgICAgcmV0dXJuIF9fYXdhaXRlcih0aGlzLCB2b2lkIDAsIHZvaWQgMCwgZnVuY3Rpb24qICgpIHtcbiAgICAgICAgICAgIHRoaXMucmVzID0geWllbGQgdGhpcy5fcG9zdCh7XG4gICAgICAgICAgICAgICAgbWEsXG4gICAgICAgICAgICAgICAgc29fbHVvbmc6IHNvTHVvbmcsXG4gICAgICAgICAgICAgICAgdG9uZ19naWE6IHRvbmdHaWEsXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnJlcztcbiAgICAgICAgfSk7XG4gICAgfVxuICAgIHVwZGF0ZShtYSwgZWRpdEluZm8pIHtcbiAgICAgICAgcmV0dXJuIF9fYXdhaXRlcih0aGlzLCB2b2lkIDAsIHZvaWQgMCwgZnVuY3Rpb24qICgpIHtcbiAgICAgICAgICAgIHRoaXMucmVzID0geWllbGQgdGhpcy5fcHV0KHtcbiAgICAgICAgICAgICAgICBtYSwgZWRpdEluZm8sXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnJlcztcbiAgICAgICAgfSk7XG4gICAgfVxufVxuZXhwb3J0cy5UaHVvYyA9IFRodW9jO1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9aW5kZXguanMubWFwIiwiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5jb25zdCBUaHVvY18xID0gcmVxdWlyZShcIi4uL01vZGVsL1RodW9jXCIpO1xuY29uc3QgVmlld1RhYmxlXzEgPSByZXF1aXJlKFwiLi9WaWV3VGFibGVcIik7XG5jb25zdCBNZW51Q29udGV4dF8xID0gcmVxdWlyZShcIi4uL01lbnVDb250ZXh0XCIpO1xuY2xhc3MgVGh1b2NUYWJsZSBleHRlbmRzIFZpZXdUYWJsZV8xLlZpZXdUYWJsZSB7XG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHN1cGVyKCk7XG4gICAgICAgIHRoaXMuZWxlbWVudCA9ICQoXCI8dGFibGUvPlwiKS5hZGRDbGFzcyhcInRhYmxlIHRhYmxlLXN0cmlwZWQgdGFibGUtdmlld1wiKTtcbiAgICAgICAgdGhpcy5lbGVtZW50Lmh0bWwoYFxuICAgICAgICA8dGhlYWQ+XG4gICAgICAgICAgICA8dHI+XG4gICAgICAgICAgICAgICAgPHRoPk1hIFRodW9jPC90aD5cbiAgICAgICAgICAgICAgICA8dGg+VGVuIFRodW9jPC90aD5cbiAgICAgICAgICAgIDwvdHI+XG4gICAgICAgIDwvdGhlYWQ+XG4gICAgICAgIDx0Ym9keT48L3Rib2R5PlxuICAgICAgICBgKTtcbiAgICAgICAgdGhpcy5tb2RlbCA9IG5ldyBUaHVvY18xLlRodW9jKCk7XG4gICAgfVxuICAgIG9uQ29udGV4dEFkZChmdW5jKSB7XG4gICAgICAgIHRoaXMuZnVuY0N0eEFkZCA9IGZ1bmM7XG4gICAgfVxuICAgIG9uQ29udGV4dEVkaXQoZnVuYykge1xuICAgICAgICB0aGlzLmZ1bmNDdHhFZGl0ID0gZnVuYztcbiAgICB9XG4gICAgb25Db250ZXh0RWRpdFByaWNlKGZ1bmMpIHtcbiAgICAgICAgdGhpcy5mdW5jQ3R4RWRpdFByaWNlID0gZnVuYztcbiAgICB9XG4gICAgY3VzdG9tQ3JlYXRlUm93KHJvdykge1xuICAgICAgICBjb25zdCBjb250ZXh0bWVudSA9IG5ldyBNZW51Q29udGV4dF8xLk1lbnVDb250ZXh0KHJvdyk7XG4gICAgICAgIGNvbnRleHRtZW51LmFkZENvbnRleHQoe1xuICAgICAgICAgICAgdGl0bGU6IFwibmjhuq1wIHRow6ptIHRodeG7kWNcIixcbiAgICAgICAgICAgIGNsYXNzTmFtZTogXCJ0ZXh0LXN1Y2Nlc3NcIixcbiAgICAgICAgICAgIGljb246IFwiZmFzIGZhLXBsdXMtY2lyY2xlXCIsXG4gICAgICAgICAgICBjbGljazogKGUpID0+IHtcbiAgICAgICAgICAgICAgICB0aGlzLmZ1bmNDdHhBZGQoKTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgIH0pLmFkZENvbnRleHQoe1xuICAgICAgICAgICAgdGl0bGU6IFwic+G7rWEgdGjDtG5nIHRpblwiLFxuICAgICAgICAgICAgY2xhc3NOYW1lOiBcInRleHQtcHJpbWFyeVwiLFxuICAgICAgICAgICAgaWNvbjogXCJmYXMgZmEtcGVuLXNxdWFyZVwiLFxuICAgICAgICAgICAgY2xpY2s6IChlKSA9PiB7XG4gICAgICAgICAgICAgICAgdGhpcy5mdW5jQ3R4RWRpdCgpO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgfSkuYWRkQ29udGV4dCh7XG4gICAgICAgICAgICB0aXRsZTogXCJjaOG7iW5oIGdpw6FcIixcbiAgICAgICAgICAgIGljb246IFwiZmEgZmEtZG9sbGFyLXNpZ25cIixcbiAgICAgICAgICAgIGNsaWNrOiAoZSkgPT4ge1xuICAgICAgICAgICAgICAgIHRoaXMuZnVuY0N0eEVkaXRQcmljZSgpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9XG59XG5leHBvcnRzLlRodW9jVGFibGUgPSBUaHVvY1RhYmxlO1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9VGh1b2NUYWJsZS5qcy5tYXAiLCJcInVzZSBzdHJpY3RcIjtcbnZhciBfX2F3YWl0ZXIgPSAodGhpcyAmJiB0aGlzLl9fYXdhaXRlcikgfHwgZnVuY3Rpb24gKHRoaXNBcmcsIF9hcmd1bWVudHMsIFAsIGdlbmVyYXRvcikge1xuICAgIHJldHVybiBuZXcgKFAgfHwgKFAgPSBQcm9taXNlKSkoZnVuY3Rpb24gKHJlc29sdmUsIHJlamVjdCkge1xuICAgICAgICBmdW5jdGlvbiBmdWxmaWxsZWQodmFsdWUpIHsgdHJ5IHsgc3RlcChnZW5lcmF0b3IubmV4dCh2YWx1ZSkpOyB9IGNhdGNoIChlKSB7IHJlamVjdChlKTsgfSB9XG4gICAgICAgIGZ1bmN0aW9uIHJlamVjdGVkKHZhbHVlKSB7IHRyeSB7IHN0ZXAoZ2VuZXJhdG9yW1widGhyb3dcIl0odmFsdWUpKTsgfSBjYXRjaCAoZSkgeyByZWplY3QoZSk7IH0gfVxuICAgICAgICBmdW5jdGlvbiBzdGVwKHJlc3VsdCkgeyByZXN1bHQuZG9uZSA/IHJlc29sdmUocmVzdWx0LnZhbHVlKSA6IG5ldyBQKGZ1bmN0aW9uIChyZXNvbHZlKSB7IHJlc29sdmUocmVzdWx0LnZhbHVlKTsgfSkudGhlbihmdWxmaWxsZWQsIHJlamVjdGVkKTsgfVxuICAgICAgICBzdGVwKChnZW5lcmF0b3IgPSBnZW5lcmF0b3IuYXBwbHkodGhpc0FyZywgX2FyZ3VtZW50cyB8fCBbXSkpLm5leHQoKSk7XG4gICAgfSk7XG59O1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuY2xhc3MgVmlld1RhYmxlIHtcbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgLy8gY29uc3RydWN0XG4gICAgICAgIHRoaXMub2Zmc2V0ID0gMDtcbiAgICAgICAgdGhpcy5saW1pdCA9IDEwO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBnZXQgZGF0YSB3aXRoIHNlYXJjaCB2YWx1ZVxuICAgICAqIEBwYXJhbSBzZWFyY2ggZmllbGQ9dmFsdWVcbiAgICAgKi9cbiAgICB1cGRhdGUoc2VhcmNoKSB7XG4gICAgICAgIHJldHVybiBfX2F3YWl0ZXIodGhpcywgdm9pZCAwLCB2b2lkIDAsIGZ1bmN0aW9uKiAoKSB7XG4gICAgICAgICAgICAvLyByZW5kZXIgZGF0YSB0byBlbGVtZW50XG4gICAgICAgICAgICBjb25zdCByYXdEYXRhID0geWllbGQgdGhpcy5tb2RlbC5nZXQoc2VhcmNoLCB0aGlzLm9mZnNldCwgdGhpcy5saW1pdCk7XG4gICAgICAgICAgICB0aGlzLmRhdGEgPSBBcnJheS5mcm9tKHJhd0RhdGEpLm1hcCgodmFsKSA9PiB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuZmlsdGVyRGF0YVJvdyh2YWwpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB0aGlzLnNpemVPZlJlY29yZCA9IHRoaXMuZGF0YS5sZW5ndGg7XG4gICAgICAgICAgICB0aGlzLmN1cnJlbnRQb3MgPSAtMTtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmRhdGE7XG4gICAgICAgIH0pO1xuICAgIH1cbiAgICByZW5kZXIoc2VhcmNoKSB7XG4gICAgICAgIHJldHVybiBfX2F3YWl0ZXIodGhpcywgdm9pZCAwLCB2b2lkIDAsIGZ1bmN0aW9uKiAoKSB7XG4gICAgICAgICAgICBjb25zdCBkYXRhID0geWllbGQgdGhpcy51cGRhdGUoc2VhcmNoKTtcbiAgICAgICAgICAgIGNvbnN0IHRib2R5ID0gdGhpcy5fY3JlYXRlVGFibGVCb2R5KGRhdGEpO1xuICAgICAgICAgICAgdGhpcy5lbGVtZW50LmZpbmQoXCJ0Ym9keVwiKS5odG1sKFwiXCIpLmFwcGVuZCh0Ym9keS5jaGlsZHJlbigpKTtcbiAgICAgICAgfSk7XG4gICAgfVxuICAgIHNldEVsZW1lbnQoZWwpIHtcbiAgICAgICAgdGhpcy5lbGVtZW50ID0gZWw7XG4gICAgfVxuICAgIGdldEVsZW1lbnQoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmVsZW1lbnQ7XG4gICAgfVxuICAgIGN1cnJlbnREYXRhKCkge1xuICAgICAgICBpZiAoIXRoaXMuY3VycmVudFJvd0RhdGEpIHtcbiAgICAgICAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIE9iamVjdC5hc3NpZ24oe30sIHRoaXMuY3VycmVudFJvd0RhdGEpO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBhdHRhY2ggZXZlbnQgb2YgY2hvb3NlXG4gICAgICogQHBhcmFtIGNhbGxiYWNrIGNhbGxiYWNrIGZ1bmN0aW9uIHdoZW4gdGhlIHJvdyBvZiByZWNvcmQgaXMgY2hvb3NlZFxuICAgICAqL1xuICAgIG9uQ2hvb3NlKGNhbGxiYWNrKSB7XG4gICAgICAgIHRoaXMuZnVuY09uQ2hvb3NlID0gY2FsbGJhY2s7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIGF0dGFjaCBldmVudCBvZiBob3ZlclxuICAgICAqIEBwYXJhbSBjYWxsYmFjayBjYWxsYmFjayBmdW5jdGlvbiB3aGVuIHRoZSByb3cgb2YgcmVjb3JkIGlzIGhvdmVyIG9uXG4gICAgICovXG4gICAgb25Gb2N1cyhjYWxsYmFjaykge1xuICAgICAgICB0aGlzLmZ1bmNPbkZvY3VzID0gY2FsbGJhY2s7XG4gICAgfVxuICAgIHNlbGVjdERvd24oKSB7XG4gICAgICAgIGlmICh0aGlzLmN1cnJlbnRQb3MgPCB0aGlzLnNpemVPZlJlY29yZCAtIDEpIHtcbiAgICAgICAgICAgICsrdGhpcy5jdXJyZW50UG9zO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuZWxlbWVudC5maW5kKGB0cltkYXRhLXBvcz0ke3RoaXMuY3VycmVudFBvc31dYCkuZm9jdXMoKTtcbiAgICB9XG4gICAgc2VsZWN0VXAoKSB7XG4gICAgICAgIGlmICh0aGlzLmN1cnJlbnRQb3MgPiAwKSB7XG4gICAgICAgICAgICAtLXRoaXMuY3VycmVudFBvcztcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmVsZW1lbnQuZmluZChgdHJbZGF0YS1wb3M9JHt0aGlzLmN1cnJlbnRQb3N9XWApLmZvY3VzKCk7XG4gICAgfVxuICAgIG5leHRQYWdlKHNlYXJjaCA9IFwiXCIpIHtcbiAgICAgICAgdGhpcy5vZmZzZXQgKz0gdGhpcy5saW1pdDtcbiAgICAgICAgdGhpcy5yZW5kZXIoc2VhcmNoKTtcbiAgICB9XG4gICAgc2V0TGltaXRQZXJQYWdlKGxpbWl0KSB7XG4gICAgICAgIHRoaXMubGltaXQgPSBsaW1pdDtcbiAgICB9XG4gICAgc2V0T2Zmc2V0KG9mZnNldCkge1xuICAgICAgICB0aGlzLm9mZnNldCA9IG9mZnNldDtcbiAgICB9XG4gICAgZmlsdGVyRGF0YVJvdyhkYXRhUm93KSB7XG4gICAgICAgIC8vIG5vdGhpbmcgaGVyZSwganVzdCByYXdcbiAgICAgICAgcmV0dXJuIGRhdGFSb3c7XG4gICAgfVxuICAgIF9jcmVhdGVSb3coZGF0YVJvdywgcG9zKSB7XG4gICAgICAgIGNvbnN0IHJvdyA9ICQoXCI8dHIvPlwiKS5hdHRyKFwidGFiaW5kZXhcIiwgLTEpLmF0dHIoXCJkYXRhLXBvc1wiLCBwb3MpO1xuICAgICAgICBmb3IgKGNvbnN0IGZpZWxkIG9mIE9iamVjdC5rZXlzKGRhdGFSb3cpKSB7XG4gICAgICAgICAgICBjb25zdCBjZWxsID0gJChcIjx0ZC8+XCIpLmF0dHIoXCJuYW1lXCIsIGZpZWxkKS50ZXh0KGRhdGFSb3dbZmllbGRdKTtcbiAgICAgICAgICAgIHJvdy5hcHBlbmQoY2VsbCk7XG4gICAgICAgIH1cbiAgICAgICAgLy8gY2hvb3NlIGV2ZW50XG4gICAgICAgIHRoaXMuX3Jvd09uQ2hvb3NlKHJvdywgKCkgPT4ge1xuICAgICAgICAgICAgdGhpcy5mdW5jT25DaG9vc2UoZGF0YVJvdyk7XG4gICAgICAgIH0pO1xuICAgICAgICAvLyBob3ZlciBldmVudFxuICAgICAgICByb3cub24oXCJjbGljayBmb2N1c1wiLCAoZSkgPT4ge1xuICAgICAgICAgICAgdGhpcy5lbGVtZW50LmZpbmQoXCJ0clwiKS5yZW1vdmVDbGFzcyhcImFjdGl2ZVwiKTtcbiAgICAgICAgICAgIHJvdy5hZGRDbGFzcyhcImFjdGl2ZVwiKTtcbiAgICAgICAgICAgIHRoaXMuY3VycmVudFBvcyA9IHBvcztcbiAgICAgICAgICAgIHRoaXMuY3VycmVudFJvd0RhdGEgPSBkYXRhUm93O1xuICAgICAgICAgICAgdGhpcy5mdW5jT25Gb2N1cyhkYXRhUm93KTtcbiAgICAgICAgfSk7XG4gICAgICAgIHRoaXMuY3VzdG9tQ3JlYXRlUm93KHJvdyk7XG4gICAgICAgIHJldHVybiByb3c7XG4gICAgfVxuICAgIF9jcmVhdGVUYWJsZUJvZHkoZGF0YSkge1xuICAgICAgICBjb25zdCB0Ym9keSA9ICQoXCI8dGJvZHkvPlwiKTtcbiAgICAgICAgbGV0IHBvcyA9IDA7XG4gICAgICAgIGZvciAoY29uc3Qgcm93RGF0YSBvZiBkYXRhKSB7XG4gICAgICAgICAgICBjb25zdCB0cm93ID0gdGhpcy5fY3JlYXRlUm93KHJvd0RhdGEsIHBvcysrKTtcbiAgICAgICAgICAgIHRib2R5LmFwcGVuZCh0cm93KTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGJvZHk7XG4gICAgfVxuICAgIGN1c3RvbUNyZWF0ZVJvdyhyb3cpIHtcbiAgICAgICAgLy8gbm90aGluZyBoZXJlLCB3aWxsIGNoYW5nZSBpbiBpbmhlcml0YW5jZVxuICAgIH1cbiAgICBfcm93T25DaG9vc2Uocm93LCBjYWxsYmFjaykge1xuICAgICAgICByb3cub24oXCJrZXlkb3duXCIsIChlKSA9PiB7XG4gICAgICAgICAgICBpZiAoZS5rZXlDb2RlID09PSAxMykge1xuICAgICAgICAgICAgICAgIGNhbGxiYWNrKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgICByb3cub24oXCJkYmxjbGlja1wiLCAoKSA9PiB7XG4gICAgICAgICAgICBjYWxsYmFjaygpO1xuICAgICAgICB9KTtcbiAgICB9XG59XG5leHBvcnRzLlZpZXdUYWJsZSA9IFZpZXdUYWJsZTtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPVZpZXdUYWJsZS5qcy5tYXAiLCJcInVzZSBzdHJpY3RcIjtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmZ1bmN0aW9uIGdldEZvcm1WYWx1ZShmb3JtKSB7XG4gICAgY29uc3QgYXJyID0gZm9ybS5zZXJpYWxpemVBcnJheSgpO1xuICAgIGNvbnN0IHZhbCA9IHt9O1xuICAgIGZvciAoY29uc3QgaW5wdXQgb2YgYXJyKSB7XG4gICAgICAgIHZhbFtpbnB1dC5uYW1lXSA9IGlucHV0LnZhbHVlO1xuICAgIH1cbiAgICByZXR1cm4gdmFsO1xufVxuZXhwb3J0cy5nZXRGb3JtVmFsdWUgPSBnZXRGb3JtVmFsdWU7XG4vLyMgc291cmNlTWFwcGluZ1VSTD1mb3JtVmFsLmpzLm1hcCIsIlwidXNlIHN0cmljdFwiO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuY29uc3QgQXV0b0NvbXBsZXRlXzEgPSByZXF1aXJlKFwiLi4vQXV0b0NvbXBsZXRlXCIpO1xuZnVuY3Rpb24gaW5pdChhcHApIHtcbiAgICBjb25zdCBhdXRvY29tcGxldGUgPSBuZXcgQXV0b0NvbXBsZXRlXzEuQXV0b0NvbXBsZXRlKFwibmhhcF9ob2FfZG9uLS10ZW5fdGh1b2NcIiwgYXBwLnRodW9jKTtcbiAgICBhdXRvY29tcGxldGUuc2V0TG9va3VwKFtcIm1hXCIsIFwidGVuXCIsIFwibmNjXCIsIFwiZG9uX3ZpXCIsIFwiZG9uX2dpYVwiXSk7XG4gICAgYXV0b2NvbXBsZXRlLmxpc3RlbigpO1xuICAgIGF1dG9jb21wbGV0ZS5vbkNob29zZSgoZGF0YSkgPT4ge1xuICAgICAgICAkKFwiI25oYXBfaG9hX2Rvbi0tbWFfdGh1b2NcIikudmFsKGRhdGEubWEpO1xuICAgICAgICAkKFwiI25oYXBfaG9hX2Rvbi0tdGVuX3RodW9jXCIpLnZhbChkYXRhLnRlbik7XG4gICAgICAgICQoXCIjbmhhcF9ob2FfZG9uLS1uY2NcIikudmFsKGRhdGEubmNjKTtcbiAgICAgICAgJChcIiNuaGFwX2hvYV9kb24tLWdpYVwiKS52YWwoZGF0YS5kb25fZ2lhKTtcbiAgICAgICAgJChcIiNuaGFwX2hvYV9kb24tLWRvbl92aVwiKS52YWwoZGF0YS5kb25fdmkpO1xuICAgIH0pO1xufVxuZXhwb3J0cy5pbml0ID0gaW5pdDtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWluZGV4LmpzLm1hcCIsIlwidXNlIHN0cmljdFwiO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuY29uc3QgVGh1b2NUYWJsZV8xID0gcmVxdWlyZShcIi4uL1ZpZXcvVGh1b2NUYWJsZVwiKTtcbmNvbnN0IHRodW9jX21vZGFsXzEgPSByZXF1aXJlKFwiLi90aHVvYy1tb2RhbFwiKTtcbmNvbnN0IFBBR0VfSUQgPSBcInBhZ2UtbmhhcC10aHVvY1wiO1xuY2xhc3MgSW5pdCB7XG4gICAgY29uc3RydWN0b3IoYXBwKSB7XG4gICAgICAgIGNvbnN0IHRodW9jVGFibGUgPSBuZXcgVGh1b2NUYWJsZV8xLlRodW9jVGFibGUoKTtcbiAgICAgICAgdGhpcy50aHVvY1RhYmxlID0gdGh1b2NUYWJsZTtcbiAgICAgICAgdGhpcy5hcHAgPSBhcHA7XG4gICAgICAgIHRodW9jVGFibGUuc2V0RWxlbWVudCgkKFwiI25oYXBfdGh1b2MtLXRhYmxlXCIpKTtcbiAgICAgICAgdGh1b2NUYWJsZS5zZXRMaW1pdFBlclBhZ2UoMTAwKTtcbiAgICAgICAgdGh1b2NUYWJsZS5vbkNob29zZSgoZGF0YSkgPT4ge1xuICAgICAgICAgICAgdGhpcy5hZGRUaHVvYyhkYXRhKTtcbiAgICAgICAgfSk7XG4gICAgICAgIHRodW9jVGFibGUub25Gb2N1cygoZGF0YSkgPT4ge1xuICAgICAgICAgICAgJChcIi50aHVvYy0tYnV0dG9uXCIpLnJlbW92ZUF0dHIoXCJkaXNhYmxlZFwiKTtcbiAgICAgICAgfSk7XG4gICAgICAgIHRodW9jVGFibGUub25Db250ZXh0QWRkKCgpID0+IHtcbiAgICAgICAgICAgIHRoaXMuYWRkVGh1b2ModGh1b2NUYWJsZS5jdXJyZW50RGF0YSgpKTtcbiAgICAgICAgfSk7XG4gICAgICAgIHRodW9jVGFibGUub25Db250ZXh0RWRpdCgoKSA9PiB7XG4gICAgICAgICAgICB0aGlzLmVkaXRUaHVvYyh0aHVvY1RhYmxlLmN1cnJlbnREYXRhKCkpO1xuICAgICAgICB9KTtcbiAgICAgICAgdGh1b2NUYWJsZS5vbkNvbnRleHRFZGl0UHJpY2UoKCkgPT4ge1xuICAgICAgICAgICAgdGhpcy5lZGl0UHJpY2VUaHVvYyh0aHVvY1RhYmxlLmN1cnJlbnREYXRhKCkpO1xuICAgICAgICB9KTtcbiAgICAgICAgdGh1b2NUYWJsZS5yZW5kZXIoXCJcIik7XG4gICAgICAgIHRoaXMuaGFuZGxlQ29udHJvbEtleShhcHApO1xuICAgICAgICB0aGlzLmhhbmRsZVNlbGVjdEtleShhcHApO1xuICAgICAgICB0aGlzLmhhbmRsZU1vZGFsRXZlbnQoKTtcbiAgICAgICAgdGhpcy5oYW5kbGVTZWFyY2hJbnB1dCgpO1xuICAgICAgICBjb25zdCAkdGhpcyA9IHRoaXM7XG4gICAgICAgICQoXCIudGh1b2MtLWJ1dHRvblwiKS5vbihcImNsaWNrXCIsIGZ1bmN0aW9uIEJ1dHRvbkNsaWNrKCkge1xuICAgICAgICAgICAgY29uc3Qgcm9sZSA9ICQodGhpcykuYXR0cihcImFwcC1yb2xlXCIpO1xuICAgICAgICAgICAgc3dpdGNoIChyb2xlKSB7XG4gICAgICAgICAgICAgICAgY2FzZSBcIm5ld1wiOlxuICAgICAgICAgICAgICAgICAgICAkdGhpcy5uZXdUaHVvYygpO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBjYXNlIFwiZWRpdFwiOlxuICAgICAgICAgICAgICAgICAgICAkdGhpcy5lZGl0VGh1b2ModGh1b2NUYWJsZS5jdXJyZW50RGF0YSgpKTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgY2FzZSBcImFkZFwiOlxuICAgICAgICAgICAgICAgICAgICAkdGhpcy5hZGRUaHVvYyh0aHVvY1RhYmxlLmN1cnJlbnREYXRhKCkpO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBjYXNlIFwiY2hpbmgtZ2lhXCI6XG4gICAgICAgICAgICAgICAgICAgICR0aGlzLmVkaXRQcmljZVRodW9jKHRodW9jVGFibGUuY3VycmVudERhdGEoKSk7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9XG4gICAgaGFuZGxlU2VsZWN0S2V5KGFwcCkge1xuICAgICAgICBhcHAub25TaG9ydGN1dEtleShcIkFycm93VXBcIiwgUEFHRV9JRCwgKGUpID0+IHtcbiAgICAgICAgICAgIHRoaXMudGh1b2NUYWJsZS5zZWxlY3RVcCgpO1xuICAgICAgICB9KTtcbiAgICAgICAgYXBwLm9uU2hvcnRjdXRLZXkoXCJBcnJvd0Rvd25cIiwgUEFHRV9JRCwgKGUpID0+IHtcbiAgICAgICAgICAgIHRoaXMudGh1b2NUYWJsZS5zZWxlY3REb3duKCk7XG4gICAgICAgIH0pO1xuICAgIH1cbiAgICBoYW5kbGVDb250cm9sS2V5KGFwcCkge1xuICAgICAgICBhcHAub25TaG9ydGN1dEtleShcImN0cmwrZFwiLCBQQUdFX0lELCAoZSkgPT4ge1xuICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgdGhpcy5uZXdUaHVvYygpO1xuICAgICAgICB9KTtcbiAgICAgICAgYXBwLm9uU2hvcnRjdXRLZXkoXCJjdHJsK2VcIiwgUEFHRV9JRCwgKGUpID0+IHtcbiAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgIHRoaXMuZWRpdFRodW9jKHRoaXMudGh1b2NUYWJsZS5jdXJyZW50RGF0YSgpKTtcbiAgICAgICAgfSk7XG4gICAgICAgIGFwcC5vblNob3J0Y3V0S2V5KFwiY3RybCtnXCIsIFBBR0VfSUQsIChlKSA9PiB7XG4gICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICB0aGlzLmVkaXRQcmljZVRodW9jKHRoaXMudGh1b2NUYWJsZS5jdXJyZW50RGF0YSgpKTtcbiAgICAgICAgfSk7XG4gICAgICAgIGFwcC5vblNob3J0Y3V0S2V5KFwiY3RybCtmXCIsIFBBR0VfSUQsIChlKSA9PiB7XG4gICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICAkKFwiI3RodW9jLS1zZWFyY2hcIikuZm9jdXMoKTtcbiAgICAgICAgfSk7XG4gICAgfVxuICAgIGhhbmRsZVNlYXJjaElucHV0KCkge1xuICAgICAgICBjb25zdCAkdGhpcyA9IHRoaXM7XG4gICAgICAgICQoXCIjdGh1b2MtLXNlYXJjaFwiKS5vbihcImtleXVwXCIsIGZ1bmN0aW9uIFNlYXJjaGluZygpIHtcbiAgICAgICAgICAgIGNvbnN0IHZhbCA9ICQodGhpcykudmFsKCk7XG4gICAgICAgICAgICAkdGhpcy50aHVvY1RhYmxlLnJlbmRlcih2YWwpO1xuICAgICAgICB9KTtcbiAgICB9XG4gICAgaGFuZGxlTW9kYWxFdmVudCgpIHtcbiAgICAgICAgdGhpcy5hZGRNb2RhbCA9IG5ldyB0aHVvY19tb2RhbF8xLkFkZFRodW9jTW9kYWwoXCJ0aHVvYy0tYWRkLW1vZGFsXCIsIHRoaXMuYXBwKTtcbiAgICAgICAgdGhpcy5uZXdNb2RhbCA9IG5ldyB0aHVvY19tb2RhbF8xLk5ld1RodW9jTW9kYWwoXCJ0aHVvYy0tbmV3LW1vZGFsXCIsIHRoaXMuYXBwKTtcbiAgICAgICAgdGhpcy5lZGl0TW9kYWwgPSBuZXcgdGh1b2NfbW9kYWxfMS5FZGl0VGh1b2NNb2RhbChcInRodW9jLS1lZGl0LW1vZGFsXCIsIHRoaXMuYXBwKTtcbiAgICAgICAgdGhpcy5lZGl0UHJpY2VNb2RhbCA9IG5ldyB0aHVvY19tb2RhbF8xLkVkaXRQcmljZVRodW9jTW9kYWwoXCJ0aHVvYy0tZWRpdC1wcmljZS1tb2RhbFwiLCB0aGlzLmFwcC50aHVvYyk7XG4gICAgfVxuICAgIGVkaXRUaHVvYyhkYXRhKSB7XG4gICAgICAgIGlmICghZGF0YSkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuZWRpdE1vZGFsLnNob3coZGF0YSk7XG4gICAgfVxuICAgIG5ld1RodW9jKCkge1xuICAgICAgICAkKFwiI3RodW9jLS1uZXctbW9kYWxcIikubW9kYWwoXCJzaG93XCIpO1xuICAgIH1cbiAgICBhZGRUaHVvYyhkYXRhKSB7XG4gICAgICAgIGlmICghZGF0YSkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgICQoXCIjdGh1b2MtLWFkZC1tb2RhbFwiKS5tb2RhbChcInNob3dcIik7XG4gICAgICAgICQoXCIjdGh1b2MtLWFkZC1tYXRodW9jXCIpLnZhbChkYXRhLm1hKTtcbiAgICAgICAgJChcIiN0aHVvYy0tYWRkLXRlbnRodW9jXCIpLnZhbChkYXRhLnRlbik7XG4gICAgICAgICQoXCIjdGh1b2MtLWFkZC1uY2NcIikudmFsKGRhdGEudGVuX25jYyk7XG4gICAgICAgICQoXCIjdGh1b2MtLWFkZC1zb2x1b25nXCIpLnZhbChkYXRhLnNvX2x1b25nKTtcbiAgICB9XG4gICAgZWRpdFByaWNlVGh1b2MoZGF0YSkge1xuICAgICAgICBpZiAoIWRhdGEpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICAkKFwiI3RodW9jLS1lZGl0LXByaWNlLW1vZGFsXCIpLm1vZGFsKFwic2hvd1wiKTtcbiAgICAgICAgJChcIiN0aHVvYy0tZWRpdC1wcmljZS1tYXRodW9jXCIpLnZhbChkYXRhLm1hKTtcbiAgICAgICAgJChcIiN0aHVvYy0tZWRpdC1wcmljZS10ZW50aHVvY1wiKS52YWwoZGF0YS50ZW4pO1xuICAgIH1cbn1cbmZ1bmN0aW9uIGluaXQoYXBwKSB7XG4gICAgcmV0dXJuIG5ldyBJbml0KGFwcCk7XG59XG5leHBvcnRzLmluaXQgPSBpbml0O1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9aW5kZXguanMubWFwIiwiXCJ1c2Ugc3RyaWN0XCI7XG52YXIgX19hd2FpdGVyID0gKHRoaXMgJiYgdGhpcy5fX2F3YWl0ZXIpIHx8IGZ1bmN0aW9uICh0aGlzQXJnLCBfYXJndW1lbnRzLCBQLCBnZW5lcmF0b3IpIHtcbiAgICByZXR1cm4gbmV3IChQIHx8IChQID0gUHJvbWlzZSkpKGZ1bmN0aW9uIChyZXNvbHZlLCByZWplY3QpIHtcbiAgICAgICAgZnVuY3Rpb24gZnVsZmlsbGVkKHZhbHVlKSB7IHRyeSB7IHN0ZXAoZ2VuZXJhdG9yLm5leHQodmFsdWUpKTsgfSBjYXRjaCAoZSkgeyByZWplY3QoZSk7IH0gfVxuICAgICAgICBmdW5jdGlvbiByZWplY3RlZCh2YWx1ZSkgeyB0cnkgeyBzdGVwKGdlbmVyYXRvcltcInRocm93XCJdKHZhbHVlKSk7IH0gY2F0Y2ggKGUpIHsgcmVqZWN0KGUpOyB9IH1cbiAgICAgICAgZnVuY3Rpb24gc3RlcChyZXN1bHQpIHsgcmVzdWx0LmRvbmUgPyByZXNvbHZlKHJlc3VsdC52YWx1ZSkgOiBuZXcgUChmdW5jdGlvbiAocmVzb2x2ZSkgeyByZXNvbHZlKHJlc3VsdC52YWx1ZSk7IH0pLnRoZW4oZnVsZmlsbGVkLCByZWplY3RlZCk7IH1cbiAgICAgICAgc3RlcCgoZ2VuZXJhdG9yID0gZ2VuZXJhdG9yLmFwcGx5KHRoaXNBcmcsIF9hcmd1bWVudHMgfHwgW10pKS5uZXh0KCkpO1xuICAgIH0pO1xufTtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmNsYXNzIEFkZFRodW9jTW9kYWwge1xuICAgIGNvbnN0cnVjdG9yKGlkLCBhcHApIHtcbiAgICAgICAgdGhpcy5hcHAgPSBhcHA7XG4gICAgICAgIHRoaXMucG9wdXAgPSAkKFwiI1wiICsgaWQpO1xuICAgICAgICB0aGlzLnBvcHVwLmxvYWQoXCIvbGF5b3V0cy9tb2RhbC1hZGQtdGh1b2MuaHRtbFwiLCAoKSA9PiB7XG4gICAgICAgICAgICB0aGlzLnBvcHVwLmZpbmQoXCJmb3JtXCIpLm9uKFwic3VibWl0XCIsIChlKSA9PiB7XG4gICAgICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgICAgIHRoaXMuZm9ybVN1Ym1pdEhhbmRsZShlKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICB9XG4gICAgZm9ybVN1Ym1pdEhhbmRsZShlKSB7XG4gICAgICAgIHJldHVybiBfX2F3YWl0ZXIodGhpcywgdm9pZCAwLCB2b2lkIDAsIGZ1bmN0aW9uKiAoKSB7XG4gICAgICAgICAgICBjb25zdCBmb3JtID0gJChlLnRhcmdldCk7XG4gICAgICAgICAgICBjb25zdCBkYXRhID0ge1xuICAgICAgICAgICAgICAgIG1hOiBmb3JtLmZpbmQoXCJbbmFtZT1tYV1cIikudmFsKCksXG4gICAgICAgICAgICAgICAgc29fbHVvbmc6ICtmb3JtLmZpbmQoXCJbbmFtZT0nc29fbHVvbmcnXVwiKS52YWwoKSxcbiAgICAgICAgICAgICAgICB0b25nX2dpYTogK2Zvcm0uZmluZChcIltuYW1lPSd0b25nX2dpYSddXCIpLnZhbCgpLFxuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgY29uc3QgcmVzID0geWllbGQgdGhpcy5hcHAudGh1b2MuYWRkKGRhdGEubWEsIGRhdGEuc29fbHVvbmcsIGRhdGEudG9uZ19naWEpO1xuICAgICAgICAgICAgICAgIGFsZXJ0KFwic3VjY2VzczogXCIgKyByZXMubWEgKyBcIj0+XCIgKyByZXMuc29fbHVvbmdfbW9pKTtcbiAgICAgICAgICAgICAgICB3aW5kb3cubG9jYXRpb24ucmVsb2FkKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjYXRjaCAoZSkge1xuICAgICAgICAgICAgICAgIGFsZXJ0KFwiRXJyb3I6IFwiICsgZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH1cbiAgICBzaG93KCkge1xuICAgICAgICB0aGlzLnBvcHVwLm1vZGFsKFwic2hvd1wiKTtcbiAgICB9XG4gICAgaGlkZSgpIHtcbiAgICAgICAgdGhpcy5wb3B1cC5tb2RhbChcImhpZGVcIik7XG4gICAgfVxufVxuZXhwb3J0cy5BZGRUaHVvY01vZGFsID0gQWRkVGh1b2NNb2RhbDtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPXRodW9jLWFkZC1tb2RhbC5qcy5tYXAiLCJcInVzZSBzdHJpY3RcIjtcbnZhciBfX2F3YWl0ZXIgPSAodGhpcyAmJiB0aGlzLl9fYXdhaXRlcikgfHwgZnVuY3Rpb24gKHRoaXNBcmcsIF9hcmd1bWVudHMsIFAsIGdlbmVyYXRvcikge1xuICAgIHJldHVybiBuZXcgKFAgfHwgKFAgPSBQcm9taXNlKSkoZnVuY3Rpb24gKHJlc29sdmUsIHJlamVjdCkge1xuICAgICAgICBmdW5jdGlvbiBmdWxmaWxsZWQodmFsdWUpIHsgdHJ5IHsgc3RlcChnZW5lcmF0b3IubmV4dCh2YWx1ZSkpOyB9IGNhdGNoIChlKSB7IHJlamVjdChlKTsgfSB9XG4gICAgICAgIGZ1bmN0aW9uIHJlamVjdGVkKHZhbHVlKSB7IHRyeSB7IHN0ZXAoZ2VuZXJhdG9yW1widGhyb3dcIl0odmFsdWUpKTsgfSBjYXRjaCAoZSkgeyByZWplY3QoZSk7IH0gfVxuICAgICAgICBmdW5jdGlvbiBzdGVwKHJlc3VsdCkgeyByZXN1bHQuZG9uZSA/IHJlc29sdmUocmVzdWx0LnZhbHVlKSA6IG5ldyBQKGZ1bmN0aW9uIChyZXNvbHZlKSB7IHJlc29sdmUocmVzdWx0LnZhbHVlKTsgfSkudGhlbihmdWxmaWxsZWQsIHJlamVjdGVkKTsgfVxuICAgICAgICBzdGVwKChnZW5lcmF0b3IgPSBnZW5lcmF0b3IuYXBwbHkodGhpc0FyZywgX2FyZ3VtZW50cyB8fCBbXSkpLm5leHQoKSk7XG4gICAgfSk7XG59O1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuY29uc3QgZm9ybVZhbF8xID0gcmVxdWlyZShcIi4uL2Zvcm1WYWxcIik7XG5jbGFzcyBFZGl0VGh1b2NNb2RhbCB7XG4gICAgY29uc3RydWN0b3IoaWQsIGFwcCkge1xuICAgICAgICB0aGlzLmFwcCA9IGFwcDtcbiAgICAgICAgdGhpcy5wb3B1cCA9ICQoXCIjXCIgKyBpZCk7XG4gICAgICAgIHRoaXMucG9wdXAubG9hZChcIi9sYXlvdXRzL21vZGFsLWVkaXQtdGh1b2MuaHRtbFwiLCAoKSA9PiB7XG4gICAgICAgICAgICB0aGlzLnBvcHVwLmZpbmQoXCJmb3JtXCIpLm9uKFwic3VibWl0XCIsIChlKSA9PiB7XG4gICAgICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgICAgIHRoaXMuZm9ybVN1Ym1pdEhhbmRsZShlKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICB9XG4gICAgZm9ybVN1Ym1pdEhhbmRsZShlKSB7XG4gICAgICAgIHJldHVybiBfX2F3YWl0ZXIodGhpcywgdm9pZCAwLCB2b2lkIDAsIGZ1bmN0aW9uKiAoKSB7XG4gICAgICAgICAgICBjb25zdCBmb3JtID0gJChlLnRhcmdldCk7XG4gICAgICAgICAgICBjb25zdCBkYXRhID0gZm9ybVZhbF8xLmdldEZvcm1WYWx1ZShmb3JtKTtcbiAgICAgICAgICAgIC8vIHRydW9uZyBob3AgdGhheSBkb2kgbWFfdGh1b2MsIGNhbiAxIG1hX3RodW9jIHRydW9jIGRlIHVwZGF0ZVxuICAgICAgICAgICAgY29uc3QgbWFUaHVvY0RlVXBkYXRlID0gZm9ybS5hdHRyKFwiaWRfdmFsdWVcIik7XG4gICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgIGNvbnN0IHJlcyA9IHlpZWxkIHRoaXMuYXBwLnRodW9jLnVwZGF0ZShtYVRodW9jRGVVcGRhdGUsIGRhdGEpO1xuICAgICAgICAgICAgICAgIGFsZXJ0KFwiU3VjY2VzczogXCIgKyByZXMgKyBcIiByZWNvcmQocylcIik7XG4gICAgICAgICAgICAgICAgd2luZG93LmxvY2F0aW9uLnJlbG9hZCgpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY2F0Y2ggKGUpIHtcbiAgICAgICAgICAgICAgICBhbGVydChcIkVycm9yOiBcIiArIGUpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9XG4gICAgc2hvdyhkYXRhKSB7XG4gICAgICAgIHRoaXMucG9wdXAuZmluZChcImZvcm1cIikuYXR0cihcImlkX3ZhbHVlXCIsIGRhdGEubWEpO1xuICAgICAgICB0aGlzLnBvcHVwLmZpbmQoXCJbbmFtZT1tYV1cIikudmFsKGRhdGEubWEpO1xuICAgICAgICB0aGlzLnBvcHVwLmZpbmQoXCJbbmFtZT10ZW5dXCIpLnZhbChkYXRhLnRlbik7XG4gICAgICAgIHRoaXMucG9wdXAuZmluZChcIltuYW1lPW5jY11cIikudmFsKGRhdGEudGVuX25jYyk7XG4gICAgICAgIHRoaXMucG9wdXAubW9kYWwoXCJzaG93XCIpO1xuICAgIH1cbiAgICBoaWRlKCkge1xuICAgICAgICB0aGlzLnBvcHVwLm1vZGFsKFwiaGlkZVwiKTtcbiAgICB9XG59XG5leHBvcnRzLkVkaXRUaHVvY01vZGFsID0gRWRpdFRodW9jTW9kYWw7XG4vLyMgc291cmNlTWFwcGluZ1VSTD10aHVvYy1lZGl0LW1vZGFsLmpzLm1hcCIsIlwidXNlIHN0cmljdFwiO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuY2xhc3MgRWRpdFByaWNlVGh1b2NNb2RhbCB7XG4gICAgY29uc3RydWN0b3IoaWQsIG1vZGVsKSB7XG4gICAgICAgIHRoaXMubW9kZWwgPSBtb2RlbDtcbiAgICAgICAgdGhpcy5wb3B1cCA9ICQoXCIjXCIgKyBpZCk7XG4gICAgICAgIHRoaXMucG9wdXAubG9hZChcIi9sYXlvdXRzL21vZGFsLWVkaXQtcHJpY2UtdGh1b2MuaHRtbFwiKTtcbiAgICB9XG4gICAgc2hvdygpIHtcbiAgICAgICAgdGhpcy5wb3B1cC5tb2RhbChcInNob3dcIik7XG4gICAgfVxuICAgIGhpZGUoKSB7XG4gICAgICAgIHRoaXMucG9wdXAubW9kYWwoXCJoaWRlXCIpO1xuICAgIH1cbn1cbmV4cG9ydHMuRWRpdFByaWNlVGh1b2NNb2RhbCA9IEVkaXRQcmljZVRodW9jTW9kYWw7XG4vLyMgc291cmNlTWFwcGluZ1VSTD10aHVvYy1lZGl0LXByaWNlLW1vZGFsLmpzLm1hcCIsIlwidXNlIHN0cmljdFwiO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuY29uc3QgdGh1b2NfYWRkX21vZGFsXzEgPSByZXF1aXJlKFwiLi90aHVvYy1hZGQtbW9kYWxcIik7XG5leHBvcnRzLkFkZFRodW9jTW9kYWwgPSB0aHVvY19hZGRfbW9kYWxfMS5BZGRUaHVvY01vZGFsO1xuY29uc3QgdGh1b2NfZWRpdF9tb2RhbF8xID0gcmVxdWlyZShcIi4vdGh1b2MtZWRpdC1tb2RhbFwiKTtcbmV4cG9ydHMuRWRpdFRodW9jTW9kYWwgPSB0aHVvY19lZGl0X21vZGFsXzEuRWRpdFRodW9jTW9kYWw7XG5jb25zdCB0aHVvY19uZXdfbW9kYWxfMSA9IHJlcXVpcmUoXCIuL3RodW9jLW5ldy1tb2RhbFwiKTtcbmV4cG9ydHMuTmV3VGh1b2NNb2RhbCA9IHRodW9jX25ld19tb2RhbF8xLk5ld1RodW9jTW9kYWw7XG5jb25zdCB0aHVvY19lZGl0X3ByaWNlX21vZGFsXzEgPSByZXF1aXJlKFwiLi90aHVvYy1lZGl0LXByaWNlLW1vZGFsXCIpO1xuZXhwb3J0cy5FZGl0UHJpY2VUaHVvY01vZGFsID0gdGh1b2NfZWRpdF9wcmljZV9tb2RhbF8xLkVkaXRQcmljZVRodW9jTW9kYWw7XG4vLyMgc291cmNlTWFwcGluZ1VSTD10aHVvYy1tb2RhbC5qcy5tYXAiLCJcInVzZSBzdHJpY3RcIjtcbnZhciBfX2F3YWl0ZXIgPSAodGhpcyAmJiB0aGlzLl9fYXdhaXRlcikgfHwgZnVuY3Rpb24gKHRoaXNBcmcsIF9hcmd1bWVudHMsIFAsIGdlbmVyYXRvcikge1xuICAgIHJldHVybiBuZXcgKFAgfHwgKFAgPSBQcm9taXNlKSkoZnVuY3Rpb24gKHJlc29sdmUsIHJlamVjdCkge1xuICAgICAgICBmdW5jdGlvbiBmdWxmaWxsZWQodmFsdWUpIHsgdHJ5IHsgc3RlcChnZW5lcmF0b3IubmV4dCh2YWx1ZSkpOyB9IGNhdGNoIChlKSB7IHJlamVjdChlKTsgfSB9XG4gICAgICAgIGZ1bmN0aW9uIHJlamVjdGVkKHZhbHVlKSB7IHRyeSB7IHN0ZXAoZ2VuZXJhdG9yW1widGhyb3dcIl0odmFsdWUpKTsgfSBjYXRjaCAoZSkgeyByZWplY3QoZSk7IH0gfVxuICAgICAgICBmdW5jdGlvbiBzdGVwKHJlc3VsdCkgeyByZXN1bHQuZG9uZSA/IHJlc29sdmUocmVzdWx0LnZhbHVlKSA6IG5ldyBQKGZ1bmN0aW9uIChyZXNvbHZlKSB7IHJlc29sdmUocmVzdWx0LnZhbHVlKTsgfSkudGhlbihmdWxmaWxsZWQsIHJlamVjdGVkKTsgfVxuICAgICAgICBzdGVwKChnZW5lcmF0b3IgPSBnZW5lcmF0b3IuYXBwbHkodGhpc0FyZywgX2FyZ3VtZW50cyB8fCBbXSkpLm5leHQoKSk7XG4gICAgfSk7XG59O1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuY29uc3QgZm9ybVZhbF8xID0gcmVxdWlyZShcIi4uL2Zvcm1WYWxcIik7XG5jbGFzcyBOZXdUaHVvY01vZGFsIHtcbiAgICBjb25zdHJ1Y3RvcihpZCwgYXBwKSB7XG4gICAgICAgIHRoaXMuYXBwID0gYXBwO1xuICAgICAgICB0aGlzLnBvcHVwID0gJChcIiNcIiArIGlkKTtcbiAgICAgICAgdGhpcy5wb3B1cC5sb2FkKFwiL2xheW91dHMvbW9kYWwtbmV3LXRodW9jLmh0bWxcIiwgKCkgPT4ge1xuICAgICAgICAgICAgdGhpcy5hcHAuZG9uVmkuZ2V0KChkYXRhKSA9PiB7XG4gICAgICAgICAgICAgICAgY29uc3Qgc2VsZWN0SW5wdXQgPSB0aGlzLnBvcHVwLmZpbmQoXCJbY29tcG9uZW50PSdEb25WaSddXCIpO1xuICAgICAgICAgICAgICAgIHNlbGVjdElucHV0LmNoaWxkcmVuKCkucmVtb3ZlKCk7XG4gICAgICAgICAgICAgICAgZm9yIChjb25zdCByb3cgb2YgZGF0YSkge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBvcHQgPSAkKFwiPG9wdGlvbi8+XCIpLnZhbChyb3cuaWQpLnRleHQocm93LnRlbik7XG4gICAgICAgICAgICAgICAgICAgIHNlbGVjdElucHV0LmFwcGVuZChvcHQpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBzZWxlY3RJbnB1dC5jaGlsZHJlbigpLmVxKDApLmF0dHIoXCJjaGVja2VkXCIsIFwidHJ1ZVwiKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgdGhpcy5wb3B1cC5maW5kKFwiZm9ybVwiKS5vbihcInN1Ym1pdFwiLCBmdW5jdGlvbiAoZSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBfX2F3YWl0ZXIodGhpcywgdm9pZCAwLCB2b2lkIDAsIGZ1bmN0aW9uKiAoKSB7XG4gICAgICAgICAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgZm9ybVZhbCA9IGZvcm1WYWxfMS5nZXRGb3JtVmFsdWUoJCh0aGlzKSk7XG4gICAgICAgICAgICAgICAgICAgIHlpZWxkIGFwcC50aHVvYy5jcmVhdGUoZm9ybVZhbCkuY2F0Y2goKGVycikgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgYWxlcnQoZXJyKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRocm93IGVycjtcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgIGFsZXJ0KFwic3VjY2Vzc1wiKTtcbiAgICAgICAgICAgICAgICAgICAgd2luZG93LmxvY2F0aW9uLnJlbG9hZCgpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgIH1cbiAgICBzaG93KCkge1xuICAgICAgICB0aGlzLnBvcHVwLm1vZGFsKFwic2hvd1wiKTtcbiAgICB9XG4gICAgaGlkZSgpIHtcbiAgICAgICAgdGhpcy5wb3B1cC5tb2RhbChcImhpZGVcIik7XG4gICAgfVxufVxuZXhwb3J0cy5OZXdUaHVvY01vZGFsID0gTmV3VGh1b2NNb2RhbDtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPXRodW9jLW5ldy1tb2RhbC5qcy5tYXAiLCJjb25zdCB7QXBwfSA9IHJlcXVpcmUoJy4uL2FwcC9BcHAnKTtcblxuJChkb2N1bWVudCkucmVhZHkoKCk9PntcbiAgICBjb25zdCBhcHAgPSBuZXcgQXBwKCk7XG5cbiAgICByZXF1aXJlKFwiLi4vYXBwL25oYXAtaG9hLWRvblwiKS5pbml0KGFwcCk7XG4gICAgcmVxdWlyZShcIi4uL2FwcC9uaGFwLXRodW9jXCIpLmluaXQoYXBwKTtcbn0pO1xuIl19
