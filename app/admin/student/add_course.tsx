import { useEffect, useState } from "react";
import { getCourses } from "../controllers/course.controller";
import { getTeachers } from "../controllers/teacher.controller";
import { Course, Teacher, Schedule } from "@/app/lib/interfaces";
import { createStudyContract } from "../controllers/study_contract.controller";
import { getSchedulesByTeacherId } from "../controllers/schedule.controller";
import { toast } from "@/hooks/use-toast";
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
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { numberToDay } from "@/app/lib/numToDay";

export function AddCourse({ studentId }: { studentId: number }) {
  const [open, setOpen] = useState(false);
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedCourse, setSelectedCourse] = useState("");
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [selectedTeacher, setSelectedTeacher] = useState("");
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [selectedSchedule, setSelectedSchedule] = useState("");

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

  useEffect(() => {
    const loadTeachers = async () => {
      try {
        const teachersData = await getTeachers();
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

  useEffect(() => {
    if (selectedTeacher) {
      const loadSchedules = async () => {
        try {
          const schedulesData = await getSchedulesByTeacherId(
            parseInt(selectedTeacher)
          );
          setSchedules(schedulesData);
        } catch (error) {
          console.error("Failed to load schedules:", error);
        }
      };

      loadSchedules();
    }
  }, [selectedTeacher]);

  const handleSaveSchedule = async () => {
    if (!selectedSchedule) {
      toast({
        description: "Please select a schedule",
        variant: "destructive",
      });
      return;
    }

    const studyContractData = {
      scheduleId: parseInt(selectedSchedule),
      schedulePeriodId:
        schedules.find((s) => s.id === parseInt(selectedSchedule))?.Period_id ||
        0,
      scheduleTeacherId: parseInt(selectedTeacher),
      scheduleCourseId: parseInt(selectedCourse),
      studentId: studentId,
    };

    try {
      await createStudyContract(studyContractData);
      toast({
        className: "bg-green-900",
        description: "Study contract added successfully",
      });
      console.log("Study contract added successfully");
      setOpen(false);
    } catch (error) {
      console.error("Error saving study contract:", error);
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
          Add Course
        </DropdownMenuItem>
      </SheetTrigger>
      <SheetContent side="bottom">
        <SheetHeader>
          <SheetTitle className="text-2xl">{`Manage Student ${studentId}'s Courses`}</SheetTitle>
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

          {/* Select Schedule */}
          {selectedTeacher && (
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="scheduleSelect" className="text-right">
                Select Schedule
              </Label>
              <div className="col-span-3">
                <Select
                  value={selectedSchedule}
                  onValueChange={setSelectedSchedule}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a schedule" />
                  </SelectTrigger>
                  <SelectContent>
                    {schedules.map((schedule) => (
                      <SelectItem
                        key={schedule.id}
                        value={schedule.id.toString()}
                      >
                        {`${numberToDay(schedule.day)} - ${
                          schedule.start_time
                        } (${schedule.duration} hours)`}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
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
