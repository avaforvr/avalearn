<?
include_once dirname(__DIR__) . '/includes/global.init.php';
include_once dirname(__DIR__) . '/webapp/snippets/pid.php';

$tplArray['title'] = getPageTitle($container, $cat_name, $page_id);
$tplArray['res_path'] = $container['WEB_ROOT'] . "res/{$cat_name}/pluginshot/{$page_id}/";

echo $container['twig']->render("{$cat_name}/pluginshot/{$page_id}/index.html", $tplArray);

?>