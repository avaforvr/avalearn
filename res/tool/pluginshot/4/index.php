<?
include_once $_SERVER['DOCUMENT_ROOT'] . '/php/includes/global.init.php';

$act = isset($_REQUEST['act']) && $_REQUEST['act'] ? $_REQUEST['act'] : '';
$dirPath = str_replace('\\', '/', __DIR__) . '/'; //当前文件所在目录
$listPath = $dirPath . 'list/'; //词典json文件所在目录
$dictionaries = file_get_contents($dirPath . 'dictionaries.json');
$dictionaries = ($dictionaries != '') ? json_decode($dictionaries, true) : array();

switch ($act) {
    case 'saveDic':
        //添加、编辑词典
        $r = array('code'=>0, 'msg'=>'添加成功');
        $title = trim($_POST['title']);
        $id = $_POST['id'] == 0 ? getNewDicId($dictionaries) : $_POST['id']; //获取词典id

        if(isset($_FILES['file'])) {
            if ($_FILES['file']['error'] > 0) {
                $r['code'] = 1;
                $r['msg'] = '附件上传失败';
            } elseif(getFileType($_FILES['file']['tmp_name']) !== 'zip') {
                $r['code'] = 2;
                $r['msg'] = '请上传zip压缩包';
            } else {
                $zip = new ZipArchive;
                if ($zip->open($_FILES['file']['tmp_name']) === TRUE) {
                    $cont = $zip->getFromIndex(0);
                    if($cont == '' || is_null(json_decode($cont))) {
                        $r['code'] = 3;
                        $r['msg'] = '压缩包必须是一个json内容的文件，并且不含有目录';
                    } else {
                        $zipArr = json_decode($cont, true);
                        $newArr = array();
                        foreach($zipArr as $v) {
                            if(empty($v['en']) || empty($v['ch'])) {
                                $r['code'] = 4;
                                $r['msg'] = 'json数据不完整，必须有en|ch属性，请检查压缩文件内容';
                            }
                            $word = array();
                            $word['en'] = $v['en'];
                            $word['ch'] = $v['ch'];
                            $word['ph'] = !empty($v['ph']) ? $v['ph'] : '';
                            $word['ok'] = !empty($v['ok']) && ($v['ok'] == '1') ? 1 : 0;
                        }
                        die;
                    }

                    $zip->close();
                }
            }
        }
        if($r['code'] === 0) {
            $title = trim($_POST['title']);
        }

        echo json_encode($r);
        die;

    case 'delDic':
        //删除词典
        die;

    default:
        //初始打开页面
        include_once $_SERVER['DOCUMENT_ROOT'] . '/php/webapp/snippets/pageInfo.php';

        $tplArray['sub_twig'] = "{$cat_name}/pluginshot/{$page_id}/";
        $tplArray['res_path'] = $container['WEB_ROOT'] . "res/{$cat_name}/pluginshot/{$page_id}/";
        $tplArray['dictionaries'] = $dictionaries;
        echo $container['twig']->render("{$cat_name}/pluginshot/{$page_id}/index.html", $tplArray);
        break;
}

function getNewDicId($dictionaries) {
    $id = 1;
    foreach($dictionaries as $dic) {
        if($dic['id'] >= $id) {
            $id = intval($dic['id']) + 1;
        }
    }
    return $id;
}
?>