"use server";

import prisma from "@/app/lib/db";
import { Student } from "@/app/lib/interfaces";

interface AddStudent {
  name: string;
  birth_date: Date;
  address: string;
  email: string;
  phone_number: string;
  parents_phone_number: string;
}

/**
 * Menambahkan siswa baru ke database.
 * @param data - Objek yang berisi detail siswa (nama, tanggal lahir, alamat, email, nomor telepon, nomor telepon orang tua).
 * @returns Objek siswa yang baru dibuat.
 */
export async function addStudent(data: AddStudent) {
  try {
    const students = await prisma.student.create({
      data: {
        name: data.name,
        birth_date: data.birth_date,
        address: data.address,
        email: data.email,
        phone_number: data.phone_number,
        parents_phone_number: data.parents_phone_number,
      },
    });
    return students;
  } catch (error) {
    console.error("Failed to add student:", error); // Mencetak error ke konsol
    throw new Error("Failed to add student"); // Melemparkan error untuk ditangani oleh kode pemanggil
  }
}

/**
 * Mengambil semua siswa dari database.
 * @returns Array dari objek siswa.
 */
export async function getStudents(): Promise<Student[]> {
  try {
    const students = await prisma.student.findMany();
    return students;
  } catch (error) {
    console.error("Failed to fetch students:", error); // Mencetak error ke konsol
    throw new Error("Failed to fetch students"); // Melemparkan error untuk ditangani oleh kode pemanggil
  }
}

/**
 * Mengambil siswa berdasarkan nama.
 * @param name - Nama siswa yang akan dicari.
 * @returns Array dari objek siswa yang sesuai dengan nama.
 */
export async function getStudentsByName(name: string): Promise<Student[]> {
  try {
    return await prisma.student.findMany({
      where: {
        name: {
          contains: name, // Mencari siswa dengan nama yang mengandung string tertentu
        },
      },
    });
  } catch (error) {
    console.error("Failed to fetch students by name:", error); // Mencetak error ke konsol
    throw new Error("Failed to fetch students by name"); // Melemparkan error untuk ditangani oleh kode pemanggil
  }
}

/**
 * Memperbarui data siswa yang sudah ada.
 * @param data - Objek siswa yang akan diperbarui.
 */
export async function updateStudent(data: Student) {
  try {
    await prisma.student.update({
      where: { id: data.id },
      data,
    });
  } catch (error) {
    console.error("Failed to update student:", error); // Mencetak error ke konsol
    throw new Error("Failed to update student"); // Melemparkan error untuk ditangani oleh kode pemanggil
  }
}

/**
 * Menghapus siswa dan catatan terkait (kehadiran, kontrak studi, invoice) berdasarkan ID.
 * @param id - ID siswa yang akan dihapus.
 */
export async function deleteStudentById(id: number) {
  try {
    // Langkah 1: Menghapus catatan kehadiran siswa yang terkait
    await prisma.studentAttendance.deleteMany({
      where: {
        StudyContract_Student_id: id,
      },
    });

    // Langkah 2: Menghapus kontrak studi siswa yang terkait
    await prisma.studyContract.deleteMany({
      where: {
        Student_id: id,
      },
    });

    // Langkah 3: Menghapus invoice siswa yang terkait
    await prisma.invoice.deleteMany({
      where: {
        Student_id: id,
      },
    });

    // Langkah 4: Menghapus siswa
    await prisma.student.delete({
      where: {
        id: id,
      },
    });
  } catch (error) {
    console.error("Failed to delete student:", error); // Mencetak error ke konsol
    throw new Error("Failed to delete student"); // Melemparkan error untuk ditangani oleh kode pemanggil
  }
}

/**
 * Mengambil daftar siswa yang terdaftar dalam kursus tertentu berdasarkan ID kursus.
 * Fungsi ini akan mencari semua siswa yang memiliki relasi dengan kursus yang diberikan
 * melalui tabel `Invoice` dan `SelectedCourse`.
 *
 * @param courseId - ID kursus yang akan dicari siswanya.
 * @returns Array dari objek siswa yang terdaftar dalam kursus tersebut.
 *          Setiap objek siswa berisi `id`, `name`, `email`, dan `phone_number`.
 * @throws Error jika terjadi kesalahan saat mengambil data.
 */
export async function getStudentsByCourseId(courseId: number) {
  try {
    // Cari semua siswa yang terdaftar dalam kursus dengan ID yang diberikan
    const students = await prisma.student.findMany({
      where: {
        // Filter siswa berdasarkan relasi di tabel `Invoice` dan `SelectedCourse`
        invoices: {
          some: {
            selectedCourses: {
              some: {
                Course_id: courseId, // Cari siswa yang memiliki `course_id` yang sesuai
              },
            },
          },
        },
      },
      // Pilih field yang akan diambil dari tabel `student`
      select: {
        id: true, // ID siswa
        name: true, // Nama siswa
        email: true, // Email siswa
        phone_number: true, // Nomor telepon siswa
      },
    });

    // Kembalikan daftar siswa yang ditemukan
    return students;
  } catch (error) {
    console.error("Failed to fetch students by course ID:", error);
    throw new Error("Failed to fetch students by course ID"); // Lempar error untuk ditangani oleh pemanggil fungsi
  }
}

/**
 * Mengambil daftar siswa berdasarkan ID jadwal.
 * Fungsi ini akan mencari semua siswa yang terdaftar dalam jadwal tertentu
 * melalui tabel `StudyContract`.
 *
 * @param scheduleId - ID jadwal yang akan dicari siswanya.
 * @returns Array dari objek siswa yang terdaftar dalam jadwal tersebut.
 * @throws Error jika terjadi kesalahan saat mengambil data.
 */
export async function getStudentsByScheduleId(
  scheduleId: number
): Promise<Student[]> {
  try {
    // Ambil semua kontrak studi untuk jadwal yang diberikan
    const studyContracts = await prisma.studyContract.findMany({
      where: {
        Schedule_id: scheduleId, // Filter berdasarkan ID jadwal yang diberikan
      },
    });

    // Ekstrak ID siswa yang unik dari kontrak studi
    const studentIds = studyContracts.map((contract) => contract.Student_id);
    const uniqueStudentIds = [...new Set(studentIds)];

    // Ambil detail siswa untuk ID siswa yang unik
    const students = await prisma.student.findMany({
      where: {
        id: {
          in: uniqueStudentIds,
        },
      },
    });

    return students;
  } catch (error) {
    console.error("Failed to fetch students by schedule ID:", error);
    throw new Error("Failed to fetch students by schedule ID:");
  }
}
