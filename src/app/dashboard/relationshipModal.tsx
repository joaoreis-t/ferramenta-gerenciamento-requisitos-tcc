'use client';

import { useEffect, useState } from 'react';

import {
  createRelationshipAction,
  listRequirementsAction,
} from '@/actions/requirementAction';

interface Props {
  open: boolean;
  onClose: () => void;
  projectId: string;
  currentRequirementId: string;
  relatedRequirementIds: Set<string>;
  onRelationshipCreated?: () => void;
}

export default function RelationshipModal({
  open,
  onClose,
  projectId,
  currentRequirementId,
  relatedRequirementIds,
  onRelationshipCreated,
}: Props) {
  const [requirements, setRequirements] = useState<any[]>([]);
  const [selectedRequirementId, setSelectedRequirementId] = useState('');

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!open) return;

    async function loadRequirements() {
      const data = await listRequirementsAction(projectId);

      setRequirements(
        data.filter(
          (requirement) =>
            requirement.id !== currentRequirementId &&
            !relatedRequirementIds.has(requirement.id),
        ),
      );
    }

    loadRequirements();
  }, [open, projectId, currentRequirementId]);

  async function handleCreateRelationship() {
    if (!selectedRequirementId) return;

    try {
      setLoading(true);

      await createRelationshipAction(
        currentRequirementId,
        selectedRequirementId,
      );

      onRelationshipCreated?.();

      onClose();
    } finally {
      setLoading(false);
    }
  }

  if (!open) return null;

  const hasAvailableRequirements =
  requirements.length > 0;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-[#0e2c4f] p-6 rounded-xl w-120">
        <h2 className="text-xl font-semibold mb-4 text-white">
          Vincular Requisito
        </h2>

        {hasAvailableRequirements ? (
          <select
            value={selectedRequirementId}
            onChange={(e) =>
              setSelectedRequirementId(e.target.value)
            }
            className="w-full p-3 rounded-md bg-[#274970] text-white outline-none"
          >
            <option value="">
              Selecione um requisito
            </option>

            {requirements.map((requirement) => (
              <option
                key={requirement.id}
                value={requirement.id}
              >
                {requirement.requirementCode} - {requirement.title}
              </option>
            ))}
          </select>
        ) : (
          <div className="rounded-md bg-[#274970] p-4 text-center text-gray-300">
            Todos os requisitos do projeto já estão vinculados.
          </div>
        )}

        <div className="flex justify-end gap-2 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-md bg-gray-500"
          >
            Cancelar
          </button>

          <button
            disabled={
              !selectedRequirementId ||
              loading ||
              !hasAvailableRequirements
            }
            onClick={handleCreateRelationship}
            className="px-4 py-2 rounded-md bg-[#1a4dd7]"
          >
            {loading ? 'Vinculando...' : 'Vincular'}
          </button>
        </div>
      </div>
    </div>
  );
}