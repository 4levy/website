export default function Footer() {
  return (
    <footer className="w-full py-6 px-8 mt-20">
      <div className="flex flex-col items-center justify-center gap-4">
        <div className="flex items-center gap-2 text-sm text-ice-blue/70">
          <span>Visitor Count:</span>
          <img
            src="https://count.getloli.com/@4levy?name=4levy&theme=booru-qualityhentais"
            alt="Visitor Counter"
            className="h-200" 
            style={{ minWidth: "120px" }}
            loading="lazy"
          />
        </div>
        <p className="text-xs text-ice-blue/50">
          © {new Date().getFullYear()} 4levy.xyz • All rights reserved
        </p>
      </div>
    </footer>
  );
}