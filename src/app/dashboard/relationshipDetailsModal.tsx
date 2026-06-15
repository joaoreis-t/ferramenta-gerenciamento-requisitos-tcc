'use client';

import { useRouter } from 'next/navigation';

interface Props {
  isOpen: boolean;
  onClose: () => void;

  relationship: {
    relationId: string;

    requirement: {
      id: string;
      projectId: string;
      requirementCode: string;
      title: string;
    };
  };

  onRemove: () => void;
}

export default function RelationshipDetailsModal({
  isOpen,
  onClose,
  relationship,
  onRemove,
}: Props) {
  const router = useRouter();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-[#0e2c4f] rounded-xl w-[550px] border border-white/10">
        <div className="p-6 border-b border-white/10">
          <h2 className="text-xl font-semibold text-white">
            Relacionamento de Requisito
          </h2>

          <p className="text-sm text-gray-400 mt-1">
            Escolha uma ação para o requisito relacionado.
          </p>
        </div>

        <div className="p-6">
          <div className="rounded-lg bg-[#132f52] border border-white/10 p-4">
            <div className="text-xs text-blue-300 font-medium">
              {relationship.requirement.requirementCode}
            </div>

            <div className="text-white font-medium mt-1">
              {relationship.requirement.title}
            </div>
          </div>

          <div className="mt-6 flex flex-col gap-3">
            <button
              onClick={() =>
                router.push(
                  `/dashboard/projects/${relationship.requirement.projectId}/requirements/${relationship.requirement.id}`,
                )
              }
              className="
                w-full
                bg-blue-900/40
                border border-blue-500/20
                rounded-lg
                p-3
                text-left
                cursor-pointer
                hover:bg-blue-900/60
              "
            >
              <div className="font-medium text-blue-300">
                Abrir requisito
              </div>

              <div className="text-sm text-gray-400">
                Navegar para a página deste requisito.
              </div>
            </button>

            <button
              onClick={onRemove}
              className="
                w-full
                bg-red-900/20
                border border-red-500/20
                rounded-lg
                p-3
                text-left
                cursor-pointer
                hover:bg-red-900/35
              "
            >
              <div className="font-medium text-red-300">
                Desfazer relacionamento
              </div>

              <div className="text-sm text-gray-400">
                Remover o vínculo entre os dois requisitos.
              </div>
            </button>
          </div>
        </div>

        <div className="flex justify-end gap-2 p-6 pt-0">
          <button
            onClick={onClose}
            className="
              px-4 py-2
              rounded-lg
              bg-gray-600
              hover:bg-gray-500
              cursor-pointer
            "
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
}