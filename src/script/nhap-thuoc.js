const InputPreview2 = require('../app/inputPreview2.js').default;

$(document).ready(function() {
    let popup = new StatusPopup();
    popup.create();

    const preview = new InputPreview2();
    preview.addLookup({
        "ten_nsx": "ten",
    });
    preview.listen("ten_nsx", (data)=>{
        $("#ten_nsx").val(data["ten"]);
    });

    function updateNSX() {
        fetch("/public/api/getNsx.php", {credentials: "include"})
        .then((res)=>{
            return res.json();
        }).then((json)=>{
            preview.addData(json.data);
        });
    }

    function updateDonvi() {
        $("#don_vi").children().remove();
        fetch("/public/api/getDonvi.php", {credentials: "include"})
        .then((res)=>{
            return res.json();
        })
        .then((json)=>{
            if (!!json.err) console.log(json.msg);
            else {
                for (let row of json.data) {
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
            url: "/public/api/addThuoc.php",
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
