import { App } from "../App";
import { AutoComplete } from "../AutoComplete";
import { getFormValue } from "../formVal";

function init(app: App) {
    handleTenThuocInput(app);
    handleDonViSelectInput(app);
    handleForm(app);
}

function handleTenThuocInput(app: App) {
    const autocomplete = new AutoComplete("nhap_hoa_don--ten_thuoc", app.model.thuoc);
    autocomplete.setLookup(["ma", "ten", "ncc", "don_vi", "don_gia"]);
    autocomplete.listen();
    autocomplete.onChoose((data) => {
        $("#nhap_hoa_don--ma_thuoc").val(data.ma);
        $("#nhap_hoa_don--ten_thuoc").val(data.ten);
        $("#nhap_hoa_don--ncc").val(data.ncc);
        $("#nhap_hoa_don--gia").val(data.don_gia);
        $("#nhap_hoa_don--don_vi").val(data.don_vi);
    });
}

function handleDonViSelectInput(app: App) {
    app.model.donVi.renderSelectInput($("#nhap_hoa_don--don_vi"));
}

function handleForm(app: App) {
    $("#nhap_hoa_don--them_thuoc").on("submit", (e) => {
        const form = $(e.target) as JQuery<HTMLElement>;
        const data = getFormValue(form);
        app.view.hoaDon.addCTHD(data);
        app.view.hoaDon.render();
    });
}

export {init as addThuocHandle};
