<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class AdminToken extends Model
{
    use HasFactory;
    use SoftDeletes;

    protected $table = 'admin_tokens';
    protected $hidden = ['creation_date', 'last_update', 'deleted_at'];

    protected $fillable = [
        'code',
        'access_level',
        'squadron_id',
        'is_active',
    ];

    protected $casts = [
        'is_active' => 'boolean'
    ];

    const CREATED_AT = 'creation_date';
    const UPDATED_AT = 'last_update';

    public function squadron() {
        return $this->belongsTo(Squadron::class);
    }
}
