<?php
include_once $_SERVER['DOCUMENT_ROOT'] . '/php/includes/global.init.php';

$act = isset($_REQUEST['act']) && $_REQUEST['act'] ? $_REQUEST['act'] : '';
$id = isset($_REQUEST['id']) && $_REQUEST['id'] ? $_REQUEST['id'] : '';

$dirPath = str_replace('\\', '/', __DIR__) . '/'; //当前文件所在目录
$dicPath = $dirPath . 'list/' . $id . '.json';

$dictionaries = file_get_contents($dirPath . 'dictionaries.json');
$dictionaries = ($dictionaries != '') ? json_decode($dictionaries, true) : array();//词典列表数组

switch ($act) {
    case 'saveDic':
        $r = array('code' => 0, 'msg' => '成功');
        echo json_encode($r);
        die;

    default:
        //初始打开页面
        include_once $_SERVER['DOCUMENT_ROOT'] . '/php/webapp/snippets/pageInfo.php';
        $tplArray['sub_twig'] = "{$cat_name}/pluginshot/{$page_id}/";
        $tplArray['res_path'] = $container['WEB_ROOT'] . "res/{$cat_name}/pluginshot/{$page_id}/";

        $dic = array();
        foreach ($dictionaries as $dictionary) {
            if ($dictionary['id'] == $id) {
                $dic = $dictionary;
                break;
            }
        }
        //没有获取到相应词典数据时
        if(empty($dic)) {
            echo $container['twig']->render("{$cat_name}/pluginshot/{$page_id}/dictation-error.html", $tplArray);
            die;
        }

        $tplArray['dic'] = $dic;

        echo $container['twig']->render("{$cat_name}/pluginshot/{$page_id}/dictation.html", $tplArray);
        break;
}

?>
