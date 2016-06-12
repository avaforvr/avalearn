<?
include_once $_SERVER['DOCUMENT_ROOT'] . '/php/includes/global.init.php';

$act = isset($_REQUEST['act']) && $_REQUEST['act'] ? $_REQUEST['act'] : '';
$wordsListPath = str_replace('\\', '/', __DIR__) . '/wordsList.js'; //当前展示的列表
$wordsListAllPath = str_replace('\\', '/', __DIR__) . '/wordsListAll.js'; //保存所有单词，只增不减
$backupsPath = str_replace('\\', '/', __DIR__) . '/backups.js'; //当前列表的备份

//返回code，0代表成功，其它数字代表不成功
switch ($act) {
    case 'updateList':
        $newList = json_decode($_POST['list'], true);
        $wordsList = getWordsList('wordsList', $wordsListPath);
        $wordsListAll = getWordsList('wordsListAll', $wordsListAllPath);
        $suc = setWordsList('wordsList', $wordsListPath, array_merge($newList, $wordsList));
        $sucAll = setWordsList('wordsListAll', $wordsListAllPath, array_merge($wordsListAll, $newList));
        echo ($suc && $sucAll) ? 1 : 0;
        die;

    case 'removeSuc':
        $keys = $_POST['keys'];
        $keys = explode(',', $keys);
        $wordsList = getWordsList('wordsList', $wordsListPath);
        foreach ($wordsList as $key => $value) {
            if(in_array($key, $keys)) {
                unset($wordsList[$key]);
            }
        }
        echo setWordsList('wordsList', $wordsListPath, $wordsList);
        die;

    case 'removeAll':
        echo setWordsList('wordsList', $wordsListPath, array());
        die;

    case 'setBackups':
        echo copyContent($wordsListPath, $backupsPath);
        die;

    case 'restore':
        echo copyContent($backupsPath, $wordsListPath);
        die;

    default:
        break;
}

//获取 wordsList 数组
function getWordsList($variableName, $wordsListPath) {
    $wordsList = file_get_contents($wordsListPath);
    $wordsList = ltrim($wordsList, 'var ' . $variableName . ' = ');
    $wordsList = rtrim($wordsList, ';');
    return json_decode($wordsList, true);
}
//生成 wordsList.js 文件
function setWordsList($variableName, $wordsListPath, $wordsList) {
    $content = empty($wordsList) ? '{}' : json_encode($wordsList);
    $wordsList = 'var ' . $variableName . ' = ' . $content . ';';
    return file_put_contents($wordsListPath, $wordsList) ? 0 : 1;
}

//两个文件内容覆盖
function copyContent($from, $to) {
    $content = file_get_contents($from);
    return file_put_contents($to, $content) ? 0 : 1;
}

?>