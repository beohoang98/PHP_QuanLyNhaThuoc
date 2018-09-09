import { BootstrapModal } from "../Model/BootstrapModal";
import { App } from "../App";

class AddThuocModal {
    private popup: JQuery<HTMLElement>;
    private app: App;

    constructor(id: string, app: App) {
        this.app = app;
        this.popup = $("#" + id);
        this.popup.load("/layouts/modal-add-thuoc.html", () => {
            this.popup.find("form").on("submit", (e: JQuery.Event) => {
                e.preventDefault();
                this.formSubmitHandle(e);
            });
        });
    }

    public async formSubmitHandle(e: JQuery.Event) {
        const form = $(e.target);
        const data = {
            ma: form.find("[name=ma]").val(),
            so_luong: +form.find("[name='so_luong']").val(),
            tong_gia: +form.find("[name='tong_gia']").val(),
        };

        try {
            const res = await this.app.thuoc.add(data.ma, data.so_luong, data.tong_gia);

            alert("success: " + res.ma + "=>" + res.so_luong_moi);
            window.location.reload();
        } catch (e) {
            alert("Error: " + e);
        }
    }

    public show() {
        this.popup.modal("show");
    }

    public hide() {
        this.popup.modal("hide");
    }
}

export {AddThuocModal};
