<?php ?>
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
    <table id="nhap_thuoc--table" class="table table-striped">
        <thead>
            <tr>
                <th>Mã Thuốc</th>
                <th>Tên Thuốc</th>
                <th>Nhà sản xuất</th>
                <th>Đơn giá</th>
                <th>Số lượng</th>
            </tr>
        </thead>
        <tbody>
        </tbody>
    </table>
</div>
