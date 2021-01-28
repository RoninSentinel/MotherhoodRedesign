<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class AOR extends Model
{
    use HasFactory;
    use SoftDeletes;

    // Would work without the following, but included for clarity.
    protected $table = 'aors'; 
    protected $hidden = ['creation_date', 'last_update', 'deleted_at'];

    protected $primaryKey = 'name';
    protected $keyType = 'string';
    public $incrementing = false;

    const CREATED_AT = 'creation_date';
    const UPDATED_AT = 'last_update';

    protected $fillable = [
        'name'
    ];

    public function lineTemplates() {
        return $this->hasMany(LineTemplate::class);
    }

}
