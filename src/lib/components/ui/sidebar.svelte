<script lang="ts">
import Button from "./button.svelte";
import LiveIncidents from "$lib/components/LiveIncidents.svelte";
import type { Incident } from "$lib/server/db/schema";

const { incidents = [], user } = $props<{
  incidents: Incident[];
  user: { id: string; email: string | null } | null;
}>();

let showLiveIncidents = $state(false);

function toggleLiveIncidents() {
  showLiveIncidents = !showLiveIncidents;
}

function closeLiveIncidents() {
  showLiveIncidents = false;
}
</script>

<div class="flex h-screen">
	<div class="w-96 pl-8 pr-5 py-5 bg-gray-100">
		<span class="font-black font-display text-3xl">Sentinel Alert</span>

		<div class="flex flex-col justify-between h-[95%]">
			<div class="mt-20 flex flex-col gap-6">
				<button
					class="text-xl font-semibold text-left rounded-xl cursor-pointer"
					onclick={toggleLiveIncidents}>Live Incidents</button
				>
				<button
					class="text-xl font-semibold text-left rounded-xl cursor-pointer"
					>First Responders</button
				>
			</div>

			<div class="flex flex-col-reverse gap-3">
				{#if user}
					<div class="flex items-center gap-2 text-gray-600">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							class="h-5 w-5"
							viewBox="0 0 20 20"
							fill="currentColor"
						>
							<path
								fill-rule="evenodd"
								d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
								clip-rule="evenodd"
							/>
						</svg>
						<span>Profile</span>
					</div>
				{/if}

				<a href="/settings" class="text-gray-600 hover:text-gray-800">Settings</a>
				<a href="/about" class="text-gray-600 hover:text-gray-800">About Sentinel</a>
			</div>
		</div>
	</div>

	<slot />

	{#if showLiveIncidents}
		<LiveIncidents onClose={closeLiveIncidents} {incidents} />
	{/if}
</div>

<style>
</style>
