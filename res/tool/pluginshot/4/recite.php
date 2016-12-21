<?
include_once $_SERVER['DOCUMENT_ROOT'] . '/php/includes/global.init.php';
include_once './func.php';

$act = isset($_REQUEST['act']) && $_REQUEST['act'] ? $_REQUEST['act'] : '';
$id = isset($_REQUEST['id']) && $_REQUEST['id'] ? $_REQUEST['id'] : '';
$status = isset($_REQUEST['status']) && $_REQUEST['status'] ? $_REQUEST['status'] : 0;

$dirPath = str_replace('\\', '/', __DIR__) . '/'; //当前文件所在目录
$dicPath = $dirPath . 'list/' . $id . '.json';

$dictionaries = file_get_contents($dirPath . 'dictionaries.json');
$dictionaries = ($dictionaries != '') ? json_decode($dictionaries, true) : array();//词典列表数组

$list = file_get_contents($dirPath . 'list/' . $id . '.json');
$list = ($list != '') ? json_decode($list, true) : array();//词典列表数组

switch ($act) {
    default:
        //初始打开页面
        include_once $_SERVER['DOCUMENT_ROOT'] . '/php/webapp/snippets/pageInfo.php';
        $tplArray['sub_twig'] = "{$cat_name}/pluginshot/{$page_id}/";
        $tplArray['res_path'] = $container['WEB_ROOT'] . "res/{$cat_name}/pluginshot/{$page_id}/";

        //词典信息
        $dic = array();
        foreach ($dictionaries as $dictionary) {
            if ($dictionary['id'] == $id) {
                $dic = $dictionary;
                break;
            }
        }
        if(empty($dic)) {
            echo $container['twig']->render("{$cat_name}/pluginshot/{$page_id}/inexistent.html", $tplArray);
            die;
        }
        $tplArray['dic'] = $dic;

        //100个未默写单词数组
        $tplArray['words'] = getWords($list, $status, 100);

        //其它变量
        $tplArray['status'] = $status;

        echo $container['twig']->render("{$cat_name}/pluginshot/{$page_id}/recite.html", $tplArray);
        break;
}

?>