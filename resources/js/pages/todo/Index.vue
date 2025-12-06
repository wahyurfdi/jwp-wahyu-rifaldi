<template>
  <div class="p-5">
    <div>
      <h2 class="text-2xl font-bold tracking-tight">Todos</h2>
      <p class="text-muted-foreground">
        Here's the list of todos you can manage
      </p>
    </div>
    <DataTable
      :columns="columns"
      :data="todoStore.todos"
      :total="todoStore.meta?.total ?? 0"
      @fetchData="handleFetchList"
    >
      <template v-slot:actions>
        <Button @click="handleAdd"> <CirclePlus /> Todo </Button>
      </template>
    </DataTable>
  </div>

  <Dialog v-model:open="showUpsertDialog">
    <DialogContent :class="'w-[400px]'">
      <DialogHeader>
        <DialogTitle>TODO FORM</DialogTitle>
        <DialogDescription> </DialogDescription>
      </DialogHeader>

      <form @submit="onSubmitForm" class="space-y-4">
        <FormField v-slot="{ componentField }" name="id" :class="'hidden'">
          <Input type="hidden" placeholder="Enter ID" v-bind="componentField" />
        </FormField>

        <FormField v-slot="{ componentField }" name="title">
          <FormItem>
            <FormLabel>Title</FormLabel>
            <FormControl>
              <Input
                type="text"
                placeholder="Enter title"
                v-bind="componentField"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>

        <FormField v-slot="{ componentField }" name="description">
          <FormItem>
            <FormLabel>Description</FormLabel>
            <FormControl>
              <Textarea
                placeholder="Enter description"
                v-bind="componentField"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>

        <DialogFooter>
          <Button
            type="button"
            @click="showUpsertDialog = false"
            :variant="'secondary'"
          >
            Close
          </Button>
          <Button
            type="submit"
            :is-loading="
              todoStore[
                form.values.mode === 'add' ? 'createTodo' : 'updateTodo'
              ].isLoading
            "
          >
            Submit
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  </Dialog>

  <AlertDialog v-model:open="showDeleteDialog">
    <AlertDialogContent class="w-[450px] max-w-full">
      <AlertDialogHeader>
        <AlertDialogTitle>Delete Todo</AlertDialogTitle>
        <AlertDialogDescription>
          Are you sure you want to delete this todo? This action cannot be
          undone.
        </AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <Button :variant="'outline'" @click="showDeleteDialog = false">
          Cancel
        </Button>
        <Button
          :variant="'destructive'"
          @click="handleDelete"
          :is-loading="todoStore.deleteTodo.isLoading"
        >
          Delete
        </Button>
      </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>
</template>

<script setup>
import { ref, onMounted, watch } from "vue";
import { useTodoStore } from "@/stores/todo";
import { CirclePlus } from "lucide-vue-next";
import Button from "@/components/ui/button/Button.vue";
import DataTable from "@/components/ui/datatable/DataTable.vue";
import Textarea from "@/components/ui/textarea/Textarea.vue";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import Input from "@/components/ui/input/Input.vue";
import { createColumns } from "./config/columns";
import { toTypedSchema } from "@vee-validate/zod";
import { useForm } from "vee-validate";
import * as z from "zod";

const todoStore = useTodoStore();

const id = ref("");
const showDeleteDialog = ref(false);
const showUpsertDialog = ref(false);

onMounted(() => {
  todoStore.fetchTodos.refetch();
});

watch(showUpsertDialog, (newValue) => {
  if (!newValue) {
    form.resetForm({
      values: {
        id: "",
        title: "",
        description: "",
      },
    });
  }
});

const columns = createColumns({
  onEdit: async (data) => {
    todoStore.todoId = data.id;
    await todoStore.fetchTodo.refetch();

    const todo = todoStore.todo;
    form.setValues({
      mode: "edit",
      id: todo.id,
      title: todo.title,
      description: todo.description,
    });

    showUpsertDialog.value = true;
  },
  onDelete: (data) => {
    id.value = data.id;
    showDeleteDialog.value = true;
  },
  onToggleActive: (data, status) => {
    todoStore.updateStatusTodo.mutate({
      id: data.id,
      payload: { is_completed: status ? 1 : 0 },
    });
  },
});

const handleFetchList = ({ page, limit, search, sortBy, sortOrder }) => {
  todoStore.filter.page = page;
  todoStore.filter.limit = limit;
  todoStore.filter.search = search;
  todoStore.filter.sortBy = sortBy;
  todoStore.filter.sortOrder = sortOrder;
  todoStore.fetchTodos.refetch();
};

const handleAdd = () => {
  id.value = "";
  form.setValues({ mode: "add" });
  showUpsertDialog.value = true;
};

const handleDelete = async () => {
  await todoStore.deleteTodo.mutateAsync(id.value);
  await todoStore.fetchTodos.refetch();
  showDeleteDialog.value = false;
};

const baseFormSchema = {
  title: z.string().min(4),
  description: z.string().nullable().optional(),
};
const addFormSchema = z.object(baseFormSchema).passthrough();
const editFormShema = z
  .object(baseFormSchema)
  .extend({ id: z.number().int().positive() })
  .passthrough();

const formSchema = toTypedSchema(
  z.discriminatedUnion("mode", [
    addFormSchema.extend({ mode: z.literal("add") }),
    editFormShema.extend({ mode: z.literal("edit") }),
  ])
);

const form = useForm({
  validationSchema: formSchema,
});

const onSubmitForm = form.handleSubmit(async (values) => {
  if (values.mode === "add") {
    console.log(values);
    await todoStore.createTodo.mutateAsync(values);
  } else {
    await todoStore.updateTodo.mutateAsync({ id: values.id, payload: values });
  }
  await todoStore.fetchTodos.refetch();
  showUpsertDialog.value = false;
});
</script>
