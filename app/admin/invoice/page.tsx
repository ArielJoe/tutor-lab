"use client";

import { useEffect, useState } from "react";
import Navbar from "@/app/components/Navbar";
import {
  getInvoices,
  confirmPayment,
  cancelPayment,
  deleteInvoice,
} from "../actions/invoice/actions";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { Trash2 } from "lucide-react";

export default function Invoice() {
  const [invoices, setInvoices] = useState<any[]>([]);

  useEffect(() => {
    const fetchInvoices = async () => {
      const data = await getInvoices();
      setInvoices(data);
    };

    fetchInvoices();
  }, []);

  const handleConfirmPayment = async (invoiceId: number) => {
    try {
      await confirmPayment(invoiceId);
      setInvoices((prevInvoices) =>
        prevInvoices.map((invoice) =>
          invoice.id === invoiceId ? { ...invoice, status: "Paid" } : invoice
        )
      );
      toast({
        description: "Payment confirmed successfully!",
      });
    } catch (error) {
      console.error("Failed to confirm payment:", error);
      toast({
        description: "Failed to confirm payment. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleCancelPayment = async (invoiceId: number) => {
    try {
      await cancelPayment(invoiceId);
      setInvoices((prevInvoices) =>
        prevInvoices.map((invoice) =>
          invoice.id === invoiceId ? { ...invoice, status: "Pending" } : invoice
        )
      );
      toast({
        description: "Payment cancellation successful!",
      });
    } catch (error) {
      console.error("Failed to cancel payment:", error);
      toast({
        description: "Failed to cancel payment. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteInvoice = async (invoiceId: number) => {
    try {
      await deleteInvoice(invoiceId);
      setInvoices((prevInvoices) =>
        prevInvoices.filter((invoice) => invoice.id !== invoiceId)
      );
      toast({
        description: "Invoice deleted successfully!",
      });
    } catch (error) {
      console.error("Failed to delete invoice:", error);
      toast({
        description: "Failed to delete invoice. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div>
      <Navbar title="Invoice" />
      <div className="p-4">
        {invoices.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Invoice ID</TableHead>
                <TableHead>Student Name</TableHead>
                <TableHead>Created At</TableHead>
                <TableHead>Due Date</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Payment Method</TableHead>
                <TableHead className="text-right">Status</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {invoices.map((invoice) => (
                <TableRow key={invoice.id}>
                  <TableCell>{invoice.id}</TableCell>
                  <TableCell>{invoice.student?.name || "N/A"}</TableCell>
                  <TableCell>
                    {new Date(invoice.created_at).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    {new Date(invoice.due_date).toLocaleDateString()}
                  </TableCell>
                  <TableCell>Rp{invoice.amount.toFixed(2)}</TableCell>
                  <TableCell>{invoice.method}</TableCell>
                  <TableCell className="text-right">
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
                  <TableCell className="flex gap-2">
                    {invoice.status === "Pending" ? (
                      <Button
                        onClick={() => handleConfirmPayment(invoice.id)}
                        className="bg-blue-500 hover:bg-blue-600 text-white"
                      >
                        Confirm Payment
                      </Button>
                    ) : (
                      <Button
                        onClick={() => handleCancelPayment(invoice.id)}
                        className="bg-red-500 hover:bg-red-600 text-white"
                      >
                        Cancel Payment
                      </Button>
                    )}
                    <Button
                      className="bg-red-500 rounded-md flex justify-center items-center w-[35px] h-[35px]"
                      onClick={() => handleDeleteInvoice(invoice.id)}
                    >
                      <Trash2 className="text-black w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <div className="text-center">No invoices found.</div>
        )}
      </div>
    </div>
  );
}
