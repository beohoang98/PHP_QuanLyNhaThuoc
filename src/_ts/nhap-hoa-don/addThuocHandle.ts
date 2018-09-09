import { App } from "../App";
import { AutoComplete } from "../AutoComplete";

function init(app: App) {
    handleTenThuocInput(app);
    handleDonViSelectInput(app);
}

function handleTenThuocInput(app: App) {
    const autocomplete = new AutoComplete("nhap_hoa_don--ten_thuoc", app.thuoc);
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
    app.donVi.renderSelectInput($("#nhap_hoa_don--don_vi"));
}

export {init as addThuocHandle};
