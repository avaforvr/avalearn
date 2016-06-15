<?
include_once $_SERVER['DOCUMENT_ROOT'] . '/php/includes/global.init.php';
include_once $_SERVER['DOCUMENT_ROOT'] . '/php/includes/download.class.php';

$dirPath = str_replace('\\', '/', __DIR__); //当前文件所在目录
$wordsListPath = $dirPath . '/wordsList.js'; //当前展示的列表
$wordsListAllPath = $dirPath . '/wordsListAll.js'; //保存所有单词，只增不减
$backupsPath = $dirPath . '/backups.js'; //当前列表的备份

$zip = new ZipArchive();
$zipname = date('YmdHis', time());
if (!file_exists($zipname)) {
    $zip->open($zipname . '.zip', ZipArchive::OVERWRITE);//创建一个空的zip文件
    $zip->addFile($wordsListPath, 'wordsList.js');
    $zip->addFile($wordsListAllPath, 'wordsListAll.js');
    $zip->addFile($backupsPath, 'backups.js');
    $zip->close();
    $dw = new Download($dirPath, $zipname . '.zip'); //下载文件
    $dw->getfiles();
    unlink($zipname . '.zip'); //下载完成后要进行删除
}

?>