import { fail, redirect,  } from "@sveltejs/kit";
import type { Actions } from "./$types";
import { validateUser } from "$lib/server/auth/utils";
import {
  generateSessionToken,
  createSession,
  setSessionTokenCookie,
} from "$lib/server/auth";

export const actions: Actions = {
  default: async (event) => {
    const formData = await event.request.formData();
    const email = formData.get("email")?.toString();
    const password = formData.get("password")?.toString();

    if (!email || !password) {
      return fail(400, { message: "Email and password are required" });
    }

    try {
      const user = await validateUser(email, password);

      if (!user) {
        return fail(401, { message: "Invalid email or password" });
      }

      // Create session
      const token = generateSessionToken();
      const session = await createSession(token, user.id);

      // Set session cookie
      setSessionTokenCookie(event, token, session.expiresAt);

      return redirect(303, "/");
    } catch (error) {
      console.error("Login error:", error);
      return fail(500, { message: "Could not log in. Please try again." });
    }
  },
};
