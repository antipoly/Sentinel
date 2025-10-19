<script lang="ts">
	import { onMount, onDestroy } from "svelte";
	import Button from "./ui/button.svelte";
	import type { Incident } from "$lib/server/db/schema";
	import { createIncidentSocket } from "$lib/socket";
	import type { IncidentMessage, IncidentSocket } from "$lib/socket.types";

	const { incident } = $props() as { incident: Incident };
	let messages = $state<IncidentMessage[]>([]);
	let messageInput = $state("");
	let chatContainer: HTMLDivElement;
	let incidentSocket = $state<IncidentSocket | null>(null);

	onMount(() => {
		incidentSocket = createIncidentSocket(incident.id);

		// Subscribe to messages
		const unsubscribe = incidentSocket.messages.subscribe((newMessages) => {
			messages = newMessages;
			scrollToBottom();
		});

		// Load initial messages
		loadMessages();

		return () => {
			unsubscribe();
			if (incidentSocket) {
				incidentSocket.disconnect();
			}
		};
	});

	onDestroy(() => {
		if (incidentSocket) {
			incidentSocket.disconnect();
		}
	});

	async function loadMessages() {
		try {
			const response = await fetch(`/api/incidents/${incident.id}/messages`);
			if (response.ok) {
				const data = await response.json();
				incidentSocket?.messages.set(data);
				messages = data;
				scrollToBottom();
			}
		} catch (error) {
			console.error("Error loading messages:", error);
		}
	}

	function scrollToBottom() {
		if (chatContainer) {
			setTimeout(() => {
				chatContainer.scrollTop = chatContainer.scrollHeight;
			}, 0);
		}
	}
</script>

<div class="flex flex-col h-full">
	<div class="flex-1 overflow-y-auto p-4 space-y-4" bind:this={chatContainer}>
		{#each messages as message (message.id)}
			<div
				class="flex flex-col {message.userId === incident.author
					? 'items-end'
					: 'items-start'}"
			>
				<div
					class="{message.userId === incident.author
						? 'bg-blue-100'
						: 'bg-gray-100'} rounded-lg px-4 py-2 max-w-[80%]"
				>
					<div class="text-sm font-medium">{message.userName}</div>
					<div class="text-gray-700">{message.content}</div>
					<div class="text-xs text-gray-500 mt-1">
						{new Date(message.timestamp).toLocaleTimeString()}
					</div>
				</div>
			</div>
		{/each}
	</div>

	<form
		class="border-t p-4"
		onsubmit={(e) => {
			e.preventDefault();
			if (!messageInput.trim()) return;

			incidentSocket?.sendMessage(messageInput);
			messageInput = "";
		}}
	>
		<div class="flex gap-2">
			<input
				type="text"
				bind:value={messageInput}
				placeholder="Type a message..."
				class="flex-1 rounded-lg border px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
			/>
			<Button type="submit" variant="secondary">Send</Button>
		</div>
	</form>
</div>
