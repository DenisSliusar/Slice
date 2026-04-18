export function MeshBackground() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      {/* Apple-like dark mesh gradient with smooth transitions */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/30 dark:from-gray-900 dark:via-slate-900 dark:to-black transition-colors duration-500">
        {/* Animated orbs */}
        <div className="absolute top-0 -left-4 w-96 h-96 bg-purple-400/20 dark:bg-purple-900/50 rounded-full mix-blend-screen filter blur-3xl opacity-40 animate-blob transition-colors duration-500"></div>
        <div className="absolute top-0 -right-4 w-96 h-96 bg-indigo-400/20 dark:bg-indigo-900/50 rounded-full mix-blend-screen filter blur-3xl opacity-40 animate-blob animation-delay-2000 transition-colors duration-500"></div>
        <div className="absolute -bottom-8 left-20 w-96 h-96 bg-violet-400/20 dark:bg-violet-900/50 rounded-full mix-blend-screen filter blur-3xl opacity-40 animate-blob animation-delay-4000 transition-colors duration-500"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-blue-400/20 dark:bg-blue-900/50 rounded-full mix-blend-screen filter blur-3xl opacity-40 animate-blob animation-delay-6000 transition-colors duration-500"></div>
      </div>
      
      {/* Noise texture overlay */}
      <div className="absolute inset-0 opacity-[0.02] dark:opacity-[0.02]" 
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' /%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' /%3E%3C/svg%3E")`
        }}
      />
    </div>
  );
}