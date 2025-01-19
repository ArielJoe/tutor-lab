"use server";

import prisma from "@/app/lib/db";
import { hashSync } from "bcrypt";

export async function resetPassword(email: string, newPassword: string) {
  const hashedPassword = hashSync(newPassword, 10); // Hash the new password

  await prisma.user.update({
    where: { email },
    data: { password: hashedPassword },
  });
}
