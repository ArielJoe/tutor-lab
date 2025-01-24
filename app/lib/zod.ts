import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1, "Password is required"),
});

// Validasi untuk nomor telepon (contoh: +62 atau 08)
const phoneRegex = /^(\+62|0)\d{9,12}$/;

// Skema validasi untuk StudentData
export const studentSchema = z.object({
  name: z
    .string()
    .min(1, "Name is required") // Wajib diisi
    .max(100, "Name must be at most 100 characters"), // Maksimum 100 karakter
  birth_date: z.date(),
  address: z
    .string()
    .min(1, "Address is required") // Wajib diisi
    .max(150, "Address must be at most 150 characters"), // Maksimum 150 karakter
  email: z.string().email("Invalid email address"),
  phone_number: z.string().regex(phoneRegex, "Invalid phone number"),
  parents_phone_number: z.string().regex(phoneRegex, "Invalid phone number"),
});

// Skema validasi untuk TeacherData
export const teacherSchema = z.object({
  name: z
    .string()
    .min(1, "Name is required") // Wajib diisi
    .max(100, "Name must be at most 100 characters"), // Maksimum 100 karakter
  address: z
    .string()
    .min(1, "Address is required") // Wajib diisi
    .max(150, "Address must be at most 150 characters"), // Maksimum 150 karakter
  email: z.string().email("Invalid email address"),
  phone_number: z.string().regex(phoneRegex, "Invalid phone number"),
});

// Skema validasi untuk CourseData
export const courseSchema = z.object({
  course_name: z
    .string()
    .min(1, "Course name is required")
    .max(50, "Course name must be less than 50 characters"),
  description: z
    .string()
    .min(1, "Description is required")
    .max(150, "Description must be less than 150 characters"),
  duration: z.number().min(1, "Duration must be at least 1 hour"),
  price: z.number().min(0, "Price must be at least 0"),
});

// Skema validasi untuk ScheduleData
export const scheduleSchema = z.object({
  day: z.number().min(1, "Day is required"),
  start_time: z
    .string()
    .regex(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, "Time must be in HH:MM format"),
  duration: z.number().min(1, "Duration must be at least 1 hour"),
  Teacher_id: z.number().min(1, "Teacher is required"),
  Course_id: z.number().min(1, "Course is required"),
  Period_id: z.number().default(1), // Ensure Period_id is always 1
});
