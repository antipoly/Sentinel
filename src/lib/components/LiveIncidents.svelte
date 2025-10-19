<script lang="ts">
import type { Incident } from "$lib/server/db/schema";
import Button from "./ui/button.svelte";
import { formatRelativeTime } from "$lib/utils";

const { onClose = (): void => {}, incidents = [] } = $props<{
  onClose?: () => void;
  incidents: Incident[];
}>();
</script>

<div class="h-full w-96 bg-white shadow-lg p-4">
	<div class="flex justify-between items-center mb-4">
		<h2 class="text-xl font-semibold">Live Incidents</h2>
		<Button variant="ghost" size="sm" onclick={onClose}>✕</Button>
	</div>

	<div class="space-y-4">
		{#each incidents as incident (incident.id)}
			<div class="p-4 border rounded-lg hover:bg-gray-50 cursor-pointer">
				<div class="font-medium">{incident.type}</div>
				<div class="text-sm text-gray-600">
					{formatRelativeTime(new Date(incident.createdAt))}
				</div>
				<div class="text-sm text-gray-500 mt-1 line-clamp-2">
					{incident.description}
				</div>
			</div>
		{/each}

		{#if incidents.length === 0}
			<div class="text-center text-gray-500 py-8">No active incidents</div>
		{/if}
	</div>
</div>
