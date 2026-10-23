import { Component, DestroyRef, computed, effect, inject, input, signal, untracked } from '@angular/core';
import { Nav } from 'slide-ng/lib/nav';
import { RENDER_CONTEXT, SLIDE_NO } from 'slide-ng/lib/slide-context';
import stats from './stats.json';

// Port of CountUp.vue: counts from 0 to the number (eased) each time its slide is shown, and resets when the slide is left.
// In print (PDF export) and overview it shows the final number at once.
@Component({
  selector: 'count-up',
  template: `<span class="count-up" [style.width]="width()">{{ value() }}</span>{{ suffix() }}`,
})
export class CountUp {
  to = input<number>();
  k = input<keyof typeof stats>();
  duration = input<number>();
  suffix = input<string>('');

  target = computed(() => {
    const k = this.k();
    return k ? stats[k] : (this.to() ?? 0);
  });
  width = computed(() => String(this.target()).length + 'ch');

  private nav = inject(Nav);
  private slideNo = inject(SLIDE_NO);
  private context = inject(RENDER_CONTEXT);
  private still = this.context === 'print' || this.context === 'overview';
  private shown = signal(0);
  value = computed(() => (this.still ? this.target() : this.shown()));

  private frame = 0;
  private running = false;

  constructor() {
    effect(() => {
      const here = this.nav.no() === this.slideNo;
      untracked(() => (here ? this.run() : this.reset()));
    });
    inject(DestroyRef).onDestroy(() => cancelAnimationFrame(this.frame));
  }

  private run() {
    if (this.running || this.still) return;
    this.running = true;
    cancelAnimationFrame(this.frame);
    this.shown.set(0);
    const ms = this.duration() ?? 1800;
    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min((now - start) / ms, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      this.shown.set(Math.round(eased * this.target()));
      if (t < 1) this.frame = requestAnimationFrame(tick);
      else this.running = false;
    };
    this.frame = requestAnimationFrame(tick);
  }

  private reset() {
    this.running = false;
    cancelAnimationFrame(this.frame);
    this.shown.set(0);
  }
}
