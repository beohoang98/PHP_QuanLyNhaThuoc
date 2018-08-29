"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class EditThuocModal {
    constructor(id, model) {
        this.model = model;
        this.popup = $("#" + id);
        this.popup.load("/layouts/modal-edit-thuoc.html");
    }
    show() {
        this.popup.modal("show");
    }
    hide() {
        this.popup.modal("hide");
    }
}
exports.EditThuocModal = EditThuocModal;
//# sourceMappingURL=thuoc-edit-modal.js.map