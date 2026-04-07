import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

const MyEvents = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const user = localStorage.getItem("name") || localStorage.getItem("email") || "Guest";

  const bookedEvents = JSON.parse(localStorage.getItem("bookedEvents") || "[]");

  const [selectedEvent, setSelectedEvent] = useState(null);
  const ticketRef = useRef(null);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!token) navigate("/login");
  }, [token, navigate]);

  const handleDownloadTicket = async (eventName) => {
    if (!ticketRef.current) return;
    const canvas = await html2canvas(ticketRef.current, { scale: 2, useCORS: true });
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const ticketW = pageWidth * 0.8;
    const ticketH = (canvas.height / canvas.width) * ticketW;
    const x = (pageWidth - ticketW) / 2;
    const y = (pageHeight - ticketH) / 2;
    pdf.addImage(imgData, "PNG", x, y, ticketW, ticketH);
    const safeName = eventName.toLowerCase().replace(/\s+/g, "_");
    pdf.save(`event_ticket_${safeName}.pdf`);
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white px-6 py-12">
      <h2 className="text-4xl font-extrabold text-center text-orange-300 mb-10 tracking-wide">
        My Booked Events
      </h2>

      {bookedEvents.length === 0 ? (
        <div className="flex flex-col items-center gap-6 mt-20">
          <p className="text-gray-400 text-lg">You have not booked any events yet.</p>
          <button
            onClick={() => navigate("/browse")}
            className="px-6 py-3 bg-orange-400 text-black font-bold rounded-xl hover:bg-orange-300 transition"
          >
            Browse Events
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {bookedEvents.map((booking) => (
            <div
              key={booking.bookingId}
              className="bg-gray-900 rounded-2xl shadow-xl p-6 flex flex-col gap-4
                         border border-gray-800 hover:border-orange-400/50
                         transition-all duration-300 hover:-translate-y-1"
            >
              <h3 className="text-xl font-bold text-orange-200">{booking.eventName}</h3>

              <div className="space-y-1 text-sm text-gray-300">
                <p><span className="text-orange-400 font-semibold">Date:</span> {booking.eventDate}</p>
                <p><span className="text-orange-400 font-semibold">Location:</span> {booking.eventLocation}</p>
                <p><span className="text-orange-400 font-semibold">Price:</span> ₹{booking.price}</p>
              </div>

              <div className="flex gap-3 mt-1">
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-green-900/60 text-green-400 border border-green-700">
                  Payment: {booking.paymentStatus}
                </span>
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-orange-900/60 text-orange-300 border border-orange-700">
                  Ticket: Issued
                </span>
              </div>

              <button
                onClick={() => setSelectedEvent(booking)}
                className="mt-auto w-full py-2.5 bg-orange-400 text-black font-bold rounded-xl
                           hover:bg-orange-300 transition-all duration-200"
              >
                View Ticket
              </button>
            </div>
          ))}
        </div>
      )}

      {/* ── TICKET MODAL ── */}
      {selectedEvent && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center px-4"
          onClick={() => setSelectedEvent(null)}
        >
          <div
            className="w-full max-w-lg space-y-5"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Ticket card */}
            <div
              ref={ticketRef}
              className="bg-white text-gray-900 rounded-2xl shadow-2xl overflow-hidden"
              style={{ fontFamily: "monospace" }}
            >
              {/* Header strip */}
              <div className="bg-orange-400 px-6 py-4 flex items-center justify-between">
                <span className="text-black font-extrabold text-xl tracking-widest">EVENTIFY</span>
                <span className="text-black font-semibold text-sm uppercase tracking-wider">Event Ticket</span>
              </div>

              {/* Body */}
              <div className="px-6 py-5 border-2 border-dashed border-orange-300 mx-4 my-4 rounded-xl flex gap-4">
                <div className="flex-1 space-y-3 text-sm">
                  <div>
                    <p className="text-gray-400 text-xs uppercase tracking-wider">Event</p>
                    <p className="font-bold text-base text-gray-900">{selectedEvent.eventName}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-xs uppercase tracking-wider">Date</p>
                    <p className="font-semibold">{selectedEvent.eventDate}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-xs uppercase tracking-wider">Location</p>
                    <p className="font-semibold">{selectedEvent.eventLocation}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-xs uppercase tracking-wider">Ticket Holder</p>
                    <p className="font-semibold">{user}</p>
                  </div>
                  <div className="flex gap-6">
                    <div>
                      <p className="text-gray-400 text-xs uppercase tracking-wider">Booking ID</p>
                      <p className="font-bold text-orange-500">{selectedEvent.bookingId}</p>
                    </div>
                    <div>
                      <p className="text-gray-400 text-xs uppercase tracking-wider">Status</p>
                      <p className="font-bold text-green-600">Paid ✓</p>
                    </div>
                  </div>
                </div>

                {/* QR Placeholder */}
                <div className="flex flex-col items-center justify-center">
                  <div className="w-20 h-20 border-2 border-dashed border-gray-400 rounded-lg flex items-center justify-center bg-gray-100">
                    <span className="text-gray-400 text-xs text-center leading-tight">QR<br />CODE</span>
                  </div>
                  <p className="text-xs text-gray-400 mt-1">Scan at entry</p>
                </div>
              </div>

              {/* Footer strip */}
              <div className="bg-gray-100 px-6 py-3 text-center text-xs text-gray-500 tracking-wide">
                EVENTIFY · Valid for one-time entry only
              </div>
            </div>

            {/* Modal actions */}
            <div className="flex gap-4">
              <button
                onClick={() => handleDownloadTicket(selectedEvent.eventName)}
                className="flex-1 py-3 bg-orange-400 text-black font-bold rounded-xl hover:bg-orange-300 transition"
              >
                Download Ticket as PDF
              </button>
              <button
                onClick={() => setSelectedEvent(null)}
                className="flex-1 py-3 bg-gray-800 text-white font-bold rounded-xl hover:bg-gray-700 transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyEvents;
