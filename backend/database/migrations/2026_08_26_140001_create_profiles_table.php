<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('profiles', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('user_id')->nullable();
            $table->unique('user_id');
            $table->foreign('user_id')->references('id')->on('users')->nullOnDelete();
            $table->string('name');
            $table->string('headline');
            $table->text('bio')->nullable();
            $table->string('location')->nullable();
            $table->string('email')->nullable();
            $table->string('phone', 32)->nullable();
            $table->boolean('is_available')->default(true);
            $table->json('social_links')->nullable();
            $table->string('resume_path')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('profiles');
    }
};
