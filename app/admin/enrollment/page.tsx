"use client";

import Navbar from "@/app/components/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { addStudent } from "../actions/student/actions";
import { addTeacher } from "../actions/teacher/actions";
import { toast } from "@/hooks/use-toast";
import { registerCredentials } from "@/app/lib/loginAndRegister";

interface StudentData {
  name: string;
  birth_date: Date;
  address: string;
  email: string;
  phone_number: string;
  parents_phone_number: string;
}

interface TeacherData {
  name: string;
  address: string;
  email: string;
  phone_number: string;
}

const StudentForm = ({
  studentData,
  handleStudentChange,
  handleStudentSubmit,
  formatDateForInput,
}: {
  studentData: StudentData;
  handleStudentChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  handleStudentSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  formatDateForInput: (date: Date) => string;
}) => (
  <form
    onSubmit={handleStudentSubmit}
    className="grid gap-6 w-full max-w-2xl mx-auto p-6 rounded-lg"
  >
    <div className="grid grid-cols-1 gap-4">
      <div className="space-y-2">
        <Label htmlFor="student-name">Name</Label>
        <Input
          id="name"
          value={studentData.name}
          onChange={handleStudentChange}
          className="w-full"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="birth_date">Birth Date</Label>
        <Input
          id="birth_date"
          value={formatDateForInput(studentData.birth_date)}
          onChange={handleStudentChange}
          className="w-full"
          type="date"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="student-address">Address</Label>
        <Textarea
          id="address"
          value={studentData.address}
          onChange={handleStudentChange}
          className="w-full max-h-[100px]"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="student-email">Email</Label>
        <Input
          id="email"
          value={studentData.email}
          onChange={handleStudentChange}
          className="w-full"
          type="email"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="student-phone">Phone Number</Label>
        <Input
          id="phone_number"
          value={studentData.phone_number}
          onChange={handleStudentChange}
          className="w-full"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="parents_phone_number">Parents Phone Number</Label>
        <Input
          id="parents_phone_number"
          value={studentData.parents_phone_number}
          onChange={handleStudentChange}
          className="w-full"
        />
      </div>
    </div>
    <div className="flex justify-end">
      <Button type="submit" className="w-fit bg-primary hover:bg-primary/90">
        Add Student
      </Button>
    </div>
  </form>
);

const TeacherForm = ({
  teacherData,
  handleTeacherChange,
  handleTeacherSubmit,
}: {
  teacherData: TeacherData;
  handleTeacherChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  handleTeacherSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
}) => (
  <form
    onSubmit={handleTeacherSubmit}
    className="grid gap-6 w-full max-w-2xl mx-auto p-6 rounded-lg"
  >
    <div className="grid grid-cols-1 gap-4">
      <div className="space-y-2">
        <Label htmlFor="teacher-name">Name</Label>
        <Input
          id="name"
          value={teacherData.name}
          onChange={handleTeacherChange}
          className="w-full"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="teacher-address">Address</Label>
        <Textarea
          id="address"
          value={teacherData.address}
          onChange={handleTeacherChange}
          className="w-full max-h-[100px]"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="teacher-email">Email</Label>
        <Input
          id="email"
          value={teacherData.email}
          onChange={handleTeacherChange}
          className="w-full"
          type="email"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="teacher-phone">Phone Number</Label>
        <Input
          id="phone_number"
          value={teacherData.phone_number}
          onChange={handleTeacherChange}
          className="w-full"
        />
      </div>
    </div>
    <div className="flex justify-end">
      <Button type="submit" className="w-fit bg-primary hover:bg-primary/90">
        Add Teacher
      </Button>
    </div>
  </form>
);

export default function Enrollment() {
  const [activeForm, setActiveForm] = useState<"student" | "teacher">(
    "student"
  );

  const [studentData, setStudentData] = useState<StudentData>({
    name: "",
    birth_date: new Date(),
    address: "",
    email: "",
    phone_number: "",
    parents_phone_number: "",
  });

  const [teacherData, setTeacherData] = useState<TeacherData>({
    name: "",
    address: "",
    email: "",
    phone_number: "",
  });

  const handleStudentChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { id, value } = e.target;

    if (id === "birth_date") {
      setStudentData((prev) => ({
        ...prev,
        [id]: new Date(value + "T00:00:00.000Z"),
      }));
    } else {
      setStudentData((prev) => ({
        ...prev,
        [id]: value,
      }));
    }
  };

  const handleTeacherChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { id, value } = e.target;
    setTeacherData((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const handleStudentSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const submissionData = {
        ...studentData,
        birth_date: new Date(studentData.birth_date),
      };

      await addStudent(submissionData);
      await registerCredentials(
        submissionData.name,
        submissionData.email,
        "student",
        "123456"
      );
      toast({
        description: "New student added",
        className: "bg-green-900",
      });

      setStudentData({
        name: "",
        birth_date: new Date(),
        address: "",
        email: "",
        phone_number: "",
        parents_phone_number: "",
      });
    } catch (error) {
      console.error("Error adding student:", error);
    }
  };

  const handleTeacherSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await addTeacher(teacherData);
      await registerCredentials(
        teacherData.name,
        teacherData.email,
        "teacher",
        "123456"
      );
      toast({
        description: "New teacher added",
        className: "bg-green-900",
      });

      setTeacherData({
        name: "",
        address: "",
        email: "",
        phone_number: "",
      });
    } catch (error) {
      console.error("Error adding teacher:", error);
    }
  };

  const formatDateForInput = (date: Date) => {
    return date.toISOString().split("T")[0];
  };

  return (
    <>
      <div>
        <Navbar title="Enrollment" />
      </div>
      <div className="p-5">
        <div className="flex gap-4 mb-6">
          <Button
            onClick={() => setActiveForm("student")}
            variant={activeForm === "student" ? "default" : "outline"}
          >
            Student Form
          </Button>
          <Button
            onClick={() => setActiveForm("teacher")}
            variant={activeForm === "teacher" ? "default" : "outline"}
          >
            Teacher Form
          </Button>
        </div>
        <div className="flex justify-center">
          {activeForm === "student" ? (
            <StudentForm
              studentData={studentData}
              handleStudentChange={handleStudentChange}
              handleStudentSubmit={handleStudentSubmit}
              formatDateForInput={formatDateForInput}
            />
          ) : (
            <TeacherForm
              teacherData={teacherData}
              handleTeacherChange={handleTeacherChange}
              handleTeacherSubmit={handleTeacherSubmit}
            />
          )}
        </div>
      </div>
    </>
  );
}
