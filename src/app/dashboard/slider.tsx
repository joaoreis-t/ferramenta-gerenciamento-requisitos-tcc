'use client';

import { useState } from 'react';
import { addExternalLinkAction, removeExternalLinkAction } from '@/actions/requirementAction';

interface SliderProps {
  requirement: any;
  onRefresh: () => void;
}

export default function Slider({ requirement, onRefresh }: SliderProps) {
  const [name, setName] = useState('');
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);

  const links = (requirement?.links as Array<{ name: string; url: string }>) || [];

  async function handleAddLink(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !url.trim()) return;

    setLoading(true);
    try {
      await addExternalLinkAction(requirement.id, name.trim(), url.trim());
      setName('');
      setUrl('');
      onRefresh();
    } catch (err: any) {
      alert(err.message || 'Erro ao adicionar link');
    } finally {
      setLoading(false);
    }
  }

  async function handleRemoveLink(urlToRemove: string) {
    if (!confirm('Deseja desvincular este arquivo externo?')) return;

    try {
      await removeExternalLinkAction(requirement.id, urlToRemove);
      onRefresh();
    } catch (err: any) {
      alert(err.message || 'Erro ao remover link');
    }
  }

  return (
    <div className="space-y-4">
      <form onSubmit={handleAddLink} className="flex flex-col gap-2 p-3 rounded-lg border border-white/5 bg-[#121626]/40">
        <div className="grid grid-cols-2 gap-2">
          <input
            type="text"
            placeholder="Nome (Ex: Documento Figma)"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full bg-[#132f52] border border-white/10 rounded-lg p-2 text-xs text-white outline-none"
          />
          <input
            type="url"
            placeholder="https://links.com..."
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="w-full bg-[#132f52] border border-white/10 rounded-lg p-2 text-xs text-white outline-none"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-medium text-xs py-1.5 px-3 rounded-lg transition-colors cursor-pointer"
        >
          {loading ? 'Adicionando...' : '+ Vincular Novo Arquivo'}
        </button>
      </form>

      <div className="space-y-2">
        {links.length === 0 ? (
          <p className="text-gray-400 text-sm">Nenhum arquivo externo vinculado.</p>
        ) : (
          links.map((link, idx) => (
            <div 
              key={idx} 
              className="flex items-center justify-between gap-3 rounded-lg border border-white/10 bg-[#132f52] p-3 group transition-all"
            >
              <a
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 min-w-0 group-hover:text-blue-300 transition-colors"
              >
                <div className="font-medium text-sm text-blue-300 truncate">
                  {link.name}
                </div>
                <div className="text-xs text-gray-400 truncate mt-0.5">
                  {link.url}
                </div>
              </a>

              <button
                onClick={() => handleRemoveLink(link.url)}
                className="text-gray-500 hover:text-red-400 p-1 rounded transition-colors cursor-pointer opacity-0 group-hover:opacity-100"
                title="Remover Link"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}