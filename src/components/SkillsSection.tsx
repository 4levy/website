import { Skill, SkillStatus } from "@/types/lanyard";

export default function SkillsSection({ skills }: { skills: Skill[] }) {
  return (
    <div className="mt-6">
      <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
        <h4 className="text-lg font-bold text-white">Skills</h4>
        <div className="flex flex-wrap gap-2 text-xs">
          {(["mastered", "experienced", "learning"] as const).map((status) => (
            <div
              key={status}
              className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-slate-800/30"
            >
              <span
                className={`
                w-2 h-2 rounded-full
                ${
                  status === "mastered"
                    ? "bg-green-400"
                    : status === "experienced"
                    ? "bg-blue-400"
                    : "bg-yellow-400"
                }
              `}
              />
              <span className="hidden sm:inline capitalize text-slate-300">
                {status}
              </span>
              <span className="sm:hidden text-slate-300">
                {status === "mastered"
                  ? "M"
                  : status === "experienced"
                  ? "E"
                  : "L"}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {skills.map((skill) => (
          <div
            key={skill.name}
            className="bg-slate-800/30 p-3 rounded-lg flex items-center gap-2 hover:bg-slate-800/40 transition-colors"
          >
            <span className="text-lg" role="img" aria-label={skill.name}>
              {skill.icon}
            </span>
            <div className="min-w-0 flex-1">
              <p className="font-medium text-sm truncate text-slate-200">
                {skill.name}
              </p>
              <div className="relative w-full h-1 bg-slate-700/50 rounded-full overflow-hidden">
                <div
                  className="absolute top-0 left-0 h-full rounded-full transition-all duration-300"
                  style={{
                    width: `${skill.level}%`,
                    backgroundColor: skill.color,
                    opacity: 0.8,
                  }}
                />
              </div>
            </div>
            <span
              className={`
              w-2 h-2 rounded-full shrink-0 opacity-80
              ${
                skill.status === "mastered"
                  ? "bg-green-400"
                  : skill.status === "experienced"
                  ? "bg-blue-400"
                  : "bg-yellow-400"
              }
            `}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
