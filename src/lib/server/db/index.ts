import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";
import { env } from "$env/dynamic/private";
import { eq } from "drizzle-orm";
import {
  createUserDto,
  type CreateUserDto,
  createIncidentDto,
  type CreateIncidentDto,
} from "./dto";
import { ZodError } from "zod";

export class DuplicateEmailError extends Error {
  constructor(message = "This email is already in use.") {
    super(message);
    this.name = "DuplicateEmailError";
  }
}

if (!env.DATABASE_URL) throw new Error("DATABASE_URL is not set");

const client = postgres(env.DATABASE_URL);

export const db = drizzle(client, { schema });

/**
 * Creates a new user using the CreateUserDto for validation.
 *
 * @param data - The user data conforming to CreateUserDto
 * @throws {ValidationError} If the data fails validation
 * @throws {DuplicateEmailError} If the email is already in use
 * @returns The created user without the password
 */
export async function createDTOUser(data: CreateUserDto): Promise<schema.User> {
  try {
    // Validate the input data using the DTO
    const validatedData = createUserDto.parse(data);

    // Check for existing email
    const existingUser = await db.query.user.findFirst({
      where: eq(schema.user.email, validatedData.email),
      columns: {
        id: true,
      },
    });

    if (existingUser) {
      throw new DuplicateEmailError();
    }

    // Create the user
    const userId = crypto.randomUUID();
    await db.insert(schema.user).values({
      id: userId,
      email: validatedData.email,
      password: validatedData.password,
      name: validatedData.name,
      phoneNumber: validatedData.phoneNumber,
      dob: validatedData.dob,
      type: validatedData.type,
    });

    // Get the created user
    const user = await db.query.user.findFirst({
      where: eq(schema.user.id, userId),
    });

    if (!user) {
      throw new Error("Failed to create user");
    }

    return user;
  } catch (error) {
    // Rethrow Zod errors so callers can detect validation failures and
    // return a 400 response instead of treating them as 500 server errors.
    if (error instanceof ZodError) {
      throw error;
    }
    throw error;
  }
}

/**
 * Creates a new incident using the CreateIncidentDto for validation.
 *
 * @param data - The incident data conforming to CreateIncidentDto
 * @throws {ValidationError} If the data fails validation
 * @returns The created incident
 */
export async function createDTOIncident(
  data: CreateIncidentDto,
  authorId: string,
): Promise<schema.Incident> {
  try {
    // Validate the input data using the DTO
    const validatedData = createIncidentDto.parse(data);

    const incidentId = crypto.randomUUID();
    // Create the incident
    await db.insert(schema.incident).values({
      id: incidentId,
      type: validatedData.type,
      severity: validatedData.severity,
      description: validatedData.description || null,
      geolocation: `${validatedData.latitude},${validatedData.longitude}`,
      author: authorId,
      resolvedAt: null,
    });

    // Get the created incident
    const incident = await db.query.incident.findFirst({
      where: eq(schema.incident.id, incidentId),
    });

    if (!incident) {
      throw new Error("Failed to create incident");
    }

    return incident;
  } catch (error) {
    if (error instanceof ZodError) {
      throw error;
    }
    throw error;
  }
}
