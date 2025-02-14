<template>
  <div
    class="min-h-screen bg-gray-900 text-gray-200 flex items-center justify-center"
  >
    <div class="text-center">
      <h1 class="text-6xl font-bold mb-4 glowing-text">404</h1>
      <p class="text-xl mb-8">Oops! Page not found</p>
      <button
        @click="goHome"
        class="px-6 py-2 bg-pink-600 hover:bg-pink-700 rounded-lg transition-colors"
      >
        Go Home
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: "NotFound",
  methods: {
    goHome() {
      window.location.href = "/";
    },
  },
};
</script>

<style scoped>
.glowing-text {
  font-weight: bold;
  color: #fff;
  animation: pink-glow 2s ease-in-out infinite;
}

@keyframes pink-glow {
  0% {
    text-shadow: 0 0 5px #ff69b4, 0 0 10px #ff69b4, 0 0 15px #ff69b4,
      0 0 20px #ff1493, 0 0 35px #ff1493;
  }
  50% {
    text-shadow: 0 0 7px #ff69b4, 0 0 12px #ff69b4, 0 0 17px #ff69b4,
      0 0 22px #ff1493, 0 0 37px #ff1493;
  }
  100% {
    text-shadow: 0 0 5px #ff69b4, 0 0 10px #ff69b4, 0 0 15px #ff69b4,
      0 0 20px #ff1493, 0 0 35px #ff1493;
  }
}
</style>
