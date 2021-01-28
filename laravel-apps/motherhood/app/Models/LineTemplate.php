<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class LineTemplate extends Model
{
    use HasFactory;
    use SoftDeletes;

    // Would work without the following, but included for clarity.
    protected $table = 'line_templates';  
    protected $hidden = ['creation_date', 'last_update', 'deleted_at'];
    
    const CREATED_AT = 'creation_date';
    const UPDATED_AT = 'last_update';

    protected $casts = [
        'is_active' => 'boolean',
        'is_hidden_in_read_mode' => 'boolean',
    ];

    protected $fillable = [
        'name',
        'line_type_id',
        'color',
        'is_active',
        'order_preference',
        'call_sign',
        'squadron_id',
        'aor_id',
        'is_hidden_in_read_mode',
        'extra_field_name',
        'line_type_id',
        'squadron_id',
        'aor_id',

    ];

    public function lineType() {
        return $this->hasOne(LineType::class);
    }

    public function squadron() {
        return $this->hasOne(Squadron::class);
    }

    public function aor() {
        return $this->hasOne(AOR::class);
    }

    public function lineInstance() {
        return $this->belongsTo(LineInstance::class);
    }

}
