import {HandCoins, House, Settings, Wallet} from "lucide-react";
import NavLink from "@/shared/ui/NavLink";

export const Navbar = () => {
    return <div className="fixed bottom-4 z-10 mx-auto px-4 left-0 right-0 max-w-screen-2xl">
        <nav
            className="navbar flex justify-between items-center rounded-xl p-6 py-4 text-center list-none">
            <li>
                <NavLink
                    className="text-sm font-medium flex flex-col items-center transition-colors duration-300 hover:text-active"
                    activeClassName="text-active" href="/dashboard">
                    <House className="w-4 h-4"/>
                    Обзор
                </NavLink>
            </li>
            <li>
                <NavLink
                    className="text-sm font-medium flex flex-col items-center transition-colors duration-300 hover:text-active"
                    activeClassName="text-active" href="/expenses">
                    <HandCoins className="w-4 h-4"/>
                    Расходы
                </NavLink>
            </li>
            <li>
                <NavLink
                    className="text-sm font-medium flex flex-col items-center transition-colors duration-300 hover:text-active"
                    activeClassName="text-active" href="/budget">
                    <Wallet className="w-4 h-4"/>
                    Бюджет
                </NavLink>
            </li>
            <li>
                <NavLink
                    className="text-sm font-medium flex flex-col items-center transition-colors duration-300 hover:text-active"
                    activeClassName="text-active" href="/settings">
                    <Settings className="w-4 h-4"/>
                    Настройки
                </NavLink>
            </li>
        </nav>
    </div>;
}