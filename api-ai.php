<?php

require_once('app/configs/config.php');

global $config;
$apiConf = $config['api_keys']['api-ai'];
$apiKeyName = $apiConf['apiKeyName'];
$apiKey = $apiConf['apiKey'];

if (strpos($_SERVER['CONTENT_TYPE'], "application/json" === false))
{
    errorResponse(400, "Invalid content-type");
}

if (!isset($_SERVER[$apiKeyName]) || empty($_SERVER[$apiKeyName]))
{
    errorResponse(400, "Missing api key");
}

if ($_SERVER[$apiKeyName] !== $apiKey)
{
    errorResponse(401, "Invalid api key provided");
}

$request = json_decode(file_get_contents('php://input'));

if (isset($request->result))
{
    if ($request->result->action === "convert")
    {
        $parameters = (array) $request->result->parameters;
        $ingredient = $parameters['source-ingredient'];
        $volume = (array) $parameters['source-unit-volume'];
        $weightUnit = $parameters['dest-unit-weight-name'];

        $conversionResult = convert($ingredient, $volume['amount'], $volume['unit'], $weightUnit);

        if ($conversionResult !== false)
        {
            $speech = "{$volume['amount']} {$volume['unit']} of {$ingredient}, weighs approximately {$conversionResult['amount']} {$conversionResult['unit']}";
            $response = [
                'speech' => $speech,
                'displayText' => $speech,
                'source' => 'volum.io'
            ];

            response($response);
        }
    }
}

function getDensityByIngredient($ingredient)
{
    global $config;
    $dbconf = $config['db'];

    // initialize mysql connection
    $db = new mysqli($dbconf['host'], $dbconf['user'], $dbconf['pass'], $dbconf['db']);
    if ($db->connect_error) {
        throw new Exception("Connection Error: ({$db->connect_errno}) {$db->connect_error}");
    }

    $result = $db->query("SELECT * FROM `densities` WHERE `name` = '".$db->escape_string($ingredient)."'");

    if (!$result || $result->num_rows === 0) {
        throw new Exception("No results found matching {$ingredient}");
    }

    $density = $result->fetch_object();

    $result->close();

    return $density;
}

function convert($ingredient, $amount, $unit, $weightUnit)
{
    $unitConversions = [
        "ml" => 1,
        "dl" => 100,
        "l" => 1000,
        "t" => 5,
        "T" => 15,
        "floz" => 29.6,
        "c" => 237,
        "pt" => 473,
        "qt" => 946,
        "gal" => 3785
    ];

    define('G_LB', 453);
    define('G_OZ', 28);

    $grams = $kilos = $pounds = $ounces = null;

    $unit = unitNameToAbbr($unit);

    // @TODO: Add some validation here

    if ($unit === "oz" || $unit === "lb") {
        // straight conversion, no density needed
        $grams = $amount * (($unit === "oz") ? G_OZ : G_LB);
    } else {
        // find density for this ingredient
        try {
            $density = getDensityByIngredient($ingredient);
        } catch (Exception $e) {
            errorResponse(500, $e->getMessage());
        }

        // do conversion based on units selected
        if ($density->g_whole === null) {
            $grams = $amount * $density->g_ml * $unitConversions[$unit];
        } else {
            $grams = $amount * $density->g_whole;
            $unit = "units";
        }
    }

    $result = false;

    // respond based on desired units
    $weightUnit = unitNameToAbbr($weightUnit);
    switch ($weightUnit)
    {
        case "g":
            $result = ['amount' => $grams, 'unit' => 'grams'];
        break;

        case "kg":
            $kilos = $grams / 1000;
            $result = ['amount' => $kilos, 'unit' => 'kilograms'];
        break;

        case "lb":
            $pounds = $grams / G_LB;
            $result = ['amount' => $pounds, 'unit' => 'pounds'];
        break;

        case "oz":
            $ounces = $grams / G_OZ;
            $result = ['amount' => $ounces, 'unit' => 'ounces'];
        break;
    }

    return $result;
}

function unitNameToAbbr($unit)
{
    switch ($unit)
    {
        case 'teaspoons':
        case 'teaspoon':
        case 'tsp':
        case 'tsps':
        case 't':
            return 't';
        break;

        case 'tablespoons':
        case 'tablespoon':
        case 'Tbsp':
        case 'tbsp':
        case 'Tbsps':
        case 'tbsps':
        case 'T':
            return 'T';
        break;

        case 'fluid ounces':
        case 'fluid ounce':
        case 'fl oz':
        case 'flozs':
        case 'floz':
            return 'floz';
        break;

        case 'cups':
        case 'cup':
        case 'C':
        case 'c':
            return 'c';
        break;

        case 'pints':
        case 'pint':
        case 'pts':
        case 'pt':
            return 'pt';
        break;

        case 'quarts':
        case 'quart':
        case 'qts':
        case 'qt':
            return 'qt';
        break;

        case 'gallons':
        case 'gallon':
        case 'gals':
        case 'gal':
            return 'gal';
        break;

        case 'milliliters':
        case 'milliliter':
        case 'mls':
        case 'ml':
            return 'ml';
        break;

        case 'deciliters':
        case 'deciliter':
        case 'dls':
        case 'dl':
            return 'dl';
        break;

        case 'liters':
        case 'liter':
        case 'ls':
        case 'l':
            return 'l';
        break;

        case 'ounces':
        case 'ozs':
        case 'oz':
            return 'oz';
        break;

        case 'pounds':
        case 'pound':
        case 'Lbs':
        case 'lbs':
        case '#s':
        case '#':
        case 'Lb':
        case 'lb':
            return 'lb';
        break;

        case 'grams':
        case 'gram':
        case 'g':
            return 'g';
        break;

        case 'kilograms':
        case 'kilogram':
        case 'kg':
            return 'kg';
        break;
    }
}

function response($data)
{
    header("Content-type: application/json");
    die(json_encode($data));
}

function errorResponse($httpCode, $message)
{
    http_response_code($httpCode);
    error_log($message);
    error_log(json_encode($_SERVER));
    error_log(file_get_contents('php://input'));
    die(json_encode(
        ["status" => ["code" => $httpCode, "errorType" => $message]]
    ));
}
