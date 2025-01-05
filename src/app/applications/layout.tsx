import { Metadata } from "next";

export const metadata: Metadata = {
  title: "applications",
  description: "applications",
};

export default function ApplicationsLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div>
      {children}
    </div>
  );
}
