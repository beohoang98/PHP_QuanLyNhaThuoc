"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class AddThuocModal {
    constructor(id, model) {
        this.model = model;
        this.popup = $("#" + id);
        this.popup.load("/layouts/modal-add-thuoc.html");
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