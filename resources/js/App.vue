<template>
  <RouterView />
  <Toaster :theme="'system'" :duration="3000" />
</template>

<script setup>
import "vue-sonner/style.css";
import { Toaster } from "@/components/ui/sonner";
</script>
