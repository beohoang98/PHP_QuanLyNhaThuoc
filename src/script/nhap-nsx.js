const {Nsx} = require('../app/Nsx');

$(document).ready(()=>{
    const popup = new StatusPopup();
    const nsx = new Nsx();

    popup.create();
    updateNSX();

    function createTableRow(val) {
        let row = $("<tr/>");
        for (let key of Object.keys(val)) {
            row.append($('<td/>').text(val[key]));
        }
        return row;
    }

    function updateNSX() {
        $('#table-body').children().remove();
        nsx.update((err, data)=>{
            if (err) {
                throw new Error(err);
            }
            for (let row of data) {
                $("#table-body").append(createTableRow(row));
            }
        });
    }

    $("#form").on('submit', (e)=>{
        e.preventDefault();

        $.ajax('/public/api/nsx/', {
            method: 'post',
            xhrFields: {
                withCredentials: 'include',
            },
            data: $("#form").serialize(),
            success: function(json) {
                if (!!json.err) {
                    popup.setStatus(false, json.msg);
                    popup.show();
                    return;
                }

                popup.setStatus(true, json.msg);
                popup.show();
                setTimeout(()=>{
                    popup.hide();
                }, 1000);

                $("input, textarea").val("");

                parent.postMessage({
                    msg: 'update',
                }, '*');
            },
            error: function(err) {
                popup.setStatus(false, err.responseText);
                popup.show();
                return;
            },
        });
    });

    // update data request
    window.addEventListener('message', function(e) {
        let data = e.data;
        if (data.msg == 'update') {
            updateNSX();
        }
    });
});
