'use client';

import { useState } from 'react';
import { restoreVersionAction } from '@/actions/requirementAction';

interface VersionDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  requirementId: string;
  versionData: any; // Dados da versão clicada
  versionLabel: string;
  onSuccess: () => void;
}

export default function VersionDetailsModal({ isOpen, onClose, requirementId, versionData, versionLabel, onSuccess }: VersionDetailsModalProps) {
  const [loading, setLoading] = useState(false);

  if (!isOpen || !versionData) return null;

  async function handleRestore() {
    setLoading(true);
    try {
      await restoreVersionAction(requirementId, versionData);
      onSuccess();
      onClose();
    } catch (error) {
      console.error(error);
      alert('Erro ao restaurar versão');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="w-full max-w-lg rounded-xl border border-white/10 bg-[#121626] p-6 text-white shadow-2xl">
        <h2 className="text-xl font-semibold mb-4 text-blue-300">Visualizando Histórico ({versionLabel})</h2>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">Título</label>
            <input type="text" value={versionData.title} readOnly className="w-full rounded-lg border border-white/5 bg-[#0e2c4f]/50 p-2.5 text-sm outline-none" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">Descrição</label>
            <textarea value={versionData.description} readOnly rows={4} className="w-full rounded-lg border border-white/5 bg-[#0e2c4f]/50 p-2.5 text-sm outline-none resize-none" />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Tipo</label>
              <div className="w-full rounded-lg border border-white/5 bg-[#0e2c4f]/50 p-2.5 text-sm">{versionData.type}</div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Prioridade</label>
              <div className="w-full rounded-lg border border-white/5 bg-[#0e2c4f]/50 p-2.5 text-sm">{versionData.priority}</div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Status</label>
              <div className="w-full rounded-lg border border-white/5 bg-[#0e2c4f]/50 p-2.5 text-sm">{versionData.status}</div>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-white/5">
            <button onClick={onClose} className="px-4 py-2 text-sm rounded-lg border border-white/10 hover:bg-white/5 transition-colors cursor-pointer">
              Fechar
            </button>
            <button 
              onClick={handleRestore} 
              disabled={loading}
              className="px-4 py-2 text-sm rounded-lg bg-green-600 hover:bg-green-700 font-medium transition-colors cursor-pointer disabled:opacity-50"
            >
              {loading ? 'Restaurando...' : 'Restaurar esta Versão'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}