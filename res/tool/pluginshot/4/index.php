<?
include_once $_SERVER['DOCUMENT_ROOT'] . '/php/includes/global.init.php';
include_once $_SERVER['DOCUMENT_ROOT'] . '/php/webapp/snippets/pageInfo.php';

$tplArray['sub_twig'] = "{$cat_name}/pluginshot/{$page_id}/";
$tplArray['res_path'] = $container['WEB_ROOT'] . "res/{$cat_name}/pluginshot/{$page_id}/";

$dirPath = str_replace('\\', '/', __DIR__); //当前文件所在目录
$dictionaries = file_get_contents($dirPath . '/dictionaries.json');
if($dictionaries != '') {
    $dictionaries = json_decode($dictionaries, true);
}
$tplArray['dictionaries'] = $dictionaries;
echo $container['twig']->render("{$cat_name}/pluginshot/{$page_id}/index.html", $tplArray);
?>