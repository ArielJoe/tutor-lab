"use client";

import { useEffect, useState } from "react";
import { getStudyContractsByStudentId } from "../actions/study_contract/actions";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"; // Import shadcn/ui Table components
import { getSession } from "@/app/lib/session";
import { Session } from "next-auth";

export default function StudentDashboard() {
  const [studyContracts, setStudyContracts] = useState<any>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<any>(null);

  const studentId = 20220001; // Replace with dynamic student ID if needed

  const [sessionData, setSessionData] = useState<Session | null>(null);

  useEffect(() => {
    async function fetchSession() {
      const session = await getSession();
      setSessionData(session);
    }
    fetchSession();
  }, []);

  useEffect(() => {
    const fetchStudyContracts = async () => {
      try {
        const data = await getStudyContractsByStudentId(studentId);
        setStudyContracts(data);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchStudyContracts();
  }, [studentId]);

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

      {studyContracts.length > 0 ? (
        <Table>
          <TableCaption>List of study contracts for the student.</TableCaption>
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
            {studyContracts.map((contract: any) => (
              <TableRow key={contract.id}>
                <TableCell>{contract.Schedule_id}</TableCell>
                <TableCell>{contract.schedule.course.course_name}</TableCell>
                <TableCell>{contract.schedule.teacher.name}</TableCell>
                <TableCell>{contract.schedule.day}</TableCell>
                <TableCell>{contract.schedule.start_time}</TableCell>
                <TableCell>{contract.schedule.duration} hours</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      ) : (
        <p>No study contracts found.</p>
      )}
    </div>
  );
}
