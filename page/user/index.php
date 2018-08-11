<?php
    $ROOT = $_SERVER["DOCUMENT_ROOT"];
    require_once $ROOT."/public/api/_checkSessionCode.php";
    $user = $_SESSION['username'];
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Document</title>
    <?php require "../_layouts/meta.php" ?>
</head>
<body>
    <div class="container">
        <div class="jumbotron bg-dark text-light">
            <a href="/" class="btn btn-light">
                <i class="fa fa-home"></i> HOME
            </a>
            <h1>ADMIN PAGE</h1>
        </div>
        <div class="row">
            <div class="col-md-6">
                <div class="card">
                    <div class="card-header bg-dark text-light">
                        <h3 class='card-title'>Thông tin chung</h3>
                    </div>
                    <div class="card-body form">
                        <div class="form-group">
                            <label for="user-name">Username</label>
                            <input type="text" class="form-control" value="<?=$user?>" disabled>
                        </div>
                        <div class="form-group">
                            <label for="user-real-name">Tên</label>
                            <input type="text" class="form-control" value="" disabled>
                        </div>
                    </div>
                </div>
            </div>
            <div class="col-md-6">
                <div class="card">
                    <div class="card-header bg-dark text-light">
                        <h3 class='card-title'>Phân quyền</h3>
                    </div>
                    <div class="card-body">
                        //asd
                    </div>
                </div>
            </div>
        </div>
        
    </div>
</body>
</html>