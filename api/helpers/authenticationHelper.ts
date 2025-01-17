import { prisma } from "../config/prismaClient";
import { WorkOS } from "@workos-inc/node";
import { Request, Response } from "express";
import { cookiesDomian } from "../config/endpointConfig";

const workos = new WorkOS(process.env.WORKOS_API_KEY, {
  clientId: process.env.WORKOS_CLIENT_ID,
});

export const saveUser = async (
  name: string,
  id: string,
  profilePictureUrl: string | null
) => {
  try {
    const existingUser = await prisma.user.findUnique({
      where: { id },
    });

    if (existingUser) {
      return existingUser;
    }

    const newUser = await prisma.user.create({
      data: {
        name,
        id,
        profilePictureUrl,
      },
    });

    return newUser;
  } catch (error) {
    throw error;
  }
};

// Refreshes a users session automatically, avoids forcing user to login again
export const refreshSession = async (
  req: Request,
  res: Response,
  next: () => void
) => {
  const session = workos.userManagement.loadSealedSession({
    sessionData: req.cookies["wos-session"],
    cookiePassword: process.env.WORKOS_COOKIE_PASSWORD as string,
  });

  const authResponse = await session.authenticate();

  if (authResponse.authenticated) {
    return next();
  }

  if (
    !authResponse.authenticated &&
    authResponse.reason === "no_session_cookie_provided"
  ) {
    console.log("Redirect #1 attempted");
    return res.redirect("/login");
  }

  // If the session is invalid, attempt to refresh
  try {
    const authResponse = await session.refresh();

    if (!authResponse.authenticated) {
      console.log("Redirect #2 attempted");
      return res.redirect("/login");
    }

    // update the cookie
    res.cookie("wos-session", authResponse.sealedSession, {
      domain: cookiesDomian,
      path: "/",
      httpOnly: false,
      secure: true,
      sameSite: "none",
    });

    // Redirect to the same route to ensure the updated cookie is used
    return res.redirect(req.originalUrl);
  } catch (e) {
    // Failed to refresh access token, redirect user to login page after deleting the cookie
    console.log("Redirect #3 attempted");
    res.clearCookie("wos-session");
    res.redirect("/login");
  }
};

export const validateUser = async (req: Request, res: Response) => {
  const session = workos.userManagement.loadSealedSession({
    sessionData: req.cookies["wos-session"],
    cookiePassword: process.env.WORKOS_COOKIE_PASSWORD as string,
  });

  // Try authenticating the session
  const authResponse = await session.authenticate();

  if (authResponse.authenticated) {
    return authResponse.user;
  }

  // Redirect to login if no session cookie is provided
  if (authResponse.reason === "no_session_cookie_provided") {
    res.redirect("/login");
    throw new Error("No session cookie provided");
  }

  // Attempt to refresh the session if session cookies exist
  try {
    const authResponse = await session.refresh();

    if (!authResponse.authenticated || !authResponse.session) {
      throw new Error("Session refresh failed");
    }

    // Update the cookie with the refreshed session
    res.cookie("wos-session", authResponse.sealedSession, {
      domain: cookiesDomian,
      path: "/",
      httpOnly: false,
      secure: true,
      sameSite: "none",
    });

    return authResponse.session.user;
  } catch (error) {
    res.clearCookie("wos-session");
    res.redirect("/login");
    throw new Error("Unauthorized user");
  }
};
