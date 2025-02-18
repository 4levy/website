<template>
  <div 
    class="min-h-screen bg-[#0a0a0a] text-gray-300 font-mono"
    @contextmenu.prevent="handleRightClick"
  >
    <Snowfall v-if="showSnowfall" />

    <Userinfo />

    <Alert :show="showAlert" :message="alertMessage" />
  </div>
</template>

<script>
import Userinfo from "./components/Userinfo.vue";
import Alert from "./components/Alert.vue";
import Snowfall from "./components/Snowfall.vue";

export default {
  name: "App",
  components: {
    Userinfo,
    Alert,
    Snowfall,
  },
  data() {
    return {
      showAlert: false,
      alertMessage: "",
      alertTimeout: null,
      showSnowfall: true,
      ws: null,
    };
  },
  created() {
    document.addEventListener("contextmenu", this.handleRightClick);
  },
  mounted() {
    document.addEventListener("keydown", this.preventDevTools);
    this.detectDevTools();
    this.connectWebsocket();
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
        this.alertMessage = "";
      }, 2000);
    },

    handleRightClick(event) {
      event.preventDefault();
      event.stopPropagation();
      this.showAlertMessage("Right-click is disabled on this page!");
      return false;
    },

    preventDevTools(e) {
      const devToolsKeys = [
        {
          key: "F12",
          message: "Developer tools are not allowed!",
        },
        {
          key: "i",
          ctrl: true,
          shift: true,
          message: "Developer tools are not allowed (Ctrl+Shift+I)!",
        },
        {
          key: "j",
          ctrl: true,
          shift: true,
          message: "Developer tools are not allowed (Ctrl+Shift+J)!",
        },
        {
          key: "u",
          ctrl: true,
          message: "View source is not allowed (Ctrl+U)!",
        },
        {
          key: "i",
          meta: true,
          alt: true,
          message: "Developer tools are not allowed (Cmd+Alt+I)!",
        },
        {
          key: "j",
          meta: true,
          alt: true,
          message: "Developer tools are not allowed (Cmd+Alt+J)!",
        },
        {
          key: "c",
          meta: true,
          alt: true,
          message: "Developer tools are not allowed (Cmd+Alt+C)!",
        },
        {
          key: "F12",
          mobile: true,
          message: "Developer tools are not allowed on mobile devices!",
        },
      ];

      devToolsKeys.forEach(({ key, ctrl, shift, meta, alt, mobile, message }) => {
        const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
        const isPressed =
          (e.key === key || e.key.toLowerCase() === key) &&
          (!ctrl || e.ctrlKey) &&
          (!shift || e.shiftKey) &&
          (!meta || e.metaKey) &&
          (!alt || e.altKey) &&
          (!mobile || isMobile);

        if (isPressed) {
          e.preventDefault();
          this.showAlertMessage(message);
        }
      });
    },

    detectDevTools() {
      let wasOpened = false;
      const threshold = 160;
      const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
      const isMac = /Mac/i.test(navigator.platform);

      const emitCheck = () => {
        const widthThreshold = window.outerWidth - window.innerWidth > threshold;
        const heightThreshold = window.outerHeight - window.innerHeight > threshold;
        const mobileDevTools =
          (window.console && window.console.firebug) ||
          window.console.profiles ||
          (isMobile && window.outerHeight === 0) ||
          (isMobile && window.outerWidth === 0);

        if (widthThreshold || heightThreshold || mobileDevTools) {
          if (!wasOpened) {
            wasOpened = true;
            document.documentElement.innerHTML = isMac
              ? "Developer tools are not allowed on Mac!"
              : "Why toggle developer tools?";
            window.location.replace("about:blank#why-toggle-devtools");
          }
        }
      };

      setInterval(emitCheck, 1000);
    },
  },
  beforeUnmount() {
    document.removeEventListener("keydown", this.preventDevTools);
    document.removeEventListener("contextmenu", this.handleRightClick);
    if (this.alertTimeout) {
      clearTimeout(this.alertTimeout);
    }
    if (this.ws) {
      this.ws.close();
    }
  },
};
</script>

<style scoped>
* {
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
  -webkit-touch-callout: none;
}
</style>
