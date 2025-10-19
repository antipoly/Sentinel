// import { Kafka, type Producer, type Consumer } from "kafkajs";
// import { env } from "$env/dynamic/private";

// if (!env.KAFKA_BROKERS) {
//   throw new Error("KAFKA_BROKERS environment variable is not set");
// }

// const kafka = new Kafka({
//   clientId: "sentinel-incident-sync",
//   brokers: env.KAFKA_BROKERS.split(","),
// });

// export const producer: Producer = kafka.producer();
// export const consumer: Consumer = kafka.consumer({
//   groupId: "sentinel-incident-group",
// });

// // Topic for incident location updates
// export const INCIDENT_LOCATION_TOPIC = "incident-location-updates";

// // Connect both producer and consumer
// export async function connectKafka() {
//   try {
//     await producer.connect();
//     await consumer.connect();

//     // Subscribe to the incident location topic
//     await consumer.subscribe({
//       topic: INCIDENT_LOCATION_TOPIC,
//       fromBeginning: false,
//     });

//     console.log("Successfully connected to Kafka");
//   } catch (error) {
//     console.error("Failed to connect to Kafka:", error);
//     throw error;
//   }
// }

// // Disconnect both producer and consumer
// export async function disconnectKafka() {
//   try {
//     await producer.disconnect();
//     await consumer.disconnect();
//     console.log("Successfully disconnected from Kafka");
//   } catch (error) {
//     console.error("Failed to disconnect from Kafka:", error);
//     throw error;
//   }
// }

// // Send incident location update
// export async function sendIncidentLocationUpdate(
//   incidentId: string,
//   latitude: number,
//   longitude: number,
// ) {
//   try {
//     await producer.send({
//       topic: INCIDENT_LOCATION_TOPIC,
//       messages: [
//         {
//           key: incidentId,
//           value: JSON.stringify({
//             incidentId,
//             latitude,
//             longitude,
//             timestamp: new Date().toISOString(),
//           }),
//         },
//       ],
//     });
//   } catch (error) {
//     console.error("Failed to send incident location update:", error);
//     throw error;
//   }
// }
