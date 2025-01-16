"use client";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useEffect, useState } from "react";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { getStudyContractByStudentId } from "../actions/study_contract/actions";

export default function ShowStudentContracts({
  studentId,
}: {
  studentId: string;
}) {
  const [studyContracts, setStudyContracts] = useState<any[]>([]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const fetchStudyContracts = async () => {
      const data = await getStudyContractByStudentId(studentId);
      setStudyContracts(data);
      console.log(data);
    };

    if (open) {
      fetchStudyContracts();
    }
  }, [open, studentId]);

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
          Study Contract
        </DropdownMenuItem>
      </SheetTrigger>
      <SheetContent side="bottom" className="h-[80vh] overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Study Contracts for Student {studentId}</SheetTitle>
        </SheetHeader>
        <div className="py-4">
          {studyContracts.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Schedule ID</TableHead>
                  <TableHead>Day</TableHead>
                  <TableHead>Start Time</TableHead>
                  <TableHead>Duration (hours)</TableHead>
                  <TableHead>Teacher</TableHead>
                  <TableHead>Course</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {studyContracts.map((contract) => (
                  <TableRow key={contract.id}>
                    <TableCell>{contract.Schedule_id}</TableCell>
                    <TableCell>{contract.schedule?.day || "N/A"}</TableCell>
                    <TableCell>
                      {contract.schedule?.start_time || "N/A"}
                    </TableCell>
                    <TableCell>
                      {contract.schedule?.duration || "N/A"}
                    </TableCell>
                    <TableCell>
                      {contract.schedule?.teacher?.name || "N/A"}
                    </TableCell>
                    <TableCell>
                      {contract.schedule?.course?.course_name || "N/A"}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center">
              No study contracts found for this student.
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
