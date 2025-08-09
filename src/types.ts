// src/types.ts
export type ClassInfo = {
  code: string;
  title: string;
  instructor: string;
  credits: number;
};

export type ExamInfo = {
  id: string;
  courseCode: string;
  courseTitle: string;
  date: string;
  time: string;
  location: string;
  status: string;
  grade?: string;
};

export type TranscriptEntry = {
  courseCode: string;
  courseTitle: string;
  semester: string;
  year: number;
  grade: string;
  credits: number;
};

export type Report = {
  id: string;
  title: string;
  description: string;
};

export type AccountDetails = {
  email: string;
  phone: string;
  department: string;
  currentSemester: string;
  advisor: string;
};

export type Student = {
  id: string;
  fullName: string;
  profilePicture: string;
  role: string;
  accountDetails: AccountDetails;
  classes: ClassInfo[];
  exams: ExamInfo[];
  transcript: TranscriptEntry[];
  reports: Report[];
};
