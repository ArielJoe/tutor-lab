export interface User {
  id: string;
  email: string;
  password: string;
  role: string;
}

export interface Student {
  id: number;
  name: string;
  birth_date: Date;
  address: string;
  email: string;
  phone_number: string;
  parents_phone_number: string;
}

export interface Teacher {
  id: number;
  name: string;
  address: string;
  email: string;
  phone_number: string;
}

export interface Course {
  id: number;
  course_name: string;
  description: string;
  duration: number;
  price: number;
}

export interface Period {
  id: number;
  name: string;
  start_date: Date;
  end_date: Date;
}

export interface Log {
  id: number;
  table_name: string;
  action: string;
  record_id: number;
  change_details: string;
  changed_at: string;
}

export interface Schedule {
  [x: string]: any;
  id: number;
  day: number;
  start_time: string;
  duration: number;
  Period_id: number;
  Teacher_id: number;
  Course_id: number;
}

export interface StudyContract {
  id: number;
  Schedule_id: number;
  Schedule_Period_id: number;
  Schedule_Teacher_id: number;
  Schedule_Course_id: number;
  Student_id: number;
}

export interface StudentAttendance {
  id: number;
  date_time: Date;
  status: number;
  Study_Contract_Schedule_id: number;
  Study_Contract_Schedule_Period_id: number;
  Study_Contract_Schedule_Teacher_id: number;
  Study_Contract_Schedule_Course_id: number;
  Study_Contract_Student_id: number;
  Schedule_id: number;
}

export interface TeacherAttendance {
  id: number;
  date_time: Date;
  status: number;
  Schedule_id: number;
  Schedule_Period_id: number;
  Schedule_Teacher_id: number;
  Schedule_Course_id: number;
  Teacher_id: number;
}

export interface Invoice {
  id: number;
  created_at: Date;
  due_date: Date;
  status: string;
  amount: number;
  method: string;
  Student_id: number;
}

export interface SelectedCourse {
  id: number;
  Course_id: number;
  Invoice_id: number;
}
