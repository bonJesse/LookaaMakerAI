import React, { useState, useEffect } from 'react';

const messages = [
  "Crafting your new look...",
  "Adding cultural flair...",
  "Painting the perfect background...",
  "Consulting with digital stylists...",
  "This masterpiece takes a moment...",
];

export const LoadingSpinner: React.FC = () => {
  const [message, setMessage] = useState(messages[0]);

  useEffect(() => {
    const interval = setInterval(() => {
      setMessage(prevMessage => {
        const currentIndex = messages.indexOf(prevMessage);
        const nextIndex = (currentIndex + 1) % messages.length;
        return messages[nextIndex];
      });
    }, 2500);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center text-center p-6 bg-white/70 rounded-xl border border-stone-200/80 shadow-sm">
      <div className="w-12 h-12 border-4 border-t-orange-500 border-r-orange-500 border-b-orange-500 border-l-stone-200 rounded-full animate-spin"></div>
      <p className="mt-4 text-lg font-semibold text-stone-700">{message}</p>
      <p className="text-sm text-stone-500">Please wait, AI is working its magic.</p>
    </div>
  );
};