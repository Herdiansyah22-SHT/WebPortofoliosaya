<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('media', function (Blueprint $table) {
            $table->id();
            $table->string('model_type')->nullable();
            $table->unsignedBigInteger('model_id')->nullable();
            $table->string('collection', 64)->default('default');
            $table->string('name');
            $table->string('path');
            $table->string('disk', 32)->default('public');
            $table->string('mime_type', 100);
            $table->unsignedBigInteger('size')->default(0);
            $table->unsignedSmallInteger('width')->nullable();
            $table->unsignedSmallInteger('height')->nullable();
            $table->string('alt_text')->nullable();
            $table->timestamps();

            $table->index(['model_type', 'model_id']);
            $table->index('collection');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('media');
    }
};
