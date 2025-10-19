import type { Actions, PageServerLoad } from "./$types";
import { fail } from "@sveltejs/kit";
import { db } from "$lib/server/db";
import { incident, incidentType, cautionLevel } from "$lib/server/db/schema";

export const load: PageServerLoad = async () => {
  try {
    const incidents = await db.select().from(incident);
    return {
      incidents
    };
  } catch (error) {
    console.error("Error loading incidents:", error);
    return {
      incidents: []
    };
  }
};

export const actions = {
  createIncident: async ({ request }) => {
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
    const [lat, lng] = geolocation.split(',').map(Number);
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
        activeStatus: "Active",
        timestamp: new Date(),
      });
      
      return {
        success: true
      };
    } catch (error) {
      console.error("Error creating incident:", error);
      return fail(500, {
        message: "Failed to create incident. Please try again.",
      });
    }
  },
} satisfies Actions;