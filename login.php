<?php
    //CHECK IF LOGGED OR NOT
    session_start();

    if (isset($_SESSION['username'])) {
        header("Location: index.php");
    }
?>

<?php
    // IF NOT LOGIN YET
    if (isset($_POST['submit']) && isset($_POST['username']) && isset($_POST['password'])) {
        require "./Connect/connectPG.php";

        $sql = new mSQL();

        if ($sql->isError()) {
            $isLoginFailed = true;
        }
        else {
            $user = $_POST['username'];
            $pass = $_POST['password'];
            $ret = $sql->query("SELECT salt_pass AS sessionid, username from nhanvien WHERE username = '$user' AND salt_pass = crypt('$pass', salt_pass)");

            if (pg_num_rows($ret) > 0) {
                $row = $sql->getArrayResult();
                $username = trim($row[0]['username']);
                
                $_SESSION['username'] = $username;

                header("Location: /");
            }
            else {
                header("Location: /login.php?msg=".htmlspecialchars("Username hoặc mật khẩu của bạn đã bị sai").$sql->errText());
            }
        }
    }
?>

<!DOCTYPE html>
<html lang="vi">
    <head>
        <meta charset="utf-8">
        <title>LOGIN</title>
        <link href="/static/bootstrap/css/bootstrap.min.css" rel="stylesheet">
    </head>
    <body>
        <?php
            if (isset($_GET['msg'])) {
                echo "<div class='text-center text-danger'>".$_GET['msg']."</div>";
            }
        ?>
        <div class="container">
            <div class="panel panel-primary">
                <div class="panel-heading">
                    <h2 class='panel-title'>LOGIN</h2>
                </div>
                <div class="panel-body">
                    <form class="form" action="" method="post" enctype="multipart/form-data">
                        <input class="form-control" type="text" name="username" placeholder="Username...">
                        <input class="form-control" type="password" name="password" placeholder="Password...">
                        <button class="btn btn-primary btn-outline-primary" name="submit" type="submit">LOGIN</button>
                    </form>
                </div>
            </div>
        </div>

    </body>
</html>
