"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ModelClass_1 = require("../ModelClass");
const BangThuoc_1 = require("./BangThuoc");
exports.BangThuoc = BangThuoc_1.BangThuoc;
class _Thuoc extends ModelClass_1.Model {
    constructor() {
        super();
        this._database = "/api/thuoc/";
    }
    get(callback) {
        let $this = this;
        $this._get({}, function (err, data) {
            if (err) {
                console.log(err);
                return;
            }
            callback(false, data);
        });
    }
    create(data, callback) {
        this._post(data, callback);
    }
}
exports.Thuoc = _Thuoc;
//# sourceMappingURL=index.js.map