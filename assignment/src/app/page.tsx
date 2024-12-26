import Calendar from "@components/Calendar/Calendar";
import Footer from "@components/Footer";
import { EventModal } from "@components/Calendar/Components/EventModal";


export default function Home() {


  return (
    
    <div className="flex p-14 py-10 flex-col min-h-screen">
      {/* Header */}
      <EventModal/>

      {/* Main Content */}
      <main className="flex-grow items-center justify-center p-4">
        <Calendar/>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
