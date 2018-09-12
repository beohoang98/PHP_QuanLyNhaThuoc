<div class="bg-dark text-center text-light">
    <h2>NHẬP HÓA ĐƠN</h2>
</div>
<div class="container d-flex flex-column scrollable" style="height: 100%">

    <!-- nhap va tim thuoc -->
    <form id='nhap_hoa_don--them_thuoc' class="d-flex flex-row p-2 border border-dark rounded">
        <!-- see info -->
        <div class='m-1' data-toggle='tooltip' data-html='true' data-placement='bottom' title="<h1>asd</h1>">
            <label for="">&nbsp;</label>
            <div><i class="fas fa-question-circle"></i></div>
        </div>

        <!-- ma-thuoc -->
        <div class="form-group m-1">
            <label for="nhap_hoa_don--ma_thuoc">Ma Thuoc</label>
            <input class='form-control' id='nhap_hoa_don--ma_thuoc' name='ma_thuoc' required readonly type="text">
        </div>
        <!-- ten thuoc -->
        <div class="form-group m-1">
            <label for="nhap_hoa_don--ten_thuoc">Ten Thuoc</label>
            <input class='form-control' id='nhap_hoa_don--ten_thuoc' name='ten_thuoc' required type="text">
        </div>
        <!-- gia thuoc -->
        <div class="form-group m-1">
            <label for="nhap_hoa_don--gia">Gia</label>
            <input class='form-control' id='nhap_hoa_don--gia' name='don_gia' readonly type="text">
        </div>

        <!-- button -->
        <div class="form-group m-1">
            <label for="">&nbsp;</label>
            <input class='form-control btn btn-dark' type="submit" value="Them">
        </div>

        <!-- button to show advance -->
        <div class="form-group m-1">
            <label for="">&nbsp;</label>
            <a class='form-control btn btn-outline-secondary' data-toggle='collapse' data-target="#nhap-hoa-don-them">...</a>
        </div>

        <div class="collapse" id="nhap-hoa-don-them">
            <div class="d-flex flex-row">
                <!-- don_vi -->
                <div class="form-group m-1">
                    <label for="nhap_hoa_don--don_vi">Don Vi</label>
                    <select class='form-control' id='nhap_hoa_don--don_vi' name='don_vi' required component="DonVi">
                    </select>
                </div>

                <!-- don_vi -->
                <div class="form-group m-1">
                    <label for="nhap_hoa_don--sl">So Luong</label>
                    <input class='form-control' id='nhap_hoa_don--sl' name='so_luong' required type=number value=1>
                </div>

            </div>
        </div>
    </form>
    

    <!-- CTHD VA LICH SU -->
    <div class="row flex-grow-1">
        <!-- CTHD -->
        <div class="col-8">
            <div class="card">
                <div class="card-header">Chi tiet hoa don</div>
                <div class="card-body p-0">
                    <!-- TABLE -->
                    <table class="table table-striped" id="nhap_hoa_don--table">
                        <thead>
                            <tr>
                                <th>Ma</th>
                                <th>Ten thuoc</th>
                                <th>So luong</th>
                                <th>Gia</th>
                            </tr>
                        </thead>
                        <tbody>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>

        <!-- LICH SU -->
        <div class="col-4">
            <div class="card">
                <div class="card-header">LICH SU</div>
                <div class="card-body p-0">
                    <!-- TABLE -->
                    <table class="table table-striped" id="nhap_hoa_don--table">
                        <thead>
                            <tr>
                                <th>Time</th>
                                <th>Ma Hoa Don</th>
                                <th>Gia ban</th>
                                <th>Nguoi ban</th>
                            </tr>
                        </thead>
                        <tbody>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>


    <!-- DIEN THONG TIN HOA DON -->
    <div class='d-flex flex-row' style="position: sticky; bottom: 0">
        <!-- KIEU BAN -->
        <div class="form-group">
            <div class='p-1'>
                <label class='p-1' for="ban-lieu">BAN THEO LIEU</label>
                <input id="ban-lieu" type="radio" class="form-control float-left" name='kieu-ban' value='lieu'>
            </div>
            <div class='p-1'>
                <label class='p-1' for="ban-le">BAN LE</label>
                <input id="ban-le" type="radio" class="form-control float-left" name='kieu-ban' value='le'>
            </div>
        </div>

        <!-- GIA 1 LIEU -->
        <div class="form-group ml-4">
            <label for="">GIA MOT LIEU</label>
            <input class='form-control' type="text">
        </div>

        <!-- TONG GIA -->
        <div class="form-group ml-4">
            <label for="">TONG GIA</label>
            <input class='form-control' type="text">
        </div>

        <!-- SO LUONG LIEU -->
        <div class="form-group ml-4">
            <label for="">SO LIEU</label>
            <input class='form-control' type="number" value=1>
        </div>

        <button class="btn btn-primary m-4 flex-grow-1">NHAP</button>
    </div>
</div>
