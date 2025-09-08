import React, { useState, useEffect } from 'react';

const messages = [
  "正在为您打造新造型...",
  "添加异域文化风情...",
  "绘制完美的背景...",
  "与数字造型师沟通中...",
  "杰作需要一点时间...",
  "AI正在施展魔法...",
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
    <div className="flex flex-col items-center justify-center text-center p-6 h-full">
      <div className="w-16 h-16 border-4 border-t-orange-500 border-r-orange-500 border-b-orange-500 border-l-stone-200 rounded-full animate-spin"></div>
      <p className="mt-6 text-xl font-semibold text-stone-700">{message}</p>
      <p className="text-md text-stone-500 mt-2">请稍候，魔法正在发生。</p>
    </div>
  );
};