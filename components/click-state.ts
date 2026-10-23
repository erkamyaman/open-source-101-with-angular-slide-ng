import { Component, computed, inject } from '@angular/core';
import { ClicksContext } from 'slide-ng/lib/clicks';

// Replaces Slidev's `$clicks` in markdown: put `<click-state #cs />` in a slide, then read `cs.n()` / `cs.level()`.
@Component({ selector: 'click-state', template: '' })
export class ClickState {
  /** Clicks of the slide this element is in (Slidev: `$clicks`). */
  n = inject(ClicksContext).current;
  /** `Math.min(Math.max($clicks, 1), 5)`: the bento state of the agenda slide (templates have no `Math`). */
  level = computed(() => Math.min(Math.max(this.n(), 1), 5));
}
