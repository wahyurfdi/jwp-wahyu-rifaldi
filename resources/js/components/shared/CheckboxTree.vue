<template>
  <ul class="space-y-2" :class="[`ml-${level * 2}`, level ? 'pl-4 border-l' : '']">
    <li v-for="node in nodes" :key="node.key">
      <div class="mb-2 flex items-center space-x-2">
        <Checkbox
          :key="String(node.key)"
          :model-value="checkedMap[node.key]"
          :disabled="disabled"
          @update:modelValue="value => onToggle(node.key, node.childrens, value)"
        />
        <Label :for="String(node.key)">{{ node.label }}</Label>
      </div>

      <CheckboxTree
        v-if="node.childrens && node.childrens.length > 0"
        :level="1"
        :nodes="node.childrens"
        :selected="selected"
        :disabled="disabled"
        :on-toggle="onToggle"
      />
    </li>
  </ul>
</template>

<script setup>
import { computed } from 'vue'
import Checkbox from '../ui/checkbox/Checkbox.vue'
import Label from '../ui/label/Label.vue'

const props = defineProps({
  level: {
    type: Number,
    default: 0,
  },
  nodes: {
    type: Array,
    required: true,
  },
  selected: {
    type: Array,
    required: true,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  onToggle: {
    type: Function,
    required: true,
  },
})

const checkedMap = computed(() => {
  const map = {}

  function traverse(node) {
    if (!node.childrens || node.childrens.length === 0) {
      map[node.key] = props.selected.includes(node.key) ? true : false
    } else {
      node.childrens.forEach(traverse)

      const states = node.childrens.map(c => map[c.key])
      if (states.every(s => s === true)) {
        map[node.key] = true
      } else if (states.some(s => s === true || s === 'indeterminate')) {
        map[node.key] = 'indeterminate'
      } else {
        map[node.key] = false
      }
    }
  }

  props.nodes.forEach(traverse)
  return map
})
</script>
