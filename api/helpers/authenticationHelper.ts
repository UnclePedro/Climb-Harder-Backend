import { prisma } from "../config/prismaClient";
import { WorkOS } from "@workos-inc/node";
import { Request, Response } from "express";
import { backendUrl, cookiesDomian } from "../config/endpointConfig";

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
    return res.status(401).json({ redirectUrl: `${backendUrl}/login` });
  }

  // If the session is invalid, attempt to refresh
  try {
    const authResponse = await session.refresh();

    if (!authResponse.authenticated) {
      return res.status(401).json({ redirectUrl: `${backendUrl}/login` });
    }

    // update the cookie
    res.cookie("wos-session", authResponse.sealedSession, {
      domain: cookiesDomian,
      path: "/",
      httpOnly: false,
      secure: true,
      sameSite: "none",
      expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
    });

    // Redirect to the same route to ensure the updated cookie is used
    return next();
  } catch (error) {
    // Failed to refresh access token, redirect user to login page after deleting the cookie
    res.clearCookie("wos-session");
    return res.status(401).json({ redirectUrl: `${backendUrl}/login` });
  }
};

export const getUser = async (req: Request) => {
  const session = workos.userManagement.loadSealedSession({
    sessionData: req.cookies["wos-session"],
    cookiePassword: process.env.WORKOS_COOKIE_PASSWORD as string,
  });

  const authResponse = await session.authenticate();
  if (authResponse.authenticated) {
    return authResponse.user;
  }

  throw new Error("Unauthenticated user");
};
