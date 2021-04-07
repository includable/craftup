<?php

/*
 * This script is used to check if we're able to write to the FTP server. It's uploaded to the server, then called
 * over HTTP. If everything goes well, it will output the value %MAGIC_VALUE%. If not, there's something wrong.
 */

ini_set('display_errors', 1);
error_reporting(E_ALL);

if (!version_compare(PHP_VERSION, '7.0.0', '>=')) {
    echo 'Using PHP version ' . PHP_VERSION . '. PHP 7 or higher is required.';
    exit;
}

if (!class_exists('ZipArchive')) {
    echo 'ZipArchive class does not exist. PHP ZIP extension is not installed.';
    exit;
}

$magic_string = '89shd98hgs90dg9sgugaouhsaosnjska';
$zip = new ZipArchive();
$basedir = __DIR__;
$zip->open($basedir . '/__craftup_ziptest.zip', ZipArchive::CREATE);
$zip->addFromString('/__craftup_foo/magic.txt', $magic_string);
$zip->close();

$rootdir = dirname($basedir);
$unzip = new ZipArchive();
$unzip->open($basedir . '/__craftup_ziptest.zip');
if (!$unzip->extractTo($rootdir)) {
    echo 'Could not write to path ' . $rootdir . ' (ZIP failed to extract).';
    exit;
}

$unzip->close();

if (!file_exists($rootdir . '/__craftup_foo/magic.txt')) {
    echo 'Could not write to path ' . $rootdir . ' (could not find extracted file).';
    exit;
}

$contents = file_get_contents($rootdir . '/__craftup_foo/magic.txt');
if (!$contents) {
    echo 'Could not read written file. Possibly means your permissions might be wrong.';
    exit;
}

if (!unlink($rootdir . '/__craftup_foo/magic.txt')) {
    echo 'Error removing written file. Possibly means your permissions might be wrong.';
    exit;
}

unlink($basedir . '/__craftup_ziptest.zip');

echo PHP_EOL . PHP_EOL . '<<<' . $contents . '>>>';
