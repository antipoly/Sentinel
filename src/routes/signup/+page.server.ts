import { fail, redirect } from "@sveltejs/kit";
import type { Actions } from "./$types";
import { registerUser } from "$lib/server/auth/utils";
import {
  generateSessionToken,
  createSession,
  setSessionTokenCookie,
} from "$lib/server/auth";
import type { UserType } from "$lib/server/db/schema";
import { ZodError } from "zod";
import { DuplicateEmailError } from "$lib/server/db";

export const actions: Actions = {
  default: async (event) => {
    const formData = await event.request.formData();
    const email = formData.get("email")?.toString();
    const phoneNumber = formData.get("phoneNumber")?.toString();
    const password = formData.get("password")?.toString();
    const name = formData.get("name")?.toString();
    const dob = formData.get("dob")
      ? new Date(String(formData.get("dob")))
      : null;
    // const type = formData.get("type")?.toString() as UserType;

    if (!email || !password || !name || !dob || !phoneNumber) {
      return fail(400, { message: "All fields are required." });
    }

    try {
      const userId = await registerUser({
        email,
        password,
        name,
        dob,
        phoneNumber,
        type: "Standard" as UserType,
      });

      // Create session
      const token = generateSessionToken();
      const session = await createSession(token, userId);

      // Set session cookie
      setSessionTokenCookie(event, token, session.expiresAt);

      return redirect(303, "/");
    } catch (error) {
      if (error instanceof ZodError) {
        // Zod errors include issues with detailed messages; fall back to error.message
        const message =
          (error as ZodError).issues?.[0]?.message ?? error.message;
        return fail(400, { message });
      }
      if (error instanceof DuplicateEmailError) {
        return fail(400, { message: error.message });
      }

      // Unexpected server error — log and return 500
      console.error("Signup error:", error);
      return fail(500, {
        message: "Could not create account. Please try again.",
      });
    }
  },
};
