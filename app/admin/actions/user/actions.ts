"use server";

import prisma from "@/app/lib/db";
import { createHash } from "crypto";

// Function to hash a password using SHA256
function hashSHA256(password: string): string {
  return createHash("sha256").update(password).digest("hex");
}

export async function resetPassword(email: string, newPassword: string) {
  // Hash the new password using SHA256
  const hashedPassword = hashSHA256(newPassword);

  // Update the user's password in the database
  await prisma.user.update({
    where: { email },
    data: { password: hashedPassword },
  });
}
