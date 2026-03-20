import { QRCodeSVG } from "qrcode.react";
import auLogo from "@/assets/au-logo.png";

export default function StudentQRPage() {
  const studentUrl = `${window.location.origin}/student`;

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-6 py-12 text-center">
      <img src={auLogo} alt="Adelaide University" className="h-16 mb-8" />
      <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground mb-2">
        Curriculum Lab
      </h1>
      <p className="text-lg text-muted-foreground mb-1">Task #4: Discussion</p>
      <p className="text-sm text-muted-foreground mb-8">Scan the QR code or visit the link below to join</p>
      <div className="bg-white p-5 rounded-xl shadow-lg mb-6">
        <QRCodeSVG value={studentUrl} size={280} />
      </div>
      <code className="text-sm bg-muted px-4 py-2 rounded-md text-foreground break-all select-all">
        {studentUrl}
      </code>
    </div>
  );
}
