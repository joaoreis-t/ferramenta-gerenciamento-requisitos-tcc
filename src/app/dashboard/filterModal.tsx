'use client';

import { useState } from "react";

type Filter = {
  status: string;
  priority: string;
  type: string;
};

type FilterModalProps = {
  open: boolean;
  onClose: () => void;
  onApply: (filters: Filter) => void;
  current: Filter;
};

export function FilterModal({ open, onClose, onApply, current }: FilterModalProps) {
  const [local, setLocal] = useState<Filter>(current);

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-[#0e2c4f] p-6 rounded-xl w-100">
        <h2 className="text-xl text-white mb-4">Filtrar</h2>

        <div className="flex flex-col gap-3">
          <select
            value={local.status}
            onChange={(e) => setLocal({ ...local, status: e.target.value })}
            className="p-3 bg-[#274970] text-white rounded"
          >
            <option value="">Status</option>
            <option value="PENDENTE">Pendente</option>
            <option value="FINALIZADO">Finalizado</option>
            <option value="DESATIVADO">Desativado</option>
          </select>

          <select
            value={local.priority}
            onChange={(e) => setLocal({ ...local, priority: e.target.value })}
            className="p-3 bg-[#274970] text-white rounded"
          >
            <option value="">Prioridade</option>
            <option value="ESSENCIAL">Essencial</option>
            <option value="IMPORTANTE">Importante</option>
            <option value="DESEJAVEL">Desejável</option>
          </select>

          <select
            value={local.type}
            onChange={(e) => setLocal({ ...local, type: e.target.value })}
            className="p-3 bg-[#274970] text-white rounded"
          >
            <option value="">Tipo</option>
            <option value="FUNCIONAL">Funcional</option>
            <option value="NAO_FUNCIONAL">Não funcional</option>
          </select>
        </div>

        <div className="flex justify-end gap-2 mt-4">
          <button onClick={onClose} className="bg-gray-500 px-4 py-2 rounded">
            Cancelar
          </button>
          <button
            onClick={() => {
              onApply(local);
              onClose();
            }}
            className="bg-[#1a4dd7] px-4 py-2 rounded"
          >
            Aplicar
          </button>
        </div>
      </div>
    </div>
  );
}