<?
include_once $_SERVER['DOCUMENT_ROOT'] . '/php/includes/global.init.php';

$act = isset($_REQUEST['act']) && $_REQUEST['act'] ? $_REQUEST['act'] : '';
$dirPath = str_replace('\\', '/', __DIR__) . '/'; //当前文件所在目录
$subTwigPath = getSubTwigPath(__DIR__, $container);
$listPath = $dirPath . 'list/'; //词典json文件所在目录
$dictionaries = file_get_contents($dirPath . 'dictionaries.json');
$dictionaries = ($dictionaries != '') ? json_decode($dictionaries, true) : array();

switch ($act) {
    case 'saveDic':
        //添加、编辑词典
        $r = array('code' => 0, 'msg' => '添加成功');
        $attachArr = array();
        $isNew = $_POST['id'] == 0;
        $hasAttach = false;
        $dic = array(
            "id" => $isNew ? getNewDicId($dictionaries) : $_POST['id'],
            "title" => trim($_POST['title']),
            "total" => 0,
            "finish" => 0,
            "progress" => 0
        );

        if (isset($_FILES['file'])) {
            $hasAttach = true;

            if ($_FILES['file']['error'] > 0) {
                $r['code'] = 1;
                $r['msg'] = '附件上传失败';
            } elseif (getFileType($_FILES['file']['tmp_name']) !== 'zip') {
                $r['code'] = 2;
                $r['msg'] = '请上传zip压缩包';
            } else {
                $zip = new ZipArchive;
                if ($zip->open($_FILES['file']['tmp_name']) === TRUE) {
                    $cont = $zip->getFromIndex(0);
                    if ($cont == '' || is_null(json_decode($cont))) {
                        $r['code'] = 3;
                        $r['msg'] = '压缩包必须是一个json内容的文件，并且不含有目录';
                    } else {
                        $zipArr = json_decode($cont, true);
                        foreach ($zipArr as $v) {
                            if (empty($v['en']) || empty($v['ch'])) {
                                $r['code'] = 4;
                                $r['msg'] = 'json数据不完整，必须有en|ch属性，请检查压缩文件内容: ' . json_encode($v, JSON_UNESCAPED_UNICODE);
                                break;
                            } else {
                                //TODO: 获取词汇量等信息
                                $word = array();
                                $word['en'] = $v['en'];//英语
                                $word['ch'] = $v['ch'];//中文
                                $word['ph'] = !empty($v['ph']) ? $v['ph'] : '';//音标
                                $word['ok'] = !empty($v['ok']) && ($v['ok'] == '1') ? 1 : 0;//状态
                                if ($word['ok'] === 1) {
                                    $dic['finish']++;
                                }
                                $attachArr[] = $word;
                            }
                        }
                    }

                    $zip->close();
                }
            }
        }

        if ($r['code'] === 0) {
            //写入json文件
            if (!empty($attachArr)) {
                file_put_contents($listPath . $dic['id'] . '.json', json_encode($attachArr, JSON_UNESCAPED_UNICODE));
            }

            //有附件时更新数量和进度
            if (!empty($attachArr)) {
                $dic['total'] = count($attachArr);
                $dic['finish'] = $dic['finish'];
                $dic['progress'] = floor($dic['finish'] / $dic['total'] * 100);
            }

            //更新dictionaries.json
            if ($isNew) {
                $dictionaries[] = $dic;
            } else {
                foreach ($dictionaries as $key => $oldDic) {
                    if ($oldDic['id'] == $dic['id']) {
                        if (empty($attachArr)) {
                            $dic['total'] = $oldDic['total'];
                            $dic['finish'] = $oldDic['finish'];
                            $dic['progress'] = $oldDic['progress'];
                        }
                        $dictionaries[$key] = $dic;
                        break;
                    }
                }
            }
            file_put_contents($dirPath . 'dictionaries.json', json_encode($dictionaries, JSON_UNESCAPED_UNICODE));

            //返回词典信息
            $r['isNew'] = $isNew;
            $r['dicId'] = $dic['id'];
            $r['dicHtml'] = $container['twig']->render($subTwigPath . "snippets/dic.html", array("dic"=>$dic));
        }

        echo json_encode($r);
        die;

    case 'delDic':
        //删除词典
        $r = array('code' => 1, 'msg' => '操作失败');
        $id = $_GET['id'];
        foreach ($dictionaries as $key => $oldDic) {
            if ($oldDic['id'] == $id) {
                unset($dictionaries[$key]);
                $jsonFilePath = $listPath . $id .'.json';
                if(file_exists($jsonFilePath)) {
                    unlink($jsonFilePath);
                }
                $r['code'] = 0;
                $r['msg'] = '删除成功';
                break;
            }
        }
        if($r['code'] === 0) {
            file_put_contents($dirPath . 'dictionaries.json', json_encode($dictionaries, JSON_UNESCAPED_UNICODE));
        }
        echo json_encode($r);
        die;

    default:
        //初始打开页面
        include_once $_SERVER['DOCUMENT_ROOT'] . '/php/webapp/snippets/pageInfo.php';

        $tplArray['sub_twig'] = "{$cat_name}/pluginshot/{$page_id}/";
        $tplArray['res_path'] = $container['WEB_ROOT'] . "res/{$cat_name}/pluginshot/{$page_id}/";
        $tplArray['dictionaries'] = $dictionaries;
        echo $container['twig']->render("{$cat_name}/pluginshot/{$page_id}/dictionaries.html", $tplArray);
        break;
}

function getNewDicId($dictionaries) {
    $id = 1;
    foreach ($dictionaries as $dic) {
        if ($dic['id'] >= $id) {
            $id = intval($dic['id']) + 1;
        }
    }
    return $id;
}

?>