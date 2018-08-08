const BangDonVi = require('../app/BangDonVi').default;

function fetchToTable(data) {
    $("#table-body").children().remove();
    $('.will-be-update').remove();

    for (let id of Object.keys(data)) {
        let ten = data[id]['ten'];
        let quydoiText = data[id]['quydoiText'];

        let row = $("<tr/>");
        row.append($('<td/>').text(id))
            .append($('<td/>').text(ten))
            .append($('<td/>').text(quydoiText));

        let opt = $('<option/>').val(id).text(ten).addClass('will-be-update');
        $("#id_quy_doi").append(opt);
        $('#table-body').append(row);
    }
}

$(document).ready(async ()=>{
    const bangDonvi = new BangDonVi();
    bangDonvi.addDatabaseURL('/public/api/getDonvi.php');
    await bangDonvi.update();
    fetchToTable(bangDonvi.table);

    const popup = new StatusPopup();
    popup.create();

    $("#form").on('submit', (e)=>{
        e.preventDefault();

        const tenDonVi = $('#ten_don_vi').val();
        const idQuyDoi = $('#id_quy_doi').val();
        const heSoQuyDoi = idQuyDoi == "null" ? 0 : $("#he_so_quydoi").val();

        $.ajax('/api/addDonvi.php', {
            method: 'post',
            xhrFields: {
                withCredentials: 'include',
            },
            data: `ten_don_vi=${tenDonVi}&id_quy_doi=${idQuyDoi}&he_so_quydoi=${heSoQuyDoi}`,
            success: function(json) {
                if (!!json.err) {
                    popup.setStatus(false, json.msg);
                    popup.show();
                    return;
                }

                parent.postMessage({
                    msg: 'update',
                }, "*");

                popup.setStatus(true, json.msg);
                popup.show();
                setTimeout(()=>{
                    popup.hide();
                }, 1000);

                $("input").val("");
                $("#id_quy_doi").val("null");
            },
            error: function(err) {
                popup.setStatus(false, err.responseText);
                popup.show();

                return;
            },
        });
    });


    // on input quy doi don vi
    $('#id_quy_doi').on('change', function ChangeOnInputDonVi(e) {
        let val = $(this).val();
        $('#he_so_quydoi').prop('disabled', val == 'null');
    });

    // update data request
    window.addEventListener('message', async function(e) {
        let data = e.data;
        if (data.msg == 'update') {
            await bangDonvi.update();
            fetchToTable(bangDonvi.table);
        }
    });
});
