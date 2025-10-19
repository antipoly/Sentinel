import { io } from "socket.io-client";
import { writable, type Writable } from "svelte/store";
import type { IncidentMessage, IncidentSocket } from "./socket.types";

export const createIncidentSocket = (incidentId: string): IncidentSocket => {
  const messages: Writable<IncidentMessage[]> = writable([]);
  const socket = io("/incident-chat", {
    query: { incidentId },
    transports: ["websocket", "polling"],
    autoConnect: true,
  });

  // Message handling
  socket.on("message", (message: IncidentMessage) => {
    messages.update((msgs: IncidentMessage[]) => [...msgs, message]);
  });

  const sendMessage = (content: string) => {
    socket.emit("send_message", { incidentId, content });
  };

  const disconnect = () => {
    socket.disconnect();
  };

  return {
    messages,
    sendMessage,
    disconnect,
    socket,
  };
};
