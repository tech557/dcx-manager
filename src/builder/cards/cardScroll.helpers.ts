/**
 * Reveal `el` by scrolling ONLY the nearest scroll container that lives inside the task's own
 * action card — never bubbling up to scroll the stage. Native `scrollIntoView` scrolls every
 * scrollable ancestor (including the kanban stage scroller); this keeps a task's reveal contained
 * to its action-card task row. Phases do their own stage-level scrolling in the StageProvider /
 * KanbanView, so tasks must not move the stage.
 */
export function scrollIntoViewWithinAction(el: HTMLElement, axis: 'x' | 'y' = 'x'): void {
  const boundary = el.closest('[data-card-kind="action"]');
  let node = el.parentElement;
  while (node) {
    const style = getComputedStyle(node);
    const overflow = axis === 'x' ? style.overflowX : style.overflowY;
    const canScroll = /(auto|scroll)/.test(overflow)
      && (axis === 'x' ? node.scrollWidth > node.clientWidth : node.scrollHeight > node.clientHeight);
    if (canScroll) {
      const er = el.getBoundingClientRect();
      const pr = node.getBoundingClientRect();
      if (axis === 'x') {
        if (er.left < pr.left) node.scrollBy({ left: er.left - pr.left, behavior: 'smooth' });
        else if (er.right > pr.right) node.scrollBy({ left: er.right - pr.right, behavior: 'smooth' });
      } else {
        if (er.top < pr.top) node.scrollBy({ top: er.top - pr.top, behavior: 'smooth' });
        else if (er.bottom > pr.bottom) node.scrollBy({ top: er.bottom - pr.bottom, behavior: 'smooth' });
      }
      return;
    }
    // Reached the action card without finding an inner scroller — do nothing (never scroll the stage).
    if (node === boundary) return;
    node = node.parentElement;
  }
}
