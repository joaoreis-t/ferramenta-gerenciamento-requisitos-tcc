'use client';

import { useState } from "react";

type SortType = "recent" | "old" | "priority" | "status";

type SortModalProps = {
  open: boolean;
  onClose: () => void;
  onApply: (value: SortType) => void;
  current: SortType;
};

export function SortModal({ open, onClose, onApply, current }: SortModalProps) {
  const [value, setValue] = useState<SortType>(current);

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-[#0e2c4f] p-6 rounded-xl w-80">
        <h2 className="text-xl text-white mb-4">Ordenar</h2>

        <select
          value={value}
          onChange={(e) => setValue(e.target.value  as SortType)}
          className="w-full p-3 bg-[#274970] text-white rounded"
        >
          <option value="recent">Mais recentes</option>
          <option value="old">Mais antigos</option>
          <option value="priority">Prioridade</option>
          <option value="status">Status</option>
        </select>

        <div className="flex justify-end gap-2 mt-4">
          <button onClick={onClose} className="bg-gray-500 px-4 py-2 rounded">
            Cancelar
          </button>
          <button
            onClick={() => {
              onApply(value);
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