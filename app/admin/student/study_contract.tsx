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
import {
  getStudyContractByStudentId,
  deleteStudyContract,
} from "../actions/study_contract/actions";
import { Button } from "@/components/ui/button";
import { createInvoiceFromStudyContract } from "../actions/invoice/actions";
import { toast } from "@/hooks/use-toast";
import { numberToDay } from "@/app/lib/numToDay";
import { Trash2 } from "lucide-react";

export default function ShowStudentContracts({
  studentId,
}: {
  studentId: number;
}) {
  const [studyContracts, setStudyContracts] = useState<any[]>([]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const fetchStudyContracts = async () => {
      const data = await getStudyContractByStudentId(studentId);
      setStudyContracts(data);
    };

    if (open) {
      fetchStudyContracts();
    }
  }, [open, studentId]);

  const handleCreateInvoice = async () => {
    try {
      await createInvoiceFromStudyContract(studentId);
      toast({
        className: "bg-green-900",
        description: "Invoice created successfully!",
      });
    } catch (error) {
      console.error("Failed to create invoice:", error);
    }
  };

  const handleDeleteContract = async (contractId: number) => {
    try {
      await deleteStudyContract(contractId);
      toast({
        description: "Study contract deleted successfully!",
      });
      // Refresh the study contracts list
      const data = await getStudyContractByStudentId(studentId);
      setStudyContracts(data);
    } catch (error) {
      console.error("Failed to delete study contract:", error);
      toast({
        description: "Failed to delete study contract.",
        variant: "destructive",
      });
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
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {studyContracts.map((contract) => (
                  <TableRow key={contract.id}>
                    <TableCell>{contract.Schedule_id}</TableCell>
                    <TableCell>{numberToDay(contract.schedule.day)}</TableCell>
                    <TableCell>{contract.schedule?.start_time}</TableCell>
                    <TableCell>{contract.schedule?.duration}</TableCell>
                    <TableCell>{contract.schedule?.teacher?.name}</TableCell>
                    <TableCell>
                      {contract.schedule?.course?.course_name}
                    </TableCell>
                    <TableCell>
                      <Button
                        className="w-[35px] h-[35px] bg-red-500"
                        onClick={() => handleDeleteContract(contract.id)}
                      >
                        <Trash2 />
                      </Button>
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
        <Button onClick={handleCreateInvoice}>Make Invoice</Button>
      </SheetContent>
    </Sheet>
  );
}
