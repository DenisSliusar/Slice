export function LomoLogo({ className = "h-10 w-10" }: { className?: string }) {
  return (
    <svg 
      viewBox="0 0 100 100" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <circle cx="50" cy="50" r="45" fill="black"/>
      <circle cx="50" cy="50" r="35" fill="white"/>
      <path d="M30 35 L30 65 L45 65" stroke="black" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round"/>
      <circle cx="50" cy="50" r="12" fill="black"/>
      <path d="M62 35 L62 55 L70 65 L62 65" stroke="black" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M62 50 L70 40 L62 40" stroke="black" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}
