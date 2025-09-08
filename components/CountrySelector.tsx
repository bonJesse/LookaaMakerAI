import React, { useState, useEffect, useMemo } from 'react';
import { countries } from '../constants/countries';
import type { Country } from '../types';

interface CountrySelectorProps {
  onCountrySelect: (country: string) => void;
  selectedCountry: string;
}

const CONTINENT_MAP: { [key: string]: string } = {
  "Africa": "非洲",
  "Asia": "亚洲",
  "Europe": "欧洲",
  "North America": "北美洲",
  "South America": "南美洲",
  "Oceania": "大洋洲"
};

const MapPlaceholder = () => (
    <div className="relative aspect-video w-full rounded-xl bg-blue-400 overflow-hidden p-4 flex items-center justify-center">
        <div className="absolute w-2/3 h-1/2 bg-blue-500/50 rounded-[50%] -left-1/4 top-1/4 blur-lg"></div>
        <div className="absolute w-1/2 h-1/3 bg-blue-500/50 rounded-[50%] -right-1/4 bottom-1/4 blur-lg"></div>
        <div className="absolute w-1/2 h-2/3 bg-blue-500/50 rounded-[50%] left-1/4 -top-1/4 blur-lg"></div>
        <p className="z-10 text-white font-bold text-lg bg-black/20 px-4 py-2 rounded-full">🌏 点击探索世界地图</p>
    </div>
)

export const CountrySelector: React.FC<CountrySelectorProps> = ({ onCountrySelect, selectedCountry }) => {
  const [activeContinent, setActiveContinent] = useState<string>('Asia');
  const [searchTerm, setSearchTerm] = useState('');

  const allCountries: Country[] = useMemo(() => Object.values(countries).flat(), []);

  const filteredCountries = useMemo(() => {
    let continentCountries = countries[activeContinent] || [];

    if (searchTerm) {
      const lowercasedFilter = searchTerm.toLowerCase();
      continentCountries = allCountries.filter(country =>
        country.name.toLowerCase().includes(lowercasedFilter)
      );
      if (continentCountries.length > 0 && !activeContinent) {
         const continentOfFirstResult = Object.keys(countries).find(c => countries[c].some(cc => cc.name === continentCountries[0].name));
         if (continentOfFirstResult) setActiveContinent(continentOfFirstResult);
      }
    }
    
    return continentCountries;
  }, [activeContinent, searchTerm, allCountries]);
  
  useEffect(() => {
    if (selectedCountry) {
        const continentOfSelectedCountry = Object.keys(countries).find(c => 
            countries[c].some(country => country.name === selectedCountry)
        );

        if (continentOfSelectedCountry && continentOfSelectedCountry !== activeContinent) {
            setActiveContinent(continentOfSelectedCountry);
        }
    }
  }, [selectedCountry, activeContinent]);

  return (
    <div className="w-full p-4 space-y-4 h-full flex flex-col">
       <div className="text-center">
        <h2 className="text-2xl font-bold text-stone-800">🗺️ 选择目的地</h2>
       </div>
       <MapPlaceholder />
       
       <div className="relative">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 absolute top-1/2 left-3 -translate-y-1/2 text-stone-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
         <input 
            type="search"
            placeholder="搜索国家或地区..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full p-3 pl-10 bg-stone-100 border border-stone-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors duration-200 text-stone-800"
         />
       </div>

      <div className="flex flex-wrap gap-2 justify-center">
        {Object.entries(CONTINENT_MAP).map(([continentEn, continentZh]) => (
            <button 
                key={continentEn}
                onClick={() => { setActiveContinent(continentEn); setSearchTerm(''); }}
                className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors duration-200 ${activeContinent === continentEn ? 'bg-orange-500 text-white' : 'bg-stone-200 text-stone-600 hover:bg-stone-300'}`}
            >
                {continentZh}
            </button>
        ))}
      </div>
      
      <div className="flex-grow overflow-y-auto h-48 pr-2">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {filteredCountries.map(country => (
                <button
                    key={country.name}
                    onClick={() => onCountrySelect(country.name)}
                    className={`w-full text-left p-3 rounded-md transition-colors duration-200 ${selectedCountry === country.name ? 'bg-orange-200 text-orange-800 font-bold' : 'hover:bg-stone-100 text-stone-700'}`}
                >
                    {country.flag} {country.name}
                </button>
            ))}
          </div>
      </div>

    </div>
  );
};