<?php
    function sqlToJson($result) {
        if (!$result) {
            return json_encode([
                "err"=>true,
                "msg"=>"unknown result"
            ]);
        }
        else if ($result->num_rows === 0) {
            return json_encode([
                "err"=>true,
                "msg"=>"No result"
            ]);
        }

        $data = array();
        while ($row = $result->fetch_assoc()) {
            array_push($data, $row);
            // echo json_encode($row)."\n";
        }
        // echo json_encode($data);
        return json_encode([
            "err"=>false,
            "data"=>$data
        ]);
    }

    function sqlToArray($result)
    {
        if (!$result) {
            return json_encode([
                "err"=>true,
                "msg"=>"unknown result"
            ]);
        }
        else if ($result->num_rows === 0) {
            return json_encode([
                "err"=>true,
                "msg"=>"No result"
            ]);
        }

        $data = array();
        while ($row = $result->fetch_assoc()) {
            array_push($data, $row);
            // echo json_encode($row)."\n";
        }
        // echo json_encode($data);
        return $data;
    }
?>
