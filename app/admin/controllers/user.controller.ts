"use server";

import prisma from "@/app/lib/db";
import { createHash } from "crypto";

// Fungsi untuk menghash password menggunakan SHA256
function hashSHA256(password: string): string {
  return createHash("sha256").update(password).digest("hex");
}

/**
 * Mereset password pengguna.
 * @param email - Email pengguna yang akan direset password-nya.
 * @param newPassword - Password baru yang akan dihash dan disimpan.
 */
export async function resetPassword(email: string, newPassword: string) {
  try {
    // Hash password baru menggunakan SHA256
    const hashedPassword = hashSHA256(newPassword);

    // Memperbarui password pengguna di database
    await prisma.user.update({
      where: { email },
      data: { password: hashedPassword },
    });
  } catch (error) {
    console.error("Failed to reset password:", error); // Mencetak error ke konsol
    throw new Error("Failed to reset password"); // Melemparkan error untuk ditangani oleh kode pemanggil
  }
}
