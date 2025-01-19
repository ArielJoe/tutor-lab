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
import { Trash2, ChevronLeft, ChevronRight } from "lucide-react";
import { CartesianGrid, Line, LineChart, XAxis } from "recharts";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

// Utility function to format numbers with dots as thousand separators
const formatRevenue = (amount: number) => {
  return amount.toLocaleString("id-ID"); // Indonesian locale uses dots as thousand separators
};

export default function Invoice() {
  const [invoices, setInvoices] = useState<any[]>([]);
  const [chartData, setChartData] = useState<any[]>([]);
  const [isChartOpen, setIsChartOpen] = useState(false); // State to control chart dialog visibility
  const [totalPaid, setTotalPaid] = useState(0);
  const [totalPending, setTotalPending] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const pageSize = 10; // Number of invoices per page

  useEffect(() => {
    const fetchInvoices = async () => {
      const data = await getInvoices();
      setInvoices(data);
      calculateTotals(data);
    };

    fetchInvoices();
  }, []);

  const calculateTotals = (invoices: any[]) => {
    let paidTotal = 0;
    let pendingTotal = 0;

    invoices.forEach((invoice) => {
      if (invoice.status === "Paid") {
        paidTotal += invoice.amount;
      } else if (invoice.status === "Pending") {
        pendingTotal += invoice.amount;
      }
    });

    setTotalPaid(paidTotal);
    setTotalPending(pendingTotal);
  };

  const updateChartData = (invoices: any[]) => {
    const monthlyData = invoices.reduce((acc, invoice) => {
      const month = new Date(invoice.created_at).toLocaleString("default", {
        month: "long",
      });
      if (!acc[month]) {
        acc[month] = { month, paid: 0, pending: 0 };
      }
      if (invoice.status === "Paid") {
        acc[month].paid += invoice.amount;
      } else if (invoice.status === "Pending") {
        acc[month].pending += invoice.amount;
      }
      return acc;
    }, {});

    setChartData(Object.values(monthlyData));
  };

  const handleMakeReport = () => {
    updateChartData(invoices); // Update chart data
    setIsChartOpen(true); // Open the chart dialog
  };

  const handleConfirmPayment = async (invoiceId: number) => {
    try {
      await confirmPayment(invoiceId);
      setInvoices((prevInvoices) =>
        prevInvoices.map((invoice) =>
          invoice.id === invoiceId ? { ...invoice, status: "Paid" } : invoice
        )
      );
      updateChartData(
        invoices.map((invoice) =>
          invoice.id === invoiceId ? { ...invoice, status: "Paid" } : invoice
        )
      );
      calculateTotals(
        invoices.map((invoice) =>
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
      updateChartData(
        invoices.map((invoice) =>
          invoice.id === invoiceId ? { ...invoice, status: "Pending" } : invoice
        )
      );
      calculateTotals(
        invoices.map((invoice) =>
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
      updateChartData(invoices.filter((invoice) => invoice.id !== invoiceId));
      calculateTotals(invoices.filter((invoice) => invoice.id !== invoiceId));
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

  const chartConfig = {
    paid: {
      label: "Paid",
      color: "hsl(var(--chart-1))",
    },
    pending: {
      label: "Pending",
      color: "hsl(var(--chart-2))",
    },
  } satisfies ChartConfig;

  // Custom Legend Component
  const ChartLegend = () => (
    <div className="flex justify-center gap-4 mt-4">
      <div className="flex items-center gap-2">
        <div
          className="w-4 h-4 rounded-full"
          style={{ backgroundColor: "hsl(var(--chart-1))" }}
        />
        <span className="text-sm">Paid: Rp{formatRevenue(totalPaid)}</span>
      </div>
      <div className="flex items-center gap-2">
        <div
          className="w-4 h-4 rounded-full"
          style={{ backgroundColor: "hsl(var(--chart-2))" }}
        />
        <span className="text-sm">
          Pending: Rp{formatRevenue(totalPending)}
        </span>
      </div>
    </div>
  );

  const filterInvoicesByDateRange = (invoices: any[]) => {
    if (!startDate || !endDate) return invoices;

    const start = new Date(startDate);
    const end = new Date(endDate);

    return invoices.filter((invoice) => {
      const invoiceDate = new Date(invoice.created_at);
      return invoiceDate >= start && invoiceDate <= end;
    });
  };

  const filteredInvoices = filterInvoicesByDateRange(invoices);
  const totalPages = Math.ceil(filteredInvoices.length / pageSize);
  const displayedInvoices = filteredInvoices.slice(
    currentPage * pageSize,
    (currentPage + 1) * pageSize
  );

  return (
    <div className="mb-5">
      <Navbar title="Invoice" />
      <div className="p-4">
        {/* Date Range Filter */}
        <div className="flex gap-4 mb-4">
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="p-2 border rounded"
          />
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="p-2 border rounded"
          />
        </div>

        {filteredInvoices.length > 0 ? (
          <>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Invoice ID</TableHead>
                  <TableHead>Student Name</TableHead>
                  <TableHead>Created At</TableHead>
                  <TableHead>Due Date</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Payment Method</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {displayedInvoices.map((invoice) => (
                  <TableRow key={invoice.id}>
                    <TableCell>{invoice.id}</TableCell>
                    <TableCell>{invoice.student?.name}</TableCell>
                    <TableCell>
                      {new Date(invoice.created_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      {new Date(invoice.due_date).toLocaleDateString()}
                    </TableCell>
                    <TableCell>Rp{formatRevenue(invoice.amount)}</TableCell>
                    <TableCell>{invoice.method}</TableCell>
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
                    <TableCell className="flex gap-2">
                      {invoice.status === "Pending" ? (
                        <Button
                          onClick={() => handleConfirmPayment(invoice.id)}
                          className="bg-green-600 hover:bg-green-700 text-white w-[50%]"
                        >
                          Confirm
                        </Button>
                      ) : (
                        <Button
                          onClick={() => handleCancelPayment(invoice.id)}
                          className="bg-yellow-600 hover:bg-yellow-700 text-white w-[50%]"
                        >
                          Cancel
                        </Button>
                      )}
                      <Button
                        className="bg-red-600 hover:bg-red-700 rounded-md flex justify-center items-center w-[35px] h-[35px]"
                        onClick={() => handleDeleteInvoice(invoice.id)}
                      >
                        <Trash2 className="text-white w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            {/* Pagination Controls */}
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
          </>
        ) : (
          <div className="text-center">No invoices found.</div>
        )}

        {/* "Make Report" Button at the Bottom */}
        <div className="mt-5 flex justify-center">
          <Button
            onClick={handleMakeReport}
            className="bg-blue-500 hover:bg-blue-600 text-white"
          >
            Report
          </Button>
        </div>

        {/* Chart Dialog */}
        <Dialog open={isChartOpen} onOpenChange={setIsChartOpen}>
          <DialogContent className="sm:max-w-2xl">
            <DialogHeader>
              <DialogTitle>Revenue Chart - Paid vs Pending</DialogTitle>
              <DialogDescription>Monthly Revenue Overview</DialogDescription>
            </DialogHeader>
            <ChartContainer config={chartConfig}>
              <LineChart
                accessibilityLayer
                data={chartData}
                margin={{
                  left: 12,
                  right: 12,
                }}
              >
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="month"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  tickFormatter={(value) => value.slice(0, 3)}
                />
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent />}
                />
                <Line
                  dataKey="paid"
                  type="monotone"
                  stroke="var(--color-paid)"
                  strokeWidth={2}
                  dot={false}
                />
                <Line
                  dataKey="pending"
                  type="monotone"
                  stroke="var(--color-pending)"
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ChartContainer>
            {/* Custom Legend with Colored Circles */}
            <ChartLegend />
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
