<?php
	require "../../api/_checkSessionCode.php";
?>
<head>
    <link href="/static/bootstrap/css/bootstrap.min.css" rel="stylesheet">
	<link rel="stylesheet" href="/static/fontawesome/fontawesome-all.min.css">
	<link rel="stylesheet" href="/static/lib/lib.css">
	
    <script src="/static/jquery/jquery-3.3.1.min.js"></script>
    <script src="/static/lib/lib.js"></script>
    
    <style media="screen">
        body {
            background-color: #f8f8f8;
        }
        #tag {
            border: 1px solid #ccccff;
        }
        .tag {
            margin: 0.5em;
        }
    </style>
</head>
<body>
    <div class="bg-dark text-center text-light">
        <h2>NHẬP MỚI THUỐC</h2>
    </div>
    <div class="container">
        <form id="form" class="form-horizontal" role='form' action="#" method="post">
            <div class="form-group row">
                <div class="col-md-4">
                    <label for="ma_thuoc">Mã Thuốc</label>
                    <input class="form-control" type="number" id="ma_thuoc" name="ma_thuoc" required>
                </div>
                <div class="col-md-8">
                    <label for="ten_thuoc">Tên Thuốc</label>
                    <input class="form-control" type="text" id="ten_thuoc" name="ten_thuoc" autocomplete='off' required>
                </div>
            </div>
            <div class="form-group row">
                <div class="col-md-8">
                    <label for="ten_nsx">Nhà sản xuất</label>
                    <input class="form-control" type="text" id="ten_nsx" name="nsx" required>
                </div>
                <div class="col-md-4">
                    <label for="tag">Viết tắt</label>
                    <input class="form-control" type="text" id="tag" name="viet_tat">
                </div>
            </div>
            <div class="form-group row">
                <div class="col-md-4">
					<label for="don_vi">Đơn vị</label>
					<select class="form-control" id="don_vi" name="don_vi" required></select>
				</div>
                <div class="col-md-8">
                    <label for="don_gia">Đơn giá</label>
                    <input class="form-control" type="text" id="don_gia" name="don_gia" required>
                </div>
            </div>
            <div class="form-group">
                <button class="form-control btn btn-dark btn-outline-dark" type="submit" name="button">THÊM</button>
            </div>
        </form>
    </div>
    <script defer>
        $(document).ready(function (){
            let popup = new StatusPopup();
            popup.create();
            const preview = new inputPreview2();
            preview.addLookup({
                "ten_nsx": "ten"
            });
            preview.listen("ten_nsx", (data)=>{
                $("#ten_nsx").val(data["ten"]);
            });

            function updateNSX()
            {
                fetch("/api/getNsx.php", {credentials: "include"})
                .then(res=>{
                    return res.json();
                }).then(json=>{
                    preview.addData(json.data);
                });
            }

            function updateDonvi() {
                $("#don_vi").children().remove();
                fetch("/api/getDonvi.php", {credentials: "include"})
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
                    url: "/api/addThuoc.php",
                    data: $("#form").serialize(),
                    dataType: "json",
                    xhrFields: {
                        withCredentials: true   //for session cookie
                    },
                    success: (json)=>{
                        if (!!json.err) {
                            popup.setStatus(false, json.msg);
                            popup.show();
                            console.log('Post failed: ', json.msg);
                        }
                        else {
                            popup.setStatus(true, 'Thêm thành công');
                            popup.show();
                            setTimeout(function(){
                                popup.hide();
                            }, 1000);

                            console.log('success');
                            $("input").val("");

                            parent.postMessage({
                                msg: 'update'
                            }, '*');
                        }
                    },
                    error: (err)=>{
                        console.log(err);
                    }
                });
            });

            //update data request
            window.addEventListener('message', function(e) {
                let data = e.data;
                if (data.msg == 'update') {
                    updateNSX();
                    updateDonvi();
                }
            });

            //shortcut key event
            document.addEventListener('keydown', (e)=>{
                console.log("nhap thuoc: ", e.keyCode);
                parent.postMessage({
                    msg: 'shortcut_key',
                    key: e.keyCode,
                    shift: e.shiftKey
                }, "*");
            });
        });
    </script>
</body>
