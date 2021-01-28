<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class LineType extends Model
{
    use HasFactory;
    use SoftDeletes;

    // Would work without the following, but included for clarity.
    protected $table = 'line_types';
    protected $hidden = ['creation_date', 'last_update', 'deleted_at'];

    const CREATED_AT = 'creation_date';
    const UPDATED_AT = 'last_update';

    protected $fillable = [
        'name',
    ];

    protected $primaryKey = 'name';
    protected $keyType = 'string';
    public $incrementing = false;

    public function lineTemplates() {
        return $this->hasMany(LineTemplate::class);
    }
}
