<template>
  <Snowfall v-if="showSnowfall" />
  <div
    class="min-h-screen bg-gray-900 text-gray-200 p-4 sm:p-8"
    @contextmenu.prevent="handleRightClick"
  >
    <Alert :show="showAlert" :message="alertMessage" />
    <div class="max-w-4xl mx-auto">
      <header
        class="flex flex-col items-center md:flex-row md:items-start gap-6 mb-8 md:mb-12"
      >
        <div class="flex-1 text-center md:text-left">
          <h1 class="text-4xl font-bold mb-4 glowing-text">
            {{ profile.name }}
          </h1>
          <p class="text-lg mb-4">{{ profile.bio }}</p>
          <p class="text-gray-400 text-sm">{{ profile.note }}</p>
        </div>
        <div class="flex flex-col gap-4 items-center">
          <img
            :src="profile.avatar"
            class="rounded-lg w-48 md:w-64 h-auto shadow-lg"
            alt="Profile"
          />
          <div class="counter-container w-full px-2">
            <img
              src="https://count.getloli.com/@4levy?name=4levy&theme=booru-qualityhentais"
              class="rounded-lg"
            />
          </div>
        </div>
      </header>
    </div>
  </div>
</template>

<script>
import Alert from "./components/Alert.vue";
import Snowfall from "./components/Snowfall.vue";

export default {
  name: "App",
  components: {
    Alert,
    Snowfall,
  },
  data() {
    return {
      profile: {
        name: "4levy",
        bio: "I am a 16 y/o, discord bot developer.",
        note: "Freelancer",
        avatar: "https://i.postimg.cc/jSpxRd4F/ezgif-7-880e4f2ec3OHO.gif",
      },
      showAlert: false,
      alertMessage: "",
      alertTimeout: null,
      showSnowfall: true,
      ws: null,
      DISCORD_ID: "874898422233178142",
    };
  },
  mounted() {
    document.addEventListener("keydown", this.preventDevTools);
    this.detectDevTools();
    this.connectWebsocket();
  },
  methods: {
    connectWebsocket() {
      this.ws = new WebSocket("wss://api.lanyard.rest/socket");

      this.ws.onopen = () => {
        this.ws.send(
          JSON.stringify({
            op: 2,
            d: {
              subscribe_to_id: this.DISCORD_ID,
            },
          })
        );
      };

      this.ws.onmessage = ({ data }) => {
        const received = JSON.parse(data);

        if (received.op === 1) {
          this.ws.send(JSON.stringify({ op: 3 }));
        }

        if (received.op === 0) {
          if (received.t === "INIT_STATE" || received.t === "PRESENCE_UPDATE") {
            this.updateProfile(received.d);
          }
        }
      };

      this.ws.onclose = () => {
        setTimeout(this.connectWebsocket, 1000);
      };
    },

    updateProfile(data) {
      if (data.discord_user) {
        const avatarId = data.discord_user.avatar;
        const userId = data.discord_user.id;
        this.profile.avatar = `https://cdn.discordapp.com/avatars/${userId}/${avatarId}.png?size=256`;
      }
    },

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
      this.showAlertMessage("Right-click is disabled on this page!");
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
        // Mac specific shortcuts
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
        // Mobile detection
        {
          key: "F12",
          mobile: true,
          message: "Developer tools are not allowed on mobile devices!",
        },
      ];

      devToolsKeys.forEach(
        ({ key, ctrl, shift, meta, alt, mobile, message, action }) => {
          const isMobile = /iPhone|iPad|iPod|Android/i.test(
            navigator.userAgent
          );
          const isPressed =
            (e.key === key || e.key.toLowerCase() === key) &&
            (!ctrl || e.ctrlKey) &&
            (!shift || e.shiftKey) &&
            (!meta || e.metaKey) &&
            (!alt || e.altKey) &&
            (!mobile || isMobile);

          if (isPressed) {
            e.preventDefault();
            if (message) {
              this.showAlertMessage(message);
            }
            if (action) {
              action();
            }
          }
        }
      );
    },

    detectDevTools() {
      let wasOpened = false;
      const threshold = 160;
      const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
      const isMac = /Mac/i.test(navigator.platform);

      const emitCheck = () => {
        // For desktop browsers
        const widthThreshold =
          window.outerWidth - window.innerWidth > threshold;
        const heightThreshold =
          window.outerHeight - window.innerHeight > threshold;

        // For mobile browsers
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
  beforeDestroy() {
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
@keyframes gradient {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}

.animate-gradient {
  background-size: 200% 200%;
  animation: gradient 4s ease infinite;
}

@keyframes pink-glow {
  0% {
    color: #fff;
    text-shadow: 0 0 5px #ff69b4, 0 0 10px #ff69b4, 0 0 15px #ff69b4,
      0 0 20px #ff1493, 0 0 35px #ff1493, 0 0 40px #ff1493, 0 0 50px #ff1493;
  }

  50% {
    color: #ffe6f2;
    text-shadow: 0 0 7px #ff69b4, 0 0 12px #ff69b4, 0 0 17px #ff69b4,
      0 0 22px #ff1493, 0 0 37px #ff1493, 0 0 42px #ff1493, 0 0 52px #ff1493;
  }

  100% {
    color: #fff;
    text-shadow: 0 0 5px #ff69b4, 0 0 10px #ff69b4, 0 0 15px #ff69b4,
      0 0 20px #ff1493, 0 0 35px #ff1493, 0 0 40px #ff1493, 0 0 50px #ff1493;
  }
}

.glowing-text {
  font-weight: bold;
  color: #fff;
  animation: pink-glow 2s ease-in-out infinite;
  letter-spacing: 2px;
}

.counter-container {
  padding: 0.5rem;
  border-radius: 0.5rem;
  backdrop-filter: blur(5px);
}
</style>
