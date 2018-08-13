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
const TableData_1 = require("../TableData");
class BangDonVi extends TableData_1.default {
    constructor() {
        super();
        this._dbURL = "/api/don_vi/";
    }
    update() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.getData();
            for (let row of this._list) {
                let id = row['id'];
                this._map[id] = {
                    data: row,
                    ten: row['ten'],
                    donvi_quydoi: null,
                    heso: null,
                    quydoiText: "đơn vị cơ bản",
                };
            }
            for (let id of Object.keys(this._map)) {
                let idCoban = this._map[id].data['id_quy_doi'];
                let heso = +this._map[id].data['he_so_quydoi'];
                if (idCoban == null) {
                    continue;
                }
                while (this._map[idCoban].data['id_quy_doi'] != null) {
                    heso *= +this._map[idCoban].data['he_so_quydoi'];
                    idCoban = this._map[idCoban].data['id_quy_doi'];
                }
                this._map[id]['donvi_quydoi'] = this._map[idCoban];
                this._map[id]['heso'] = heso;
                this._map[id]['quydoiText'] = "= " + heso + "x ["
                    + this._map[idCoban].ten + "]";
            }
        });
    }
}
exports.default = BangDonVi;
//# sourceMappingURL=BangDonVi.js.map