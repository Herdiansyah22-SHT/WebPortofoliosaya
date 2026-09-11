<?php
require 'vendor/autoload.php';
$app = require 'bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

$rows = \App\Models\Education::all();
foreach ($rows as $row) {
    $out = "ID:{$row->id} START:{$row->start_year} END:" . ($row->end_year ?? 'null') . " INST:" . $row->institution . " DEG:" . ($row->degree ?? 'null') . " FOS:" . ($row->field_of_study ?? 'null') . " DESC:" . ($row->description ?? 'null') . "\n";
    file_put_contents('public/edu.txt', $out, FILE_APPEND);
}
echo "done\n";
