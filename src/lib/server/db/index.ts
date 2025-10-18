import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";
import { env } from "$env/dynamic/private";
import { eq } from "drizzle-orm";
import { createUserDto, type CreateUserDto } from "./dto";
import { ZodError } from "zod";

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
      throw new Error("This email is already in use.");
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

    // Fetch the created user
    const newUser = await db.query.user.findFirst({
      where: eq(schema.user.id, userId),
    });

    if (!newUser) {
      throw new Error("Failed to create user: User not found after insertion");
    }

    return newUser;
  } catch (error) {
    throw error;
  }
}
