import Image from "next/image";

export function DashboardShowcase() {
  return (
    <section className="w-full flex flex-col items-center justify-center py-20 bg-gradient-to-br from-white/80 to-blue-100/60 relative overflow-hidden">
      <h2 className="text-3xl md:text-4xl font-bold mb-4 text-slate-900 text-center drop-shadow-sm">
        Your Finance Dashboard, Reimagined
      </h2>
      <p className="text-lg md:text-xl text-slate-600 mb-10 text-center max-w-2xl">
        Experience a modern, intuitive, and powerful dashboard to manage your company&apos;s finances. Visualize, analyze, and act—all in one place.
      </p>
      <div className="relative group" style={{ perspective: 1200 }}>
        <div
          className="transition-transform duration-500 ease-out group-hover:rotate-x-6 group-hover:-rotate-y-6 group-hover:scale-105"
          style={{
            transformStyle: "preserve-3d",
            willChange: "transform",
            boxShadow:
              "0 8px 40px 0 rgba(30, 64, 175, 0.15), 0 1.5px 8px 0 rgba(0,0,0,0.08)",
            borderRadius: "1.5rem",
          }}
        >
          {/* MacBook Body */}
          <div className="relative w-[480px] h-[300px] md:w-[700px] md:h-[440px] bg-slate-200 rounded-3xl shadow-2xl border-[6px] border-slate-300 overflow-hidden">
            {/* Screen */}
            <div className="absolute top-0 left-0 w-full h-[90%] bg-black rounded-t-2xl overflow-hidden z-10">
              <Image
                src="/dashboard.png"
                alt="Finance Dashboard Preview"
                fill
                className="object-cover object-top"
                priority
                draggable={false}
              />
            </div>
            {/* Bezel */}
            <div className="absolute bottom-0 left-0 w-full h-[10%] bg-gradient-to-t from-slate-300 to-slate-100 rounded-b-2xl z-20 flex items-center justify-center">
              <div className="w-16 h-2 bg-slate-400/60 rounded-full" />
            </div>
          </div>
          {/* MacBook Base (shadow) */}
          <div className="absolute left-1/2 -translate-x-1/2 top-full w-[80%] h-8 bg-gradient-to-r from-slate-400/30 to-slate-200/10 rounded-b-full blur-md opacity-70 -z-10" />
        </div>
      </div>
    </section>
  );
} 