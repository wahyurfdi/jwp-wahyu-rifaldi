<template>
  <div>
    <div class="flex items-center py-4 justify-between">
      <Input class="w-[250px]" placeholder="Search..." v-model="globalFilter" />
      <slot name="actions" />
    </div>
    <div class="border rounded-md">
      <Table>
        <TableHeader>
          <TableRow v-for="headerGroup in table.getHeaderGroups()" :key="headerGroup.id">
            <TableHead v-for="header in headerGroup.headers" :key="header.id">
              <FlexRender
                v-if="!header.isPlaceholder"
                :render="header.column.columnDef.header"
                :props="header.getContext()"
              />
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <template v-if="table.getRowModel().rows?.length">
            <TableRow
              v-for="row in table.getRowModel().rows"
              :key="row.id"
              :data-state="row.getIsSelected() ? 'selected' : undefined"
            >
              <TableCell v-for="cell in row.getVisibleCells()" :key="cell.id">
                <FlexRender :render="cell.column.columnDef.cell" :props="cell.getContext()" />
              </TableCell>
            </TableRow>
          </template>
          <template v-else>
            <TableRow>
              <TableCell :colspan="columns.length" class="h-24 text-center">
                No results.
              </TableCell>
            </TableRow>
          </template>
        </TableBody>
      </Table>
    </div>
    <div class="py-4">
      <DataTablePagination :table="table" />
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { debounce } from 'lodash-es'
import {
  FlexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useVueTable,
} from '@tanstack/vue-table'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Input } from '@/components/ui/input'
import { valueUpdater } from '../table/utils'
import DataTablePagination from './DataTablePagination.vue'

const props = defineProps({
  data: { type: Array, required: true },
  columns: { type: Array, required: true },
  total: { type: Number, required: true },
})

const emit = defineEmits(['fetchData'])

const pageIndex = ref(0)
const pageSize = ref(10)

const table = useVueTable({
  manualPagination: true,
  manualSorting: true,
  get pageCount() {
    return Math.ceil(props.total / pageSize.value)
  },
  get data() {
    return props.data
  },
  get columns() {
    return props.columns
  },
  getCoreRowModel: getCoreRowModel(),
  getPaginationRowModel: getPaginationRowModel(),
  state: {
    get sorting() {
      return sorting.value
    },
    get columnFilters() {
      return columnFilters.value
    },
    get globalFilter() {
      return globalFilter.value
    },
    get pagination() {
      return {
        pageIndex: pageIndex.value,
        pageSize: pageSize.value,
      }
    },
  },
  onColumnFiltersChange: updaterOrValue => valueUpdater(updaterOrValue, columnFilters),
  onGlobalFilterChange: updaterOrValue => valueUpdater(updaterOrValue, globalFilter),
  onSortingChange: updaterOrValue => {
    valueUpdater(updaterOrValue, sorting)

    const sort = sorting.value[0] || {}
    emit('fetchData', {
      page: pageIndex.value + 1,
      limit: pageSize.value,
      search: globalFilter.value,
      sortBy: sort.id || null,
      sortOrder: sort.desc ? 'desc' : 'asc',
    })
  },
  onPaginationChange: async updaterOrValue => {
    const next =
      typeof updaterOrValue === 'function'
        ? updaterOrValue({ pageIndex: pageIndex.value, pageSize: pageSize.value })
        : updaterOrValue

    pageIndex.value = next.pageIndex
    pageSize.value = next.pageSize

    const sort = sorting.value[0] || {}
    emit('fetchData', {
      page: pageIndex.value + 1,
      limit: pageSize.value,
      search: globalFilter.value,
      sortBy: sort.id || null,
      sortOrder: sort.desc ? 'desc' : 'asc',
    })
  },
})

const sorting = ref([])
const columnFilters = ref([])
const globalFilter = ref('')

const debouncedFetch = debounce(() => {
  const sort = sorting.value[0] || {}
  emit('fetchData', {
    page: pageIndex.value + 1,
    limit: pageSize.value,
    search: globalFilter.value,
    sortBy: sort.id || null,
    sortOrder: sort.desc ? 'desc' : 'asc',
  })
}, 1500)

watch(globalFilter, () => {
  pageIndex.value = 0
  debouncedFetch()
})
</script>
