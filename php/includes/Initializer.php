<?php
class Initializer{
	public function initConf($container){
		$container['siteConf'] = function($c){
			include $c['PHP_PATH'].'includes/config.env.php';
			
			$difftime = strtotime(date('Y-m-d H:i:s')) - strtotime('2014-04-01 00:00:00');
			
			$siteConf = array(
				'db_host' => $db_host,
				'db_name' => $db_name,
				'db_user' => $db_user,
				'db_pass' => $db_pass,
				'DEBUG_MODE' => $DEBUG_MODE,
				'version' => substr($difftime,-6),
			);
            return $siteConf;
        };
        return $container;
    }
	
	public function initPath($container){
		$container['path'] = function($c){
			$paths = array();
			$paths['twig'] = $c['ROOT_PATH'] . 'res/';
			$paths['caches'] = $c['ROOT_PATH'] . 'caches/';
			$paths['resources'] = $c['WEB_ROOT'] . 'res/';
			$public_path = $c['WEB_ROOT'] . 'public/';
			$paths['css'] = $public_path . 'css/';
			$paths['js'] = $public_path . 'js/';
			$paths['img'] = $public_path . 'images/';
            return $paths;
        };
        return $container;
    }
	
	public function initTwig($container){
		$container['twig'] = function($c){
			include $c['PHP_PATH'] . 'vender/Twig/lib/Twig/Autoloader.php';
			Twig_Autoloader::register();
			$loader = new Twig_Loader_Filesystem($c['path']['twig']);
			$twig = new Twig_Environment($loader, array(
				'cache' => false
			));
			return $twig;
        };
        return $container;
    }

    public function initVars($container){
    		$container['vars'] = function($c){
    			include $c['ROOT_PATH'].'includes/config.vars.php';
    			$vars = array(
    				'articles' => $articles
    			);
                return $vars;
            };
            return $container;
        }

	public function initBase($container){
		$container['db'] = function($c){
			include $c['PHP_PATH'].'includes/db.class.php';
			return new Db($c['siteConf']);
        };
        return $container;
    }
}

?>