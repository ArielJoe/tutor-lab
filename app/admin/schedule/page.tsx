"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useEffect, useState } from "react";
import {
  deleteScheduleById,
  updateSchedule,
  createSchedule,
} from "../actions/schedule/actions";
import { getSchedulesTeacherCourse } from "../actions/schedule/actions";
import { getTeachers } from "../actions/teacher/actions";
import Navbar from "../../components/Navbar";
import { Input } from "@/components/ui/input";
import { Search, Plus } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Trash2, Pencil } from "lucide-react";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Schedule } from "@/app/lib/interfaces";
import { numberToDay } from "@/app/lib/numToDay";
import { getCourses } from "../actions/course/actions";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function TeacherSchedule() {
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [teachers, setTeachers] = useState<{ id: number; name: string }[]>([]);
  const [courses, setCourses] = useState<{ id: number; course_name: string }[]>(
    []
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [refresh, setRefresh] = useState(false);
  const [editableSchedule, setEditableSchedule] = useState<Schedule | null>(
    null
  );
  const [currentPage, setCurrentPage] = useState(0);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newSchedule, setNewSchedule] = useState<Partial<Schedule>>({
    day: 1,
    start_time: "",
    duration: 0,
    Teacher_id: undefined,
    Course_id: undefined,
    Period_id: 1, // Ensure Period_id is always 1
  });
  const pageSize = 10;

  const daysOfWeek = [
    { id: 1, name: "Monday" },
    { id: 2, name: "Tuesday" },
    { id: 3, name: "Wednesday" },
    { id: 4, name: "Thursday" },
    { id: 5, name: "Friday" },
    { id: 6, name: "Saturday" },
  ];

  useEffect(() => {
    fetchAllSchedules();
    fetchTeachersAndCourses();
  }, [refresh]);

  async function fetchAllSchedules() {
    const schedules = await getSchedulesTeacherCourse();
    if (schedules) {
      setSchedules(schedules);
    } else {
      toast({
        variant: "destructive",
        description: `No schedules found`,
      });
    }
  }

  async function fetchTeachersAndCourses() {
    const teachers = await getTeachers();
    const courses = await getCourses();
    setTeachers(teachers);
    setCourses(courses);
  }

  async function handleDelete(id: number) {
    await deleteScheduleById(id);
    setRefresh((prev) => !prev);
    toast({
      className: "bg-green-900",
      description: `Schedule deleted successfully`,
    });
  }

  async function handleUpdate() {
    if (editableSchedule) {
      const updatedSchedule = {
        ...editableSchedule,
        Period_id: 1, // Ensure Period_id is always 1
      };
      await updateSchedule(updatedSchedule);
      setRefresh((prev) => !prev);
      toast({
        className: "bg-green-900",
        description: `Schedule updated successfully`,
      });
    }
  }

  async function handleAddSchedule() {
    if (
      newSchedule.day &&
      newSchedule.start_time &&
      newSchedule.duration &&
      newSchedule.Teacher_id &&
      newSchedule.Course_id
    ) {
      const scheduleToCreate = {
        ...newSchedule,
        Period_id: 1, // Ensure Period_id is always 1
      };
      await createSchedule(scheduleToCreate as Schedule);
      setRefresh((prev) => !prev);
      setIsAddDialogOpen(false);
      toast({
        className: "bg-green-900",
        description: `Schedule added successfully`,
      });
      setNewSchedule({
        day: 1,
        start_time: "",
        duration: 0,
        Teacher_id: undefined,
        Course_id: undefined,
        Period_id: 1, // Reset Period_id to 1 for the next schedule
      });
    } else {
      toast({
        variant: "destructive",
        description: `Please fill all fields`,
      });
    }
  }

  const totalPages = Math.ceil(schedules.length / pageSize);

  const filteredSchedules = schedules.filter((schedule) => {
    const dayName = numberToDay(schedule.day).toLowerCase();
    return dayName.includes(searchTerm.toLowerCase());
  });

  const displayedFilteredSchedules = filteredSchedules.slice(
    currentPage * pageSize,
    (currentPage + 1) * pageSize
  );

  return (
    <div className="w-[100%]">
      <Navbar title="Schedule" />
      <div className="flex items-center gap-2 p-5">
        <Search className="cursor-pointer" />
        <Input
          placeholder="Search by Day (e.g., Monday)"
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              // Implement search functionality if needed
            }
          }}
        />
      </div>
      {schedules.length > 0 ? (
        <div className="px-5 grid gap-5">
          <Table className="border">
            <TableHeader>
              <TableRow>
                <TableHead>Schedule ID</TableHead>
                <TableHead>Day</TableHead>
                <TableHead>Start Time</TableHead>
                <TableHead>Duration (hrs)</TableHead>
                <TableHead>Teacher</TableHead>
                <TableHead>Course</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {displayedFilteredSchedules.map((schedule) => (
                <TableRow key={schedule.id}>
                  <TableCell className="p-5">{schedule.id}</TableCell>
                  <TableCell>{numberToDay(schedule.day)}</TableCell>
                  <TableCell>{schedule.start_time}</TableCell>
                  <TableCell>{schedule.duration}</TableCell>
                  <TableCell>{schedule.teacher?.name}</TableCell>
                  <TableCell>{schedule.course?.course_name}</TableCell>
                  <TableCell>
                    <div className="flex gap-3">
                      <Sheet>
                        <SheetTrigger asChild>
                          <Button
                            className="bg-yellow-600 hover:bg-yellow-700 w-[35px] h-[35px]"
                            onClick={() => setEditableSchedule(schedule)}
                          >
                            <Pencil className="text-white" />
                          </Button>
                        </SheetTrigger>
                        <SheetContent>
                          <SheetHeader>
                            <SheetTitle>Edit Schedule</SheetTitle>
                          </SheetHeader>
                          <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-4 items-center gap-4">
                              <Label className="text-right">Day</Label>
                              <Select
                                value={editableSchedule?.day?.toString() || ""}
                                onValueChange={(value) =>
                                  setEditableSchedule({
                                    ...editableSchedule!,
                                    day: parseInt(value),
                                  })
                                }
                              >
                                <SelectTrigger className="col-span-3">
                                  <SelectValue placeholder="Select Day" />
                                </SelectTrigger>
                                <SelectContent>
                                  {daysOfWeek.map((day) => (
                                    <SelectItem
                                      key={day.id}
                                      value={day.id.toString()}
                                    >
                                      {day.name}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                              <Label className="text-right">Start Time</Label>
                              <Input
                                className="col-span-3"
                                value={editableSchedule?.start_time || ""}
                                onChange={(e) =>
                                  setEditableSchedule({
                                    ...editableSchedule!,
                                    start_time: e.target.value,
                                  })
                                }
                              />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                              <Label className="text-right">
                                Duration (hrs)
                              </Label>
                              <Input
                                type="number"
                                className="col-span-3"
                                value={editableSchedule?.duration || ""}
                                onChange={(e) =>
                                  setEditableSchedule({
                                    ...editableSchedule!,
                                    duration: parseInt(e.target.value),
                                  })
                                }
                              />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                              <Label className="text-right">Teacher</Label>
                              <Select
                                value={
                                  editableSchedule?.Teacher_id?.toString() || ""
                                }
                                onValueChange={(value) =>
                                  setEditableSchedule({
                                    ...editableSchedule!,
                                    Teacher_id: parseInt(value),
                                  })
                                }
                              >
                                <SelectTrigger className="col-span-3">
                                  <SelectValue placeholder="Select Teacher" />
                                </SelectTrigger>
                                <SelectContent>
                                  {teachers.map((teacher) => (
                                    <SelectItem
                                      key={teacher.id}
                                      value={teacher.id.toString()}
                                    >
                                      {teacher.name}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                              <Label className="text-right">Course</Label>
                              <Select
                                value={
                                  editableSchedule?.Course_id?.toString() || ""
                                }
                                onValueChange={(value) =>
                                  setEditableSchedule({
                                    ...editableSchedule!,
                                    Course_id: parseInt(value),
                                  })
                                }
                              >
                                <SelectTrigger className="col-span-3">
                                  <SelectValue placeholder="Select Course" />
                                </SelectTrigger>
                                <SelectContent>
                                  {courses.map((course) => (
                                    <SelectItem
                                      key={course.id}
                                      value={course.id.toString()}
                                    >
                                      {course.course_name}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                          <SheetFooter>
                            <Button onClick={handleUpdate}>Save changes</Button>
                            <SheetClose asChild>
                              <Button variant="outline">Cancel</Button>
                            </SheetClose>
                          </SheetFooter>
                        </SheetContent>
                      </Sheet>
                      <Dialog>
                        <DialogTrigger>
                          <div className="bg-red-600 hover:bg-red-700 rounded-md flex justify-center items-center w-[35px] h-[35px]">
                            <Trash2 className="text-white w-4" />
                          </div>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Delete Schedule?</DialogTitle>
                            <DialogDescription>
                              This action cannot be undone.
                            </DialogDescription>
                          </DialogHeader>
                          <Button
                            variant="destructive"
                            onClick={() => {
                              handleDelete(schedule.id);
                            }}
                          >
                            Delete
                          </Button>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <div className="flex justify-center items-center gap-5 py-4">
            <Button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 0))}
              disabled={currentPage === 0}
              className="flex justify-center items-center h-10 w-10"
            >
              <ChevronLeft />
            </Button>
            <span>
              Page {currentPage + 1} of {totalPages}
            </span>
            <Button
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages - 1))
              }
              disabled={currentPage >= totalPages - 1}
              className="flex justify-center items-center h-10 w-10"
            >
              <ChevronRight />
            </Button>
          </div>
        </div>
      ) : (
        <div className="p-5 text-center">Loading Schedules Data...</div>
      )}

      {/* Add Schedule Button */}
      <div className="fixed bottom-5 right-5">
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="rounded-full w-12 h-12">
              <Plus className="w-6 h-6" />
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="text-2xl">Add New Schedule</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right">Day</Label>
                <Select
                  value={newSchedule.day?.toString() || ""}
                  onValueChange={(value) =>
                    setNewSchedule({
                      ...newSchedule,
                      day: parseInt(value),
                    })
                  }
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select Day" />
                  </SelectTrigger>
                  <SelectContent>
                    {daysOfWeek.map((day) => (
                      <SelectItem key={day.id} value={day.id.toString()}>
                        {day.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right">Start Time</Label>
                <Input
                  className="col-span-3"
                  value={newSchedule.start_time || ""}
                  onChange={(e) =>
                    setNewSchedule({
                      ...newSchedule,
                      start_time: e.target.value,
                    })
                  }
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right">Duration (hrs)</Label>
                <Input
                  type="number"
                  className="col-span-3"
                  value={newSchedule.duration || ""}
                  onChange={(e) =>
                    setNewSchedule({
                      ...newSchedule,
                      duration: parseInt(e.target.value),
                    })
                  }
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right">Teacher</Label>
                <Select
                  value={newSchedule.Teacher_id?.toString() || ""}
                  onValueChange={(value) =>
                    setNewSchedule({
                      ...newSchedule,
                      Teacher_id: parseInt(value),
                    })
                  }
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select Teacher" />
                  </SelectTrigger>
                  <SelectContent>
                    {teachers.map((teacher) => (
                      <SelectItem
                        key={teacher.id}
                        value={teacher.id.toString()}
                      >
                        {teacher.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right">Course</Label>
                <Select
                  value={newSchedule.Course_id?.toString() || ""}
                  onValueChange={(value) =>
                    setNewSchedule({
                      ...newSchedule,
                      Course_id: parseInt(value),
                    })
                  }
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select Course" />
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
            <DialogFooter>
              <Button onClick={handleAddSchedule}>Add Schedule</Button>
              <Button
                variant="outline"
                onClick={() => setIsAddDialogOpen(false)}
              >
                Cancel
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
