<script lang="ts">
import { MapLibre, MapEvents, Marker, Popup } from "svelte-maplibre";
import maplibregl from "maplibre-gl";
import type { MapMouseEvent } from "maplibre-gl";
import Button from "$lib/components/ui/button.svelte";
import { invalidate } from "$app/navigation";

import LiveIncidents from "$lib/components/LiveIncidents.svelte";
import IncidentForm from "$lib/components/forms/IncidentForm.svelte";
import IncidentInfo from "$lib/components/IncidentInfo.svelte";
import IncidentChat from "$lib/components/IncidentChat.svelte";
import Sidebar from "$lib/components/ui/sidebar.svelte";
import type { Incident } from "$lib/server/db/schema";

let { data } = $props();

// Default bounds (Jamaica)
const DEFAULT_BOUNDS: maplibregl.LngLatBoundsLike = [-78.4, 17.7, -76.2, 18.5];

// Initialize bounds from localStorage or use default
let bounds = $state<maplibregl.LngLatBoundsLike>(
  typeof window !== "undefined"
    ? JSON.parse(
        localStorage.getItem("mapBounds") || JSON.stringify(DEFAULT_BOUNDS),
      )
    : DEFAULT_BOUNDS,
);

let showForm = $state(false);
let selectedIncident = $state<Incident | null>(null);
let reportedIncidents = $state<Incident[]>(
  (data.incidents || []).map((i: any) => ({
    ...i,
    // If API returned an author object, use its id (or name) as a string; otherwise keep string|null
    author:
      typeof i.author === "object" && i.author !== null
        ? (i.author.id as string)
        : (i.author as string | null),
    // Ensure createdAt/resolvedAt are Date objects (or null for resolvedAt)
    createdAt: i.createdAt ? new Date(i.createdAt) : new Date(),
    resolvedAt: i.resolvedAt ? new Date(i.resolvedAt) : null,
  })) as Incident[],
);

type MarkerData = {
  incident?: Incident;
  lngLat: { lng: number; lat: number };
};

let tempMarker = $state<MarkerData | null>(null);

let markers = $derived([
  ...reportedIncidents.map((incident) => {
    const [lat, lng] = incident.geolocation?.split(",").map(Number) || [0, 0];
    return {
      incident,
      lngLat: { lng, lat },
    } satisfies MarkerData;
  }),
  ...(tempMarker ? [tempMarker] : []),
]);

function toggleIncidentForm() {
  selectingLocation = true;

  showForm = !showForm;
  if (!showForm) {
    tempMarker = null;
  }
}

let selectingLocation = $state(false);

function handleMarkerClick(marker: MarkerData) {
  if (marker.incident) {
    selectedIncident = marker.incident;
  }
}

function closeIncidentInfo() {
  selectedIncident = null;
}

function openChat() {
  if (selectedIncident) {
  }
}

function createIncident() {
  if (showForm) {
    // If closing the form
    showForm = false;
    tempMarker = null;
    selectingLocation = false;
  } else {
    // Start location selection mode
    selectingLocation = !selectingLocation;
  }
}

function addMarker(e: MapMouseEvent) {
  // Only add marker if we're in location selection mode
  if (!selectingLocation) return;

  const { lngLat } = e;
  tempMarker = {
    lngLat: { lng: lngLat.lng, lat: lngLat.lat },
  };
  selectingLocation = false;
  showForm = true;
}

interface FormResult {
  data?: {
    id: string;
    [key: string]: unknown;
  };
}

async function handleSuccess(result: FormResult) {
  if (result.data) {
    // Clean up state
    tempMarker = null;
    showForm = false;
    selectingLocation = false;

    // Invalidate the page data to trigger a refresh (invalidate the current route)
    location.reload();
  }
}
</script>

<Sidebar incidents={reportedIncidents} user={data.user || null}>
	<div class="relative flex w-full h-full">
		<MapLibre
			style="https://basemaps.cartocdn.com/gl/positron-gl-style/style.json"
			class="relative w-full h-full"
			standardControls
			bind:bounds
			onmoveend={() => {
				localStorage.setItem('mapBounds', JSON.stringify(bounds));
			}}
		>
			<MapEvents onclick={addMarker} />

			{#each markers as marker (marker.incident?.id ?? `temp-${marker.lngLat.lng}-${marker.lngLat.lat}`)}
				<Marker lngLat={[marker.lngLat.lng, marker.lngLat.lat]}>
					<button
						type="button"
						class="marker-pin {!marker.incident
							? 'text-red-500 animate-bounce'
							: ''}"
						onclick={() => handleMarkerClick(marker)}
						onkeydown={(e) => e.key === "Enter" && handleMarkerClick(marker)}
						aria-label={marker.incident
							? `View incident details at ${marker.lngLat.lat}, ${marker.lngLat.lng}`
							: "Temporary marker"}
					>
						{marker.incident ? "📍" : "📌"}
					</button>
				</Marker>
			{/each}
		</MapLibre>

		{#if selectingLocation}
			<div
				class="absolute top-0 left-0 right-0 bg-blue-500 text-white py-2 px-4 text-center"
			>
				Click on the map to select the incident location
			</div>
		{/if}

		<div class="absolute bottom-12 right-6">
      <div class="flex flex-col-reverse gap-5">
        <Button
          variant="secondary"
          size="lg"
          onclick={createIncident}
          class="z-50 rounded-full text-white shadow-lg hover:shadow-xl transition-shadow duration-200 {selectingLocation
            ? 'bg-blue-400'
            : 'bg-red-400'}"
        >
          {selectingLocation ? "Cancel" : "Report Incident"}
        </Button>

        {#if selectedIncident}
           <Button
            variant="secondary"
            size="lg"
            onclick={openChat}
            class="z-50 rounded-full text-white shadow-lg hover:shadow-xl transition-shadow duration-200 bg-green-400"
          >
            Chat
          </Button>
        {/if}
       
      </div>
		</div>

		{#if selectedIncident}
			<div
				class="absolute top-0 right-0 h-full w-96 bg-white shadow-lg p-4 overflow-y-auto"
			>
				<IncidentInfo incident={selectedIncident} onClose={closeIncidentInfo} />
				<IncidentChat  />

			</div>
		{/if}
	</div>
</Sidebar>

{#if showForm}
	<div class="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
		<div class="bg-white rounded-lg p-6 w-full max-w-2xl mx-4">
			<div class="flex justify-between items-center mb-4">
				<h2 class="text-2xl font-bold">Report Incident</h2>
				<Button variant="ghost" size="sm" onclick={toggleIncidentForm}>✕</Button
				>
			</div>
			<IncidentForm onSuccess={handleSuccess} location={tempMarker?.lngLat} />
		</div>
	</div>
{/if}

<style>
	.marker-pin {
		font-size: 2rem;
		cursor: pointer;
		transition: transform 0.2s;
	}

	.marker-pin:hover {
		transform: scale(1.2);
	}
</style>
