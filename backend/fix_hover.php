<?php
$dir = 'C:/WebPortofolio/frontend/src';
$it = new RecursiveIteratorIterator(new RecursiveDirectoryIterator($dir));
foreach ($it as $file) {
    if (!$file->isFile()) continue;
    $ext = strtolower($file->getExtension());
    if (!in_array($ext, ['jsx', 'js'])) continue;
    $path = $file->getPathname();
    $content = file_get_contents($path);
    $new = str_replace('hover:text-blue-600', 'hover:text-blue-400', $content);
    if ($new !== $content) {
        file_put_contents($path, $new);
        echo "Update $path\n";
    }
}