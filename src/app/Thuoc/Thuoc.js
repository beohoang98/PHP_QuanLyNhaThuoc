"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Model_1 = require("./Model");
class _Thuoc extends Model_1.Model {
    constructor() {
        super();
        this._database = "/public/api/getAllInfoThuoc.php";
    }
    update(callback) {
        let $this = this;
        $this._get({}, function (err, data) {
            if (err != null) {
                console.log(err);
                return;
            }
            callback(false, data);
        });
    }
}
exports.Thuoc = _Thuoc;
//# sourceMappingURL=Thuoc.js.map