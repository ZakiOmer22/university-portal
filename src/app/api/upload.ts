import type { NextApiRequest, NextApiResponse } from "next";
import multiparty from "multiparty";
import path from "path";
import fs from "fs";

export const config = {
  api: {
    bodyParser: false, // MUST disable Next.js body parser for file uploads
  },
};

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  // Ensure the upload directory exists
  const uploadDir = path.join(process.cwd(), "public/uploads/exams");
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  const form = new multiparty.Form({ uploadDir });

  form.parse(req, (err, fields, files) => {
    if (err) {
      console.error("Upload error:", err);
      return res.status(500).json({ error: "Upload error" });
    }

    const file = files.file?.[0];
    if (!file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const filename = path.basename(file.path);

    // Send back the URL where frontend can access the file
    const fileUrl = `/uploads/exams/${filename}`;

    return res.status(200).json({ fileUrl });
  });
}
