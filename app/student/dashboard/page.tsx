"use client";

import { useEffect, useState } from "react";
import { getStudyContractsByStudentId } from "../controllers/study_contract.controller";
import { getStudentIdByEmail } from "../controllers/student.controller";
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
import { numberToDay } from "@/app/lib/numToDay";
import Navbar from "@/app/components/Navbar";
import { Calendar } from "@/components/ui/calendar";
import { addDays, isSameDay } from "date-fns";
import { useToast } from "@/hooks/use-toast";

interface StudyContract {
  id: number;
  Schedule_id: number;
  schedule: {
    course: {
      course_name: string;
    };
    teacher: {
      name: string;
    };
    day: number;
    start_time: string;
    duration: number;
  };
}

export default function StudentDashboard() {
  const [studyContracts, setStudyContracts] = useState<StudyContract[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [studentId, setStudentId] = useState<number | null>(null);
  const [sessionData, setSessionData] = useState<Session | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    new Date()
  );
  const { toast } = useToast();

  useEffect(() => {
    async function fetchSessionAndStudentId() {
      try {
        const session = await getSession();

        if (!session) {
          throw new Error("No session found");
        }

        setSessionData(session);

        if (!session.user?.email) {
          throw new Error("No user email found in session");
        }

        const id = await getStudentIdByEmail(session.user.email);
        if (!id) {
          throw new Error("No student ID found for this email");
        }

        setStudentId(id);
      } catch (err) {
        setError(
          err instanceof Error ? err : new Error("An unknown error occurred")
        );
        setLoading(false);
      }
    }

    fetchSessionAndStudentId();
  }, []);

  useEffect(() => {
    async function fetchStudyContracts() {
      if (!studentId) return;

      try {
        const data = await getStudyContractsByStudentId(studentId);
        if (!data) {
          throw new Error("No study contracts data received");
        }
        setStudyContracts(data);
      } catch (err) {
        setError(
          err instanceof Error ? err : new Error("An unknown error occurred")
        );
      } finally {
        setLoading(false);
      }
    }

    fetchStudyContracts();
  }, [studentId]);

  const getDatesWithContracts = (selectedDate: Date) => {
    const datesWithContracts: Date[] = [];

    studyContracts.forEach((contract) => {
      const dayOfWeek = contract.schedule.day; // 1 = Monday, 2 = Tuesday, etc.
      const startTime = contract.schedule.start_time; // e.g., "09:00"

      // Calculate the date for the selected week
      const selectedDay = selectedDate.getDay(); // 0 = Sunday, 1 = Monday, etc.
      const daysToAdd = (dayOfWeek - selectedDay + 7) % 7;
      const nextDay = addDays(selectedDate, daysToAdd);

      // Combine the date and time
      const [hours, minutes] = startTime.split(":").map(Number);
      const dateWithTime = new Date(
        nextDay.getFullYear(),
        nextDay.getMonth(),
        nextDay.getDate(),
        hours,
        minutes
      );

      datesWithContracts.push(dateWithTime);
    });

    return datesWithContracts;
  };

  const hasStudyContract = (date: Date) => {
    return getDatesWithContracts(date).some((contractDate) =>
      isSameDay(contractDate, date)
    );
  };

  const handleDateClick = (date: Date) => {
    if (hasStudyContract(date)) {
      const contractsOnDate = studyContracts.filter((contract) => {
        const dayOfWeek = contract.schedule.day;
        const startTime = contract.schedule.start_time;
        const [hours, minutes] = startTime.split(":").map(Number);

        // Calculate the date for the selected week
        const selectedDay = date.getDay(); // 0 = Sunday, 1 = Monday, etc.
        const daysToAdd = (dayOfWeek - selectedDay + 7) % 7;
        const contractDate = addDays(date, daysToAdd);

        // Set the time for the contract
        contractDate.setHours(hours, minutes, 0, 0);

        return isSameDay(contractDate, date);
      });

      contractsOnDate.forEach((contract) => {
        toast({
          title: "Study Contract Details",
          description: (
            <div>
              <p>Course: {contract.schedule.course.course_name}</p>
              <p>Teacher: {contract.schedule.teacher.name}</p>
              <p>Day: {numberToDay(contract.schedule.day)}</p>
              <p>Start Time: {contract.schedule.start_time}</p>
              <p>Duration: {contract.schedule.duration} hours</p>
            </div>
          ),
        });
      });
    }
  };

  if (error) {
    return <div className="p-6 text-red-600">Error: {error.message}</div>;
  }

  return (
    <div>
      <Navbar title={`Welcome, ${sessionData?.user.name || ""}`} />

      {loading && (
        <div className="p-6 text-center">Getting student's schedule...</div>
      )}

      {!loading && (
        <div className="p-6 flex gap-5">
          {/* Calendar Section */}
          <div>
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={(date) => {
                setSelectedDate(date);
                if (date) handleDateClick(date);
              }}
              modifiers={{
                hasContract: (date) => hasStudyContract(date),
                isSunday: (date) => date.getDay() === 0, // Highlight Sundays
              }}
              modifiersStyles={{
                hasContract: {
                  backgroundColor: "#3b82f6", // Blue background for days with contracts
                  color: "white", // White text for better contrast
                },
                isSunday: {
                  color: "red", // Red text for Sundays
                },
              }}
              className="w-full"
            />
          </div>

          {/* Study Contracts Table */}
          {studyContracts.length > 0 ? (
            <div className="w-full">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Schedule ID</TableHead>
                    <TableHead>Course Name</TableHead>
                    <TableHead>Teacher Name</TableHead>
                    <TableHead>Day</TableHead>
                    <TableHead>Start Time</TableHead>
                    <TableHead>Duration</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {studyContracts.map((contract) => (
                    <TableRow key={contract.id}>
                      <TableCell>{contract.Schedule_id}</TableCell>
                      <TableCell>
                        {contract.schedule.course.course_name}
                      </TableCell>
                      <TableCell>{contract.schedule.teacher.name}</TableCell>
                      <TableCell>
                        {numberToDay(contract.schedule.day)}
                      </TableCell>
                      <TableCell>{contract.schedule.start_time}</TableCell>
                      <TableCell>{contract.schedule.duration} hours</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <p className="p-6">No schedule found.</p>
          )}
        </div>
      )}
    </div>
  );
}
