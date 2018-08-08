"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Model_js_1 = require("./Model.js");
const _Nsx = class extends Model_js_1.Model {
    constructor() {
        super();
        this._database = "/public/api/getNsx.php";
    }
    update(callback) {
        let $this = this;
        $this._update(function (err, data) {
            if (err != null) {
                console.log(err);
                return;
            }
            callback(false, data);
        });
    }
};
exports.Nsx = _Nsx;
