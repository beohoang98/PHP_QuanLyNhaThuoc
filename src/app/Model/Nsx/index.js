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
        this._database = "/api/nsx/";
    }
    /**
     * get data of nsx
     * @param callback callback function
     */
    get(callback) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield this._get({}).catch((err) => {
                if (typeof callback === "function")
                    callback(err);
                else
                    throw err;
            });
            if (typeof callback === "function")
                callback(false, data);
            return data;
        });
    }
    update(callback) {
        return __awaiter(this, void 0, void 0, function* () {
        });
    }
    create(callback) {
        return __awaiter(this, void 0, void 0, function* () {
        });
    }
    remove(callback) {
        return __awaiter(this, void 0, void 0, function* () {
        });
    }
}
exports.Nsx = _Nsx;
//# sourceMappingURL=index.js.map