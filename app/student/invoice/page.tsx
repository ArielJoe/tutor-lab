"use client";

import { useEffect, useState } from "react";
import { getInvoicesByStudentId } from "@/app/student/controllers/invoice.controller";
import { getStudentIdByEmail } from "@/app/student/controllers/student.controller";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getSession } from "@/app/lib/session";
import { Session } from "next-auth";
import Navbar from "@/app/components/Navbar";
import { Button } from "@/components/ui/button";
import { Eye, AlertCircle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

export default function StudentInvoice() {
  const [invoices, setInvoices] = useState<any>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<any>(null);
  const [studentId, setStudentId] = useState<number | null>(null);
  const [sessionData, setSessionData] = useState<Session | null>(null);
  const [selectedInvoice, setSelectedInvoice] = useState<any>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [hasPendingInvoices, setHasPendingInvoices] = useState(false); // State untuk mengecek invoice pending
  const [isReminderDialogOpen, setIsReminderDialogOpen] = useState(false); // State untuk mengontrol dialog reminder

  // Fetch session and student ID
  useEffect(() => {
    async function fetchSessionAndStudentId() {
      const session = await getSession();

      if (!session) {
        console.error("No session found. Redirecting to login...");
        setError(new Error("No session found. Please log in."));
        return;
      }

      setSessionData(session);

      if (session.user?.email) {
        try {
          const id = await getStudentIdByEmail(session.user.email);
          setStudentId(id);
        } catch (err) {
          setError(err);
        }
      } else {
        console.error("User email is missing in session:", session);
        setError(new Error("User email is missing in session"));
      }
    }

    fetchSessionAndStudentId();
  }, []);

  // Fetch invoices using the student ID
  useEffect(() => {
    const fetchInvoices = async () => {
      if (studentId) {
        try {
          const data = await getInvoicesByStudentId(studentId);
          setInvoices(data);

          // Cek apakah ada invoice dengan status "Pending"
          const pendingInvoices = data.filter(
            (invoice: any) => invoice.status === "Pending"
          );
          setHasPendingInvoices(pendingInvoices.length > 0);
        } catch (err) {
          setError(err);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchInvoices();
  }, [studentId]);

  // Function to handle showing invoice details
  const handleShowDetails = (invoice: any) => {
    setSelectedInvoice(invoice);
    setIsDetailsOpen(true);
  };

  // Function to handle reminder click
  const handleReminderClick = () => {
    setIsReminderDialogOpen(true); // Buka dialog reminder
  };

  // Dapatkan daftar invoice yang masih "Pending"
  const pendingInvoices = invoices.filter(
    (invoice: any) => invoice.status === "Pending"
  );

  if (error) {
    return <div className="p-6">Error: {error.message}</div>;
  }

  return (
    <div>
      <Navbar title={`${sessionData?.user.name || ""}'s Invoice`} />

      {loading && (
        <div className="p-6 text-center">Getting student's invoice...</div>
      )}

      {!loading && (
        <div className="p-6">
          {invoices.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Invoice ID</TableHead>
                  <TableHead>Created At</TableHead>
                  <TableHead>Due Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Method</TableHead>
                  <TableHead>Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {invoices.map((invoice: any) => (
                  <TableRow key={invoice.id}>
                    <TableCell>{invoice.id}</TableCell>
                    <TableCell>{invoice.created_at.toLocaleString()}</TableCell>
                    <TableCell>{invoice.due_date.toLocaleString()}</TableCell>
                    <TableCell>
                      <span
                        className={`inline-block px-3 py-1 rounded-full ${
                          invoice.status === "Pending"
                            ? "bg-yellow-200 text-yellow-800"
                            : "bg-green-200 text-green-800"
                        }`}
                      >
                        {invoice.status}
                      </span>
                    </TableCell>
                    <TableCell>
                      Rp{invoice.amount.toLocaleString("id-ID")},00
                    </TableCell>
                    <TableCell>{invoice.method}</TableCell>
                    <TableCell className="flex gap-2">
                      <Button
                        size="icon"
                        className="bg-blue-500 hover:bg-blue-600 text-white"
                        onClick={() => handleShowDetails(invoice)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <p>No invoices found.</p>
          )}
        </div>
      )}

      {/* Reminder Button */}
      {hasPendingInvoices && (
        <div className="fixed bottom-6 right-6">
          <Button
            variant="destructive"
            className="flex items-center gap-2 shadow-lg"
            onClick={handleReminderClick}
          >
            <AlertCircle className="h-5 w-5" />
            <span>Pending Invoices</span>
          </Button>
        </div>
      )}

      {/* Reminder Dialog */}
      <Dialog
        open={isReminderDialogOpen}
        onOpenChange={setIsReminderDialogOpen}
      >
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Pending Invoices</DialogTitle>
            <DialogDescription>
              You have {pendingInvoices.length} pending invoices. Please
              complete the payment before the due date.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            {pendingInvoices.map((invoice: any) => (
              <div
                key={invoice.id}
                className="border p-4 rounded-lg bg-destructive"
              >
                <div className="flex justify-between items-center">
                  <div className="text-white light:text-secondary">
                    <h3 className="font-medium">Invoice #{invoice.id}</h3>
                    <p className="text-sm">
                      Due Date: {invoice.due_date.toLocaleString()}
                    </p>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleShowDetails(invoice)}
                  >
                    View Details
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>

      {/* Invoice Details Dialog */}
      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Invoice Details</DialogTitle>
            <DialogDescription>
              Details for Invoice #{selectedInvoice?.id}
            </DialogDescription>
          </DialogHeader>
          {selectedInvoice && (
            <div className="space-y-4">
              <div>
                <h3 className="font-medium">Created At:</h3>
                <p>{selectedInvoice.created_at.toLocaleString()}</p>
              </div>
              <div>
                <h3 className="font-medium">Due Date:</h3>
                <p>{selectedInvoice.due_date.toLocaleString()}</p>
              </div>
              <div>
                <h3 className="font-medium">Status:</h3>
                <p>{selectedInvoice.status}</p>
              </div>
              <div>
                <h3 className="font-medium">Amount:</h3>
                <p>Rp{selectedInvoice.amount.toLocaleString("id-ID")},00</p>
              </div>
              <div>
                <h3 className="font-medium">Payment Method:</h3>
                <p>{selectedInvoice.method}</p>
              </div>
              <div>
                <h3 className="font-medium">Courses:</h3>
                {selectedInvoice.selectedCourses?.length > 0 ? (
                  <ul className="list-disc pl-5">
                    {selectedInvoice.selectedCourses.map(
                      (selectedCourse: any, index: number) => (
                        <li key={index}>
                          {selectedCourse.course.course_name} (Rp
                          {selectedCourse.course.price.toLocaleString("id-ID")}
                          ,00)
                        </li>
                      )
                    )}
                  </ul>
                ) : (
                  <p>No courses found for this invoice.</p>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
