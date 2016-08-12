<?
include_once $_SERVER['DOCUMENT_ROOT'] . '/php/includes/global.init.php';

$act = isset($_REQUEST['act']) && $_REQUEST['act'] ? $_REQUEST['act'] : '';
$dirPath = str_replace('\\', '/', __DIR__) . '/'; //当前文件所在目录
$subTwigPath = getSubTwigPath(__DIR__, $container);
$listPath = $dirPath . 'list/'; //词典json文件所在目录
$dictionaries = file_get_contents($dirPath . 'dictionaries.json');
$dictionaries = ($dictionaries != '') ? json_decode($dictionaries, true) : array();
echo '背单词';

?>