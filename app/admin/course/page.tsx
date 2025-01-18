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
  deleteCourseById,
  getCourses,
  updateCourse,
} from "../actions/course/actions";
import Navbar from "../../components/Navbar";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
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
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface Course {
  id: number;
  course_name: string | null;
  description: string | null;
  duration: number | null;
  price: number | null;
}

export default function CoursePage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [courseName, setCourseName] = useState("");
  const [refresh, setRefresh] = useState(false);
  const [editableCourse, setEditableCourse] = useState<Course | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
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
      await updateCourse(editableCourse);
      setRefresh((prev) => !prev);
      toast({
        className: "bg-green-900",
        description: `${editableCourse.course_name} updated successfully`,
      });
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
                <TableHead>Duration (hrs)</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {displayedFilteredCourses.map((course) => (
                <TableRow key={course.id}>
                  <TableCell className="p-5">{course.id}</TableCell>
                  <TableCell>{course.course_name}</TableCell>
                  <TableCell>{course.description}</TableCell>
                  <TableCell>{course.duration || "N/A"}</TableCell>
                  <TableCell>
                    {course.price ? `Rp${course.price}` : "N/A"}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-3">
                      <Sheet>
                        <SheetTrigger asChild>
                          <Button
                            className="bg-yellow-300 w-[35px] h-[35px]"
                            onClick={() => setEditableCourse(course)}
                          >
                            <Pencil className="text-black" />
                          </Button>
                        </SheetTrigger>
                        <SheetContent>
                          <SheetHeader>
                            <SheetTitle>Edit Course</SheetTitle>
                          </SheetHeader>
                          <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-4 items-center gap-4">
                              <Label className="text-right">Name</Label>
                              <Input
                                className="col-span-3"
                                value={editableCourse?.course_name || ""}
                                onChange={(e) =>
                                  setEditableCourse({
                                    ...editableCourse!,
                                    course_name: e.target.value,
                                  })
                                }
                              />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                              <Label className="text-right">Description</Label>
                              <Input
                                className="col-span-3"
                                value={editableCourse?.description || ""}
                                onChange={(e) =>
                                  setEditableCourse({
                                    ...editableCourse!,
                                    description: e.target.value,
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
                                value={editableCourse?.duration || ""}
                                onChange={(e) =>
                                  setEditableCourse({
                                    ...editableCourse!,
                                    duration: e.target.value
                                      ? parseInt(e.target.value)
                                      : null,
                                  })
                                }
                              />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                              <Label className="text-right">Price</Label>
                              <Input
                                type="number"
                                className="col-span-3"
                                value={editableCourse?.price!}
                                onChange={(e) =>
                                  setEditableCourse({
                                    ...editableCourse!,
                                    price: e.target.value
                                      ? parseFloat(e.target.value)
                                      : null,
                                  })
                                }
                              />
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
                          <div className="bg-red-500 rounded-md flex justify-center items-center w-[35px] h-[35px]">
                            <Trash2 className="text-black w-4" />
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
    </div>
  );
}
