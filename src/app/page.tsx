import Image from "next/image";
import { getGithubProjects } from "@/utils/github";
import type { GitHubRepo } from "@/types/github";
import { Suspense } from "react";
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
import PreciseAge from "@/components/PreciseAge";
import Portfolio from "@/components/Portfolio";
import Calendar from "@/components/Calendar";
import ProjectCard from "@/components/ProjectCard";

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
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 card-3d-container">
      {projects.map((project: GitHubRepo) => (
        <ProjectCard key={project.id} project={project} />
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
            <Calendar />
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
      <Navbar />

      <section className="h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="hero-title gradient-text mb-6">4levy.xyz</h1>
          <p className="text-lg md:text-xl text-ice-blue/70 max-w-2xl mx-auto text-glow">
            I will add something here later..
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

      <section id="portfolio" className="py-20">
        <Portfolio />
      </section>

      <Footer />
    </main>
  );
}
