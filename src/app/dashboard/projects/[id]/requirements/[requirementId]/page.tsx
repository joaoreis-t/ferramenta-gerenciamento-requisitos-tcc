'use client'

import Header from '@/app/dashboard/header';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { getRequirementAction, listRequirementVersionsAction, updateRequirementAction } from '@/actions/requirementAction';
import Slider from '@/app/dashboard/slider';
import ConfirmationModal from '@/app/dashboard/confirmationModal';
import RelationshipModal from '@/app/dashboard/relationshipModal';
import EditRequirementModal from '@/app/dashboard/editRequirementModal';
import VersionDetailsModal from '@/app/dashboard/versionDetailsModal';
import RelationshipDetailsModal from '@/app/dashboard/relationshipDetailsModal';
import formatDate from '@/util/formatDate';
import { deleteRelationshipAction } from '@/actions/requirementAction';


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

function getTypeStyle(type: string) {
  switch (type) {
    case "FUNCIONAL":
      return "border-blue-200 bg-blue-200/25 text-blue-200";

    case "NAO_FUNCIONAL":
      return "border-pink-200 bg-pink-200/25 text-pink-200";

    default:
      return "";
  }
}

const modalConfig = {
  CONCLUIR: {
    title: 'Concluir requisito',
    message:
      'Tem certeza que deseja marcar este requisito como finalizado?',
    confirmText: 'Concluir',
  },

  DESATIVAR: {
    title: 'Desativar requisito',
    message:
      'Tem certeza que deseja desativar este requisito?',
    confirmText: 'Desativar',
  },

  REATIVAR: {
    title: 'Reativar requisito',
    message:
      'Tem certeza que deseja reativar este requisito? O status será alterado para PENDENTE.',
    confirmText: 'Reativar',
  },
};

export default function RequirementPage(){
  const params = useParams();
  const requirementId = params.requirementId as string;

  const [requirement, setRequirement] = useState<any>(null);
  const [versions, setVersions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [modalOpen, setModalOpen] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);

  const [actionType, setActionType] = useState<
  'CONCLUIR' | 'DESATIVAR' | 'REATIVAR' | null
  >(null);

  const [relationshipModalOpen, setRelationshipModalOpen] = useState(false);

  const [editModalOpen, setEditModalOpen] = useState(false);

  const [versionModalOpen, setVersionModalOpen] = useState(false);
  const [selectedVersion, setSelectedVersion] = useState<any>(null);
  const [selectedVersionLabel, setSelectedVersionLabel] = useState('');

  const [relationshipDetailsOpen, setRelationshipDetailsOpen] = useState(false);
  const [selectedRelatedRequirement, setSelectedRelatedRequirement] = useState<any>(null);
  const [removeRelationshipModalOpen, setRemoveRelationshipModalOpen] = useState(false);
  const [removeRelationshipLoading, setRemoveRelationshipLoading] = useState(false);

  async function loadRequirement() {
    try {
      const [requirementData, versionsData] = await Promise.all([
        getRequirementAction(requirementId),
        listRequirementVersionsAction(requirementId)
      ]);
      console.log("Requisito:", requirementData);
      console.log("Versões:", versionsData);

      setRequirement(requirementData);
      setVersions(versionsData);
    } catch (error) {
      console.error("Erro ao carregar dados:", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (requirementId) {
      loadRequirement();
    }
  }, [requirementId]);

  if (loading || !requirement) {
    return (
      <div className="bg-[#121626] min-h-screen text-white">
        Carregando...
      </div>
    );
  }

  const relatedRequirements = [
    ...requirement.originRelations.map(
      (relation: any) => ({
        relationId: relation.id,
        requirement: relation.targetRequirement,
      }),
    ),

    ...requirement.targetRelations.map(
      (relation: any) => ({
        relationId: relation.id,
        requirement: relation.originRequirement,
      }),
    ),
  ];

  const relatedRequirementIds = new Set([
    ...requirement.originRelations.map(
      (relation: any) => relation.targetRequirement.id,
    ),

    ...requirement.targetRelations.map(
      (relation: any) => relation.originRequirement.id,
    ),
  ]);

  function openModal(
    action: 'CONCLUIR' | 'DESATIVAR' | 'REATIVAR'
  ) {
    setActionType(action);
    setModalOpen(true);
  }

  async function handleConfirmAction() {
    if (!actionType) return;

    setModalLoading(true);
    try {
      const formData = new FormData();

      formData.append('title', requirement.title);
      formData.append('description', requirement.description);
      formData.append('type', requirement.type);
      formData.append('priority', requirement.priority);

      let nextStatus = requirement.status;
      if (actionType === 'CONCLUIR') nextStatus = 'FINALIZADO';
      if (actionType === 'DESATIVAR') nextStatus = 'DESATIVADO';
      if (actionType === 'REATIVAR') nextStatus = 'PENDENTE';
      
      formData.append('status', nextStatus);

      await updateRequirementAction(requirement.id, formData);

      // 5. Recarrega a tela
      await loadRequirement();
    } catch (error) {
      console.error("Erro ao atualizar status:", error);
    } finally {
      setModalLoading(false);
      setModalOpen(false);
      setActionType(null);
    }
  }

  async function handleRemoveRelationship() {
    if (!selectedRelatedRequirement) return;

    try {
      setRemoveRelationshipLoading(true);

      await deleteRelationshipAction(
        selectedRelatedRequirement.relationId,
      );

      setRemoveRelationshipModalOpen(false);
      setRelationshipDetailsOpen(false);

      setSelectedRelatedRequirement(null);

      await loadRequirement();
    } catch (error) {
      console.error(error);
    } finally {
      setRemoveRelationshipLoading(false);
    }
  }


  return (
    <>
      <div className="bg-[#121626] min-h-screen">
        <Header />
        <div className="w-225 xl:w-full max-w-300 mx-auto">
          <div className='flex items-center justify-between pt-4 gap-30'>
            <div>
              <h1 className="text-4xl font-semibold">
                {requirement.title}
              </h1>
              <div className='mt-2 flex gap-2'>
                <div className={`p-1.5 rounded-xl ${getStatusStyle(requirement.status)}`}>
                  <p>{requirement.status}</p>
                </div>
                <div className={`p-1.5 rounded-xl ${getPriorityStyle(requirement.priority)}`}>
                  <p>{requirement.priority}</p>
                </div>
                <div className={`p-1.5 rounded-xl ${getTypeStyle(requirement.type)}`}>
                  {requirement.type === "NAO_FUNCIONAL" ? "NÃO FUNCIONAL" : "FUNCIONAL"}
                </div> 
              </div>
            </div>
            <div className='flex flex-col gap-3 shrink-0'>
              <button 
                onClick={() => setEditModalOpen(true)}
                className='bg-blue-900/60 border border-amber-50/15 p-2 rounded-lg flex gap-2 items-center justify-center cursor-pointer active:scale-95 active:shadow-sm'
              >
                <img src="/edit.svg" aria-hidden="true" className="w-5 h-5" />
                Editar Requisito
              </button>

              <div className='flex gap-3'>
                {requirement.status === 'PENDENTE' && (
                  <div className='flex gap-3'>
                    <button
                      onClick={() => openModal('DESATIVAR')}
                      className='bg-red-900/30 border border-amber-50/15 p-2 rounded-lg text-red-400 cursor-pointer active:scale-95 active:shadow-sm'
                    >
                      Desativar
                    </button>

                    <button
                      onClick={() => openModal('CONCLUIR')}
                      className='bg-green-900/30 border border-amber-50/15 p-2 rounded-lg text-green-400  cursor-pointer active:scale-95 active:shadow-sm'
                    >
                      Concluir
                    </button>
                  </div>
                )}

                {requirement.status === 'FINALIZADO' && (
                  <div className='flex gap-3'>
                    <button
                      onClick={() => openModal('DESATIVAR')}
                      className='bg-red-900/30 border border-amber-50/15 p-2 rounded-lg text-red-400 cursor-pointer active:scale-95 active:shadow-sm'
                    >
                      Desativar
                    </button>

                    <button
                      onClick={() => openModal('REATIVAR')}
                      className='bg-blue-900/30 border border-amber-50/15 p-2 rounded-lg text-blue-400 cursor-pointer active:scale-95 active:shadow-sm'
                    >
                      Reativar
                    </button>
                  </div>
                )}

                {requirement.status === 'DESATIVADO' && (
                  <button
                    onClick={() => openModal('REATIVAR')}
                    className='bg-blue-900/30 border border-amber-50/15 p-2 rounded-lg text-blue-400 cursor-pointer active:scale-95 active:shadow-sm'
                  >
                    Reativar
                  </button>
                )}
              </div>
            </div>
          </div>
          <div className="mt-8 grid grid-cols-5 gap-4">
            <div className="col-span-3 bg-[#0e2c4f] p-4 max-h-[332px] overflow-y-auto
                        [&::-webkit-scrollbar]:w-2
                        [&::-webkit-scrollbar-track]:bg-white/5
                        [&::-webkit-scrollbar-track]:rounded-lg
                        [&::-webkit-scrollbar-thumb]:bg-blue-500/20
                        [&::-webkit-scrollbar-thumb]:rounded-lg
                        hover:[&::-webkit-scrollbar-thumb]:bg-blue-500/40">
              <div className="flex justify-between gap-4 items-center">
                <h3 className='font-medium text-lg'>
                  Descrição
                </h3>
                <div className="flex gap-6">
                  <div className="flex flex-col items-end">
                    <div className='text-sm text-gray-400/80'>CRIADO</div>
                    <div className='text-sm text-blue-400/50'>{formatDate(requirement.createdAt)}</div>
                  </div>

                  <div className="flex flex-col items-end">
                    <div className='text-sm  text-gray-400/80'>ULT. ATUALIZAÇÃO</div>
                    <div className='text-sm  text-blue-400/70'>
                      {formatDate(requirement.updatedAt)}
                    </div>
                  </div>
                </div>
              </div>
              <div className='mt-4 text-justify'>
                {requirement.description}
              </div>
            </div>

            <div className="col-span-2 bg-[#0e2c4f] p-4 max-h-[332px] overflow-y-auto
                        [&::-webkit-scrollbar]:w-2
                        [&::-webkit-scrollbar-track]:bg-white/5
                        [&::-webkit-scrollbar-track]:rounded-lg
                        [&::-webkit-scrollbar-thumb]:bg-blue-500/20
                        [&::-webkit-scrollbar-thumb]:rounded-lg
                        hover:[&::-webkit-scrollbar-thumb]:bg-blue-500/40">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-medium text-lg">
                  Requisitos Relacionados
                </h3>

                <button
                  onClick={() => setRelationshipModalOpen(true)}
                  className="bg-[#1a4dd7] px-3 py-2 rounded-lg text-sm hover:cursor-pointer"
                >
                  Vincular
                </button>
              </div>

              <div className="space-y-2">
                <h4 className="text-sm font-medium text-gray-400">
                  É referenciado por
                </h4>

                {requirement.targetRelations.length === 0 ? (
                  <p className="text-gray-500 text-sm">
                    Nenhum requisito referencia este requisito.
                  </p>
                ) : (
                  requirement.targetRelations.map((relation: any) => (
                    <div
                      key={relation.id}
                      onClick={() => {
                        setSelectedRelatedRequirement({
                          relationId: relation.id,
                          requirement: relation.originRequirement,
                        });

                        setRelationshipDetailsOpen(true);
                      }}
                      className="bg-[#132f52] border border-white/10 rounded-lg p-3 cursor-pointer hover:border-blue-400/30 transition-all"
                    >
                      <div className="font-medium">
                        {relation.originRequirement.requirementCode}
                      </div>

                      <div className="text-sm text-gray-300">
                        {relation.originRequirement.title}
                      </div>
                    </div>
                  ))
                )}
              </div>
              <div className="space-y-2 mt-6">
                <h4 className="text-sm font-medium text-gray-400">
                  Referencia
                </h4>

                {requirement.originRelations.length === 0 ? (
                  <p className="text-gray-500 text-sm">
                    Este requisito não referencia outros requisitos.
                  </p>
                ) : (
                  requirement.originRelations.map((relation: any) => (
                    <div
                      key={relation.id}
                      onClick={() => {
                        setSelectedRelatedRequirement({
                          relationId: relation.id,
                          requirement: relation.targetRequirement,
                        });

                        setRelationshipDetailsOpen(true);
                      }}
                      className="bg-[#132f52] border border-white/10 rounded-lg p-3 cursor-pointer hover:border-blue-400/30 transition-all"
                    >
                      <div className="font-medium">
                        {relation.targetRequirement.requirementCode}
                      </div>

                      <div className="text-sm text-gray-300">
                        {relation.targetRequirement.title}
                      </div>
                    </div>
                  ))
                )}
              </div>
              
              {/*
              <div className="space-y-2">
                {relatedRequirements.length === 0 ? (
                  <p className="text-gray-400 text-sm">
                    Nenhum requisito relacionado.
                  </p>
                ) : (
                  relatedRequirements.map((relation) => (
                    <div
                      key={relation.relationId}
                      onClick={() => {
                        setSelectedRelatedRequirement(relation);
                        setRelationshipDetailsOpen(true);
                      }}
                      className="bg-[#132f52] border border-white/10 rounded-lg p-3 cursor-pointer hover:border-blue-400/30 transition-all"
                    >
                      <div className="font-medium">
                        {relation.requirement.requirementCode}
                      </div>

                      <div className="text-sm text-gray-300">
                        {relation.requirement.title}
                      </div>
                    </div>
                  ))
                )}
              </div>
              */}

            </div>

            <div 
              className="col-span-3 bg-[#0e2c4f] p-4 max-h-[420px] overflow-y-auto
                          [&::-webkit-scrollbar]:w-2
                          [&::-webkit-scrollbar-track]:bg-white/5
                          [&::-webkit-scrollbar-track]:rounded-lg
                          [&::-webkit-scrollbar-thumb]:bg-blue-500/20
                          [&::-webkit-scrollbar-thumb]:rounded-lg
                          hover:[&::-webkit-scrollbar-thumb]:bg-blue-500/40"
            >
              <h3 className='font-medium text-lg mb-4'>
                Arquivos Externos
              </h3>
              <Slider 
                requirement={requirement} 
                onRefresh={loadRequirement}
              />
            </div>

            <div 
              className="col-span-2 bg-[#0e2c4f] p-4 max-h-[420px] overflow-y-auto
                          [&::-webkit-scrollbar]:w-2
                          [&::-webkit-scrollbar-track]:bg-white/5
                          [&::-webkit-scrollbar-track]:rounded-lg
                          [&::-webkit-scrollbar-thumb]:bg-blue-500/20
                          [&::-webkit-scrollbar-thumb]:rounded-lg
                          hover:[&::-webkit-scrollbar-thumb]:bg-blue-500/40"
            >
              <h3 className="font-medium text-lg mb-4">
                Versões
              </h3>

              <div className="space-y-4">
                {versions.length === 0 ? (
                  <p className="text-gray-400 text-sm">Nenhuma versão registrada.</p>
                ) : (
                  versions.map((version, index) => {
                    const vLabel = `v${versions.length - index}`;
                    
                    return (
                      <div
                        key={version.id}
                        className="relative pl-6"
                      >
                        {index !== versions.length - 1 && (
                          <div className="absolute left-[7px] top-5 h-full w-px bg-white/20" />
                        )}

                        <div className="absolute left-0 top-1.5 h-4 w-4 rounded-full bg-blue-400" />

                        <div 
                          onClick={() => {
                            setSelectedVersion(version);
                            setSelectedVersionLabel(vLabel);
                            setVersionModalOpen(true);
                          }}
                          className="rounded-lg border border-white/10 bg-[#132f52] p-3 cursor-pointer hover:border-blue-400/30 transition-all active:scale-[0.99]"
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-medium text-blue-300">
                              {vLabel}
                            </span>

                            <span className="text-xs text-gray-400">
                              {formatDate(version.createdAt)}
                            </span>
                          </div>

                          <p className="mt-2 text-sm text-gray-300">
                            {version.description}
                          </p>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <ConfirmationModal
        isOpen={modalOpen}
        title={actionType ? modalConfig[actionType].title : ''}
        message={actionType ? modalConfig[actionType].message : ''}
        confirmText={actionType ? modalConfig[actionType].confirmText : ''}
        onConfirm={handleConfirmAction}
        loading={modalLoading}
        onCancel={() => {
          setModalOpen(false);
          setActionType(null);
        }}
      />

      <RelationshipModal
        open={relationshipModalOpen}
        onClose={() => setRelationshipModalOpen(false)}
        currentRequirementId={requirement.id}
        projectId={requirement.projectId}
        relatedRequirementIds={relatedRequirementIds}
        onRelationshipCreated={loadRequirement}
      />

      <EditRequirementModal
        isOpen={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        requirement={requirement}
        onSuccess={loadRequirement}
      />

      <VersionDetailsModal
        isOpen={versionModalOpen}
        onClose={() => setVersionModalOpen(false)}
        requirementId={requirement.id}
        versionData={selectedVersion}
        versionLabel={selectedVersionLabel}
        onSuccess={loadRequirement}
      />

      {selectedRelatedRequirement && (
        <RelationshipDetailsModal
          isOpen={relationshipDetailsOpen}
          onClose={() => {
            setRelationshipDetailsOpen(false);
            setSelectedRelatedRequirement(null);
          }}
          relationship={selectedRelatedRequirement}
          onRemove={() => {
            setRelationshipDetailsOpen(false);
            setRemoveRelationshipModalOpen(true);
          }}
        />
      )}

      <ConfirmationModal
        isOpen={removeRelationshipModalOpen}
        title="Desfazer relacionamento"
        message="Tem certeza que deseja remover este relacionamento?"
        confirmText="Remover"
        loading={removeRelationshipLoading}
        onConfirm={handleRemoveRelationship}
        onCancel={() =>
          setRemoveRelationshipModalOpen(false)
        }
      />
    </>
  )
}