"use client";

import { z } from "zod";
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
  deleteCourseById,
  getCourses,
  updateCourse,
  addCourse,
} from "../controllers/course.controller";
import { getStudentsByCourseId } from "../controllers/student.controller";
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
import { courseSchema } from "@/app/lib/zod";

interface Course {
  id: number;
  course_name: string;
  description: string;
  duration: number;
  price: number;
  studentCount?: number;
}

interface Student {
  id: number;
  name: string;
  email: string;
  phone_number: string;
}

export default function CoursePage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [courseName, setCourseName] = useState("");
  const [refresh, setRefresh] = useState(false);
  const [editableCourse, setEditableCourse] = useState<Course | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newCourse, setNewCourse] = useState<Partial<Course>>({
    course_name: "",
    description: "",
    duration: 0,
    price: 0,
  });
  const [students, setStudents] = useState<Student[]>([]);
  const [selectedCourseId, setSelectedCourseId] = useState<number | null>(null);
  const [isViewStudentsSheetOpen, setIsViewStudentsSheetOpen] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [editErrors, setEditErrors] = useState<Record<string, string>>({});
  const pageSize = 10;

  useEffect(() => {
    fetchAllCourses();
  }, [refresh]);

  async function fetchAllCourses() {
    const courses = await getCourses();
    if (courses) {
      setCourses(courses);
    } else {
      toast({
        variant: "destructive",
        description: `No courses found`,
      });
    }
  }

  async function fetchStudentsByCourseId(courseId: number) {
    try {
      const students = await getStudentsByCourseId(courseId);
      setStudents(students);
    } catch (error) {
      toast({
        variant: "destructive",
        description: "Failed to fetch students",
      });
    }
  }

  async function handleDelete(name: string, id: number) {
    await deleteCourseById(id);
    setRefresh((prev) => !prev);
    toast({
      className: "bg-green-900",
      description: `${name} deleted successfully`,
    });
  }

  async function handleUpdate() {
    if (editableCourse) {
      try {
        const validatedData = courseSchema.parse(editableCourse);
        await updateCourse(validatedData);
        setRefresh((prev) => !prev);
        toast({
          className: "bg-green-900",
          description: `${editableCourse.course_name} updated successfully`,
        });
        setEditErrors({});
      } catch (error) {
        if (error instanceof z.ZodError) {
          const fieldErrors: Record<string, string> = {};
          error.errors.forEach((err) => {
            if (err.path) {
              fieldErrors[err.path[0]] = err.message;
            }
          });
          setEditErrors(fieldErrors);
        }
      }
    }
  }

  async function handleAddCourse() {
    try {
      // Ensure price is parsed as a number
      const courseData = {
        ...newCourse,
        price: parseFloat(newCourse.price?.toString() || "0"),
      };

      const validatedData = courseSchema.parse(courseData);
      const courseToAdd = {
        ...validatedData,
        studentCount: 0,
      };
      await addCourse(courseToAdd as Course);
      setRefresh((prev) => !prev);
      setIsAddDialogOpen(false);
      toast({
        className: "bg-green-900",
        description: `Course added successfully`,
      });
      setNewCourse({
        course_name: "",
        description: "",
        duration: 0,
        price: 0,
      });
      setErrors({});
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldErrors: Record<string, string> = {};
        error.errors.forEach((err) => {
          if (err.path) {
            fieldErrors[err.path[0]] = err.message;
          }
        });
        setErrors(fieldErrors);
      } else if (error) {
        toast({
          variant: "destructive",
          description: "Course name already exists",
        });
      }
    }
  }

  const totalPages = Math.ceil(courses.length / pageSize);

  const filteredCourses = courses.filter((course) =>
    course.course_name?.toLowerCase().includes(courseName.toLowerCase())
  );

  const displayedFilteredCourses = filteredCourses.slice(
    currentPage * pageSize,
    (currentPage + 1) * pageSize
  );

  return (
    <div className="w-[100%]">
      <Navbar title="Course" />
      <div className="flex items-center gap-2 p-5">
        <Search className="cursor-pointer" />
        <Input
          placeholder="Course Name"
          onChange={(e) => setCourseName(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              // Implement search functionality if needed
            }
          }}
        />
      </div>
      {courses.length > 0 ? (
        <div className="px-5 grid gap-5">
          <Table className="border">
            <TableHeader>
              <TableRow>
                <TableHead>Course ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Duration (hrs/week)</TableHead>
                <TableHead>Price/month</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {displayedFilteredCourses.map((course) => (
                <TableRow key={course.id}>
                  <TableCell className="p-5">{course.id}</TableCell>
                  <TableCell>{course.course_name}</TableCell>
                  <TableCell>{course.description}</TableCell>
                  <TableCell>{course.duration}</TableCell>
                  <TableCell>
                    {course.price
                      ? `Rp${course.price.toLocaleString("id-ID")}` + ",00"
                      : "N/A"}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-3">
                      <Button
                        variant="outline"
                        onClick={() => {
                          setSelectedCourseId(course.id);
                          fetchStudentsByCourseId(course.id);
                          setIsViewStudentsSheetOpen(true);
                        }}
                      >
                        View Students
                      </Button>
                      <Sheet>
                        <SheetTrigger asChild>
                          <Button
                            className="bg-yellow-600 hover:bg-yellow-700 w-[35px] h-[35px]"
                            onClick={() => setEditableCourse(course)}
                          >
                            <Pencil className="text-white" />
                          </Button>
                        </SheetTrigger>
                        <SheetContent>
                          <SheetHeader>
                            <SheetTitle className="text-2xl">
                              Edit Course
                            </SheetTitle>
                          </SheetHeader>
                          <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-4 items-center gap-4">
                              <Label className="text-right">Name</Label>
                              <div className="col-span-3">
                                <Input
                                  value={editableCourse?.course_name || ""}
                                  onChange={(e) =>
                                    setEditableCourse({
                                      ...editableCourse!,
                                      course_name: e.target.value,
                                    })
                                  }
                                />
                                {editErrors.course_name && (
                                  <span className="text-red-500 text-sm mt-1 block">
                                    {editErrors.course_name}
                                  </span>
                                )}
                              </div>
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                              <Label className="text-right">Description</Label>
                              <div className="col-span-3">
                                <Input
                                  value={editableCourse?.description || ""}
                                  onChange={(e) =>
                                    setEditableCourse({
                                      ...editableCourse!,
                                      description: e.target.value,
                                    })
                                  }
                                />
                                {editErrors.description && (
                                  <span className="text-red-500 text-sm mt-1 block">
                                    {editErrors.description}
                                  </span>
                                )}
                              </div>
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                              <Label className="text-right">
                                Duration (hrs/week)
                              </Label>
                              <div className="col-span-3">
                                <Input
                                  type="number"
                                  value={editableCourse?.duration || ""}
                                  onChange={(e) =>
                                    setEditableCourse({
                                      ...editableCourse!,
                                      duration: parseInt(e.target.value),
                                    })
                                  }
                                />
                                {editErrors.duration && (
                                  <span className="text-red-500 text-sm mt-1 block">
                                    {editErrors.duration}
                                  </span>
                                )}
                              </div>
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                              <Label className="text-right">Price/month</Label>
                              <div className="col-span-3">
                                <Input
                                  type="number"
                                  value={editableCourse?.price || ""}
                                  onChange={(e) =>
                                    setEditableCourse({
                                      ...editableCourse!,
                                      price: parseFloat(e.target.value),
                                    })
                                  }
                                />
                                {editErrors.price && (
                                  <span className="text-red-500 text-sm mt-1 block">
                                    {editErrors.price}
                                  </span>
                                )}
                              </div>
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
                            <DialogTitle>
                              Delete {course.course_name}?
                            </DialogTitle>
                            <DialogDescription>
                              This action cannot be undone.
                            </DialogDescription>
                          </DialogHeader>
                          <Button
                            variant="destructive"
                            onClick={() => {
                              handleDelete(course.course_name!, course.id);
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

          <Sheet
            open={isViewStudentsSheetOpen}
            onOpenChange={setIsViewStudentsSheetOpen}
          >
            <SheetContent side="bottom" className="h-[80vh] overflow-y-auto">
              <SheetHeader>
                <SheetTitle className="text-2xl">
                  Students Enrolled in Course {selectedCourseId}
                </SheetTitle>
              </SheetHeader>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Phone Number</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {students.map((student) => (
                    <TableRow key={student.id}>
                      <TableCell>{student.id}</TableCell>
                      <TableCell>{student.name}</TableCell>
                      <TableCell>{student.email}</TableCell>
                      <TableCell>{student.phone_number}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </SheetContent>
          </Sheet>

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
        <div className="p-5 text-center">Loading Courses Data...</div>
      )}

      <div className="fixed bottom-5 right-5">
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="rounded-full w-12 h-12">
              <Plus className="w-6 h-6" />
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="text-2xl">Add New Course</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right">Name</Label>
                <div className="col-span-3">
                  <Input
                    value={newCourse.course_name || ""}
                    onChange={(e) =>
                      setNewCourse({
                        ...newCourse,
                        course_name: e.target.value,
                      })
                    }
                  />
                  {errors.course_name && (
                    <span className="text-red-500 text-sm mt-1 block">
                      {errors.course_name}
                    </span>
                  )}
                </div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right">Description</Label>
                <div className="col-span-3">
                  <Input
                    value={newCourse.description || ""}
                    onChange={(e) =>
                      setNewCourse({
                        ...newCourse,
                        description: e.target.value,
                      })
                    }
                  />
                  {errors.description && (
                    <span className="text-red-500 text-sm mt-1 block">
                      {errors.description}
                    </span>
                  )}
                </div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right">Duration (hrs/week)</Label>
                <div className="col-span-3">
                  <Input
                    type="number"
                    value={newCourse.duration || ""}
                    onChange={(e) =>
                      setNewCourse({
                        ...newCourse,
                        duration: parseInt(e.target.value),
                      })
                    }
                  />
                  {errors.duration && (
                    <span className="text-red-500 text-sm mt-1 block">
                      {errors.duration}
                    </span>
                  )}
                </div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right">Price/month</Label>
                <div className="col-span-3">
                  <Input
                    type="number"
                    value={newCourse.price || ""}
                    onChange={(e) =>
                      setNewCourse({
                        ...newCourse,
                        price: parseFloat(e.target.value),
                      })
                    }
                  />
                  {errors.price && (
                    <span className="text-red-500 text-sm mt-1 block">
                      {errors.price}
                    </span>
                  )}
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button onClick={handleAddCourse}>Add Course</Button>
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
