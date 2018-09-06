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
            this.app.donVi.get((data) => {
                const selectInput = this.popup.find("[component='DonVi']");
                selectInput.children().remove();
                for (const row of data) {
                    const opt = $("<option/>").val(row.id).text(row.ten);
                    selectInput.append(opt);
                }
                selectInput.children().eq(0).attr("checked", "true");
            });

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
