"use client";

import { useEffect, useState } from "react";
import { getStudyContractsByStudentId } from "../actions/study_contract/actions";
import { getStudentIdByEmail } from "../actions/student/actions";
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

  if (loading) {
    return <div className="p-6">Loading...</div>;
  }

  if (error) {
    return <div className="p-6 text-red-600">Error: {error.message}</div>;
  }

  return (
    <div>
      <Navbar title={`Welcome, ${sessionData?.user.name}`} />

      {studyContracts.length > 0 ? (
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
                <TableCell>{contract.schedule.course.course_name}</TableCell>
                <TableCell>{contract.schedule.teacher.name}</TableCell>
                <TableCell>{numberToDay(contract.schedule.day)}</TableCell>
                <TableCell>{contract.schedule.start_time}</TableCell>
                <TableCell>{contract.schedule.duration} hours</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      ) : (
        <p className="p-6">No study contracts found.</p>
      )}
    </div>
  );
}
