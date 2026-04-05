"use client";
import { useTheme } from "./hooks/useThemes";
import { ThemeButton } from "./components/buttonTheme";

export default function App() {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="min-h-screen ">
      <main className="">
        {/* header home */}
        <header className="fixed flex top-0 left-0 w-full z-50 justify-between align-center p-6 max-w-1920 shadow-xl ">
          <h1 className="border-black-1 hover:text-black transition-colors duration-300 text-2xl font-bold cursor-pointer">
            CBR-TEAM
          </h1>

          <nav className="">
            <ul className="gap-5 flex justify-between align-center text-shadow-black">
              <li className="list-none text-xl font-semibold hover:text-black">
                <a href="">Услуги</a>
              </li>
              <li className="list-none text-xl font-semibold hover:text-black">
                <a href="">Наши работы</a>
              </li>
              <li className="list-none text-xl font-semibold hover:text-black">
                <a href="">Отзывы</a>
              </li>
            </ul>
          </nav>
          <div className="grid grid-cols-3">
            <div className="text-center">
              <ThemeButton theme={theme} toggleTheme={toggleTheme} />
            </div>
            <div className="text-xl bg-black/40 border-2 h-8 w-20 rounded-4xl cursor-pointer text-center font-semibold hover:text-black">
              Sign In
            </div>
            <div className="text-xl bg-black/40 border-2 h-8 w-20 cursour-pointer rounded-4xl text-center font-semibold hover:text-black">
              Sign Up
            </div>
          </div>
        </header>
        {/* Main home */}
        <section className="bg-gray-500 opacity-35 border-2 rounded-xl mt-100 py-20 mx-auto ml-30 w-150">
          <div className="text-xl px-5 flex justify-items-start align-center font-semibold ">
            О нас
          </div>
        </section>
        {/* footer home */}
        <footer className="mt-12 pt-6 border-t border-gray-800 text-center">
          <div className="h-100 flex flex-row items-center justify-center gap-25">
            <div className="flex justify-between items-center ">
              <span className="text-3xl font-bold text-black tracking-tight p-5">
                CBR-TEAM
              </span>
            </div>
            <nav>
              <li className="list-none font-bold text-2xl text-black hover:text-black transition">
                <a href="/">Discord сервер</a>
              </li>
              <li className="list-none font-bold text-2xl text-black hover:text-black transition">
                <a href="/">Telegram канал</a>
              </li>
              <li className="list-none font-bold text-2xl text-black hover:text-black transition">
                <a href="/">Группа вк</a>
              </li>
            </nav>
          </div>
          <div>
            <h1></h1>
          </div>
          <div className="flex flex-col-reverse divide-y-3 divide-y-reverse divide-black pt-20">
            <span></span>
            <span></span>
          </div>
          <div className="flex justify-between align-center pt-8">
            <h1 className="hover:text-blue-400 transition">
              ©2026 CBR-TEAM Все права защищены.
            </h1>
            <li className="list-none">
              <a
                href="not_found/not_found_404.tsx"
                className="hover:text-blue-400 transition"
              >
                Политика конфиденциальности
              </a>
            </li>
          </div>
        </footer>
      </main>
    </div>
  );
}
