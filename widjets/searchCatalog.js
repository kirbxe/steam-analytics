'use client';

import { useState, useEffect } from "react";
import Image from "next/image";
import { Search } from "./search";

export const SearchCatalog = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [searchLoading, setSearchLoading] = useState(false);
    const [searchError, setSearchError] = useState(null);
    const [usdRate, setUsdRate] = useState(null);

    const getUSDtoRUB = async () => {
        try {
            const response = await fetch('https://www.cbr-xml-daily.ru/daily_json.js');
            if (!response.ok) {
                throw new Error('Ошибка загрузки курса валют!');
            }
            const data = await response.json();
            return data.Valute.USD.Value;
        } catch (err) {
            console.error('Ошибка получения курса:', err);
            return null;
        }
    };

    const performSearch = async (query) => {
        if (!query.trim() || query.length < 2) return;

        setSearchLoading(true);
        setSearchError(null);

        const formatQuery = query.toLowerCase();

        try {
            const response = await fetch(`https://www.cheapshark.com/api/1.0/games?title=${encodeURIComponent(formatQuery)}`);
            if (!response.ok) {
                throw new Error('Ошибка поиска');
            }
            const data = await response.json();
            console.log('Запросик:', data); 
            setSearchResults(data);
        } catch (err) {
            setSearchError(err.message);
            setSearchResults([]);
        } finally {
            setSearchLoading(false);
        }
    };

    useEffect(() => {
        const loadUsdRate = async () => {
            const rate = await getUSDtoRUB();
            setUsdRate(rate);
        };
        loadUsdRate();
    }, []);

    const handleInputChange = (event) => {
        const value = event.target.value;
        setSearchQuery(value);

   
        const timeoutId = setTimeout(() => {
            performSearch(value);
        }, 500);

        return () => clearTimeout(timeoutId);
    };

    return (
        <div id="searchCatalog" className="mt-10 flex flex-col py-5 px-2.5 bg-amber-50 text-black rounded-lg">
            <div className="flex justify-center">
              <h2 className=" text-[35px] text-white rounded-4xl bg-[#0f1020ee] text-center p-2.5 my-2.5 ">
            Поиск игр
            </h2>  
            </div>
            

           <Search func={handleInputChange}/>
            {searchLoading && (
                <div className="text-center py-4">Поиск...</div>
            )}
            {searchError && (
                <div className="text-center py-4 text-red-500">Ошибка: {searchError}</div>
            )}
            
            {!searchLoading && !searchError && searchResults.length > 0 && (
                <div className="space-y-2">
                {searchResults.map((result, index) => {
                        return (
                            <div
                                key={index}
                                className="w-full flex items-center gap-5 bg-[#0f1020ee] p-2.5 rounded-lg mb-4"
                            >
                                <Image
                                    src={result.thumb}
                                    alt={result.external}
                                    width={200}
                                    height={100}
                                    className="rounded"
                                />
                                <div className="flex justify-between w-full items-center">
                                    <div>
                                        <h3 className="text-white mt-2">{result.external}</h3>
                                        <div className="text-white text-sm mt-1">
                                            {result.cheapest && usdRate && (
                                                <span className="text-green-400 font-bold">
                                                    {Math.round(result.cheapest * usdRate)}₽
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                    <div>
                                        {result.steamAppID ? (
                                            <a
                                                className="p-2 rounded-lg bg-[#0f1020ee] text-center hover:bg-[#1a1a2bee] transition-all text-white"
                                                href={`https://store.steampowered.com/app/${result.steamAppID}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                            >
                                                В Steam
                                            </a>
                                        ) : (
                                            <span className="text-gray-400">Ссылка недоступна</span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {!searchLoading && !searchError && searchQuery && searchResults.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                    По запросу &quot;{searchQuery}&quot; ничего не найдено
                </div>
            )}
        </div>
    );
};