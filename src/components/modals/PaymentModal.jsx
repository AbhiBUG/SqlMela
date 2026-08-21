import { useState } from "react";

const PaymentModal = ({ onClose }) => {
  const [amount, setAmount] = useState(100);

  const amounts = [50, 100, 200, 500];

const handleSupport = async () => {
  if (!amount || amount <= 0) {
    return;
  }

  try {
    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/api/payment/create-order`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          amount,
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to create payment");
    }

    console.log("Payment order created:", data);

    // We'll use the returned order details here
    // to open the payment gateway checkout.

  } catch (error) {
    console.error("Payment error:", error);
  }
};

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl dark:bg-gray-900"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close */}
        <button
          type="button"
          onClick={()=>onClose(false)}
          className="absolute right-4 top-3 text-2xl text-gray-400 hover:text-gray-700 dark:hover:text-white"
          aria-label="Close"
        >
          &times;
        </button>

        {/* Header */}
        <div className="text-center">
          <div className="mb-3 text-5xl">
            ☕
          </div>

          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Support SqlMela
          </h2>

          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Enjoying SqlMela? You can support the project with a coffee ❤️
          </p>
        </div>

        {/* Amount */}
        <div className="mt-6">
          <p className="mb-3 text-sm font-medium text-gray-700 dark:text-gray-300">
            Select amount
          </p>

          <div className="grid grid-cols-4 gap-2">
            {amounts.map((value) => (
              <button
                key={value}
                type="button"
                onClick={() => setAmount(value)}
                className={`rounded-lg border px-3 py-2 text-sm font-medium transition ${
                  amount === value
                    ? "border-blue-600 bg-blue-600 text-white"
                    : "border-gray-300 bg-white text-gray-700 hover:border-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300"
                }`}
              >
                ₹{value}
              </button>
            ))}
          </div>
        </div>

        {/* Custom amount */}
        <div className="mt-4">
          <label
            htmlFor="paymentAmount"
            className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Custom amount
          </label>

          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
              ₹
            </span>

            <input
              id="paymentAmount"
              type="number"
              min="1"
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              className="w-full rounded-lg border border-gray-300 bg-white py-2 pl-8 pr-3 outline-none focus:border-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
            />
          </div>
        </div>

        {/* Payment button */}
        <button
          type="button"
          onClick={handleSupport}
          disabled={!amount || amount <= 0}
          className="mt-6 w-full rounded-lg bg-blue-600 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          ☕ Support with ₹{amount || 0}
        </button>

        <p className="mt-4 text-center text-xs text-gray-500">
          Thank you for supporting SqlMela ❤️
        </p>
      </div>
    </div>
  );
};

export default PaymentModal;