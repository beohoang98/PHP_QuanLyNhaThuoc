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
class _DonVi extends ModelClass_1.Model {
    constructor() {
        super();
        this._database = "/api/don_vi/";
        this._fetchData = null;
    }
    get(callback = (err, data) => { }) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const data = yield this._get({});
                this._fetchData = this._filter(data);
                callback(false, this._fetchData);
                return this._fetchData;
            }
            catch (err) {
                callback(err);
            }
        });
    }
    _filter(rawData) {
        let newData = rawData.slice();
        let map = {};
        for (let row of newData) {
            let heso = row['he_so_quydoi'];
            map[row['id']] = row;
            row['textQuyDoi'] = heso ? "" : "đơn vị cơ bản";
        }
        for (let row of newData) {
            let id_co_ban = row['id_quy_doi'];
            let heso = +row['he_so_quydoi'];
            while (map.hasOwnProperty(id_co_ban)) {
                row['textQuyDoi'] += `=${heso}x[${map[id_co_ban]['ten']}]`;
                heso *= +map[id_co_ban]['he_so_quydoi'];
                id_co_ban = map[id_co_ban]['id_quy_doi'];
            }
        }
        return newData;
    }
}
exports.DonVi = _DonVi;
//# sourceMappingURL=index.js.map