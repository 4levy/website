<template>
  <Snowfall />
  <div class="min-h-screen bg-gray-900 text-gray-200 p-8" @contextmenu.prevent>
    <Alert :show="showAlert" :message="alertMessage" />
    <div class="max-w-4xl mx-auto">
      <header class="flex flex-col md:flex-row justify-between items-start mb-12">
        <div class="flex-1">
          <h1 class="text-3xl font-bold mb-4">{{ profile.name }}</h1>
          <p class="mb-4">{{ profile.bio }}</p>
          <p class="text-gray-400">{{ profile.note }}</p>
        </div>
        <div class="mt-6 md:mt-0">
          <img 
            src="https://i.postimg.cc/rs37f0sN/a154648b79b7119a3bfaf1cdbb4b133e.png"
            class="rounded-lg"
          />
        </div>
        <div class="mt-6 md:mt-0">
          <img 
            src="https://count.getloli.com/@4levy?name=4levy&theme=booru-qualityhentais"
            class="rounded-lg"
          />
        </div>
      </header>
    </div> 
  </div>
</template>

<script >
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
    
    document.addEventListener('contextmenu', this.handleRightClick);
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
      return false;
    },
    preventDevTools(e) {
      if (e.key === 'F12') {
        e.preventDefault();
        this.showAlertMessage('Developer tools are not allowed (F12)!');
        return false;
      }
      
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === 'i') {
        e.preventDefault();
        this.showAlertMessage('Developer tools are not allowed (Ctrl+Shift+I)!');
        return false;
      }
      
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === 'j') {
        e.preventDefault();
        this.showAlertMessage('Developer tools are not allowed (Ctrl+Shift+J)!');
        return false;
      }
      
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'u') {
        e.preventDefault();
        this.showAlertMessage('View source is not allowed (Ctrl+U)!');
        return false;
      }
    },
    detectDevTools() {
      const devtools = {
        isOpen: false,
        orientation: undefined
      };
      
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
