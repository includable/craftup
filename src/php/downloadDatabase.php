<?php

define('CRAFT_BASE_PATH', dirname(__DIR__));
define('CRAFT_VENDOR_PATH', CRAFT_BASE_PATH . '/vendor');

// Load Composer's autoloader
require_once CRAFT_VENDOR_PATH . '/autoload.php';

// Load dotenv?
if (file_exists(CRAFT_BASE_PATH . '/.env')) {
    (Dotenv\Dotenv::create(CRAFT_BASE_PATH))->load();
}

// Load craft
define('CRAFT_ENVIRONMENT', getenv('ENVIRONMENT') ?: 'production');
$app = require CRAFT_VENDOR_PATH . '/craftcms/cms/bootstrap/web.php';

$dump_filename = str_replace('.php', '.sql', __FILE__);
$backupPath = $app->getDb()->backupTo($dump_filename);

echo basename($dump_filename);
