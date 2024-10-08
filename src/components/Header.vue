<script setup>
import { ref, onMounted, onUnmounted, computed } from "vue";
import axios from "axios";
import {
  LucideStar,
  LucideGitFork,
  LucideEye,
  LucideCode,
} from "lucide-vue-next";

const discordStatusColor = ref("text-catppuccin-gray");
const spotify = ref(null);
const discordStatus = ref("offline");
const vscodeActivity = ref(null);
const ws = ref(null);
const languageColors = ref({});
const showProjects = ref(false);
const used = ref(false);
const darkMode = ref(false);

// Projects data
const projects = [
  "Streaming-status",
  "Custom-status",
  "Online-VC",
  "Executor-Key-Bypass-Discord-Bot",
];
const repos = ref([]);
const loading = ref(true);
const error = ref(null);

const sortedRepos = computed(() => {
  return repos.value.sort((a, b) => b.stargazers_count - a.stargazers_count);
});

const toggleDarkMode = () => {
  darkMode.value = !darkMode.value;
  document.body.classList.toggle("dark-mode", darkMode.value);
};

const toggleShowProjects = () => {
  showProjects.value = !showProjects.value;
};

const toggleUsed = () => {
  used.value = !used.value;
};

const fetchLanguageColors = async () => {
  try {
    const response = await axios.get(
      "https://raw.githubusercontent.com/ozh/github-colors/master/colors.json"
    );
    languageColors.value = response.data;
  } catch (error) {
    console.error("Error fetching language colors:", error);
  }
};

const getLanguageFromFile = (filename) => {
  if (!filename) return "default";
  const ext = filename.split(".").pop().toLowerCase();
  const extensionMap = {
    // Programming Languages
    js: "JavaScript",
    ts: "TypeScript",
    py: "Python",
    java: "Java",
    html: "HTML",
    css: "CSS",
    php: "PHP",
    c: "C",
    cpp: "C++",
    cs: "C#",
    go: "Go",
    rb: "Ruby",
    rs: "Rust",
    swift: "Swift",
    kt: "Kotlin",
    scala: "Scala",
    groovy: "Groovy",
    pl: "Perl",
    lua: "Lua",
    r: "R",
    dart: "Dart",
    f: "Fortran",
    f90: "Fortran",
    hs: "Haskell",
    jl: "Julia",
    lisp: "Lisp",
    ml: "OCaml",
    pas: "Pascal",
    sql: "SQL",
    sh: "Shell",
    vb: "Visual Basic",
    asm: "Assembly",
    clj: "Clojure",
    erl: "Erlang",
    ex: "Elixir",
    fs: "F#",
    m: "Objective-C",
    php: "PHP",
    rkt: "Racket",
    scm: "Scheme",
    tex: "TeX",
    vim: "Vim script",
    zig: "Zig",

    // Web Technologies and Frameworks
    jsx: "React",
    tsx: "React",
    vue: "Vue",
    svelte: "Svelte",
    angular: "Angular",
    ember: "Ember",
    backbone: "Backbone.js",
    preact: "Preact",
    mjs: "Node.js",
    graphql: "GraphQL",
    prisma: "Prisma",
    astro: "Astro",

    // Markup and Style
    md: "Markdown",
    scss: "SCSS",
    sass: "Sass",
    less: "Less",
    styl: "Stylus",
    pug: "Pug",
    haml: "Haml",
    slim: "Slim",
    xml: "XML",
    yaml: "YAML",
    toml: "TOML",

    // Data Formats
    json: "JSON",
    csv: "CSV",

    // Configuration
    dockerfile: "Dockerfile",
    ini: "INI",
    editorconfig: "EditorConfig",
    gitignore: "Git",
    env: "DotENV",

    // Build Tools
    gradle: "Gradle",
    maven: "Maven",
    ant: "Ant",

    // Others
    ipynb: "Jupyter Notebook",
    proto: "Protocol Buffers",
    sol: "Solidity",
  };
  return extensionMap[ext] || "default";
};

const currentLanguageColor = computed(() => {
  if (vscodeActivity.value) {
    const language = getLanguageFromFile(
      vscodeActivity.value.details.split(" ").pop()
    );
    return `color: ${languageColors.value[language]?.color || "#4F5D95"}`;
  }
  return "";
});

const vscodeStatus = computed(() => {
  if (!vscodeActivity.value) return null;

  const details = vscodeActivity.value.details || "";

  if (details.toLowerCase().includes("idling")) {
    return "idling";
  }

  return {
    details: vscodeActivity.value.details || "Unknown file",
    state: vscodeActivity.value.state || "Unknown state",
  };
});

const connectWebSocket = () => {
  ws.value = new WebSocket("wss://api.lanyard.rest/socket");

  ws.value.onopen = () => {
    ws.value.send(
      JSON.stringify({
        op: 2,
        d: { subscribe_to_id: "874898422233178142" },
      })
    );
  };

  ws.value.onmessage = (event) => {
    const message = JSON.parse(event.data);
    if (message.t === "INIT_STATE" || message.t === "PRESENCE_UPDATE") {
      const data = message.d;

      console.log("Activities: ", data.activities);

      spotify.value =
        data.activities.find((activity) => activity.name === "Spotify") || null;

      vscodeActivity.value =
        data.activities.find(
          (activity) => activity.name === "Visual Studio Code"
        ) || null;

      switch (data.discord_status) {
        case "online":
          discordStatusColor.value = "text-catppuccin-green";
          discordStatus.value = "online";
          break;
        case "idle":
          discordStatusColor.value = "text-catppuccin-yellow";
          discordStatus.value = "idle";
          break;
        case "dnd":
          discordStatusColor.value = "text-catppuccin-red";
          discordStatus.value = "do not disturb";
          break;
        default:
          discordStatusColor.value = "text-catppuccin-gray";
          discordStatus.value = "offline";
          break;
      }
    }
  };

  ws.value.onerror = (error) => {
    console.error("WebSocket error", error);
  };

  ws.value.onclose = () => {
    console.log("WebSocket connection closed");
  };
};

const getLanguageColor = (language) => {
  const colors = {
    JavaScript: "bg-yellow-300",
    Python: "bg-blue-500",
    Java: "bg-red-500",
    "C#": "bg-green-500",
    Ruby: "bg-red-600",
    PHP: "bg-purple-500",
    TypeScript: "bg-blue-600",
    default: "bg-gray-500",
  };
  return colors[language] || colors.default;
};

onMounted(async () => {
  connectWebSocket();
  fetchLanguageColors();

  try {
    const response = await fetch("https://api.github.com/users/4levy/repos");
    if (!response.ok) throw new Error("Failed to fetch repositories");
    const data = await response.json();
    repos.value = data.filter((repo) => projects.includes(repo.name));
  } catch (err) {
    error.value = err.message;
  } finally {
    loading.value = false;
  }
});

onUnmounted(() => {
  if (ws.value) {
    ws.value.close();
  }
});
</script>

<template>
  <div :class="{ 'dark-mode': darkMode }" class="min-h-screen flex flex-col">
    <header class="bg-catppuccin-mantle p-4 footer-blur">
      <div class="container mx-auto flex justify-between items-center">
        <h1 class="text-3xl font-black text-catppuccin-text">4levy.xyz</h1>
        <button
          @click="toggleDarkMode"
          class="text-catppuccin-text hover:text-catppuccin-blue transition-colors"
        >
          <LucideCode v-if="darkMode" />
          <LucideStar v-else />
        </button>
      </div>
    </header>

    <main class="flex-grow container mx-auto px-4 py-8">
      <div class="text-center">
        <div
          class="text-6xl font-black text-catppuccin-text mb-6 animate-fade-in"
        >
          4levy (aka VIVI)
        </div>

        <div class="text-xl text-catppuccin-subtle mb-8 animate-slide-up">
          A 16-year-old Discord bot developer
        </div>

        <div
          class="flex flex-col md:flex-row justify-center items-center gap-4 mb-8"
        >
          <div
            class="flex items-center gap-2 text-base text-catppuccin-green animate-fade-in"
            style="animation-delay: 0.2s"
          >
            <LucideCode class="h-6 w-6" />
            <div v-if="spotify">
              Listening to
              <a
                :href="`https://open.spotify.com/track/${spotify.track_id}`"
                target="_blank"
                class="underline hover:text-catppuccin-blue transition-colors"
              >
                {{ spotify.song }} - {{ spotify.artist }}
              </a>
            </div>
            <div v-else>Not listening to anything right now</div>
          </div>

          <div
            class="flex items-center gap-2 text-base animate-fade-in"
            :class="discordStatusColor"
            style="animation-delay: 0.4s"
          >
            <LucideCode class="h-6 w-6" />
            <div>{{ discordStatus }} on Discord</div>
          </div>

          <div
            v-if="vscodeActivity"
            class="flex items-center gap-2 text-base animate-fade-in"
            :style="currentLanguageColor"
            style="animation-delay: 0.6s"
          >
            <LucideCode class="h-6 w-6" />
            <div v-if="typeof vscodeStatus === 'string'">
              {{ vscodeStatus }} in VSCode
            </div>
            <div v-else-if="vscodeStatus">
              Editing <strong>{{ vscodeStatus.details }}</strong> in workspace:
              <strong>{{ vscodeStatus.state }}</strong>
            </div>
          </div>
        </div>

        <div class="mb-6">
          <button
            @click="toggleShowProjects"
            class="animated-button bg-catppuccin-blue text-white px-4 py-2 rounded transition-all duration-300 ease-in-out hover:bg-catppuccin-lavender hover:scale-105 hover:glow"
          >
            {{ showProjects ? "Hide" : "Show" }} Projects
          </button>

          <button
            @click="toggleUsed"
            class="animated-button bg-catppuccin-blue text-white px-4 py-2 rounded transition-all duration-300 ease-in-out hover:bg-catppuccin-lavender hover:scale-105 hover:glow"
          >
            {{ used ? "Hide" : "Show" }} Used Tools
          </button>
        </div>

        <transition name="fade">
          <div v-if="used" class="mb-8">
            <div class="mb-6 font-bold text-3xl text-catppuccin-gray">
              Uses/
            </div>
            <img
              src="https://skillicons.dev/icons?i=git,vscode,discord,github,idea"
              class="select-none mb-2"
            />
            <img
              src="https://skillicons.dev/icons?i=python,html,css,javascript,discordjs"
              class="select-none"
            />
          </div>
        </transition>

        <transition name="fade">
          <div v-if="showProjects" class="mb-8">
            <div class="mb-6 font-bold text-3xl text-catppuccin-gray">
              Project/
            </div>

            <div v-if="loading" class="text-center py-12">
              <div
                class="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-catppuccin-blue mx-auto"
              ></div>
              <p class="mt-4 text-catppuccin-subtext0 font-inter">
                Loading projects...
              </p>
            </div>

            <div v-else-if="error" class="text-center py-12">
              <LucideCode class="h-16 w-16 text-catppuccin-red mx-auto" />
              <p class="mt-4 text-catppuccin-red font-inter">{{ error }}</p>
            </div>

            <div
              v-else
              class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              <a
                v-for="repo in sortedRepos"
                :key="repo.id"
                :href="repo.html_url"
                target="_blank"
                class="bg-catppuccin-base border border-catppuccin-surface0 rounded-lg overflow-hidden shadow-lg transition-all duration-300 hover:shadow-2xl hover:scale-105 transform"
              >
                <div class="p-6">
                  <div class="flex items-center justify-between mb-4">
                    <div class="flex items-center space-x-2">
                      <img
                        :src="repo.owner.avatar_url"
                        :alt="repo.owner.login"
                        class="w-8 h-8 rounded-full"
                      />
                      <span
                        class="text-sm font-medium text-catppuccin-subtext0 font-inter"
                        >{{ repo.owner.login }}</span
                      >
                    </div>
                    <span
                      v-if="repo.archived"
                      class="px-2 py-1 text-xs font-semibold text-catppuccin-red bg-catppuccin-crust rounded-full"
                      >Archived</span
                    >
                  </div>

                  <h3
                    class="text-xl font-bold text-catppuccin-text mb-2 font-inter"
                    :class="{ 'line-through': repo.archived }"
                  >
                    {{ repo.name }}
                  </h3>
                  <p class="text-catppuccin-subtext1 text-sm mb-4 font-inter">
                    {{ repo.description || "No description available." }}
                  </p>

                  <div
                    class="flex items-center space-x-4 text-catppuccin-subtext0"
                  >
                    <div class="flex items-center space-x-1">
                      <LucideStar class="h-4 w-4 text-catppuccin-yellow" />
                      <span>{{ repo.stargazers_count }}</span>
                    </div>
                    <div class="flex items-center space-x-1">
                      <LucideGitFork class="h-4 w-4 text-catppuccin-blue" />
                      <span>{{ repo.forks_count }}</span>
                    </div>
                    <div class="flex items-center space-x-1">
                      <LucideEye class="h-4 w-4 text-catppuccin-subtext1" />
                      <span>{{ repo.watchers_count }}</span>
                    </div>
                  </div>
                </div>

                <div
                  class="px-6 py-4 bg-catppuccin-mantle border-t border-catppuccin-surface0"
                >
                  <div class="flex items-center justify-between">
                    <div class="flex items-center space-x-2">
                      <span
                        :class="[
                          getLanguageColor(repo.language),
                          'w-3 h-3 rounded-full',
                        ]"
                      ></span>
                      <span
                        class="text-sm font-medium text-catppuccin-subtext1 font-inter"
                        >{{ repo.language || "Unknown" }}</span
                      >
                    </div>
                    <span class="text-xs text-catppuccin-subtext0 font-inter"
                      >Updated:
                      {{ new Date(repo.updated_at).toLocaleDateString() }}</span
                    >
                  </div>
                </div>
              </a>
            </div>
          </div>
        </transition>

        <div class="flex justify-center gap-8 text-2xl animate-bounce">
          <a
            href="https://github.com/4levy/"
            target="_blank"
            class="flex items-center justify-center transition-transform transform hover:scale-110"
          >
            <LucideCode class="w-6 h-6 text-catppuccin-text" />
          </a>
          <a
            href="https://www.instagram.com/4levyz"
            target="_blank"
            class="flex items-center justify-center transition-transform transform hover:scale-110"
          >
            <LucideCode class="w-6 h-6 text-catppuccin-pink" />
          </a>
          <a
            href="https://discord.com/users/874898422233178142"
            target="_blank"
            class="flex items-center justify-center transition-transform transform hover:scale-110"
          >
            <LucideCode class="w-6 h-6 text-catppuccin-blue" />
          </a>
        </div>
      </div>
    </main>

    <footer
      class="bg-catppuccin-mantle text-catppuccin-text text-center p-4 footer-blur"
    >
      <p>&copy; 2024 4levy. All rights reserved.</p>
    </footer>
  </div>
</template>

<style>
@import url("https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700&display=swap");

.footer-blur {
  background-color: rgba(24, 24, 37, 0.6);
  backdrop-filter: blur(10px); 
  -webkit-backdrop-filter: blur(10px);
  padding: 1rem;
  text-align: center;
  color: var(--catppuccin-text);
  border-radius: 8px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2); 
}

:root {
  --catppuccin-base: #1e1e2e;
  --catppuccin-mantle: #181825;
  --catppuccin-crust: #11111b;
  --catppuccin-surface0: #313244;
  --catppuccin-surface1: #45475a;
  --catppuccin-text: #cdd6f4;
  --catppuccin-subtext0: #a6adc8;
  --catppuccin-subtext1: #bac2de;
  --catppuccin-red: #f38ba8;
  --catppuccin-blue: #89b4fa;
  --catppuccin-gray: #b4befe;
  --catppuccin-yellow: #f9e2af;
  --catppuccin-green: #a6e3a1;
  --catppuccin-pink: #f5c2e7;
  --catppuccin-lavender: #b4befe;
}

body {
  font-family: "Inter", sans-serif;
  background-color: var(--catppuccin-base);
  color: var(--catppuccin-text);
}

.dark-mode {
  --catppuccin-base: #eff1f5;
  --catppuccin-mantle: #e6e9ef;
  --catppuccin-crust: #dce0e8;
  --catppuccin-surface0: #ccd0da;
  --catppuccin-surface1: #bcc0cc;
  --catppuccin-text: #4c4f69;
  --catppuccin-subtext0: #6c6f85;
  --catppuccin-subtext1: #5c5f77;
  --catppuccin-red: #d20f39;
  --catppuccin-blue: #1e66f5;
  --catppuccin-gray: #9ca0b0;
  --catppuccin-yellow: #df8e1d;
  --catppuccin-green: #40a02b;
  --catppuccin-pink: #ea76cb;
  --catppuccin-lavender: #7287fd;
}

.bg-catppuccin-base {
  background-color: var(--catppuccin-base);
}
.bg-catppuccin-mantle {
  background-color: var(--catppuccin-mantle);
}
.bg-catppuccin-crust {
  background-color: var(--catppuccin-crust);
}
.bg-catppuccin-surface0 {
  background-color: var(--catppuccin-surface0);
}
.bg-catppuccin-surface1 {
  background-color: var(--catppuccin-surface1);
}

.text-catppuccin-text {
  color: var(--catppuccin-text);
}
.text-catppuccin-subtext0 {
  color: var(--catppuccin-subtext0);
}
.text-catppuccin-subtext1 {
  color: var(--catppuccin-subtext1);
}
.text-catppuccin-red {
  color: var(--catppuccin-red);
}
.text-catppuccin-blue {
  color: var(--catppuccin-blue);
}
.text-catppuccin-gray {
  color: var(--catppuccin-gray);
}
.text-catppuccin-yellow {
  color: var(--catppuccin-yellow);
}
.text-catppuccin-green {
  color: var(--catppuccin-green);
}
.text-catppuccin-pink {
  color: var(--catppuccin-pink);
}

.border-catppuccin-surface0 {
  border-color: var(--catppuccin-surface0);
}

.font-inter {
  font-family: "Inter", sans-serif;
}

.animate-fade-in {
  animation: fadeIn 0.5s ease-out;
}
.animate-slide-up {
  animation: slideUp 0.5s ease-out;
}
.animate-bounce {
  animation: bounce 2s infinite;
}
.animate-spin {
  animation: spin 1s linear infinite;
}

.animated-button {
  position: relative;
  overflow: hidden;
}

.animated-button::before {
  content: '';
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: radial-gradient(circle, rgba(255,255,255,0.3) 0%, rgba(255,255,255,0) 70%);
  transform: scale(0);
  transition: transform 0.3s ease-out;
}

.animated-button:hover::before {
  transform: scale(1);
}

.glow {
  box-shadow: 0 0 15px 5px rgba(173, 216, 230, 0.7); /* Light blue glow */
}

@keyframes pulse-glow {
  0% {
    box-shadow: 0 0 15px 5px rgba(173, 216, 230, 0.7);
  }
  50% {
    box-shadow: 0 0 20px 10px rgba(173, 216, 230, 0.9);
  }
  100% {
    box-shadow: 0 0 15px 5px rgba(173, 216, 230, 0.7);
  }
}

.animated-button:hover {
  animation: pulse-glow 1.5s infinite;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes slideUp {
  from {
    transform: translateY(20px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

@keyframes bounce {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.transition-colors {
  transition: color 0.3s ease;
}
.transition-all {
  transition: all 0.3s ease;
}

.hover\:bg-catppuccin-lavender:hover {
  background-color: var(--catppuccin-lavender);
}
.hover\:text-catppuccin-blue:hover {
  color: var(--catppuccin-blue);
}
.hover\:scale-105:hover {
  transform: scale(1.05);
}
.hover\:scale-110:hover {
  transform: scale(1.1);
}
.hover\:shadow-2xl:hover {
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
