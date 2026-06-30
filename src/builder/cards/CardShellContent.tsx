import type { PropsWithChildren } from 'react';
import type { CardKind } from '@/types/card.types';
import { GlassSurface } from '@/ui/surfaces/GlassSurface';

interface CardShellContentProps extends PropsWithChildren {
  kind: CardKind;
  dataId: string;
  isExpanded: boolean;
  glassBorderClass: string;
  surfaceClass: string;
  showCorners: 'selected' | 'hover' | 'none';
  noBackground: boolean;
}

export function CardShellContent({
  kind,
  dataId,
  isExpanded,
  glassBorderClass,
  surfaceClass,
  showCorners,
  noBackground,
  children,
}: CardShellContentProps) {
  const radius = kind === 'phase' ? 'lg' : 'md';
  const radiusClass = kind === 'phase' ? 'rounded-[var(--radius-3xl)]' : 'rounded-[var(--radius-xl)]';
  const paddingClass = kind === 'task'
    ? isExpanded ? 'py-2 px-2.5' : 'py-1 px-1.5'
    : kind === 'action' ? 'p-2.5 pb-3' : 'p-4 md:p-5';

  const cornerSizeClass = kind === 'phase' ? 'w-[20px] h-[20px]' : 'w-[14px] h-[14px]';
  const cornerRadiusTL = kind === 'phase' ? 'rounded-tl-[20px]' : 'rounded-tl-[12px]';
  const cornerRadiusTR = kind === 'phase' ? 'rounded-tr-[20px]' : 'rounded-tr-[12px]';
  const cornerRadiusBR = kind === 'phase' ? 'rounded-br-[20px]' : 'rounded-br-[12px]';
  const cornerRadiusBL = kind === 'phase' ? 'rounded-bl-[20px]' : 'rounded-bl-[12px]';

  const hasCorners = showCorners !== 'none';
  const cornersStyleClass = showCorners === 'selected'
    ? 'opacity-100 scale-100 border-[var(--theme-accent)]'
    : 'opacity-35 scale-[0.98] border-[var(--theme-accent)]/60 hover:opacity-75 transition-all duration-300';

  return (
    <>
      <GlassSurface
        opacity={0.95}
        radius={radius}
        intensity="high"
        noBackground={noBackground}
        className={`w-full min-h-0 flex flex-col relative border ${glassBorderClass} ${radiusClass} ${paddingClass} ${kind === 'phase' ? 'h-full' : 'h-auto shrink-0'}`}
        backdropClassName={`w-full h-full absolute inset-0 transition-all duration-300 ease-out border ${radiusClass} ${surfaceClass}`}
      >
        {children}
      </GlassSurface>
      {hasCorners && (
        <div className={`absolute inset-0 pointer-events-none z-20 transition-all duration-300 ease-out ${cornersStyleClass}`} id={`selected-target-corners-${dataId}`}>
          <span className={`absolute top-0 left-0 border-t-[3px] border-l-[3px] border-inherit ${cornerSizeClass} ${cornerRadiusTL}`} />
          <span className={`absolute top-0 right-0 border-t-[3px] border-r-[3px] border-inherit ${cornerSizeClass} ${cornerRadiusTR}`} />
          <span className={`absolute bottom-0 right-0 border-b-[3px] border-r-[3px] border-inherit ${cornerSizeClass} ${cornerRadiusBR}`} />
          <span className={`absolute bottom-0 left-0 border-b-[3px] border-l-[3px] border-inherit ${cornerSizeClass} ${cornerRadiusBL}`} />
        </div>
      )}
    </>
  );
}
