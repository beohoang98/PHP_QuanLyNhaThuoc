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
class AddThuocModal {
    constructor(id, app) {
        this.app = app;
        this.popup = $("#" + id);
        this.popup.load("/layouts/modal-add-thuoc.html", () => {
            this.popup.find("form").on("submit", (e) => {
                e.preventDefault();
                this.formSubmitHandle(e);
            });
        });
    }
    formSubmitHandle(e) {
        return __awaiter(this, void 0, void 0, function* () {
            const form = $(e.target);
            const data = {
                ma: form.find("[name=ma]").val(),
                so_luong: +form.find("[name='so_luong']").val(),
                tong_gia: +form.find("[name='tong_gia']").val(),
            };
            try {
                const res = yield this.app.thuoc.add(data.ma, data.so_luong, data.tong_gia);
                alert("success: " + res.ma + "=>" + res.so_luong_moi);
                window.location.reload();
            }
            catch (e) {
                alert("Error: " + e);
            }
        });
    }
    show() {
        this.popup.modal("show");
    }
    hide() {
        this.popup.modal("hide");
    }
}
exports.AddThuocModal = AddThuocModal;
//# sourceMappingURL=thuoc-add-modal.js.map