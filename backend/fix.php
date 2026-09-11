<?php
$dir = 'C:/WebPortofolio/frontend/src';
$it = new RecursiveIteratorIterator(new RecursiveDirectoryIterator($dir));
$target = "\xc3\xaf\xc2\xbf\xc2\xbd";
$replace = "\xE2\x80\x94";
$count = 0;
foreach ($it as $file) {
    if (!$file->isFile()) continue;
    $ext = strtolower($file->getExtension());
    if (!in_array($ext, ['jsx', 'js'])) continue;
    $content = file_get_contents($file->getPathname());
    $count++;
    if (strpos($content, $target) !== false) {
        $new = str_replace($target, $replace, $content);
        file_put_contents($file->getPathname(), $new);
        echo "Fixed " . $file->getPathname() . "\n";
    }
}
echo "Scanned $count files\n";