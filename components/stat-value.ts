import { Component, computed, input } from '@angular/core';
import stats from './stats.json';

export type StatKey = keyof typeof stats;

// Port of Stat.vue: prints one number of stats.json (written by scripts/stats.mjs before dev and build).
@Component({
  selector: 'stat-value',
  template: '{{ value() }}',
})
export class StatValue {
  k = input.required<StatKey>();
  value = computed(() => stats[this.k()]);
}
