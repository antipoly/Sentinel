import { json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";
import { db } from "$lib/server/db";
import { incident_comments, user } from "$lib/server/db/schema";
import { eq } from "drizzle-orm";
import { producer } from "$lib/server/kafka/kafka";

export const GET: RequestHandler = async ({ params }) => {
  const { id } = params;

  try {
    const messages = await db
      .select({
        id: incident_comments.id,
        content: incident_comments.content,
        timestamp: incident_comments.timestamp,
        userId: incident_comments.userId,
        userName: user.name,
      })
      .from(incident_comments)
      .leftJoin(user, eq(incident_comments.userId, user.id))
      .where(eq(incident_comments.incidentId, id))
      .orderBy(incident_comments.timestamp);

    return json(messages);
  } catch (error) {
    console.error("Error fetching messages:", error);
    return json({ error: "Failed to fetch messages" }, { status: 500 });
  }
};

export const POST: RequestHandler = async ({ params, request, locals }) => {
  const { id } = params;

  if (!locals.user) {
    return json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { content } = await request.json();

    if (!content) {
      return json({ error: "Message content is required" }, { status: 400 });
    }

    const [message] = await db
      .insert(incident_comments)
      .values({
        id: crypto.randomUUID(),
        incidentId: id,
        userId: locals.user.id,
        content,
        timestamp: new Date(),
      })
      .returning();

    // Fetch the user's name for the response
    const [userData] = await db
      .select({
        name: user.name,
      })
      .from(user)
      .where(eq(user.id, locals.user.id));

    const messageWithUser = {
      ...message,
      userName: userData.name,
    };

    // Send message to Kafka for real-time updates
    await producer.send({
      topic: "chat",
      messages: [
        {
          value: JSON.stringify({
            type: "message",
            ...messageWithUser,
            incidentId: id,
          }),
        },
      ],
    });

    return json(messageWithUser);
  } catch (error) {
    console.error("Error creating message:", error);
    return json({ error: "Failed to create message" }, { status: 500 });
  }
};
