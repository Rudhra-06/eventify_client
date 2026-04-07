import { useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

const generateBookingId = () =>
  "EVT-" + Math.floor(100000 + Math.random() * 900000);

const Payment = () => {
  const { state } = useLocation();
  const navigate = useNavigate();

  const [method, setMethod] = useState("");
  const [upiId, setUpiId] = useState("");
  const [card, setCard] = useState({ number: "", name: "", expiry: "", cvv: "" });
  const [loading, setLoading] = useState(false);
  const [paid, setPaid] = useState(false);
  const [bookingId] = useState(generateBookingId);
  const ticketRef = useRef(null);

  const user = localStorage.getItem("name") || localStorage.getItem("email") || "Guest";

  if (!state?.eventName) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-950 text-white gap-6">
        <p className="text-xl font-semibold text-red-400">No event selected for payment.</p>
        <button
          onClick={() => navigate("/browse")}
          className="px-6 py-3 bg-orange-400 text-black font-bold rounded-lg hover:bg-orange-300 transition"
        >
          Go Back to Browse Events
        </button>
      </div>
    );
  }

  const { eventName, eventDate, eventLocation, price } = state;

  const handlePay = () => {
    if (!method) return alert("Please select a payment method.");
    if ((method === "upi" || method === "gpay") && !upiId.trim())
      return alert("Please enter your UPI ID.");
    if ((method === "credit" || method === "debit")) {
      if (!card.number || !card.name || !card.expiry || !card.cvv)
        return alert("Please fill all card details.");
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setPaid(true);
      // Persist booking to localStorage for MyEvents page
      const existing = JSON.parse(localStorage.getItem("bookedEvents") || "[]");
      const alreadySaved = existing.find((e) => e.eventId === state.eventId);
      if (!alreadySaved) {
        const newBooking = {
          eventId: state.eventId,
          eventName,
          eventDate,
          eventLocation,
          price,
          bookingId,
          paymentStatus: "Paid",
          bookedAt: new Date().toISOString(),
        };
        localStorage.setItem("bookedEvents", JSON.stringify([...existing, newBooking]));
      }
    }, 2000);
  };

  const handleDownloadTicket = async () => {
    if (!ticketRef.current) return;

    const canvas = await html2canvas(ticketRef.current, { scale: 2, useCORS: true });
    const imgData = canvas.toDataURL("image/png");

    const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });

    const pageWidth = pdf.internal.pageSize.getWidth();   // 210 mm
    const pageHeight = pdf.internal.pageSize.getHeight(); // 297 mm

    // Scale ticket to fit 80% of page width, keep aspect ratio
    const ticketW = pageWidth * 0.8;
    const ticketH = (canvas.height / canvas.width) * ticketW;

    const x = (pageWidth - ticketW) / 2;
    const y = (pageHeight - ticketH) / 2;

    pdf.addImage(imgData, "PNG", x, y, ticketW, ticketH);

    const safeName = eventName.toLowerCase().replace(/\s+/g, "_");
    pdf.save(`event_ticket_${safeName}.pdf`);
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-lg">

        {!paid ? (
          <div className="bg-gray-900 rounded-2xl shadow-2xl p-8 space-y-6">
            <h2 className="text-3xl font-extrabold text-orange-300 text-center">Complete Payment</h2>

            {/* Event Summary */}
            <div className="bg-gray-800 rounded-xl p-4 space-y-1 text-sm">
              <p><span className="text-orange-300 font-semibold">Event:</span> {eventName}</p>
              <p><span className="text-orange-300 font-semibold">Date:</span> {eventDate}</p>
              <p><span className="text-orange-300 font-semibold">Location:</span> {eventLocation}</p>
              <p className="text-lg font-bold text-green-400 pt-1">₹{price}</p>
            </div>

            {/* Payment Methods */}
            <div>
              <p className="text-sm text-gray-400 mb-3 font-semibold uppercase tracking-wider">Select Payment Method</p>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { id: "upi", label: "UPI" },
                  { id: "gpay", label: "Google Pay" },
                  { id: "credit", label: "Credit Card" },
                  { id: "debit", label: "Debit Card" },
                ].map((m) => (
                  <button
                    key={m.id}
                    onClick={() => setMethod(m.id)}
                    className={`py-3 rounded-xl font-semibold border-2 transition-all duration-200
                      ${method === m.id
                        ? "border-orange-400 bg-orange-400/20 text-orange-300"
                        : "border-gray-700 bg-gray-800 text-gray-300 hover:border-orange-400/50"
                      }`}
                  >
                    {m.label}
                  </button>
                ))}
              </div>
            </div>

            {/* UPI / GPay Input */}
            {(method === "upi" || method === "gpay") && (
              <input
                type="text"
                placeholder="Enter UPI ID (e.g. name@upi)"
                value={upiId}
                onChange={(e) => setUpiId(e.target.value)}
                className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-orange-400"
              />
            )}

            {/* Card Inputs */}
            {(method === "credit" || method === "debit") && (
              <div className="space-y-3">
                <input
                  type="text"
                  placeholder="Card Number"
                  maxLength={19}
                  value={card.number}
                  onChange={(e) => setCard({ ...card, number: e.target.value })}
                  className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-orange-400"
                />
                <input
                  type="text"
                  placeholder="Card Holder Name"
                  value={card.name}
                  onChange={(e) => setCard({ ...card, name: e.target.value })}
                  className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-orange-400"
                />
                <div className="flex gap-3">
                  <input
                    type="text"
                    placeholder="MM/YY"
                    maxLength={5}
                    value={card.expiry}
                    onChange={(e) => setCard({ ...card, expiry: e.target.value })}
                    className="w-1/2 bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-orange-400"
                  />
                  <input
                    type="password"
                    placeholder="CVV"
                    maxLength={4}
                    value={card.cvv}
                    onChange={(e) => setCard({ ...card, cvv: e.target.value })}
                    className="w-1/2 bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-orange-400"
                  />
                </div>
              </div>
            )}

            {/* Pay Button */}
            <button
              onClick={handlePay}
              disabled={loading}
              className="w-full py-4 bg-orange-400 text-black font-extrabold text-lg rounded-xl
                         hover:bg-orange-300 transition-all duration-300 disabled:opacity-60 flex items-center justify-center gap-3"
            >
              {loading ? (
                <>
                  <span className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                  Processing...
                </>
              ) : (
                `Pay ₹${price}`
              )}
            </button>
          </div>

        ) : (

          /* ── TICKET ── */
          <div className="space-y-6">
            <p className="text-center text-green-400 text-2xl font-extrabold">✅ Payment Successful!</p>

            <div
              id="ticket"
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
                {/* Details */}
                <div className="flex-1 space-y-3 text-sm">
                  <div>
                    <p className="text-gray-400 text-xs uppercase tracking-wider">Event</p>
                    <p className="font-bold text-base text-gray-900">{eventName}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-xs uppercase tracking-wider">Date</p>
                    <p className="font-semibold">{eventDate}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-xs uppercase tracking-wider">Location</p>
                    <p className="font-semibold">{eventLocation}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-xs uppercase tracking-wider">Ticket Holder</p>
                    <p className="font-semibold">{user}</p>
                  </div>
                  <div className="flex gap-6">
                    <div>
                      <p className="text-gray-400 text-xs uppercase tracking-wider">Booking ID</p>
                      <p className="font-bold text-orange-500">{bookingId}</p>
                    </div>
                    <div>
                      <p className="text-gray-400 text-xs uppercase tracking-wider">Status</p>
                      <p className="font-bold text-green-600">Paid ✓</p>
                    </div>
                  </div>
                </div>

                {/* QR Placeholder */}
                <div className="flex flex-col items-center justify-center">
                  <div
                    className="w-20 h-20 border-2 border-dashed border-gray-400 rounded-lg flex items-center justify-center bg-gray-100"
                  >
                    <span className="text-gray-400 text-xs text-center leading-tight">QR<br/>CODE</span>
                  </div>
                  <p className="text-xs text-gray-400 mt-1">Scan at entry</p>
                </div>
              </div>

              {/* Footer strip */}
              <div className="bg-gray-100 px-6 py-3 text-center text-xs text-gray-500 tracking-wide">
                EVENTIFY · Valid for one-time entry only
              </div>
            </div>

            {/* Screenshot notice */}
            <p className="text-center text-gray-400 text-sm leading-relaxed">
              Payment completed successfully.<br />
              <span className="text-orange-300 font-semibold">Please take a screenshot of this ticket for event entry.</span>
            </p>

            {/* Actions */}
            <div className="flex gap-4">
              <button
                onClick={handleDownloadTicket}
                className="flex-1 py-3 bg-orange-400 text-black font-bold rounded-xl hover:bg-orange-300 transition"
              >
                Download Ticket as PDF
              </button>
              <button
                onClick={() => navigate("/browse")}
                className="flex-1 py-3 bg-gray-800 text-white font-bold rounded-xl hover:bg-gray-700 transition"
              >
                Browse More Events
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Payment;
