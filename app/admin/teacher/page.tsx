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
  deleteTeacherById,
  getTeachers,
  getTeachersByName,
  updateTeacher,
} from "../controllers/teacher.controller";
import Navbar from "../../components/Navbar";
import { Input } from "@/components/ui/input";
import { Search, EllipsisVertical, Loader2 } from "lucide-react"; // Import Loader2 for spinner
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
import { Teacher } from "@/app/lib/interfaces";
import { resetPassword } from "../controllers/user.controller";
import { z } from "zod";
import { teacherSchema } from "@/app/lib/zod";

export default function TeacherPage() {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [teacherName, setTeacherName] = useState("");
  const [refresh, setRefresh] = useState(false);
  const [editableTeacher, setEditableTeacher] = useState<Teacher | null>(null);
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
    const fetchTeachers = async () => {
      fetchAllTeachers();
    };

    fetchTeachers();
  }, [refresh]);

  async function fetchAllTeachers() {
    setLoading(true); // Set loading to true before fetching data
    try {
      const teachers = await getTeachers();
      if (teachers) {
        setTeachers(teachers);
      } else {
        setNotFound(true);
      }
    } catch (error) {
      console.error("Failed to fetch teachers:", error);
      toast({
        variant: "destructive",
        description: "Failed to fetch teachers. Please try again.",
      });
    } finally {
      setLoading(false); // Set loading to false after fetching data
    }
  }

  async function fetchTeachers() {
    if (teacherName) {
      setLoading(true); // Set loading to true before fetching data
      try {
        const teacherData = await getTeachersByName(teacherName);
        if (teacherData.length !== 0) {
          setTeachers(teacherData);
          toast({
            className: "bg-green-900",
            description: `${teacherName} found`,
          });
        } else {
          toast({
            variant: "destructive",
            description: `${teacherName} not found`,
          });
          setTeachers([]);
        }
      } catch (error) {
        console.error("Failed to fetch teachers by name:", error);
        toast({
          variant: "destructive",
          description: "Failed to fetch teachers by name. Please try again.",
        });
      } finally {
        setLoading(false); // Set loading to false after fetching data
      }
    } else {
      toast({
        variant: "destructive",
        description: `Teacher Name can't be empty`,
      });
    }
  }

  async function handleDelete(name: string, id: number) {
    try {
      await deleteTeacherById(id);
      setRefresh((prev) => !prev);
      toast({
        className: "bg-green-900",
        description: `${name} deleted successfully`,
      });
    } catch (error) {
      console.error("Failed to delete teacher:", error);
      toast({
        variant: "destructive",
        description: "Failed to delete teacher. Please try again.",
      });
    }
  }

  async function handleUpdate() {
    if (editableTeacher) {
      try {
        // Validate the editableTeacher against the schema
        const validatedData = teacherSchema.parse(editableTeacher);

        // Add the id to the validated data
        const teacherDataWithId = {
          ...validatedData,
          id: editableTeacher.id, // Include the id from editableTeacher
        };

        // If validation passes, proceed with the update
        await updateTeacher(teacherDataWithId);
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
            description: "Failed to update teacher",
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

  const totalPages = Math.ceil(teachers.length / pageSize);
  const displayedTeachers = teachers.slice(
    currentPage * pageSize,
    (currentPage + 1) * pageSize
  );

  if (notFound) {
    return <div className="text-center">Data Not Found</div>;
  }

  return (
    <div className="w-[100%]">
      <Navbar title="Teacher" />
      <div className="flex items-center gap-2 p-5">
        <Search onClick={fetchTeachers} className="cursor-pointer" />
        <Input
          placeholder="John Doe"
          onChange={(e) => {
            setTeacherName(e.target.value);
            if (e.target.value === "") {
              fetchAllTeachers();
            }
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              fetchTeachers();
            }
          }}
        />
      </div>

      {/* Loading State */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin" /> {/* Spinner */}
          <span className="ml-2">Loading Teachers Data...</span>
        </div>
      ) : teachers.length > 0 ? (
        <div className="px-5 grid gap-5">
          <Table className="border">
            <TableHeader>
              <TableRow>
                <TableHead>Teacher ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Address</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Phone Number</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {displayedTeachers.map((teacher) => (
                <TableRow key={teacher.id}>
                  <TableCell className="p-5">{teacher.id}</TableCell>
                  <TableCell>{teacher.name}</TableCell>
                  <TableCell>{teacher.address}</TableCell>
                  <TableCell>{teacher.email}</TableCell>
                  <TableCell>{teacher.phone_number}</TableCell>
                  <TableCell>
                    <div className="flex gap-3">
                      <Sheet>
                        <SheetTrigger asChild>
                          <Button
                            className="bg-yellow-600 hover:bg-yellow-700 w-[35px] h-[35px]"
                            onClick={() => setEditableTeacher(teacher)}
                          >
                            <Pencil className="text-white" />
                          </Button>
                        </SheetTrigger>
                        <SheetContent>
                          <SheetHeader>
                            <SheetTitle className="text-2xl">
                              Edit Teacher
                            </SheetTitle>
                          </SheetHeader>
                          <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-4 items-center gap-4">
                              <Label className="text-right">Name</Label>
                              <div className="col-span-3">
                                <Input
                                  value={editableTeacher?.name || ""}
                                  onChange={(e) =>
                                    setEditableTeacher({
                                      ...editableTeacher!,
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
                              <Label className="text-right">Address</Label>
                              <div className="col-span-3">
                                <Input
                                  value={editableTeacher?.address || ""}
                                  onChange={(e) =>
                                    setEditableTeacher({
                                      ...editableTeacher!,
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
                                  value={editableTeacher?.email || ""}
                                  onChange={(e) =>
                                    setEditableTeacher({
                                      ...editableTeacher!,
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
                                  value={editableTeacher?.phone_number || ""}
                                  onChange={(e) =>
                                    setEditableTeacher({
                                      ...editableTeacher!,
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
                            <DialogTitle>Delete {teacher.name}?</DialogTitle>
                            <DialogDescription>
                              This action cannot be undone.
                            </DialogDescription>
                          </DialogHeader>
                          <Button
                            variant="destructive"
                            onClick={() => {
                              handleDelete(teacher.name!, teacher.id);
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
                          <Dialog>
                            <DialogTrigger asChild>
                              <DropdownMenuItem
                                onSelect={(e) => {
                                  e.preventDefault();
                                  setResetPasswordEmail(teacher.email);
                                }}
                              >
                                Reset Password
                              </DropdownMenuItem>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Reset Password</DialogTitle>
                                <DialogDescription>
                                  Enter a new password for {teacher.email}.
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
        <div className="p-5 text-center">No teachers found.</div>
      )}
    </div>
  );
}
