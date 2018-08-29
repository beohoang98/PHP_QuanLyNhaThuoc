import { BootstrapModal } from "../Model/BootstrapModal";
import { Thuoc } from "../Model/Thuoc";

class AddThuocModal {
    private popup: JQuery<HTMLElement>;
    private model: Thuoc;

    constructor(id: string, model: Thuoc) {
        this.model = model;
        this.popup = $("#" + id);
        this.popup.load("/layouts/modal-add-thuoc.html");
    }

    public show() {
        this.popup.modal("show");
    }

    public hide() {
        this.popup.modal("hide");
    }
}

export {AddThuocModal};
