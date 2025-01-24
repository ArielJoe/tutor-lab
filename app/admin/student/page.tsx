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
  deleteStudentById,
  getStudents,
  getStudentsByName,
  updateStudent,
} from "../controllers/student.controller";
import Navbar from "../../components/Navbar";
import { Input } from "@/components/ui/input";
import { EllipsisVertical, Search, Loader2 } from "lucide-react"; // Import Loader2 for spinner
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { AddCourse } from "./add_course";
import ShowStudentContracts from "./study_contract";
import { Student } from "@/app/lib/interfaces";
import { resetPassword } from "../controllers/user.controller";
import { z } from "zod";
import { studentSchema } from "@/app/lib/zod";

export default function StudentPage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [studentName, setStudentName] = useState("");
  const [refresh, setRefresh] = useState(false);
  const [editableStudent, setEditableStudent] = useState<Student | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [notFound, setNotFound] = useState(false);
  const [resetPasswordEmail, setResetPasswordEmail] = useState<string | null>(
    null
  );
  const [newPassword, setNewPassword] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({}); // Track validation errors
  const [loading, setLoading] = useState(true); // Loading state
  const pageSize = 10;

  useEffect(() => {
    const fetchStudents = async () => {
      fetchAllStudents();
    };

    fetchStudents();
  }, [refresh]);

  async function fetchAllStudents() {
    setLoading(true); // Set loading to true before fetching data
    try {
      const students = await getStudents();
      if (students) {
        setStudents(students);
      } else {
        setNotFound(true);
      }
    } catch (error) {
      console.error("Failed to fetch students:", error);
      toast({
        variant: "destructive",
        description: "Failed to fetch students. Please try again.",
      });
    } finally {
      setLoading(false); // Set loading to false after fetching data
    }
  }

  async function fetchStudents() {
    if (studentName) {
      setLoading(true); // Set loading to true before fetching data
      try {
        const studentData = await getStudentsByName(studentName);
        if (studentData.length !== 0) {
          setStudents(studentData);
          toast({
            className: "bg-green-900",
            description: `${studentName} found`,
          });
        } else {
          toast({
            variant: "destructive",
            description: `${studentName} not found`,
          });
          setStudents([]);
        }
      } catch (error) {
        console.error("Failed to fetch students by name:", error);
        toast({
          variant: "destructive",
          description: "Failed to fetch students by name. Please try again.",
        });
      } finally {
        setLoading(false); // Set loading to false after fetching data
      }
    } else {
      toast({
        variant: "destructive",
        description: `Student Name can't be empty`,
      });
    }
  }

  async function handleDelete(name: string, id: number) {
    try {
      await deleteStudentById(id);
      setRefresh((prev) => !prev);
      toast({
        className: "bg-green-900",
        description: `${name} deleted successfully`,
      });
    } catch (error) {
      console.error("Failed to delete student:", error);
      toast({
        variant: "destructive",
        description: "Failed to delete student. Please try again.",
      });
    }
  }

  async function handleUpdate() {
    if (editableStudent) {
      try {
        // Validate the editableStudent against the schema
        const validatedData = studentSchema.parse(editableStudent);

        // Add the id to the validated data
        const studentDataWithId = {
          ...validatedData,
          id: editableStudent.id, // Include the id from editableStudent
        };

        // If validation passes, proceed with the update
        await updateStudent(studentDataWithId);
        setRefresh((prev) => !prev);
        setErrors({}); // Clear errors on successful validation
        toast({
          className: "bg-green-900",
          description: `${validatedData.name} updated successfully`,
        });
      } catch (error) {
        if (error instanceof z.ZodError) {
          // Handle validation errors
          const fieldErrors: Record<string, string> = {};
          error.errors.forEach((err) => {
            if (err.path) {
              fieldErrors[err.path[0]] = err.message;
            }
          });
          setErrors(fieldErrors); // Set errors for each field
          toast({
            variant: "destructive",
            description: "Some data not valid.",
          });
        } else {
          // Handle other errors
          toast({
            variant: "destructive",
            description: "Failed to update student",
          });
        }
      }
    }
  }

  async function handleResetPassword() {
    if (resetPasswordEmail && newPassword) {
      try {
        await resetPassword(resetPasswordEmail, newPassword);
        toast({
          className: "bg-green-900",
          description: `Password for ${resetPasswordEmail} reset successfully`,
        });
        setResetPasswordEmail(null);
        setNewPassword("");
      } catch (error) {
        toast({
          variant: "destructive",
          description: `Failed to reset password for ${resetPasswordEmail}`,
        });
      }
    }
  }

  const totalPages = Math.ceil(students.length / pageSize);
  const displayedStudents = students.slice(
    currentPage * pageSize,
    (currentPage + 1) * pageSize
  );

  if (notFound) {
    return <div className="text-center">Data Not Found</div>;
  }

  return (
    <div className="w-[100%]">
      <Navbar title="Student" />
      <div className="flex items-center gap-2 p-5">
        <Search onClick={fetchStudents} className="cursor-pointer" />
        <Input
          placeholder="John Doe"
          onChange={(e) => {
            setStudentName(e.target.value);
            if (e.target.value === "") {
              fetchAllStudents();
            }
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              fetchStudents();
            }
          }}
        />
      </div>

      {/* Loading State */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin" /> {/* Spinner */}
          <span className="ml-2">Loading Students Data...</span>
        </div>
      ) : students.length > 0 ? (
        <div className="px-5 grid gap-5">
          <Table className="border">
            <TableHeader>
              <TableRow>
                <TableHead>Student ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Birth Date</TableHead>
                <TableHead>Address</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Phone Number</TableHead>
                <TableHead>Parents Phone Number</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {displayedStudents.map((student) => (
                <TableRow key={student.id}>
                  <TableCell className="p-5">{student.id}</TableCell>
                  <TableCell>{student.name}</TableCell>
                  <TableCell>
                    {student.birth_date
                      ? student.birth_date.toISOString().split("T")[0]
                      : "N/A"}
                  </TableCell>
                  <TableCell>{student.address}</TableCell>
                  <TableCell>{student.email}</TableCell>
                  <TableCell>{student.phone_number}</TableCell>
                  <TableCell>{student.parents_phone_number}</TableCell>
                  <TableCell>
                    <div className="flex gap-3">
                      <Sheet>
                        <SheetTrigger asChild>
                          <Button
                            className="bg-yellow-600 hover:bg-yellow-700 w-[35px] h-[35px]"
                            onClick={() => setEditableStudent(student)}
                          >
                            <Pencil className="text-white" />
                          </Button>
                        </SheetTrigger>
                        <SheetContent>
                          <SheetHeader>
                            <SheetTitle className="text-2xl">
                              Edit Student
                            </SheetTitle>
                          </SheetHeader>
                          <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-4 items-center gap-4">
                              <Label className="text-right">Name</Label>
                              <div className="col-span-3">
                                <Input
                                  value={editableStudent?.name || ""}
                                  onChange={(e) =>
                                    setEditableStudent({
                                      ...editableStudent!,
                                      name: e.target.value,
                                    })
                                  }
                                />
                                {errors.name && (
                                  <p className="text-red-500 text-sm">
                                    {errors.name}
                                  </p>
                                )}
                              </div>
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                              <Label className="text-right">Birth Date</Label>
                              <div className="col-span-3">
                                <Input
                                  type="date"
                                  value={
                                    editableStudent?.birth_date
                                      ? editableStudent.birth_date
                                          .toISOString()
                                          .split("T")[0]
                                      : ""
                                  }
                                  onChange={(e) => {
                                    const selectedDate = e.target.value;
                                    setEditableStudent({
                                      ...editableStudent!,
                                      birth_date: new Date(selectedDate),
                                    });
                                  }}
                                />
                                {errors.birth_date && (
                                  <p className="text-red-500 text-sm">
                                    {errors.birth_date}
                                  </p>
                                )}
                              </div>
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                              <Label className="text-right">Address</Label>
                              <div className="col-span-3">
                                <Input
                                  value={editableStudent?.address || ""}
                                  onChange={(e) =>
                                    setEditableStudent({
                                      ...editableStudent!,
                                      address: e.target.value,
                                    })
                                  }
                                />
                                {errors.address && (
                                  <p className="text-red-500 text-sm">
                                    {errors.address}
                                  </p>
                                )}
                              </div>
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                              <Label className="text-right">Email</Label>
                              <div className="col-span-3">
                                <Input
                                  value={editableStudent?.email || ""}
                                  onChange={(e) =>
                                    setEditableStudent({
                                      ...editableStudent!,
                                      email: e.target.value,
                                    })
                                  }
                                />
                                {errors.email && (
                                  <p className="text-red-500 text-sm">
                                    {errors.email}
                                  </p>
                                )}
                              </div>
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                              <Label className="text-right">Phone Number</Label>
                              <div className="col-span-3">
                                <Input
                                  value={editableStudent?.phone_number || ""}
                                  onChange={(e) =>
                                    setEditableStudent({
                                      ...editableStudent!,
                                      phone_number: e.target.value,
                                    })
                                  }
                                />
                                {errors.phone_number && (
                                  <p className="text-red-500 text-sm">
                                    {errors.phone_number}
                                  </p>
                                )}
                              </div>
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                              <Label className="text-right">
                                Parents Phone Number
                              </Label>
                              <div className="col-span-3">
                                <Input
                                  value={
                                    editableStudent?.parents_phone_number || ""
                                  }
                                  onChange={(e) =>
                                    setEditableStudent({
                                      ...editableStudent!,
                                      parents_phone_number: e.target.value,
                                    })
                                  }
                                />
                                {errors.parents_phone_number && (
                                  <p className="text-red-500 text-sm">
                                    {errors.parents_phone_number}
                                  </p>
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
                            <DialogTitle>Delete {student.name}?</DialogTitle>
                            <DialogDescription>
                              This action cannot be undone.
                            </DialogDescription>
                          </DialogHeader>
                          <Button
                            variant="destructive"
                            onClick={() => {
                              handleDelete(student.name!, student.id);
                            }}
                          >
                            Delete
                          </Button>
                        </DialogContent>
                      </Dialog>
                      <DropdownMenu>
                        <DropdownMenuTrigger>
                          <EllipsisVertical />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          <ShowStudentContracts studentId={student.id} />
                          <AddCourse studentId={student.id} />
                          <Dialog>
                            <DialogTrigger asChild>
                              <DropdownMenuItem
                                onSelect={(e) => {
                                  e.preventDefault();
                                  setResetPasswordEmail(student.email);
                                }}
                              >
                                Reset Password
                              </DropdownMenuItem>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle className="text-2xl">
                                  Reset Password
                                </DialogTitle>
                                <DialogDescription>
                                  Enter a new password for {student.email}.
                                </DialogDescription>
                              </DialogHeader>
                              <div className="grid gap-4 py-4">
                                <div className="grid grid-cols-4 items-center gap-4">
                                  <Label
                                    htmlFor="newPassword"
                                    className="text-right"
                                  >
                                    New Password
                                  </Label>
                                  <Input
                                    id="newPassword"
                                    type="password"
                                    className="col-span-3"
                                    value={newPassword}
                                    onChange={(e) =>
                                      setNewPassword(e.target.value)
                                    }
                                  />
                                </div>
                              </div>
                              <DialogFooter>
                                <Button onClick={handleResetPassword}>
                                  Reset Password
                                </Button>
                              </DialogFooter>
                            </DialogContent>
                          </Dialog>
                        </DropdownMenuContent>
                      </DropdownMenu>
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
        <div className="p-5 text-center">No students found.</div>
      )}
    </div>
  );
}
