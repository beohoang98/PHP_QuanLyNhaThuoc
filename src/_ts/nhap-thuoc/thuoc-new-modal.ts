import { BootstrapModal } from "../Model/BootstrapModal";
import { App } from "../App";
import { getFormValue } from "../formVal";

class NewThuocModal {
    private popup: JQuery<HTMLElement>;
    private app: App;

    constructor(id: string, app: App) {
        this.app = app;

        this.popup = $("#" + id);
        this.popup.load("/layouts/modal-new-thuoc.html", () => {
            this.app.donVi.renderSelectInput(this.popup.find("[name=id_don_vi]"));

            this.popup.find("form").on("submit", async function(e: JQuery.Event) {
                e.preventDefault();
                const formVal = getFormValue($(this));
                await app.thuoc.create(formVal).catch((err) => {
                    alert(err);
                    throw err;
                });
                alert("success");
                window.location.reload();
            });
        });
    }

    public show() {
        this.popup.modal("show");
    }

    public hide() {
        this.popup.modal("hide");
    }
}

export {NewThuocModal};
