"use client";

import { useEffect, useState } from "react";
import { getInvoicesByStudentId } from "../actions/invoice/actions";
import { getStudentIdByEmail } from "../actions/student/actions";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getSession } from "@/app/lib/session";
import { Session } from "next-auth";
import { toast } from "@/hooks/use-toast";
import Navbar from "@/app/components/Navbar";

export default function StudentInvoice() {
  const [invoices, setInvoices] = useState<any>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<any>(null);
  const [studentId, setStudentId] = useState<number | null>(null);
  const [sessionData, setSessionData] = useState<Session | null>(null);

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

  if (loading) {
    return <div className="p-6">Loading...</div>;
  }

  if (error) {
    return <div className="p-6">Error: {error.message}</div>;
  }

  return (
    <div>
      {loading && <div>Loading...</div>}
      <Navbar title={`${sessionData?.user.name}'s Invoice`} />

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
                <TableCell>Rp{invoice.amount}</TableCell>
                <TableCell>{invoice.method}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      ) : (
        <p className="p-6">No invoices found.</p>
      )}
    </div>
  );
}
