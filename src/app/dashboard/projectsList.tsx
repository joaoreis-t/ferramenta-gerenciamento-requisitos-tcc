'use client';

import { useState, useEffect } from "react";
import { CreateProjectModal } from "./createProjectModal";
import { listProjectsAction } from "@/actions/projectAction";
import Link from "next/link";

type Project = {
  id: string;
  name: string;
  description?: string | null;
  createdAt: string | Date;
};

interface Props {
  search: string;
}

export default function ProjectsList({
  search,
}: Props) {
  const [open, setOpen] = useState(false);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  async function loadProjects() {
    setLoading(true);

    const data = await listProjectsAction();

    setProjects(data);
    setLoading(false);
  }

  useEffect(() => {
    loadProjects();
  }, []);

  const filteredProjects = projects.filter(
    (project) =>
      project.name
        .toLowerCase()
        .includes(search.toLowerCase()) ||

      (project.description ?? '')
        .toLowerCase()
        .includes(search.toLowerCase()),
  );

  return(
    <>
      <CreateProjectModal 
        open={open} 
        onClose={() => {
          setOpen(false);
          loadProjects();
        }} 
      />

      <div className="w-225 xl:w-full max-w-300 mx-auto mt-10 grid grid-cols-2 gap-4">
        <div className="col-span-2 flex items-center justify-between">
          <div className="p-4 pl-0">
            <h1 className="text-4xl font-semibold">Meus Projetos</h1>
          </div>
          <button
            onClick={() => setOpen(true)} 
            className="bg-[#1a4dd7] flex items-center justify-center gap-2 w-56 h-13 rounded-lg hover:cursor-pointer transition-transform duration-150 
            active:scale-95 active:shadow-inner"
          >
            <img
              src="/sum.svg"
              aria-hidden="true"
              className="w-7 h-7"
            />
            Criar Novo Projeto
          </button>   
        </div>
        
        <div className="col-span-2">
          {loading ? (
            <p className="text-white">Carregando...</p>
          ) : (
            filteredProjects.length === 0 ? (
              <p className="text-gray-400">
                Nenhum projeto encontrado.
              </p>
            ) : (
              filteredProjects.map((project) => (
                <Link 
                  href={`/dashboard/projects/${project.id}`} 
                  key={project.id}
                  onClick={() => {
                    localStorage.setItem(
                      'lastProject',
                      JSON.stringify({
                        id: project.id,
                        name: project.name,
                      }),
                    );
                  }}
                >
                  <div
                  className="bg-[#0e2c4f] p-6 rounded-xl flex items-center justify-between xl:justify-start gap-8 cursor-pointer hover:bg-[#123a63] active:scale-95 transition-all duration-200 mb-3 "
                  >
                    <div className="flex gap-4 xl:gap-6 flex-1">
                      <div className="bg-[#274970] p-2 rounded-md w-fit shrink-0">
                        <img src="/projectIcon.svg" className="w-10 h-10" />
                      </div>

                      <div className="min-w-0 flex-1">
                        <h2 className="text-xl font-medium text-[#d7d3d3]">
                          {project.name}
                        </h2>

                        <p className="text-[#5b80ab] font-medium line-clamp-1">
                          {project.description || " "}
                        </p>
                      </div>
                    </div>

                    <div className="shrink-0">
                      <p className="text-[#5b80ab] font-medium text-sm">
                        CRIADO EM
                      </p>
                      <p className="text-[#d7d3d3] text-sm">
                        {new Date(project.createdAt).toLocaleDateString("pt-BR")}
                      </p>
                    </div>

                    <img
                      src="/chevronRight.svg"
                      className="w-5 h-5 xl:ml-auto"
                    />
                  </div>
                </Link>
              ))
            )
          )}
        </div>
      </div>
    </>
  );
}