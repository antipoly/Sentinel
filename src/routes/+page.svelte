<script lang="ts">
	import { MapLibre, MapEvents, Marker, Popup } from "svelte-maplibre";
	import maplibregl from "maplibre-gl";
	import type { MapMouseEvent } from "maplibre-gl";
	import IncidentForm from "$lib/components/forms/IncidentForm.svelte";
  import Incidentinfo from "$lib/components/incidentinfo.svelte";
	import Button from "$lib/components/ui/button.svelte";
	import IncidentInfo from "$lib/components/incidentinfo.svelte";
	import Sidebar from "$lib/components/ui/sidebar.svelte";
	import type { Incident } from "$lib/server/db/schema";

	let { data } = $props();

	// Jamaica
	let bounds = $state<maplibregl.LngLatBoundsLike>([-78.4, 17.7, -76.2, 18.5]);
	// let displayBounds = $derived(bounds.map((b) => b.toFixed(4)).join(", "));

	let showForm = $state(false);
	let selectedIncident = $state<Incident | null>(null);
	let reportedIncidents = $state<Incident[]>(data.incidents || []);

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
				lngLat: { lng, lat }
			} satisfies MarkerData;
		}),
		...(tempMarker ? [tempMarker] : [])
	]);

	function toggleIncidentForm() {
		selectingLocation = true;

		showForm = !showForm;
		if (!showForm) {
			tempMarker = null;
		}
	}

	let selectingLocation = $state(false);

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
			lngLat: { lng: lngLat.lng, lat: lngLat.lat }
		};
		selectingLocation = false;
		showForm = true;
	}

	function handleSuccess(result: any) {
		if (result.data) {
			const incident = result.data;
			console.log('New incident:', incident);
			
			// Update the incidents list
			const updatedIncidents = [...reportedIncidents, incident];
			console.log('Updated incidents:', updatedIncidents);
			reportedIncidents = updatedIncidents;

			// Force markers update
			const [lat, lng] = incident.geolocation?.split(",").map(Number) || [0, 0];
			const newMarker: MarkerData = {
				incident,
				lngLat: { lng, lat }
			};
			markers = [...markers.filter(m => m !== tempMarker), newMarker];

			// Clean up state
			tempMarker = null;
			showForm = false;
			selectingLocation = false;
		}
	}

	function handleMarkerClick(incident: Incident) {
		selectedIncident = incident;


	}

	function closeIncidentInfo() {
		selectedIncident = null;
	}
</script>

<Sidebar>
	<div class="relative w-full h-full">
		<MapLibre
			style="https://basemaps.cartocdn.com/gl/positron-gl-style/style.json"
			class="relative w-full h-full"
			standardControls
			bind:bounds
		>
			<MapEvents onclick={addMarker} />

			{#each markers as { incident, lngLat }}
				<Marker lngLat={[lngLat.lng, lngLat.lat]}>
					<div
						class="marker-pin {!incident ? 'text-red-500 animate-bounce' : ''}"
						on:click={() => incident && handleMarkerClick(incident)}
					>
						{incident ? "📍" : "📌"}
					</div>
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
			<Button
				variant="secondary"
				size="lg"
				onclick={createIncident}
				class="z-50 rounded-full shadow-lg hover:shadow-xl transition-shadow duration-200 {selectingLocation
					? 'bg-blue-400'
					: 'bg-red-400'}"
			>
				{selectingLocation ? "Cancel" : "Report Incident"}
			</Button>
		</div>

		{#if selectedIncident}
			<div
				class="absolute top-0 right-0 h-full w-80 bg-white shadow-lg p-4 overflow-y-auto"
			>
				<IncidentInfo incident={selectedIncident} onClose={closeIncidentInfo} />
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
