import sliceLogoImg from "figma:asset/Slice_logo.png";

export function SliceLogo({ className = "h-10 w-10" }: { className?: string }) {
  return (
    <img 
      src={sliceLogoImg} 
      alt="Slice Logo" 
      className={className}
    />
  );
}