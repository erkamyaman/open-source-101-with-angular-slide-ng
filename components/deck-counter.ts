import { Component, input, linkedSignal } from '@angular/core';

// Port of Counter.vue (Slidev starter component; not used by the slides, kept for parity).
// The class is not called `Counter`, so it does not replace slide.ng's built-in of that name.
@Component({
  selector: 'deck-counter',
  host: { class: 'flex w-min border border-main rounded-md' },
  templateUrl: './deck-counter.html',
})
export class DeckCounter {
  count = input(0);
  n = linkedSignal(() => this.count());
}
