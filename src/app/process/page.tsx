"use client";

import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";

interface ErrorProps {
  msg: string;
}

const Loader: React.FC = () => (
  <div className="flex items-center justify-center min-h-screen bg-gray-300">
    <div className="card h-auto max-w-sm md:max-w-lg">
      <figure>
        <img src="/loader.gif" alt="loading" width={200} />
      </figure>
    </div>
  </div>
);

const Success: React.FC = () => (
  <div className="flex items-center justify-center min-h-screen bg-gray-300">
    <div className="card h-auto max-w-sm md:max-w-lg">
      <figure>
        <img src="/success.gif" alt="success" width={150} />
      </figure>
      <div className="card-body h-full flex flex-col items-center text-center">
        <div className="text-gray-600">Scan Success</div>
        <h5 className="text-gray-500 text-sm md:text-base">
          Thank you for participating in the event
        </h5>
      </div>
    </div>
  </div>
);

const Error: React.FC<ErrorProps> = ({ msg }) => (
  <div className="flex items-center justify-center min-h-screen bg-gray-300">
    <div className="card h-auto max-w-sm md:max-w-lg">
      <figure>
        <img src="/error.gif" alt="error" width={150} />
      </figure>
      <div className="card-body h-full flex flex-col items-center text-center">
        <div className="text-gray-600">Scan Failed!</div>
        <h5 className="text-gray-500 text-sm md:text-base">{msg}</h5>
      </div>
    </div>
  </div>
);

export default function Scan() {
  const { data: session, status } = useSession();
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const validateSession = async () => {
      if (session && status === "authenticated" && !isProcessing) {
        setIsProcessing(true);

        try {
          const response = await fetch("/api/validate", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              name: session.user?.name,
              email: session.user?.email,
            }),
          });

          if (!response.ok) {
            const err = await response.json();
            setError(err.error);
          }
        } catch (err) {
          console.error("API error:", err);
          setError("An unexpected error occurred.");
        } finally {
          setIsProcessing(false);
        }
      }
    };

    validateSession();
  }, [session, status]);

  return (
    <div className="container">
      {status === "loading" || isProcessing ? (
        <Loader />
      ) : session ? (
        !error ? (
          <Success />
        ) : (
          <Error msg={error} />
        )
      ) : (
        <Loader />
      )}
    </div>
  );
}
