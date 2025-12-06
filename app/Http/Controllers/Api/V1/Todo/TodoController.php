<?php

namespace App\Http\Controllers\Api\V1\Todo;

use App\Http\Controllers\Controller;
use App\Http\Requests\Todo\TodoIndexRequest;
use App\Http\Requests\Todo\TodoRequest;
use App\Http\Requests\Todo\TodoStatusRequest;
use App\Http\Resources\Todo\TodoResource;
use App\Models\Todo;

class TodoController extends Controller
{
    public function index(TodoIndexRequest $request)
    {
        $todos = Todo::when(!empty($request->search), function ($query) use ($request) {
            $query->where(function ($query) use ($request) {
                $query->where('title', 'LIKE', "%{$request->search}%")
                    ->orWhere('description', 'LIKE', "%{$request->search}%");
            });
        })
            ->when(!$request->filled('sort_by'), function ($query) {
                $query->orderBy('is_completed', 'ASC');
            })
            ->when($request->filled('sort_by'), function ($query) use ($request) {
                $sortBy = $request->get('sort_by');
                $sortOrder = $request->get('sort_order', 'asc');
                $query->orderBy($sortBy, $sortOrder);
            })
            ->paginate($request->get('limit', 10));

        return $this->responseJson('OK', 'Berhasil menampilkan todo', [
            'todos' => TodoResource::collection($todos),
            'meta' => [
                'current_page' => $todos->currentPage(),
                'last_page' => $todos->lastPage(),
                'per_page' => $todos->perPage(),
                'total' => $todos->total(),
            ],
        ]);
    }

    public function store(TodoRequest $request)
    {
        $todo = Todo::create($request->validated());
        return $this->responseJson('OK', 'Berhasil menambahkan todo', [
            'todo' => new TodoResource($todo),
        ]);
    }

    public function show(Todo $todo)
    {
        return $this->responseJson('OK', 'Berhasil menampilkan todo', [
            'todo' => new TodoResource($todo),
        ]);
    }

    public function update(TodoRequest $request, Todo $todo)
    {
        $todo->update($request->validated());
        return $this->responseJson('OK', 'Berhasil mengubah todo', [
            'todo' => new TodoResource($todo),
        ]);
    }

    public function updateStatus(TodoStatusRequest $request, Todo $todo)
    {
        $todo->update($request->validated());
        return $this->responseJson('OK', 'Berhasil mengubah status todo', [
            'todo' => new TodoResource($todo),
        ]);
    }

    public function destroy(Todo $todo)
    {
        $todo->delete();
        return $this->responseJson('OK', 'Berhasil menghapus todo');
    }
}
