<?
include_once dirname(__DIR__) . '/includes/global.init.php';
include_once dirname(__DIR__) . '/webapp/snippets/pageInfo.php';

$tplArray['sub_twig'] = "{$cat_name}/plugin/{$page_id}/";
$tplArray['res_path'] = $container['WEB_ROOT'] . "res/{$cat_name}/plugin/{$page_id}/";

$article = $container['twig']->render("{$cat_name}/plugin/{$page_id}/index.html", $tplArray);
$tplArray['main'] = '<div class="panel plugin">' . $article . '</div>';

echo $container['twig']->render('webapp/base.html', $tplArray);

?>