<script lang="ts">
	import { enhance } from "$app/forms";
	import { onMount } from "svelte";
	import Button from "$lib/components/ui/button.svelte";
	import type { incidentType, cautionLevel } from "$lib/server/db/schema";
	import type { Incident } from "$lib/server/db/schema";

	type Location = {
		lng: number;
		lat: number;
	};

	type ActionResult = {
		type: "success" | "error";
		data?: Incident;
		error?: { message: string };
	};

	const {
		onSuccess = (result: ActionResult): void => {},
		location = undefined as Location | undefined
	} = $props<{
		onSuccess?: (result: ActionResult) => void;
		location?: Location;
	}>();

	let emergencyType = $state<typeof incidentType | "">("");
	let severity = $state<typeof cautionLevel | "">("");
	let latitude = $state<number | null>(location ? location.lat : null);
	let longitude = $state<number | null>(location ? location.lng : null);
	let description = $state("");
	let loading = $state(false);
	let error = $state<string | null>(null);

	const incidentTypes = [
		"Earthquake",
		"Wildfire",
		"Tsunami",
		"Adverse Weather",
		"Flash Flood",
		"Crime",
		"Tornado"
	] as const;

	const cautionLevels = [
		"High severity",
		"Medium severity",
		"Low severity"
	] as const;

	// Validate that we have a location
	onMount(() => {
		if (!latitude || !longitude) {
			error = "Please select a location on the map";
		}
	});

	function validateForm() {
		if (!emergencyType) {
			error = "Please select an emergency type";
			return false;
		}
		if (!severity) {
			error = "Please select a severity level";
			return false;
		}
		if (latitude === null || longitude === null) {
			error = "Please select a location on the map";
			return false;
		}
		return true;
	}
</script>

<form
	method="POST"
	action="?/createIncident"
	class="space-y-6"
	use:enhance={() => {
		if (!validateForm()) {
			return;
		}

		loading = true;
		error = null;

		return async ({ result }) => {
			loading = false;

			if (result.type === "error") {
				error = result.error.message;
			} else if (result.type === "success") {
				onSuccess(result);
				// Reset form
				emergencyType = "";
				severity = "";
				description = "";
			}
		};
	}}
>
	{#if error}
		<div
			class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative"
			role="alert"
		>
			<span class="block sm:inline">{error}</span>
		</div>
	{/if}

	<!-- Location Information -->
	<input
		type="hidden"
		name="geolocation"
		value={latitude !== null && longitude !== null
			? `${latitude},${longitude}`
			: ""}
	/>

	<div class="space-y-2">
		<label for="location" class="block text-sm font-medium text-gray-700">
			Selected Location
		</label>
		<div class="flex items-center space-x-2">
			<div class="flex-1 px-3 py-2 bg-gray-50 rounded-md">
				{#if latitude !== null && longitude !== null}
					{latitude.toFixed(6)}, {longitude.toFixed(6)}
				{:else}
					No location selected. Please click on the map to select a location.
				{/if}
			</div>
		</div>
	</div>

	<!-- Emergency Type -->
	<div class="space-y-2">
		<label for="type" class="block text-sm font-medium text-gray-700">
			Emergency Type <span class="text-red-500">*</span>
		</label>
		<select
			id="type"
			name="type"
			bind:value={emergencyType}
			class="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
			required
		>
			<option value="">Select emergency type</option>
			{#each incidentTypes as type}
				<option value={type}>{type}</option>
			{/each}
		</select>
	</div>

	<!-- Severity Level -->
	<div class="space-y-2">
		<label for="severity" class="block text-sm font-medium text-gray-700">
			Severity Level <span class="text-red-500">*</span>
		</label>
		<select
			id="severity"
			name="severity"
			bind:value={severity}
			class="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
			required
		>
			<option value="">Select severity level</option>
			{#each cautionLevels as level}
				<option value={level}>{level}</option>
			{/each}
		</select>
	</div>

	<!-- Description -->
	<div class="space-y-2">
		<label for="description" class="block text-sm font-medium text-gray-700">
			Description
		</label>
		<textarea
			id="description"
			name="description"
			bind:value={description}
			rows="3"
			class="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 mt-1 block w-full sm:text-sm border border-gray-300 rounded-md"
			placeholder="Provide additional details about the incident..."
		></textarea>
	</div>

	<!-- Submit Button -->
	<div class="flex justify-end">
		<Button
			type="submit"
			variant="default"
			disabled={loading || !latitude || !longitude}
		>
			{loading ? "Submitting..." : "Report Incident"}
		</Button>
	</div>
</form>

<style>
	label {
		display: block;
		font-weight: 600;
		margin-bottom: 0.5rem;
		color: #374151;
	}

	input,
	select,
	textarea {
		width: 100%;
		padding: 0.5rem;
		border: 1px solid #d1d5db;
		border-radius: 4px;
		font-size: 1rem;
	}

	input:focus,
	select:focus,
	textarea:focus {
		outline: none;
		border-color: #dc2626;
		box-shadow: 0 0 0 3px rgba(220, 38, 38, 0.1);
	}

	button {
		width: 100%;
		padding: 0.75rem;
		background: #dc2626;
		color: white;
		border: none;
		border-radius: 4px;
		font-size: 1rem;
		font-weight: 600;
		cursor: pointer;
	}

	button:hover {
		background: #b91c1c;
	}
</style>
