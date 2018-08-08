<?php
    class mSQL {
        private $sql;

        //implementation
        public function __construct($servername = '127.0.0.1', $username = 'qlnt_getInfo', $password = '12345678') {            
            $this->sql = new mysqli($servername, $username, $password, 'qlnhathuoc_test');
            $this->sql->query("SET NAMES 'utf8';");
            date_default_timezone_set("UTC");
        }
        public function error() {
            return $this->sql->errno;
        }
        public function errText() {
            return $this->sql->error;
        }
        public function __destruct() {
            $this->sql->close();
        }

        //sql func
        public function query($q) {
            //log
            $timelog = date("Y-m-d h:m:s");
            $this->sql->query("INSERT INTO log VALUES ('asdasd', '$timelog')");
            //return
            return $this->sql->query($q);
        }
    }
?>
