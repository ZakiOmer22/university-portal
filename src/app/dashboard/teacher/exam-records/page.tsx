import { Suspense } from "react";
import ExamRecordsClient from "./ExamRecordsClient";

export default function ExamRecordsPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ExamRecordsClient />
    </Suspense>
  );
}
