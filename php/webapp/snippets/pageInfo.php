<?php
if(isset($_REQUEST['cat_name'])) {
    $cat_name = isset($_REQUEST['cat_name']) && $_REQUEST['cat_name'] ? $_REQUEST['cat_name'] : '';
    $page_id = isset($_REQUEST['page_id']) && $_REQUEST['page_id'] ? $_REQUEST['page_id'] : 0;
} else {
    $url = explode('/', $_SERVER['PHP_SELF']);
    $cat_name = $url[2];
    $page_id = $url[4];
}

if($cat_name != '' || $page_id != 0) {
    $page = gePageConfig($container, $cat_name, $page_id);
}

if(empty($page)) {
    echo 'This page is non-existent.';
    die;
}

$tplArray['title'] = getPageTitle($page);
?>
