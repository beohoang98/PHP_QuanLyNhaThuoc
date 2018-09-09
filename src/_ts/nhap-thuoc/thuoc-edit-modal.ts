import { getFormValue } from "../formVal";
import { App } from "../App";
import { AutoComplete } from "../AutoComplete";

class EditThuocModal {
    private popup: JQuery<HTMLElement>;
    private app: App;

    constructor(id: string, app: App) {
        this.app = app;
        this.popup = $("#" + id);
        this.popup.load("/layouts/modal-edit-thuoc.html", () => {
            this.popup.find("form").on("submit", (e: JQuery.Event) => {
                e.preventDefault();
                this.formSubmitHandle(e);
            });

            this.handleNccInput(this.popup.find("[name=ncc]"));
            this.handleDonViSelect(this.popup.find("[name=id_don_vi]"));
        });
    }

    public async formSubmitHandle(e: JQuery.Event) {
        const form = $(e.target) as JQuery<HTMLElement>;
        const data = getFormValue(form);

        // truong hop thay doi ma_thuoc, can 1 ma_thuoc truoc de update
        const maThuocDeUpdate = form.attr("id_value");

        try {
            const res = await this.app.thuoc.update(maThuocDeUpdate, data);

            alert("Success: " + res + " record(s)");
            window.location.reload();
        } catch (e) {
            alert("Error: " + e);
        }
    }

    public handleNccInput(target: JQuery<HTMLElement>) {
        const autocomplete = new AutoComplete(target, this.app.ncc);
        autocomplete.setLookup(["ten"]);
        autocomplete.onChoose((data) => {
            target.val(data.ten);
        });
        autocomplete.listen();
    }

    public handleDonViSelect(target: JQuery<HTMLElement>) {
        target.html("");
        this.app.donVi.renderSelectInput(target);
    }

    public show(data) {
        this.popup.find("form").attr("id_value", data.ma);
        this.popup.find("[name=ma]").val(data.ma);
        this.popup.find("[name=ten]").val(data.ten);
        this.popup.find("[name=ncc]").val(data.ten_ncc);
        this.popup.modal("show");
    }

    public hide() {
        this.popup.modal("hide");
    }
}

export {EditThuocModal};
