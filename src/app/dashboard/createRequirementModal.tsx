'use client';

import { useRef, useState } from 'react';
import { createRequirementAction } from '@/actions/requirementAction';

export function CreateRequirementModal({
  open,
  onClose,
  projectId,
}: {
  open: boolean;
  onClose: () => void;
  projectId: string;
}) {
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const formRef = useRef<HTMLFormElement>(null);

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-[#0e2c4f] p-6 rounded-xl w-110">
        <h2 className="text-xl font-semibold mb-4 text-white">
          Criar Requisito
        </h2>

        <form
          ref={formRef}
          action={async (formData) => {
            const res = await createRequirementAction(formData);

            if (res?.error) {
              setError(res.error);
              setSuccess('');
              return;
            }

            setError('');
            setSuccess('Requisito criado com sucesso! 🎉');

            formRef.current?.reset();

            setTimeout(() => {
              setSuccess('');
              onClose();
            }, 2000);
          }}
          className="flex flex-col gap-4"
        >
          <input
            name="title"
            placeholder="Título do requisito"
            required
            className="p-3 rounded-md bg-[#274970] text-white outline-none"
          />

          <textarea
            name="description"
            placeholder="Descrição"
            required
            className="p-3 rounded-md bg-[#274970] text-white outline-none resize-none"
          />

          {/* Tipo */}
          <select
            name="type"
            required
            className="p-3 rounded-md bg-[#274970] text-white outline-none"
          >
            <option value="">Tipo</option>
            <option value="FUNCIONAL">Funcional</option>
            <option value="NAO_FUNCIONAL">Não funcional</option>
          </select>

          {/* Prioridade */}
          <select
            name="priority"
            required
            className="p-3 rounded-md bg-[#274970] text-white outline-none"
          >
            <option value="">Prioridade</option>
            <option value="ESSENCIAL">Essencial</option>
            <option value="IMPORTANTE">Importante</option>
            <option value="DESEJAVEL">Desejável</option>
          </select>

          {/* Status */}
          <select
            name="status"
            required
            className="p-3 rounded-md bg-[#274970] text-white outline-none"
          >
            <option value="">Status</option>
            <option value="PENDENTE">Pendente</option>
            <option value="FINALIZADO">Finalizado</option>
            <option value="DESATIVADO">Desativado</option>
          </select>

          {/* Links (opcional JSON string)
          <input
            name="links"
            placeholder='Links (JSON opcional, ex: ["http://..."])'
            className="p-3 rounded-md bg-[#274970] text-white outline-none"
          />
          */}

          {/* Hidden projectId */}
          <input type="hidden" name="projectId" value={projectId} />

          {error && <p className="text-red-400 text-sm">{error}</p>}

          {success && <p className="text-green-400 text-sm">{success}</p>}

          <div className="flex justify-end gap-2 mt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-md bg-gray-500 hover:cursor-pointer"
            >
              Cancelar
            </button>

            <button
              type="submit"
              className="px-4 py-2 rounded-md bg-[#1a4dd7] hover:cursor-pointer"
            >
              Criar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}