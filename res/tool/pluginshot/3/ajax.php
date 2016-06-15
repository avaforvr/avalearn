<?
include_once $_SERVER['DOCUMENT_ROOT'] . '/php/includes/global.init.php';

$act = isset($_REQUEST['act']) && $_REQUEST['act'] ? $_REQUEST['act'] : '';
$dirPath = str_replace('\\', '/', __DIR__); //当前文件所在目录
$wordsListPath = $dirPath . '/wordsList.js'; //当前展示的列表
$wordsListAllPath = $dirPath . '/wordsListAll.js'; //保存所有单词，只增不减
$backupsPath = $dirPath . '/backups.js'; //当前列表的备份

//返回code，0代表成功，其它数字代表不成功
switch ($act) {
    case 'updateList':
        $words = explode("|", $_POST['list']);
        $newList = array();
        foreach($words as $word) {
            $wordArr = explode("#", $word);
            $en = $wordArr[0];
            $chs = $wordArr[1];
            $key = strtolower($en);
            $key = str_replace(' ', '_', $key);
            $key = str_replace('-', '_', $key);
            $newList[$key] = array('en'=>$en, 'chs'=>$chs);
        }
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

    case 'import':
        if(isset($_FILES['file'])) {
            if ($_FILES['file']['error'] > 0) {
                echo '上传失败!';
            } else {
                $zip = new ZipArchive;
                if ($zip->open($_FILES['file']["tmp_name"]) !== true) {
                    echo "unpack failed"; die;
                }

                $zip->extractTo($dirPath);
                echo 0;
                $zip->close();


//                if($_FILES['file']['type'] == 'application/octet-stream') {
//                    $zipName = $_FILES['file']['name'];
//                    $zipPath = $dirPath . '/' . $_FILES['file']['name'];
//                    move_uploaded_file($zipName, $zipPath);
//                    $zip = new ZipArchive;
//                    var_dump(file_exists($zipName));
//                    var_dump($zipName);
//                    $res = $zip->open($zipName);
//                    var_dump($res);
//                    if ($res === TRUE) {
//                        $zip->extractTo($dirPath . '/');
//                        $zip->close();
//                        echo '0';
//                    } else {
//                        echo '解压失败';
//                    }
//                } else {
//                    echo '只能使用Excel文件';
//                }
            }
        }
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