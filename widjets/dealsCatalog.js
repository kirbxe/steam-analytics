"use client";
import { useState, useEffect } from "react";
import Image from "next/image";

export const DealsCatalog = () => {
  const [loading, setLoading] = useState(true);
  const [games, setGames] = useState([]);

  const [currentGame, setCurrentGame] = useState(null);
  //  const [gameID, setGameID] = useState(null);
  const [popUp, setPopUp] = useState(false);
  const [stores, setStores] = useState([]);

  const [error, setError] = useState(null);
  const [usdRate, setUsdRate] = useState(null);
  const [page, setPage] = useState(1);
  useEffect(() => {
    const loadData = async () => {
      await dealsGames();
      fetch("https://www.cheapshark.com/api/1.0/stores")
        .then((r) => r.json())
        .then(setStores);
      if (!usdRate) {
        const rate = await getUSDtoRUB();
        setUsdRate(rate);
      }
      // await gameLook();
    };
    loadData();
  }, [page]);

  const dealsGames = async () => {
    try {
      const response = await fetch(
        "https://www.cheapshark.com/api/1.0/deals?storeID=1&pageSize=30&upperPrice=15&pageNumber=" +
          page
      );
      if (!response.ok) {
        throw new Error("Ошибка загрузки данных");
      }
      const data = await response.json();
      setGames(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  // const gameLook = async () => {

  //   try{
  //     const response = await fetch(
  //       "https://www.cheapshark.com/api/1.0/games?id" + gameID
  //     );
  //     if(!response.ok){
  //       throw new Error("Ошибка загрузки карточки!");
  //     }
  //     const data = await response.json();
  //     setCurrentGame(data);
  //   }catch(err){
  //     console.error(`Произошла ошибка вывода: ${err}`);
  //   }
  // };

  const handleClickPopUp = async (gameID) => {
    setPopUp(true);
    setCurrentGame(null);

    try {
      const response = await fetch(
        `https://www.cheapshark.com/api/1.0/games?id=${gameID}`
      );
      if (!response.ok) throw new Error("Игра не найдена");
      const data = await response.json();
      setCurrentGame(data);
    } catch (err) {
      console.error(err);
      alert("Не удалось загрузить игру");
      setPopUp(false);
    }
  };

  const handleClosePopUp = async () => {
    setPopUp(false);
    setCurrentGame(null);
  };

  const nextPage = async () => {
    setPage(page + 1);
    setLoading(true);
  };
  const prevPage = async () => {
    if (page > 1) {
      setPage(page - 1);
      setLoading(true);
    }

    await dealsGames();
  };
  const getUSDtoRUB = async () => {
    try {
      const response = await fetch(
        "https://www.cbr-xml-daily.ru/daily_json.js"
      );
      if (!response.ok) {
        throw new Error("Ошибка загрузки курса валют!");
      }
      const data = await response.json();
      return data.Valute.USD.Value;
    } catch (err) {
      console.error("Ошибка получения курса:", err);
      return null;
    }
  };

  const storeMap = stores.reduce((acc, store) => {
    acc[store.storeID] = store.storeName;
    return acc;
  }, {});

  if (loading) {
    return (
      <div className="flex mt-10 py-5 px-2.5 border border-black text-black justify-center rounded-lg">
        <div className="text-center py-8">Загрузка каталога...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex py-5 px-2.5 border border-black rounded-lg">
        <div className="text-center py-8">Произошла ошибка: {error}</div>
      </div>
    );
  }

  return (
    <div className="mt-10 flex flex-col py-5 px-2.5 bg-amber-50 rounded-lg">
      <div id="catalogDeals" className="w-full flex justify-center p-4">
        <h2 className="text-[35px] rounded-4xl bg-[#171D25] p-2.5">
          Каталог скидок
        </h2>
      </div>
      <div className="flex flex-col px-5  rounded-lg">
        {games.map((game, index) => {
          return (
            <div
              key={index}
              className="w-full flex items-center gap-5 bg-[#171D25] p-2.5 rounded-lg mb-4"
            >
              <Image
                src={game.thumb}
                alt={game.title}
                width={200}
                height={100}
                className="rounded"
              />
              <div className="flex justify-between w-full items-center">
                <div>
                  <h3 className="text-white mt-2">{game.title}</h3>
                  <div className="text-white text-sm mt-1">
                    {parseFloat(game.normalPrice) > 0 && (
                      <span className="line-through text-gray-400">
                        {Math.round(game.normalPrice * usdRate)}₽
                      </span>
                    )}
                    {parseFloat(game.salePrice) > 0 && (
                      <span className="text-green-400 font-bold ml-2">
                        {Math.round(game.salePrice * usdRate)}₽
                      </span>
                    )}
                    {parseFloat(game.savings) > 0 && (
                      <span className="bg-red-500 text-white text-xs px-2 py-1 rounded ml-2">
                        -{Math.round(parseFloat(game.savings))}%
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex flex-col gap-1">
                  {game.steamAppID ? (
                    <a
                      className="p-2 rounded-lg bg-[#0f1020ee] text-center hover:bg-[#1a1a2bee] transition-all "
                      href={
                        "https://store.steampowered.com/app/" + game.steamAppID
                      }
                    >
                      В Steam
                    </a>
                  ) : (
                    <span className="">Ссылка на игру недоступна</span>
                  )}
                  {game.gameID ? (
                    <button
                      onClick={() => handleClickPopUp(game.gameID)}
                      className="p-2 rounded-lg bg-[#0f1020ee] text-center hover:bg-[#1a1a2bee] transition-all "
                    >
                      Подробнее
                    </button>
                  ) : (
                    <button className="hidden"></button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <div className="flex gap-2.5 justify-center items-center">
        {page > 1 ? (
          <button
            className=" text-white cursor-pointer p-2 rounded-lg bg-[#0f1020ee] text-center hover:bg-[#1a1a2bee] transition-all"
            onClick={() => prevPage()}
          >
            Предыдущая страница
          </button>
        ) : (
          <button hidden></button>
        )}
        <span className="text-black">Страница {page}</span>
        <button
          className=" text-white cursor-pointer p-2 rounded-lg bg-[#0f1020ee] text-center hover:bg-[#1a1a2bee] transition-all"
          onClick={() => nextPage()}
        >
          Следующая страница
        </button>
      </div>
      {popUp && currentGame && (
        <div
          className="fixed inset-0  flex items-center justify-center z-50 p-4 transition-all"
          onClick={() => handleClosePopUp()}
        >
          <div
            className=" from-gray-900 bg-[#171D25] transition-all to-black rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto border border-b-cyan-950 shadow-2xl shadow-cyan-500/20"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => handleClosePopUp()}
              className="absolute top-4 right-6 text-5xl text-gray-400 hover:text-red-500 transition-all hover:scale-110"
            >
              ×
            </button>

            {!currentGame ? (
              <div className="flex items-center justify-center h-96">
                <div className="text-white text-2xl animate-pulse">
                  Загрузка игры...
                </div>
              </div>
            ) : (
              <div className="p-8 text-white">
                <h2 className="text-4xl font-bold mb-6 ">
                  {currentGame.info.title}
                </h2>

                {currentGame.info.thumb && (
                  <div className="mb-8 flex justify-center">
                    <Image
                      src={currentGame.info.thumb}
                      alt={currentGame.info.title}
                      width={600}
                      height={300}
                      className="rounded-xl shadow-2xl border-4 "
                    />
                  </div>
                )}

                <div className="grid md:grid-cols-2 gap-8 text-lg">
                  <div className="space-y-4">
                    <div>
                      <p className="text-gray-400">
                        Самая низкая цена за всё время
                      </p>
                      <p className="text-5xl font-bold text-green-400">
                        {usdRate
                          ? Math.round(
                              currentGame.cheapestPriceEver.price * usdRate
                            )
                          : currentGame.cheapestPriceEver.price}
                        ₽
                      </p>
                    </div>
                    <p className="text-gray-400">
                      Дата:{" "}
                      {new Date(
                        currentGame.cheapestPriceEver.date * 1000
                      ).toLocaleDateString("ru-RU")}
                    </p>
                  </div>

                  <div className="space-y-4">
                    {currentGame.info.steamAppID && (
                      <a
                        href={`https://store.steampowered.com/app/${currentGame.info.steamAppID}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex gap-2 items-center bg-[#293442] px-8 py-4 rounded-xl font-bold text-xl transition-all transform hover:scale-105 shadow-lg"
                      >
                        <Image
                          src="/Steam_icon_logo.svg.png"
                          width={48}
                          height={48}
                          alt="steam-icon"
                        />
                        Открыть в Steam
                      </a>
                    )}
                  </div>
                </div>
                {currentGame.deals && currentGame.deals.length > 0 && (
                  <div className="mt-10">
                    <h3 className="text-2xl font-bold mb-4 ">
                      Где купить сейчас:
                    </h3>
                    <div className="space-y-3">
                      {currentGame.deals.slice(0, 5).map((deal, i) => (
                        <div
                          key={i}
                          className="bg-gray-800 p-4 rounded-lg flex justify-between items-center"
                        >
                          <span className="text-lg">
                            {storeMap[deal.storeID] || "Незвестный магазин"}
                          </span>
                          <div className="flex gap-2.5">
                          <a className="bg-[#293442] p-2 rounded-lg hover:bg-[#374252]" href={'https://www.cheapshark.com/redirect?dealID=' + deal.dealID}>Перейти на страницу</a>
                          <span className="text-2xl font-bold text-green-400">
                            {usdRate
                              ? Math.round(deal.price * usdRate)
                              : deal.price}
                            ₽
                          </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
