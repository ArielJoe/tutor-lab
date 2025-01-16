"use server";

import { hashSync } from "bcrypt";
import prisma from "./db";
import { loginSchema } from "./zod";
import { signIn } from "../auth";
import { AuthError } from "next-auth";

const SALT_ROUNDS = 10;

export const registerCredentials = async (
  name: string,
  email: string,
  role: string,
  password: string
) => {
  try {
    // Basic validation
    if (!name || !email || !password || !role) {
      throw new Error("Missing required fields");
    }

    // Hash the password
    const hashedPassword = hashSync(password, SALT_ROUNDS);

    // Create the user in the database
    const user = await prisma.user.create({
      data: {
        name: name,
        email: email,
        password: hashedPassword,
        role: "admin",
      },
    });

    return { success: true, user };
  } catch (error) {
    if (error instanceof Error) {
      return { success: false, error: error.message };
    }
    return { success: false, error: "Something went wrong" };
  }
};

export const loginCredentials = async (
  prevState: unknown,
  formData: FormData
) => {
  const validatedFields = loginSchema.safeParse(
    Object.fromEntries(formData.entries())
  );

  if (!validatedFields.success) {
    return {
      error: validatedFields.error.flatten().fieldErrors,
    };
  }

  const { email, password } = validatedFields.data;
  const user = await prisma.user.findUnique({
    where: { email },
    select: { role: true },
  });

  if (!user) {
    return { message: "User not found" };
  }

  let redirectTo = "/admin";
  switch (user.role) {
    case "student":
      redirectTo = "/student";
      break;
    case "teacher":
      redirectTo = "/teacher";
      break;
  }

  try {
    await signIn("credentials", {
      email,
      password,
      redirectTo: redirectTo,
    });
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return { message: "Email or Password not found" };
        default:
          return { message: "Email or Password is wrong" };
      }
    }
    throw error;
  }
};
