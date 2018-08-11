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
class _Model {
    constructor() {
        this._database = "";
        this._data = [];
    }
    get data() {
        return Object.assign({}, this._data);
    }
    get response() {
        return Object.assign({}, this._res);
    }
    /**
     * fetch data from database and do thing
     * @param params
     * @param callback callback function
     *
     */
    _get(params, callback) {
        return __awaiter(this, void 0, void 0, function* () {
            this._data = [];
            const requestURL = this._database + this._urlparams(params);
            try {
                const res = yield fetch(requestURL, { credentials: 'include' });
                const json = yield res.json();
                if (json.err) {
                    callback(json.msg);
                    return;
                }
                this._data = json.data;
                callback(false, json.data);
            }
            catch (err) {
                callback(err);
            }
        });
    }
    /**
     *
     * @param data
     * @param callback
     */
    _post(data, callback) {
        return __awaiter(this, void 0, void 0, function* () {
            this._res = "";
            try {
                const res = yield fetch(this._database, {
                    credentials: 'include',
                    method: "POST",
                    body: JSON.stringify(data),
                });
                const json = yield res.json();
                if (json.err) {
                    callback(json.msg);
                    return;
                }
                this._res = json.data;
                callback(false, json.data);
            }
            catch (err) {
                callback(err);
            }
        });
    }
    _urlparams(params) {
        const url = Object.keys(params).map(function (k) {
            return encodeURIComponent(k) + '=' + encodeURIComponent(params[k]);
        }).join('&');
        return url;
    }
}
exports.Model = _Model;
;
//# sourceMappingURL=index.js.map