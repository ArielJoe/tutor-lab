"use client";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState, useEffect } from "react";
import { getCourses } from "../actions/course/actions";
import { getTeacher } from "../actions/teacher/actions";
import { Course, Teacher, Student } from "@/app/lib/interfaces";
import { getStudent } from "../actions/student/actions";
import { createSchedule } from "../actions/schedule/actions";
import { createStudyContract } from "../actions/study_contract/actions";

export function ManageCourse({ studentId }: { studentId: string }) {
  const [open, setOpen] = useState(false);
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedCourse, setSelectedCourse] = useState("");
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [selectedTeacher, setSelectedTeacher] = useState("");

  const [day, setDay] = useState("");
  const [startTime, setStartTime] = useState("");
  const [duration, setDuration] = useState<number>(0);

  // Fetch courses
  useEffect(() => {
    const loadCourses = async () => {
      try {
        const coursesData = await getCourses();
        setCourses(coursesData);
      } catch (error) {
        console.error("Failed to load courses:", error);
      }
    };

    loadCourses();
  }, []);

  // Fetch teachers
  useEffect(() => {
    const loadTeachers = async () => {
      try {
        const teachersData = await getTeacher();

        const transformedTeachers = teachersData.map((teacher: any) => ({
          ...teacher,
          name: teacher.name || null,
          address: teacher.address || null,
          email: teacher.email || null,
          phone_number: teacher.phone_number || null,
        }));
        setTeachers(transformedTeachers);
      } catch (error) {
        console.error("Failed to load teachers:", error);
      }
    };

    loadTeachers();
  }, []);

  const handleSaveSchedule = async () => {
    const scheduleData = {
      day: day as string,
      start_time: startTime,
      duration: duration,
      Period_id: 1,
      Teacher_id: parseInt(selectedTeacher),
      Course_id: parseInt(selectedCourse),
    };

    try {
      // Create the schedule
      const newSchedule: any = await createSchedule(scheduleData);
      console.log("Schedule saved successfully:", newSchedule);

      // Create a study contract linking the schedule to the selected student

      const studyContractData = {
        Schedule_id: newSchedule.id,
        Schedule_Period_id: newSchedule.Period_id,
        Schedule_Teacher_id: newSchedule.Teacher_id,
        Schedule_Course_id: newSchedule.Course_id,
        Student_id: parseInt(studentId),
      };

      await createStudyContract(studyContractData);
      console.log("Study contract saved successfully");

      setOpen(false); // Close the sheet after saving
    } catch (error) {
      console.error("Error saving schedule or study contract:", error);
    }
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <DropdownMenuItem
          className="cursor-pointer"
          onSelect={(e) => {
            e.preventDefault();
            setOpen(true);
          }}
        >
          Manage Course
        </DropdownMenuItem>
      </SheetTrigger>
      <SheetContent side="bottom">
        <SheetHeader>
          <SheetTitle>Manage Course</SheetTitle>
          <SheetDescription>
            Make changes to the course details here. Click save when you're
            done.
          </SheetDescription>
        </SheetHeader>
        <div className="grid gap-4 py-4">
          {/* Select Course */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="courseSelect" className="text-right">
              Select Course
            </Label>
            <div className="col-span-3">
              <Select value={selectedCourse} onValueChange={setSelectedCourse}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a course" />
                </SelectTrigger>
                <SelectContent>
                  {courses.map((course) => (
                    <SelectItem key={course.id} value={course.id.toString()}>
                      {course.course_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Select Teacher */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="teacherSelect" className="text-right">
              Select Teacher
            </Label>
            <div className="col-span-3">
              <Select
                value={selectedTeacher}
                onValueChange={setSelectedTeacher}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a teacher" />
                </SelectTrigger>
                <SelectContent>
                  {teachers.map((teacher) => (
                    <SelectItem key={teacher.id} value={teacher.id.toString()}>
                      {teacher.name || "Unnamed Teacher"}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* New Input for Day */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="dayInput" className="text-right">
              Day
            </Label>
            <div className="col-span-3">
              <Select value={day} onValueChange={setDay}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a day" />
                </SelectTrigger>
                <SelectContent>
                  {[
                    "Monday",
                    "Tuesday",
                    "Wednesday",
                    "Thursday",
                    "Friday",
                    "Saturday",
                  ].map((dayOption) => (
                    <SelectItem key={dayOption} value={dayOption}>
                      {dayOption}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* New Input for Start Time */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="startTimeInput" className="text-right">
              Start Time
            </Label>
            <div className="col-span-3">
              <input
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="border rounded p-2 w-full"
              />
            </div>
          </div>

          {/* New Input for Duration */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="durationInput" className="text-right">
              Duration (hours)
            </Label>
            <div className="col-span-3">
              <input
                type="number"
                value={duration === 0 ? "" : duration} // Show empty string if duration is 0
                onChange={(e) => {
                  const value = e.target.value;
                  // If the value is an empty string, set duration to 0
                  setDuration(value === "" ? 0 : Number(value));
                }}
                className="border rounded p-2 w-full"
              />
            </div>
          </div>
        </div>
        <SheetFooter>
          <Button type="button" onClick={handleSaveSchedule}>
            Save Changes
          </Button>
          <SheetClose asChild>
            <Button variant="outline">Cancel</Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
