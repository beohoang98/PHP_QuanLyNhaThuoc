const BangDonVi = require('../app/DonVi/BangDonVi').default;

function fetchToTable(data) {
    $("#nhap_don_vi--table-body").children().remove();
    $('.will-be-update').remove();

    for (let id of Object.keys(data)) {
        let ten = data[id]['ten'];
        let quydoiText = data[id]['quydoiText'];

        let row = $("<tr/>");
        row.append($('<td/>').text(id))
            .append($('<td/>').text(ten))
            .append($('<td/>').text(quydoiText));

        let opt = $('<option/>').val(id).text(ten).addClass('will-be-update');
        $("#nhap_don_vi--id_quy_doi").append(opt);
        $('#nhap_don_vi--table-body').append(row);
    }
}

$(document).ready(async ()=>{
    const bangDonvi = new BangDonVi();
    await bangDonvi.update();
    fetchToTable(bangDonvi.table);

    const popup = new StatusPopup();
    popup.create();

    $("#nhap_don_vi--form").on('submit', (e)=>{
        e.preventDefault();

        const tenDonVi = $('#nhap_don_vi--ten_don_vi').val();
        const idQuyDoi = $('#nhap_don_vi--id_quy_doi').val();
        const heSoQuyDoi = idQuyDoi == "null" ? 0 : $("#nhap_don_vi--he_so_quydoi").val();

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

                $("#nhap_don_vi--form input").val("");
                $("#nhap_don_vi--id_quy_doi").val("null");
            },
            error: function(err) {
                popup.setStatus(false, err.responseText);
                popup.show();

                return;
            },
        });
    });


    // on input quy doi don vi
    $('#nhap_don_vi--id_quy_doi').on('change', function ChangeOnInputDonVi(e) {
        let val = $(this).val();
        $('#nhap_don_vi--he_so_quydoi').prop('disabled', val == 'null');
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
