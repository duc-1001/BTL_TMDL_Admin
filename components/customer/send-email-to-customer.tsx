import { Customer } from "@/types/customer";
import React, { useState } from "react";

interface SendEmailToCustomerProps {
  open: boolean;
  onClose: () => void;
  customer: Customer | null;
}

const SendEmailToCustomer = ({ open, onClose, customer }: SendEmailToCustomerProps) => {
  const [subject, setSubject] = useState("");
  const [content, setContent] = useState("");

  const handleSend = async () => {
    try {
      await fetch("/api/send-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          to: customer?.email,
          subject,
          content,
        }),
      });

      alert("Gửi email thành công");
      onClose();
    } catch (err) {
      console.error(err);
      alert("Gửi thất bại");
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white w-[520px] rounded-2xl shadow-2xl p-6 animate-fadeIn">

        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Gửi email cho khách hàng</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-black text-xl"
          >
            ✕
          </button>
        </div>

        {/* Email */}
        <p className="text-sm text-gray-500 mb-3">
          Người nhận: <span className="font-medium">{customer?.email}</span>
        </p>

        {/* Subject */}
        <input
          className="w-full border border-gray-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-100 outline-none rounded-lg px-3 py-2 mb-3 transition"
          placeholder="Tiêu đề email..."
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
        />

        {/* Content */}
        <textarea
          className="w-full border border-gray-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-100 outline-none rounded-lg px-3 py-2 h-36 mb-4 resize-none transition"
          placeholder="Nhập nội dung email..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />

        {/* Actions */}
        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg border hover:bg-gray-100 transition"
          >
            Huỷ
          </button>

          <button
            onClick={handleSend}
            className="px-4 py-2 rounded-lg bg-orange-600 text-white hover:bg-orange-700 transition shadow"
          >
            Gửi email
          </button>
        </div>
      </div>
    </div>
  );
};

export default SendEmailToCustomer;