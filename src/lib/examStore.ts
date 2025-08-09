export type Exam = {
  id: string;
  title: string;
  subject: string;
  examDate: string;
  status: "Draft" | "Published" | "Archived" | "Approved";
  fileName: string;
  fileUrl: string;
  teacherComment?: string;
};

const exams: Exam[] = [
  {
    id: "e1",
    title: "Midterm Math Exam",
    subject: "Mathematics",
    examDate: "2025-09-15",
    status: "Approved",
    fileName: "midterm-math.pdf",
    fileUrl: "/uploads/sample.pdf",
    teacherComment: "Please review chapter 1-5",
  },
];

export function getExams() {
  return exams;
}

export function getExamById(id: string) {
  return exams.find((e) => e.id === id) || null;
}

export function addExam(exam: Exam) {
  exams.unshift(exam);
}
