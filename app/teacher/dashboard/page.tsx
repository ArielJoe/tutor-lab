"use client";

import { useEffect, useState } from "react";
import { getSchedulesByTeacherId } from "@/app/admin/actions/schedule/actions";
import { getTeacherIdByEmail } from "../actions/teacher/actions";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Session } from "next-auth";
import { getSession } from "@/app/lib/session";
import { numberToDay } from "@/app/lib/numToDay";
import Navbar from "@/app/components/Navbar"; // Import the Navbar component

export default function TeacherScheduleTable() {
  const [schedules, setSchedules] = useState<any>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<any>(null);
  const [sessionData, setSessionData] = useState<Session | null>(null);
  const [teacherId, setTeacherId] = useState<number | null>(null);

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

  // Fetch schedules using the teacher ID
  useEffect(() => {
    const fetchSchedules = async () => {
      if (teacherId) {
        try {
          const data = await getSchedulesByTeacherId(teacherId);
          setSchedules(data);
        } catch (err) {
          setError(err);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchSchedules();
  }, [teacherId]);

  if (loading) {
    return <div className="p-6">Loading...</div>;
  }

  if (error) {
    return <div className="p-6">Error: {error.message}</div>;
  }

  return (
    <div>
      {/* Add the Navbar component */}
      <Navbar title={`Welcome, ${sessionData?.user?.name}`} />

      {/* Main content */}
      <div className="p-6">
        {schedules.length > 0 ? (
          <Table>
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
                  <TableCell>{numberToDay(schedule.day)}</TableCell>
                  <TableCell>{schedule.start_time}</TableCell>
                  <TableCell>{schedule.duration} hours</TableCell>
                  <TableCell>{schedule.course.course_name}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <p>No schedules found.</p>
        )}
      </div>
    </div>
  );
}
