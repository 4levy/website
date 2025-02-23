import { Skill, SkillStatus } from "@/types/lanyard";
import { motion } from "framer-motion";

const techStack = [
  {
    category: "Frameworks",
    items: ["Next.js", "React", "Vue.js", "Express", "Discord.js"],
  },
  {
    category: "Tools",
    items: ["Git", "VS Code", "VS Studio"],
  },
  {
    category: "Databases",
    items: ["MongoDB", "MySQL"],
  },
];

export default function SkillsSection({ skills }: { skills: Skill[] }) {
  return (
    <div className="mt-6 space-y-6">
      <div className="grid grid-cols-2 gap-4">
        {skills.map((skill, i) => (
          <motion.div
            key={skill.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="glass-card p-4 rounded-lg"
          >
            <div className="flex items-center gap-3 mb-2">
              <span className="text-xl">{skill.icon}</span>
              <span className="text-sm font-medium text-ice-blue/70">
                {skill.name}
              </span>
              <span
                className={`text-xs px-2 py-0.5 rounded-full ml-auto
                ${
                  skill.status === "mastered"
                    ? "bg-green-500/20 text-green-400"
                    : skill.status === "experienced"
                    ? "bg-blue-500/20 text-blue-400"
                    : skill.status === "learning"
                    ? "bg-yellow-500/20 text-yellow-400"
                    : "bg-gray-500/20 text-gray-400"
                }`}
              >
                {skill.status}
              </span>
            </div>
            <div className="h-1 bg-sky-500/20 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${skill.level}%` }}
                transition={{ duration: 1, delay: i * 0.1 }}
                className="h-full bg-gradient-to-r from-sky-400 to-blue-600"
              />
            </div>
          </motion.div>
        ))}
      </div>

      {/* Tech Stack */}
      <div className="mt-8">
        <h3 className="text-xl font-bold text-ice-blue mb-4">Tech Stack</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {techStack.map((category, i) => (
            <motion.div
              key={category.category}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="glass-card p-4 rounded-lg"
            >
              <h4 className="text-sm font-medium text-sky-300 mb-3">
                {category.category}
              </h4>
              <div className="flex flex-wrap gap-2">
                {category.items.map((item, j) => (
                  <motion.span
                    key={item}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.1 + j * 0.05 }}
                    className="px-2 py-1 text-xs rounded-full bg-sky-500/10 
                      text-sky-300 border border-sky-500/20"
                  >
                    {item}
                  </motion.span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
