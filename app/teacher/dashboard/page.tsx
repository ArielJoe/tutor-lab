"use client";

import { useEffect, useState } from "react";
import { getSchedulesForTeacher } from "../actions/schedule/actions";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"; // Import shadcn/ui Table components
import { Session } from "next-auth";
import { getSession } from "@/app/lib/session";

export default function TeacherScheduleTable() {
  const [schedules, setSchedules] = useState<any>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<any>(null);
  const [sessionData, setSessionData] = useState<Session | null>(null);

  useEffect(() => {
    async function fetchSession() {
      const session = await getSession();
      setSessionData(session);
    }
    fetchSession();
  }, []);

  useEffect(() => {
    const fetchSchedules = async () => {
      try {
        const data = await getSchedulesForTeacher(6);
        setSchedules(data);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchSchedules();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl">
        Welcome, {sessionData?.user?.name && `${sessionData.user.name}`}
      </h1>
      {schedules.length > 0 ? (
        <Table>
          <TableCaption>List of schedules for the teacher.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Schedule ID</TableHead>
              <TableHead>Day</TableHead>
              <TableHead>Start Time</TableHead>
              <TableHead>Duration</TableHead>
              <TableHead>Course</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {schedules.map((schedule: any) => (
              <TableRow key={schedule.id}>
                <TableCell>{schedule.id}</TableCell>
                <TableCell>{schedule.day}</TableCell>
                <TableCell>{schedule.start_time}</TableCell>
                <TableCell>{schedule.duration} hours</TableCell>
                <TableCell>{schedule.course.course_name}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      ) : (
        <p>No schedules found for this teacher.</p>
      )}
    </div>
  );
}
