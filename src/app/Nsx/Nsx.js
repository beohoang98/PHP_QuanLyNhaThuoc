"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Model_1 = require("./Model");
class _Nsx extends Model_1.Model {
    constructor() {
        super();
        this._database = "/public/api/getNsx.php";
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
exports.Nsx = _Nsx;
//# sourceMappingURL=Nsx.js.map