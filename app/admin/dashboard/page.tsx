"use client";

import { GraduationCap, User } from "lucide-react";
import Navbar from "../../components/Navbar";
import { getStudent } from "../actions/student/actions";
import { useEffect, useState } from "react";
import Chart from "../../components/LineChart";
import { getTeacher } from "../actions/teacher/actions";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";

interface Student {
  id: number;
  name: string | null;
  birth_date: Date | null;
  address: string | null;
  email: string | null;
  phone_number: string | null;
}

interface Teacher {
  id: number;
  name: string | null;
  address: string | null;
  email: string | null;
  phone_number: string | null;
}

export default function Dashboard() {
  const [students, setStudents] = useState<Student[]>([]);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [isSheetOpen, setIsSheetOpen] = useState(false); // State to control the sheet

  useEffect(() => {
    const fetchData = async () => {
      const studentData = await getStudent();
      const teacherData = await getTeacher();
      setStudents(studentData);
      setTeachers(teacherData);
    };

    fetchData();
  }, []);

  return (
    <div>
      <Navbar title="Dashboard" />
      <div className="w-full flex p-5 gap-5">
        {/* Chart Section */}
        <div className="w-[50%] grid gap-5">
          <Chart />
          <Button onClick={() => setIsSheetOpen(true)}>View Schedule</Button>
        </div>

        {/* Stats Section */}
        <div className="w-[50%] flex flex-col gap-5">
          {/* Students Card */}
          <div className="flex justify-between items-center border border-primary rounded-md p-4 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3">
              <User className="text-primary" size={24} />
              <p className="text-lg font-semibold">Students</p>
            </div>
            <p className="text-2xl font-bold">{students.length}</p>
          </div>

          {/* Teachers Card */}
          <div className="flex justify-between items-center border border-primary rounded-md p-4 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3">
              <GraduationCap className="text-primary" size={24} />
              <p className="text-lg font-semibold">Teachers</p>
            </div>
            <p className="text-2xl font-bold">{teachers.length}</p>
          </div>
        </div>
      </div>

      {/* Top Sheet for Schedule */}
      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetContent side="top" className="h-[80vh]">
          <SheetHeader>
            <SheetTitle>Schedule</SheetTitle>
            <SheetDescription>
              View your schedule here. Click outside or press ESC to close.
            </SheetDescription>
          </SheetHeader>
          <div className="mt-4">
            {/* Add your schedule content here */}
            <p>This is where the schedule will be displayed.</p>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
