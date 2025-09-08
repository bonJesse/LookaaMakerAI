import React from 'react';

const GlobeIcon = () => (
    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center shadow-lg">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-9 w-9 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9V3m0 18a9 9 0 009-9M3 12a9 9 0 019-9m-9 9a9 9 0 009 9m-9-9h18" />
        </svg>
    </div>
);

const Step = ({ number, label, isActive }: { number: number; label: string; isActive: boolean; }) => {
    return (
        <div className="flex items-center gap-2">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-lg transition-all duration-300 ${isActive ? 'bg-orange-500 text-white scale-110' : 'bg-white/30 text-white/80'}`}>
                {number}
            </div>
            <span className={`font-semibold transition-all duration-300 ${isActive ? 'text-white' : 'text-white/70'}`}>{label}</span>
        </div>
    );
}

const StepsIndicator = ({ activeStep }: { activeStep: number }) => {
    const steps = ['上传照片', '选择目的地', '生成魔法'];
    return (
        <div className="flex justify-center items-center space-x-2 sm:space-x-4 mt-8 relative">
            {steps.map((label, index) => (
                <React.Fragment key={index}>
                    <Step number={index + 1} label={label} isActive={activeStep >= index + 1} />
                    {index < steps.length - 1 && (
                        <div className="flex-1 h-0.5 bg-white/30 max-w-24"></div>
                    )}
                </React.Fragment>
            ))}
        </div>
    )
}

export const Header: React.FC<{ activeStep: number }> = ({ activeStep }) => {
  return (
    <header className="text-center">
        <div className="flex flex-col justify-center items-center gap-4">
          <GlobeIcon />
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-white">
            Cultural Makeover AI
          </h1>
        </div>
      <p className="mt-4 max-w-2xl mx-auto text-lg text-white/80">
        上传你的照片，选择心仪的目的地，让AI带你体验世界各地的传统文化造型
      </p>
      <StepsIndicator activeStep={activeStep} />
    </header>
  );
};