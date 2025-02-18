<template>
    <div class="p-8, levy">
      <main class="max-w-2xl mx-auto space-y-4">
  
        <p>{{ tagline }}</p>
  
        <p>{{ siteNote }}</p>
  
        <p>
          You can find me at
          <template v-for="(social, index) in socials" :key="social.platform">
            <a 
              :href="social.url" 
              target="_blank"
              class="underline"
            >
              {{ social.handle }}
            </a>
            on {{ social.platform }}{{ index < socials.length - 1 ? ', ' : '' }}
          </template>.
        </p>
  
        <p>
          <span>{{ status }}</span>
        </p>
    </main>
  </div>
</template>

<script>
export default {
  name: "Userinfo",
  data() {
    return {
      name: "4levy",
      pronouns: "",
      tagline: "A 16 year-old discord bot developer",
      siteNote: "This site is not worth a visit.",
      status: "Loading status...",
      DISCORD_ID: "874898422233178142",
      ws: null,
      socials: [
        { platform: "GitHub", handle: "@4levy", url: "https://github.com/4levy" },
        { platform: "Discord", handle: "@4levy", url: "https://discord.com/users/874898422233178142" },
      ]
    };
  },
  mounted() {
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
              subscribe_to_id: this.DISCORD_ID
            }
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
            this.updateStatus(received.d);
          }
        }
      };

      this.ws.onclose = () => {
        setTimeout(this.connectWebsocket, 1000);
      };
    },

    updateStatus(data) {
      const statusMap = {
        online: "I'm currently online",
        idle: "I'm currently idle",
        dnd: "I'm currently busy",
        offline: "I'm currently offline"
      };

      this.status = statusMap[data.discord_status] || "Status unknown";
      
      if (data.discord_status === "dnd" && data.activities?.length > 0) {
        this.statusNote = "do not disturb - " + data.activities[0].state;
      } else if (data.activities?.length > 0) {
        this.statusNote = data.activities[0].state || "";
      } else {
        this.statusNote = data.discord_status;
      }
    }
  },
  beforeUnmount() {
    if (this.ws) {
      this.ws.close();
    }
  }
};
</script>

<style>
.levy {
  text-align: center;
  border-radius: 8px;
  color: rgb(255, 188, 252);
}
</style>