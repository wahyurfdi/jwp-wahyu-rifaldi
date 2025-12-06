<template>
  <Button
    v-if="column.getCanSort()"
    :variant="'ghost'"
    :class="'-ml-3'"
    @click="column.toggleSorting(column.getIsSorted() === 'asc')"
  >
    <span>{{ title }}</span>
    <ChevronsDown v-if="column.getIsSorted() === 'desc'" />
    <ChevronsUp v-else-if="column.getIsSorted() === 'asc'" />
    <ChevronsUpDown v-else />
  </Button>
  <span v-else>{{ title }}</span>
</template>

<script setup>
import Button from '@/components/ui/button/Button.vue'
import { ChevronsUpDown, ChevronsDown, ChevronsUp } from 'lucide-vue-next'

defineProps({
  column: { type: Object, required: true },
  title: { type: String, required: true },
})
</script>
