import { useRef, useState, useCallback, useEffect } from 'react';

export type ScrollAxis = 'vertical' | 'horizontal';

interface ScrollEdgeState {
  startFade: boolean;
  endFade: boolean;
}

export function useScrollEdge(axis: ScrollAxis = 'vertical') {
  const elRef = useRef<HTMLElement | null>(null);
  const roRef = useRef<ResizeObserver | null>(null);
  const [state, setState] = useState<ScrollEdgeState>({ startFade: false, endFade: false });

  const update = useCallback(() => {
    const el = elRef.current;
    if (!el) return;
    if (axis === 'vertical') {
      const scrollable = el.scrollHeight > el.clientHeight + 4;
      const atTop = el.scrollTop <= 2;
      const atBottom = el.scrollTop + el.clientHeight >= el.scrollHeight - 2;
      setState({ startFade: scrollable && !atTop, endFade: scrollable && !atBottom });
    } else {
      const scrollable = el.scrollWidth > el.clientWidth + 4;
      const atLeft = el.scrollLeft <= 2;
      const atRight = el.scrollLeft + el.clientWidth >= el.scrollWidth - 2;
      setState({ startFade: scrollable && !atLeft, endFade: scrollable && !atRight });
    }
  }, [axis]);

  const ref = useCallback(
    (el: HTMLElement | null) => {
      if (elRef.current) {
        elRef.current.removeEventListener('scroll', update);
        roRef.current?.disconnect();
      }
      elRef.current = el;
      if (el) {
        el.addEventListener('scroll', update, { passive: true });
        const ro = new ResizeObserver(update);
        ro.observe(el);
        roRef.current = ro;
        update();
      }
    },
    [update],
  );

  // Clean up on unmount
  useEffect(() => () => { roRef.current?.disconnect(); }, []);

  return { ref, ...state };
}
