<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Schema;

class Todo extends Model
{
    use HasFactory;

    public function __construct(array $attributes = [])
    {
        parent::__construct($attributes);
        $this->fillable = $this->getTableColumns();
    }

    private function getTableColumns()
    {
        return Schema::getColumnListing($this->getTable());
    }
}
