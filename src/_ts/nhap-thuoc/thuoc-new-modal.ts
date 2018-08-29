import { BootstrapModal } from "../Model/BootstrapModal";
import { Thuoc } from "../Model/Thuoc";

class NewThuocModal {
    private popup: JQuery<HTMLElement>;
    private model: Thuoc;

    constructor(id: string, model: Thuoc) {
        this.model = model;
        this.popup = $("#" + id);
        this.popup.load("/layouts/modal-new-thuoc.html");
    }

    public show() {
        this.popup.modal("show");
    }

    public hide() {
        this.popup.modal("hide");
    }
}

export {NewThuocModal};
