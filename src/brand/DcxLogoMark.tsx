interface DcxLogoMarkProps {
  size?: number;
  className?: string;
}

export function DcxLogoMark({ size = 28, className = '' }: DcxLogoMarkProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <rect x="10" y="10" width="80" height="80" rx="22" fill="black" />
      <rect x="38" y="38" width="24" height="24" rx="6" fill="white" />
    </svg>
  );
}
