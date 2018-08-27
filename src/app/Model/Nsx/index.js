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
class _Nsx extends ModelClass_1.Model {
    constructor() {
        super();
        this.database = "/api/ncc/";
    }
    /**
     * get data of nsx
     * @param callback callback function
     */
    get(params, offset, limit) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield this._get({ params, offset, limit });
            return data;
        });
    }
}
exports.Nsx = _Nsx;
//# sourceMappingURL=index.js.map