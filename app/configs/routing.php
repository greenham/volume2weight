<?php

$allowed_pages = array('converter', 'why', 'about', 'kitchen_scales');
$default_page = 'converter';

$request = $_REQUEST;

if ( ! empty($request) || isset($request['p']))
{
    $page = str_replace('-', '_', $request['p']);
    $page = str_replace("/", "", $page);
}
else
{
    $page = $default_page;
}

if ( ! in_array($page, $allowed_pages))
{
    $page = $default_page;
}