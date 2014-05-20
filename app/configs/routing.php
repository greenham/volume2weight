<?php

$allowed_pages = array('converter', 'why', 'about');
$default_page = 'converter';

$request = $_REQUEST;

if ( ! empty($request) || isset($request['p']))
{
    $page = $request['p'];
}
else
{
    $page = $default_page;
}

if ( ! in_array($page, $allowed_pages))
{
    $page = $default_page;
}