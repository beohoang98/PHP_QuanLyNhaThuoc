const {ThuocTable} = require("../app/View/ThuocTable");

module.exports = function(app) {
    const thuocTable = new ThuocTable();
    thuocTable.setElement($("#nhap_thuoc--table"));
    thuocTable.render("");

    thuocTable.onChoose((data) => {
        editThuoc(data);
    });
    thuocTable.onFocus((data) => {
        $('.thuoc--button').removeAttr('disabled');
    });

    handleControlKey(app, thuocTable);
    handleSelectKey(app, thuocTable);
    handleModal(app);

    $(".thuoc--button").on('click', function ButtonClick() {
        const role = $(this).attr('app-role');
        switch (role) {
            case "new": newThuoc(); break;
            case "edit": editThuoc(thuocTable.currentData()); break;
            case "add": addThuoc(thuocTable.currentData()); break;
            case "chinh-gia": break;
        }
    });
};

function handleSelectKey(app, thuocTable) {
    app.keyevent.on("ArrowUp", (e) => {
        if (app.page === "page-nhap-thuoc") {
            thuocTable.selectUp();
        }
    });
    app.keyevent.on("ArrowDown", (e) => {
        if (app.page === "page-nhap-thuoc") {
            thuocTable.selectDown();
        }
    });
}

function handleControlKey(app, thuocTable) {
    app.keyevent.on("ctrl+d", (e) => {
        if (app.page === "page-nhap-thuoc") {
            e.preventDefault();
            newThuoc();
        }
    });
    app.keyevent.on("ctrl+e", (e) => {
        if (app.page === "page-nhap-thuoc") {
            e.preventDefault();
            editThuoc(thuocTable.currentData());
        }
    });
    app.keyevent.on("ctrl+a", (e) => {
        if (app.page === "page-nhap-thuoc") {
            e.preventDefault();
            addThuoc(thuocTable.currentData());
        }
    });
    app.keyevent.on("ctrl+f", (e) => {
        if (app.page === "page-nhap-thuoc") {
            e.preventDefault();
            $("#thuoc--search").focus();
        }
    });
}

function handleModal(app) {
    $('.modal').on('shown.bs.modal', () => {
        app.keyevent.block();
    });
    $('.modal').on('hidden.bs.modal', () => {
        app.keyevent.unblock();
    });
}

function editThuoc(data) {
    $("#thuoc--edit-modal").modal("show");
    $("#thuoc--edit-mathuoc").val(data.ma);
    $("#thuoc--edit-tenthuoc").val(data.ten);
    $("#thuoc--edit-ncc").val(data.ten_ncc);
}

function newThuoc() {
    $("#thuoc--newthuoc-modal").modal("show");
}

function addThuoc() {
    //
}
