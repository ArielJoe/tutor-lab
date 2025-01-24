"use server";

import prisma from "@/app/lib/db";
import { Teacher } from "@/app/lib/interfaces";

interface AddTeacher {
  name: string;
  address: string;
  email: string;
  phone_number: string;
}

/**
 * Menambahkan guru baru ke database.
 * @param data - Objek yang berisi detail guru (nama, alamat, email, nomor telepon).
 * @returns Objek guru yang baru dibuat.
 */
export async function addTeacher(data: AddTeacher) {
  try {
    const teachers = await prisma.teacher.create({
      data: {
        name: data.name,
        address: data.address,
        email: data.email,
        phone_number: data.phone_number,
      },
    });
    return teachers;
  } catch (error) {
    console.error("Failed to add teacher:", error); // Mencetak error ke konsol
    throw new Error("Failed to add teacher"); // Melemparkan error untuk ditangani oleh kode pemanggil
  }
}

/**
 * Mengambil nama guru berdasarkan ID.
 * @param id - ID guru yang akan dicari.
 * @returns Nama guru sebagai string, atau null jika guru tidak ditemukan.
 */
export async function getTeacherNameById(id: number): Promise<string | null> {
  try {
    const teacher = await prisma.teacher.findUnique({
      where: { id },
      select: { name: true },
    });
    return teacher?.name || null;
  } catch (error) {
    console.error("Failed to fetch teacher name by ID:", error); // Mencetak error ke konsol
    throw new Error("Failed to fetch teacher name by ID"); // Melemparkan error untuk ditangani oleh kode pemanggil
  }
}

/**
 * Mengambil semua guru dari database.
 * @returns Array dari objek guru.
 */
export async function getTeachers(): Promise<Teacher[]> {
  try {
    const teachers = await prisma.teacher.findMany();
    return teachers;
  } catch (error) {
    console.error("Failed to fetch teachers:", error); // Mencetak error ke konsol
    throw new Error("Failed to fetch teachers"); // Melemparkan error untuk ditangani oleh kode pemanggil
  }
}

/**
 * Mengambil guru berdasarkan nama.
 * @param name - Nama guru yang akan dicari.
 * @returns Array dari objek guru yang sesuai dengan nama.
 */
export async function getTeachersByName(name: string): Promise<Teacher[]> {
  try {
    return await prisma.teacher.findMany({
      where: {
        name: {
          contains: name, // Mencari guru dengan nama yang mengandung string tertentu
        },
      },
    });
  } catch (error) {
    console.error("Failed to fetch teachers by name:", error); // Mencetak error ke konsol
    throw new Error("Failed to fetch teachers by name"); // Melemparkan error untuk ditangani oleh kode pemanggil
  }
}

/**
 * Memperbarui data guru yang sudah ada.
 * @param data - Objek guru yang akan diperbarui.
 */
export async function updateTeacher(data: Teacher) {
  try {
    await prisma.teacher.update({
      where: { id: data.id },
      data,
    });
  } catch (error) {
    console.error("Failed to update teacher:", error); // Mencetak error ke konsol
    throw new Error("Failed to update teacher"); // Melemparkan error untuk ditangani oleh kode pemanggil
  }
}

/**
 * Menghapus guru dan catatan terkait (kontrak studi) berdasarkan ID.
 * @param id - ID guru yang akan dihapus.
 */
export async function deleteTeacherById(id: number) {
  try {
    // Langkah 1: Mengambil email guru sebelum menghapus
    const teacher = await prisma.teacher.findUnique({
      where: {
        id: id,
      },
      select: {
        email: true,
      },
    });

    if (!teacher) {
      throw new Error("Teacher not found");
    }

    // Langkah 2: Menghapus kontrak studi yang terkait dengan guru
    await prisma.studyContract.deleteMany({
      where: {
        Schedule_Teacher_id: id,
      },
    });

    // Langkah 3: Menghapus guru
    await prisma.teacher.delete({
      where: {
        id: id,
      },
    });

    // Langkah 4: Menghapus user yang terkait menggunakan email
    await prisma.user.deleteMany({
      where: {
        email: teacher.email,
      },
    });
  } catch (error) {
    console.error("Failed to delete teacher:", error); // Mencetak error ke konsol
    throw new Error("Failed to delete teacher"); // Melemparkan error untuk ditangani oleh kode pemanggil
  }
}
