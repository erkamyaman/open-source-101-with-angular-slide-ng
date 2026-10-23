import { Component, input, linkedSignal } from '@angular/core';

// Port of Counter.vue (Slidev starter component; not used by the slides, kept for parity).
// The class is not called `Counter`, so it does not replace slide.ng's built-in of that name.
@Component({
  selector: 'deck-counter',
  host: { class: 'flex w-min border border-main rounded-md' },
  template: `
    <button class="border-r border-main p-2 font-mono outline-none! hover:bg-gray-400/20" (click)="n.set(n() - 1)">-</button>
    <span class="m-auto p-2">{{ n() }}</span>
    <button class="border-l border-main p-2 font-mono outline-none! hover:bg-gray-400/20" (click)="n.set(n() + 1)">+</button>
  `,
})
export class DeckCounter {
  count = input(0);
  n = linkedSignal(() => this.count());
}
