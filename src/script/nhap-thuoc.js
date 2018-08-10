const InputPreview2 = require('../app/inputPreview2').default;
const {DonVi} = require('../app/DonVi');

$(document).ready(function() {
    let popup = new StatusPopup();
    popup.create();

    const preview = new InputPreview2();
    const donVi = new DonVi();

    preview.addLookup({
        "ten_nsx": "ten",
    });
    preview.listen("ten_nsx", (data)=>{
        $("#ten_nsx").val(data["ten"]);
    });

    function updateNSX() {
        // asd
    }

    function updateDonvi() {
        $("#don_vi").children().remove();
        donVi.update((err, data)=>{
            if (err) console.log(json.msg);
            else {
                for (let row of data) {
                    let name = row['ten'];
                    let id = row['id'];
                    let newOpt = $("<option/>").val(id).text(name);

                    $("#don_vi").append(newOpt);
                }
                $("#don_vi").find("option:first-child").attr("selected", "");
            }
        });
    }

    $("#don_gia").moneyInput();
    updateNSX();
    updateDonvi();


    $("#form").on('submit', (e)=>{
        e.preventDefault();

        $.ajax({
            type: "POST",
            url: "/public/api/thuoc/",
            data: $("#form").serialize(),
            dataType: "json",
            xhrFields: {
                withCredentials: true, // for session cookie
            },
            success: (json)=>{
                if (!!json.err) {
                    popup.setStatus(false, json.msg);
                    popup.show();
                    console.log('Post failed: ', json.msg);
                } else {
                    popup.setStatus(true, 'Thêm thành công');
                    popup.show();
                    setTimeout(function() {
                        popup.hide();
                    }, 1000);

                    console.log('success');
                    $("input").val("");

                    parent.postMessage({
                        msg: 'update',
                    }, '*');
                }
            },
            error: (err)=>{
                console.log(err);
            },
        });
    });

    // update data request
    window.addEventListener('message', function(e) {
        let data = e.data;
        if (data.msg == 'update') {
            updateNSX();
            updateDonvi();
        }
    });

    // shortcut key event
    document.addEventListener('keydown', (e)=>{
        console.log("nhap thuoc: ", e.keyCode);
        parent.postMessage({
            msg: 'shortcut_key',
            key: e.keyCode,
            shift: e.shiftKey,
        }, "*");
    });
});
