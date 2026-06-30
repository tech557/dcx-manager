import { useState, useEffect } from "react";
import { useBuilderStore } from "../../../store/builderStore";

interface HighlightOptions {
  scrollBehavior?: "auto" | "smooth";
  scrollBlock?: "start" | "center" | "end" | "nearest";
  scrollInline?: "start" | "center" | "end" | "nearest";
  scrollDelay?: number;
  animationDuration?: number;
  showDataDelay?: number;
  closestSelector?: string;
}

export function useNewObjectHighlight(
  id: string,
  options: HighlightOptions = {}
) {
  const {
    scrollBehavior = "smooth",
    scrollBlock = "nearest",
    scrollInline = "center",
    scrollDelay = 600,
    animationDuration = 1500,
    showDataDelay = 300,
    closestSelector,
  } = options;

  const [isNewlyCreated, setIsNewlyCreated] = useState(() => {
    return useBuilderStore.getState().lastCreatedId === id;
  });

  const [showData, setShowData] = useState(() => {
    const isNew = useBuilderStore.getState().lastCreatedId === id;
    return !isNew;
  });

  useEffect(() => {
    let scrollTimer: any;
    let dataTimer: any;
    let endTimer: any;

    const triggerHighlight = () => {
      setIsNewlyCreated(true);
      setShowData(false);

      scrollTimer = setTimeout(() => {
        const el = document.getElementById(id);
        if (el) {
          if (closestSelector) {
            const columnEl = el.closest(closestSelector);
            if (columnEl) {
              columnEl.scrollIntoView({
                behavior: scrollBehavior,
                block: scrollBlock,
                inline: scrollInline,
              });
              return;
            }
          }
          el.scrollIntoView({
            behavior: scrollBehavior,
            block: scrollBlock,
            inline: scrollInline,
          });
        }
      }, scrollDelay);

      dataTimer = setTimeout(() => {
        setShowData(true);
      }, showDataDelay);

      endTimer = setTimeout(() => {
        setIsNewlyCreated(false);
        const { lastCreatedId, setLastCreatedId, setAnyHighlightActive } = useBuilderStore.getState();
        if (lastCreatedId === id) {
          setLastCreatedId(null);
        }
        setAnyHighlightActive(false);
      }, animationDuration);
    };

    const handleCreated = (e: Event) => {
      const customEvent = e as CustomEvent<{ id: string; type: string }>;
      if (customEvent.detail && customEvent.detail.id === id) {
        useBuilderStore.getState().setAnyHighlightActive(true);
        triggerHighlight();
      }
    };

    // Check if the item is already set as lastCreatedId during initialization
    if (useBuilderStore.getState().lastCreatedId === id) {
      useBuilderStore.getState().setAnyHighlightActive(true);
      triggerHighlight();
    }

    if (typeof window !== "undefined") {
      window.addEventListener("object-created", handleCreated);
    }

    return () => {
      clearTimeout(scrollTimer);
      clearTimeout(dataTimer);
      clearTimeout(endTimer);
      if (typeof window !== "undefined") {
        window.removeEventListener("object-created", handleCreated);
      }
    };
  }, [id, scrollBehavior, scrollBlock, scrollInline, scrollDelay, animationDuration, showDataDelay, closestSelector]);

  return {
    isNewlyCreated,
    showData,
  };
}
