<?
$pid = isset($_REQUEST['pid']) && $_REQUEST['pid'] ? $_REQUEST['pid'] : '';
$pidArray = explode('_', $pid, 2);
$cat_name = reset($pidArray);
$page_id = end($pidArray);
?>