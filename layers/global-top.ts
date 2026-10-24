import { Component, DestroyRef, ElementRef, afterNextRender, computed, effect, inject, signal } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { Nav } from 'slide-ng/lib/nav';

const SECTIONS = [
  { from: 4, name: 'How I started' },
  { from: 13, name: 'What to send or skip' },
  { from: 14, name: 'Where to find things to fix' },
  { from: 17, name: 'PRs to big projects' },
  { from: 24, name: 'First contribution' },
  { from: 25, name: 'Bonus' },
];

const TR_NAMES = ['Nasıl başladım', 'Ne göndermeli, ne geçmeli', 'Düzeltilecek şeyleri nerede bulmalı', 'Büyük projelere PR', 'İlk katkı', 'Bonus'];

// Port of global-top.vue: the footer (author, section, slide count, progress bar) on every slide
// except the first two and the last three, plus the `mouse-live` class on <html>: hover effects
// only turn on once the mouse really moves (24px), and turn off again on every slide or click change.
@Component({
  selector: 'deck-global-top',
  template: `
    @if (no() > 2 && no() < nav.total - 2) {
      <div class="deck-footer">
        <div class="deck-id">
          <img src="/erkamyaman.jpg" alt="" />
          <span>erKam</span>
        </div>
        @if (section(); as s) {
          <span class="deck-section">{{ s.number }} / {{ s.name }}</span>
        }
        <span class="deck-count">{{ no() }} / {{ nav.total }}</span>
      </div>
    }
  `,
})
export default class DeckGlobalTop {
  nav = inject(Nav);
  /** Slide of the PDF page this layer is drawn on (null on screen). Workaround: in print every page's
   *  layer injects the same Nav, whose no() is 1, so the footer would vanish from the PDF. */
  private printNo = signal<number | null>(null);
  /** The slide this footer describes: the printed page in PDF export, else the slide on screen. */
  no = computed(() => this.printNo() ?? this.nav.no());
  private root = inject(DOCUMENT).documentElement;
  private lang = signal(this.root.lang.toLowerCase().startsWith('tr') ? 'tr' : 'en');
  private langWatch = new MutationObserver(() => this.lang.set(this.root.lang.toLowerCase().startsWith('tr') ? 'tr' : 'en'));
  private anchor: { x: number; y: number } | null = null;

  section = computed(() => {
    let found = -1;
    SECTIONS.forEach((s, i) => {
      if (this.no() >= s.from) found = i;
    });
    if (found < 0) return null;
    const isBonus = SECTIONS[found].name === 'Bonus';
    const isTr = this.lang() === 'tr';
    const name = isTr ? TR_NAMES[found] : SECTIONS[found].name;
    return { number: isBonus ? 'Bonus' : String(found + 1), name: isBonus ? (isTr ? 'Skill’ler' : 'Skills') : name };
  });

  private onMove = (e: MouseEvent) => {
    if (!this.root.classList.contains('mouse-live')) {
      if (!this.anchor) this.anchor = { x: e.clientX, y: e.clientY };
      if (Math.hypot(e.clientX - this.anchor.x, e.clientY - this.anchor.y) < 24) return;
    }
    this.root.classList.add('mouse-live');
  };

  constructor() {
    const host = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;
    afterNextRender(() => {
      const page = host.closest<HTMLElement>('[data-slide-ng-no]');
      if (page) this.printNo.set(Number(page.dataset['slideNgNo']));
    });
    this.langWatch.observe(this.root, { attributes: true, attributeFilter: ['lang'] });
    inject(DestroyRef).onDestroy(() => this.langWatch.disconnect());
    const win = this.root.ownerDocument.defaultView!;
    win.addEventListener('mousemove', this.onMove, { passive: true });
    inject(DestroyRef).onDestroy(() => win.removeEventListener('mousemove', this.onMove));
    // Vue: watch([currentPage, clicks], idle). An effect also runs once at start, which is harmless here.
    effect(() => {
      this.nav.no();
      this.nav.clicks();
      this.root.classList.remove('mouse-live');
      this.anchor = null;
    });
  }
}
