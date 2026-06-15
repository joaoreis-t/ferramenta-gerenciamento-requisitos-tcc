'use client';

import { useState, useEffect } from 'react';
import { updateRequirementAction } from '@/actions/requirementAction';

interface EditRequirementModalProps {
  isOpen: boolean;
  onClose: () => void;
  requirement: any;
  onSuccess: () => void;
}

export default function EditRequirementModal({
  isOpen,
  onClose,
  requirement,
  onSuccess,
}: EditRequirementModalProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError('');

    const formData = new FormData(event.currentTarget);

    try {
      await updateRequirementAction(requirement.id, formData);
      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.message || 'Erro ao atualizar o requisito.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="w-full max-w-lg rounded-xl border border-white/10 bg-[#121626] p-6 text-white shadow-2xl animate-in fade-in zoom-in-95 duration-150">
        <h2 className="text-xl font-semibold mb-4 text-blue-300">Editar Requisito</h2>
        
        {error && (
          <div className="mb-4 rounded-lg bg-red-900/30 border border-red-500/30 p-3 text-sm text-red-400">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Título</label>
            <input
              type="text"
              name="title"
              defaultValue={requirement.title}
              required
              className="w-full rounded-lg border border-white/10 bg-[#0e2c4f] p-2.5 text-sm focus:outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Descrição</label>
            <textarea
              name="description"
              defaultValue={requirement.description}
              required
              rows={4}
              className="w-full rounded-lg border border-white/10 bg-[#0e2c4f] p-2.5 text-sm focus:outline-none focus:border-blue-500 resize-none"
            />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Tipo</label>
              <select
                name="type"
                defaultValue={requirement.type}
                className="w-full rounded-lg border border-white/10 bg-[#0e2c4f] p-2.5 text-sm focus:outline-none focus:border-blue-500"
              >
                <option value="FUNCIONAL">Funcional</option>
                <option value="NAO_FUNCIONAL">Não Funcional</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Prioridade</label>
              <select
                name="priority"
                defaultValue={requirement.priority}
                className="w-full rounded-lg border border-white/10 bg-[#0e2c4f] p-2.5 text-sm focus:outline-none focus:border-blue-500"
              >
                <option value="ESSENCIAL">Essencial</option>
                <option value="IMPORTANTE">Importante</option>
                <option value="DESEJAVEL">Desejável</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Status</label>
              <select
                name="status"
                defaultValue={requirement.status}
                className="w-full rounded-lg border border-white/10 bg-[#0e2c4f] p-2.5 text-sm focus:outline-none focus:border-blue-500"
              >
                <option value="PENDENTE">Pendente</option>
                <option value="FINALIZADO">Finalizado</option>
                <option value="DESATIVADO">Desativado</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-white/5">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-4 py-2 text-sm rounded-lg border border-white/10 hover:bg-white/5 transition-colors cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 text-sm rounded-lg bg-blue-600 hover:bg-blue-700 font-medium transition-colors cursor-pointer disabled:opacity-50"
            >
              {loading ? 'Salvando...' : 'Salvar Alterações'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}