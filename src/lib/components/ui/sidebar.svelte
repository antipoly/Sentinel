<script lang="ts">
	import Button from "./button.svelte";
</script>

<div class="flex h-screen">
	<div class="w-96 pl-8 pr-5 py-5 bg-gray-100">
		<span class="font-black font-display text-3xl">Welcome to Sentinel</span>

		<div class="flex flex-col justify-between h-[80%]">
			<div class="mt-10 flex flex-col gap-6">
				<Button variant="secondary">Live Incidents</Button>
				<Button size="default">First Responders</Button>
			</div>

			<div class="flex gap-3">
				<span>Profile</span>
			</div>
		</div>
	</div>

	<slot />
</div>

<style>
</style>
