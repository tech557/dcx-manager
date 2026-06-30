interface DividerLineProps {
  orientation?: 'horizontal' | 'vertical';
}

export function DividerLine({ orientation = 'vertical' }: DividerLineProps) {
  const sizeClass = orientation === 'vertical' ? 'h-5 w-[1px]' : 'h-[1px] w-5';

  return <div className={`${sizeClass} bg-[var(--theme-divider)]`} />;
}
