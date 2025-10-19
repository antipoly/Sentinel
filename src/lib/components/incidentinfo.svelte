<script lang="ts">
	import type { Incident } from "$lib/server/db/schema";
	import Button from "$lib/components/ui/button.svelte";
	import IncidentChat from "./IncidentChat.svelte";

	export let incident: Incident;
	export let onClose: () => void;

	// Calculate time ago from timestamp
	function getTimeAgo(timestamp: Date) {
		const now = new Date();
		const diff = Math.floor((now.getTime() - timestamp.getTime()) / 60000); // minutes

		if (diff < 1) return "Just now";
		if (diff < 60) return `${diff} minute${diff > 1 ? "s" : ""} ago`;
		const hours = Math.floor(diff / 60);
		if (hours < 24) return `${hours} hour${hours > 1 ? "s" : ""} ago`;
		const days = Math.floor(hours / 24);
		return `${days} day${days > 1 ? "s" : ""} ago`;
	}

	// Get incident type emoji
	function getIncidentEmoji(type: string) {
		switch (type) {
			case "Wildfire":
				return "🔥";
			case "Earthquake":
				return "🌍";
			case "Tsunami":
				return "🌊";
			case "Adverse Weather":
				return "🌪️";
			case "Flash Flood":
				return "💧";
			case "Crime":
				return "�";
			case "Tornado":
				return "�️";
			default:
				return "⚠️";
		}
	}

	function getSeverityColor(severity: string): string {
		switch (severity) {
			case "High severity":
				return "text-red-600 bg-red-100";
			case "Medium severity":
				return "text-amber-600 bg-amber-100";
			case "Low severity":
				return "text-green-600 bg-green-100";
			default:
				return "text-gray-600 bg-gray-100";
		}
	}

	$: severityClass = getSeverityColor(incident.severity);
</script>

<div class="flex flex-col h-full">
	<div class="border-b pb-4">
		<div class="flex justify-between items-start mb-4">
			<h2 class="text-xl font-bold">Emergency Incident #{incident.id}</h2>
			<Button
				variant="ghost"
				size="sm"
				onclick={onClose}
				class="hover:bg-gray-100 rounded-full p-2"
			>
				<span class="text-lg font-semibold text-gray-500">✕</span>
			</Button>
		</div>
	</div>	

	<div class="space-y-4">
		<div>
			<span class="text-sm text-gray-500">Type</span>
			<div class="flex items-center gap-2 mt-1">
				<span class="text-2xl">{getIncidentEmoji(incident.type)}</span>
				<p class="font-medium text-lg">{incident.type}</p>
			</div>
		</div>

		<div>
			<span class="text-sm text-gray-500">Severity</span>
			<span
				class="inline-block px-2 py-1 rounded-full text-sm font-medium mt-1 {severityClass}"
			>
				{incident.severity}
			</span>
		</div>

		{#if incident.description}
			<div>
				<span class="text-sm text-gray-500">Description</span>
				<p class="mt-1">{incident.description}</p>
			</div>
		{/if}

		<div>
			<span class="text-sm text-gray-500">Location</span>
			{#if incident.geolocation}
				{@const [lat, lng] = incident.geolocation.split(",").map(Number)}
				<p class="text-sm mt-1">
					Lat: {lat.toFixed(6)}, Lng: {lng.toFixed(6)}
				</p>
			{/if}
		</div>

		<div>
			<span class="text-sm text-gray-500">Status</span>
			<!-- <p class="mt-1">{incident.active ? 'Active' : 'Resolved'}</p> -->
		</div>

		<div>
			<span class="text-sm text-gray-500">Reported</span>
			<p class="text-sm mt-1">{getTimeAgo(new Date(incident.createdAt))}</p>
		</div>
	</div>
</div>

<!-- <div class="flex-1 border-t"> -->

	<!-- {#if hasFirstResponders}
		<div class="first-responders-box">
			<div class="responders-header">First Responders</div>
			<div class="responders-status">
				<div class="responders-icon">🚨</div>
				<div class="responders-info">
					<div>First Responders are arriving.</div>
					{#if firstResponderETA}
						<div class="eta">ETA: {firstResponderETA} mins</div>
					{/if}
				</div>
			</div>
		</div>
	{/if} -->
<!-- </div> -->

<style>
	.incident-card {
		background: #e5e5e5;
		border-radius: 8px;
		padding: 1.5rem;
		max-width: 450px;
		font-family:
			system-ui,
			-apple-system,
			sans-serif;
		margin: 2rem auto;
	}

	.header h2 {
		margin: 0 0 0.5rem 0;
		font-size: 1.5rem;
		font-weight: bold;
		color: #000;
	}

	.meta {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		font-size: 0.9rem;
		color: #000;
		margin-bottom: 0.25rem;
	}

	.dot {
		font-weight: bold;
	}

	.witnesses {
		font-size: 0.9rem;
		color: #000;
	}

	.severity-indicator {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		margin: 1rem 0;
	}

	.severity-dot {
		width: 12px;
		height: 12px;
		border-radius: 50%;
	}

	.severity-text {
		font-size: 0.9rem;
		font-weight: 500;
		color: #000;
	}

	.description {
		margin: 1rem 0;
		color: #000;
		line-height: 1.5;
	}

	.incident-type-box {
		background: white;
		border: 2px solid #000;
		border-radius: 12px;
		padding: 1rem;
		display: flex;
		align-items: center;
		gap: 1rem;
		margin: 1rem 0;
	}

	.icon {
		font-size: 2rem;
	}

	.type-info {
		flex: 1;
	}

	.type-name {
		font-size: 1.1rem;
		font-weight: bold;
		color: #000;
	}

	.type-severity {
		font-size: 0.9rem;
		color: #000;
	}

	.first-responders-box {
		background: white;
		border: 2px solid #000;
		border-radius: 12px;
		padding: 1rem;
		margin-top: 1rem;
	}

	.responders-header {
		font-weight: bold;
		margin-bottom: 0.75rem;
		color: #000;
	}

	.responders-status {
		display: flex;
		align-items: center;
		gap: 1rem;
	}

	.responders-icon {
		font-size: 2rem;
	}

	.responders-info {
		flex: 1;
		color: #000;
	}

	.eta {
		font-size: 0.9rem;
		margin-top: 0.25rem;
	}
</style>
