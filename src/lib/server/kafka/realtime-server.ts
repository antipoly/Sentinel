import { Server } from "socket.io";
import { producer, consumer, connectKafka } from "./kafka";

let io: Server;

import type { Server as HttpServer } from "http";

export function initializeSocketIO(server: HttpServer) {
  io = new Server(server, {
    path: "/incident-chat",
    transports: ["websocket", "polling"],
  });

  io.on("connection", (socket) => {
    console.log("Client connected");
    const { incidentId } = socket.handshake.query;

    if (typeof incidentId !== "string") {
      socket.disconnect();
      return;
    }

    // Join the incident-specific room
    socket.join(`incident:${incidentId}`);

    socket.on("send_message", async ({ content }) => {
      // Produce message to Kafka
      await producer.send({
        topic: "chat",
        messages: [
          {
            value: JSON.stringify({
              type: "message",
              incidentId,
              content,
              userId: socket.id,
              timestamp: new Date().toISOString(),
            }),
          },
        ],
      });
    });

    socket.on("disconnect", () => {
      if (typeof incidentId === "string") {
        socket.leave(`incident:${incidentId}`);
      }
      console.log("Client disconnected");
    });
  });

  // Initialize Kafka and start consuming messages
  connectKafka().then(() => {
    consumer.run({
      eachMessage: async ({ message }) => {
        if (message.value) {
          const msg = JSON.parse(message.value.toString());
          // Broadcast message to the specific incident room
          if (msg.incidentId) {
            io.to(`incident:${msg.incidentId}`).emit("message", msg);
          }
        }
      },
    });
  });

  return io;
}
