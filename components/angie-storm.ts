import { Component, computed, effect, inject, signal, untracked } from '@angular/core';
import { ClicksContext } from 'slide-ng/lib/clicks';

const POSES = ['angry', 'cheerful', 'coding-01', 'coding-02', 'coffee', 'error', 'greeting', 'icecream', 'idea', 'keynote-conference', 'laughing', 'magnifying-glass', 'orthos-back', 'orthos-front', 'orthos-side', 'question', 'sad', 'scared', 'shocked', 'superhero', 'teaching'];
const W = 980;
const H = 552;
const GAP = 6;
const TITLE = { x0: 70, y0: 36, x1: 640, y1: 128 };
const FOOTER_TOP = 500;

interface Item {
  src: string;
  style: Record<string, string>;
}

const rand = (min: number, max: number) => min + Math.random() * (max - min);

function shuffle<T>(list: T[]) {
  const copy = [...list];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function hitsTitle(x: number, y: number, r: number) {
  const nx = Math.max(TITLE.x0, Math.min(x, TITLE.x1));
  const ny = Math.max(TITLE.y0, Math.min(y, TITLE.y1));
  return Math.hypot(x - nx, y - ny) < r + GAP;
}

/** Places every Angie pose at random, without overlaps and away from the title and the footer. */
function layout(): Item[] {
  const placed: { x: number; y: number; r: number }[] = [];
  const sizes = Array.from({ length: POSES.length }, () => rand(85, 165)).sort((a, b) => b - a);
  const out: Item[] = [];
  shuffle(POSES).forEach((pose, i) => {
    let size = sizes[i];
    let spot: { x: number; y: number } | null = null;
    while (!spot && size > 55) {
      const r = size * 0.44;
      for (let t = 0; t < 500 && !spot; t++) {
        const x = rand(r + 8, W - r - 8);
        const y = rand(r + 8, FOOTER_TOP - r);
        if (hitsTitle(x, y, r)) continue;
        if (placed.some((o) => Math.hypot(o.x - x, o.y - y) < o.r + r + GAP)) continue;
        spot = { x, y };
      }
      if (!spot) size *= 0.92;
    }
    if (!spot) return;
    placed.push({ ...spot, r: size * 0.44 });
    out.push({
      src: `/angie/all/${pose}.svg`,
      style: {
        left: `${((spot.x - size / 2) / W) * 100}%`,
        top: `${((spot.y - size / 2) / H) * 100}%`,
        width: `${(size / W) * 100}%`,
        '--r': `${Math.round(rand(-28, 28))}deg`,
        '--fx': `${Math.round(rand(-520, 520))}px`,
        '--fy': `${Math.round(rand(-340, 340))}px`,
        '--d': `${rand(0, 0.6).toFixed(2)}s`,
      },
    });
  });
  return out;
}

// Port of AngieStorm.vue: a wall of Angie poses that bursts in (CSS `.angie-storm`) and is shuffled again each time it is revealed.
// Use it with a click: `<angie-storm slide-ng-click />` (the click classes land on this host element, like on the Vue root div).
@Component({
  selector: 'angie-storm',
  host: { class: 'angie-storm' },
  template: `
    @for (item of items(); track item.src) {
      <img [src]="item.src" alt="" [style]="item.style" />
    }
  `,
})
export class AngieStorm {
  items = signal<Item[]>(layout());
  private clicks = inject(ClicksContext);
  private shown = computed(() => this.clicks.current() >= 1);

  constructor() {
    let first = true;
    // Vue `watch(() => clicks >= 1, shown => shown && build())`: not on creation, only when it turns true.
    effect(() => {
      const shown = this.shown();
      if (first) {
        first = false;
        return;
      }
      if (shown) untracked(() => this.items.set(layout()));
    });
  }
}
