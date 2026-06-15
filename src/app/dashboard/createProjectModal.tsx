'use client';

import { useRef, useState } from 'react';
import { createProjectAction } from '@/actions/projectAction';

export function CreateProjectModal({ open, onClose }: { open: boolean; onClose: () => void }) {

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const formRef = useRef<HTMLFormElement>(null);

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-[#0e2c4f] p-6 rounded-xl w-100">
        <h2 className="text-xl font-semibold mb-4 text-white">
          Criar Projeto
        </h2>

        <form
          ref={formRef}
          action={async (formData) => {
            const res = await createProjectAction(formData);

            if (res?.error) {
              setError(res.error);
              setSuccess('');
              return;
            }
            
            setError('');
            setSuccess('Projeto criado com sucesso! 🎉');

            formRef.current?.reset();

            setTimeout(() => {
              setSuccess('');
              onClose();
            }, 2000);
          }}
          className="flex flex-col gap-4"
        >
          <input
            name="name"
            placeholder="Nome do projeto"
            required
            className="p-3 rounded-md bg-[#274970] text-white outline-none"
          />

          <textarea
            name="description"
            placeholder="Descrição"
            required
            className="p-3 rounded-md bg-[#274970] text-white outline-none resize-none"
          />

          {error && (
            <p className="text-red-400 text-sm">
              {error}
            </p>
          )}

          {success && (
            <p className="text-green-400 text-sm">
              {success}
            </p>
          )}

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