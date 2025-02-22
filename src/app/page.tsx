import Image from "next/image";
import { getGithubProjects } from "@/utils/github";
import type { GitHubRepo } from "@/types/github";
import { Suspense } from "react";
import BackgroundVideo from "@/components/BackgroundVideo";
import Navbar from "@/components/Navbar";
import { DEVELOPERS } from "@/constants/config";
import DeveloperCard from "@/components/Developer";
import DiscordProfile from "@/components/DiscordProfile";
import ContactSection from "@/components/ContactSection";
import PlaylistCard from "@/components/PlaylistCard";
import ThemeToggle from "@/components/ThemeToggle";
import LocalConditions from "@/components/LocalConditions";
import RandomImage from "@/components/RandomImage";
import Footer from "@/components/Footer";

function ProjectsSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="glass-card p-6 rounded-lg animate-pulse">
          <div className="h-8 bg-[#1E90FF]/20 rounded w-3/4 mb-4"></div>
          <div className="h-4 bg-[#1E90FF]/20 rounded w-full mb-4"></div>
          <div className="h-4 bg-[#1E90FF]/20 rounded w-1/2"></div>
        </div>
      ))}
    </div>
  );
}

async function Projects() {
  const projects = await getGithubProjects();

  if (projects.length === 0) {
    return (
      <div className="glass-card col-span-2 text-center p-8 rounded-lg">
        <p className="text-ice-blue/70">No featured projects available.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      {projects.map((project: GitHubRepo) => (
        <a
          href={project.html_url}
          target="_blank"
          rel="noopener noreferrer"
          key={project.id}
          className="glass-card glow-effect p-6 rounded-lg group transform transition-all duration-300 hover:scale-105"
        >
          <h3 className="text-2xl font-bold mb-4 gradient-text">
            {project.name}
          </h3>
          <p className="text-ice-blue/70 mb-4">
            {project.description || "No description available"}
          </p>
          <div className="flex gap-4 text-sm">
            {project.language && (
              <span className="px-3 py-1 rounded-full glass-card text-glow">
                {project.language}
              </span>
            )}
            <span className="px-3 py-1 rounded-full glass-card text-glow flex items-center gap-1">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 16 16">
                <path d="M8 .25a.75.75 0 0 1 .673.418l1.882 3.815 4.21.612a.75.75 0 0 1 .416 1.279l-3.046 2.97.719 4.192a.751.75 0 0 1-1.088.791L8 12.347l-3.766 1.98a.75.75 0 0 1-1.088-.79l.72-4.194L.818 6.374a.75.75 0 0 1 .416-1.28l4.21-.611L7.327.668A.75.75 0 0 1 8 .25Z" />
              </svg>
              {project.stargazers_count}
            </span>
            <span className="px-3 py-1 rounded-full glass-card text-glow flex items-center gap-1">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 16 16">
                <path d="M5 5.372v.878c0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75v-.878a2.25 2.25 0 1 1 1.5 0v.878a2.25 2.25 0 0 1-2.25 2.25h-1.5v2.128a2.251 2.251 0 1 1-1.5 0V8.5h-1.5A2.25 2.25 0 0 1 3.5 6.25v-.878a2.25 2.25 0 1 1 1.5 0ZM5 3.25a.75.75 0 1 0-1.5 0 .75.75 0 0 0 1.5 0Zm6.75.75a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm-3 8.75a.75.75 0 1 0-1.5 0 .75.75 0 0 0 1.5 0Z" />
              </svg>
              {project.forks_count}
            </span>
          </div>
        </a>
      ))}
    </div>
  );
}

function DeveloperSection() {
  return (
    <section id="about" className="py-20">
      <div className="flex items-center gap-3 mb-12">
        <h2 className="text-4xl font-bold text-white">About Me</h2>
        <div className="h-px flex-1 bg-gradient-to-r from-sky-400/20 to-transparent" />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        <div className="lg:col-span-3">
          <div className="grid grid-cols-1 gap-8">
            {DEVELOPERS.map((developer) => (
              <DeveloperCard key={developer.discordId} developer={developer} />
            ))}
            <LocalConditions />
            <RandomImage />
            <ContactSection />
          </div>
        </div>
        <div className="lg:col-span-2">
          <PlaylistCard />
        </div>
      </div>
    </section>
  );
}

export default function Home() {
  return (
    <main className="min-h-screen p-8 md:p-24 relative">
      <BackgroundVideo />
      <Navbar />

      <section className="h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="hero-title gradient-text mb-6">4levy.xyz</h1>
          <p className="text-lg md:text-xl text-ice-blue/70 max-w-2xl mx-auto text-glow">
            ehhh i will put something here later..
          </p>
        </div>
      </section>

      <div className="luxury-border my-20 opacity-30" />

      <section id="work" className="py-20">
        <div className="flex items-center gap-3 mb-12">
          <h2 className="text-4xl font-bold text-white">Github Projects</h2>
          <div className="h-px flex-1 bg-gradient-to-r from-sky-400/20 to-transparent" />
        </div>
        <Suspense fallback={<ProjectsSkeleton />}>
          <Projects />
        </Suspense>
      </section>

      <Suspense fallback={<div>Loading about...</div>}>
        <DeveloperSection />
      </Suspense>

      <Footer />
    </main>
  );
}
