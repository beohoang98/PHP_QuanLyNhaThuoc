<?php
class mSQL {
	private $host;
	private $port;
	private $dbname;
	private $user;
	private $pass;
	
	private $sql;
	private $isError = false;
	private $errText = "";
	private $result;

	public function __construct($user = "postgres", $pass = '', $host = '', $port = '5432')
	{
		if (getenv("PHP_ENV") === "production") {
			$db = parse_url(getenv("DATABASE_URL"));
			$this->host = $db['host'];
			$this->port = $db['port'];
			$this->dbname = ltrim($db['path'], '/');
			$this->user = $db['user'];
			$this->pass = $db['pass'];
		} else {
			$configText = file_get_contents("../local_env.json");
			$config = json_decode($configText, true);
			$this->host = $config['host'];
			$this->port = $config['port'];
			$this->dbname = $config['dbname'];
			$this->user = $config['user'];
			$this->pass = $config['pass'];
		}

		$this->isError = false;
		$this->errText = "";

		$this->sql = pg_connect("host=$this->host port=$this->port dbname=$this->dbname user=$this->user password=$this->pass");

		if (!$this->sql) {
			$this->isError = true;
			$this->errText = "Khong the ket noi server";
		}
	}

	public function isError()
	{
		return $this->isError;
	}

	public function errText()
	{
		return $this->errText;
	}

	public function query($query)
	{
		$this->isError = false;
		$this->errText = "";

		$this->result = pg_query($this->sql, $query);

		if (!$this->result)
		{
			$this->isError = true;
			$this->errText = pg_last_error();
		}

		return $this->result;
	}

	public function getArrayResult()
	{
		$arr = Array();
		$result = $this->result;
		while($row = pg_fetch_assoc($result)) {
            array_push($arr, $row);
		}
		
		return $arr;
	}


	public function getJsonResult()
	{
		$arr = $this->getArrayResult();
		return json_encode($arr);
	}
}