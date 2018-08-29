"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class NewThuocModal {
    constructor(id, model) {
        this.model = model;
        this.popup = $("#" + id);
        this.popup.load("/layouts/modal-new-thuoc.html");
    }
    show() {
        this.popup.modal("show");
    }
    hide() {
        this.popup.modal("hide");
    }
}
exports.NewThuocModal = NewThuocModal;
//# sourceMappingURL=thuoc-new-modal.js.map