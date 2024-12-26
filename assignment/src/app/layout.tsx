import type { Metadata } from "next";
import "@styles/globals.css";
import { EventModalProvider } from "../providers/EventModal-provider";
import { SupabaseProvider } from "../providers/Supabase-provider";
import { CalendarProvider } from "../providers/Calendar-provider";
import { EventModal } from "@components/Calendar/Components/EventModal";


export const metadata: Metadata = {
  title: "Test Scheduler App",
  description: "A simple app for scheduling test suites.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased bg-gray-100 text-gray-800">
      <SupabaseProvider>
      <CalendarProvider>

        <EventModalProvider>
        
        <EventModal/>

        {children}
        </EventModalProvider>
        </CalendarProvider>

        </SupabaseProvider>

      </body>
    </html>
  );
}
