<?
include_once dirname(__DIR__) . '/includes/global.init.php';

$resources = getResources($container);

//效果图
foreach($resources as $catKey => $cat) {
    foreach($cat as $typeKey => $group) {
        if($typeKey == 'pluginshot') {
            foreach($group as $pageKey => $page) {
                $resources[$catKey][$typeKey][$pageKey]["effect"] = $container["path"]["resources"] . "{$catKey}/{$typeKey}/{$page['pageId']}/effect.jpg";
            }
        }
    }
}

$tplArray['main'] = $container['twig']->render("webapp/pages/index.html", array_merge($tplArray, array('resources' => $resources)));
echo $container['twig']->render('webapp/base.html', $tplArray);

?>