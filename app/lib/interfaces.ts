export interface Account {
  id: string;
  userId: string;
  type: string;
  provider: string;
  providerAccountId: string;
  refresh_token?: string;
  access_token?: string;
  expires_at?: number;
  token_type?: string;
  scope?: string;
  id_token?: string;
  session_state?: string;
  user: User; // Assuming User is defined elsewhere
}

export interface Session {
  id: string;
  sessionToken: string;
  userId: string;
  expires: Date;
  user: User; // Assuming User is defined elsewhere
}

export interface User {
  id: string;
  name?: string;
  email?: string;
  emailVerified?: Date;
  image?: string;
  password?: string;
  role: string;
  accounts: Account[];
  sessions: Session[];
}

export interface VerificationToken {
  identifier: string;
  token: string;
  expires: Date;
}

export interface Student {
  id: number;
  name?: string;
  birth_date?: Date;
  address?: string;
  email?: string;
  phone_number?: string;
  parents_phone_number?: string;
  studyContracts: StudyContract[];
  invoices: Invoice[];
  selectedCourses: SelectedCourse[];
}

export interface Teacher {
  id: number;
  name?: string;
  address?: string;
  email?: string;
  phone_number?: string;
  schedules?: Schedule[];
  attendances?: TeacherAttendance[];
}

export interface Course {
  id: number;
  course_name: string;
  description: string;
  duration: number;
  price: number;
  schedules?: Schedule[];
  selectedCourses?: SelectedCourse[];
}

export interface Period {
  id: number;
  name?: string;
  start_date?: Date;
  end_date?: Date;
  schedules: Schedule[];
}

export interface Schedule {
  id: number;
  day?: DayEnum | null;
  start_time?: string;
  duration?: number;
  Period_id: number;
  Teacher_id: string;
  Course_id: number;
}

export interface StudyContract {
  id: number;
  schedule: Schedule; // Assuming Schedule is defined elsewhere
  Schedule_id: number;
  Schedule_Period_id: number;
  Schedule_Teacher_id: number;
  Schedule_Course_id: number;
  student: Student; // Assuming Student is defined elsewhere
  Student_id: number;
  studentAttendances: StudentAttendance[];
}

export interface StudentAttendance {
  id: number;
  excused?: boolean;
  present?: boolean;
  sick?: boolean;
  alpha?: boolean;
  studyContract: StudyContract; // Assuming StudyContract is defined elsewhere
  StudyContract_Schedule_id: number;
  StudyContract_Schedule_Period_id: number;
  StudyContract_Schedule_Teacher_id: number;
  StudyContract_Schedule_Course_id: number;
  StudyContract_Student_id: number;
  Schedule?: Schedule; // Assuming Schedule is defined elsewhere
  scheduleId?: number;
}

export interface TeacherAttendance {
  id: number;
  present?: boolean;
  sick?: boolean;
  alpha?: boolean;
  excused?: boolean;
  schedule: Schedule; // Assuming Schedule is defined elsewhere
  Schedule_id: number;
  Schedule_Period_id: number;
  Schedule_Teacher_id: number;
  Schedule_Course_id: number;
  Teacher?: Teacher; // Assuming Teacher is defined elsewhere
  teacherId?: number;
}

export interface Invoice {
  id: number;
  created_at?: Date;
  due_date?: Date;
  status?: InvoiceStatus;
  amount?: number;
  metode?: PaymentMethod;
  student: Student; // Assuming Student is defined elsewhere
  Student_id: number;
  selectedCourses: SelectedCourse[];
}

export interface SelectedCourse {
  id: number;
  course: Course; // Assuming Course is defined elsewhere
  Course_id: number;
  invoice: Invoice; // Assuming Invoice is defined elsewhere
  Invoice_id: number;
  Invoice_Student_id: number;
  Student?: Student; // Assuming Student is defined elsewhere
  studentId?: number;
}

export enum DayEnum {
  Monday,
  Tuesday,
  Wednesday,
  Thursday,
  Friday,
  Saturday,
}

export enum InvoiceStatus {
  Lunas,
  Belum_Lunas,
}

export enum PaymentMethod {
  Tunai,
  Transfer,
}
