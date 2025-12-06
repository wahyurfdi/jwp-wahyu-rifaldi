import { h, ref } from "vue";
import { Edit, Trash } from "lucide-vue-next";
import Button from "@/components/ui/button/Button.vue";
import Switch from "@/components/ui/switch/Switch.vue";
import DataTableColumnHeader from "@/components/ui/datatable/DataTableColumnHeader.vue";

export const createColumns = ({ onEdit, onDelete, onToggleActive }) => [
  {
    accessorKey: "title",
    header: ({ column }) => {
      return h(DataTableColumnHeader, {
        column: column,
        title: "Title",
      });
    },
  },
  {
    accessorKey: "description",
    header: ({ column }) => {
      return h(DataTableColumnHeader, {
        column: column,
        title: "Description",
      });
    },
  },
  {
    accessorKey: "is_completed",
    header: () => h("div", { class: "text-center" }, "Status"),
    cell: ({ row }) =>
      h(
        "div",
        { class: "flex justify-center" },
        h(Switch, {
          modelValue: row.original.is_completed === 1,
          "onUpdate:modelValue": (value) => {
            row.original.is_completed = value ? 1 : 0;

            onToggleActive(row.original, value);
          },
        })
      ),
  },
  {
    accessorKey: "action",
    header: () => h("div", { class: "text-center" }, "Action"),
    cell: ({ row }) =>
      h("div", { class: "flex justify-center gap-2" }, [
        h(
          Button,
          {
            size: "sm",
            variant: "ghost",
            "aria-label": "Edit",
            onClick: () => onEdit(row.original),
          },
          { default: () => h(Edit, { class: "w-4 h-4" }) }
        ),
        h(
          Button,
          {
            size: "sm",
            variant: "ghost",
            "aria-label": "Delete",
            onClick: () => onDelete(row.original),
          },
          { default: () => h(Trash, { class: "w-4 h-4 text-red-500" }) }
        ),
      ]),
  },
];
