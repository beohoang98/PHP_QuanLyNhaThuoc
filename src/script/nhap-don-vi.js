const {DonVi} = require('../app/Model/DonVi/');
const {BootstrapModal} = require('../app/Model/BoostrapModal');

const donvi = new DonVi();

$(document).ready(async ()=>{
    async function updateTable() {
        const table = $("#nhap_don_vi--table tbody");
        table.children().remove();
        const data = await donvi.get();
        for (const row of data) {
            const tr = $('<tr/>').html(`
                <td>${row.id}</td>
                <td>${row.ten}</td>
            `);
            table.append(tr);
        }
    }

    updateTable();

});
