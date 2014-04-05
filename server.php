<?php

const STATUS_SUCCESS = 'success';
const STATUS_ERROR = 'error';

$input = $_POST;

if (empty($input)) {
    die(json_encode(array(
        'status' => STATUS_ERROR,
        'message' => "Invalid input provided."
    )));
}

$requiredKeys = array('action');
foreach($requiredKeys as $key)
{
    if (!isset($input[$key])) {
        die(json_encode(array(
            'status' => STATUS_ERROR,
            'message' => "Missing key: {$key}"
        )));
    }
}

$action       = $input['action'];
$validActions = array('initData');

if (!in_array($action, $validActions)) {
    die(json_encode(array(
        'status' => STATUS_ERROR,
        'message' => "Invalid action specified: {$action}"
    )));
}

switch($action)
{
    case 'initData':
        try {
            $data = initData();
            die(json_encode(array(
                'status' => STATUS_SUCCESS,
                'message' => count($data) . " densities loaded",
                'data' => $data
            )));
        } catch (Exception $e) {
            die(json_encode(array(
                'status' => STATUS_ERROR,
                'message' => $e->getMessage()
            )));
        }
    break;
}

$db->close();

function initData()
{
    // initialize mysql connection
    $db = new mysqli('localhost', 'v2w', 'v2w', 'volume2weight');
    if ($db->connect_error) {
        throw new Exception("Connection Error: ({$db->connect_errno}) {$db->connect_error}");
    }

    $result = $db->query("SELECT * FROM `densities` WHERE 1");

    if (!$result || $result->num_rows === 0) {
        throw new Exception("Unable to initialize data");
    }

    $densities = array();

    while($row = $result->fetch_object()) {
        $densities[] = $row;
    }

    $result->close();

    return $densities;
}