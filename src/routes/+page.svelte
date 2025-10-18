<script lang="ts">
  import { MapLibre } from 'svelte-maplibre';
  import type { LngLatBoundsLike } from 'maplibre-gl';
  // import code from './+page.svelte?raw';

  let bounds: LngLatBoundsLike = $state([-32, -8, 63, 41]);
  let displayBounds = $derived(bounds.map((b) => b.toFixed(4)).join(', '));
</script>

<p class="tabular-nums">Bounds: {displayBounds}</p>

<MapLibre
  style="https://basemaps.cartocdn.com/gl/positron-gl-style/style.json"
  class="relative aspect-[9/16] max-h-[70vh] w-full sm:aspect-video sm:max-h-full"
  standardControls
  bind:bounds
/>