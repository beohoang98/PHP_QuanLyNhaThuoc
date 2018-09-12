import { BootstrapModal } from "../Model/BootstrapModal";
import { Thuoc } from "../Model/Thuoc";
import { App } from "../App";

class EditPriceThuocModal {
    private popup: JQuery<HTMLElement>;
    private app: App;

    constructor(id: string, app: App) {
        this.app = app;
        this.popup = $("#" + id);
        this.popup.load("/layouts/modal-edit-price-thuoc.html", () => {
            //
            this.popup.find("form").on("submit", (e: JQuery.Event) => {
                e.preventDefault();
                this.formSubmitHandle(e);
            });
        });
    }

    public async formSubmitHandle(e: JQuery.Event) {
        const form = $(e.target) as JQuery<HTMLElement>;
        const ma = "" + form.find("[name=ma_thuoc]").val();
        const price = +form.find("[name=price]").val();

        try {
            const res = await this.app.model.bangGia.add(ma, price);
            alert("Success");
            window.location.reload();
        } catch (err) {
            alert("" + err);
        }
    }

    public show() {
        this.popup.modal("show");
    }

    public hide() {
        this.popup.modal("hide");
    }
}

export {EditPriceThuocModal};
