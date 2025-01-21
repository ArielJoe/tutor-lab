"use client";

import { useEffect, useState } from "react";
import { getInvoicesByStudentId } from "@/app/student/actions/invoice/actions";
import { getStudentIdByEmail } from "@/app/student/actions/student/actions";
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
import { Eye } from "lucide-react"; // Import the Eye icon
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"; // Import Dialog components

export default function StudentInvoice() {
  const [invoices, setInvoices] = useState<any>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<any>(null);
  const [studentId, setStudentId] = useState<number | null>(null);
  const [sessionData, setSessionData] = useState<Session | null>(null);
  const [selectedInvoice, setSelectedInvoice] = useState<any>(null); // State to store selected invoice details
  const [isDetailsOpen, setIsDetailsOpen] = useState(false); // State to control details dialog visibility

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
        } catch (err) {
          setError(err);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchInvoices();
  }, [studentId]);

  // Function to handle transaction creation for a specific invoice
  const handleCreateTransaction = async (amount: number, invoiceId: number) => {
    const data = {
      id: invoiceId, // Use the invoice ID
      productName: "Invoice Payment", // You can customize this
      price: amount, // Use the invoice amount
      quantity: 1, // Quantity is 1 for invoice payments
    };

    try {
      const response = await fetch("/api/midtrans", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Failed to create transaction token");
      }

      const requestData = await response.json();
      console.log("Transaction Token:", requestData.token);

      // Redirect the user to the Midtrans payment page
      if (requestData.token) {
        window.location.href = `https://app.sandbox.midtrans.com/snap/v2/vtweb/${requestData.token}`;
      }
    } catch (error) {
      console.error("Error during checkout:", error);
    }
  };

  // Function to handle showing invoice details
  const handleShowDetails = (invoice: any) => {
    setSelectedInvoice(invoice); // Set the selected invoice
    setIsDetailsOpen(true); // Open the details dialog
  };

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
                      Rp{invoice.amount.toLocaleString("id-ID")}
                    </TableCell>
                    <TableCell>{invoice.method}</TableCell>
                    <TableCell className="flex gap-2">
                      <Button
                        size="icon"
                        className="bg-blue-500 hover:bg-blue-600 text-white"
                        onClick={() => handleShowDetails(invoice)} // Open details dialog
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      {/* <Button
                        onClick={() =>
                          handleCreateTransaction(invoice.amount, invoice.id)
                        }
                      >
                        Pay Now
                      </Button> */}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <p className="p-6">No invoices found.</p>
          )}
        </div>
      )}

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
                <p>Rp{selectedInvoice.amount.toLocaleString("id-ID")}</p>
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
                          {selectedCourse.course.price.toLocaleString("id-ID")})
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
