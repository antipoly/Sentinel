// import { Server } from "socket.io";
// import { producer, consumer, connectKafka } from "./kafka";

// let io: Server;

// export function initializeSocketIO(server: any) {
//   io = new Server(server);

//   io.on("connection", (socket) => {
//     console.log("Client connected");

//     socket.on("incident", async (message: string) => {
//       // Produce message to Kafka
//       await producer.send({
//         topic: "chat",
//         messages: [
//           {
//             value: JSON.stringify({
//               message,
//               userId: socket.id,
//               timestamp: new Date().toISOString(),
//             }),
//           },
//         ],
//       });
//     });

//     socket.on("disconnect", () => {
//       console.log("Client disconnected");
//     });
//   });

//   // Initialize Kafka and start consuming messages
//   connectKafka().then(() => {
//     consumer.run({
//       eachMessage: async ({ message }) => {
//         if (message.value) {
//           // Broadcast message to all connected clients
//           io.emit("incident", JSON.parse(message.value.toString()));
//         }
//       },
//     });
//   });

//   return io;
// }
