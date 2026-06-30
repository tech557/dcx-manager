import React from "react";
import { EnrichedVersion } from "../../../types";
import { BuilderTimelineView } from "../timeline/BuilderTimelineView";

interface TimelineStageProps {
  nodes: any[];
  setNodes: React.Dispatch<React.SetStateAction<any[]>>;
  handleAddPhase: (insertIndex?: number) => void;
  currentVersion: EnrichedVersion;
  timelineViewMode: "weekly" | "monthly";
  timelineWeeksCount: number;
  timelineActiveWeek: number;
  setTimelineActiveWeek: (week: number) => void;
}

export function TimelineStage({
nodes,
  setNodes,
  handleAddPhase,
  currentVersion,
  timelineViewMode,
  timelineWeeksCount,
  timelineActiveWeek,
  setTimelineActiveWeek,
}: TimelineStageProps) {
  return (
    <BuilderTimelineView
      nodes={nodes}
      setNodes={setNodes}
      handleAddPhase={handleAddPhase}
      currentVersion={currentVersion}
      viewMode={timelineViewMode}
      weeksCount={timelineWeeksCount}
      activeWeek={timelineActiveWeek}
      onActiveWeekChange={setTimelineActiveWeek}
    />
  );
}
