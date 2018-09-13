import { App } from "../App";
import { AutoComplete } from "../AutoComplete";
import { getFormValue } from "../formVal";
import { HoaDonNhap } from "../View/HoaDonNhap";

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
        $("#nhap_hoa_don--don_vi").val(data.id_don_vi);
    });
}

function handleDonViSelectInput(app: App) {
    app.model.donVi.renderSelectInput($("#nhap_hoa_don--don_vi"));
}

function handleForm(app: App) {
    app.view.hoaDon = new HoaDonNhap("nhap_hoa_don--table");
    app.view.hoaDon.onUpdateTongGia((gia) => {
        $("#nhap_hoa_don--tong_gia").val(gia);
    });
    $("#nhap_hoa_don--them_thuoc").on("submit", (e) => {
        e.preventDefault();
        const form = $(e.target) as JQuery<HTMLElement>;
        const data = getFormValue(form);
        form.find("input[type=text]").val("");
        form.find("input[name=ten_thuoc]").focus();
        app.view.hoaDon.addHoaDon({
            ma_thuoc: data.ma_thuoc,
            ten_thuoc: data.ten_thuoc,
            so_luong: data.so_luong,
            don_gia: data.don_gia,
            thanh_tien: data.don_gia * data.so_luong,
        });
    });

    $("input[name='kieu-ban']").on("change", function() {
        const kieu = "" + $(this).val();
        app.view.hoaDon.setKieu(kieu);
    });
}

export {init as addThuocHandle};
