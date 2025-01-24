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
} from "../controllers/study_contract.controller";
import { Button } from "@/components/ui/button";
import { createInvoiceFromStudyContract } from "../controllers/invoice.controller";
import { toast } from "@/hooks/use-toast";
import { numberToDay } from "@/app/lib/numToDay";
import { Trash2, Loader2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface StudyContract {
  id: number;
  Schedule_id: number;
  schedule: {
    day: number;
    start_time: string;
    duration: number;
    teacher: {
      name: string;
    };
    course: {
      course_name: string;
      price: number;
    };
  };
}

export default function ShowStudentContracts({
  studentId,
}: {
  studentId: number;
}) {
  const [studyContracts, setStudyContracts] = useState<StudyContract[]>([]);
  const [open, setOpen] = useState(false);
  const [totalAmount, setTotalAmount] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState<"Transfer" | "Cash">(
    "Transfer"
  );
  const [loading, setLoading] = useState(false);
  const [expandedCourses, setExpandedCourses] = useState<string[]>([]);

  useEffect(() => {
    const fetchStudyContracts = async () => {
      setLoading(true);
      try {
        const data = await getStudyContractByStudentId(studentId);
        setStudyContracts(data);
        calculateTotalAmount(data);
      } catch (error) {
        console.error("Failed to fetch study contracts:", error);
        toast({
          variant: "destructive",
          description: "Failed to fetch study contracts. Please try again.",
        });
      } finally {
        setLoading(false);
      }
    };

    if (open) {
      fetchStudyContracts();
    }
  }, [open, studentId]);

  const calculateTotalAmount = (contracts: StudyContract[]) => {
    const uniqueCourses = new Set<string>();
    let total = 0;

    contracts.forEach((contract) => {
      const courseName = contract.schedule?.course?.course_name;
      const coursePrice = contract.schedule?.course?.price || 0;

      if (courseName && !uniqueCourses.has(courseName)) {
        uniqueCourses.add(courseName);
        total += coursePrice;
      }
    });

    setTotalAmount(total);
  };

  const handleCreateInvoice = async () => {
    try {
      // Calculate total amount from all study contracts
      const totalAmount = studyContracts.reduce(
        (sum: number, contract: StudyContract) =>
          sum + (contract.schedule?.course?.price || 0),
        0
      );

      // Create invoice with the total amount
      await createInvoiceFromStudyContract(
        studentId,
        totalAmount,
        paymentMethod
      );
      toast({
        className: "bg-green-900",
        description: "Invoice created successfully!",
      });
    } catch (error) {
      console.error("Failed to create invoice:", error);
      toast({
        variant: "destructive",
        description: "Failed to create invoice. Please try again.",
      });
    }
  };

  const handleDeleteContract = async (contractId: number) => {
    try {
      await deleteStudyContract(contractId);
      toast({
        description: "Study contract deleted successfully!",
      });
      const data = await getStudyContractByStudentId(studentId);
      setStudyContracts(data);
      calculateTotalAmount(data);
    } catch (error) {
      console.error("Failed to delete study contract:", error);
      toast({
        description: "Failed to delete study contract.",
        variant: "destructive",
      });
    }
  };

  const toggleAllAccordions = () => {
    if (expandedCourses.length === Object.keys(groupedContracts).length) {
      setExpandedCourses([]);
    } else {
      setExpandedCourses(Object.keys(groupedContracts));
    }
  };

  // Group study contracts by course name
  const groupedContracts = studyContracts.reduce((acc, contract) => {
    const courseName = contract.schedule?.course?.course_name || "Unknown";
    if (!acc[courseName]) {
      acc[courseName] = [];
    }
    acc[courseName].push(contract);
    return acc;
  }, {} as Record<string, StudyContract[]>);

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
          <SheetTitle className="text-2xl">
            Study Contracts for Student {studentId}
          </SheetTitle>
        </SheetHeader>
        <div className="py-4">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <Loader2 className="h-8 w-8 animate-spin" />
              <span className="ml-2">Loading Study Contracts...</span>
            </div>
          ) : studyContracts.length > 0 ? (
            <>
              <Button onClick={toggleAllAccordions} className="mb-4">
                {expandedCourses.length === Object.keys(groupedContracts).length
                  ? "Collapse All"
                  : "Expand All"}
              </Button>
              <Accordion
                type="multiple"
                value={expandedCourses}
                onValueChange={setExpandedCourses}
              >
                {Object.entries(groupedContracts).map(
                  ([courseName, contracts]) => (
                    <AccordionItem key={courseName} value={courseName}>
                      <AccordionTrigger>
                        <div className="flex justify-between w-full pr-4">
                          <span>{courseName}</span>
                          <span>
                            Rp
                            {contracts[0].schedule?.course?.price.toLocaleString(
                              "id-ID"
                            )}
                          </span>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent>
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Schedule ID</TableHead>
                              <TableHead>Day</TableHead>
                              <TableHead>Start Time</TableHead>
                              <TableHead>Duration (hours)</TableHead>
                              <TableHead>Teacher</TableHead>
                              <TableHead>Actions</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {contracts.map((contract) => (
                              <TableRow key={contract.id}>
                                <TableCell>{contract.Schedule_id}</TableCell>
                                <TableCell>
                                  {numberToDay(contract.schedule.day)}
                                </TableCell>
                                <TableCell>
                                  {contract.schedule?.start_time}
                                </TableCell>
                                <TableCell>
                                  {contract.schedule?.duration}
                                </TableCell>
                                <TableCell>
                                  {contract.schedule?.teacher?.name}
                                </TableCell>
                                <TableCell>
                                  <Button
                                    className="w-[35px] h-[35px] bg-red-600 hover:bg-red-700"
                                    onClick={() =>
                                      handleDeleteContract(contract.id)
                                    }
                                  >
                                    <Trash2 className="text-white" />
                                  </Button>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </AccordionContent>
                    </AccordionItem>
                  )
                )}
              </Accordion>
            </>
          ) : (
            <div className="text-center">
              No study contracts found for this student.
            </div>
          )}
        </div>
        <div className="flex justify-between items-center">
          <div>Total Amount: Rp{totalAmount.toLocaleString("id-ID")}</div>
          <div className="flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">{paymentMethod}</Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuLabel>Payment Method</DropdownMenuLabel>
                <DropdownMenuItem onClick={() => setPaymentMethod("Transfer")}>
                  Bank Transfer
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setPaymentMethod("Cash")}>
                  Cash
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Button onClick={handleCreateInvoice}>Make Invoice</Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
