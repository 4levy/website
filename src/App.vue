<template>
  <Snowfall v-if="showSnowfall" />
  <div class="min-h-screen bg-gray-900 text-gray-200 p-4 sm:p-8" @contextmenu.prevent="handleRightClick">
    <Alert :show="showAlert" :message="alertMessage" />
    <div class="max-w-4xl mx-auto">
      <header class="flex flex-col items-center md:flex-row md:items-start gap-6 mb-8 md:mb-12">
        <div class="flex-1 text-center md:text-left">
          <h1 class="text-4xl font-bold mb-4">{{ profile.name }}</h1>
          <p class="text-lg mb-4">{{ profile.bio }}</p>
          <p class="text-gray-400 text-sm">{{ profile.note }}</p>
        </div>
        <div class="flex flex-col gap-4 items-center">
          <img 
            src="https://i.postimg.cc/rs37f0sN/a154648b79b7119a3bfaf1cdbb4b133e.png"
            class="rounded-lg w-48 md:w-64 h-auto shadow-lg"
            alt="Profile"
          />
          <div class="counter-container w-full px-2">
            <img 
              src="https://count.getloli.com/@4levy?name=4levy&theme=booru-qualityhentais"
              class="rounded-lg"
              alt="Counter"
            />
          </div>
        </div>
      </header>
    </div> 
  </div>
</template>

<script>
import Alert from './components/Alert.vue'
import Snowfall from './components/Snowfall.vue'

export default {
  name: 'App',
  components: {
    Alert,
    Snowfall
  },
  data() {
    return {
      profile: {
        name: '4levy',
        bio: 'I am a 16 y/o, discord bot developer.',
        note: 'this website got nothing'
      },
      showAlert: false,
      alertMessage: '',
      alertTimeout: null,
      showSnowfall: true
    }
  },
  mounted() {
    document.addEventListener('keydown', this.preventDevTools);
    this.detectDevTools();
  },
  methods: {
    showAlertMessage(message) {
      this.alertMessage = message;
      this.showAlert = true;
      
      if (this.alertTimeout) {
        clearTimeout(this.alertTimeout);
      }
      
      this.alertTimeout = setTimeout(() => {
        this.showAlert = false;
      }, 2000);
    },
    handleRightClick(event) {
      event.preventDefault();
      this.showAlertMessage('Right-click is disabled on this page!');
    },
    preventDevTools(e) {
      const devToolsKeys = [
        { key: 'F12', message: 'Developer tools are not allowed (F12)!' },
        { key: 'i', ctrl: true, shift: true, message: 'Developer tools are not allowed (Ctrl+Shift+I)!' },
        { key: 'j', ctrl: true, shift: true, message: 'Developer tools are not allowed (Ctrl+Shift+J)!' },
        { key: 'u', ctrl: true, message: 'View source is not allowed (Ctrl+U)!' }
      ];

      devToolsKeys.forEach(({ key, ctrl, shift, message }) => {
        const isPressed = (e.key === key || e.key.toLowerCase() === key) && (!ctrl || e.ctrlKey || e.metaKey) && (!shift || e.shiftKey);
        if (isPressed) {
          e.preventDefault();
          this.showAlertMessage(message);
        }
      });
    },
    detectDevTools() {
      const threshold = 160;
      
      const emitCheck = () => {
        const widthThreshold = window.outerWidth - window.innerWidth > threshold;
        const heightThreshold = window.outerHeight - window.innerHeight > threshold;
        
        if (widthThreshold || heightThreshold) {
          this.showAlertMessage('Developer tools detected!');
          window.location.reload();
        }
      };

      setInterval(emitCheck, 1000);
    }
  },
  beforeDestroy() {
    document.removeEventListener('keydown', this.preventDevTools);
    document.removeEventListener('contextmenu', this.handleRightClick);
    if (this.alertTimeout) {
      clearTimeout(this.alertTimeout);
    }
  }
}
</script>

<style scoped>
.counter-container {
  padding: 0.5rem;
  border-radius: 0.5rem;
  backdrop-filter: blur(5px);
}
</style>
