import type { Socket } from "socket.io-client";
import type { Writable } from "svelte/store";

export interface IncidentMessage {
  id: string;
  content: string;
  timestamp: Date;
  userId: string;
  userName: string;
}

export interface IncidentSocket {
  messages: Writable<IncidentMessage[]>;
  sendMessage: (content: string) => void;
  disconnect: () => void;
  socket: Socket;
}
