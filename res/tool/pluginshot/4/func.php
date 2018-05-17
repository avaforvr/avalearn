<?
function getWords($list, $status, $limit) {
    $words = array();
    $idx = 0;
    foreach ($list as $word) {
        if($word['ok'] == $status) {
            $words[] = $word;
            $idx ++;
            if($idx == $limit) {
                break;
            }
        }
    }
    return $words;
}
?>