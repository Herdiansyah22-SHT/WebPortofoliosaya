<?php
$dir = 'C:/WebPortofolio/frontend/src';
$it = new RecursiveIteratorIterator(new RecursiveDirectoryIterator($dir));

foreach ($it as $file) {
    if (!$file->isFile()) continue;
    $ext = strtolower($file->getExtension());
    if (!in_array($ext, ['jsx', 'js'])) continue;
    
    $path = $file->getPathname();
    $content = file_get_contents($path);
    
    // Safety check - we only want to modify public pages and components, maybe skip admin layout for a moment?
    // Actually, applying to all is fine since admin UI also uses the same design tokens.
    
    $new = str_replace('text-white', 'text-slate-900', $content);
    $new = str_replace('text-blue-500', 'text-blue-600', $new);
    $new = str_replace('text-blue-400', 'text-blue-600', $new); // merge accents
    $new = str_replace('text-blue-300', 'text-slate-700', $new); // blue-300 was usually body/subtle text, map to secondary
    $new = str_replace('text-slate-100', 'text-slate-900', $new);
    $new = str_replace('text-slate-200', 'text-slate-900', $new);
    $new = str_replace('text-slate-300', 'text-slate-800', $new);
    $new = str_replace('text-slate-400', 'text-slate-700', $new); // older muted mapped to secondary
    $new = str_replace('text-slate-500', 'text-slate-600', $new); // older muted mapped to metadata
    $new = str_replace('bg-blue-900/20', 'bg-blue-900', $new);
    $new = str_replace('bg-blue-900/30', 'bg-blue-900', $new);
    $new = str_replace('border-blue-500/40', 'border-blue-700', $new);
    $new = str_replace('border-blue-500/50', 'border-blue-700', $new);
    $new = str_replace('border-blue-600/50', 'border-blue-700', $new);
    $new = str_replace('border-blue-600/40', 'border-blue-700', $new);

    if ($new !== $content) {
        file_put_contents($path, $new);
        echo "Updated $path\n";
    }
}
