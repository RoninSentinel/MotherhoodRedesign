<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class BlockCategory extends Model
{
    use HasFactory;
    use SoftDeletes;

    // Would work without the following, but included for clarity.
    protected $table = 'block_categories';
    protected $fillable = ['name', 'short_name', 'color', 'is_active', 'squadron_id'];
    protected $hidden = ['creation_date', 'last_update', 'deleted_at'];

    const CREATED_AT = 'creation_date';
    const UPDATED_AT = 'last_update';

    protected $casts = [
        'is_active' => 'boolean'
    ];

    public function squadron() {
        return $this->belongsTo(Squadron::class);
    }

    public function shiftLineTimeBlocks() {
        return $this->hasMany(ShiftLineTimeBlock::class);
    }
}

