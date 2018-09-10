(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const KeyEvent_1 = require("./KeyEvent");
const Thuoc_1 = require("./Model/Thuoc");
const DonVi_1 = require("./Model/DonVi");
const Ncc_1 = require("./Model/Ncc");
const BangGia_1 = require("./Model/BangGia");
class App {
    constructor() {
        this.switchToPage(this.getPageFromUrl());
        this.handleSwitchPage();
        this.keyevent = new KeyEvent_1.KeyEvent();
        this.handleSetting();
        this.handleModal();
        this.thuoc = new Thuoc_1.Thuoc();
        this.donVi = new DonVi_1.DonVi();
        this.ncc = new Ncc_1.Ncc();
        this.bangGia = new BangGia_1.BangGia();
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

},{"./KeyEvent":3,"./Model/BangGia":5,"./Model/DonVi":6,"./Model/Ncc":8,"./Model/Thuoc":9}],2:[function(require,module,exports){
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

},{"../ModelClass":7}],6:[function(require,module,exports){
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

},{"../ModelClass":7}],7:[function(require,module,exports){
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

},{"../ModelClass":7}],9:[function(require,module,exports){
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

},{"../ModelClass":7}],10:[function(require,module,exports){
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
    handleTenThuocInput(app);
    handleDonViSelectInput(app);
}
exports.addThuocHandle = init;
function handleTenThuocInput(app) {
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
function handleDonViSelectInput(app) {
    app.donVi.renderSelectInput($("#nhap_hoa_don--don_vi"));
}

},{"../AutoComplete":2}],14:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const addThuocHandle_1 = require("./addThuocHandle");
function init(app) {
    addThuocHandle_1.addThuocHandle(app);
}
exports.init = init;

},{"./addThuocHandle":13}],15:[function(require,module,exports){
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

},{"../View/ThuocTable":10,"./thuoc-modal":19}],16:[function(require,module,exports){
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

},{}],17:[function(require,module,exports){
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
                const res = yield this.app.thuoc.update(maThuocDeUpdate, data);
                alert("Success: " + res + " record(s)");
                window.location.reload();
            }
            catch (e) {
                alert("Error: " + e);
            }
        });
    }
    handleNccInput(target) {
        const autocomplete = new AutoComplete_1.AutoComplete(target, this.app.ncc);
        autocomplete.setLookup(["ten"]);
        autocomplete.onChoose((data) => {
            target.val(data.ten);
        });
        autocomplete.listen();
    }
    handleDonViSelect(target) {
        target.html("");
        this.app.donVi.renderSelectInput(target);
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

},{"../AutoComplete":2,"../formVal":12}],18:[function(require,module,exports){
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
                const res = yield this.app.bangGia.add(ma, price);
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

},{}],19:[function(require,module,exports){
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

},{"./thuoc-add-modal":16,"./thuoc-edit-modal":17,"./thuoc-edit-price-modal":18,"./thuoc-new-modal":20}],20:[function(require,module,exports){
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
            this.app.donVi.renderSelectInput(this.popup.find("[name=id_don_vi]"));
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

},{"../formVal":12}],21:[function(require,module,exports){
const {App} = require('../app/App');

$(document).ready(()=>{
    const app = new App();

    require("../app/nhap-hoa-don").init(app);
    require("../app/nhap-thuoc").init(app);
});

},{"../app/App":1,"../app/nhap-hoa-don":14,"../app/nhap-thuoc":15}]},{},[21])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvYXBwL0FwcC5qcyIsInNyYy9hcHAvQXV0b0NvbXBsZXRlL2luZGV4LmpzIiwic3JjL2FwcC9LZXlFdmVudC9pbmRleC5qcyIsInNyYy9hcHAvTWVudUNvbnRleHQvaW5kZXguanMiLCJzcmMvYXBwL01vZGVsL0JhbmdHaWEvaW5kZXguanMiLCJzcmMvYXBwL01vZGVsL0RvblZpL2luZGV4LmpzIiwic3JjL2FwcC9Nb2RlbC9Nb2RlbENsYXNzL2luZGV4LmpzIiwic3JjL2FwcC9Nb2RlbC9OY2MvaW5kZXguanMiLCJzcmMvYXBwL01vZGVsL1RodW9jL2luZGV4LmpzIiwic3JjL2FwcC9WaWV3L1RodW9jVGFibGUuanMiLCJzcmMvYXBwL1ZpZXcvVmlld1RhYmxlLmpzIiwic3JjL2FwcC9mb3JtVmFsLmpzIiwic3JjL2FwcC9uaGFwLWhvYS1kb24vYWRkVGh1b2NIYW5kbGUuanMiLCJzcmMvYXBwL25oYXAtaG9hLWRvbi9pbmRleC5qcyIsInNyYy9hcHAvbmhhcC10aHVvYy9pbmRleC5qcyIsInNyYy9hcHAvbmhhcC10aHVvYy90aHVvYy1hZGQtbW9kYWwuanMiLCJzcmMvYXBwL25oYXAtdGh1b2MvdGh1b2MtZWRpdC1tb2RhbC5qcyIsInNyYy9hcHAvbmhhcC10aHVvYy90aHVvYy1lZGl0LXByaWNlLW1vZGFsLmpzIiwic3JjL2FwcC9uaGFwLXRodW9jL3RodW9jLW1vZGFsLmpzIiwic3JjL2FwcC9uaGFwLXRodW9jL3RodW9jLW5ldy1tb2RhbC5qcyIsInNyYy9zY3JpcHQvbWFpbi5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbkVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2SEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN4Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNwREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDOUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3ZDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN6SkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM1QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQy9DQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3ZEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3hJQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDWEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3ZCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1BBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMxSEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQy9DQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDakVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzdDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3ZDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbigpe2Z1bmN0aW9uIHIoZSxuLHQpe2Z1bmN0aW9uIG8oaSxmKXtpZighbltpXSl7aWYoIWVbaV0pe3ZhciBjPVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmU7aWYoIWYmJmMpcmV0dXJuIGMoaSwhMCk7aWYodSlyZXR1cm4gdShpLCEwKTt2YXIgYT1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK2krXCInXCIpO3Rocm93IGEuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixhfXZhciBwPW5baV09e2V4cG9ydHM6e319O2VbaV1bMF0uY2FsbChwLmV4cG9ydHMsZnVuY3Rpb24ocil7dmFyIG49ZVtpXVsxXVtyXTtyZXR1cm4gbyhufHxyKX0scCxwLmV4cG9ydHMscixlLG4sdCl9cmV0dXJuIG5baV0uZXhwb3J0c31mb3IodmFyIHU9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZSxpPTA7aTx0Lmxlbmd0aDtpKyspbyh0W2ldKTtyZXR1cm4gb31yZXR1cm4gcn0pKCkiLCJcInVzZSBzdHJpY3RcIjtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmNvbnN0IEtleUV2ZW50XzEgPSByZXF1aXJlKFwiLi9LZXlFdmVudFwiKTtcbmNvbnN0IFRodW9jXzEgPSByZXF1aXJlKFwiLi9Nb2RlbC9UaHVvY1wiKTtcbmNvbnN0IERvblZpXzEgPSByZXF1aXJlKFwiLi9Nb2RlbC9Eb25WaVwiKTtcbmNvbnN0IE5jY18xID0gcmVxdWlyZShcIi4vTW9kZWwvTmNjXCIpO1xuY29uc3QgQmFuZ0dpYV8xID0gcmVxdWlyZShcIi4vTW9kZWwvQmFuZ0dpYVwiKTtcbmNsYXNzIEFwcCB7XG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHRoaXMuc3dpdGNoVG9QYWdlKHRoaXMuZ2V0UGFnZUZyb21VcmwoKSk7XG4gICAgICAgIHRoaXMuaGFuZGxlU3dpdGNoUGFnZSgpO1xuICAgICAgICB0aGlzLmtleWV2ZW50ID0gbmV3IEtleUV2ZW50XzEuS2V5RXZlbnQoKTtcbiAgICAgICAgdGhpcy5oYW5kbGVTZXR0aW5nKCk7XG4gICAgICAgIHRoaXMuaGFuZGxlTW9kYWwoKTtcbiAgICAgICAgdGhpcy50aHVvYyA9IG5ldyBUaHVvY18xLlRodW9jKCk7XG4gICAgICAgIHRoaXMuZG9uVmkgPSBuZXcgRG9uVmlfMS5Eb25WaSgpO1xuICAgICAgICB0aGlzLm5jYyA9IG5ldyBOY2NfMS5OY2MoKTtcbiAgICAgICAgdGhpcy5iYW5nR2lhID0gbmV3IEJhbmdHaWFfMS5CYW5nR2lhKCk7XG4gICAgfVxuICAgIGdldFVzZXJuYW1lKCkge1xuICAgICAgICBjb25zdCB1c2VybmFtZSA9IGRvY3VtZW50LmNvb2tpZS5tYXRjaCgvdXNlcm5hbWU9KFswLTlhLXpBLVpfXSspL2kpWzFdO1xuICAgICAgICAkKFwiI3VzZXJuYW1lXCIpLnRleHQodXNlcm5hbWUpO1xuICAgIH1cbiAgICBvblNob3J0Y3V0S2V5KGNvbWJLZXksIHBhZ2UsIGZ1bmMpIHtcbiAgICAgICAgLy8gZipraW5nIGluY3JlZGlibGUgc2NvcGUgdGhpbmdzIVxuICAgICAgICB0aGlzLmtleWV2ZW50Lm9uKGNvbWJLZXksIChlKSA9PiB7XG4gICAgICAgICAgICBpZiAodGhpcy5wYWdlID09PSBwYWdlKSB7XG4gICAgICAgICAgICAgICAgZnVuYyhlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfVxuICAgIGdldFBhZ2VGcm9tVXJsKCkge1xuICAgICAgICBsZXQgcGFnZSA9IG5ldyBVUkwod2luZG93LmxvY2F0aW9uLnRvU3RyaW5nKCkpLnNlYXJjaFBhcmFtcy5nZXQoXCJwYWdlXCIpO1xuICAgICAgICBpZiAoIXBhZ2UpIHtcbiAgICAgICAgICAgIHBhZ2UgPSBcInBhZ2UtbmhhcC1ob2EtZG9uXCI7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHBhZ2U7XG4gICAgfVxuICAgIGhhbmRsZVN3aXRjaFBhZ2UoKSB7XG4gICAgICAgIGNvbnN0ICR0aGlzID0gdGhpcztcbiAgICAgICAgJChcIi5zaWRlYmFyLXN3aXRjaC1wYWdlXCIpLm9uKFwiY2xpY2tcIiwgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgY29uc3QgaWQgPSAkKHRoaXMpLmRhdGEoXCJ0YXJnZXRcIik7XG4gICAgICAgICAgICAkdGhpcy5zd2l0Y2hUb1BhZ2UoaWQpO1xuICAgICAgICB9KTtcbiAgICB9XG4gICAgc3dpdGNoVG9QYWdlKGlkKSB7XG4gICAgICAgIHRoaXMucGFnZSA9IGlkO1xuICAgICAgICB3aW5kb3cuaGlzdG9yeS5yZXBsYWNlU3RhdGUobnVsbCwgaWQsIFwiLz9wYWdlPVwiICsgaWQpO1xuICAgICAgICBjb25zdCBjb250YWluZXIgPSAkKFwiLmZyYW1lLWNvbnRhaW5lclwiKTtcbiAgICAgICAgY29uc3QgcGFnZSA9ICQoXCIjXCIgKyBpZCk7XG4gICAgICAgIGNvbnRhaW5lci5hbmltYXRlKHtcbiAgICAgICAgICAgIHNjcm9sbFRvcDogcGFnZS5vZmZzZXQoKS50b3AgLSBjb250YWluZXIub2Zmc2V0KCkudG9wICsgY29udGFpbmVyLnNjcm9sbFRvcCgpLFxuICAgICAgICB9KTtcbiAgICB9XG4gICAgaGFuZGxlU2V0dGluZygpIHtcbiAgICAgICAgLy9cbiAgICB9XG4gICAgaGFuZGxlTW9kYWwoKSB7XG4gICAgICAgICQoXCIubW9kYWxcIikub24oXCJzaG93bi5icy5tb2RhbFwiLCAoKSA9PiB7XG4gICAgICAgICAgICB0aGlzLmtleWV2ZW50LmJsb2NrKCk7XG4gICAgICAgIH0pO1xuICAgICAgICAkKFwiLm1vZGFsXCIpLm9uKFwiaGlkZGVuLmJzLm1vZGFsXCIsICgpID0+IHtcbiAgICAgICAgICAgIHRoaXMua2V5ZXZlbnQudW5ibG9jaygpO1xuICAgICAgICB9KTtcbiAgICB9XG59XG5leHBvcnRzLkFwcCA9IEFwcDtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPUFwcC5qcy5tYXAiLCJcInVzZSBzdHJpY3RcIjtcbnZhciBfX2F3YWl0ZXIgPSAodGhpcyAmJiB0aGlzLl9fYXdhaXRlcikgfHwgZnVuY3Rpb24gKHRoaXNBcmcsIF9hcmd1bWVudHMsIFAsIGdlbmVyYXRvcikge1xuICAgIHJldHVybiBuZXcgKFAgfHwgKFAgPSBQcm9taXNlKSkoZnVuY3Rpb24gKHJlc29sdmUsIHJlamVjdCkge1xuICAgICAgICBmdW5jdGlvbiBmdWxmaWxsZWQodmFsdWUpIHsgdHJ5IHsgc3RlcChnZW5lcmF0b3IubmV4dCh2YWx1ZSkpOyB9IGNhdGNoIChlKSB7IHJlamVjdChlKTsgfSB9XG4gICAgICAgIGZ1bmN0aW9uIHJlamVjdGVkKHZhbHVlKSB7IHRyeSB7IHN0ZXAoZ2VuZXJhdG9yW1widGhyb3dcIl0odmFsdWUpKTsgfSBjYXRjaCAoZSkgeyByZWplY3QoZSk7IH0gfVxuICAgICAgICBmdW5jdGlvbiBzdGVwKHJlc3VsdCkgeyByZXN1bHQuZG9uZSA/IHJlc29sdmUocmVzdWx0LnZhbHVlKSA6IG5ldyBQKGZ1bmN0aW9uIChyZXNvbHZlKSB7IHJlc29sdmUocmVzdWx0LnZhbHVlKTsgfSkudGhlbihmdWxmaWxsZWQsIHJlamVjdGVkKTsgfVxuICAgICAgICBzdGVwKChnZW5lcmF0b3IgPSBnZW5lcmF0b3IuYXBwbHkodGhpc0FyZywgX2FyZ3VtZW50cyB8fCBbXSkpLm5leHQoKSk7XG4gICAgfSk7XG59O1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuY2xhc3MgQXV0b0NvbXBsZXRlIHtcbiAgICBjb25zdHJ1Y3Rvcih0YXJnZXQsIG1vZGVsKSB7XG4gICAgICAgIGlmICh0eXBlb2YgdGFyZ2V0ID09PSBcInN0cmluZ1wiKSB7XG4gICAgICAgICAgICB0aGlzLnRhcmdldCA9ICQoXCIjXCIgKyB0YXJnZXQpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgdGhpcy50YXJnZXQgPSB0YXJnZXQ7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy50YXJnZXQuYXR0cihcImF1dG9jb21wbGV0ZVwiLCBcIm9mZlwiKTtcbiAgICAgICAgdGhpcy5tb2RlbCA9IG1vZGVsO1xuICAgIH1cbiAgICBvbkNob29zZShmdW5jKSB7XG4gICAgICAgIHRoaXMuZnVuY09uQ2hvb3NlID0gZnVuYztcbiAgICB9XG4gICAgaXNTaG93ZWQoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmVsZW1lbnQuY2hpbGRyZW4ubGVuZ3RoID4gMDtcbiAgICB9XG4gICAgLyoqXG4gICAgICogc2V0IGZpZWxkbmFtZSB0byBzaG93XG4gICAgICogQHBhcmFtIGxvb2t1cCB7ZmllbGROYW1lOiBFbGVtZW50SWR9XG4gICAgICovXG4gICAgc2V0TG9va3VwKGxvb2t1cCkge1xuICAgICAgICB0aGlzLmxvb2t1cCA9IGxvb2t1cDtcbiAgICB9XG4gICAgbGlzdGVuKCkge1xuICAgICAgICB0aGlzLnRhcmdldC5vbihcImtleXVwXCIsIChlKSA9PiB7XG4gICAgICAgICAgICBjb25zdCBrZXkgPSBlLmtleTtcbiAgICAgICAgICAgIHN3aXRjaCAoa2V5KSB7XG4gICAgICAgICAgICAgICAgY2FzZSBcIkVudGVyXCI6IHtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGNhc2UgXCJFc2NhcGVcIjoge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnJlbW92ZSgpO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgY2FzZSBcIkFycm93VXBcIjoge1xuICAgICAgICAgICAgICAgICAgICAvLyB0byBkb1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgY2FzZSBcIkFycm93RG93blwiOiB7XG4gICAgICAgICAgICAgICAgICAgIC8vIHRvIGRvXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBkZWZhdWx0OiB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHZhbCA9IHRoaXMudGFyZ2V0LnZhbCgpO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnJlbW92ZSgpO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnJlbmRlcih2YWwpLnRoZW4oKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5zaG93KCk7XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfVxuICAgIHJlbmRlcihzZWFyY2gpIHtcbiAgICAgICAgcmV0dXJuIF9fYXdhaXRlcih0aGlzLCB2b2lkIDAsIHZvaWQgMCwgZnVuY3Rpb24qICgpIHtcbiAgICAgICAgICAgIHRoaXMuZWxlbWVudCA9ICQoXCI8dWwvPlwiKS5hZGRDbGFzcyhcIm15LWF1dG9jb21wbGV0ZSBzaGFkb3ctbGcgcm91bmRlZFwiKTtcbiAgICAgICAgICAgIHRoaXMuZWxlbWVudC5jc3Moe1xuICAgICAgICAgICAgICAgIHRvcDogdGhpcy50YXJnZXQub2Zmc2V0KCkudG9wICsgdGhpcy50YXJnZXQub3V0ZXJIZWlnaHQoKSxcbiAgICAgICAgICAgICAgICBsZWZ0OiB0aGlzLnRhcmdldC5vZmZzZXQoKS5sZWZ0LFxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBjb25zdCBkYXRhID0geWllbGQgdGhpcy5nZXREYXRhKHNlYXJjaCk7XG4gICAgICAgICAgICB0aGlzLmN1cnJlbnRPZmZzZXQgPSAwO1xuICAgICAgICAgICAgbGV0IG9mZnNldCA9IDA7XG4gICAgICAgICAgICBmb3IgKGNvbnN0IGRhdGFSb3cgb2YgZGF0YSkge1xuICAgICAgICAgICAgICAgIGNvbnN0IGRhdGFSb3dGaWx0ZXJlZCA9IHRoaXMuZmlsdGVyRGF0YVdpdGhMb29rdXAoZGF0YVJvdyk7XG4gICAgICAgICAgICAgICAgY29uc3Qgcm93RWxlbWVudCA9IHRoaXMucmVuZGVyUm93KGRhdGFSb3dGaWx0ZXJlZCwgb2Zmc2V0KyspO1xuICAgICAgICAgICAgICAgIHJvd0VsZW1lbnQub24oXCJjbGljayBrZXlkb3duXCIsIChlKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChlLnR5cGUgPT09IFwiY2xpY2tcIiB8fCBlLmtleSA9PT0gXCJFbnRlclwiKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICAgICAgICAgICAgICBlLnN0b3BQcm9wYWdhdGlvbigpO1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5mdW5jT25DaG9vc2UoZGF0YVJvdyk7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnJlbW92ZSgpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgdGhpcy5lbGVtZW50LmFwcGVuZChyb3dFbGVtZW50KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfVxuICAgIHNob3coKSB7XG4gICAgICAgICQoXCJib2R5XCIpLmFwcGVuZCh0aGlzLmVsZW1lbnQpO1xuICAgIH1cbiAgICByZW1vdmUoKSB7XG4gICAgICAgICQoXCIubXktYXV0b2NvbXBsZXRlXCIpLnJlbW92ZSgpO1xuICAgIH1cbiAgICBnZXREYXRhKHNlYXJjaCkge1xuICAgICAgICByZXR1cm4gX19hd2FpdGVyKHRoaXMsIHZvaWQgMCwgdm9pZCAwLCBmdW5jdGlvbiogKCkge1xuICAgICAgICAgICAgY29uc3QgZGF0YSA9IHlpZWxkIHRoaXMubW9kZWwuZ2V0KHNlYXJjaCwgMCwgMjApOyAvLyAyMCBpcyBmb3IgdGVzdCBmaXJzdCwgd2lsbCBkZXZlbG9wIGluIGZ1dHVyZVxuICAgICAgICAgICAgcmV0dXJuIGRhdGE7XG4gICAgICAgIH0pO1xuICAgIH1cbiAgICByZW5kZXJSb3coZGF0YVJvdywgb2Zmc2V0KSB7XG4gICAgICAgIGNvbnN0IHJvdyA9ICQoXCI8bGkvPlwiKS5kYXRhKFwib2Zmc2V0XCIsIG9mZnNldCk7XG4gICAgICAgIGZvciAoY29uc3QgZmllbGQgb2YgT2JqZWN0LmtleXMoZGF0YVJvdykpIHtcbiAgICAgICAgICAgIGNvbnN0IHZhbCA9IGRhdGFSb3dbZmllbGRdO1xuICAgICAgICAgICAgcm93LmFwcGVuZCgkKFwiPGRpdi8+XCIpLnRleHQodmFsKSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHJvdztcbiAgICB9XG4gICAgZmlsdGVyRGF0YVdpdGhMb29rdXAoZGF0YVJvdykge1xuICAgICAgICBjb25zdCBmaWx0ZXJlZERhdGEgPSB7fTtcbiAgICAgICAgZm9yIChjb25zdCBrZXkgb2YgdGhpcy5sb29rdXApIHtcbiAgICAgICAgICAgIGlmIChkYXRhUm93Lmhhc093blByb3BlcnR5KGtleSkpIHtcbiAgICAgICAgICAgICAgICBmaWx0ZXJlZERhdGFba2V5XSA9IGRhdGFSb3dba2V5XTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZmlsdGVyZWREYXRhO1xuICAgIH1cbn1cbmV4cG9ydHMuQXV0b0NvbXBsZXRlID0gQXV0b0NvbXBsZXRlO1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9aW5kZXguanMubWFwIiwiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5jbGFzcyBLZXlFdmVudCB7XG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHRoaXMuZXZlbnRBdHRhY2ggPSB7fTtcbiAgICAgICAgdGhpcy5pc0Jsb2NraW5nID0gZmFsc2U7XG4gICAgICAgICQoZG9jdW1lbnQpLm9uKFwia2V5ZG93blwiLCAoZSkgPT4ge1xuICAgICAgICAgICAgaWYgKHRoaXMuaXNCbG9ja2luZykge1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGxldCBjb21iS2V5ID0gXCJcIjtcbiAgICAgICAgICAgIGlmIChlLmN0cmxLZXkpIHtcbiAgICAgICAgICAgICAgICBjb21iS2V5ID0gXCJjdHJsK1wiO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY29tYktleSArPSBlLmtleTtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKGNvbWJLZXkpO1xuICAgICAgICAgICAgaWYgKHRoaXMuZXZlbnRBdHRhY2guaGFzT3duUHJvcGVydHkoY29tYktleSkpIHtcbiAgICAgICAgICAgICAgICBjb25zdCBsaXN0RnVuYyA9IHRoaXMuZXZlbnRBdHRhY2hbY29tYktleV07XG4gICAgICAgICAgICAgICAgZm9yIChjb25zdCBmdW5jIG9mIGxpc3RGdW5jKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmICh0eXBlb2YgZnVuYyA9PT0gXCJmdW5jdGlvblwiKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBmdW5jKGUpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9XG4gICAgb24oY29tYktleSwgZnVuYykge1xuICAgICAgICBpZiAoIXRoaXMuZXZlbnRBdHRhY2hbY29tYktleV0pIHtcbiAgICAgICAgICAgIHRoaXMuZXZlbnRBdHRhY2hbY29tYktleV0gPSBbXTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmV2ZW50QXR0YWNoW2NvbWJLZXldLnB1c2goZnVuYyk7XG4gICAgfVxuICAgIGJsb2NrKCkge1xuICAgICAgICB0aGlzLmlzQmxvY2tpbmcgPSB0cnVlO1xuICAgIH1cbiAgICB1bmJsb2NrKCkge1xuICAgICAgICB0aGlzLmlzQmxvY2tpbmcgPSBmYWxzZTtcbiAgICB9XG59XG5leHBvcnRzLktleUV2ZW50ID0gS2V5RXZlbnQ7XG4vLyMgc291cmNlTWFwcGluZ1VSTD1pbmRleC5qcy5tYXAiLCJcInVzZSBzdHJpY3RcIjtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmNsYXNzIE1lbnVDb250ZXh0IHtcbiAgICBjb25zdHJ1Y3Rvcih0YXJnZXQpIHtcbiAgICAgICAgaWYgKHR5cGVvZiB0YXJnZXQgPT09IFwic3RyaW5nXCIpIHtcbiAgICAgICAgICAgIHRoaXMudGFyZ2V0ID0gJChcIiNcIiArIHRhcmdldCk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICB0aGlzLnRhcmdldCA9IHRhcmdldDtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLnRhcmdldC5vbihcImNvbnRleHRtZW51XCIsIChlKSA9PiB7XG4gICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICBlLnN0b3BQcm9wYWdhdGlvbigpO1xuICAgICAgICAgICAgdGhpcy5yZW1vdmUoKS5yZW5kZXIoeyB4OiBlLmNsaWVudFgsIHk6IGUuY2xpZW50WSB9KS5zaG93KCk7XG4gICAgICAgIH0pO1xuICAgICAgICB0aGlzLm1lbnUgPSBbXTtcbiAgICB9XG4gICAgYWRkQ29udGV4dChwcm9wKSB7XG4gICAgICAgIHRoaXMubWVudS5wdXNoKHByb3ApO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG4gICAgcmVuZGVyKHBvcykge1xuICAgICAgICB0aGlzLmVsZW1lbnQgPSAkKFwiPHVsLz5cIikuYWRkQ2xhc3MoXCJzaGFkb3ctbGcgcm91bmRlZCBteS1jb250ZXh0bWVudVwiKTtcbiAgICAgICAgdGhpcy5lbGVtZW50LmNzcyhcInRvcFwiLCBwb3MueSArIFwicHhcIik7XG4gICAgICAgIHRoaXMuZWxlbWVudC5jc3MoXCJsZWZ0XCIsIHBvcy54ICsgXCJweFwiKTtcbiAgICAgICAgZm9yIChjb25zdCBjdHggb2YgdGhpcy5tZW51KSB7XG4gICAgICAgICAgICB0aGlzLmVsZW1lbnQuYXBwZW5kKHRoaXMucmVuZGVyQ29udGV4dChjdHgpKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmVsZW1lbnQuaGlkZSgpO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG4gICAgc2hvdygpIHtcbiAgICAgICAgJChcImJvZHlcIikuYXBwZW5kKHRoaXMuZWxlbWVudCk7XG4gICAgICAgIHRoaXMuZWxlbWVudC5zbGlkZURvd24oMC41KTtcbiAgICAgICAgJChkb2N1bWVudCkub2ZmKFwiY2xpY2tcIiwgdGhpcy5yZW1vdmUpLm9uKFwiY2xpY2tcIiwgdGhpcy5yZW1vdmUpO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG4gICAgcmVtb3ZlKCkge1xuICAgICAgICAkKFwiLm15LWNvbnRleHRtZW51XCIpLnJlbW92ZSgpO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG4gICAgcmVuZGVyQ29udGV4dChwcm9wKSB7XG4gICAgICAgIGNvbnN0IGNvbnRleHQgPSAkKFwiPGxpLz5cIik7XG4gICAgICAgIGNvbnRleHQuaHRtbChgPGkgY2xhc3M9JyR7cHJvcC5pY29ufSAke3Byb3AuY2xhc3NOYW1lfSc+PC9pPiAke3Byb3AudGl0bGV9YCk7XG4gICAgICAgIGNvbnRleHQub24oXCJjbGlja1wiLCAoZSkgPT4ge1xuICAgICAgICAgICAgdGhpcy5yZW1vdmUoKTtcbiAgICAgICAgICAgIHByb3AuY2xpY2soZSk7XG4gICAgICAgIH0pO1xuICAgICAgICByZXR1cm4gY29udGV4dDtcbiAgICB9XG59XG5leHBvcnRzLk1lbnVDb250ZXh0ID0gTWVudUNvbnRleHQ7XG4vLyMgc291cmNlTWFwcGluZ1VSTD1pbmRleC5qcy5tYXAiLCJcInVzZSBzdHJpY3RcIjtcbnZhciBfX2F3YWl0ZXIgPSAodGhpcyAmJiB0aGlzLl9fYXdhaXRlcikgfHwgZnVuY3Rpb24gKHRoaXNBcmcsIF9hcmd1bWVudHMsIFAsIGdlbmVyYXRvcikge1xuICAgIHJldHVybiBuZXcgKFAgfHwgKFAgPSBQcm9taXNlKSkoZnVuY3Rpb24gKHJlc29sdmUsIHJlamVjdCkge1xuICAgICAgICBmdW5jdGlvbiBmdWxmaWxsZWQodmFsdWUpIHsgdHJ5IHsgc3RlcChnZW5lcmF0b3IubmV4dCh2YWx1ZSkpOyB9IGNhdGNoIChlKSB7IHJlamVjdChlKTsgfSB9XG4gICAgICAgIGZ1bmN0aW9uIHJlamVjdGVkKHZhbHVlKSB7IHRyeSB7IHN0ZXAoZ2VuZXJhdG9yW1widGhyb3dcIl0odmFsdWUpKTsgfSBjYXRjaCAoZSkgeyByZWplY3QoZSk7IH0gfVxuICAgICAgICBmdW5jdGlvbiBzdGVwKHJlc3VsdCkgeyByZXN1bHQuZG9uZSA/IHJlc29sdmUocmVzdWx0LnZhbHVlKSA6IG5ldyBQKGZ1bmN0aW9uIChyZXNvbHZlKSB7IHJlc29sdmUocmVzdWx0LnZhbHVlKTsgfSkudGhlbihmdWxmaWxsZWQsIHJlamVjdGVkKTsgfVxuICAgICAgICBzdGVwKChnZW5lcmF0b3IgPSBnZW5lcmF0b3IuYXBwbHkodGhpc0FyZywgX2FyZ3VtZW50cyB8fCBbXSkpLm5leHQoKSk7XG4gICAgfSk7XG59O1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuY29uc3QgTW9kZWxDbGFzc18xID0gcmVxdWlyZShcIi4uL01vZGVsQ2xhc3NcIik7XG5jbGFzcyBCYW5nR2lhIGV4dGVuZHMgTW9kZWxDbGFzc18xLk1vZGVsIHtcbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgc3VwZXIoKTtcbiAgICAgICAgdGhpcy5kYXRhYmFzZSA9IFwiL2FwaS9wcmljZS9cIjtcbiAgICB9XG4gICAgZ2V0KG1hVGh1b2MpIHtcbiAgICAgICAgcmV0dXJuIF9fYXdhaXRlcih0aGlzLCB2b2lkIDAsIHZvaWQgMCwgZnVuY3Rpb24qICgpIHtcbiAgICAgICAgICAgIGNvbnN0IGRhdGEgPSB5aWVsZCB0aGlzLl9nZXQoeyBtYTogbWFUaHVvYyB9KTtcbiAgICAgICAgICAgIHJldHVybiBkYXRhO1xuICAgICAgICB9KTtcbiAgICB9XG4gICAgYWRkKG1hVGh1b2MsIGdpYU1vaSkge1xuICAgICAgICByZXR1cm4gX19hd2FpdGVyKHRoaXMsIHZvaWQgMCwgdm9pZCAwLCBmdW5jdGlvbiogKCkge1xuICAgICAgICAgICAgY29uc3QgcmVzID0geWllbGQgdGhpcy5fcG9zdCh7IG1hOiBtYVRodW9jLCBwcmljZTogZ2lhTW9pIH0pO1xuICAgICAgICAgICAgcmV0dXJuIHJlcztcbiAgICAgICAgfSk7XG4gICAgfVxufVxuZXhwb3J0cy5CYW5nR2lhID0gQmFuZ0dpYTtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWluZGV4LmpzLm1hcCIsIlwidXNlIHN0cmljdFwiO1xudmFyIF9fYXdhaXRlciA9ICh0aGlzICYmIHRoaXMuX19hd2FpdGVyKSB8fCBmdW5jdGlvbiAodGhpc0FyZywgX2FyZ3VtZW50cywgUCwgZ2VuZXJhdG9yKSB7XG4gICAgcmV0dXJuIG5ldyAoUCB8fCAoUCA9IFByb21pc2UpKShmdW5jdGlvbiAocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgICAgIGZ1bmN0aW9uIGZ1bGZpbGxlZCh2YWx1ZSkgeyB0cnkgeyBzdGVwKGdlbmVyYXRvci5uZXh0KHZhbHVlKSk7IH0gY2F0Y2ggKGUpIHsgcmVqZWN0KGUpOyB9IH1cbiAgICAgICAgZnVuY3Rpb24gcmVqZWN0ZWQodmFsdWUpIHsgdHJ5IHsgc3RlcChnZW5lcmF0b3JbXCJ0aHJvd1wiXSh2YWx1ZSkpOyB9IGNhdGNoIChlKSB7IHJlamVjdChlKTsgfSB9XG4gICAgICAgIGZ1bmN0aW9uIHN0ZXAocmVzdWx0KSB7IHJlc3VsdC5kb25lID8gcmVzb2x2ZShyZXN1bHQudmFsdWUpIDogbmV3IFAoZnVuY3Rpb24gKHJlc29sdmUpIHsgcmVzb2x2ZShyZXN1bHQudmFsdWUpOyB9KS50aGVuKGZ1bGZpbGxlZCwgcmVqZWN0ZWQpOyB9XG4gICAgICAgIHN0ZXAoKGdlbmVyYXRvciA9IGdlbmVyYXRvci5hcHBseSh0aGlzQXJnLCBfYXJndW1lbnRzIHx8IFtdKSkubmV4dCgpKTtcbiAgICB9KTtcbn07XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5jb25zdCBNb2RlbENsYXNzXzEgPSByZXF1aXJlKFwiLi4vTW9kZWxDbGFzc1wiKTtcbmNsYXNzIERvblZpIGV4dGVuZHMgTW9kZWxDbGFzc18xLk1vZGVsIHtcbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgc3VwZXIoKTtcbiAgICAgICAgdGhpcy5kYXRhYmFzZSA9IFwiL2FwaS9kb25fdmkvXCI7XG4gICAgfVxuICAgIGdldChjYWxsYmFjaykge1xuICAgICAgICByZXR1cm4gX19hd2FpdGVyKHRoaXMsIHZvaWQgMCwgdm9pZCAwLCBmdW5jdGlvbiogKCkge1xuICAgICAgICAgICAgY29uc3QgZGF0YSA9IHlpZWxkIHRoaXMuX2dldCh7fSk7XG4gICAgICAgICAgICB0aGlzLmRhdGEgPSBkYXRhO1xuICAgICAgICAgICAgaWYgKHR5cGVvZiBjYWxsYmFjayA9PT0gXCJmdW5jdGlvblwiKSB7XG4gICAgICAgICAgICAgICAgY2FsbGJhY2soZGF0YSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5kYXRhO1xuICAgICAgICB9KTtcbiAgICB9XG4gICAgcmVuZGVyU2VsZWN0SW5wdXQodGFyZ2V0KSB7XG4gICAgICAgIHJldHVybiBfX2F3YWl0ZXIodGhpcywgdm9pZCAwLCB2b2lkIDAsIGZ1bmN0aW9uKiAoKSB7XG4gICAgICAgICAgICBjb25zdCBkYXRhID0geWllbGQgdGhpcy5nZXQoKTtcbiAgICAgICAgICAgIHRhcmdldC5odG1sKFwiXCIpO1xuICAgICAgICAgICAgZm9yIChjb25zdCByb3cgb2YgZGF0YSkge1xuICAgICAgICAgICAgICAgIGNvbnN0IG9wdCA9ICQoXCI8b3B0aW9uLz5cIikudmFsKHJvdy5pZCkudGV4dChyb3cudGVuKTtcbiAgICAgICAgICAgICAgICB0YXJnZXQuYXBwZW5kKG9wdCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0YXJnZXQuY2hpbGRyZW4oKS5lcSgwKS5hdHRyKFwiY2hlY2tlZFwiLCBcInRydWVcIik7XG4gICAgICAgIH0pO1xuICAgIH1cbn1cbmV4cG9ydHMuRG9uVmkgPSBEb25WaTtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWluZGV4LmpzLm1hcCIsIlwidXNlIHN0cmljdFwiO1xudmFyIF9fYXdhaXRlciA9ICh0aGlzICYmIHRoaXMuX19hd2FpdGVyKSB8fCBmdW5jdGlvbiAodGhpc0FyZywgX2FyZ3VtZW50cywgUCwgZ2VuZXJhdG9yKSB7XG4gICAgcmV0dXJuIG5ldyAoUCB8fCAoUCA9IFByb21pc2UpKShmdW5jdGlvbiAocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgICAgIGZ1bmN0aW9uIGZ1bGZpbGxlZCh2YWx1ZSkgeyB0cnkgeyBzdGVwKGdlbmVyYXRvci5uZXh0KHZhbHVlKSk7IH0gY2F0Y2ggKGUpIHsgcmVqZWN0KGUpOyB9IH1cbiAgICAgICAgZnVuY3Rpb24gcmVqZWN0ZWQodmFsdWUpIHsgdHJ5IHsgc3RlcChnZW5lcmF0b3JbXCJ0aHJvd1wiXSh2YWx1ZSkpOyB9IGNhdGNoIChlKSB7IHJlamVjdChlKTsgfSB9XG4gICAgICAgIGZ1bmN0aW9uIHN0ZXAocmVzdWx0KSB7IHJlc3VsdC5kb25lID8gcmVzb2x2ZShyZXN1bHQudmFsdWUpIDogbmV3IFAoZnVuY3Rpb24gKHJlc29sdmUpIHsgcmVzb2x2ZShyZXN1bHQudmFsdWUpOyB9KS50aGVuKGZ1bGZpbGxlZCwgcmVqZWN0ZWQpOyB9XG4gICAgICAgIHN0ZXAoKGdlbmVyYXRvciA9IGdlbmVyYXRvci5hcHBseSh0aGlzQXJnLCBfYXJndW1lbnRzIHx8IFtdKSkubmV4dCgpKTtcbiAgICB9KTtcbn07XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5jbGFzcyBNb2RlbCB7XG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHRoaXMuZGF0YWJhc2UgPSBcIlwiO1xuICAgICAgICB0aGlzLmRhdGEgPSBbXTtcbiAgICB9XG4gICAgZ2V0IGZldGNoRGF0YSgpIHtcbiAgICAgICAgcmV0dXJuIE9iamVjdC5hc3NpZ24oe30sIHRoaXMuZGF0YSk7XG4gICAgfVxuICAgIGdldCByZXNwb25zZSgpIHtcbiAgICAgICAgcmV0dXJuIE9iamVjdC5hc3NpZ24oe30sIHRoaXMucmVzKTtcbiAgICB9XG4gICAgLy8gPT09PT09PT09PT09PT09IElOSEVSSVQgRlVOQ1xuICAgIGdldChwYXJhbXMsIG9mZnNldCwgbGltaXQpIHtcbiAgICAgICAgcmV0dXJuIF9fYXdhaXRlcih0aGlzLCB2b2lkIDAsIHZvaWQgMCwgZnVuY3Rpb24qICgpIHtcbiAgICAgICAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgICAgIH0pO1xuICAgIH1cbiAgICBjcmVhdGUoZGF0YSkge1xuICAgICAgICByZXR1cm4gX19hd2FpdGVyKHRoaXMsIHZvaWQgMCwgdm9pZCAwLCBmdW5jdGlvbiogKCkge1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9KTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogdXBkYXRlIHJlY29yZFxuICAgICAqIEBwYXJhbSBmaWVsZE1hdGNoIG1hdGNoIGZpZWxkIHRvIHVwZGF0ZSByZWNvcmRcbiAgICAgKiBAcGFyYW0gZmllbGRVcGRhdGUgdGhlIGRhdGEgbmVlZCB1cGRhdGVcbiAgICAgKi9cbiAgICB1cGRhdGUoZmllbGRNYXRjaCwgZmllbGRVcGRhdGUpIHtcbiAgICAgICAgcmV0dXJuIF9fYXdhaXRlcih0aGlzLCB2b2lkIDAsIHZvaWQgMCwgZnVuY3Rpb24qICgpIHtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfSk7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIHJlbW92ZSBhIHJlY29yZFxuICAgICAqIEBwYXJhbSBmaWVsZE1hdGNoIGZpZWxkIG1hdGNoIHRvIHJlbW92ZVxuICAgICAqIEByZXR1cm4gdHJ1ZSBvZiBmYWxzZVxuICAgICAqL1xuICAgIHJlbW92ZShmaWVsZE1hdGNoKSB7XG4gICAgICAgIHJldHVybiBfX2F3YWl0ZXIodGhpcywgdm9pZCAwLCB2b2lkIDAsIGZ1bmN0aW9uKiAoKSB7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH0pO1xuICAgIH1cbiAgICAvLyA9PT09PT09PT09PT09PT0gQ09SRSBGVU5DXG4gICAgLyoqXG4gICAgICogZmV0Y2ggZGF0YSBmcm9tIGRhdGFiYXNlIGFuZCBkbyB0aGluZ1xuICAgICAqIEBwYXJhbSBwYXJhbXNcbiAgICAgKiBAcGFyYW0gY2FsbGJhY2sgY2FsbGJhY2sgZnVuY3Rpb25cbiAgICAgKi9cbiAgICBfZ2V0KHBhcmFtcywgY2FsbGJhY2spIHtcbiAgICAgICAgcmV0dXJuIF9fYXdhaXRlcih0aGlzLCB2b2lkIDAsIHZvaWQgMCwgZnVuY3Rpb24qICgpIHtcbiAgICAgICAgICAgIHRoaXMuZGF0YSA9IFtdO1xuICAgICAgICAgICAgY29uc3QgcmVxdWVzdFVSTCA9IHRoaXMuZGF0YWJhc2UgKyBcIj9cIiArIHRoaXMuX3VybHBhcmFtcyhwYXJhbXMpO1xuICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICBjb25zdCByZXMgPSB5aWVsZCBmZXRjaChyZXF1ZXN0VVJMLCB7IGNyZWRlbnRpYWxzOiBcImluY2x1ZGVcIiB9KTtcbiAgICAgICAgICAgICAgICBjb25zdCBqc29uID0geWllbGQgcmVzLmpzb24oKTtcbiAgICAgICAgICAgICAgICBpZiAoanNvbi5lcnIpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGpzb24ubXNnKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgdGhpcy5kYXRhID0ganNvbi5kYXRhO1xuICAgICAgICAgICAgICAgIGlmICh0eXBlb2YgY2FsbGJhY2sgPT09IFwiZnVuY3Rpb25cIikge1xuICAgICAgICAgICAgICAgICAgICBjYWxsYmFjayhmYWxzZSwganNvbi5kYXRhKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcmV0dXJuIGpzb24uZGF0YTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNhdGNoIChlcnIpIHtcbiAgICAgICAgICAgICAgICBpZiAodHlwZW9mIGNhbGxiYWNrID09PSBcImZ1bmN0aW9uXCIpIHtcbiAgICAgICAgICAgICAgICAgICAgY2FsbGJhY2soZXJyKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHRocm93IGVycjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBwb3N0IHJlcXVlc3RcbiAgICAgKiBAcGFyYW0ge2FueX0gZGF0YVxuICAgICAqIEBwYXJhbSB7RnVuY3Rpb259IFtjYWxsYmFja11cbiAgICAgKi9cbiAgICBfcG9zdChkYXRhLCBjYWxsYmFjaykge1xuICAgICAgICByZXR1cm4gX19hd2FpdGVyKHRoaXMsIHZvaWQgMCwgdm9pZCAwLCBmdW5jdGlvbiogKCkge1xuICAgICAgICAgICAgdGhpcy5yZXMgPSBcIlwiO1xuICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICBjb25zdCByZXMgPSB5aWVsZCBmZXRjaCh0aGlzLmRhdGFiYXNlLCB7XG4gICAgICAgICAgICAgICAgICAgIGJvZHk6IEpTT04uc3RyaW5naWZ5KGRhdGEpLFxuICAgICAgICAgICAgICAgICAgICBjcmVkZW50aWFsczogXCJpbmNsdWRlXCIsXG4gICAgICAgICAgICAgICAgICAgIGhlYWRlcnM6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiQ29udGVudC1UeXBlXCI6IFwiYXBwbGljYXRpb24vanNvblwiLFxuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICBtZXRob2Q6IFwiUE9TVFwiLFxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIGNvbnN0IGpzb24gPSB5aWVsZCByZXMuanNvbigpO1xuICAgICAgICAgICAgICAgIGlmIChqc29uLmVycikge1xuICAgICAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoanNvbi5tc2cpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB0aGlzLnJlcyA9IGpzb24uZGF0YTtcbiAgICAgICAgICAgICAgICBpZiAodHlwZW9mIGNhbGxiYWNrID09PSBcImZ1bmN0aW9uXCIpIHtcbiAgICAgICAgICAgICAgICAgICAgY2FsbGJhY2soZmFsc2UsIGpzb24uZGF0YSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHJldHVybiBqc29uLmRhdGE7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjYXRjaCAoZXJyKSB7XG4gICAgICAgICAgICAgICAgaWYgKHR5cGVvZiBjYWxsYmFjayA9PT0gXCJmdW5jdGlvblwiKSB7XG4gICAgICAgICAgICAgICAgICAgIGNhbGxiYWNrKGVycik7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICB0aHJvdyBlcnI7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9XG4gICAgX3B1dChkYXRhKSB7XG4gICAgICAgIHJldHVybiBfX2F3YWl0ZXIodGhpcywgdm9pZCAwLCB2b2lkIDAsIGZ1bmN0aW9uKiAoKSB7XG4gICAgICAgICAgICB0aGlzLnJlcyA9IFwiXCI7XG4gICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgIGNvbnN0IHJlcyA9IHlpZWxkIGZldGNoKHRoaXMuZGF0YWJhc2UsIHtcbiAgICAgICAgICAgICAgICAgICAgYm9keTogSlNPTi5zdHJpbmdpZnkoZGF0YSksXG4gICAgICAgICAgICAgICAgICAgIGNyZWRlbnRpYWxzOiBcImluY2x1ZGVcIixcbiAgICAgICAgICAgICAgICAgICAgaGVhZGVyczoge1xuICAgICAgICAgICAgICAgICAgICAgICAgXCJDb250ZW50LVR5cGVcIjogXCJhcHBsaWNhdGlvbi9qc29uXCIsXG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgIG1ldGhvZDogXCJQVVRcIixcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICBjb25zdCBqc29uID0geWllbGQgcmVzLmpzb24oKTtcbiAgICAgICAgICAgICAgICBpZiAoanNvbi5lcnIpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGpzb24ubXNnKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgdGhpcy5yZXMgPSBqc29uLmRhdGE7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGpzb24uZGF0YTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNhdGNoIChlcnIpIHtcbiAgICAgICAgICAgICAgICB0aHJvdyBlcnI7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH1cbiAgICBfdXJscGFyYW1zKHBhcmFtcykge1xuICAgICAgICBjb25zdCB1cmwgPSBPYmplY3Qua2V5cyhwYXJhbXMpLm1hcCgoaykgPT4ge1xuICAgICAgICAgICAgcmV0dXJuIGVuY29kZVVSSUNvbXBvbmVudChrKSArIFwiPVwiICsgZW5jb2RlVVJJQ29tcG9uZW50KHBhcmFtc1trXSk7XG4gICAgICAgIH0pLmpvaW4oXCImXCIpO1xuICAgICAgICByZXR1cm4gdXJsO1xuICAgIH1cbn1cbmV4cG9ydHMuTW9kZWwgPSBNb2RlbDtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWluZGV4LmpzLm1hcCIsIlwidXNlIHN0cmljdFwiO1xudmFyIF9fYXdhaXRlciA9ICh0aGlzICYmIHRoaXMuX19hd2FpdGVyKSB8fCBmdW5jdGlvbiAodGhpc0FyZywgX2FyZ3VtZW50cywgUCwgZ2VuZXJhdG9yKSB7XG4gICAgcmV0dXJuIG5ldyAoUCB8fCAoUCA9IFByb21pc2UpKShmdW5jdGlvbiAocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgICAgIGZ1bmN0aW9uIGZ1bGZpbGxlZCh2YWx1ZSkgeyB0cnkgeyBzdGVwKGdlbmVyYXRvci5uZXh0KHZhbHVlKSk7IH0gY2F0Y2ggKGUpIHsgcmVqZWN0KGUpOyB9IH1cbiAgICAgICAgZnVuY3Rpb24gcmVqZWN0ZWQodmFsdWUpIHsgdHJ5IHsgc3RlcChnZW5lcmF0b3JbXCJ0aHJvd1wiXSh2YWx1ZSkpOyB9IGNhdGNoIChlKSB7IHJlamVjdChlKTsgfSB9XG4gICAgICAgIGZ1bmN0aW9uIHN0ZXAocmVzdWx0KSB7IHJlc3VsdC5kb25lID8gcmVzb2x2ZShyZXN1bHQudmFsdWUpIDogbmV3IFAoZnVuY3Rpb24gKHJlc29sdmUpIHsgcmVzb2x2ZShyZXN1bHQudmFsdWUpOyB9KS50aGVuKGZ1bGZpbGxlZCwgcmVqZWN0ZWQpOyB9XG4gICAgICAgIHN0ZXAoKGdlbmVyYXRvciA9IGdlbmVyYXRvci5hcHBseSh0aGlzQXJnLCBfYXJndW1lbnRzIHx8IFtdKSkubmV4dCgpKTtcbiAgICB9KTtcbn07XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5jb25zdCBNb2RlbENsYXNzXzEgPSByZXF1aXJlKFwiLi4vTW9kZWxDbGFzc1wiKTtcbmNsYXNzIE5jYyBleHRlbmRzIE1vZGVsQ2xhc3NfMS5Nb2RlbCB7XG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHN1cGVyKCk7XG4gICAgICAgIHRoaXMuZGF0YWJhc2UgPSBcIi9hcGkvbmNjL1wiO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBnZXQgZGF0YSBvZiBuc3hcbiAgICAgKiBAcGFyYW0gY2FsbGJhY2sgY2FsbGJhY2sgZnVuY3Rpb25cbiAgICAgKi9cbiAgICBnZXQocGFyYW1zKSB7XG4gICAgICAgIHJldHVybiBfX2F3YWl0ZXIodGhpcywgdm9pZCAwLCB2b2lkIDAsIGZ1bmN0aW9uKiAoKSB7XG4gICAgICAgICAgICBjb25zdCBkYXRhID0geWllbGQgdGhpcy5fZ2V0KHsgcTogcGFyYW1zIH0pO1xuICAgICAgICAgICAgcmV0dXJuIGRhdGE7XG4gICAgICAgIH0pO1xuICAgIH1cbn1cbmV4cG9ydHMuTmNjID0gTmNjO1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9aW5kZXguanMubWFwIiwiXCJ1c2Ugc3RyaWN0XCI7XG52YXIgX19hd2FpdGVyID0gKHRoaXMgJiYgdGhpcy5fX2F3YWl0ZXIpIHx8IGZ1bmN0aW9uICh0aGlzQXJnLCBfYXJndW1lbnRzLCBQLCBnZW5lcmF0b3IpIHtcbiAgICByZXR1cm4gbmV3IChQIHx8IChQID0gUHJvbWlzZSkpKGZ1bmN0aW9uIChyZXNvbHZlLCByZWplY3QpIHtcbiAgICAgICAgZnVuY3Rpb24gZnVsZmlsbGVkKHZhbHVlKSB7IHRyeSB7IHN0ZXAoZ2VuZXJhdG9yLm5leHQodmFsdWUpKTsgfSBjYXRjaCAoZSkgeyByZWplY3QoZSk7IH0gfVxuICAgICAgICBmdW5jdGlvbiByZWplY3RlZCh2YWx1ZSkgeyB0cnkgeyBzdGVwKGdlbmVyYXRvcltcInRocm93XCJdKHZhbHVlKSk7IH0gY2F0Y2ggKGUpIHsgcmVqZWN0KGUpOyB9IH1cbiAgICAgICAgZnVuY3Rpb24gc3RlcChyZXN1bHQpIHsgcmVzdWx0LmRvbmUgPyByZXNvbHZlKHJlc3VsdC52YWx1ZSkgOiBuZXcgUChmdW5jdGlvbiAocmVzb2x2ZSkgeyByZXNvbHZlKHJlc3VsdC52YWx1ZSk7IH0pLnRoZW4oZnVsZmlsbGVkLCByZWplY3RlZCk7IH1cbiAgICAgICAgc3RlcCgoZ2VuZXJhdG9yID0gZ2VuZXJhdG9yLmFwcGx5KHRoaXNBcmcsIF9hcmd1bWVudHMgfHwgW10pKS5uZXh0KCkpO1xuICAgIH0pO1xufTtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmNvbnN0IE1vZGVsQ2xhc3NfMSA9IHJlcXVpcmUoXCIuLi9Nb2RlbENsYXNzXCIpO1xuY2xhc3MgVGh1b2MgZXh0ZW5kcyBNb2RlbENsYXNzXzEuTW9kZWwge1xuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICBzdXBlcigpO1xuICAgICAgICB0aGlzLmRhdGFiYXNlID0gXCIvYXBpL3RodW9jL1wiO1xuICAgIH1cbiAgICBnZXQocGFyYW1zLCBvZmZzZXQsIGxpbWl0KSB7XG4gICAgICAgIHJldHVybiBfX2F3YWl0ZXIodGhpcywgdm9pZCAwLCB2b2lkIDAsIGZ1bmN0aW9uKiAoKSB7XG4gICAgICAgICAgICByZXR1cm4geWllbGQgdGhpcy5fZ2V0KHsgcTogcGFyYW1zLCBvZmZzZXQsIGxpbWl0IH0pO1xuICAgICAgICB9KTtcbiAgICB9XG4gICAgY3JlYXRlKGRhdGEpIHtcbiAgICAgICAgcmV0dXJuIF9fYXdhaXRlcih0aGlzLCB2b2lkIDAsIHZvaWQgMCwgZnVuY3Rpb24qICgpIHtcbiAgICAgICAgICAgIHRoaXMucmVzID0geWllbGQgdGhpcy5fcG9zdChkYXRhKTtcbiAgICAgICAgICAgIHJldHVybiAodGhpcy5yZXMpO1xuICAgICAgICB9KTtcbiAgICB9XG4gICAgYWRkKG1hLCBzb0x1b25nLCB0b25nR2lhKSB7XG4gICAgICAgIHJldHVybiBfX2F3YWl0ZXIodGhpcywgdm9pZCAwLCB2b2lkIDAsIGZ1bmN0aW9uKiAoKSB7XG4gICAgICAgICAgICB0aGlzLnJlcyA9IHlpZWxkIHRoaXMuX3Bvc3Qoe1xuICAgICAgICAgICAgICAgIG1hLFxuICAgICAgICAgICAgICAgIHNvX2x1b25nOiBzb0x1b25nLFxuICAgICAgICAgICAgICAgIHRvbmdfZ2lhOiB0b25nR2lhLFxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5yZXM7XG4gICAgICAgIH0pO1xuICAgIH1cbiAgICB1cGRhdGUobWEsIGVkaXRJbmZvKSB7XG4gICAgICAgIHJldHVybiBfX2F3YWl0ZXIodGhpcywgdm9pZCAwLCB2b2lkIDAsIGZ1bmN0aW9uKiAoKSB7XG4gICAgICAgICAgICB0aGlzLnJlcyA9IHlpZWxkIHRoaXMuX3B1dCh7XG4gICAgICAgICAgICAgICAgbWEsIGVkaXRJbmZvLFxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5yZXM7XG4gICAgICAgIH0pO1xuICAgIH1cbn1cbmV4cG9ydHMuVGh1b2MgPSBUaHVvYztcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWluZGV4LmpzLm1hcCIsIlwidXNlIHN0cmljdFwiO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuY29uc3QgVGh1b2NfMSA9IHJlcXVpcmUoXCIuLi9Nb2RlbC9UaHVvY1wiKTtcbmNvbnN0IFZpZXdUYWJsZV8xID0gcmVxdWlyZShcIi4vVmlld1RhYmxlXCIpO1xuY29uc3QgTWVudUNvbnRleHRfMSA9IHJlcXVpcmUoXCIuLi9NZW51Q29udGV4dFwiKTtcbmNsYXNzIFRodW9jVGFibGUgZXh0ZW5kcyBWaWV3VGFibGVfMS5WaWV3VGFibGUge1xuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICBzdXBlcigpO1xuICAgICAgICB0aGlzLmVsZW1lbnQgPSAkKFwiPHRhYmxlLz5cIikuYWRkQ2xhc3MoXCJ0YWJsZSB0YWJsZS1zdHJpcGVkIHRhYmxlLXZpZXdcIik7XG4gICAgICAgIHRoaXMuZWxlbWVudC5odG1sKGBcbiAgICAgICAgPHRoZWFkPlxuICAgICAgICAgICAgPHRyPlxuICAgICAgICAgICAgICAgIDx0aD5NYSBUaHVvYzwvdGg+XG4gICAgICAgICAgICAgICAgPHRoPlRlbiBUaHVvYzwvdGg+XG4gICAgICAgICAgICA8L3RyPlxuICAgICAgICA8L3RoZWFkPlxuICAgICAgICA8dGJvZHk+PC90Ym9keT5cbiAgICAgICAgYCk7XG4gICAgICAgIHRoaXMubW9kZWwgPSBuZXcgVGh1b2NfMS5UaHVvYygpO1xuICAgIH1cbiAgICBvbkNvbnRleHRBZGQoZnVuYykge1xuICAgICAgICB0aGlzLmZ1bmNDdHhBZGQgPSBmdW5jO1xuICAgIH1cbiAgICBvbkNvbnRleHRFZGl0KGZ1bmMpIHtcbiAgICAgICAgdGhpcy5mdW5jQ3R4RWRpdCA9IGZ1bmM7XG4gICAgfVxuICAgIG9uQ29udGV4dEVkaXRQcmljZShmdW5jKSB7XG4gICAgICAgIHRoaXMuZnVuY0N0eEVkaXRQcmljZSA9IGZ1bmM7XG4gICAgfVxuICAgIGN1c3RvbUNyZWF0ZVJvdyhyb3cpIHtcbiAgICAgICAgY29uc3QgY29udGV4dG1lbnUgPSBuZXcgTWVudUNvbnRleHRfMS5NZW51Q29udGV4dChyb3cpO1xuICAgICAgICBjb250ZXh0bWVudS5hZGRDb250ZXh0KHtcbiAgICAgICAgICAgIHRpdGxlOiBcIm5o4bqtcCB0aMOqbSB0aHXhu5FjXCIsXG4gICAgICAgICAgICBjbGFzc05hbWU6IFwidGV4dC1zdWNjZXNzXCIsXG4gICAgICAgICAgICBpY29uOiBcImZhcyBmYS1wbHVzLWNpcmNsZVwiLFxuICAgICAgICAgICAgY2xpY2s6IChlKSA9PiB7XG4gICAgICAgICAgICAgICAgdGhpcy5mdW5jQ3R4QWRkKCk7XG4gICAgICAgICAgICB9LFxuICAgICAgICB9KS5hZGRDb250ZXh0KHtcbiAgICAgICAgICAgIHRpdGxlOiBcInPhu61hIHRow7RuZyB0aW5cIixcbiAgICAgICAgICAgIGNsYXNzTmFtZTogXCJ0ZXh0LXByaW1hcnlcIixcbiAgICAgICAgICAgIGljb246IFwiZmFzIGZhLXBlbi1zcXVhcmVcIixcbiAgICAgICAgICAgIGNsaWNrOiAoZSkgPT4ge1xuICAgICAgICAgICAgICAgIHRoaXMuZnVuY0N0eEVkaXQoKTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgIH0pLmFkZENvbnRleHQoe1xuICAgICAgICAgICAgdGl0bGU6IFwiY2jhu4luaCBnacOhXCIsXG4gICAgICAgICAgICBpY29uOiBcImZhIGZhLWRvbGxhci1zaWduXCIsXG4gICAgICAgICAgICBjbGljazogKGUpID0+IHtcbiAgICAgICAgICAgICAgICB0aGlzLmZ1bmNDdHhFZGl0UHJpY2UoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfVxufVxuZXhwb3J0cy5UaHVvY1RhYmxlID0gVGh1b2NUYWJsZTtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPVRodW9jVGFibGUuanMubWFwIiwiXCJ1c2Ugc3RyaWN0XCI7XG52YXIgX19hd2FpdGVyID0gKHRoaXMgJiYgdGhpcy5fX2F3YWl0ZXIpIHx8IGZ1bmN0aW9uICh0aGlzQXJnLCBfYXJndW1lbnRzLCBQLCBnZW5lcmF0b3IpIHtcbiAgICByZXR1cm4gbmV3IChQIHx8IChQID0gUHJvbWlzZSkpKGZ1bmN0aW9uIChyZXNvbHZlLCByZWplY3QpIHtcbiAgICAgICAgZnVuY3Rpb24gZnVsZmlsbGVkKHZhbHVlKSB7IHRyeSB7IHN0ZXAoZ2VuZXJhdG9yLm5leHQodmFsdWUpKTsgfSBjYXRjaCAoZSkgeyByZWplY3QoZSk7IH0gfVxuICAgICAgICBmdW5jdGlvbiByZWplY3RlZCh2YWx1ZSkgeyB0cnkgeyBzdGVwKGdlbmVyYXRvcltcInRocm93XCJdKHZhbHVlKSk7IH0gY2F0Y2ggKGUpIHsgcmVqZWN0KGUpOyB9IH1cbiAgICAgICAgZnVuY3Rpb24gc3RlcChyZXN1bHQpIHsgcmVzdWx0LmRvbmUgPyByZXNvbHZlKHJlc3VsdC52YWx1ZSkgOiBuZXcgUChmdW5jdGlvbiAocmVzb2x2ZSkgeyByZXNvbHZlKHJlc3VsdC52YWx1ZSk7IH0pLnRoZW4oZnVsZmlsbGVkLCByZWplY3RlZCk7IH1cbiAgICAgICAgc3RlcCgoZ2VuZXJhdG9yID0gZ2VuZXJhdG9yLmFwcGx5KHRoaXNBcmcsIF9hcmd1bWVudHMgfHwgW10pKS5uZXh0KCkpO1xuICAgIH0pO1xufTtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmNsYXNzIFZpZXdUYWJsZSB7XG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIC8vIGNvbnN0cnVjdFxuICAgICAgICB0aGlzLm9mZnNldCA9IDA7XG4gICAgICAgIHRoaXMubGltaXQgPSAxMDtcbiAgICB9XG4gICAgLyoqXG4gICAgICogZ2V0IGRhdGEgd2l0aCBzZWFyY2ggdmFsdWVcbiAgICAgKiBAcGFyYW0gc2VhcmNoIGZpZWxkPXZhbHVlXG4gICAgICovXG4gICAgdXBkYXRlKHNlYXJjaCkge1xuICAgICAgICByZXR1cm4gX19hd2FpdGVyKHRoaXMsIHZvaWQgMCwgdm9pZCAwLCBmdW5jdGlvbiogKCkge1xuICAgICAgICAgICAgLy8gcmVuZGVyIGRhdGEgdG8gZWxlbWVudFxuICAgICAgICAgICAgY29uc3QgcmF3RGF0YSA9IHlpZWxkIHRoaXMubW9kZWwuZ2V0KHNlYXJjaCwgdGhpcy5vZmZzZXQsIHRoaXMubGltaXQpO1xuICAgICAgICAgICAgdGhpcy5kYXRhID0gQXJyYXkuZnJvbShyYXdEYXRhKS5tYXAoKHZhbCkgPT4ge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmZpbHRlckRhdGFSb3codmFsKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgdGhpcy5zaXplT2ZSZWNvcmQgPSB0aGlzLmRhdGEubGVuZ3RoO1xuICAgICAgICAgICAgdGhpcy5jdXJyZW50UG9zID0gLTE7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5kYXRhO1xuICAgICAgICB9KTtcbiAgICB9XG4gICAgcmVuZGVyKHNlYXJjaCkge1xuICAgICAgICByZXR1cm4gX19hd2FpdGVyKHRoaXMsIHZvaWQgMCwgdm9pZCAwLCBmdW5jdGlvbiogKCkge1xuICAgICAgICAgICAgY29uc3QgZGF0YSA9IHlpZWxkIHRoaXMudXBkYXRlKHNlYXJjaCk7XG4gICAgICAgICAgICBjb25zdCB0Ym9keSA9IHRoaXMuX2NyZWF0ZVRhYmxlQm9keShkYXRhKTtcbiAgICAgICAgICAgIHRoaXMuZWxlbWVudC5maW5kKFwidGJvZHlcIikuaHRtbChcIlwiKS5hcHBlbmQodGJvZHkuY2hpbGRyZW4oKSk7XG4gICAgICAgIH0pO1xuICAgIH1cbiAgICBzZXRFbGVtZW50KGVsKSB7XG4gICAgICAgIHRoaXMuZWxlbWVudCA9IGVsO1xuICAgIH1cbiAgICBnZXRFbGVtZW50KCkge1xuICAgICAgICByZXR1cm4gdGhpcy5lbGVtZW50O1xuICAgIH1cbiAgICBjdXJyZW50RGF0YSgpIHtcbiAgICAgICAgaWYgKCF0aGlzLmN1cnJlbnRSb3dEYXRhKSB7XG4gICAgICAgICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBPYmplY3QuYXNzaWduKHt9LCB0aGlzLmN1cnJlbnRSb3dEYXRhKTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogYXR0YWNoIGV2ZW50IG9mIGNob29zZVxuICAgICAqIEBwYXJhbSBjYWxsYmFjayBjYWxsYmFjayBmdW5jdGlvbiB3aGVuIHRoZSByb3cgb2YgcmVjb3JkIGlzIGNob29zZWRcbiAgICAgKi9cbiAgICBvbkNob29zZShjYWxsYmFjaykge1xuICAgICAgICB0aGlzLmZ1bmNPbkNob29zZSA9IGNhbGxiYWNrO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBhdHRhY2ggZXZlbnQgb2YgaG92ZXJcbiAgICAgKiBAcGFyYW0gY2FsbGJhY2sgY2FsbGJhY2sgZnVuY3Rpb24gd2hlbiB0aGUgcm93IG9mIHJlY29yZCBpcyBob3ZlciBvblxuICAgICAqL1xuICAgIG9uRm9jdXMoY2FsbGJhY2spIHtcbiAgICAgICAgdGhpcy5mdW5jT25Gb2N1cyA9IGNhbGxiYWNrO1xuICAgIH1cbiAgICBzZWxlY3REb3duKCkge1xuICAgICAgICBpZiAodGhpcy5jdXJyZW50UG9zIDwgdGhpcy5zaXplT2ZSZWNvcmQgLSAxKSB7XG4gICAgICAgICAgICArK3RoaXMuY3VycmVudFBvcztcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmVsZW1lbnQuZmluZChgdHJbZGF0YS1wb3M9JHt0aGlzLmN1cnJlbnRQb3N9XWApLmZvY3VzKCk7XG4gICAgfVxuICAgIHNlbGVjdFVwKCkge1xuICAgICAgICBpZiAodGhpcy5jdXJyZW50UG9zID4gMCkge1xuICAgICAgICAgICAgLS10aGlzLmN1cnJlbnRQb3M7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5lbGVtZW50LmZpbmQoYHRyW2RhdGEtcG9zPSR7dGhpcy5jdXJyZW50UG9zfV1gKS5mb2N1cygpO1xuICAgIH1cbiAgICBuZXh0UGFnZShzZWFyY2ggPSBcIlwiKSB7XG4gICAgICAgIHRoaXMub2Zmc2V0ICs9IHRoaXMubGltaXQ7XG4gICAgICAgIHRoaXMucmVuZGVyKHNlYXJjaCk7XG4gICAgfVxuICAgIHNldExpbWl0UGVyUGFnZShsaW1pdCkge1xuICAgICAgICB0aGlzLmxpbWl0ID0gbGltaXQ7XG4gICAgfVxuICAgIHNldE9mZnNldChvZmZzZXQpIHtcbiAgICAgICAgdGhpcy5vZmZzZXQgPSBvZmZzZXQ7XG4gICAgfVxuICAgIGZpbHRlckRhdGFSb3coZGF0YVJvdykge1xuICAgICAgICAvLyBub3RoaW5nIGhlcmUsIGp1c3QgcmF3XG4gICAgICAgIHJldHVybiBkYXRhUm93O1xuICAgIH1cbiAgICBfY3JlYXRlUm93KGRhdGFSb3csIHBvcykge1xuICAgICAgICBjb25zdCByb3cgPSAkKFwiPHRyLz5cIikuYXR0cihcInRhYmluZGV4XCIsIC0xKS5hdHRyKFwiZGF0YS1wb3NcIiwgcG9zKTtcbiAgICAgICAgZm9yIChjb25zdCBmaWVsZCBvZiBPYmplY3Qua2V5cyhkYXRhUm93KSkge1xuICAgICAgICAgICAgY29uc3QgY2VsbCA9ICQoXCI8dGQvPlwiKS5hdHRyKFwibmFtZVwiLCBmaWVsZCkudGV4dChkYXRhUm93W2ZpZWxkXSk7XG4gICAgICAgICAgICByb3cuYXBwZW5kKGNlbGwpO1xuICAgICAgICB9XG4gICAgICAgIC8vIGNob29zZSBldmVudFxuICAgICAgICB0aGlzLl9yb3dPbkNob29zZShyb3csICgpID0+IHtcbiAgICAgICAgICAgIHRoaXMuZnVuY09uQ2hvb3NlKGRhdGFSb3cpO1xuICAgICAgICB9KTtcbiAgICAgICAgLy8gaG92ZXIgZXZlbnRcbiAgICAgICAgcm93Lm9uKFwiY2xpY2sgZm9jdXNcIiwgKGUpID0+IHtcbiAgICAgICAgICAgIHRoaXMuZWxlbWVudC5maW5kKFwidHJcIikucmVtb3ZlQ2xhc3MoXCJhY3RpdmVcIik7XG4gICAgICAgICAgICByb3cuYWRkQ2xhc3MoXCJhY3RpdmVcIik7XG4gICAgICAgICAgICB0aGlzLmN1cnJlbnRQb3MgPSBwb3M7XG4gICAgICAgICAgICB0aGlzLmN1cnJlbnRSb3dEYXRhID0gZGF0YVJvdztcbiAgICAgICAgICAgIHRoaXMuZnVuY09uRm9jdXMoZGF0YVJvdyk7XG4gICAgICAgIH0pO1xuICAgICAgICB0aGlzLmN1c3RvbUNyZWF0ZVJvdyhyb3cpO1xuICAgICAgICByZXR1cm4gcm93O1xuICAgIH1cbiAgICBfY3JlYXRlVGFibGVCb2R5KGRhdGEpIHtcbiAgICAgICAgY29uc3QgdGJvZHkgPSAkKFwiPHRib2R5Lz5cIik7XG4gICAgICAgIGxldCBwb3MgPSAwO1xuICAgICAgICBmb3IgKGNvbnN0IHJvd0RhdGEgb2YgZGF0YSkge1xuICAgICAgICAgICAgY29uc3QgdHJvdyA9IHRoaXMuX2NyZWF0ZVJvdyhyb3dEYXRhLCBwb3MrKyk7XG4gICAgICAgICAgICB0Ym9keS5hcHBlbmQodHJvdyk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRib2R5O1xuICAgIH1cbiAgICBjdXN0b21DcmVhdGVSb3cocm93KSB7XG4gICAgICAgIC8vIG5vdGhpbmcgaGVyZSwgd2lsbCBjaGFuZ2UgaW4gaW5oZXJpdGFuY2VcbiAgICB9XG4gICAgX3Jvd09uQ2hvb3NlKHJvdywgY2FsbGJhY2spIHtcbiAgICAgICAgcm93Lm9uKFwia2V5ZG93blwiLCAoZSkgPT4ge1xuICAgICAgICAgICAgaWYgKGUua2V5Q29kZSA9PT0gMTMpIHtcbiAgICAgICAgICAgICAgICBjYWxsYmFjaygpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgcm93Lm9uKFwiZGJsY2xpY2tcIiwgKCkgPT4ge1xuICAgICAgICAgICAgY2FsbGJhY2soKTtcbiAgICAgICAgfSk7XG4gICAgfVxufVxuZXhwb3J0cy5WaWV3VGFibGUgPSBWaWV3VGFibGU7XG4vLyMgc291cmNlTWFwcGluZ1VSTD1WaWV3VGFibGUuanMubWFwIiwiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5mdW5jdGlvbiBnZXRGb3JtVmFsdWUoZm9ybSkge1xuICAgIGNvbnN0IGFyciA9IGZvcm0uc2VyaWFsaXplQXJyYXkoKTtcbiAgICBjb25zdCB2YWwgPSB7fTtcbiAgICBmb3IgKGNvbnN0IGlucHV0IG9mIGFycikge1xuICAgICAgICB2YWxbaW5wdXQubmFtZV0gPSBpbnB1dC52YWx1ZTtcbiAgICB9XG4gICAgcmV0dXJuIHZhbDtcbn1cbmV4cG9ydHMuZ2V0Rm9ybVZhbHVlID0gZ2V0Rm9ybVZhbHVlO1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9Zm9ybVZhbC5qcy5tYXAiLCJcInVzZSBzdHJpY3RcIjtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmNvbnN0IEF1dG9Db21wbGV0ZV8xID0gcmVxdWlyZShcIi4uL0F1dG9Db21wbGV0ZVwiKTtcbmZ1bmN0aW9uIGluaXQoYXBwKSB7XG4gICAgaGFuZGxlVGVuVGh1b2NJbnB1dChhcHApO1xuICAgIGhhbmRsZURvblZpU2VsZWN0SW5wdXQoYXBwKTtcbn1cbmV4cG9ydHMuYWRkVGh1b2NIYW5kbGUgPSBpbml0O1xuZnVuY3Rpb24gaGFuZGxlVGVuVGh1b2NJbnB1dChhcHApIHtcbiAgICBjb25zdCBhdXRvY29tcGxldGUgPSBuZXcgQXV0b0NvbXBsZXRlXzEuQXV0b0NvbXBsZXRlKFwibmhhcF9ob2FfZG9uLS10ZW5fdGh1b2NcIiwgYXBwLnRodW9jKTtcbiAgICBhdXRvY29tcGxldGUuc2V0TG9va3VwKFtcIm1hXCIsIFwidGVuXCIsIFwibmNjXCIsIFwiZG9uX3ZpXCIsIFwiZG9uX2dpYVwiXSk7XG4gICAgYXV0b2NvbXBsZXRlLmxpc3RlbigpO1xuICAgIGF1dG9jb21wbGV0ZS5vbkNob29zZSgoZGF0YSkgPT4ge1xuICAgICAgICAkKFwiI25oYXBfaG9hX2Rvbi0tbWFfdGh1b2NcIikudmFsKGRhdGEubWEpO1xuICAgICAgICAkKFwiI25oYXBfaG9hX2Rvbi0tdGVuX3RodW9jXCIpLnZhbChkYXRhLnRlbik7XG4gICAgICAgICQoXCIjbmhhcF9ob2FfZG9uLS1uY2NcIikudmFsKGRhdGEubmNjKTtcbiAgICAgICAgJChcIiNuaGFwX2hvYV9kb24tLWdpYVwiKS52YWwoZGF0YS5kb25fZ2lhKTtcbiAgICAgICAgJChcIiNuaGFwX2hvYV9kb24tLWRvbl92aVwiKS52YWwoZGF0YS5kb25fdmkpO1xuICAgIH0pO1xufVxuZnVuY3Rpb24gaGFuZGxlRG9uVmlTZWxlY3RJbnB1dChhcHApIHtcbiAgICBhcHAuZG9uVmkucmVuZGVyU2VsZWN0SW5wdXQoJChcIiNuaGFwX2hvYV9kb24tLWRvbl92aVwiKSk7XG59XG4vLyMgc291cmNlTWFwcGluZ1VSTD1hZGRUaHVvY0hhbmRsZS5qcy5tYXAiLCJcInVzZSBzdHJpY3RcIjtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmNvbnN0IGFkZFRodW9jSGFuZGxlXzEgPSByZXF1aXJlKFwiLi9hZGRUaHVvY0hhbmRsZVwiKTtcbmZ1bmN0aW9uIGluaXQoYXBwKSB7XG4gICAgYWRkVGh1b2NIYW5kbGVfMS5hZGRUaHVvY0hhbmRsZShhcHApO1xufVxuZXhwb3J0cy5pbml0ID0gaW5pdDtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWluZGV4LmpzLm1hcCIsIlwidXNlIHN0cmljdFwiO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuY29uc3QgVGh1b2NUYWJsZV8xID0gcmVxdWlyZShcIi4uL1ZpZXcvVGh1b2NUYWJsZVwiKTtcbmNvbnN0IHRodW9jX21vZGFsXzEgPSByZXF1aXJlKFwiLi90aHVvYy1tb2RhbFwiKTtcbmNvbnN0IFBBR0VfSUQgPSBcInBhZ2UtbmhhcC10aHVvY1wiO1xuY2xhc3MgSW5pdCB7XG4gICAgY29uc3RydWN0b3IoYXBwKSB7XG4gICAgICAgIGNvbnN0IHRodW9jVGFibGUgPSBuZXcgVGh1b2NUYWJsZV8xLlRodW9jVGFibGUoKTtcbiAgICAgICAgdGhpcy50aHVvY1RhYmxlID0gdGh1b2NUYWJsZTtcbiAgICAgICAgdGhpcy5hcHAgPSBhcHA7XG4gICAgICAgIHRodW9jVGFibGUuc2V0RWxlbWVudCgkKFwiI25oYXBfdGh1b2MtLXRhYmxlXCIpKTtcbiAgICAgICAgdGh1b2NUYWJsZS5zZXRMaW1pdFBlclBhZ2UoMTAwKTtcbiAgICAgICAgdGh1b2NUYWJsZS5vbkNob29zZSgoZGF0YSkgPT4ge1xuICAgICAgICAgICAgdGhpcy5hZGRUaHVvYyhkYXRhKTtcbiAgICAgICAgfSk7XG4gICAgICAgIHRodW9jVGFibGUub25Gb2N1cygoZGF0YSkgPT4ge1xuICAgICAgICAgICAgJChcIi50aHVvYy0tYnV0dG9uXCIpLnJlbW92ZUF0dHIoXCJkaXNhYmxlZFwiKTtcbiAgICAgICAgfSk7XG4gICAgICAgIHRodW9jVGFibGUub25Db250ZXh0QWRkKCgpID0+IHtcbiAgICAgICAgICAgIHRoaXMuYWRkVGh1b2ModGh1b2NUYWJsZS5jdXJyZW50RGF0YSgpKTtcbiAgICAgICAgfSk7XG4gICAgICAgIHRodW9jVGFibGUub25Db250ZXh0RWRpdCgoKSA9PiB7XG4gICAgICAgICAgICB0aGlzLmVkaXRUaHVvYyh0aHVvY1RhYmxlLmN1cnJlbnREYXRhKCkpO1xuICAgICAgICB9KTtcbiAgICAgICAgdGh1b2NUYWJsZS5vbkNvbnRleHRFZGl0UHJpY2UoKCkgPT4ge1xuICAgICAgICAgICAgdGhpcy5lZGl0UHJpY2VUaHVvYyh0aHVvY1RhYmxlLmN1cnJlbnREYXRhKCkpO1xuICAgICAgICB9KTtcbiAgICAgICAgdGh1b2NUYWJsZS5yZW5kZXIoXCJcIik7XG4gICAgICAgIHRoaXMuaGFuZGxlQ29udHJvbEtleShhcHApO1xuICAgICAgICB0aGlzLmhhbmRsZVNlbGVjdEtleShhcHApO1xuICAgICAgICB0aGlzLmhhbmRsZU1vZGFsRXZlbnQoKTtcbiAgICAgICAgdGhpcy5oYW5kbGVTZWFyY2hJbnB1dCgpO1xuICAgICAgICBjb25zdCAkdGhpcyA9IHRoaXM7XG4gICAgICAgICQoXCIudGh1b2MtLWJ1dHRvblwiKS5vbihcImNsaWNrXCIsIGZ1bmN0aW9uIEJ1dHRvbkNsaWNrKCkge1xuICAgICAgICAgICAgY29uc3Qgcm9sZSA9ICQodGhpcykuYXR0cihcImFwcC1yb2xlXCIpO1xuICAgICAgICAgICAgc3dpdGNoIChyb2xlKSB7XG4gICAgICAgICAgICAgICAgY2FzZSBcIm5ld1wiOlxuICAgICAgICAgICAgICAgICAgICAkdGhpcy5uZXdUaHVvYygpO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBjYXNlIFwiZWRpdFwiOlxuICAgICAgICAgICAgICAgICAgICAkdGhpcy5lZGl0VGh1b2ModGh1b2NUYWJsZS5jdXJyZW50RGF0YSgpKTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgY2FzZSBcImFkZFwiOlxuICAgICAgICAgICAgICAgICAgICAkdGhpcy5hZGRUaHVvYyh0aHVvY1RhYmxlLmN1cnJlbnREYXRhKCkpO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBjYXNlIFwiY2hpbmgtZ2lhXCI6XG4gICAgICAgICAgICAgICAgICAgICR0aGlzLmVkaXRQcmljZVRodW9jKHRodW9jVGFibGUuY3VycmVudERhdGEoKSk7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9XG4gICAgaGFuZGxlU2VsZWN0S2V5KGFwcCkge1xuICAgICAgICBhcHAub25TaG9ydGN1dEtleShcIkFycm93VXBcIiwgUEFHRV9JRCwgKGUpID0+IHtcbiAgICAgICAgICAgIHRoaXMudGh1b2NUYWJsZS5zZWxlY3RVcCgpO1xuICAgICAgICB9KTtcbiAgICAgICAgYXBwLm9uU2hvcnRjdXRLZXkoXCJBcnJvd0Rvd25cIiwgUEFHRV9JRCwgKGUpID0+IHtcbiAgICAgICAgICAgIHRoaXMudGh1b2NUYWJsZS5zZWxlY3REb3duKCk7XG4gICAgICAgIH0pO1xuICAgIH1cbiAgICBoYW5kbGVDb250cm9sS2V5KGFwcCkge1xuICAgICAgICBhcHAub25TaG9ydGN1dEtleShcImN0cmwrZFwiLCBQQUdFX0lELCAoZSkgPT4ge1xuICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgdGhpcy5uZXdUaHVvYygpO1xuICAgICAgICB9KTtcbiAgICAgICAgYXBwLm9uU2hvcnRjdXRLZXkoXCJjdHJsK2VcIiwgUEFHRV9JRCwgKGUpID0+IHtcbiAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgIHRoaXMuZWRpdFRodW9jKHRoaXMudGh1b2NUYWJsZS5jdXJyZW50RGF0YSgpKTtcbiAgICAgICAgfSk7XG4gICAgICAgIGFwcC5vblNob3J0Y3V0S2V5KFwiY3RybCtnXCIsIFBBR0VfSUQsIChlKSA9PiB7XG4gICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICB0aGlzLmVkaXRQcmljZVRodW9jKHRoaXMudGh1b2NUYWJsZS5jdXJyZW50RGF0YSgpKTtcbiAgICAgICAgfSk7XG4gICAgICAgIGFwcC5vblNob3J0Y3V0S2V5KFwiY3RybCtmXCIsIFBBR0VfSUQsIChlKSA9PiB7XG4gICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICAkKFwiI3RodW9jLS1zZWFyY2hcIikuZm9jdXMoKTtcbiAgICAgICAgfSk7XG4gICAgfVxuICAgIGhhbmRsZVNlYXJjaElucHV0KCkge1xuICAgICAgICBjb25zdCAkdGhpcyA9IHRoaXM7XG4gICAgICAgICQoXCIjdGh1b2MtLXNlYXJjaFwiKS5vbihcImtleXVwXCIsIGZ1bmN0aW9uIFNlYXJjaGluZygpIHtcbiAgICAgICAgICAgIGNvbnN0IHZhbCA9ICQodGhpcykudmFsKCk7XG4gICAgICAgICAgICAkdGhpcy50aHVvY1RhYmxlLnJlbmRlcih2YWwpO1xuICAgICAgICB9KTtcbiAgICB9XG4gICAgaGFuZGxlTW9kYWxFdmVudCgpIHtcbiAgICAgICAgdGhpcy5hZGRNb2RhbCA9IG5ldyB0aHVvY19tb2RhbF8xLkFkZFRodW9jTW9kYWwoXCJ0aHVvYy0tYWRkLW1vZGFsXCIsIHRoaXMuYXBwKTtcbiAgICAgICAgdGhpcy5uZXdNb2RhbCA9IG5ldyB0aHVvY19tb2RhbF8xLk5ld1RodW9jTW9kYWwoXCJ0aHVvYy0tbmV3LW1vZGFsXCIsIHRoaXMuYXBwKTtcbiAgICAgICAgdGhpcy5lZGl0TW9kYWwgPSBuZXcgdGh1b2NfbW9kYWxfMS5FZGl0VGh1b2NNb2RhbChcInRodW9jLS1lZGl0LW1vZGFsXCIsIHRoaXMuYXBwKTtcbiAgICAgICAgdGhpcy5lZGl0UHJpY2VNb2RhbCA9IG5ldyB0aHVvY19tb2RhbF8xLkVkaXRQcmljZVRodW9jTW9kYWwoXCJ0aHVvYy0tZWRpdC1wcmljZS1tb2RhbFwiLCB0aGlzLmFwcCk7XG4gICAgfVxuICAgIGVkaXRUaHVvYyhkYXRhKSB7XG4gICAgICAgIGlmICghZGF0YSkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuZWRpdE1vZGFsLnNob3coZGF0YSk7XG4gICAgfVxuICAgIG5ld1RodW9jKCkge1xuICAgICAgICAkKFwiI3RodW9jLS1uZXctbW9kYWxcIikubW9kYWwoXCJzaG93XCIpO1xuICAgIH1cbiAgICBhZGRUaHVvYyhkYXRhKSB7XG4gICAgICAgIGlmICghZGF0YSkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgICQoXCIjdGh1b2MtLWFkZC1tb2RhbFwiKS5tb2RhbChcInNob3dcIik7XG4gICAgICAgICQoXCIjdGh1b2MtLWFkZC1tYXRodW9jXCIpLnZhbChkYXRhLm1hKTtcbiAgICAgICAgJChcIiN0aHVvYy0tYWRkLXRlbnRodW9jXCIpLnZhbChkYXRhLnRlbik7XG4gICAgICAgICQoXCIjdGh1b2MtLWFkZC1uY2NcIikudmFsKGRhdGEudGVuX25jYyk7XG4gICAgICAgICQoXCIjdGh1b2MtLWFkZC1zb2x1b25nXCIpLnZhbChkYXRhLnNvX2x1b25nKTtcbiAgICB9XG4gICAgZWRpdFByaWNlVGh1b2MoZGF0YSkge1xuICAgICAgICBpZiAoIWRhdGEpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICAkKFwiI3RodW9jLS1lZGl0LXByaWNlLW1vZGFsXCIpLm1vZGFsKFwic2hvd1wiKTtcbiAgICAgICAgJChcIiN0aHVvYy0tZWRpdC1wcmljZS1tYXRodW9jXCIpLnZhbChkYXRhLm1hKTtcbiAgICAgICAgJChcIiN0aHVvYy0tZWRpdC1wcmljZS10ZW50aHVvY1wiKS52YWwoZGF0YS50ZW4pO1xuICAgIH1cbn1cbmZ1bmN0aW9uIGluaXQoYXBwKSB7XG4gICAgcmV0dXJuIG5ldyBJbml0KGFwcCk7XG59XG5leHBvcnRzLmluaXQgPSBpbml0O1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9aW5kZXguanMubWFwIiwiXCJ1c2Ugc3RyaWN0XCI7XG52YXIgX19hd2FpdGVyID0gKHRoaXMgJiYgdGhpcy5fX2F3YWl0ZXIpIHx8IGZ1bmN0aW9uICh0aGlzQXJnLCBfYXJndW1lbnRzLCBQLCBnZW5lcmF0b3IpIHtcbiAgICByZXR1cm4gbmV3IChQIHx8IChQID0gUHJvbWlzZSkpKGZ1bmN0aW9uIChyZXNvbHZlLCByZWplY3QpIHtcbiAgICAgICAgZnVuY3Rpb24gZnVsZmlsbGVkKHZhbHVlKSB7IHRyeSB7IHN0ZXAoZ2VuZXJhdG9yLm5leHQodmFsdWUpKTsgfSBjYXRjaCAoZSkgeyByZWplY3QoZSk7IH0gfVxuICAgICAgICBmdW5jdGlvbiByZWplY3RlZCh2YWx1ZSkgeyB0cnkgeyBzdGVwKGdlbmVyYXRvcltcInRocm93XCJdKHZhbHVlKSk7IH0gY2F0Y2ggKGUpIHsgcmVqZWN0KGUpOyB9IH1cbiAgICAgICAgZnVuY3Rpb24gc3RlcChyZXN1bHQpIHsgcmVzdWx0LmRvbmUgPyByZXNvbHZlKHJlc3VsdC52YWx1ZSkgOiBuZXcgUChmdW5jdGlvbiAocmVzb2x2ZSkgeyByZXNvbHZlKHJlc3VsdC52YWx1ZSk7IH0pLnRoZW4oZnVsZmlsbGVkLCByZWplY3RlZCk7IH1cbiAgICAgICAgc3RlcCgoZ2VuZXJhdG9yID0gZ2VuZXJhdG9yLmFwcGx5KHRoaXNBcmcsIF9hcmd1bWVudHMgfHwgW10pKS5uZXh0KCkpO1xuICAgIH0pO1xufTtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmNsYXNzIEFkZFRodW9jTW9kYWwge1xuICAgIGNvbnN0cnVjdG9yKGlkLCBhcHApIHtcbiAgICAgICAgdGhpcy5hcHAgPSBhcHA7XG4gICAgICAgIHRoaXMucG9wdXAgPSAkKFwiI1wiICsgaWQpO1xuICAgICAgICB0aGlzLnBvcHVwLmxvYWQoXCIvbGF5b3V0cy9tb2RhbC1hZGQtdGh1b2MuaHRtbFwiLCAoKSA9PiB7XG4gICAgICAgICAgICB0aGlzLnBvcHVwLmZpbmQoXCJmb3JtXCIpLm9uKFwic3VibWl0XCIsIChlKSA9PiB7XG4gICAgICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgICAgIHRoaXMuZm9ybVN1Ym1pdEhhbmRsZShlKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICB9XG4gICAgZm9ybVN1Ym1pdEhhbmRsZShlKSB7XG4gICAgICAgIHJldHVybiBfX2F3YWl0ZXIodGhpcywgdm9pZCAwLCB2b2lkIDAsIGZ1bmN0aW9uKiAoKSB7XG4gICAgICAgICAgICBjb25zdCBmb3JtID0gJChlLnRhcmdldCk7XG4gICAgICAgICAgICBjb25zdCBkYXRhID0ge1xuICAgICAgICAgICAgICAgIG1hOiBmb3JtLmZpbmQoXCJbbmFtZT1tYV1cIikudmFsKCksXG4gICAgICAgICAgICAgICAgc29fbHVvbmc6ICtmb3JtLmZpbmQoXCJbbmFtZT0nc29fbHVvbmcnXVwiKS52YWwoKSxcbiAgICAgICAgICAgICAgICB0b25nX2dpYTogK2Zvcm0uZmluZChcIltuYW1lPSd0b25nX2dpYSddXCIpLnZhbCgpLFxuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgY29uc3QgcmVzID0geWllbGQgdGhpcy5hcHAudGh1b2MuYWRkKGRhdGEubWEsIGRhdGEuc29fbHVvbmcsIGRhdGEudG9uZ19naWEpO1xuICAgICAgICAgICAgICAgIGFsZXJ0KFwic3VjY2VzczogXCIgKyByZXMubWEgKyBcIj0+XCIgKyByZXMuc29fbHVvbmdfbW9pKTtcbiAgICAgICAgICAgICAgICB3aW5kb3cubG9jYXRpb24ucmVsb2FkKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjYXRjaCAoZSkge1xuICAgICAgICAgICAgICAgIGFsZXJ0KFwiRXJyb3I6IFwiICsgZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH1cbiAgICBzaG93KCkge1xuICAgICAgICB0aGlzLnBvcHVwLm1vZGFsKFwic2hvd1wiKTtcbiAgICB9XG4gICAgaGlkZSgpIHtcbiAgICAgICAgdGhpcy5wb3B1cC5tb2RhbChcImhpZGVcIik7XG4gICAgfVxufVxuZXhwb3J0cy5BZGRUaHVvY01vZGFsID0gQWRkVGh1b2NNb2RhbDtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPXRodW9jLWFkZC1tb2RhbC5qcy5tYXAiLCJcInVzZSBzdHJpY3RcIjtcbnZhciBfX2F3YWl0ZXIgPSAodGhpcyAmJiB0aGlzLl9fYXdhaXRlcikgfHwgZnVuY3Rpb24gKHRoaXNBcmcsIF9hcmd1bWVudHMsIFAsIGdlbmVyYXRvcikge1xuICAgIHJldHVybiBuZXcgKFAgfHwgKFAgPSBQcm9taXNlKSkoZnVuY3Rpb24gKHJlc29sdmUsIHJlamVjdCkge1xuICAgICAgICBmdW5jdGlvbiBmdWxmaWxsZWQodmFsdWUpIHsgdHJ5IHsgc3RlcChnZW5lcmF0b3IubmV4dCh2YWx1ZSkpOyB9IGNhdGNoIChlKSB7IHJlamVjdChlKTsgfSB9XG4gICAgICAgIGZ1bmN0aW9uIHJlamVjdGVkKHZhbHVlKSB7IHRyeSB7IHN0ZXAoZ2VuZXJhdG9yW1widGhyb3dcIl0odmFsdWUpKTsgfSBjYXRjaCAoZSkgeyByZWplY3QoZSk7IH0gfVxuICAgICAgICBmdW5jdGlvbiBzdGVwKHJlc3VsdCkgeyByZXN1bHQuZG9uZSA/IHJlc29sdmUocmVzdWx0LnZhbHVlKSA6IG5ldyBQKGZ1bmN0aW9uIChyZXNvbHZlKSB7IHJlc29sdmUocmVzdWx0LnZhbHVlKTsgfSkudGhlbihmdWxmaWxsZWQsIHJlamVjdGVkKTsgfVxuICAgICAgICBzdGVwKChnZW5lcmF0b3IgPSBnZW5lcmF0b3IuYXBwbHkodGhpc0FyZywgX2FyZ3VtZW50cyB8fCBbXSkpLm5leHQoKSk7XG4gICAgfSk7XG59O1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuY29uc3QgZm9ybVZhbF8xID0gcmVxdWlyZShcIi4uL2Zvcm1WYWxcIik7XG5jb25zdCBBdXRvQ29tcGxldGVfMSA9IHJlcXVpcmUoXCIuLi9BdXRvQ29tcGxldGVcIik7XG5jbGFzcyBFZGl0VGh1b2NNb2RhbCB7XG4gICAgY29uc3RydWN0b3IoaWQsIGFwcCkge1xuICAgICAgICB0aGlzLmFwcCA9IGFwcDtcbiAgICAgICAgdGhpcy5wb3B1cCA9ICQoXCIjXCIgKyBpZCk7XG4gICAgICAgIHRoaXMucG9wdXAubG9hZChcIi9sYXlvdXRzL21vZGFsLWVkaXQtdGh1b2MuaHRtbFwiLCAoKSA9PiB7XG4gICAgICAgICAgICB0aGlzLnBvcHVwLmZpbmQoXCJmb3JtXCIpLm9uKFwic3VibWl0XCIsIChlKSA9PiB7XG4gICAgICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgICAgIHRoaXMuZm9ybVN1Ym1pdEhhbmRsZShlKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgdGhpcy5oYW5kbGVOY2NJbnB1dCh0aGlzLnBvcHVwLmZpbmQoXCJbbmFtZT1uY2NdXCIpKTtcbiAgICAgICAgICAgIHRoaXMuaGFuZGxlRG9uVmlTZWxlY3QodGhpcy5wb3B1cC5maW5kKFwiW25hbWU9aWRfZG9uX3ZpXVwiKSk7XG4gICAgICAgIH0pO1xuICAgIH1cbiAgICBmb3JtU3VibWl0SGFuZGxlKGUpIHtcbiAgICAgICAgcmV0dXJuIF9fYXdhaXRlcih0aGlzLCB2b2lkIDAsIHZvaWQgMCwgZnVuY3Rpb24qICgpIHtcbiAgICAgICAgICAgIGNvbnN0IGZvcm0gPSAkKGUudGFyZ2V0KTtcbiAgICAgICAgICAgIGNvbnN0IGRhdGEgPSBmb3JtVmFsXzEuZ2V0Rm9ybVZhbHVlKGZvcm0pO1xuICAgICAgICAgICAgLy8gdHJ1b25nIGhvcCB0aGF5IGRvaSBtYV90aHVvYywgY2FuIDEgbWFfdGh1b2MgdHJ1b2MgZGUgdXBkYXRlXG4gICAgICAgICAgICBjb25zdCBtYVRodW9jRGVVcGRhdGUgPSBmb3JtLmF0dHIoXCJpZF92YWx1ZVwiKTtcbiAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgY29uc3QgcmVzID0geWllbGQgdGhpcy5hcHAudGh1b2MudXBkYXRlKG1hVGh1b2NEZVVwZGF0ZSwgZGF0YSk7XG4gICAgICAgICAgICAgICAgYWxlcnQoXCJTdWNjZXNzOiBcIiArIHJlcyArIFwiIHJlY29yZChzKVwiKTtcbiAgICAgICAgICAgICAgICB3aW5kb3cubG9jYXRpb24ucmVsb2FkKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjYXRjaCAoZSkge1xuICAgICAgICAgICAgICAgIGFsZXJ0KFwiRXJyb3I6IFwiICsgZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH1cbiAgICBoYW5kbGVOY2NJbnB1dCh0YXJnZXQpIHtcbiAgICAgICAgY29uc3QgYXV0b2NvbXBsZXRlID0gbmV3IEF1dG9Db21wbGV0ZV8xLkF1dG9Db21wbGV0ZSh0YXJnZXQsIHRoaXMuYXBwLm5jYyk7XG4gICAgICAgIGF1dG9jb21wbGV0ZS5zZXRMb29rdXAoW1widGVuXCJdKTtcbiAgICAgICAgYXV0b2NvbXBsZXRlLm9uQ2hvb3NlKChkYXRhKSA9PiB7XG4gICAgICAgICAgICB0YXJnZXQudmFsKGRhdGEudGVuKTtcbiAgICAgICAgfSk7XG4gICAgICAgIGF1dG9jb21wbGV0ZS5saXN0ZW4oKTtcbiAgICB9XG4gICAgaGFuZGxlRG9uVmlTZWxlY3QodGFyZ2V0KSB7XG4gICAgICAgIHRhcmdldC5odG1sKFwiXCIpO1xuICAgICAgICB0aGlzLmFwcC5kb25WaS5yZW5kZXJTZWxlY3RJbnB1dCh0YXJnZXQpO1xuICAgIH1cbiAgICBzaG93KGRhdGEpIHtcbiAgICAgICAgdGhpcy5wb3B1cC5maW5kKFwiZm9ybVwiKS5hdHRyKFwiaWRfdmFsdWVcIiwgZGF0YS5tYSk7XG4gICAgICAgIHRoaXMucG9wdXAuZmluZChcIltuYW1lPW1hXVwiKS52YWwoZGF0YS5tYSk7XG4gICAgICAgIHRoaXMucG9wdXAuZmluZChcIltuYW1lPXRlbl1cIikudmFsKGRhdGEudGVuKTtcbiAgICAgICAgdGhpcy5wb3B1cC5maW5kKFwiW25hbWU9bmNjXVwiKS52YWwoZGF0YS50ZW5fbmNjKTtcbiAgICAgICAgdGhpcy5wb3B1cC5tb2RhbChcInNob3dcIik7XG4gICAgfVxuICAgIGhpZGUoKSB7XG4gICAgICAgIHRoaXMucG9wdXAubW9kYWwoXCJoaWRlXCIpO1xuICAgIH1cbn1cbmV4cG9ydHMuRWRpdFRodW9jTW9kYWwgPSBFZGl0VGh1b2NNb2RhbDtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPXRodW9jLWVkaXQtbW9kYWwuanMubWFwIiwiXCJ1c2Ugc3RyaWN0XCI7XG52YXIgX19hd2FpdGVyID0gKHRoaXMgJiYgdGhpcy5fX2F3YWl0ZXIpIHx8IGZ1bmN0aW9uICh0aGlzQXJnLCBfYXJndW1lbnRzLCBQLCBnZW5lcmF0b3IpIHtcbiAgICByZXR1cm4gbmV3IChQIHx8IChQID0gUHJvbWlzZSkpKGZ1bmN0aW9uIChyZXNvbHZlLCByZWplY3QpIHtcbiAgICAgICAgZnVuY3Rpb24gZnVsZmlsbGVkKHZhbHVlKSB7IHRyeSB7IHN0ZXAoZ2VuZXJhdG9yLm5leHQodmFsdWUpKTsgfSBjYXRjaCAoZSkgeyByZWplY3QoZSk7IH0gfVxuICAgICAgICBmdW5jdGlvbiByZWplY3RlZCh2YWx1ZSkgeyB0cnkgeyBzdGVwKGdlbmVyYXRvcltcInRocm93XCJdKHZhbHVlKSk7IH0gY2F0Y2ggKGUpIHsgcmVqZWN0KGUpOyB9IH1cbiAgICAgICAgZnVuY3Rpb24gc3RlcChyZXN1bHQpIHsgcmVzdWx0LmRvbmUgPyByZXNvbHZlKHJlc3VsdC52YWx1ZSkgOiBuZXcgUChmdW5jdGlvbiAocmVzb2x2ZSkgeyByZXNvbHZlKHJlc3VsdC52YWx1ZSk7IH0pLnRoZW4oZnVsZmlsbGVkLCByZWplY3RlZCk7IH1cbiAgICAgICAgc3RlcCgoZ2VuZXJhdG9yID0gZ2VuZXJhdG9yLmFwcGx5KHRoaXNBcmcsIF9hcmd1bWVudHMgfHwgW10pKS5uZXh0KCkpO1xuICAgIH0pO1xufTtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmNsYXNzIEVkaXRQcmljZVRodW9jTW9kYWwge1xuICAgIGNvbnN0cnVjdG9yKGlkLCBhcHApIHtcbiAgICAgICAgdGhpcy5hcHAgPSBhcHA7XG4gICAgICAgIHRoaXMucG9wdXAgPSAkKFwiI1wiICsgaWQpO1xuICAgICAgICB0aGlzLnBvcHVwLmxvYWQoXCIvbGF5b3V0cy9tb2RhbC1lZGl0LXByaWNlLXRodW9jLmh0bWxcIiwgKCkgPT4ge1xuICAgICAgICAgICAgLy9cbiAgICAgICAgICAgIHRoaXMucG9wdXAuZmluZChcImZvcm1cIikub24oXCJzdWJtaXRcIiwgKGUpID0+IHtcbiAgICAgICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICAgICAgdGhpcy5mb3JtU3VibWl0SGFuZGxlKGUpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgIH1cbiAgICBmb3JtU3VibWl0SGFuZGxlKGUpIHtcbiAgICAgICAgcmV0dXJuIF9fYXdhaXRlcih0aGlzLCB2b2lkIDAsIHZvaWQgMCwgZnVuY3Rpb24qICgpIHtcbiAgICAgICAgICAgIGNvbnN0IGZvcm0gPSAkKGUudGFyZ2V0KTtcbiAgICAgICAgICAgIGNvbnN0IG1hID0gXCJcIiArIGZvcm0uZmluZChcIltuYW1lPW1hX3RodW9jXVwiKS52YWwoKTtcbiAgICAgICAgICAgIGNvbnN0IHByaWNlID0gK2Zvcm0uZmluZChcIltuYW1lPXByaWNlXVwiKS52YWwoKTtcbiAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgY29uc3QgcmVzID0geWllbGQgdGhpcy5hcHAuYmFuZ0dpYS5hZGQobWEsIHByaWNlKTtcbiAgICAgICAgICAgICAgICBhbGVydChcIlN1Y2Nlc3NcIik7XG4gICAgICAgICAgICAgICAgd2luZG93LmxvY2F0aW9uLnJlbG9hZCgpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY2F0Y2ggKGVycikge1xuICAgICAgICAgICAgICAgIGFsZXJ0KFwiXCIgKyBlcnIpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9XG4gICAgc2hvdygpIHtcbiAgICAgICAgdGhpcy5wb3B1cC5tb2RhbChcInNob3dcIik7XG4gICAgfVxuICAgIGhpZGUoKSB7XG4gICAgICAgIHRoaXMucG9wdXAubW9kYWwoXCJoaWRlXCIpO1xuICAgIH1cbn1cbmV4cG9ydHMuRWRpdFByaWNlVGh1b2NNb2RhbCA9IEVkaXRQcmljZVRodW9jTW9kYWw7XG4vLyMgc291cmNlTWFwcGluZ1VSTD10aHVvYy1lZGl0LXByaWNlLW1vZGFsLmpzLm1hcCIsIlwidXNlIHN0cmljdFwiO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuY29uc3QgdGh1b2NfYWRkX21vZGFsXzEgPSByZXF1aXJlKFwiLi90aHVvYy1hZGQtbW9kYWxcIik7XG5leHBvcnRzLkFkZFRodW9jTW9kYWwgPSB0aHVvY19hZGRfbW9kYWxfMS5BZGRUaHVvY01vZGFsO1xuY29uc3QgdGh1b2NfZWRpdF9tb2RhbF8xID0gcmVxdWlyZShcIi4vdGh1b2MtZWRpdC1tb2RhbFwiKTtcbmV4cG9ydHMuRWRpdFRodW9jTW9kYWwgPSB0aHVvY19lZGl0X21vZGFsXzEuRWRpdFRodW9jTW9kYWw7XG5jb25zdCB0aHVvY19uZXdfbW9kYWxfMSA9IHJlcXVpcmUoXCIuL3RodW9jLW5ldy1tb2RhbFwiKTtcbmV4cG9ydHMuTmV3VGh1b2NNb2RhbCA9IHRodW9jX25ld19tb2RhbF8xLk5ld1RodW9jTW9kYWw7XG5jb25zdCB0aHVvY19lZGl0X3ByaWNlX21vZGFsXzEgPSByZXF1aXJlKFwiLi90aHVvYy1lZGl0LXByaWNlLW1vZGFsXCIpO1xuZXhwb3J0cy5FZGl0UHJpY2VUaHVvY01vZGFsID0gdGh1b2NfZWRpdF9wcmljZV9tb2RhbF8xLkVkaXRQcmljZVRodW9jTW9kYWw7XG4vLyMgc291cmNlTWFwcGluZ1VSTD10aHVvYy1tb2RhbC5qcy5tYXAiLCJcInVzZSBzdHJpY3RcIjtcbnZhciBfX2F3YWl0ZXIgPSAodGhpcyAmJiB0aGlzLl9fYXdhaXRlcikgfHwgZnVuY3Rpb24gKHRoaXNBcmcsIF9hcmd1bWVudHMsIFAsIGdlbmVyYXRvcikge1xuICAgIHJldHVybiBuZXcgKFAgfHwgKFAgPSBQcm9taXNlKSkoZnVuY3Rpb24gKHJlc29sdmUsIHJlamVjdCkge1xuICAgICAgICBmdW5jdGlvbiBmdWxmaWxsZWQodmFsdWUpIHsgdHJ5IHsgc3RlcChnZW5lcmF0b3IubmV4dCh2YWx1ZSkpOyB9IGNhdGNoIChlKSB7IHJlamVjdChlKTsgfSB9XG4gICAgICAgIGZ1bmN0aW9uIHJlamVjdGVkKHZhbHVlKSB7IHRyeSB7IHN0ZXAoZ2VuZXJhdG9yW1widGhyb3dcIl0odmFsdWUpKTsgfSBjYXRjaCAoZSkgeyByZWplY3QoZSk7IH0gfVxuICAgICAgICBmdW5jdGlvbiBzdGVwKHJlc3VsdCkgeyByZXN1bHQuZG9uZSA/IHJlc29sdmUocmVzdWx0LnZhbHVlKSA6IG5ldyBQKGZ1bmN0aW9uIChyZXNvbHZlKSB7IHJlc29sdmUocmVzdWx0LnZhbHVlKTsgfSkudGhlbihmdWxmaWxsZWQsIHJlamVjdGVkKTsgfVxuICAgICAgICBzdGVwKChnZW5lcmF0b3IgPSBnZW5lcmF0b3IuYXBwbHkodGhpc0FyZywgX2FyZ3VtZW50cyB8fCBbXSkpLm5leHQoKSk7XG4gICAgfSk7XG59O1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuY29uc3QgZm9ybVZhbF8xID0gcmVxdWlyZShcIi4uL2Zvcm1WYWxcIik7XG5jbGFzcyBOZXdUaHVvY01vZGFsIHtcbiAgICBjb25zdHJ1Y3RvcihpZCwgYXBwKSB7XG4gICAgICAgIHRoaXMuYXBwID0gYXBwO1xuICAgICAgICB0aGlzLnBvcHVwID0gJChcIiNcIiArIGlkKTtcbiAgICAgICAgdGhpcy5wb3B1cC5sb2FkKFwiL2xheW91dHMvbW9kYWwtbmV3LXRodW9jLmh0bWxcIiwgKCkgPT4ge1xuICAgICAgICAgICAgdGhpcy5hcHAuZG9uVmkucmVuZGVyU2VsZWN0SW5wdXQodGhpcy5wb3B1cC5maW5kKFwiW25hbWU9aWRfZG9uX3ZpXVwiKSk7XG4gICAgICAgICAgICB0aGlzLnBvcHVwLmZpbmQoXCJmb3JtXCIpLm9uKFwic3VibWl0XCIsIGZ1bmN0aW9uIChlKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIF9fYXdhaXRlcih0aGlzLCB2b2lkIDAsIHZvaWQgMCwgZnVuY3Rpb24qICgpIHtcbiAgICAgICAgICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBmb3JtVmFsID0gZm9ybVZhbF8xLmdldEZvcm1WYWx1ZSgkKHRoaXMpKTtcbiAgICAgICAgICAgICAgICAgICAgeWllbGQgYXBwLnRodW9jLmNyZWF0ZShmb3JtVmFsKS5jYXRjaCgoZXJyKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBhbGVydChlcnIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhyb3cgZXJyO1xuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgYWxlcnQoXCJzdWNjZXNzXCIpO1xuICAgICAgICAgICAgICAgICAgICB3aW5kb3cubG9jYXRpb24ucmVsb2FkKCk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgfVxuICAgIHNob3coKSB7XG4gICAgICAgIHRoaXMucG9wdXAubW9kYWwoXCJzaG93XCIpO1xuICAgIH1cbiAgICBoaWRlKCkge1xuICAgICAgICB0aGlzLnBvcHVwLm1vZGFsKFwiaGlkZVwiKTtcbiAgICB9XG59XG5leHBvcnRzLk5ld1RodW9jTW9kYWwgPSBOZXdUaHVvY01vZGFsO1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9dGh1b2MtbmV3LW1vZGFsLmpzLm1hcCIsImNvbnN0IHtBcHB9ID0gcmVxdWlyZSgnLi4vYXBwL0FwcCcpO1xuXG4kKGRvY3VtZW50KS5yZWFkeSgoKT0+e1xuICAgIGNvbnN0IGFwcCA9IG5ldyBBcHAoKTtcblxuICAgIHJlcXVpcmUoXCIuLi9hcHAvbmhhcC1ob2EtZG9uXCIpLmluaXQoYXBwKTtcbiAgICByZXF1aXJlKFwiLi4vYXBwL25oYXAtdGh1b2NcIikuaW5pdChhcHApO1xufSk7XG4iXX0=
