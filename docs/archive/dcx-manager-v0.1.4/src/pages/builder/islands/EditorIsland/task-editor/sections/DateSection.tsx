import React from "react";
import { TaskDate } from "../../../../../../types/domain";
import { CommunicationDateField } from "../components/CommunicationDateField";
import { EnrichedVersion } from "../../../../../../types";

interface DateSectionProps {
  date: TaskDate;
  onChange: (newDate: TaskDate) => void;
  currentVersion?: EnrichedVersion;
}

export function DateSection({
date,
  onChange,
  currentVersion,
}: DateSectionProps) {
  // Convert TaskDate to legacy string for CommunicationDateField
  const getStringValue = (): string => {
    if (date.mode === "unset") {
      return "";
    }
    if (date.mode === "fixed") {
      return date.date;
    }
    if (date.mode === "linked") {
      return `Week ${date.weekOffset} - Day ${date.dayOffset}`;
    }
    return "";
  };

  const handleDateChange = (val: string, isSynced?: boolean, week?: number, day?: number) => {
    if (isSynced || val.toLowerCase().includes("week")) {
      let w = week;
      let d = day;
      if (w === undefined || d === undefined) {
        // Try parsing from string "Week X - Day Y"
        const regex = /week\s*(\d+)\s*-\s*day\s*(\d+)/i;
        const match = val.match(regex);
        if (match) {
          w = parseInt(match[1], 10);
          d = parseInt(match[2], 10);
        }
      }
      onChange({
        mode: "linked",
        weekOffset: w ?? 1,
        dayOffset: d ?? 1
      });
    } else {
      if (!val) {
        onChange({ mode: "unset" });
      } else {
        onChange({
          mode: "fixed",
          date: val
        });
      }
    }
  };

  return (
    <CommunicationDateField
      value={getStringValue()}
      onChange={handleDateChange}
      currentVersion={currentVersion}
    />
  );
}
