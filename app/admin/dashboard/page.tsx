"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import Navbar from "../../components/Navbar";
import { getStudents } from "../actions/student/actions";
import { useEffect, useState } from "react";
import { getTeachers } from "../actions/teacher/actions";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Label,
  Pie,
  PieChart,
  PolarAngleAxis,
  PolarGrid,
  Radar,
  RadarChart,
} from "recharts";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Log, Student, Teacher } from "@/app/lib/interfaces";
import { getLogs } from "../actions/log/actions"; // Import the Prisma action
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"; // shadcn/ui table components
import { Button } from "@/components/ui/button"; // shadcn/ui button component
import { Input } from "@/components/ui/input"; // shadcn/ui input component
import { getInvoices } from "../actions/invoice/actions";

export default function Dashboard() {
  const [students, setStudents] = useState<Student[]>([]);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [logs, setLogs] = useState<Log[]>([]); // State for logs
  const [invoices, setInvoices] = useState<any[]>([]); // State for invoices
  const [currentPage, setCurrentPage] = useState(1); // Pagination state
  const [startDate, setStartDate] = useState<string>(""); // Start date filter
  const [endDate, setEndDate] = useState<string>(""); // End date filter
  const rowsPerPage = 5; // Number of rows per page

  useEffect(() => {
    const fetchData = async () => {
      const studentData = await getStudents();
      const teacherData = await getTeachers();
      const logData = await getLogs();
      const invoiceData = await getInvoices(); // Fetch invoices
      setStudents(studentData);
      setTeachers(teacherData);
      setLogs(logData);
      setInvoices(invoiceData);
    };

    fetchData();
  }, []);

  // Filter logs by timestamp range
  const filteredLogs = logs.filter((log) => {
    const logDate = new Date(log.changed_at).getTime();
    const start = startDate ? new Date(startDate).getTime() : 0;
    const end = endDate ? new Date(endDate).getTime() : Infinity;
    return logDate >= start && logDate <= end;
  });

  // Calculate the logs to display for the current page
  const indexOfLastLog = currentPage * rowsPerPage;
  const indexOfFirstLog = indexOfLastLog - rowsPerPage;
  const currentLogs = filteredLogs.slice(indexOfFirstLog, indexOfLastLog);

  // Total number of pages
  const totalPages = Math.ceil(filteredLogs.length / rowsPerPage);

  // Handle page change
  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  // Handle date filter changes
  const handleStartDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setStartDate(e.target.value);
    setCurrentPage(1); // Reset to the first page when the filter changes
  };

  const handleEndDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEndDate(e.target.value);
    setCurrentPage(1); // Reset to the first page when the filter changes
  };

  // Data for the pie chart (Students and Teachers)
  const studentTeacherChartData = [
    {
      category: "Students",
      count: students.length,
      fill: "hsl(var(--chart-1))", // Color for Students
    },
    {
      category: "Teachers",
      count: teachers.length,
      fill: "hsl(var(--chart-2))", // Color for Teachers
    },
  ];

  const totalCount = students.length + teachers.length;

  const studentTeacherChartConfig = {
    count: {
      label: "Count",
    },
    Students: {
      label: "Students",
    },
    Teachers: {
      label: "Teachers",
    },
  } satisfies ChartConfig;

  // Data for the pie chart (Pending, Paid, and Overdue Invoices)
  const pendingPaidChartData = [
    {
      category: "Pending",
      count: invoices.filter((invoice) => invoice.status === "Pending").length,
      fill: "hsl(var(--chart-3))", // Color for Pending
    },
    {
      category: "Paid",
      count: invoices.filter((invoice) => invoice.status === "Paid").length,
      fill: "hsl(var(--chart-4))", // Color for Paid
    },
    {
      category: "Overdue",
      count: invoices.filter(
        (invoice) =>
          invoice.status === "Pending" &&
          new Date(invoice.due_date).setHours(0, 0, 0, 0) <
            new Date().setHours(0, 0, 0, 0)
      ).length,
      fill: "hsl(var(--chart-5))", // Color for Overdue
    },
  ];

  const totalInvoicesCount = invoices.length;

  const pendingPaidChartConfig = {
    count: {
      label: "Count",
    },
    Pending: {
      label: "Pending",
    },
    Paid: {
      label: "Paid",
    },
    Overdue: {
      label: "Overdue",
    },
  } satisfies ChartConfig;

  // Data for the radar chart
  const actionCounts = logs.reduce(
    (acc, log) => {
      if (log.action === "INSERT") acc.insert++;
      if (log.action === "UPDATE") acc.update++;
      if (log.action === "DELETE") acc.delete++;
      return acc;
    },
    { insert: 0, update: 0, delete: 0 }
  );

  const radarChartData = [
    {
      action: "Insert",
      count: actionCounts.insert,
    },
    {
      action: "Update",
      count: actionCounts.update,
    },
    {
      action: "Delete",
      count: actionCounts.delete,
    },
  ];

  const radarChartConfig = {
    insert: {
      label: "Insert",
      color: "hsl(var(--chart-1))",
    },
    update: {
      label: "Update",
      color: "hsl(var(--chart-2))",
    },
    delete: {
      label: "Delete",
      color: "hsl(var(--chart-3))",
    },
  } satisfies ChartConfig;

  return (
    <div>
      <Navbar title="Dashboard" />
      <div className="w-full flex p-5 gap-5">
        {/* Chart Section */}
        <div className="w-full flex gap-5">
          {/* Pie Chart Card (Students and Teachers) */}
          <Card className="flex-1 flex flex-col">
            <CardHeader className="pb-0">
              <CardTitle className="text-2xl text-left">
                Student and Teacher
                <br /> Distribution
              </CardTitle>
            </CardHeader>
            <CardContent className="flex-1 pb-0">
              <ChartContainer
                config={studentTeacherChartConfig}
                className="mx-auto aspect-square max-h-[250px]"
              >
                <PieChart>
                  <ChartTooltip
                    cursor={false}
                    content={<ChartTooltipContent hideLabel />}
                  />
                  <Pie
                    data={studentTeacherChartData}
                    dataKey="count"
                    nameKey="category"
                    innerRadius={60}
                    strokeWidth={5}
                    fill="#8884d8" // Default fill color
                  >
                    {studentTeacherChartData.map((entry, index) => (
                      <Pie
                        key={`cell-${index}`}
                        data={[entry]}
                        dataKey="count"
                        nameKey="category"
                        fill={entry.fill}
                      />
                    ))}
                    <Label
                      content={({ viewBox }) => {
                        if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                          return (
                            <text
                              x={viewBox.cx}
                              y={viewBox.cy}
                              textAnchor="middle"
                              dominantBaseline="middle"
                            >
                              <tspan
                                x={viewBox.cx}
                                y={viewBox.cy}
                                className="fill-foreground text-3xl font-bold"
                              >
                                {totalCount}
                              </tspan>
                              <tspan
                                x={viewBox.cx}
                                y={(viewBox.cy || 0) + 24}
                                className="fill-muted-foreground"
                              >
                                Total
                              </tspan>
                            </text>
                          );
                        }
                      }}
                    />
                  </Pie>
                </PieChart>
              </ChartContainer>
              {/* Custom Legend for Students and Teachers */}
              <div className="flex justify-center gap-4 mt-4">
                {studentTeacherChartData.map((entry, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <div
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: entry.fill }}
                    ></div>
                    <span className="text-sm">
                      {entry.category}: {entry.count}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter className="flex-col gap-2 text-sm">
              <div className="leading-none text-muted-foreground">
                Showing total students and teachers
              </div>
            </CardFooter>
          </Card>

          {/* Pie Chart Card (Pending, Paid, and Overdue Invoices) */}
          <Card className="flex-1 flex flex-col">
            <CardHeader className="pb-0">
              <CardTitle className="text-2xl text-left">
                Invoice Status
                <br />
                Distribution
              </CardTitle>
            </CardHeader>
            <CardContent className="flex-1 pb-0">
              <ChartContainer
                config={pendingPaidChartConfig}
                className="mx-auto aspect-square max-h-[250px]"
              >
                <PieChart>
                  <ChartTooltip
                    cursor={false}
                    content={<ChartTooltipContent hideLabel />}
                  />
                  <Pie
                    data={pendingPaidChartData}
                    dataKey="count"
                    nameKey="category"
                    innerRadius={60}
                    strokeWidth={5}
                    fill="#8884d8" // Default fill color
                  >
                    {pendingPaidChartData.map((entry, index) => (
                      <Pie
                        key={`cell-${index}`}
                        data={[entry]}
                        dataKey="count"
                        nameKey="category"
                        fill={entry.fill}
                      />
                    ))}
                    <Label
                      content={({ viewBox }) => {
                        if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                          return (
                            <text
                              x={viewBox.cx}
                              y={viewBox.cy}
                              textAnchor="middle"
                              dominantBaseline="middle"
                            >
                              <tspan
                                x={viewBox.cx}
                                y={viewBox.cy}
                                className="fill-foreground text-3xl font-bold"
                              >
                                {totalInvoicesCount}
                              </tspan>
                              <tspan
                                x={viewBox.cx}
                                y={(viewBox.cy || 0) + 24}
                                className="fill-muted-foreground"
                              >
                                Total
                              </tspan>
                            </text>
                          );
                        }
                      }}
                    />
                  </Pie>
                </PieChart>
              </ChartContainer>
              {/* Custom Legend for Pending, Paid, and Overdue Invoices */}
              <div className="flex justify-center gap-4 mt-4">
                {pendingPaidChartData.map((entry, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <div
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: entry.fill }}
                    ></div>
                    <span className="text-sm">
                      {entry.category}: {entry.count}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter className="flex-col gap-2 text-sm mt-4">
              <div className="leading-none text-muted-foreground">
                Showing total pending, paid, and overdue invoices
              </div>
            </CardFooter>
          </Card>

          {/* Radar Chart Card */}
          <Card className="flex-1 flex flex-col">
            <CardHeader className="pb-0">
              <CardTitle className="text-2xl text-left">
                Action Distribution
                <br />
                <br />
                <br />
              </CardTitle>
            </CardHeader>
            <CardContent className="flex-1 pb-0">
              <ChartContainer
                config={radarChartConfig}
                className="mx-auto aspect-square max-h-[250px]"
              >
                <RadarChart data={radarChartData}>
                  <ChartTooltip
                    cursor={false}
                    content={<ChartTooltipContent />}
                  />
                  <PolarAngleAxis dataKey="action" />
                  <PolarGrid />
                  <Radar
                    dataKey="count"
                    fill="var(--color-insert)"
                    fillOpacity={0.6}
                    dot={{
                      r: 4,
                      fillOpacity: 1,
                    }}
                  />
                </RadarChart>
              </ChartContainer>
            </CardContent>
            <CardFooter className="flex-col gap-2 text-sm mt-4">
              <div className="leading-none text-muted-foreground">
                Showing the count of Insert, Update, and Delete
              </div>
            </CardFooter>
          </Card>
        </div>
      </div>

      {/* Logs Section */}
      <div className="px-5 pb-5">
        <Card>
          <CardHeader className="">
            <CardTitle className="text-2xl">Activity Logs</CardTitle>
            <CardDescription>Recent changes in the system</CardDescription>

            <div className="flex gap-4 mb-4 absolute right-12">
              <Input
                type="date"
                value={startDate}
                onChange={handleStartDateChange}
                placeholder="Start Date"
              />
              <Input
                type="date"
                value={endDate}
                onChange={handleEndDateChange}
                placeholder="End Date"
              />
            </div>
          </CardHeader>
          <CardContent>
            {/* Logs Table */}
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Table</TableHead>
                  <TableHead>Action</TableHead>
                  <TableHead>Record ID</TableHead>
                  <TableHead>Details</TableHead>
                  <TableHead>Timestamp</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentLogs.map((log) => (
                  <TableRow key={log.id}>
                    <TableCell>{log.table_name}</TableCell>
                    <TableCell>{log.action}</TableCell>
                    <TableCell>{log.record_id}</TableCell>
                    <TableCell>{log.change_details}</TableCell>
                    <TableCell>{log.changed_at}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {/* Pagination Controls */}
            <div className="flex justify-between items-center mt-4">
              <Button
                variant="outline"
                onClick={handlePrevPage}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="h-4 w-4" />
                Previous
              </Button>
              <span>
                Page {currentPage} of {totalPages}
              </span>
              <Button
                variant="outline"
                onClick={handleNextPage}
                disabled={currentPage === totalPages}
              >
                Next
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
