import { ref, reactive } from "vue";
import { defineStore } from "pinia";
import { useMutation, useQuery } from "@pinia/colada";
import {
  getTodosApi,
  getTodoByIdApi,
  createTodoApi,
  updateTodoApi,
  updateStatusTodoApi,
  deleteTodoApi,
} from "@/api/todo";
import { toast } from "vue-sonner";

export const useTodoStore = defineStore("todo", () => {
  const todos = ref([]);
  const todo = ref(null);
  const todoId = ref(null);
  const meta = ref({});
  const filter = reactive({
    page: 1,
    limit: 10,
    search: "",
    sortBy: "",
    sortOrder: "",
  });

  const fetchTodos = useQuery({
    enabled: false,
    key: () => ["todos", filter],
    query: async () => {
      const response = await getTodosApi({
        page: filter.page,
        limit: filter.limit,
        search: filter.search,
        sort_by: filter.sortBy,
        sort_order: filter.sortOrder,
      });
      if (response.status === "OK") {
        todos.value = response.results.todos;
        meta.value = response.results.meta;
        return response;
      }
      throw new Error(response.message);
    },
  });

  const fetchTodo = useQuery({
    enabled: false,
    key: () => ["role", todoId.value],
    query: async () => {
      const response = await getTodoByIdApi(todoId.value);
      if (response.status === "OK") {
        todo.value = response.results.todo;
        return response;
      }
      throw new Error(response.message);
    },
  });

  const createTodo = useMutation({
    mutation: createTodoApi,
    onSuccess: (data) => {
      toast("Berhasil", { description: data.message });
    },
    onError: (error) => {
      toast("Terjadi Kesalahan", {
        description: error.response?.data.message ?? error.message,
      });
    },
  });

  const updateTodo = useMutation({
    mutation: updateTodoApi,
    onSuccess: (data) => {
      toast("Berhasil", { description: data.message });
    },
    onError: (error) => {
      toast("Terjadi Kesalahan", {
        description: error.response?.data.message ?? error.message,
      });
    },
  });

  const updateStatusTodo = useMutation({
    mutation: updateStatusTodoApi,
    onSuccess: (data) => {
      toast("Berhasil", { description: data.message });
    },
    onError: (error) => {
      toast("Terjadi Kesalahan", {
        description: error.response?.data.message ?? error.message,
      });
    },
  });

  const deleteTodo = useMutation({
    mutation: deleteTodoApi,
    onSuccess: (data) => {
      toast("Berhasil", { description: data.message });
    },
    onError: (error) => {
      toast("Terjadi Kesalahan", {
        description: error.response?.data.message ?? error.message,
      });
    },
  });

  return {
    todos,
    todo,
    todoId,
    meta,
    filter,
    fetchTodos,
    fetchTodo,
    createTodo,
    updateTodo,
    updateStatusTodo,
    deleteTodo,
  };
});
