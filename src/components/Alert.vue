<template>
  <transition name="fade">
    <div v-if="show" class="fixed inset-x-0 bottom-0 z-50 p-4">
      <div class="bg-red-500 text-white px-10 py-6 rounded-t-xl shadow-2xl max-w-md mx-auto flex flex-col items-center gap-3">
        <span class="text-2xl">⚠️</span>
        <p class="font-medium text-center text-lg leading-relaxed">{{ message }}</p>
      </div>
    </div>
  </transition>
</template>

<script setup>
defineProps({
  show: Boolean,
  message: String
})
</script>

<style>
.fade-enter-active,
.fade-leave-active {
  transition: all 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(100%);
}
</style>
