import {getFormValue} from "../formVal";
import {BootstrapModal} from "../Model/BootstrapModal";
import {Thuoc} from "../Model/Thuoc";
import {ThuocTable} from "../View/ThuocTable";
import {AddThuocModal, EditThuocModal, NewThuocModal} from "./thuoc-modal";

const PAGE_ID = "page-nhap-thuoc";

class Init {
    public addModal;
    public newModal;
    public editModal;

    private app;
    private thuoc;
    private thuocTable;

    constructor(app) {
        const thuocTable = new ThuocTable();
        const thuoc = new Thuoc();
        this.thuocTable = thuocTable;
        this.thuoc = thuoc;
        this.app = app;

        thuocTable.setElement($("#nhap_thuoc--table"));
        thuocTable.render("");
        thuocTable.setLimitPerPage(100);
        thuocTable.onChoose((data) => {
            this.addThuoc(data);
        });
        thuocTable.onFocus((data) => {
            $(".thuoc--button").removeAttr("disabled");
        });
        thuocTable.onContextAdd(() => {
            this.addThuoc(thuocTable.currentData());
        });
        thuocTable.onContextEdit(() => {
            this.editThuoc(thuocTable.currentData());
        });
        thuocTable.onContextEditPrice(() => {
            //
        });

        this.handleControlKey(app);
        this.handleSelectKey(app);
        this.handleModalEvent();
        this.handleSearchInput();

        const $this = this;
        $(".thuoc--button").on("click", function ButtonClick() {
            const role = $(this).attr("app-role");
            switch (role) {
                case "new": $this.newThuoc(); break;
                case "edit": $this.editThuoc(thuocTable.currentData()); break;
                case "add": $this.addThuoc(thuocTable.currentData()); break;
                case "chinh-gia": break;
            }
        });
    }

    public handleSelectKey(app) {
        app.onShortcutKey("ArrowUp", PAGE_ID, (e) => {
            this.thuocTable.selectUp();
        });
        app.onShortcutKey("ArrowDown", PAGE_ID, (e) => {
            this.thuocTable.selectDown();
        });
    }

    public handleControlKey(app) {
        app.onShortcutKey("ctrl+d", PAGE_ID, (e) => {
            e.preventDefault();
            this.newThuoc();
        });
        app.onShortcutKey("ctrl+e", PAGE_ID, (e) => {
            e.preventDefault();
            this.editThuoc(this.thuocTable.currentData());
        });
        app.onShortcutKey("ctrl+a", PAGE_ID, (e) => {
            e.preventDefault();
            this.addThuoc(this.thuocTable.currentData());
        });
        app.onShortcutKey("ctrl+f", PAGE_ID, (e) => {
            e.preventDefault();
            $("#thuoc--search").focus();
        });
    }

    public handleSearchInput() {
        const $this = this;
        $("#thuoc--search").on("keyup", function Searching() {
            const val = $(this).val();
            $this.thuocTable.render(val);
        });
    }

    public handleModalEvent() {
        this.addModal = new NewThuocModal("thuoc--new-modal", this.thuoc);
        this.newModal = new AddThuocModal("thuoc--add-modal", this.thuoc);
        this.editModal = new EditThuocModal("thuoc--edit-modal", this.thuoc);
    }

    public editThuoc(data) {
        if (!data) {
            return;
        }
        $("#thuoc--edit-modal").modal("show");
        $("#thuoc--edit-mathuoc").val(data.ma);
        $("#thuoc--edit-tenthuoc").val(data.ten);
        $("#thuoc--edit-ncc").val(data.ten_ncc);
    }

    public newThuoc() {
        $("#thuoc--new-modal").modal("show");
    }

    public addThuoc(data) {
        if (!data) {
            return;
        }
        $("#thuoc--add-modal").modal("show");
        $("#thuoc--add-mathuoc").val(data.ma);
        $("#thuoc--add-tenthuoc").val(data.ten);
        $("#thuoc--add-ncc").val(data.ten_ncc);
        $("#thuoc--add-soluong").val(data.so_luong);
    }

}

function init(app) {
    return new Init(app);
}

export {init};
