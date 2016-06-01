<?
include_once $_SERVER['DOCUMENT_ROOT'] . '/php/includes/global.init.php';

$act = isset($_REQUEST['act']) && $_REQUEST['act'] ? $_REQUEST['act'] : '';
$wordsListPath = str_replace('\\', '/', __DIR__) . '/wordsList.js';

switch ($act) {
    case 'updateList':
        $wordsList = getWordsList($wordsListPath);
        $wordsList = array_merge($wordsList, json_decode($_POST['list'], true));
        echo setWordsList($wordsListPath, $wordsList);
        die;

    case 'remove':
        $keys = $_POST['keys'];
        $keys = explode(',', $keys);
        $wordsList = getWordsList($wordsListPath);
        foreach ($wordsList as $key => $value) {
            if(in_array($key, $keys)) {
                unset($wordsList[$key]);
            }
        }
        echo setWordsList($wordsListPath, $wordsList);
        die;

    default:
        break;
}

//获取 wordsList 数组
function getWordsList($wordsListPath) {
    $wordsList = file_get_contents($wordsListPath);
    $wordsList = ltrim($wordsList, 'var wordsList = ');
    $wordsList = rtrim($wordsList, ';');
    return json_decode($wordsList, true);
}
//生成 wordsList.js 文件
function setWordsList($wordsListPath, $wordsList) {
    $wordsList = 'var wordsList = ' . json_encode($wordsList) . ';';
    return file_put_contents($wordsListPath, $wordsList) ? 0 : 1;
}

?>