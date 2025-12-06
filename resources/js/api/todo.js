import api from "@/plugins/axios";

export const getTodosApi = async (params = {}) => {
  try {
    const { data } = await api.get("/todos", { params });
    if (data.status !== "OK")
      throw new Error(data.message || "Gagal mengambil list todo");
    return data;
  } catch (error) {
    throw error;
  }
};

export const getTodoByIdApi = async (id) => {
  try {
    const { data } = await api.get(`/todos/${id}`);
    if (data.status !== "OK")
      throw new Error(data.message || "Gagal mengambil detail todo");
    return data;
  } catch (error) {
    throw error;
  }
};

export const createTodoApi = async (payload) => {
  try {
    const { data } = await api.post("/todos", payload);
    if (data.status !== "OK")
      throw new Error(data.message || "Gagal menambahkan todo");
    return data;
  } catch (error) {
    throw error;
  }
};

export const updateTodoApi = async ({ id, payload }) => {
  try {
    const { data } = await api.put(`/todos/${id}`, payload);
    if (data.status !== "OK")
      throw new Error(data.message || "Gagal memperbarui todo");
    return data;
  } catch (error) {
    throw error;
  }
};

export const updateStatusTodoApi = async ({ id, payload }) => {
  try {
    const { data } = await api.put(`/todos/${id}/status`, payload);
    if (data.status !== "OK")
      throw new Error(data.message || "Gagal memperbarui status todo");
    return data;
  } catch (error) {
    throw error;
  }
};

export const deleteTodoApi = async (id) => {
  try {
    const { data } = await api.delete(`/todos/${id}`);
    if (data.status !== "OK")
      throw new Error(data.message || "Gagal menghapus todo");
    return data;
  } catch (error) {
    throw error;
  }
};
