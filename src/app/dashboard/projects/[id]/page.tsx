'use client'

import Link from 'next/link';
import { useParams } from 'next/navigation';
import Header from "../../header";
import { listRequirementsAction, getRequirementAction } from '@/actions/requirementAction';
import { CreateRequirementModal } from '../../createRequirementModal';
import { useState, useEffect } from 'react';
import { FilterModal } from '../../filterModal';
import { SortModal } from '../../sortModal';
import { getProjectAction } from '@/actions/projectAction';
import { exportProjectPdf } from '@/util/exportProjectPdf';

type SortType = "recent" | "old" | "priority" | "status";

export default function ProjectPage() {
  const params = useParams();
  const id = params.id as string;

  const [openModal, setOpenModal] = useState(false);

  const [openFilter, setOpenFilter] = useState(false);
  const [openSort, setOpenSort] = useState(false);

  const [filters, setFilters] = useState({
    status: "",
    priority: "",
    type: "",
  });

  const [sort, setSort] = useState<SortType>("recent");

  const [requirements, setRequirements] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [project, setProject] = useState<any>(null);
  const [search, setSearch] = useState('');

  async function loadRequirements() {
    setLoading(true);

    const data = await listRequirementsAction(id);

    setRequirements(data);
    setLoading(false);
  }

  async function loadProject() {
    setLoading(true);

    try {
      const data = await getProjectAction(id);

      if (data) {
        setProject(data);
        localStorage.setItem( 'lastProject', JSON.stringify({ id: data.id, name: data.name, }), );
      }
    } finally {
      setLoading(false);
    }
  }

  function getStatusStyle(status: string) {
    switch (status) {
      case "PENDENTE":
        return "border-amber-200 bg-amber-200/25 text-amber-200";
      case "FINALIZADO":
        return "border-green-200 bg-green-200/25 text-green-200";
      case "DESATIVADO":
        return "border-gray-400 bg-gray-400/20 text-gray-300";
      default:
        return "";
    }
  }

  function getPriorityStyle(priority: string) {
    switch (priority) {
      case "ESSENCIAL":
        return "border-red-200 bg-red-200/25 text-red-200";
      case "IMPORTANTE":
        return "border-cyan-200 bg-cyan-200/25 text-cyan-200";
      case "DESEJAVEL":
        return "border-purple-200 bg-purple-200/25 text-purple-200";
      default:
        return "";
    }
  }

  useEffect(() => {
    if (id) {
      loadRequirements();
      loadProject();
    }
  }, [id]);

  const priorityOrder = {
    ESSENCIAL: 0,
    IMPORTANTE: 1,
    DESEJAVEL: 2,
  };

  const filteredRequirements = requirements
    .filter((r) => {
      const searchTerm = search.toLowerCase().trim();

      const matchesSearch =
        searchTerm === '' ||
        r.title.toLowerCase().includes(searchTerm) ||
        r.requirementCode.toLowerCase().includes(searchTerm) ||
        r.description?.toLowerCase().includes(searchTerm);

      if (!matchesSearch) return false;

      if (filters.status && r.status !== filters.status) return false;
      if (filters.priority && r.priority !== filters.priority) return false;
      if (filters.type && r.type !== filters.type) return false;

      return true;
    })
    .sort((a, b) => {
      switch (sort) {
        case "recent":
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case "old":
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        case "priority":
          return (
            priorityOrder[a.priority as keyof typeof priorityOrder] -
            priorityOrder[b.priority as keyof typeof priorityOrder]
          );
        case "status":
          return a.status.localeCompare(b.status);
        default:
          return 0;
      }
    });

  async function handleExportPdf() {
    if (!project) return;

    const detailedRequirements = await Promise.all(
      requirements.map((requirement) =>
        getRequirementAction(requirement.id),
      ),
    );

    await exportProjectPdf(
      project,
      detailedRequirements,
    );
  }

  return (
    <>
      <div className="bg-[#121626] min-h-screen">
        <Header
          search={search}
          onSearchChange={setSearch}
        />
        <div className="w-225 xl:w-full max-w-300 mx-auto mt-10">

          <div className="col-span-2 flex items-center justify-between">
            <div className="p-4 pl-0">
              <h1 className="text-4xl font-semibold">{project?.name || 'Carregando...'}</h1>
              <p className='text-md text-gray-400 line-clamp-2'> {project?.description || 'Sem descrição'}</p>
            </div>
            <div className="flex flex-col gap-2">
              <button
                onClick={handleExportPdf}
                className=" bg-gray-800 shrink-0 flex items-center justify-center gap-2 px-4 h-13 rounded-lg cursor-pointer transition-transform duration-150 
                active:scale-95 active:shadow-inner"
              >
                <img
                  src="/download.svg"
                  className="w-5 h-5"
                />
                Exportar
              </button>

              <button
                onClick={() => setOpenModal(true)} 
                className="bg-[#1a4dd7] shrink-0 flex items-center justify-center gap-2 w-56 h-13 rounded-lg hover:cursor-pointer transition-transform duration-150 
                active:scale-95 active:shadow-inner"
              >
                <img
                  src="/sum.svg"
                  aria-hidden="true"
                  className="w-7 h-7"
                />
                Criar Requisito
              </button>
            </div>
          </div>

          <div className="mt-8 mb-8 grid grid-cols-4 gap-4">
            {/* Total */}
            <div className="bg-[#0e2c4f] p-5 rounded-xl">
              <p className="text-gray-400 text-sm">Total de requisitos</p>
              <h2 className="text-3xl font-semibold mt-2">
                {filteredRequirements.length}
              </h2>
            </div>

            {/* Pendentes */}
            <div className="bg-[#0e2c4f] p-5 rounded-xl">
              <p className="text-gray-400 text-sm">Pendentes</p>
              <h2 className="text-3xl font-semibold mt-2 text-amber-200">
                {
                  filteredRequirements.filter((r) => r.status === "PENDENTE").length
                }
              </h2>
            </div>

            {/* Finalizados */}
            <div className="bg-[#0e2c4f] p-5 rounded-xl">
              <p className="text-gray-400 text-sm">Finalizados</p>
              <h2 className="text-3xl font-semibold mt-2 text-green-200">
                {
                  filteredRequirements.filter((r) => r.status === "FINALIZADO").length
                }
              </h2>
            </div>

            {/* Essenciais */}
            <div className="bg-[#0e2c4f] p-5 rounded-xl">
              <p className="text-gray-400 text-sm">Essenciais</p>
              <h2 className="text-3xl font-semibold mt-2 text-red-200">
                {
                  filteredRequirements.filter((r) => r.priority === "ESSENCIAL").length
                }
              </h2>
            </div>
          </div>

          <div className='flex justify-between items-center  mb-8'>
            <div className='flex items-center gap-2'>
              <div className='w-3 h-6 bg-blue-700'></div>
              <h2 className='text-xl'>Requisitos</h2>
            </div>
            <div className='flex gap-2'>
              <button
                onClick={() => setOpenFilter(true)}
                className="bg-gray-800 px-3 py-2 shrink-0 flex gap-2 items-center justify-center rounded-lg hover:cursor-pointer transition-transform duration-150 
                active:scale-95 active:shadow-inner"
              >
                <img
                  src="/filter.svg"
                  aria-hidden="true"
                  className="w-4 h-4"
                />
                Filtrar
              </button>  
              <button
                onClick={() => setOpenSort(true)}
                className="bg-gray-800 px-3 py-2 shrink-0 flex gap-2 items-center justify-center rounded-lg hover:cursor-pointer transition-transform duration-150 
                active:scale-95 active:shadow-inner"
              >
                <img
                  src="/order.svg"
                  aria-hidden="true"
                  className="w-4 h-4"
                />
                Ordenar
              </button>  
            </div>
          </div>

          <div>
            {loading ? (
              <p className="text-white">Carregando...</p>
            ) : filteredRequirements.length === 0 ? (
              <p className="text-gray-400">Nenhum requisito ainda</p>
            ) : (
              filteredRequirements.map((r) => (
                <Link
                  href={`/dashboard/projects/${id}/requirements/${r.id}`}
                  key={r.id}
                >
                  <div
                    className="bg-[#0e2c4f] p-6 rounded-xl flex items-center justify-between cursor-pointer hover:bg-[#123a63] active:scale-95 transition-all duration-200 mb-3 gap-6"
                  >
                    <div className="min-w-0">
                      <p className="text-gray-500 mb-2">
                        {r.requirementCode}
                      </p>

                      <h3 className="font-medium text-xl">{r.title}</h3>

                      <p className="text-gray-400 line-clamp-1">
                        {r.description}
                      </p>
                    </div>

                    <div className="flex flex-col gap-5 shrink-0">
                      <div className={`px-3 py-2 border rounded-lg ${getStatusStyle(r.status)}`}>
                        <p className="font-medium">&bull; {r.status}</p>
                      </div>

                      <div className={`px-3 py-2 border rounded-lg text-center ${getPriorityStyle(r.priority)}`}>
                        <p className="font-medium">{r.priority}</p>
                      </div>
                    </div>
                  </div>
                </Link>
              ))
            )}
          </div>
        </div>
      </div>

      <CreateRequirementModal
        open={openModal}
        onClose={() => setOpenModal(false)}
        projectId={id}
      />

      <FilterModal
        open={openFilter}
        onClose={() => setOpenFilter(false)}
        onApply={setFilters}
        current={filters}
      />

      <SortModal
        open={openSort}
        onClose={() => setOpenSort(false)}
        onApply={setSort}
        current={sort}
      />

    </>
  );
}