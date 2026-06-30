# Builder — Readiness Model

**ID prefix:** BLD-RDY

## General model ✅

Every relevant card has its own readiness validation. Readiness is consistent and reusable across card types.

Primary validation:
- Required fields being completed
- Required child objects existing
- Child objects being ready

## Subtask readiness ✅

A Subtask inherits type and name. User must enter time (estimatedMinutes).  
**Ready when:** required inherited data is valid AND time is entered.

## Task readiness ✅

**Ready when:**
- All required Task inputs completed (name, channelId, senderId, receiverId, message, date)
- specsState and missingDataState are filled or not-needed (not empty)
- At least one Subtask exists
- At least one Subtask is valid (ready)
- All required Subtask inputs are valid (including duration)

A Task with zero Subtasks is always not ready.

## Action readiness ✅

**Ready when:** all child Tasks are ready.

## Phase readiness ✅

**Ready when:** all child Actions are ready.

## Day readiness ✅

**Ready when:** all Tasks assigned to that Day are ready.  
**Empty Day:** Neutral / empty state (not ready). Days have 3 semantic states: ready, incomplete, empty. Empty Day does not reduce overall Version readiness. (✅ BLD-RED-001 / OD-002)

## Version readiness ✅

Derived from Task → Action → Phase → Version.  
Also considers Day card readiness and required objects existing.
