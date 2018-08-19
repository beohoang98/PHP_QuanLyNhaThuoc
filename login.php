<?php
//CHECK IF LOGGED OR NOT
session_start();
if (isset($_SESSION['username'])) {
    header("Location: index.php");
    exit();
}
?>
<?php
// IF NOT LOGIN YET
if (isset($_POST['submit']) && isset($_POST['username']) && isset($_POST['password'])) {
    require "./api/default_api/connectdb.php";

    $db = new \Api\ConnectDatabase();

    $user = $_POST['username'];
    $pass = $_POST['password'];
    $ret = $db->table("nhanvien")->find([
        "username"=>"'$user'",
        "salt_pass"=>"crypt('$pass', salt_pass)"
    ])->execute();

    if ($ret->ok && count($ret->data) > 0) {
        $username = trim($ret->data[0]['username']);
        $_SESSION['username'] = $username;
        header("Location: /");
        exit();
    } else {
        header("Location: /login.php?msg=".htmlspecialchars("Username hoặc mật khẩu của bạn đã bị sai").$ret->errMsg);
        exit();
    }
}
?>

<!DOCTYPE html>
<html lang="vi">
    <head>
        <meta charset="utf-8">
        <title>LOGIN</title>
        <?php require $_SERVER["DOCUMENT_ROOT"]."/page/_layouts/meta.php";?>
        <style>
            .container {
                height: 100vh;
            }
        </style>
    </head>
    <body>
        <div class="container d-flex justify-content-center align-items-center">
            <div class="card">
                <div class="card-header bg-dark text-light">
                    <h2 class='card-title'>LOGIN</h2>
                </div>
                <div class="card-body">
                <?php
                if (isset($_GET['msg'])) {
                    echo "<small class='text-center text-danger'><i class='fa fa-exclamation-triangle'></i> ".$_GET['msg']."</small>";
                }
                ?>
                    <form class="form" action="" method="post" enctype="multipart/form-data">
                        <div class="form-group">
                            <label for="username">Username</label>
                            <input class="form-control" type="text" name="username" placeholder="Username...">
                        </div>
                        <div class="form-group">
                            <label for="password">Password</label>
                            <input class="form-control" type="password" name="password" placeholder="Password...">
                        </div>
                        <button class="btn btn-outline-primary form-control" name="submit" type="submit">LOGIN</button>
                    </form>
                </div>
            </div>
        </div>

    </body>
</html>
