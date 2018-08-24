const {Thuoc, BangThuoc} = require('../app/Model/Thuoc');
const thuoc = new Thuoc();
const bangThuoc = new BangThuoc();

$(document).ready(function() {
    async function updateTable() {
        const table = $("#nhap_thuoc--table tbody");
        table.children().remove();
        await bangThuoc.update();
        for (const row of bangThuoc.list) {
            const priceString = (+row.don_gia).toLocaleString();
            const tr = $('<tr/>').html(`
                <td>${row.ma}</td>
                <td>${row.ten}</td>
                <td>${row.ten_nsx}</td>
                <td>${priceString}</td>
                <td>${row.so_luong}</td>
            `);
            table.append(tr);
        }
    }

    $("#nhap_thuoc--form").on("submit", function NhapThuocFormSubmit(e) {
        e.preventDefault();
        const data = {};
        $(this).serializeArray().forEach((val)=>{
            data[val.name] = val.value;
        });
        thuoc.create(data, (err)=>{
            if (err) {
                throw err;
            }
            window.location.reload();
        });
    });

    updateTable();
});
