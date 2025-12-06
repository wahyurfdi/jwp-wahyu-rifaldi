<script setup>
import { Loader2 } from 'lucide-vue-next'
import { Primitive } from 'reka-ui'
import { cn } from '@/lib/utils'
import { buttonVariants } from '.'

const props = defineProps({
  variant: { type: null, required: false },
  size: { type: null, required: false },
  class: { type: null, required: false },
  asChild: { type: Boolean, required: false },
  as: { type: null, required: false, default: 'button' },
  isLoading: { type: Boolean, required: false },
  disabled: { type: Boolean, default: false },
})
</script>

<template>
  <Primitive
    data-slot="button"
    :as="as"
    :as-child="asChild"
    :disabled="isLoading || disabled"
    :class="cn(buttonVariants({ variant, size }), props.class)"
  >
    <template v-if="isLoading">
      <Loader2 class="w-4 h-4 animate-spin" />
      <span>Please Wait...</span>
    </template>
    <slot v-else />
  </Primitive>
</template>
