import type { Actions, PageServerLoad } from "./$types";
import { fail } from "@sveltejs/kit";
import { db } from "$lib/server/db";
import {
  incident,
  incidentType,
  cautionLevel,
  user,
} from "$lib/server/db/schema";
import { eq } from "drizzle-orm";

export const load: PageServerLoad = async ({ locals }) => {
  try {
    const incidents = await db
      .select({
        id: incident.id,
        type: incident.type,
        severity: incident.severity,
        description: incident.description,
        geolocation: incident.geolocation,
        createdAt: incident.createdAt,
        resolvedAt: incident.resolvedAt,
        author: {
          id: user.id,
          name: user.name,
          email: user.email,
        },
      })
      .from(incident)
      .leftJoin(user, eq(incident.author, user.id));

    return {
      incidents,
      user: locals.user,
    };
  } catch (error) {
    console.error("Error loading incidents:", error);
    return {
      incidents: [],
    };
  }
};

export const actions = {
  createIncident: async ({ request, locals }) => {
    // Check if user is authenticated
    if (!locals.user) {
      return fail(401, {
        message: "You must be logged in to report an incident",
      });
    }
    const data = await request.formData();
    const type = data.get("type")?.toString();
    const severity = data.get("severity")?.toString();
    const description = data.get("description")?.toString();
    const geolocation = data.get("geolocation")?.toString();

    if (!type || !severity || !geolocation) {
      return fail(400, {
        message: "Missing required fields",
      });
    }

    // Validate geolocation format
    const [lat, lng] = geolocation.split(",").map(Number);
    if (Number.isNaN(lat) || Number.isNaN(lng)) {
      return fail(400, {
        message: "Invalid geolocation format",
      });
    }

    const validIncidentType = type as (typeof incidentType.enumValues)[number];
    if (!Object.values(incidentType.enumValues).includes(validIncidentType)) {
      return fail(400, {
        message: "Invalid incident type",
      });
    }

    const validSeverity = severity as (typeof cautionLevel.enumValues)[number];
    if (!Object.values(cautionLevel.enumValues).includes(validSeverity)) {
      return fail(400, {
        message: "Invalid severity level",
      });
    }

    try {
      await db.insert(incident).values({
        id: crypto.randomUUID(),
        type: validIncidentType,
        severity: validSeverity,
        description: description || null,
        geolocation,
        author: locals.user.id,
        createdAt: new Date(),
      });

      return {
        success: true,
      };
    } catch (error) {
      console.error("Error creating incident:", error);
      return fail(500, {
        message: "Failed to create incident. Please try again.",
      });
    }
  },
} satisfies Actions;
