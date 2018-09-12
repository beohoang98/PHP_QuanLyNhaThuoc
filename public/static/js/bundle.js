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
const CTHoaDonList_1 = require("./View/CTHoaDonList");
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
            hoaDon: new CTHoaDonList_1.CTHoaDonList(this.model.hoaDon),
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

},{"./KeyEvent":3,"./Model/BangGia":5,"./Model/DonVi":6,"./Model/HoaDon":7,"./Model/Ncc":9,"./Model/Thuoc":10,"./View/CTHoaDonList":11,"./View/ThuocTable":12}],2:[function(require,module,exports){
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
const ViewTable_1 = require("./ViewTable");
const MenuContext_1 = require("../MenuContext");
class CTHoaDonList extends ViewTable_1.ViewTable {
    constructor(hoaDonModel) {
        super();
        this.element = $("<table/>").addClass("table table-striped table-view");
        this.element.html(`
        <thead>
            <tr>
                <th>Ma Thuoc</th>
                <th>Ten Thuoc</th>
                <th>Don Gia</th>
                <th>So Luong</th>
                <th>Thanh tien</th>
            </tr>
        </thead>
        <tbody></tbody>
        `);
        this.model = hoaDonModel;
        this.funcOnDelete = (data) => { return; };
    }
    onDelete(func = (data) => { return; }) {
        this.funcOnDelete = func;
    }
    customCreateRow(row) {
        const ctx = new MenuContext_1.MenuContext(row);
        ctx.addContext({
            title: "Delete",
            icon: "fa fa-times",
            className: "danger",
            click: () => {
                this.funcOnDelete(this.model.fetchData);
            },
        });
    }
}
exports.CTHoaDonList = CTHoaDonList;

},{"../MenuContext":4,"./ViewTable":13}],12:[function(require,module,exports){
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
function init(app) {
    handleTenThuocInput(app);
    handleDonViSelectInput(app);
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
        $("#nhap_hoa_don--don_vi").val(data.don_vi);
    });
}
function handleDonViSelectInput(app) {
    app.model.donVi.renderSelectInput($("#nhap_hoa_don--don_vi"));
}
function handleForm(app) {
    $("#nhap_hoa_don--them_thuoc").on("submit", (e) => {
        const form = $(e.target);
        const data = formVal_1.getFormValue(form);
        alert(JSON.stringify(data));
    });
}

},{"../AutoComplete":2,"../formVal":14}],16:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const addThuocHandle_1 = require("./addThuocHandle");
function init(app) {
    addThuocHandle_1.addThuocHandle(app);
}
exports.init = init;

},{"./addThuocHandle":15}],17:[function(require,module,exports){
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

},{"./thuoc-modal":21}],18:[function(require,module,exports){
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

},{}],19:[function(require,module,exports){
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

},{"../AutoComplete":2,"../formVal":14}],20:[function(require,module,exports){
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

},{}],21:[function(require,module,exports){
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

},{"./thuoc-add-modal":18,"./thuoc-edit-modal":19,"./thuoc-edit-price-modal":20,"./thuoc-new-modal":22}],22:[function(require,module,exports){
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

},{"../formVal":14}],23:[function(require,module,exports){
const {App} = require('../app/App');

$(document).ready(()=>{
    const app = new App();

    require("../app/nhap-hoa-don").init(app);
    require("../app/nhap-thuoc").init(app);
});

},{"../app/App":1,"../app/nhap-hoa-don":16,"../app/nhap-thuoc":17}]},{},[23])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvYXBwL0FwcC5qcyIsInNyYy9hcHAvQXV0b0NvbXBsZXRlL2luZGV4LmpzIiwic3JjL2FwcC9LZXlFdmVudC9pbmRleC5qcyIsInNyYy9hcHAvTWVudUNvbnRleHQvaW5kZXguanMiLCJzcmMvYXBwL01vZGVsL0JhbmdHaWEvaW5kZXguanMiLCJzcmMvYXBwL01vZGVsL0RvblZpL2luZGV4LmpzIiwic3JjL2FwcC9Nb2RlbC9Ib2FEb24vaW5kZXguanMiLCJzcmMvYXBwL01vZGVsL01vZGVsQ2xhc3MvaW5kZXguanMiLCJzcmMvYXBwL01vZGVsL05jYy9pbmRleC5qcyIsInNyYy9hcHAvTW9kZWwvVGh1b2MvaW5kZXguanMiLCJzcmMvYXBwL1ZpZXcvQ1RIb2FEb25MaXN0LmpzIiwic3JjL2FwcC9WaWV3L1RodW9jVGFibGUuanMiLCJzcmMvYXBwL1ZpZXcvVmlld1RhYmxlLmpzIiwic3JjL2FwcC9mb3JtVmFsLmpzIiwic3JjL2FwcC9uaGFwLWhvYS1kb24vYWRkVGh1b2NIYW5kbGUuanMiLCJzcmMvYXBwL25oYXAtaG9hLWRvbi9pbmRleC5qcyIsInNyYy9hcHAvbmhhcC10aHVvYy9pbmRleC5qcyIsInNyYy9hcHAvbmhhcC10aHVvYy90aHVvYy1hZGQtbW9kYWwuanMiLCJzcmMvYXBwL25oYXAtdGh1b2MvdGh1b2MtZWRpdC1tb2RhbC5qcyIsInNyYy9hcHAvbmhhcC10aHVvYy90aHVvYy1lZGl0LXByaWNlLW1vZGFsLmpzIiwic3JjL2FwcC9uaGFwLXRodW9jL3RodW9jLW1vZGFsLmpzIiwic3JjL2FwcC9uaGFwLXRodW9jL3RodW9jLW5ldy1tb2RhbC5qcyIsInNyYy9zY3JpcHQvbWFpbi5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM3RUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3ZIQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3hDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3BEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM5QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdkNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDVkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDekpBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDNUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMvQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdkNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3REQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3hJQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDWEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMvQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNQQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdkhBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMvQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM3Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNWQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24oKXtmdW5jdGlvbiByKGUsbix0KXtmdW5jdGlvbiBvKGksZil7aWYoIW5baV0pe2lmKCFlW2ldKXt2YXIgYz1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlO2lmKCFmJiZjKXJldHVybiBjKGksITApO2lmKHUpcmV0dXJuIHUoaSwhMCk7dmFyIGE9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitpK1wiJ1wiKTt0aHJvdyBhLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsYX12YXIgcD1uW2ldPXtleHBvcnRzOnt9fTtlW2ldWzBdLmNhbGwocC5leHBvcnRzLGZ1bmN0aW9uKHIpe3ZhciBuPWVbaV1bMV1bcl07cmV0dXJuIG8obnx8cil9LHAscC5leHBvcnRzLHIsZSxuLHQpfXJldHVybiBuW2ldLmV4cG9ydHN9Zm9yKHZhciB1PVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmUsaT0wO2k8dC5sZW5ndGg7aSsrKW8odFtpXSk7cmV0dXJuIG99cmV0dXJuIHJ9KSgpIiwiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5jb25zdCBLZXlFdmVudF8xID0gcmVxdWlyZShcIi4vS2V5RXZlbnRcIik7XG5jb25zdCBUaHVvY18xID0gcmVxdWlyZShcIi4vTW9kZWwvVGh1b2NcIik7XG5jb25zdCBIb2FEb25fMSA9IHJlcXVpcmUoXCIuL01vZGVsL0hvYURvblwiKTtcbmNvbnN0IERvblZpXzEgPSByZXF1aXJlKFwiLi9Nb2RlbC9Eb25WaVwiKTtcbmNvbnN0IE5jY18xID0gcmVxdWlyZShcIi4vTW9kZWwvTmNjXCIpO1xuY29uc3QgQmFuZ0dpYV8xID0gcmVxdWlyZShcIi4vTW9kZWwvQmFuZ0dpYVwiKTtcbmNvbnN0IFRodW9jVGFibGVfMSA9IHJlcXVpcmUoXCIuL1ZpZXcvVGh1b2NUYWJsZVwiKTtcbmNvbnN0IENUSG9hRG9uTGlzdF8xID0gcmVxdWlyZShcIi4vVmlldy9DVEhvYURvbkxpc3RcIik7XG5jbGFzcyBBcHAge1xuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICB0aGlzLnN3aXRjaFRvUGFnZSh0aGlzLmdldFBhZ2VGcm9tVXJsKCkpO1xuICAgICAgICB0aGlzLmhhbmRsZVN3aXRjaFBhZ2UoKTtcbiAgICAgICAgdGhpcy5rZXlldmVudCA9IG5ldyBLZXlFdmVudF8xLktleUV2ZW50KCk7XG4gICAgICAgIHRoaXMuaGFuZGxlU2V0dGluZygpO1xuICAgICAgICB0aGlzLmhhbmRsZU1vZGFsKCk7XG4gICAgICAgIHRoaXMubW9kZWwgPSB7XG4gICAgICAgICAgICB0aHVvYzogbmV3IFRodW9jXzEuVGh1b2MoKSxcbiAgICAgICAgICAgIG5jYzogbmV3IE5jY18xLk5jYygpLFxuICAgICAgICAgICAgZG9uVmk6IG5ldyBEb25WaV8xLkRvblZpKCksXG4gICAgICAgICAgICBob2FEb246IG5ldyBIb2FEb25fMS5Ib2FEb24oKSxcbiAgICAgICAgICAgIGJhbmdHaWE6IG5ldyBCYW5nR2lhXzEuQmFuZ0dpYSgpLFxuICAgICAgICB9O1xuICAgICAgICB0aGlzLnZpZXcgPSB7XG4gICAgICAgICAgICB0aHVvYzogbmV3IFRodW9jVGFibGVfMS5UaHVvY1RhYmxlKHRoaXMubW9kZWwudGh1b2MpLFxuICAgICAgICAgICAgaG9hRG9uOiBuZXcgQ1RIb2FEb25MaXN0XzEuQ1RIb2FEb25MaXN0KHRoaXMubW9kZWwuaG9hRG9uKSxcbiAgICAgICAgfTtcbiAgICB9XG4gICAgZ2V0VXNlcm5hbWUoKSB7XG4gICAgICAgIGNvbnN0IHVzZXJuYW1lID0gZG9jdW1lbnQuY29va2llLm1hdGNoKC91c2VybmFtZT0oWzAtOWEtekEtWl9dKykvaSlbMV07XG4gICAgICAgICQoXCIjdXNlcm5hbWVcIikudGV4dCh1c2VybmFtZSk7XG4gICAgfVxuICAgIG9uU2hvcnRjdXRLZXkoY29tYktleSwgcGFnZSwgZnVuYykge1xuICAgICAgICAvLyBmKmtpbmcgaW5jcmVkaWJsZSBzY29wZSB0aGluZ3MhXG4gICAgICAgIHRoaXMua2V5ZXZlbnQub24oY29tYktleSwgKGUpID0+IHtcbiAgICAgICAgICAgIGlmICh0aGlzLnBhZ2UgPT09IHBhZ2UpIHtcbiAgICAgICAgICAgICAgICBmdW5jKGUpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9XG4gICAgZ2V0UGFnZUZyb21VcmwoKSB7XG4gICAgICAgIGxldCBwYWdlID0gbmV3IFVSTCh3aW5kb3cubG9jYXRpb24udG9TdHJpbmcoKSkuc2VhcmNoUGFyYW1zLmdldChcInBhZ2VcIik7XG4gICAgICAgIGlmICghcGFnZSkge1xuICAgICAgICAgICAgcGFnZSA9IFwicGFnZS1uaGFwLWhvYS1kb25cIjtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcGFnZTtcbiAgICB9XG4gICAgaGFuZGxlU3dpdGNoUGFnZSgpIHtcbiAgICAgICAgY29uc3QgJHRoaXMgPSB0aGlzO1xuICAgICAgICAkKFwiLnNpZGViYXItc3dpdGNoLXBhZ2VcIikub24oXCJjbGlja1wiLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBjb25zdCBpZCA9ICQodGhpcykuZGF0YShcInRhcmdldFwiKTtcbiAgICAgICAgICAgICR0aGlzLnN3aXRjaFRvUGFnZShpZCk7XG4gICAgICAgIH0pO1xuICAgIH1cbiAgICBzd2l0Y2hUb1BhZ2UoaWQpIHtcbiAgICAgICAgdGhpcy5wYWdlID0gaWQ7XG4gICAgICAgIHdpbmRvdy5oaXN0b3J5LnJlcGxhY2VTdGF0ZShudWxsLCBpZCwgXCIvP3BhZ2U9XCIgKyBpZCk7XG4gICAgICAgIGNvbnN0IGNvbnRhaW5lciA9ICQoXCIuZnJhbWUtY29udGFpbmVyXCIpO1xuICAgICAgICBjb25zdCBwYWdlID0gJChcIiNcIiArIGlkKTtcbiAgICAgICAgY29udGFpbmVyLmFuaW1hdGUoe1xuICAgICAgICAgICAgc2Nyb2xsVG9wOiBwYWdlLm9mZnNldCgpLnRvcCAtIGNvbnRhaW5lci5vZmZzZXQoKS50b3AgKyBjb250YWluZXIuc2Nyb2xsVG9wKCksXG4gICAgICAgIH0pO1xuICAgIH1cbiAgICBoYW5kbGVTZXR0aW5nKCkge1xuICAgICAgICAvL1xuICAgIH1cbiAgICBoYW5kbGVNb2RhbCgpIHtcbiAgICAgICAgJChcIi5tb2RhbFwiKS5vbihcInNob3duLmJzLm1vZGFsXCIsICgpID0+IHtcbiAgICAgICAgICAgIHRoaXMua2V5ZXZlbnQuYmxvY2soKTtcbiAgICAgICAgfSk7XG4gICAgICAgICQoXCIubW9kYWxcIikub24oXCJoaWRkZW4uYnMubW9kYWxcIiwgKCkgPT4ge1xuICAgICAgICAgICAgdGhpcy5rZXlldmVudC51bmJsb2NrKCk7XG4gICAgICAgIH0pO1xuICAgIH1cbn1cbmV4cG9ydHMuQXBwID0gQXBwO1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9QXBwLmpzLm1hcCIsIlwidXNlIHN0cmljdFwiO1xudmFyIF9fYXdhaXRlciA9ICh0aGlzICYmIHRoaXMuX19hd2FpdGVyKSB8fCBmdW5jdGlvbiAodGhpc0FyZywgX2FyZ3VtZW50cywgUCwgZ2VuZXJhdG9yKSB7XG4gICAgcmV0dXJuIG5ldyAoUCB8fCAoUCA9IFByb21pc2UpKShmdW5jdGlvbiAocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgICAgIGZ1bmN0aW9uIGZ1bGZpbGxlZCh2YWx1ZSkgeyB0cnkgeyBzdGVwKGdlbmVyYXRvci5uZXh0KHZhbHVlKSk7IH0gY2F0Y2ggKGUpIHsgcmVqZWN0KGUpOyB9IH1cbiAgICAgICAgZnVuY3Rpb24gcmVqZWN0ZWQodmFsdWUpIHsgdHJ5IHsgc3RlcChnZW5lcmF0b3JbXCJ0aHJvd1wiXSh2YWx1ZSkpOyB9IGNhdGNoIChlKSB7IHJlamVjdChlKTsgfSB9XG4gICAgICAgIGZ1bmN0aW9uIHN0ZXAocmVzdWx0KSB7IHJlc3VsdC5kb25lID8gcmVzb2x2ZShyZXN1bHQudmFsdWUpIDogbmV3IFAoZnVuY3Rpb24gKHJlc29sdmUpIHsgcmVzb2x2ZShyZXN1bHQudmFsdWUpOyB9KS50aGVuKGZ1bGZpbGxlZCwgcmVqZWN0ZWQpOyB9XG4gICAgICAgIHN0ZXAoKGdlbmVyYXRvciA9IGdlbmVyYXRvci5hcHBseSh0aGlzQXJnLCBfYXJndW1lbnRzIHx8IFtdKSkubmV4dCgpKTtcbiAgICB9KTtcbn07XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5jbGFzcyBBdXRvQ29tcGxldGUge1xuICAgIGNvbnN0cnVjdG9yKHRhcmdldCwgbW9kZWwpIHtcbiAgICAgICAgaWYgKHR5cGVvZiB0YXJnZXQgPT09IFwic3RyaW5nXCIpIHtcbiAgICAgICAgICAgIHRoaXMudGFyZ2V0ID0gJChcIiNcIiArIHRhcmdldCk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICB0aGlzLnRhcmdldCA9IHRhcmdldDtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLnRhcmdldC5hdHRyKFwiYXV0b2NvbXBsZXRlXCIsIFwib2ZmXCIpO1xuICAgICAgICB0aGlzLm1vZGVsID0gbW9kZWw7XG4gICAgfVxuICAgIG9uQ2hvb3NlKGZ1bmMpIHtcbiAgICAgICAgdGhpcy5mdW5jT25DaG9vc2UgPSBmdW5jO1xuICAgIH1cbiAgICBpc1Nob3dlZCgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZWxlbWVudC5jaGlsZHJlbi5sZW5ndGggPiAwO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBzZXQgZmllbGRuYW1lIHRvIHNob3dcbiAgICAgKiBAcGFyYW0gbG9va3VwIHtmaWVsZE5hbWU6IEVsZW1lbnRJZH1cbiAgICAgKi9cbiAgICBzZXRMb29rdXAobG9va3VwKSB7XG4gICAgICAgIHRoaXMubG9va3VwID0gbG9va3VwO1xuICAgIH1cbiAgICBsaXN0ZW4oKSB7XG4gICAgICAgIHRoaXMudGFyZ2V0Lm9uKFwia2V5dXBcIiwgKGUpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IGtleSA9IGUua2V5O1xuICAgICAgICAgICAgc3dpdGNoIChrZXkpIHtcbiAgICAgICAgICAgICAgICBjYXNlIFwiRW50ZXJcIjoge1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgY2FzZSBcIkVzY2FwZVwiOiB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMucmVtb3ZlKCk7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBjYXNlIFwiQXJyb3dVcFwiOiB7XG4gICAgICAgICAgICAgICAgICAgIC8vIHRvIGRvXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBjYXNlIFwiQXJyb3dEb3duXCI6IHtcbiAgICAgICAgICAgICAgICAgICAgLy8gdG8gZG9cbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGRlZmF1bHQ6IHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgdmFsID0gdGhpcy50YXJnZXQudmFsKCk7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMucmVtb3ZlKCk7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMucmVuZGVyKHZhbCkudGhlbigoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnNob3coKTtcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9XG4gICAgcmVuZGVyKHNlYXJjaCkge1xuICAgICAgICByZXR1cm4gX19hd2FpdGVyKHRoaXMsIHZvaWQgMCwgdm9pZCAwLCBmdW5jdGlvbiogKCkge1xuICAgICAgICAgICAgdGhpcy5lbGVtZW50ID0gJChcIjx1bC8+XCIpLmFkZENsYXNzKFwibXktYXV0b2NvbXBsZXRlIHNoYWRvdy1sZyByb3VuZGVkXCIpO1xuICAgICAgICAgICAgdGhpcy5lbGVtZW50LmNzcyh7XG4gICAgICAgICAgICAgICAgdG9wOiB0aGlzLnRhcmdldC5vZmZzZXQoKS50b3AgKyB0aGlzLnRhcmdldC5vdXRlckhlaWdodCgpLFxuICAgICAgICAgICAgICAgIGxlZnQ6IHRoaXMudGFyZ2V0Lm9mZnNldCgpLmxlZnQsXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIGNvbnN0IGRhdGEgPSB5aWVsZCB0aGlzLmdldERhdGEoc2VhcmNoKTtcbiAgICAgICAgICAgIHRoaXMuY3VycmVudE9mZnNldCA9IDA7XG4gICAgICAgICAgICBsZXQgb2Zmc2V0ID0gMDtcbiAgICAgICAgICAgIGZvciAoY29uc3QgZGF0YVJvdyBvZiBkYXRhKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgZGF0YVJvd0ZpbHRlcmVkID0gdGhpcy5maWx0ZXJEYXRhV2l0aExvb2t1cChkYXRhUm93KTtcbiAgICAgICAgICAgICAgICBjb25zdCByb3dFbGVtZW50ID0gdGhpcy5yZW5kZXJSb3coZGF0YVJvd0ZpbHRlcmVkLCBvZmZzZXQrKyk7XG4gICAgICAgICAgICAgICAgcm93RWxlbWVudC5vbihcImNsaWNrIGtleWRvd25cIiwgKGUpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGUudHlwZSA9PT0gXCJjbGlja1wiIHx8IGUua2V5ID09PSBcIkVudGVyXCIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGUuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmZ1bmNPbkNob29zZShkYXRhUm93KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMucmVtb3ZlKCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB0aGlzLmVsZW1lbnQuYXBwZW5kKHJvd0VsZW1lbnQpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9XG4gICAgc2hvdygpIHtcbiAgICAgICAgJChcImJvZHlcIikuYXBwZW5kKHRoaXMuZWxlbWVudCk7XG4gICAgfVxuICAgIHJlbW92ZSgpIHtcbiAgICAgICAgJChcIi5teS1hdXRvY29tcGxldGVcIikucmVtb3ZlKCk7XG4gICAgfVxuICAgIGdldERhdGEoc2VhcmNoKSB7XG4gICAgICAgIHJldHVybiBfX2F3YWl0ZXIodGhpcywgdm9pZCAwLCB2b2lkIDAsIGZ1bmN0aW9uKiAoKSB7XG4gICAgICAgICAgICBjb25zdCBkYXRhID0geWllbGQgdGhpcy5tb2RlbC5nZXQoc2VhcmNoLCAwLCAyMCk7IC8vIDIwIGlzIGZvciB0ZXN0IGZpcnN0LCB3aWxsIGRldmVsb3AgaW4gZnV0dXJlXG4gICAgICAgICAgICByZXR1cm4gZGF0YTtcbiAgICAgICAgfSk7XG4gICAgfVxuICAgIHJlbmRlclJvdyhkYXRhUm93LCBvZmZzZXQpIHtcbiAgICAgICAgY29uc3Qgcm93ID0gJChcIjxsaS8+XCIpLmRhdGEoXCJvZmZzZXRcIiwgb2Zmc2V0KTtcbiAgICAgICAgZm9yIChjb25zdCBmaWVsZCBvZiBPYmplY3Qua2V5cyhkYXRhUm93KSkge1xuICAgICAgICAgICAgY29uc3QgdmFsID0gZGF0YVJvd1tmaWVsZF07XG4gICAgICAgICAgICByb3cuYXBwZW5kKCQoXCI8ZGl2Lz5cIikudGV4dCh2YWwpKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcm93O1xuICAgIH1cbiAgICBmaWx0ZXJEYXRhV2l0aExvb2t1cChkYXRhUm93KSB7XG4gICAgICAgIGNvbnN0IGZpbHRlcmVkRGF0YSA9IHt9O1xuICAgICAgICBmb3IgKGNvbnN0IGtleSBvZiB0aGlzLmxvb2t1cCkge1xuICAgICAgICAgICAgaWYgKGRhdGFSb3cuaGFzT3duUHJvcGVydHkoa2V5KSkge1xuICAgICAgICAgICAgICAgIGZpbHRlcmVkRGF0YVtrZXldID0gZGF0YVJvd1trZXldO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBmaWx0ZXJlZERhdGE7XG4gICAgfVxufVxuZXhwb3J0cy5BdXRvQ29tcGxldGUgPSBBdXRvQ29tcGxldGU7XG4vLyMgc291cmNlTWFwcGluZ1VSTD1pbmRleC5qcy5tYXAiLCJcInVzZSBzdHJpY3RcIjtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmNsYXNzIEtleUV2ZW50IHtcbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgdGhpcy5ldmVudEF0dGFjaCA9IHt9O1xuICAgICAgICB0aGlzLmlzQmxvY2tpbmcgPSBmYWxzZTtcbiAgICAgICAgJChkb2N1bWVudCkub24oXCJrZXlkb3duXCIsIChlKSA9PiB7XG4gICAgICAgICAgICBpZiAodGhpcy5pc0Jsb2NraW5nKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgbGV0IGNvbWJLZXkgPSBcIlwiO1xuICAgICAgICAgICAgaWYgKGUuY3RybEtleSkge1xuICAgICAgICAgICAgICAgIGNvbWJLZXkgPSBcImN0cmwrXCI7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjb21iS2V5ICs9IGUua2V5O1xuICAgICAgICAgICAgY29uc29sZS5sb2coY29tYktleSk7XG4gICAgICAgICAgICBpZiAodGhpcy5ldmVudEF0dGFjaC5oYXNPd25Qcm9wZXJ0eShjb21iS2V5KSkge1xuICAgICAgICAgICAgICAgIGNvbnN0IGxpc3RGdW5jID0gdGhpcy5ldmVudEF0dGFjaFtjb21iS2V5XTtcbiAgICAgICAgICAgICAgICBmb3IgKGNvbnN0IGZ1bmMgb2YgbGlzdEZ1bmMpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHR5cGVvZiBmdW5jID09PSBcImZ1bmN0aW9uXCIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGZ1bmMoZSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH1cbiAgICBvbihjb21iS2V5LCBmdW5jKSB7XG4gICAgICAgIGlmICghdGhpcy5ldmVudEF0dGFjaFtjb21iS2V5XSkge1xuICAgICAgICAgICAgdGhpcy5ldmVudEF0dGFjaFtjb21iS2V5XSA9IFtdO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuZXZlbnRBdHRhY2hbY29tYktleV0ucHVzaChmdW5jKTtcbiAgICB9XG4gICAgYmxvY2soKSB7XG4gICAgICAgIHRoaXMuaXNCbG9ja2luZyA9IHRydWU7XG4gICAgfVxuICAgIHVuYmxvY2soKSB7XG4gICAgICAgIHRoaXMuaXNCbG9ja2luZyA9IGZhbHNlO1xuICAgIH1cbn1cbmV4cG9ydHMuS2V5RXZlbnQgPSBLZXlFdmVudDtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWluZGV4LmpzLm1hcCIsIlwidXNlIHN0cmljdFwiO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuY2xhc3MgTWVudUNvbnRleHQge1xuICAgIGNvbnN0cnVjdG9yKHRhcmdldCkge1xuICAgICAgICBpZiAodHlwZW9mIHRhcmdldCA9PT0gXCJzdHJpbmdcIikge1xuICAgICAgICAgICAgdGhpcy50YXJnZXQgPSAkKFwiI1wiICsgdGFyZ2V0KTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMudGFyZ2V0ID0gdGFyZ2V0O1xuICAgICAgICB9XG4gICAgICAgIHRoaXMudGFyZ2V0Lm9uKFwiY29udGV4dG1lbnVcIiwgKGUpID0+IHtcbiAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgIGUuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgICAgICAgICB0aGlzLnJlbW92ZSgpLnJlbmRlcih7IHg6IGUuY2xpZW50WCwgeTogZS5jbGllbnRZIH0pLnNob3coKTtcbiAgICAgICAgfSk7XG4gICAgICAgIHRoaXMubWVudSA9IFtdO1xuICAgIH1cbiAgICBhZGRDb250ZXh0KHByb3ApIHtcbiAgICAgICAgdGhpcy5tZW51LnB1c2gocHJvcCk7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cbiAgICByZW5kZXIocG9zKSB7XG4gICAgICAgIHRoaXMuZWxlbWVudCA9ICQoXCI8dWwvPlwiKS5hZGRDbGFzcyhcInNoYWRvdy1sZyByb3VuZGVkIG15LWNvbnRleHRtZW51XCIpO1xuICAgICAgICB0aGlzLmVsZW1lbnQuY3NzKFwidG9wXCIsIHBvcy55ICsgXCJweFwiKTtcbiAgICAgICAgdGhpcy5lbGVtZW50LmNzcyhcImxlZnRcIiwgcG9zLnggKyBcInB4XCIpO1xuICAgICAgICBmb3IgKGNvbnN0IGN0eCBvZiB0aGlzLm1lbnUpIHtcbiAgICAgICAgICAgIHRoaXMuZWxlbWVudC5hcHBlbmQodGhpcy5yZW5kZXJDb250ZXh0KGN0eCkpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuZWxlbWVudC5oaWRlKCk7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cbiAgICBzaG93KCkge1xuICAgICAgICAkKFwiYm9keVwiKS5hcHBlbmQodGhpcy5lbGVtZW50KTtcbiAgICAgICAgdGhpcy5lbGVtZW50LnNsaWRlRG93bigwLjUpO1xuICAgICAgICAkKGRvY3VtZW50KS5vZmYoXCJjbGlja1wiLCB0aGlzLnJlbW92ZSkub24oXCJjbGlja1wiLCB0aGlzLnJlbW92ZSk7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cbiAgICByZW1vdmUoKSB7XG4gICAgICAgICQoXCIubXktY29udGV4dG1lbnVcIikucmVtb3ZlKCk7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cbiAgICByZW5kZXJDb250ZXh0KHByb3ApIHtcbiAgICAgICAgY29uc3QgY29udGV4dCA9ICQoXCI8bGkvPlwiKTtcbiAgICAgICAgY29udGV4dC5odG1sKGA8aSBjbGFzcz0nJHtwcm9wLmljb259ICR7cHJvcC5jbGFzc05hbWV9Jz48L2k+ICR7cHJvcC50aXRsZX1gKTtcbiAgICAgICAgY29udGV4dC5vbihcImNsaWNrXCIsIChlKSA9PiB7XG4gICAgICAgICAgICB0aGlzLnJlbW92ZSgpO1xuICAgICAgICAgICAgcHJvcC5jbGljayhlKTtcbiAgICAgICAgfSk7XG4gICAgICAgIHJldHVybiBjb250ZXh0O1xuICAgIH1cbn1cbmV4cG9ydHMuTWVudUNvbnRleHQgPSBNZW51Q29udGV4dDtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWluZGV4LmpzLm1hcCIsIlwidXNlIHN0cmljdFwiO1xudmFyIF9fYXdhaXRlciA9ICh0aGlzICYmIHRoaXMuX19hd2FpdGVyKSB8fCBmdW5jdGlvbiAodGhpc0FyZywgX2FyZ3VtZW50cywgUCwgZ2VuZXJhdG9yKSB7XG4gICAgcmV0dXJuIG5ldyAoUCB8fCAoUCA9IFByb21pc2UpKShmdW5jdGlvbiAocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgICAgIGZ1bmN0aW9uIGZ1bGZpbGxlZCh2YWx1ZSkgeyB0cnkgeyBzdGVwKGdlbmVyYXRvci5uZXh0KHZhbHVlKSk7IH0gY2F0Y2ggKGUpIHsgcmVqZWN0KGUpOyB9IH1cbiAgICAgICAgZnVuY3Rpb24gcmVqZWN0ZWQodmFsdWUpIHsgdHJ5IHsgc3RlcChnZW5lcmF0b3JbXCJ0aHJvd1wiXSh2YWx1ZSkpOyB9IGNhdGNoIChlKSB7IHJlamVjdChlKTsgfSB9XG4gICAgICAgIGZ1bmN0aW9uIHN0ZXAocmVzdWx0KSB7IHJlc3VsdC5kb25lID8gcmVzb2x2ZShyZXN1bHQudmFsdWUpIDogbmV3IFAoZnVuY3Rpb24gKHJlc29sdmUpIHsgcmVzb2x2ZShyZXN1bHQudmFsdWUpOyB9KS50aGVuKGZ1bGZpbGxlZCwgcmVqZWN0ZWQpOyB9XG4gICAgICAgIHN0ZXAoKGdlbmVyYXRvciA9IGdlbmVyYXRvci5hcHBseSh0aGlzQXJnLCBfYXJndW1lbnRzIHx8IFtdKSkubmV4dCgpKTtcbiAgICB9KTtcbn07XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5jb25zdCBNb2RlbENsYXNzXzEgPSByZXF1aXJlKFwiLi4vTW9kZWxDbGFzc1wiKTtcbmNsYXNzIEJhbmdHaWEgZXh0ZW5kcyBNb2RlbENsYXNzXzEuTW9kZWwge1xuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICBzdXBlcigpO1xuICAgICAgICB0aGlzLmRhdGFiYXNlID0gXCIvYXBpL3ByaWNlL1wiO1xuICAgIH1cbiAgICBnZXQobWFUaHVvYykge1xuICAgICAgICByZXR1cm4gX19hd2FpdGVyKHRoaXMsIHZvaWQgMCwgdm9pZCAwLCBmdW5jdGlvbiogKCkge1xuICAgICAgICAgICAgY29uc3QgZGF0YSA9IHlpZWxkIHRoaXMuX2dldCh7IG1hOiBtYVRodW9jIH0pO1xuICAgICAgICAgICAgcmV0dXJuIGRhdGE7XG4gICAgICAgIH0pO1xuICAgIH1cbiAgICBhZGQobWFUaHVvYywgZ2lhTW9pKSB7XG4gICAgICAgIHJldHVybiBfX2F3YWl0ZXIodGhpcywgdm9pZCAwLCB2b2lkIDAsIGZ1bmN0aW9uKiAoKSB7XG4gICAgICAgICAgICBjb25zdCByZXMgPSB5aWVsZCB0aGlzLl9wb3N0KHsgbWE6IG1hVGh1b2MsIHByaWNlOiBnaWFNb2kgfSk7XG4gICAgICAgICAgICByZXR1cm4gcmVzO1xuICAgICAgICB9KTtcbiAgICB9XG59XG5leHBvcnRzLkJhbmdHaWEgPSBCYW5nR2lhO1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9aW5kZXguanMubWFwIiwiXCJ1c2Ugc3RyaWN0XCI7XG52YXIgX19hd2FpdGVyID0gKHRoaXMgJiYgdGhpcy5fX2F3YWl0ZXIpIHx8IGZ1bmN0aW9uICh0aGlzQXJnLCBfYXJndW1lbnRzLCBQLCBnZW5lcmF0b3IpIHtcbiAgICByZXR1cm4gbmV3IChQIHx8IChQID0gUHJvbWlzZSkpKGZ1bmN0aW9uIChyZXNvbHZlLCByZWplY3QpIHtcbiAgICAgICAgZnVuY3Rpb24gZnVsZmlsbGVkKHZhbHVlKSB7IHRyeSB7IHN0ZXAoZ2VuZXJhdG9yLm5leHQodmFsdWUpKTsgfSBjYXRjaCAoZSkgeyByZWplY3QoZSk7IH0gfVxuICAgICAgICBmdW5jdGlvbiByZWplY3RlZCh2YWx1ZSkgeyB0cnkgeyBzdGVwKGdlbmVyYXRvcltcInRocm93XCJdKHZhbHVlKSk7IH0gY2F0Y2ggKGUpIHsgcmVqZWN0KGUpOyB9IH1cbiAgICAgICAgZnVuY3Rpb24gc3RlcChyZXN1bHQpIHsgcmVzdWx0LmRvbmUgPyByZXNvbHZlKHJlc3VsdC52YWx1ZSkgOiBuZXcgUChmdW5jdGlvbiAocmVzb2x2ZSkgeyByZXNvbHZlKHJlc3VsdC52YWx1ZSk7IH0pLnRoZW4oZnVsZmlsbGVkLCByZWplY3RlZCk7IH1cbiAgICAgICAgc3RlcCgoZ2VuZXJhdG9yID0gZ2VuZXJhdG9yLmFwcGx5KHRoaXNBcmcsIF9hcmd1bWVudHMgfHwgW10pKS5uZXh0KCkpO1xuICAgIH0pO1xufTtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmNvbnN0IE1vZGVsQ2xhc3NfMSA9IHJlcXVpcmUoXCIuLi9Nb2RlbENsYXNzXCIpO1xuY2xhc3MgRG9uVmkgZXh0ZW5kcyBNb2RlbENsYXNzXzEuTW9kZWwge1xuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICBzdXBlcigpO1xuICAgICAgICB0aGlzLmRhdGFiYXNlID0gXCIvYXBpL2Rvbl92aS9cIjtcbiAgICB9XG4gICAgZ2V0KGNhbGxiYWNrKSB7XG4gICAgICAgIHJldHVybiBfX2F3YWl0ZXIodGhpcywgdm9pZCAwLCB2b2lkIDAsIGZ1bmN0aW9uKiAoKSB7XG4gICAgICAgICAgICBjb25zdCBkYXRhID0geWllbGQgdGhpcy5fZ2V0KHt9KTtcbiAgICAgICAgICAgIHRoaXMuZGF0YSA9IGRhdGE7XG4gICAgICAgICAgICBpZiAodHlwZW9mIGNhbGxiYWNrID09PSBcImZ1bmN0aW9uXCIpIHtcbiAgICAgICAgICAgICAgICBjYWxsYmFjayhkYXRhKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiB0aGlzLmRhdGE7XG4gICAgICAgIH0pO1xuICAgIH1cbiAgICByZW5kZXJTZWxlY3RJbnB1dCh0YXJnZXQpIHtcbiAgICAgICAgcmV0dXJuIF9fYXdhaXRlcih0aGlzLCB2b2lkIDAsIHZvaWQgMCwgZnVuY3Rpb24qICgpIHtcbiAgICAgICAgICAgIGNvbnN0IGRhdGEgPSB5aWVsZCB0aGlzLmdldCgpO1xuICAgICAgICAgICAgdGFyZ2V0Lmh0bWwoXCJcIik7XG4gICAgICAgICAgICBmb3IgKGNvbnN0IHJvdyBvZiBkYXRhKSB7XG4gICAgICAgICAgICAgICAgY29uc3Qgb3B0ID0gJChcIjxvcHRpb24vPlwiKS52YWwocm93LmlkKS50ZXh0KHJvdy50ZW4pO1xuICAgICAgICAgICAgICAgIHRhcmdldC5hcHBlbmQob3B0KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRhcmdldC5jaGlsZHJlbigpLmVxKDApLmF0dHIoXCJjaGVja2VkXCIsIFwidHJ1ZVwiKTtcbiAgICAgICAgfSk7XG4gICAgfVxufVxuZXhwb3J0cy5Eb25WaSA9IERvblZpO1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9aW5kZXguanMubWFwIiwiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5jb25zdCBNb2RlbENsYXNzXzEgPSByZXF1aXJlKFwiLi4vTW9kZWxDbGFzc1wiKTtcbmNsYXNzIEhvYURvbiBleHRlbmRzIE1vZGVsQ2xhc3NfMS5Nb2RlbCB7XG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHN1cGVyKCk7XG4gICAgICAgIHRoaXMuZGF0YWJhc2UgPSBcIi9hcGkvaG9hX2Rvbi9cIjtcbiAgICB9XG59XG5leHBvcnRzLkhvYURvbiA9IEhvYURvbjtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWluZGV4LmpzLm1hcCIsIlwidXNlIHN0cmljdFwiO1xudmFyIF9fYXdhaXRlciA9ICh0aGlzICYmIHRoaXMuX19hd2FpdGVyKSB8fCBmdW5jdGlvbiAodGhpc0FyZywgX2FyZ3VtZW50cywgUCwgZ2VuZXJhdG9yKSB7XG4gICAgcmV0dXJuIG5ldyAoUCB8fCAoUCA9IFByb21pc2UpKShmdW5jdGlvbiAocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgICAgIGZ1bmN0aW9uIGZ1bGZpbGxlZCh2YWx1ZSkgeyB0cnkgeyBzdGVwKGdlbmVyYXRvci5uZXh0KHZhbHVlKSk7IH0gY2F0Y2ggKGUpIHsgcmVqZWN0KGUpOyB9IH1cbiAgICAgICAgZnVuY3Rpb24gcmVqZWN0ZWQodmFsdWUpIHsgdHJ5IHsgc3RlcChnZW5lcmF0b3JbXCJ0aHJvd1wiXSh2YWx1ZSkpOyB9IGNhdGNoIChlKSB7IHJlamVjdChlKTsgfSB9XG4gICAgICAgIGZ1bmN0aW9uIHN0ZXAocmVzdWx0KSB7IHJlc3VsdC5kb25lID8gcmVzb2x2ZShyZXN1bHQudmFsdWUpIDogbmV3IFAoZnVuY3Rpb24gKHJlc29sdmUpIHsgcmVzb2x2ZShyZXN1bHQudmFsdWUpOyB9KS50aGVuKGZ1bGZpbGxlZCwgcmVqZWN0ZWQpOyB9XG4gICAgICAgIHN0ZXAoKGdlbmVyYXRvciA9IGdlbmVyYXRvci5hcHBseSh0aGlzQXJnLCBfYXJndW1lbnRzIHx8IFtdKSkubmV4dCgpKTtcbiAgICB9KTtcbn07XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5jbGFzcyBNb2RlbCB7XG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHRoaXMuZGF0YWJhc2UgPSBcIlwiO1xuICAgICAgICB0aGlzLmRhdGEgPSBbXTtcbiAgICB9XG4gICAgZ2V0IGZldGNoRGF0YSgpIHtcbiAgICAgICAgcmV0dXJuIE9iamVjdC5hc3NpZ24oe30sIHRoaXMuZGF0YSk7XG4gICAgfVxuICAgIGdldCByZXNwb25zZSgpIHtcbiAgICAgICAgcmV0dXJuIE9iamVjdC5hc3NpZ24oe30sIHRoaXMucmVzKTtcbiAgICB9XG4gICAgLy8gPT09PT09PT09PT09PT09IElOSEVSSVQgRlVOQ1xuICAgIGdldChwYXJhbXMsIG9mZnNldCwgbGltaXQpIHtcbiAgICAgICAgcmV0dXJuIF9fYXdhaXRlcih0aGlzLCB2b2lkIDAsIHZvaWQgMCwgZnVuY3Rpb24qICgpIHtcbiAgICAgICAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgICAgIH0pO1xuICAgIH1cbiAgICBjcmVhdGUoZGF0YSkge1xuICAgICAgICByZXR1cm4gX19hd2FpdGVyKHRoaXMsIHZvaWQgMCwgdm9pZCAwLCBmdW5jdGlvbiogKCkge1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9KTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogdXBkYXRlIHJlY29yZFxuICAgICAqIEBwYXJhbSBmaWVsZE1hdGNoIG1hdGNoIGZpZWxkIHRvIHVwZGF0ZSByZWNvcmRcbiAgICAgKiBAcGFyYW0gZmllbGRVcGRhdGUgdGhlIGRhdGEgbmVlZCB1cGRhdGVcbiAgICAgKi9cbiAgICB1cGRhdGUoZmllbGRNYXRjaCwgZmllbGRVcGRhdGUpIHtcbiAgICAgICAgcmV0dXJuIF9fYXdhaXRlcih0aGlzLCB2b2lkIDAsIHZvaWQgMCwgZnVuY3Rpb24qICgpIHtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfSk7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIHJlbW92ZSBhIHJlY29yZFxuICAgICAqIEBwYXJhbSBmaWVsZE1hdGNoIGZpZWxkIG1hdGNoIHRvIHJlbW92ZVxuICAgICAqIEByZXR1cm4gdHJ1ZSBvZiBmYWxzZVxuICAgICAqL1xuICAgIHJlbW92ZShmaWVsZE1hdGNoKSB7XG4gICAgICAgIHJldHVybiBfX2F3YWl0ZXIodGhpcywgdm9pZCAwLCB2b2lkIDAsIGZ1bmN0aW9uKiAoKSB7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH0pO1xuICAgIH1cbiAgICAvLyA9PT09PT09PT09PT09PT0gQ09SRSBGVU5DXG4gICAgLyoqXG4gICAgICogZmV0Y2ggZGF0YSBmcm9tIGRhdGFiYXNlIGFuZCBkbyB0aGluZ1xuICAgICAqIEBwYXJhbSBwYXJhbXNcbiAgICAgKiBAcGFyYW0gY2FsbGJhY2sgY2FsbGJhY2sgZnVuY3Rpb25cbiAgICAgKi9cbiAgICBfZ2V0KHBhcmFtcywgY2FsbGJhY2spIHtcbiAgICAgICAgcmV0dXJuIF9fYXdhaXRlcih0aGlzLCB2b2lkIDAsIHZvaWQgMCwgZnVuY3Rpb24qICgpIHtcbiAgICAgICAgICAgIHRoaXMuZGF0YSA9IFtdO1xuICAgICAgICAgICAgY29uc3QgcmVxdWVzdFVSTCA9IHRoaXMuZGF0YWJhc2UgKyBcIj9cIiArIHRoaXMuX3VybHBhcmFtcyhwYXJhbXMpO1xuICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICBjb25zdCByZXMgPSB5aWVsZCBmZXRjaChyZXF1ZXN0VVJMLCB7IGNyZWRlbnRpYWxzOiBcImluY2x1ZGVcIiB9KTtcbiAgICAgICAgICAgICAgICBjb25zdCBqc29uID0geWllbGQgcmVzLmpzb24oKTtcbiAgICAgICAgICAgICAgICBpZiAoanNvbi5lcnIpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGpzb24ubXNnKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgdGhpcy5kYXRhID0ganNvbi5kYXRhO1xuICAgICAgICAgICAgICAgIGlmICh0eXBlb2YgY2FsbGJhY2sgPT09IFwiZnVuY3Rpb25cIikge1xuICAgICAgICAgICAgICAgICAgICBjYWxsYmFjayhmYWxzZSwganNvbi5kYXRhKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcmV0dXJuIGpzb24uZGF0YTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNhdGNoIChlcnIpIHtcbiAgICAgICAgICAgICAgICBpZiAodHlwZW9mIGNhbGxiYWNrID09PSBcImZ1bmN0aW9uXCIpIHtcbiAgICAgICAgICAgICAgICAgICAgY2FsbGJhY2soZXJyKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHRocm93IGVycjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBwb3N0IHJlcXVlc3RcbiAgICAgKiBAcGFyYW0ge2FueX0gZGF0YVxuICAgICAqIEBwYXJhbSB7RnVuY3Rpb259IFtjYWxsYmFja11cbiAgICAgKi9cbiAgICBfcG9zdChkYXRhLCBjYWxsYmFjaykge1xuICAgICAgICByZXR1cm4gX19hd2FpdGVyKHRoaXMsIHZvaWQgMCwgdm9pZCAwLCBmdW5jdGlvbiogKCkge1xuICAgICAgICAgICAgdGhpcy5yZXMgPSBcIlwiO1xuICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICBjb25zdCByZXMgPSB5aWVsZCBmZXRjaCh0aGlzLmRhdGFiYXNlLCB7XG4gICAgICAgICAgICAgICAgICAgIGJvZHk6IEpTT04uc3RyaW5naWZ5KGRhdGEpLFxuICAgICAgICAgICAgICAgICAgICBjcmVkZW50aWFsczogXCJpbmNsdWRlXCIsXG4gICAgICAgICAgICAgICAgICAgIGhlYWRlcnM6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiQ29udGVudC1UeXBlXCI6IFwiYXBwbGljYXRpb24vanNvblwiLFxuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICBtZXRob2Q6IFwiUE9TVFwiLFxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIGNvbnN0IGpzb24gPSB5aWVsZCByZXMuanNvbigpO1xuICAgICAgICAgICAgICAgIGlmIChqc29uLmVycikge1xuICAgICAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoanNvbi5tc2cpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB0aGlzLnJlcyA9IGpzb24uZGF0YTtcbiAgICAgICAgICAgICAgICBpZiAodHlwZW9mIGNhbGxiYWNrID09PSBcImZ1bmN0aW9uXCIpIHtcbiAgICAgICAgICAgICAgICAgICAgY2FsbGJhY2soZmFsc2UsIGpzb24uZGF0YSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHJldHVybiBqc29uLmRhdGE7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjYXRjaCAoZXJyKSB7XG4gICAgICAgICAgICAgICAgaWYgKHR5cGVvZiBjYWxsYmFjayA9PT0gXCJmdW5jdGlvblwiKSB7XG4gICAgICAgICAgICAgICAgICAgIGNhbGxiYWNrKGVycik7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICB0aHJvdyBlcnI7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9XG4gICAgX3B1dChkYXRhKSB7XG4gICAgICAgIHJldHVybiBfX2F3YWl0ZXIodGhpcywgdm9pZCAwLCB2b2lkIDAsIGZ1bmN0aW9uKiAoKSB7XG4gICAgICAgICAgICB0aGlzLnJlcyA9IFwiXCI7XG4gICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgIGNvbnN0IHJlcyA9IHlpZWxkIGZldGNoKHRoaXMuZGF0YWJhc2UsIHtcbiAgICAgICAgICAgICAgICAgICAgYm9keTogSlNPTi5zdHJpbmdpZnkoZGF0YSksXG4gICAgICAgICAgICAgICAgICAgIGNyZWRlbnRpYWxzOiBcImluY2x1ZGVcIixcbiAgICAgICAgICAgICAgICAgICAgaGVhZGVyczoge1xuICAgICAgICAgICAgICAgICAgICAgICAgXCJDb250ZW50LVR5cGVcIjogXCJhcHBsaWNhdGlvbi9qc29uXCIsXG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgIG1ldGhvZDogXCJQVVRcIixcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICBjb25zdCBqc29uID0geWllbGQgcmVzLmpzb24oKTtcbiAgICAgICAgICAgICAgICBpZiAoanNvbi5lcnIpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGpzb24ubXNnKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgdGhpcy5yZXMgPSBqc29uLmRhdGE7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGpzb24uZGF0YTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNhdGNoIChlcnIpIHtcbiAgICAgICAgICAgICAgICB0aHJvdyBlcnI7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH1cbiAgICBfdXJscGFyYW1zKHBhcmFtcykge1xuICAgICAgICBjb25zdCB1cmwgPSBPYmplY3Qua2V5cyhwYXJhbXMpLm1hcCgoaykgPT4ge1xuICAgICAgICAgICAgcmV0dXJuIGVuY29kZVVSSUNvbXBvbmVudChrKSArIFwiPVwiICsgZW5jb2RlVVJJQ29tcG9uZW50KHBhcmFtc1trXSk7XG4gICAgICAgIH0pLmpvaW4oXCImXCIpO1xuICAgICAgICByZXR1cm4gdXJsO1xuICAgIH1cbn1cbmV4cG9ydHMuTW9kZWwgPSBNb2RlbDtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWluZGV4LmpzLm1hcCIsIlwidXNlIHN0cmljdFwiO1xudmFyIF9fYXdhaXRlciA9ICh0aGlzICYmIHRoaXMuX19hd2FpdGVyKSB8fCBmdW5jdGlvbiAodGhpc0FyZywgX2FyZ3VtZW50cywgUCwgZ2VuZXJhdG9yKSB7XG4gICAgcmV0dXJuIG5ldyAoUCB8fCAoUCA9IFByb21pc2UpKShmdW5jdGlvbiAocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgICAgIGZ1bmN0aW9uIGZ1bGZpbGxlZCh2YWx1ZSkgeyB0cnkgeyBzdGVwKGdlbmVyYXRvci5uZXh0KHZhbHVlKSk7IH0gY2F0Y2ggKGUpIHsgcmVqZWN0KGUpOyB9IH1cbiAgICAgICAgZnVuY3Rpb24gcmVqZWN0ZWQodmFsdWUpIHsgdHJ5IHsgc3RlcChnZW5lcmF0b3JbXCJ0aHJvd1wiXSh2YWx1ZSkpOyB9IGNhdGNoIChlKSB7IHJlamVjdChlKTsgfSB9XG4gICAgICAgIGZ1bmN0aW9uIHN0ZXAocmVzdWx0KSB7IHJlc3VsdC5kb25lID8gcmVzb2x2ZShyZXN1bHQudmFsdWUpIDogbmV3IFAoZnVuY3Rpb24gKHJlc29sdmUpIHsgcmVzb2x2ZShyZXN1bHQudmFsdWUpOyB9KS50aGVuKGZ1bGZpbGxlZCwgcmVqZWN0ZWQpOyB9XG4gICAgICAgIHN0ZXAoKGdlbmVyYXRvciA9IGdlbmVyYXRvci5hcHBseSh0aGlzQXJnLCBfYXJndW1lbnRzIHx8IFtdKSkubmV4dCgpKTtcbiAgICB9KTtcbn07XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5jb25zdCBNb2RlbENsYXNzXzEgPSByZXF1aXJlKFwiLi4vTW9kZWxDbGFzc1wiKTtcbmNsYXNzIE5jYyBleHRlbmRzIE1vZGVsQ2xhc3NfMS5Nb2RlbCB7XG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHN1cGVyKCk7XG4gICAgICAgIHRoaXMuZGF0YWJhc2UgPSBcIi9hcGkvbmNjL1wiO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBnZXQgZGF0YSBvZiBuc3hcbiAgICAgKiBAcGFyYW0gY2FsbGJhY2sgY2FsbGJhY2sgZnVuY3Rpb25cbiAgICAgKi9cbiAgICBnZXQocGFyYW1zKSB7XG4gICAgICAgIHJldHVybiBfX2F3YWl0ZXIodGhpcywgdm9pZCAwLCB2b2lkIDAsIGZ1bmN0aW9uKiAoKSB7XG4gICAgICAgICAgICBjb25zdCBkYXRhID0geWllbGQgdGhpcy5fZ2V0KHsgcTogcGFyYW1zIH0pO1xuICAgICAgICAgICAgcmV0dXJuIGRhdGE7XG4gICAgICAgIH0pO1xuICAgIH1cbn1cbmV4cG9ydHMuTmNjID0gTmNjO1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9aW5kZXguanMubWFwIiwiXCJ1c2Ugc3RyaWN0XCI7XG52YXIgX19hd2FpdGVyID0gKHRoaXMgJiYgdGhpcy5fX2F3YWl0ZXIpIHx8IGZ1bmN0aW9uICh0aGlzQXJnLCBfYXJndW1lbnRzLCBQLCBnZW5lcmF0b3IpIHtcbiAgICByZXR1cm4gbmV3IChQIHx8IChQID0gUHJvbWlzZSkpKGZ1bmN0aW9uIChyZXNvbHZlLCByZWplY3QpIHtcbiAgICAgICAgZnVuY3Rpb24gZnVsZmlsbGVkKHZhbHVlKSB7IHRyeSB7IHN0ZXAoZ2VuZXJhdG9yLm5leHQodmFsdWUpKTsgfSBjYXRjaCAoZSkgeyByZWplY3QoZSk7IH0gfVxuICAgICAgICBmdW5jdGlvbiByZWplY3RlZCh2YWx1ZSkgeyB0cnkgeyBzdGVwKGdlbmVyYXRvcltcInRocm93XCJdKHZhbHVlKSk7IH0gY2F0Y2ggKGUpIHsgcmVqZWN0KGUpOyB9IH1cbiAgICAgICAgZnVuY3Rpb24gc3RlcChyZXN1bHQpIHsgcmVzdWx0LmRvbmUgPyByZXNvbHZlKHJlc3VsdC52YWx1ZSkgOiBuZXcgUChmdW5jdGlvbiAocmVzb2x2ZSkgeyByZXNvbHZlKHJlc3VsdC52YWx1ZSk7IH0pLnRoZW4oZnVsZmlsbGVkLCByZWplY3RlZCk7IH1cbiAgICAgICAgc3RlcCgoZ2VuZXJhdG9yID0gZ2VuZXJhdG9yLmFwcGx5KHRoaXNBcmcsIF9hcmd1bWVudHMgfHwgW10pKS5uZXh0KCkpO1xuICAgIH0pO1xufTtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmNvbnN0IE1vZGVsQ2xhc3NfMSA9IHJlcXVpcmUoXCIuLi9Nb2RlbENsYXNzXCIpO1xuY2xhc3MgVGh1b2MgZXh0ZW5kcyBNb2RlbENsYXNzXzEuTW9kZWwge1xuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICBzdXBlcigpO1xuICAgICAgICB0aGlzLmRhdGFiYXNlID0gXCIvYXBpL3RodW9jL1wiO1xuICAgIH1cbiAgICBnZXQocGFyYW1zLCBvZmZzZXQsIGxpbWl0KSB7XG4gICAgICAgIHJldHVybiBfX2F3YWl0ZXIodGhpcywgdm9pZCAwLCB2b2lkIDAsIGZ1bmN0aW9uKiAoKSB7XG4gICAgICAgICAgICByZXR1cm4geWllbGQgdGhpcy5fZ2V0KHsgcTogcGFyYW1zLCBvZmZzZXQsIGxpbWl0IH0pO1xuICAgICAgICB9KTtcbiAgICB9XG4gICAgY3JlYXRlKGRhdGEpIHtcbiAgICAgICAgcmV0dXJuIF9fYXdhaXRlcih0aGlzLCB2b2lkIDAsIHZvaWQgMCwgZnVuY3Rpb24qICgpIHtcbiAgICAgICAgICAgIHRoaXMucmVzID0geWllbGQgdGhpcy5fcG9zdChkYXRhKTtcbiAgICAgICAgICAgIHJldHVybiAodGhpcy5yZXMpO1xuICAgICAgICB9KTtcbiAgICB9XG4gICAgYWRkKG1hLCBzb0x1b25nLCB0b25nR2lhKSB7XG4gICAgICAgIHJldHVybiBfX2F3YWl0ZXIodGhpcywgdm9pZCAwLCB2b2lkIDAsIGZ1bmN0aW9uKiAoKSB7XG4gICAgICAgICAgICB0aGlzLnJlcyA9IHlpZWxkIHRoaXMuX3Bvc3Qoe1xuICAgICAgICAgICAgICAgIG1hLFxuICAgICAgICAgICAgICAgIHNvX2x1b25nOiBzb0x1b25nLFxuICAgICAgICAgICAgICAgIHRvbmdfZ2lhOiB0b25nR2lhLFxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5yZXM7XG4gICAgICAgIH0pO1xuICAgIH1cbiAgICB1cGRhdGUobWEsIGVkaXRJbmZvKSB7XG4gICAgICAgIHJldHVybiBfX2F3YWl0ZXIodGhpcywgdm9pZCAwLCB2b2lkIDAsIGZ1bmN0aW9uKiAoKSB7XG4gICAgICAgICAgICB0aGlzLnJlcyA9IHlpZWxkIHRoaXMuX3B1dCh7XG4gICAgICAgICAgICAgICAgbWEsIGVkaXRJbmZvLFxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5yZXM7XG4gICAgICAgIH0pO1xuICAgIH1cbn1cbmV4cG9ydHMuVGh1b2MgPSBUaHVvYztcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWluZGV4LmpzLm1hcCIsIlwidXNlIHN0cmljdFwiO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuY29uc3QgVmlld1RhYmxlXzEgPSByZXF1aXJlKFwiLi9WaWV3VGFibGVcIik7XG5jb25zdCBNZW51Q29udGV4dF8xID0gcmVxdWlyZShcIi4uL01lbnVDb250ZXh0XCIpO1xuY2xhc3MgQ1RIb2FEb25MaXN0IGV4dGVuZHMgVmlld1RhYmxlXzEuVmlld1RhYmxlIHtcbiAgICBjb25zdHJ1Y3Rvcihob2FEb25Nb2RlbCkge1xuICAgICAgICBzdXBlcigpO1xuICAgICAgICB0aGlzLmVsZW1lbnQgPSAkKFwiPHRhYmxlLz5cIikuYWRkQ2xhc3MoXCJ0YWJsZSB0YWJsZS1zdHJpcGVkIHRhYmxlLXZpZXdcIik7XG4gICAgICAgIHRoaXMuZWxlbWVudC5odG1sKGBcbiAgICAgICAgPHRoZWFkPlxuICAgICAgICAgICAgPHRyPlxuICAgICAgICAgICAgICAgIDx0aD5NYSBUaHVvYzwvdGg+XG4gICAgICAgICAgICAgICAgPHRoPlRlbiBUaHVvYzwvdGg+XG4gICAgICAgICAgICAgICAgPHRoPkRvbiBHaWE8L3RoPlxuICAgICAgICAgICAgICAgIDx0aD5TbyBMdW9uZzwvdGg+XG4gICAgICAgICAgICAgICAgPHRoPlRoYW5oIHRpZW48L3RoPlxuICAgICAgICAgICAgPC90cj5cbiAgICAgICAgPC90aGVhZD5cbiAgICAgICAgPHRib2R5PjwvdGJvZHk+XG4gICAgICAgIGApO1xuICAgICAgICB0aGlzLm1vZGVsID0gaG9hRG9uTW9kZWw7XG4gICAgICAgIHRoaXMuZnVuY09uRGVsZXRlID0gKGRhdGEpID0+IHsgcmV0dXJuOyB9O1xuICAgIH1cbiAgICBvbkRlbGV0ZShmdW5jID0gKGRhdGEpID0+IHsgcmV0dXJuOyB9KSB7XG4gICAgICAgIHRoaXMuZnVuY09uRGVsZXRlID0gZnVuYztcbiAgICB9XG4gICAgY3VzdG9tQ3JlYXRlUm93KHJvdykge1xuICAgICAgICBjb25zdCBjdHggPSBuZXcgTWVudUNvbnRleHRfMS5NZW51Q29udGV4dChyb3cpO1xuICAgICAgICBjdHguYWRkQ29udGV4dCh7XG4gICAgICAgICAgICB0aXRsZTogXCJEZWxldGVcIixcbiAgICAgICAgICAgIGljb246IFwiZmEgZmEtdGltZXNcIixcbiAgICAgICAgICAgIGNsYXNzTmFtZTogXCJkYW5nZXJcIixcbiAgICAgICAgICAgIGNsaWNrOiAoKSA9PiB7XG4gICAgICAgICAgICAgICAgdGhpcy5mdW5jT25EZWxldGUodGhpcy5tb2RlbC5mZXRjaERhdGEpO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgfSk7XG4gICAgfVxufVxuZXhwb3J0cy5DVEhvYURvbkxpc3QgPSBDVEhvYURvbkxpc3Q7XG4vLyMgc291cmNlTWFwcGluZ1VSTD1DVEhvYURvbkxpc3QuanMubWFwIiwiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5jb25zdCBWaWV3VGFibGVfMSA9IHJlcXVpcmUoXCIuL1ZpZXdUYWJsZVwiKTtcbmNvbnN0IE1lbnVDb250ZXh0XzEgPSByZXF1aXJlKFwiLi4vTWVudUNvbnRleHRcIik7XG5jbGFzcyBUaHVvY1RhYmxlIGV4dGVuZHMgVmlld1RhYmxlXzEuVmlld1RhYmxlIHtcbiAgICBjb25zdHJ1Y3Rvcih0aHVvY01vZGVsKSB7XG4gICAgICAgIHN1cGVyKCk7XG4gICAgICAgIHRoaXMuZWxlbWVudCA9ICQoXCI8dGFibGUvPlwiKS5hZGRDbGFzcyhcInRhYmxlIHRhYmxlLXN0cmlwZWQgdGFibGUtdmlld1wiKTtcbiAgICAgICAgdGhpcy5lbGVtZW50Lmh0bWwoYFxuICAgICAgICA8dGhlYWQ+XG4gICAgICAgICAgICA8dHI+XG4gICAgICAgICAgICAgICAgPHRoPk1hIFRodW9jPC90aD5cbiAgICAgICAgICAgICAgICA8dGg+VGVuIFRodW9jPC90aD5cbiAgICAgICAgICAgIDwvdHI+XG4gICAgICAgIDwvdGhlYWQ+XG4gICAgICAgIDx0Ym9keT48L3Rib2R5PlxuICAgICAgICBgKTtcbiAgICAgICAgdGhpcy5tb2RlbCA9IHRodW9jTW9kZWw7XG4gICAgfVxuICAgIG9uQ29udGV4dEFkZChmdW5jKSB7XG4gICAgICAgIHRoaXMuZnVuY0N0eEFkZCA9IGZ1bmM7XG4gICAgfVxuICAgIG9uQ29udGV4dEVkaXQoZnVuYykge1xuICAgICAgICB0aGlzLmZ1bmNDdHhFZGl0ID0gZnVuYztcbiAgICB9XG4gICAgb25Db250ZXh0RWRpdFByaWNlKGZ1bmMpIHtcbiAgICAgICAgdGhpcy5mdW5jQ3R4RWRpdFByaWNlID0gZnVuYztcbiAgICB9XG4gICAgY3VzdG9tQ3JlYXRlUm93KHJvdykge1xuICAgICAgICBjb25zdCBjb250ZXh0bWVudSA9IG5ldyBNZW51Q29udGV4dF8xLk1lbnVDb250ZXh0KHJvdyk7XG4gICAgICAgIGNvbnRleHRtZW51LmFkZENvbnRleHQoe1xuICAgICAgICAgICAgdGl0bGU6IFwibmjhuq1wIHRow6ptIHRodeG7kWNcIixcbiAgICAgICAgICAgIGNsYXNzTmFtZTogXCJ0ZXh0LXN1Y2Nlc3NcIixcbiAgICAgICAgICAgIGljb246IFwiZmFzIGZhLXBsdXMtY2lyY2xlXCIsXG4gICAgICAgICAgICBjbGljazogKGUpID0+IHtcbiAgICAgICAgICAgICAgICB0aGlzLmZ1bmNDdHhBZGQoKTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgIH0pLmFkZENvbnRleHQoe1xuICAgICAgICAgICAgdGl0bGU6IFwic+G7rWEgdGjDtG5nIHRpblwiLFxuICAgICAgICAgICAgY2xhc3NOYW1lOiBcInRleHQtcHJpbWFyeVwiLFxuICAgICAgICAgICAgaWNvbjogXCJmYXMgZmEtcGVuLXNxdWFyZVwiLFxuICAgICAgICAgICAgY2xpY2s6IChlKSA9PiB7XG4gICAgICAgICAgICAgICAgdGhpcy5mdW5jQ3R4RWRpdCgpO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgfSkuYWRkQ29udGV4dCh7XG4gICAgICAgICAgICB0aXRsZTogXCJjaOG7iW5oIGdpw6FcIixcbiAgICAgICAgICAgIGljb246IFwiZmEgZmEtZG9sbGFyLXNpZ25cIixcbiAgICAgICAgICAgIGNsaWNrOiAoZSkgPT4ge1xuICAgICAgICAgICAgICAgIHRoaXMuZnVuY0N0eEVkaXRQcmljZSgpO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgfSk7XG4gICAgfVxufVxuZXhwb3J0cy5UaHVvY1RhYmxlID0gVGh1b2NUYWJsZTtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPVRodW9jVGFibGUuanMubWFwIiwiXCJ1c2Ugc3RyaWN0XCI7XG52YXIgX19hd2FpdGVyID0gKHRoaXMgJiYgdGhpcy5fX2F3YWl0ZXIpIHx8IGZ1bmN0aW9uICh0aGlzQXJnLCBfYXJndW1lbnRzLCBQLCBnZW5lcmF0b3IpIHtcbiAgICByZXR1cm4gbmV3IChQIHx8IChQID0gUHJvbWlzZSkpKGZ1bmN0aW9uIChyZXNvbHZlLCByZWplY3QpIHtcbiAgICAgICAgZnVuY3Rpb24gZnVsZmlsbGVkKHZhbHVlKSB7IHRyeSB7IHN0ZXAoZ2VuZXJhdG9yLm5leHQodmFsdWUpKTsgfSBjYXRjaCAoZSkgeyByZWplY3QoZSk7IH0gfVxuICAgICAgICBmdW5jdGlvbiByZWplY3RlZCh2YWx1ZSkgeyB0cnkgeyBzdGVwKGdlbmVyYXRvcltcInRocm93XCJdKHZhbHVlKSk7IH0gY2F0Y2ggKGUpIHsgcmVqZWN0KGUpOyB9IH1cbiAgICAgICAgZnVuY3Rpb24gc3RlcChyZXN1bHQpIHsgcmVzdWx0LmRvbmUgPyByZXNvbHZlKHJlc3VsdC52YWx1ZSkgOiBuZXcgUChmdW5jdGlvbiAocmVzb2x2ZSkgeyByZXNvbHZlKHJlc3VsdC52YWx1ZSk7IH0pLnRoZW4oZnVsZmlsbGVkLCByZWplY3RlZCk7IH1cbiAgICAgICAgc3RlcCgoZ2VuZXJhdG9yID0gZ2VuZXJhdG9yLmFwcGx5KHRoaXNBcmcsIF9hcmd1bWVudHMgfHwgW10pKS5uZXh0KCkpO1xuICAgIH0pO1xufTtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmNsYXNzIFZpZXdUYWJsZSB7XG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIC8vIGNvbnN0cnVjdFxuICAgICAgICB0aGlzLm9mZnNldCA9IDA7XG4gICAgICAgIHRoaXMubGltaXQgPSAxMDtcbiAgICB9XG4gICAgLyoqXG4gICAgICogZ2V0IGRhdGEgd2l0aCBzZWFyY2ggdmFsdWVcbiAgICAgKiBAcGFyYW0gc2VhcmNoIGZpZWxkPXZhbHVlXG4gICAgICovXG4gICAgdXBkYXRlKHNlYXJjaCkge1xuICAgICAgICByZXR1cm4gX19hd2FpdGVyKHRoaXMsIHZvaWQgMCwgdm9pZCAwLCBmdW5jdGlvbiogKCkge1xuICAgICAgICAgICAgLy8gcmVuZGVyIGRhdGEgdG8gZWxlbWVudFxuICAgICAgICAgICAgY29uc3QgcmF3RGF0YSA9IHlpZWxkIHRoaXMubW9kZWwuZ2V0KHNlYXJjaCwgdGhpcy5vZmZzZXQsIHRoaXMubGltaXQpO1xuICAgICAgICAgICAgdGhpcy5kYXRhID0gQXJyYXkuZnJvbShyYXdEYXRhKS5tYXAoKHZhbCkgPT4ge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmZpbHRlckRhdGFSb3codmFsKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgdGhpcy5zaXplT2ZSZWNvcmQgPSB0aGlzLmRhdGEubGVuZ3RoO1xuICAgICAgICAgICAgdGhpcy5jdXJyZW50UG9zID0gLTE7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5kYXRhO1xuICAgICAgICB9KTtcbiAgICB9XG4gICAgcmVuZGVyKHNlYXJjaCkge1xuICAgICAgICByZXR1cm4gX19hd2FpdGVyKHRoaXMsIHZvaWQgMCwgdm9pZCAwLCBmdW5jdGlvbiogKCkge1xuICAgICAgICAgICAgY29uc3QgZGF0YSA9IHlpZWxkIHRoaXMudXBkYXRlKHNlYXJjaCk7XG4gICAgICAgICAgICBjb25zdCB0Ym9keSA9IHRoaXMuX2NyZWF0ZVRhYmxlQm9keShkYXRhKTtcbiAgICAgICAgICAgIHRoaXMuZWxlbWVudC5maW5kKFwidGJvZHlcIikuaHRtbChcIlwiKS5hcHBlbmQodGJvZHkuY2hpbGRyZW4oKSk7XG4gICAgICAgIH0pO1xuICAgIH1cbiAgICBzZXRFbGVtZW50KGVsKSB7XG4gICAgICAgIHRoaXMuZWxlbWVudCA9IGVsO1xuICAgIH1cbiAgICBnZXRFbGVtZW50KCkge1xuICAgICAgICByZXR1cm4gdGhpcy5lbGVtZW50O1xuICAgIH1cbiAgICBjdXJyZW50RGF0YSgpIHtcbiAgICAgICAgaWYgKCF0aGlzLmN1cnJlbnRSb3dEYXRhKSB7XG4gICAgICAgICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBPYmplY3QuYXNzaWduKHt9LCB0aGlzLmN1cnJlbnRSb3dEYXRhKTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogYXR0YWNoIGV2ZW50IG9mIGNob29zZVxuICAgICAqIEBwYXJhbSBjYWxsYmFjayBjYWxsYmFjayBmdW5jdGlvbiB3aGVuIHRoZSByb3cgb2YgcmVjb3JkIGlzIGNob29zZWRcbiAgICAgKi9cbiAgICBvbkNob29zZShjYWxsYmFjaykge1xuICAgICAgICB0aGlzLmZ1bmNPbkNob29zZSA9IGNhbGxiYWNrO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBhdHRhY2ggZXZlbnQgb2YgaG92ZXJcbiAgICAgKiBAcGFyYW0gY2FsbGJhY2sgY2FsbGJhY2sgZnVuY3Rpb24gd2hlbiB0aGUgcm93IG9mIHJlY29yZCBpcyBob3ZlciBvblxuICAgICAqL1xuICAgIG9uRm9jdXMoY2FsbGJhY2spIHtcbiAgICAgICAgdGhpcy5mdW5jT25Gb2N1cyA9IGNhbGxiYWNrO1xuICAgIH1cbiAgICBzZWxlY3REb3duKCkge1xuICAgICAgICBpZiAodGhpcy5jdXJyZW50UG9zIDwgdGhpcy5zaXplT2ZSZWNvcmQgLSAxKSB7XG4gICAgICAgICAgICArK3RoaXMuY3VycmVudFBvcztcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmVsZW1lbnQuZmluZChgdHJbZGF0YS1wb3M9JHt0aGlzLmN1cnJlbnRQb3N9XWApLmZvY3VzKCk7XG4gICAgfVxuICAgIHNlbGVjdFVwKCkge1xuICAgICAgICBpZiAodGhpcy5jdXJyZW50UG9zID4gMCkge1xuICAgICAgICAgICAgLS10aGlzLmN1cnJlbnRQb3M7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5lbGVtZW50LmZpbmQoYHRyW2RhdGEtcG9zPSR7dGhpcy5jdXJyZW50UG9zfV1gKS5mb2N1cygpO1xuICAgIH1cbiAgICBuZXh0UGFnZShzZWFyY2ggPSBcIlwiKSB7XG4gICAgICAgIHRoaXMub2Zmc2V0ICs9IHRoaXMubGltaXQ7XG4gICAgICAgIHRoaXMucmVuZGVyKHNlYXJjaCk7XG4gICAgfVxuICAgIHNldExpbWl0UGVyUGFnZShsaW1pdCkge1xuICAgICAgICB0aGlzLmxpbWl0ID0gbGltaXQ7XG4gICAgfVxuICAgIHNldE9mZnNldChvZmZzZXQpIHtcbiAgICAgICAgdGhpcy5vZmZzZXQgPSBvZmZzZXQ7XG4gICAgfVxuICAgIGZpbHRlckRhdGFSb3coZGF0YVJvdykge1xuICAgICAgICAvLyBub3RoaW5nIGhlcmUsIGp1c3QgcmF3XG4gICAgICAgIHJldHVybiBkYXRhUm93O1xuICAgIH1cbiAgICBfY3JlYXRlUm93KGRhdGFSb3csIHBvcykge1xuICAgICAgICBjb25zdCByb3cgPSAkKFwiPHRyLz5cIikuYXR0cihcInRhYmluZGV4XCIsIC0xKS5hdHRyKFwiZGF0YS1wb3NcIiwgcG9zKTtcbiAgICAgICAgZm9yIChjb25zdCBmaWVsZCBvZiBPYmplY3Qua2V5cyhkYXRhUm93KSkge1xuICAgICAgICAgICAgY29uc3QgY2VsbCA9ICQoXCI8dGQvPlwiKS5hdHRyKFwibmFtZVwiLCBmaWVsZCkudGV4dChkYXRhUm93W2ZpZWxkXSk7XG4gICAgICAgICAgICByb3cuYXBwZW5kKGNlbGwpO1xuICAgICAgICB9XG4gICAgICAgIC8vIGNob29zZSBldmVudFxuICAgICAgICB0aGlzLl9yb3dPbkNob29zZShyb3csICgpID0+IHtcbiAgICAgICAgICAgIHRoaXMuZnVuY09uQ2hvb3NlKGRhdGFSb3cpO1xuICAgICAgICB9KTtcbiAgICAgICAgLy8gaG92ZXIgZXZlbnRcbiAgICAgICAgcm93Lm9uKFwiY2xpY2sgZm9jdXNcIiwgKGUpID0+IHtcbiAgICAgICAgICAgIHRoaXMuZWxlbWVudC5maW5kKFwidHJcIikucmVtb3ZlQ2xhc3MoXCJhY3RpdmVcIik7XG4gICAgICAgICAgICByb3cuYWRkQ2xhc3MoXCJhY3RpdmVcIik7XG4gICAgICAgICAgICB0aGlzLmN1cnJlbnRQb3MgPSBwb3M7XG4gICAgICAgICAgICB0aGlzLmN1cnJlbnRSb3dEYXRhID0gZGF0YVJvdztcbiAgICAgICAgICAgIHRoaXMuZnVuY09uRm9jdXMoZGF0YVJvdyk7XG4gICAgICAgIH0pO1xuICAgICAgICB0aGlzLmN1c3RvbUNyZWF0ZVJvdyhyb3cpO1xuICAgICAgICByZXR1cm4gcm93O1xuICAgIH1cbiAgICBfY3JlYXRlVGFibGVCb2R5KGRhdGEpIHtcbiAgICAgICAgY29uc3QgdGJvZHkgPSAkKFwiPHRib2R5Lz5cIik7XG4gICAgICAgIGxldCBwb3MgPSAwO1xuICAgICAgICBmb3IgKGNvbnN0IHJvd0RhdGEgb2YgZGF0YSkge1xuICAgICAgICAgICAgY29uc3QgdHJvdyA9IHRoaXMuX2NyZWF0ZVJvdyhyb3dEYXRhLCBwb3MrKyk7XG4gICAgICAgICAgICB0Ym9keS5hcHBlbmQodHJvdyk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRib2R5O1xuICAgIH1cbiAgICBjdXN0b21DcmVhdGVSb3cocm93KSB7XG4gICAgICAgIC8vIG5vdGhpbmcgaGVyZSwgd2lsbCBjaGFuZ2UgaW4gaW5oZXJpdGFuY2VcbiAgICB9XG4gICAgX3Jvd09uQ2hvb3NlKHJvdywgY2FsbGJhY2spIHtcbiAgICAgICAgcm93Lm9uKFwia2V5ZG93blwiLCAoZSkgPT4ge1xuICAgICAgICAgICAgaWYgKGUua2V5Q29kZSA9PT0gMTMpIHtcbiAgICAgICAgICAgICAgICBjYWxsYmFjaygpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgcm93Lm9uKFwiZGJsY2xpY2tcIiwgKCkgPT4ge1xuICAgICAgICAgICAgY2FsbGJhY2soKTtcbiAgICAgICAgfSk7XG4gICAgfVxufVxuZXhwb3J0cy5WaWV3VGFibGUgPSBWaWV3VGFibGU7XG4vLyMgc291cmNlTWFwcGluZ1VSTD1WaWV3VGFibGUuanMubWFwIiwiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5mdW5jdGlvbiBnZXRGb3JtVmFsdWUoZm9ybSkge1xuICAgIGNvbnN0IGFyciA9IGZvcm0uc2VyaWFsaXplQXJyYXkoKTtcbiAgICBjb25zdCB2YWwgPSB7fTtcbiAgICBmb3IgKGNvbnN0IGlucHV0IG9mIGFycikge1xuICAgICAgICB2YWxbaW5wdXQubmFtZV0gPSBpbnB1dC52YWx1ZTtcbiAgICB9XG4gICAgcmV0dXJuIHZhbDtcbn1cbmV4cG9ydHMuZ2V0Rm9ybVZhbHVlID0gZ2V0Rm9ybVZhbHVlO1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9Zm9ybVZhbC5qcy5tYXAiLCJcInVzZSBzdHJpY3RcIjtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmNvbnN0IEF1dG9Db21wbGV0ZV8xID0gcmVxdWlyZShcIi4uL0F1dG9Db21wbGV0ZVwiKTtcbmNvbnN0IGZvcm1WYWxfMSA9IHJlcXVpcmUoXCIuLi9mb3JtVmFsXCIpO1xuZnVuY3Rpb24gaW5pdChhcHApIHtcbiAgICBoYW5kbGVUZW5UaHVvY0lucHV0KGFwcCk7XG4gICAgaGFuZGxlRG9uVmlTZWxlY3RJbnB1dChhcHApO1xufVxuZXhwb3J0cy5hZGRUaHVvY0hhbmRsZSA9IGluaXQ7XG5mdW5jdGlvbiBoYW5kbGVUZW5UaHVvY0lucHV0KGFwcCkge1xuICAgIGNvbnN0IGF1dG9jb21wbGV0ZSA9IG5ldyBBdXRvQ29tcGxldGVfMS5BdXRvQ29tcGxldGUoXCJuaGFwX2hvYV9kb24tLXRlbl90aHVvY1wiLCBhcHAubW9kZWwudGh1b2MpO1xuICAgIGF1dG9jb21wbGV0ZS5zZXRMb29rdXAoW1wibWFcIiwgXCJ0ZW5cIiwgXCJuY2NcIiwgXCJkb25fdmlcIiwgXCJkb25fZ2lhXCJdKTtcbiAgICBhdXRvY29tcGxldGUubGlzdGVuKCk7XG4gICAgYXV0b2NvbXBsZXRlLm9uQ2hvb3NlKChkYXRhKSA9PiB7XG4gICAgICAgICQoXCIjbmhhcF9ob2FfZG9uLS1tYV90aHVvY1wiKS52YWwoZGF0YS5tYSk7XG4gICAgICAgICQoXCIjbmhhcF9ob2FfZG9uLS10ZW5fdGh1b2NcIikudmFsKGRhdGEudGVuKTtcbiAgICAgICAgJChcIiNuaGFwX2hvYV9kb24tLW5jY1wiKS52YWwoZGF0YS5uY2MpO1xuICAgICAgICAkKFwiI25oYXBfaG9hX2Rvbi0tZ2lhXCIpLnZhbChkYXRhLmRvbl9naWEpO1xuICAgICAgICAkKFwiI25oYXBfaG9hX2Rvbi0tZG9uX3ZpXCIpLnZhbChkYXRhLmRvbl92aSk7XG4gICAgfSk7XG59XG5mdW5jdGlvbiBoYW5kbGVEb25WaVNlbGVjdElucHV0KGFwcCkge1xuICAgIGFwcC5tb2RlbC5kb25WaS5yZW5kZXJTZWxlY3RJbnB1dCgkKFwiI25oYXBfaG9hX2Rvbi0tZG9uX3ZpXCIpKTtcbn1cbmZ1bmN0aW9uIGhhbmRsZUZvcm0oYXBwKSB7XG4gICAgJChcIiNuaGFwX2hvYV9kb24tLXRoZW1fdGh1b2NcIikub24oXCJzdWJtaXRcIiwgKGUpID0+IHtcbiAgICAgICAgY29uc3QgZm9ybSA9ICQoZS50YXJnZXQpO1xuICAgICAgICBjb25zdCBkYXRhID0gZm9ybVZhbF8xLmdldEZvcm1WYWx1ZShmb3JtKTtcbiAgICAgICAgYWxlcnQoSlNPTi5zdHJpbmdpZnkoZGF0YSkpO1xuICAgIH0pO1xufVxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9YWRkVGh1b2NIYW5kbGUuanMubWFwIiwiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5jb25zdCBhZGRUaHVvY0hhbmRsZV8xID0gcmVxdWlyZShcIi4vYWRkVGh1b2NIYW5kbGVcIik7XG5mdW5jdGlvbiBpbml0KGFwcCkge1xuICAgIGFkZFRodW9jSGFuZGxlXzEuYWRkVGh1b2NIYW5kbGUoYXBwKTtcbn1cbmV4cG9ydHMuaW5pdCA9IGluaXQ7XG4vLyMgc291cmNlTWFwcGluZ1VSTD1pbmRleC5qcy5tYXAiLCJcInVzZSBzdHJpY3RcIjtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmNvbnN0IHRodW9jX21vZGFsXzEgPSByZXF1aXJlKFwiLi90aHVvYy1tb2RhbFwiKTtcbmNvbnN0IFBBR0VfSUQgPSBcInBhZ2UtbmhhcC10aHVvY1wiO1xuY2xhc3MgSW5pdCB7XG4gICAgY29uc3RydWN0b3IoYXBwKSB7XG4gICAgICAgIHRoaXMuYXBwID0gYXBwO1xuICAgICAgICBhcHAudmlldy50aHVvYy5zZXRFbGVtZW50KCQoXCIjbmhhcF90aHVvYy0tdGFibGVcIikpO1xuICAgICAgICBhcHAudmlldy50aHVvYy5zZXRMaW1pdFBlclBhZ2UoMTAwKTtcbiAgICAgICAgYXBwLnZpZXcudGh1b2Mub25DaG9vc2UoKGRhdGEpID0+IHtcbiAgICAgICAgICAgIHRoaXMuYWRkVGh1b2MoZGF0YSk7XG4gICAgICAgIH0pO1xuICAgICAgICBhcHAudmlldy50aHVvYy5vbkZvY3VzKChkYXRhKSA9PiB7XG4gICAgICAgICAgICAkKFwiLnRodW9jLS1idXR0b25cIikucmVtb3ZlQXR0cihcImRpc2FibGVkXCIpO1xuICAgICAgICB9KTtcbiAgICAgICAgYXBwLnZpZXcudGh1b2Mub25Db250ZXh0QWRkKCgpID0+IHtcbiAgICAgICAgICAgIHRoaXMuYWRkVGh1b2MoYXBwLnZpZXcudGh1b2MuY3VycmVudERhdGEoKSk7XG4gICAgICAgIH0pO1xuICAgICAgICBhcHAudmlldy50aHVvYy5vbkNvbnRleHRFZGl0KCgpID0+IHtcbiAgICAgICAgICAgIHRoaXMuZWRpdFRodW9jKGFwcC52aWV3LnRodW9jLmN1cnJlbnREYXRhKCkpO1xuICAgICAgICB9KTtcbiAgICAgICAgYXBwLnZpZXcudGh1b2Mub25Db250ZXh0RWRpdFByaWNlKCgpID0+IHtcbiAgICAgICAgICAgIHRoaXMuZWRpdFByaWNlVGh1b2MoYXBwLnZpZXcudGh1b2MuY3VycmVudERhdGEoKSk7XG4gICAgICAgIH0pO1xuICAgICAgICBhcHAudmlldy50aHVvYy5yZW5kZXIoXCJcIik7XG4gICAgICAgIHRoaXMuaGFuZGxlQ29udHJvbEtleShhcHApO1xuICAgICAgICB0aGlzLmhhbmRsZVNlbGVjdEtleShhcHApO1xuICAgICAgICB0aGlzLmhhbmRsZU1vZGFsRXZlbnQoKTtcbiAgICAgICAgdGhpcy5oYW5kbGVTZWFyY2hJbnB1dCgpO1xuICAgICAgICBjb25zdCAkdGhpcyA9IHRoaXM7XG4gICAgICAgICQoXCIudGh1b2MtLWJ1dHRvblwiKS5vbihcImNsaWNrXCIsIGZ1bmN0aW9uIEJ1dHRvbkNsaWNrKCkge1xuICAgICAgICAgICAgY29uc3Qgcm9sZSA9ICQodGhpcykuYXR0cihcImFwcC1yb2xlXCIpO1xuICAgICAgICAgICAgc3dpdGNoIChyb2xlKSB7XG4gICAgICAgICAgICAgICAgY2FzZSBcIm5ld1wiOlxuICAgICAgICAgICAgICAgICAgICAkdGhpcy5uZXdUaHVvYygpO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBjYXNlIFwiZWRpdFwiOlxuICAgICAgICAgICAgICAgICAgICAkdGhpcy5lZGl0VGh1b2MoYXBwLnZpZXcudGh1b2MuY3VycmVudERhdGEoKSk7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGNhc2UgXCJhZGRcIjpcbiAgICAgICAgICAgICAgICAgICAgJHRoaXMuYWRkVGh1b2MoYXBwLnZpZXcudGh1b2MuY3VycmVudERhdGEoKSk7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGNhc2UgXCJjaGluaC1naWFcIjpcbiAgICAgICAgICAgICAgICAgICAgJHRoaXMuZWRpdFByaWNlVGh1b2MoYXBwLnZpZXcudGh1b2MuY3VycmVudERhdGEoKSk7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9XG4gICAgaGFuZGxlU2VsZWN0S2V5KGFwcCkge1xuICAgICAgICBhcHAub25TaG9ydGN1dEtleShcIkFycm93VXBcIiwgUEFHRV9JRCwgKGUpID0+IHtcbiAgICAgICAgICAgIHRoaXMuYXBwLnZpZXcudGh1b2Muc2VsZWN0VXAoKTtcbiAgICAgICAgfSk7XG4gICAgICAgIGFwcC5vblNob3J0Y3V0S2V5KFwiQXJyb3dEb3duXCIsIFBBR0VfSUQsIChlKSA9PiB7XG4gICAgICAgICAgICB0aGlzLmFwcC52aWV3LnRodW9jLnNlbGVjdERvd24oKTtcbiAgICAgICAgfSk7XG4gICAgfVxuICAgIGhhbmRsZUNvbnRyb2xLZXkoYXBwKSB7XG4gICAgICAgIGFwcC5vblNob3J0Y3V0S2V5KFwiY3RybCtkXCIsIFBBR0VfSUQsIChlKSA9PiB7XG4gICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICB0aGlzLm5ld1RodW9jKCk7XG4gICAgICAgIH0pO1xuICAgICAgICBhcHAub25TaG9ydGN1dEtleShcImN0cmwrZVwiLCBQQUdFX0lELCAoZSkgPT4ge1xuICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgdGhpcy5lZGl0VGh1b2ModGhpcy5hcHAudmlldy50aHVvYy5jdXJyZW50RGF0YSgpKTtcbiAgICAgICAgfSk7XG4gICAgICAgIGFwcC5vblNob3J0Y3V0S2V5KFwiY3RybCtnXCIsIFBBR0VfSUQsIChlKSA9PiB7XG4gICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICB0aGlzLmVkaXRQcmljZVRodW9jKHRoaXMuYXBwLnZpZXcudGh1b2MuY3VycmVudERhdGEoKSk7XG4gICAgICAgIH0pO1xuICAgICAgICBhcHAub25TaG9ydGN1dEtleShcImN0cmwrZlwiLCBQQUdFX0lELCAoZSkgPT4ge1xuICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgJChcIiN0aHVvYy0tc2VhcmNoXCIpLmZvY3VzKCk7XG4gICAgICAgIH0pO1xuICAgIH1cbiAgICBoYW5kbGVTZWFyY2hJbnB1dCgpIHtcbiAgICAgICAgY29uc3QgJHRoaXMgPSB0aGlzO1xuICAgICAgICAkKFwiI3RodW9jLS1zZWFyY2hcIikub24oXCJrZXl1cFwiLCBmdW5jdGlvbiBTZWFyY2hpbmcoKSB7XG4gICAgICAgICAgICBjb25zdCB2YWwgPSAkKHRoaXMpLnZhbCgpO1xuICAgICAgICAgICAgJHRoaXMuYXBwLnZpZXcudGh1b2MucmVuZGVyKHZhbCk7XG4gICAgICAgIH0pO1xuICAgIH1cbiAgICBoYW5kbGVNb2RhbEV2ZW50KCkge1xuICAgICAgICB0aGlzLmFkZE1vZGFsID0gbmV3IHRodW9jX21vZGFsXzEuQWRkVGh1b2NNb2RhbChcInRodW9jLS1hZGQtbW9kYWxcIiwgdGhpcy5hcHApO1xuICAgICAgICB0aGlzLm5ld01vZGFsID0gbmV3IHRodW9jX21vZGFsXzEuTmV3VGh1b2NNb2RhbChcInRodW9jLS1uZXctbW9kYWxcIiwgdGhpcy5hcHApO1xuICAgICAgICB0aGlzLmVkaXRNb2RhbCA9IG5ldyB0aHVvY19tb2RhbF8xLkVkaXRUaHVvY01vZGFsKFwidGh1b2MtLWVkaXQtbW9kYWxcIiwgdGhpcy5hcHApO1xuICAgICAgICB0aGlzLmVkaXRQcmljZU1vZGFsID0gbmV3IHRodW9jX21vZGFsXzEuRWRpdFByaWNlVGh1b2NNb2RhbChcInRodW9jLS1lZGl0LXByaWNlLW1vZGFsXCIsIHRoaXMuYXBwKTtcbiAgICB9XG4gICAgZWRpdFRodW9jKGRhdGEpIHtcbiAgICAgICAgaWYgKCFkYXRhKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5lZGl0TW9kYWwuc2hvdyhkYXRhKTtcbiAgICB9XG4gICAgbmV3VGh1b2MoKSB7XG4gICAgICAgICQoXCIjdGh1b2MtLW5ldy1tb2RhbFwiKS5tb2RhbChcInNob3dcIik7XG4gICAgfVxuICAgIGFkZFRodW9jKGRhdGEpIHtcbiAgICAgICAgaWYgKCFkYXRhKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgJChcIiN0aHVvYy0tYWRkLW1vZGFsXCIpLm1vZGFsKFwic2hvd1wiKTtcbiAgICAgICAgJChcIiN0aHVvYy0tYWRkLW1hdGh1b2NcIikudmFsKGRhdGEubWEpO1xuICAgICAgICAkKFwiI3RodW9jLS1hZGQtdGVudGh1b2NcIikudmFsKGRhdGEudGVuKTtcbiAgICAgICAgJChcIiN0aHVvYy0tYWRkLW5jY1wiKS52YWwoZGF0YS50ZW5fbmNjKTtcbiAgICAgICAgJChcIiN0aHVvYy0tYWRkLXNvbHVvbmdcIikudmFsKGRhdGEuc29fbHVvbmcpO1xuICAgIH1cbiAgICBlZGl0UHJpY2VUaHVvYyhkYXRhKSB7XG4gICAgICAgIGlmICghZGF0YSkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgICQoXCIjdGh1b2MtLWVkaXQtcHJpY2UtbW9kYWxcIikubW9kYWwoXCJzaG93XCIpO1xuICAgICAgICAkKFwiI3RodW9jLS1lZGl0LXByaWNlLW1hdGh1b2NcIikudmFsKGRhdGEubWEpO1xuICAgICAgICAkKFwiI3RodW9jLS1lZGl0LXByaWNlLXRlbnRodW9jXCIpLnZhbChkYXRhLnRlbik7XG4gICAgfVxufVxuZnVuY3Rpb24gaW5pdChhcHApIHtcbiAgICByZXR1cm4gbmV3IEluaXQoYXBwKTtcbn1cbmV4cG9ydHMuaW5pdCA9IGluaXQ7XG4vLyMgc291cmNlTWFwcGluZ1VSTD1pbmRleC5qcy5tYXAiLCJcInVzZSBzdHJpY3RcIjtcbnZhciBfX2F3YWl0ZXIgPSAodGhpcyAmJiB0aGlzLl9fYXdhaXRlcikgfHwgZnVuY3Rpb24gKHRoaXNBcmcsIF9hcmd1bWVudHMsIFAsIGdlbmVyYXRvcikge1xuICAgIHJldHVybiBuZXcgKFAgfHwgKFAgPSBQcm9taXNlKSkoZnVuY3Rpb24gKHJlc29sdmUsIHJlamVjdCkge1xuICAgICAgICBmdW5jdGlvbiBmdWxmaWxsZWQodmFsdWUpIHsgdHJ5IHsgc3RlcChnZW5lcmF0b3IubmV4dCh2YWx1ZSkpOyB9IGNhdGNoIChlKSB7IHJlamVjdChlKTsgfSB9XG4gICAgICAgIGZ1bmN0aW9uIHJlamVjdGVkKHZhbHVlKSB7IHRyeSB7IHN0ZXAoZ2VuZXJhdG9yW1widGhyb3dcIl0odmFsdWUpKTsgfSBjYXRjaCAoZSkgeyByZWplY3QoZSk7IH0gfVxuICAgICAgICBmdW5jdGlvbiBzdGVwKHJlc3VsdCkgeyByZXN1bHQuZG9uZSA/IHJlc29sdmUocmVzdWx0LnZhbHVlKSA6IG5ldyBQKGZ1bmN0aW9uIChyZXNvbHZlKSB7IHJlc29sdmUocmVzdWx0LnZhbHVlKTsgfSkudGhlbihmdWxmaWxsZWQsIHJlamVjdGVkKTsgfVxuICAgICAgICBzdGVwKChnZW5lcmF0b3IgPSBnZW5lcmF0b3IuYXBwbHkodGhpc0FyZywgX2FyZ3VtZW50cyB8fCBbXSkpLm5leHQoKSk7XG4gICAgfSk7XG59O1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuY2xhc3MgQWRkVGh1b2NNb2RhbCB7XG4gICAgY29uc3RydWN0b3IoaWQsIGFwcCkge1xuICAgICAgICB0aGlzLmFwcCA9IGFwcDtcbiAgICAgICAgdGhpcy5wb3B1cCA9ICQoXCIjXCIgKyBpZCk7XG4gICAgICAgIHRoaXMucG9wdXAubG9hZChcIi9sYXlvdXRzL21vZGFsLWFkZC10aHVvYy5odG1sXCIsICgpID0+IHtcbiAgICAgICAgICAgIHRoaXMucG9wdXAuZmluZChcImZvcm1cIikub24oXCJzdWJtaXRcIiwgKGUpID0+IHtcbiAgICAgICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICAgICAgdGhpcy5mb3JtU3VibWl0SGFuZGxlKGUpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgIH1cbiAgICBmb3JtU3VibWl0SGFuZGxlKGUpIHtcbiAgICAgICAgcmV0dXJuIF9fYXdhaXRlcih0aGlzLCB2b2lkIDAsIHZvaWQgMCwgZnVuY3Rpb24qICgpIHtcbiAgICAgICAgICAgIGNvbnN0IGZvcm0gPSAkKGUudGFyZ2V0KTtcbiAgICAgICAgICAgIGNvbnN0IGRhdGEgPSB7XG4gICAgICAgICAgICAgICAgbWE6IGZvcm0uZmluZChcIltuYW1lPW1hXVwiKS52YWwoKSxcbiAgICAgICAgICAgICAgICBzb19sdW9uZzogK2Zvcm0uZmluZChcIltuYW1lPSdzb19sdW9uZyddXCIpLnZhbCgpLFxuICAgICAgICAgICAgICAgIHRvbmdfZ2lhOiArZm9ybS5maW5kKFwiW25hbWU9J3RvbmdfZ2lhJ11cIikudmFsKCksXG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICBjb25zdCByZXMgPSB5aWVsZCB0aGlzLmFwcC5tb2RlbC50aHVvYy5hZGQoZGF0YS5tYSwgZGF0YS5zb19sdW9uZywgZGF0YS50b25nX2dpYSk7XG4gICAgICAgICAgICAgICAgYWxlcnQoXCJzdWNjZXNzOiBcIiArIHJlcy5tYSArIFwiPT5cIiArIHJlcy5zb19sdW9uZ19tb2kpO1xuICAgICAgICAgICAgICAgIHdpbmRvdy5sb2NhdGlvbi5yZWxvYWQoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNhdGNoIChlKSB7XG4gICAgICAgICAgICAgICAgYWxlcnQoXCJFcnJvcjogXCIgKyBlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfVxuICAgIHNob3coKSB7XG4gICAgICAgIHRoaXMucG9wdXAubW9kYWwoXCJzaG93XCIpO1xuICAgIH1cbiAgICBoaWRlKCkge1xuICAgICAgICB0aGlzLnBvcHVwLm1vZGFsKFwiaGlkZVwiKTtcbiAgICB9XG59XG5leHBvcnRzLkFkZFRodW9jTW9kYWwgPSBBZGRUaHVvY01vZGFsO1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9dGh1b2MtYWRkLW1vZGFsLmpzLm1hcCIsIlwidXNlIHN0cmljdFwiO1xudmFyIF9fYXdhaXRlciA9ICh0aGlzICYmIHRoaXMuX19hd2FpdGVyKSB8fCBmdW5jdGlvbiAodGhpc0FyZywgX2FyZ3VtZW50cywgUCwgZ2VuZXJhdG9yKSB7XG4gICAgcmV0dXJuIG5ldyAoUCB8fCAoUCA9IFByb21pc2UpKShmdW5jdGlvbiAocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgICAgIGZ1bmN0aW9uIGZ1bGZpbGxlZCh2YWx1ZSkgeyB0cnkgeyBzdGVwKGdlbmVyYXRvci5uZXh0KHZhbHVlKSk7IH0gY2F0Y2ggKGUpIHsgcmVqZWN0KGUpOyB9IH1cbiAgICAgICAgZnVuY3Rpb24gcmVqZWN0ZWQodmFsdWUpIHsgdHJ5IHsgc3RlcChnZW5lcmF0b3JbXCJ0aHJvd1wiXSh2YWx1ZSkpOyB9IGNhdGNoIChlKSB7IHJlamVjdChlKTsgfSB9XG4gICAgICAgIGZ1bmN0aW9uIHN0ZXAocmVzdWx0KSB7IHJlc3VsdC5kb25lID8gcmVzb2x2ZShyZXN1bHQudmFsdWUpIDogbmV3IFAoZnVuY3Rpb24gKHJlc29sdmUpIHsgcmVzb2x2ZShyZXN1bHQudmFsdWUpOyB9KS50aGVuKGZ1bGZpbGxlZCwgcmVqZWN0ZWQpOyB9XG4gICAgICAgIHN0ZXAoKGdlbmVyYXRvciA9IGdlbmVyYXRvci5hcHBseSh0aGlzQXJnLCBfYXJndW1lbnRzIHx8IFtdKSkubmV4dCgpKTtcbiAgICB9KTtcbn07XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5jb25zdCBmb3JtVmFsXzEgPSByZXF1aXJlKFwiLi4vZm9ybVZhbFwiKTtcbmNvbnN0IEF1dG9Db21wbGV0ZV8xID0gcmVxdWlyZShcIi4uL0F1dG9Db21wbGV0ZVwiKTtcbmNsYXNzIEVkaXRUaHVvY01vZGFsIHtcbiAgICBjb25zdHJ1Y3RvcihpZCwgYXBwKSB7XG4gICAgICAgIHRoaXMuYXBwID0gYXBwO1xuICAgICAgICB0aGlzLnBvcHVwID0gJChcIiNcIiArIGlkKTtcbiAgICAgICAgdGhpcy5wb3B1cC5sb2FkKFwiL2xheW91dHMvbW9kYWwtZWRpdC10aHVvYy5odG1sXCIsICgpID0+IHtcbiAgICAgICAgICAgIHRoaXMucG9wdXAuZmluZChcImZvcm1cIikub24oXCJzdWJtaXRcIiwgKGUpID0+IHtcbiAgICAgICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICAgICAgdGhpcy5mb3JtU3VibWl0SGFuZGxlKGUpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB0aGlzLmhhbmRsZU5jY0lucHV0KHRoaXMucG9wdXAuZmluZChcIltuYW1lPW5jY11cIikpO1xuICAgICAgICAgICAgdGhpcy5oYW5kbGVEb25WaVNlbGVjdCh0aGlzLnBvcHVwLmZpbmQoXCJbbmFtZT1pZF9kb25fdmldXCIpKTtcbiAgICAgICAgfSk7XG4gICAgfVxuICAgIGZvcm1TdWJtaXRIYW5kbGUoZSkge1xuICAgICAgICByZXR1cm4gX19hd2FpdGVyKHRoaXMsIHZvaWQgMCwgdm9pZCAwLCBmdW5jdGlvbiogKCkge1xuICAgICAgICAgICAgY29uc3QgZm9ybSA9ICQoZS50YXJnZXQpO1xuICAgICAgICAgICAgY29uc3QgZGF0YSA9IGZvcm1WYWxfMS5nZXRGb3JtVmFsdWUoZm9ybSk7XG4gICAgICAgICAgICAvLyB0cnVvbmcgaG9wIHRoYXkgZG9pIG1hX3RodW9jLCBjYW4gMSBtYV90aHVvYyB0cnVvYyBkZSB1cGRhdGVcbiAgICAgICAgICAgIGNvbnN0IG1hVGh1b2NEZVVwZGF0ZSA9IGZvcm0uYXR0cihcImlkX3ZhbHVlXCIpO1xuICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICBjb25zdCByZXMgPSB5aWVsZCB0aGlzLmFwcC5tb2RlbC50aHVvYy51cGRhdGUobWFUaHVvY0RlVXBkYXRlLCBkYXRhKTtcbiAgICAgICAgICAgICAgICBhbGVydChcIlN1Y2Nlc3M6IFwiICsgcmVzICsgXCIgcmVjb3JkKHMpXCIpO1xuICAgICAgICAgICAgICAgIHdpbmRvdy5sb2NhdGlvbi5yZWxvYWQoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNhdGNoIChlKSB7XG4gICAgICAgICAgICAgICAgYWxlcnQoXCJFcnJvcjogXCIgKyBlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfVxuICAgIGhhbmRsZU5jY0lucHV0KHRhcmdldCkge1xuICAgICAgICBjb25zdCBhdXRvY29tcGxldGUgPSBuZXcgQXV0b0NvbXBsZXRlXzEuQXV0b0NvbXBsZXRlKHRhcmdldCwgdGhpcy5hcHAubW9kZWwubmNjKTtcbiAgICAgICAgYXV0b2NvbXBsZXRlLnNldExvb2t1cChbXCJ0ZW5cIl0pO1xuICAgICAgICBhdXRvY29tcGxldGUub25DaG9vc2UoKGRhdGEpID0+IHtcbiAgICAgICAgICAgIHRhcmdldC52YWwoZGF0YS50ZW4pO1xuICAgICAgICB9KTtcbiAgICAgICAgYXV0b2NvbXBsZXRlLmxpc3RlbigpO1xuICAgIH1cbiAgICBoYW5kbGVEb25WaVNlbGVjdCh0YXJnZXQpIHtcbiAgICAgICAgdGFyZ2V0Lmh0bWwoXCJcIik7XG4gICAgICAgIHRoaXMuYXBwLm1vZGVsLmRvblZpLnJlbmRlclNlbGVjdElucHV0KHRhcmdldCk7XG4gICAgfVxuICAgIHNob3coZGF0YSkge1xuICAgICAgICB0aGlzLnBvcHVwLmZpbmQoXCJmb3JtXCIpLmF0dHIoXCJpZF92YWx1ZVwiLCBkYXRhLm1hKTtcbiAgICAgICAgdGhpcy5wb3B1cC5maW5kKFwiW25hbWU9bWFdXCIpLnZhbChkYXRhLm1hKTtcbiAgICAgICAgdGhpcy5wb3B1cC5maW5kKFwiW25hbWU9dGVuXVwiKS52YWwoZGF0YS50ZW4pO1xuICAgICAgICB0aGlzLnBvcHVwLmZpbmQoXCJbbmFtZT1uY2NdXCIpLnZhbChkYXRhLnRlbl9uY2MpO1xuICAgICAgICB0aGlzLnBvcHVwLm1vZGFsKFwic2hvd1wiKTtcbiAgICB9XG4gICAgaGlkZSgpIHtcbiAgICAgICAgdGhpcy5wb3B1cC5tb2RhbChcImhpZGVcIik7XG4gICAgfVxufVxuZXhwb3J0cy5FZGl0VGh1b2NNb2RhbCA9IEVkaXRUaHVvY01vZGFsO1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9dGh1b2MtZWRpdC1tb2RhbC5qcy5tYXAiLCJcInVzZSBzdHJpY3RcIjtcbnZhciBfX2F3YWl0ZXIgPSAodGhpcyAmJiB0aGlzLl9fYXdhaXRlcikgfHwgZnVuY3Rpb24gKHRoaXNBcmcsIF9hcmd1bWVudHMsIFAsIGdlbmVyYXRvcikge1xuICAgIHJldHVybiBuZXcgKFAgfHwgKFAgPSBQcm9taXNlKSkoZnVuY3Rpb24gKHJlc29sdmUsIHJlamVjdCkge1xuICAgICAgICBmdW5jdGlvbiBmdWxmaWxsZWQodmFsdWUpIHsgdHJ5IHsgc3RlcChnZW5lcmF0b3IubmV4dCh2YWx1ZSkpOyB9IGNhdGNoIChlKSB7IHJlamVjdChlKTsgfSB9XG4gICAgICAgIGZ1bmN0aW9uIHJlamVjdGVkKHZhbHVlKSB7IHRyeSB7IHN0ZXAoZ2VuZXJhdG9yW1widGhyb3dcIl0odmFsdWUpKTsgfSBjYXRjaCAoZSkgeyByZWplY3QoZSk7IH0gfVxuICAgICAgICBmdW5jdGlvbiBzdGVwKHJlc3VsdCkgeyByZXN1bHQuZG9uZSA/IHJlc29sdmUocmVzdWx0LnZhbHVlKSA6IG5ldyBQKGZ1bmN0aW9uIChyZXNvbHZlKSB7IHJlc29sdmUocmVzdWx0LnZhbHVlKTsgfSkudGhlbihmdWxmaWxsZWQsIHJlamVjdGVkKTsgfVxuICAgICAgICBzdGVwKChnZW5lcmF0b3IgPSBnZW5lcmF0b3IuYXBwbHkodGhpc0FyZywgX2FyZ3VtZW50cyB8fCBbXSkpLm5leHQoKSk7XG4gICAgfSk7XG59O1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuY2xhc3MgRWRpdFByaWNlVGh1b2NNb2RhbCB7XG4gICAgY29uc3RydWN0b3IoaWQsIGFwcCkge1xuICAgICAgICB0aGlzLmFwcCA9IGFwcDtcbiAgICAgICAgdGhpcy5wb3B1cCA9ICQoXCIjXCIgKyBpZCk7XG4gICAgICAgIHRoaXMucG9wdXAubG9hZChcIi9sYXlvdXRzL21vZGFsLWVkaXQtcHJpY2UtdGh1b2MuaHRtbFwiLCAoKSA9PiB7XG4gICAgICAgICAgICAvL1xuICAgICAgICAgICAgdGhpcy5wb3B1cC5maW5kKFwiZm9ybVwiKS5vbihcInN1Ym1pdFwiLCAoZSkgPT4ge1xuICAgICAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgICAgICB0aGlzLmZvcm1TdWJtaXRIYW5kbGUoZSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgfVxuICAgIGZvcm1TdWJtaXRIYW5kbGUoZSkge1xuICAgICAgICByZXR1cm4gX19hd2FpdGVyKHRoaXMsIHZvaWQgMCwgdm9pZCAwLCBmdW5jdGlvbiogKCkge1xuICAgICAgICAgICAgY29uc3QgZm9ybSA9ICQoZS50YXJnZXQpO1xuICAgICAgICAgICAgY29uc3QgbWEgPSBcIlwiICsgZm9ybS5maW5kKFwiW25hbWU9bWFfdGh1b2NdXCIpLnZhbCgpO1xuICAgICAgICAgICAgY29uc3QgcHJpY2UgPSArZm9ybS5maW5kKFwiW25hbWU9cHJpY2VdXCIpLnZhbCgpO1xuICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICBjb25zdCByZXMgPSB5aWVsZCB0aGlzLmFwcC5tb2RlbC5iYW5nR2lhLmFkZChtYSwgcHJpY2UpO1xuICAgICAgICAgICAgICAgIGFsZXJ0KFwiU3VjY2Vzc1wiKTtcbiAgICAgICAgICAgICAgICB3aW5kb3cubG9jYXRpb24ucmVsb2FkKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjYXRjaCAoZXJyKSB7XG4gICAgICAgICAgICAgICAgYWxlcnQoXCJcIiArIGVycik7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH1cbiAgICBzaG93KCkge1xuICAgICAgICB0aGlzLnBvcHVwLm1vZGFsKFwic2hvd1wiKTtcbiAgICB9XG4gICAgaGlkZSgpIHtcbiAgICAgICAgdGhpcy5wb3B1cC5tb2RhbChcImhpZGVcIik7XG4gICAgfVxufVxuZXhwb3J0cy5FZGl0UHJpY2VUaHVvY01vZGFsID0gRWRpdFByaWNlVGh1b2NNb2RhbDtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPXRodW9jLWVkaXQtcHJpY2UtbW9kYWwuanMubWFwIiwiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5jb25zdCB0aHVvY19hZGRfbW9kYWxfMSA9IHJlcXVpcmUoXCIuL3RodW9jLWFkZC1tb2RhbFwiKTtcbmV4cG9ydHMuQWRkVGh1b2NNb2RhbCA9IHRodW9jX2FkZF9tb2RhbF8xLkFkZFRodW9jTW9kYWw7XG5jb25zdCB0aHVvY19lZGl0X21vZGFsXzEgPSByZXF1aXJlKFwiLi90aHVvYy1lZGl0LW1vZGFsXCIpO1xuZXhwb3J0cy5FZGl0VGh1b2NNb2RhbCA9IHRodW9jX2VkaXRfbW9kYWxfMS5FZGl0VGh1b2NNb2RhbDtcbmNvbnN0IHRodW9jX25ld19tb2RhbF8xID0gcmVxdWlyZShcIi4vdGh1b2MtbmV3LW1vZGFsXCIpO1xuZXhwb3J0cy5OZXdUaHVvY01vZGFsID0gdGh1b2NfbmV3X21vZGFsXzEuTmV3VGh1b2NNb2RhbDtcbmNvbnN0IHRodW9jX2VkaXRfcHJpY2VfbW9kYWxfMSA9IHJlcXVpcmUoXCIuL3RodW9jLWVkaXQtcHJpY2UtbW9kYWxcIik7XG5leHBvcnRzLkVkaXRQcmljZVRodW9jTW9kYWwgPSB0aHVvY19lZGl0X3ByaWNlX21vZGFsXzEuRWRpdFByaWNlVGh1b2NNb2RhbDtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPXRodW9jLW1vZGFsLmpzLm1hcCIsIlwidXNlIHN0cmljdFwiO1xudmFyIF9fYXdhaXRlciA9ICh0aGlzICYmIHRoaXMuX19hd2FpdGVyKSB8fCBmdW5jdGlvbiAodGhpc0FyZywgX2FyZ3VtZW50cywgUCwgZ2VuZXJhdG9yKSB7XG4gICAgcmV0dXJuIG5ldyAoUCB8fCAoUCA9IFByb21pc2UpKShmdW5jdGlvbiAocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgICAgIGZ1bmN0aW9uIGZ1bGZpbGxlZCh2YWx1ZSkgeyB0cnkgeyBzdGVwKGdlbmVyYXRvci5uZXh0KHZhbHVlKSk7IH0gY2F0Y2ggKGUpIHsgcmVqZWN0KGUpOyB9IH1cbiAgICAgICAgZnVuY3Rpb24gcmVqZWN0ZWQodmFsdWUpIHsgdHJ5IHsgc3RlcChnZW5lcmF0b3JbXCJ0aHJvd1wiXSh2YWx1ZSkpOyB9IGNhdGNoIChlKSB7IHJlamVjdChlKTsgfSB9XG4gICAgICAgIGZ1bmN0aW9uIHN0ZXAocmVzdWx0KSB7IHJlc3VsdC5kb25lID8gcmVzb2x2ZShyZXN1bHQudmFsdWUpIDogbmV3IFAoZnVuY3Rpb24gKHJlc29sdmUpIHsgcmVzb2x2ZShyZXN1bHQudmFsdWUpOyB9KS50aGVuKGZ1bGZpbGxlZCwgcmVqZWN0ZWQpOyB9XG4gICAgICAgIHN0ZXAoKGdlbmVyYXRvciA9IGdlbmVyYXRvci5hcHBseSh0aGlzQXJnLCBfYXJndW1lbnRzIHx8IFtdKSkubmV4dCgpKTtcbiAgICB9KTtcbn07XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5jb25zdCBmb3JtVmFsXzEgPSByZXF1aXJlKFwiLi4vZm9ybVZhbFwiKTtcbmNsYXNzIE5ld1RodW9jTW9kYWwge1xuICAgIGNvbnN0cnVjdG9yKGlkLCBhcHApIHtcbiAgICAgICAgdGhpcy5hcHAgPSBhcHA7XG4gICAgICAgIHRoaXMucG9wdXAgPSAkKFwiI1wiICsgaWQpO1xuICAgICAgICB0aGlzLnBvcHVwLmxvYWQoXCIvbGF5b3V0cy9tb2RhbC1uZXctdGh1b2MuaHRtbFwiLCAoKSA9PiB7XG4gICAgICAgICAgICB0aGlzLmFwcC5tb2RlbC5kb25WaS5yZW5kZXJTZWxlY3RJbnB1dCh0aGlzLnBvcHVwLmZpbmQoXCJbbmFtZT1pZF9kb25fdmldXCIpKTtcbiAgICAgICAgICAgIHRoaXMucG9wdXAuZmluZChcImZvcm1cIikub24oXCJzdWJtaXRcIiwgZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gX19hd2FpdGVyKHRoaXMsIHZvaWQgMCwgdm9pZCAwLCBmdW5jdGlvbiogKCkge1xuICAgICAgICAgICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGZvcm1WYWwgPSBmb3JtVmFsXzEuZ2V0Rm9ybVZhbHVlKCQodGhpcykpO1xuICAgICAgICAgICAgICAgICAgICB5aWVsZCBhcHAubW9kZWwudGh1b2MuY3JlYXRlKGZvcm1WYWwpLmNhdGNoKChlcnIpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGFsZXJ0KGVycik7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aHJvdyBlcnI7XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICBhbGVydChcInN1Y2Nlc3NcIik7XG4gICAgICAgICAgICAgICAgICAgIHdpbmRvdy5sb2NhdGlvbi5yZWxvYWQoKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICB9XG4gICAgc2hvdygpIHtcbiAgICAgICAgdGhpcy5wb3B1cC5tb2RhbChcInNob3dcIik7XG4gICAgfVxuICAgIGhpZGUoKSB7XG4gICAgICAgIHRoaXMucG9wdXAubW9kYWwoXCJoaWRlXCIpO1xuICAgIH1cbn1cbmV4cG9ydHMuTmV3VGh1b2NNb2RhbCA9IE5ld1RodW9jTW9kYWw7XG4vLyMgc291cmNlTWFwcGluZ1VSTD10aHVvYy1uZXctbW9kYWwuanMubWFwIiwiY29uc3Qge0FwcH0gPSByZXF1aXJlKCcuLi9hcHAvQXBwJyk7XG5cbiQoZG9jdW1lbnQpLnJlYWR5KCgpPT57XG4gICAgY29uc3QgYXBwID0gbmV3IEFwcCgpO1xuXG4gICAgcmVxdWlyZShcIi4uL2FwcC9uaGFwLWhvYS1kb25cIikuaW5pdChhcHApO1xuICAgIHJlcXVpcmUoXCIuLi9hcHAvbmhhcC10aHVvY1wiKS5pbml0KGFwcCk7XG59KTtcbiJdfQ==
