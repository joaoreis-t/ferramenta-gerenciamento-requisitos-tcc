"use client"

import { signOut } from "next-auth/react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { usePathname } from 'next/navigation';

interface LastProject {
  id: string;
  name: string;
}

interface HeaderProps {
  search?: string;
  onSearchChange?: (value: string) => void;
}

export default function Header({
  search = '',
  onSearchChange,
}: HeaderProps) {
  const pathname = usePathname();

  const [lastProject, setLastProject] = useState<LastProject | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem('lastProject');

    if (stored) {
      try {
        setLastProject(JSON.parse(stored));
      } catch {
        localStorage.removeItem('lastProject');
      }
    }
  }, [pathname]);

  const active =
    pathname === '/dashboard'
      ? 'projects'
      : pathname.startsWith('/dashboard/projects/')
        ? 'requirements'
        : '';

  const linkClass = (name: string) =>
    `relative font-medium transition-all duration-200
     ${
       active === name
         ? "text-[#4d8aeb] after:content-[''] after:absolute after:left-0 after:-bottom-2 after:h-[3px] after:w-full after:bg-[#4d8aeb] after:rounded-full hover:cursor-pointer"
         : "text-white hover:text-gray-300 hover:cursor-pointer"
     }`;


  return(
    <header className="bg-[#121626] h-16 border-b border-b-[#282b31]">
      <div className="flex justify-between items-center h-full">
        <div className="flex gap-4 items-center">
          <div className="ml-8 max-w-[200px] lg:max-w-[300px]">
            <span
              className="
                block
                truncate
                text-2xl
                text-[#5f7ae9]
                font-medium
              "
              title={lastProject?.name}
            >
              {lastProject?.name ?? 'My Project'}
            </span>
          </div>
          <div className="pl-8">
            <nav className="flex gap-6">
               <Link
                href="/dashboard"
                className={linkClass('projects')}
              >
                Projetos
              </Link>

              {lastProject ? (
                <Link
                  href={`/dashboard/projects/${lastProject.id}`}
                  className={linkClass('requirements')}
                >
                  Requisitos
                </Link>
              ) : (
                <span
                  className="
                    text-gray-500
                    font-medium
                    cursor-not-allowed
                  "
                >
                  Requisitos
                </span>
              )}
            </nav>
          </div>
        </div>

        <div className="flex gap-4 items-center mr-8">
          {onSearchChange && (
            <input
              type="text"
              value={search}
              onChange={(e) =>
                onSearchChange(e.target.value)
              }
              placeholder="Buscar projeto..."
              className="
                w-72
                px-4
                py-2
                rounded-lg
                bg-[#0e2c4f]
                border border-white/10
                text-white
                outline-none
              "
            />
          )}
          {/*
          <button
            type="button"
            aria-label="Configurações de usuário"
            className="p-2 hover:bg-[#303B59] hover:cursor-pointer rounded-2xl border-2 border-[#6b7280]"
          >
            <img
            src="/settings.svg"
            aria-hidden="true"
            className="w-7 h-7"
            />
          </button>
          */}
          <button 
            onClick={() => {
              localStorage.removeItem('lastProject');
              signOut({ callbackUrl: '/login' });
            }}
            className="text-[#909aaf] font-bold hover:text-red-400 transition-colors cursor-pointer"
          >
            Log out
          </button>
        </div>
      </div>
    </header>
  );
}