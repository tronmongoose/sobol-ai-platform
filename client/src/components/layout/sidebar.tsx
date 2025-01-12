import { Link } from "wouter";
import { Home, Bot, Trophy, Settings, Lock } from "lucide-react";

const navigation = [
  { name: "Dashboard", href: "/", icon: Home },
  { name: "AI Agents", href: "/agents", icon: Bot },
  { name: "Missions", href: "/missions", icon: Trophy },
  { name: "Darknet Hub", href: "/darknet", icon: Lock },
  { name: "Settings", href: "/settings", icon: Settings },
];

export default function Sidebar() {
  return (
    <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col">
      <div className="flex grow flex-col gap-y-5 overflow-y-auto border-r border-gray-800 bg-black px-6 pb-4">
        <div className="flex h-16 shrink-0 items-center">
          <h1 className="text-xl font-bold text-primary">Sobol AI</h1>
        </div>
        <nav className="flex flex-1 flex-col">
          <ul role="list" className="flex flex-1 flex-col gap-y-7">
            <li>
              <ul role="list" className="-mx-2 space-y-1">
                {navigation.map((item) => (
                  <li key={item.name}>
                    <Link href={item.href}>
                      <a className="group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold text-gray-400 hover:text-white hover:bg-gray-800">
                        <item.icon className="h-6 w-6 shrink-0" aria-hidden="true" />
                        {item.name}
                      </a>
                    </Link>
                  </li>
                ))}
              </ul>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  );
}
