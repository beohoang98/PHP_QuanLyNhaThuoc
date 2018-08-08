<?php
    $ROOT = $_SERVER["DOCUMENT_ROOT"];
    require_once $ROOT."/Connect/connectPG.php";

    class checkSession {
        private $valid;
        private $errMsg;

        public function __construct($sessionID) {
            $this->valid = false;
            $sql = new mSQL();

            if (!$sql->isError()) {
                $ret = $sql->query("SELECT username from nhanvien WHERE salt_pass = '$sessionID'");
                if (pg_num_rows($ret) > 0) {
                    $this->valid = true;
                    $this->errMsg = "OK";
                }
                else {
                    $this->errMsg = "Session invalid";
                    $this->valid = false;
                }
            }
            else {
                $this->errMsg = "Cannot connect to database";
                $this->valid = false;
            }
        }

        /**
         * @return {object}
         * @return false if session invalid or cannot connect to database
         */
        public function isValid() {
            return $this->valid;
        }

        /**
         * @return string
         */
        public function errText() {
            return $this->errMsg;
        }

        public function __destruct() {
        }
    }
?>
