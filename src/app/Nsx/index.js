"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Model_1 = require("../Model");
class _Nsx extends Model_1.Model {
    constructor() {
        super();
        this._database = "/public/api/nsx/";
    }
    update(callback) {
        let $this = this;
        $this._get({}, function (err, data) {
            if (err) {
                console.log(err);
                return;
            }
            callback(false, data);
        });
    }
}
exports.Nsx = _Nsx;
//# sourceMappingURL=index.js.map