import { useEffect, useRef } from "react";

// HOW LONG THE MESSAGE STAYS ON THE SCREEN (IN MILLISECONDS)
const TOAST_DURATION = 3000;

interface ToastProps {
  message: string;
  type?: "success" | "error";
  onClose: () => void;
}

// A SMALL MESSAGE AT THE BOTTOM OF THE SCREEN THAT DISAPPEARS BY ITSELF
function Toast({ message, type = "success", onClose }: ToastProps) {
  // EVERY TIME THE PAGE RENDERS AND SENDS A NEW FUNCTION
  const onCloseRef = useRef(onClose);

  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  // RUNS WHEN THE TOAST APPEARS: CLOSES IT AFTER 3 SECONDS
  useEffect(() => {
    const timer = setTimeout(() => onCloseRef.current(), TOAST_DURATION);
    return () => clearTimeout(timer);
  }, [message]);

  const bgColor = type === "success" ? "bg-green-600" : "bg-red-600";

  // TOAST DESIGN
  return (
    <div
      role={type === "error" ? "alert" : "status"}
      className={`fixed bottom-6 right-6 z-50 rounded-lg px-4 py-3 text-white shadow-lg ${bgColor}`}
    >
      {message}
    </div>
  );
}

export default Toast;
