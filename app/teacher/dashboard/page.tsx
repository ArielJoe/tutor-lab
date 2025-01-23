"use client";

import { useEffect, useState } from "react";
import { getTeacherIdByEmail } from "../actions/teacher/actions";
import { getSchedulesByTeacherId } from "../actions/schedule/actions";
import { getStudyContracts } from "../actions/study_contract/actions";
import { getStudentsByIds } from "../actions/student/actions";
import { Session } from "next-auth";
import { getSession } from "@/app/lib/session";
import { numberToDay } from "@/app/lib/numToDay";
import Navbar from "@/app/components/Navbar";
import { Calendar } from "@/components/ui/calendar";
import { addDays, isSameDay } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button"; // Import Button component
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"; // Import Dialog components

export default function TeacherScheduleTable() {
  const [schedules, setSchedules] = useState<any[]>([]);
  const [studyContracts, setStudyContracts] = useState<any[]>([]);
  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<any>(null);
  const [sessionData, setSessionData] = useState<Session | null>(null);
  const [teacherId, setTeacherId] = useState<number | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    new Date()
  );
  const { toast } = useToast();

  // Fetch session and teacher ID
  useEffect(() => {
    async function fetchSessionAndTeacherId() {
      const session = await getSession();
      setSessionData(session);

      if (session?.user?.email) {
        try {
          const id = await getTeacherIdByEmail(session.user.email);
          setTeacherId(id);
        } catch (err) {
          setError(err);
        }
      }
    }

    fetchSessionAndTeacherId();
  }, []);

  // Fetch schedules, study contracts, and students
  useEffect(() => {
    const fetchData = async () => {
      if (teacherId) {
        try {
          // Fetch schedules for the teacher
          const schedules = await getSchedulesByTeacherId(teacherId);
          setSchedules(schedules);

          // Fetch all study contracts
          const studyContracts = await getStudyContracts();
          setStudyContracts(studyContracts);

          // Extract unique Student IDs from study contracts
          const studentIds = Array.from(
            new Set(studyContracts.map((contract) => contract.Student_id))
          );

          // Fetch students by their IDs
          const students = await getStudentsByIds(studentIds);
          setStudents(students);
        } catch (err) {
          setError(err);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchData();
  }, [teacherId]);

  // Function to filter study contracts by schedule ID and map students
  const getStudentsForSchedule = (scheduleId: number) => {
    // Get Student IDs for the given schedule
    const studentIds = studyContracts
      .filter((contract) => contract.Schedule_id === scheduleId)
      .map((contract) => contract.Student_id);

    // Find students by their IDs
    return students.filter((student) => studentIds.includes(student.id));
  };

  // Function to get dates with schedules
  const getDatesWithSchedules = (selectedDate: Date) => {
    const datesWithSchedules: Date[] = [];

    schedules.forEach((schedule: any) => {
      const dayOfWeek = schedule.day;
      const startTime = schedule.start_time;

      const selectedDay = selectedDate.getDay();
      const daysToAdd = (dayOfWeek - selectedDay + 7) % 7;
      const nextDay = addDays(selectedDate, daysToAdd);

      const [hours, minutes] = startTime.split(":").map(Number);
      const dateWithTime = new Date(
        nextDay.getFullYear(),
        nextDay.getMonth(),
        nextDay.getDate(),
        hours,
        minutes
      );

      datesWithSchedules.push(dateWithTime);
    });

    return datesWithSchedules;
  };

  // Function to check if a date has a schedule
  const hasSchedule = (date: Date) => {
    return getDatesWithSchedules(date).some((scheduleDate) =>
      isSameDay(scheduleDate, date)
    );
  };

  // Function to handle date click
  const handleDateClick = (date: Date) => {
    if (hasSchedule(date)) {
      const schedulesOnDate = schedules.filter((schedule: any) => {
        const dayOfWeek = schedule.day;
        const startTime = schedule.start_time;
        const [hours, minutes] = startTime.split(":").map(Number);

        const selectedDay = date.getDay();
        const daysToAdd = (dayOfWeek - selectedDay + 7) % 7;
        const scheduleDate = addDays(date, daysToAdd);

        scheduleDate.setHours(hours, minutes, 0, 0);

        return isSameDay(scheduleDate, date);
      });

      schedulesOnDate.forEach((schedule: any) => {
        const students = getStudentsForSchedule(schedule.id);
        toast({
          title: "Schedule Details",
          description: (
            <div>
              <p>Course: {schedule.course.course_name}</p>
              <p>Day: {numberToDay(schedule.day)}</p>
              <p>Start Time: {schedule.start_time}</p>
              <p>Duration: {schedule.duration} hours</p>
              <p>
                Students:{" "}
                {students
                  .map((student: any) => student?.name || "Unknown Student")
                  .join(", ") || "No Student"}
              </p>
            </div>
          ),
        });
      });
    }
  };

  if (error) {
    return <div className="p-6">Error: {error.message}</div>;
  }

  return (
    <div>
      <Navbar title={`Welcome, ${sessionData?.user?.name || ""}`} />

      {loading && (
        <div className="p-6 text-center">Fetching teacher's schedule...</div>
      )}

      {!loading && (
        <div className="p-6 flex gap-5">
          <div>
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={(date) => {
                setSelectedDate(date);
                if (date) handleDateClick(date);
              }}
              modifiers={{
                hasSchedule: (date) => hasSchedule(date),
                isSunday: (date) => date.getDay() === 0,
              }}
              modifiersStyles={{
                hasSchedule: {
                  backgroundColor: "#3b82f6",
                  color: "white",
                },
                isSunday: {
                  color: "red",
                },
              }}
              className="w-full"
            />
          </div>

          {schedules.length > 0 ? (
            <div className="w-full">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Schedule ID</TableHead>
                    <TableHead>Day</TableHead>
                    <TableHead>Start Time</TableHead>
                    <TableHead>Duration</TableHead>
                    <TableHead>Course</TableHead>
                    <TableHead>Students</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {schedules.map((schedule: any) => {
                    const students = getStudentsForSchedule(schedule.id);
                    return (
                      <TableRow key={schedule.id}>
                        <TableCell>{schedule.id}</TableCell>
                        <TableCell>{numberToDay(schedule.day)}</TableCell>
                        <TableCell>{schedule.start_time}</TableCell>
                        <TableCell>{schedule.duration} hours</TableCell>
                        <TableCell>{schedule.course.course_name}</TableCell>
                        <TableCell>
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button variant="outline">
                                View Students ({students.length})
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle className="text-2xl">
                                  Students
                                </DialogTitle>
                              </DialogHeader>
                              <div>
                                {students.length > 0 ? (
                                  <ul>
                                    {students.map((student: any) => (
                                      <li key={student.id}>
                                        {student.name} - {student.email}
                                      </li>
                                    ))}
                                  </ul>
                                ) : (
                                  <p>No students found for this schedule.</p>
                                )}
                              </div>
                            </DialogContent>
                          </Dialog>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          ) : (
            <p>No schedules found.</p>
          )}
        </div>
      )}
    </div>
  );
}
