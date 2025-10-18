import bcrypt from "bcrypt";
import { eq } from "drizzle-orm";
import { db } from "$lib/server/db";
import * as schema from "$lib/server/db/schema";

import type { CreateUserDto } from "$lib/server/db/dto";
import { createDTOUser } from "../db/index";

export async function verifyPassword(
  password: string,
  hash: string,
): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

const SALT_ROUNDS = 10;

/**
 * Register a new user using the DTO validation and user creation process.
 * @param input - The user registration data
 * @returns The ID of the newly created user
 * @throws {ValidationError} If the input data fails validation
 * @throws {DuplicateEmailError} If the email is already in use
 */
async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, SALT_ROUNDS);
}

export async function registerUser(input: CreateUserDto) {
  // Hash the password before sending to createDTOUser
  const hashedPassword = await hashPassword(input.password);

  // Create new object with hashed password
  const userDataWithHashedPassword = {
    ...input,
    password: hashedPassword,
  };

  const user = await createDTOUser(userDataWithHashedPassword);
  return user.id;
}

/**
 *
 * @param email
 * @param password
 * @returns
 */
export async function validateUser(email: string, password: string) {
  const [user] = await db
    .select()
    .from(schema.user)
    .where(eq(schema.user.email, email));

  if (!user) {
    return null;
  }

  const isValid = await verifyPassword(password, user.password);
  if (!isValid) {
    return null;
  }

  return user;
}
