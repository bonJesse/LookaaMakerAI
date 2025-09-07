import React from 'react';

const GlobeIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2h10a2 2 0 002-2v-1a2 2 0 012-2h1.945M7.707 4.5l.053.053a.5.5 0 010 .707l-.053.053L4.5 7.707l-.053.053a.5.5 0 01-.707 0l-.053-.053L1.293 4.5l-.053-.053a.5.5 0 010-.707l.053-.053L4.5 1.293l.053-.053a.5.5 0 01.707 0l.053.053L7.707 4.5zM12 21a9 9 0 100-18 9 9 0 000 18z" />
    </svg>
);


export const Header: React.FC = () => {
  return (
    <header className="text-center">
        <div className="flex justify-center items-center gap-4">
          <GlobeIcon />
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-stone-800">
            Cultural Makeover AI
          </h1>
        </div>
      <p className="mt-4 max-w-2xl mx-auto text-lg text-stone-600">
        Upload your portrait, pick a country, and let AI transform you with authentic local styles.
      </p>
    </header>
  );
};