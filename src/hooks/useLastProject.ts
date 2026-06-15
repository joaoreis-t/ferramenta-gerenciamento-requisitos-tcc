'use client';

const KEY_ID = 'lastProjectId';
const KEY_NAME = 'lastProjectName';

export function saveLastProject(id: string, name: string) {
  localStorage.setItem(KEY_ID, id);
  localStorage.setItem(KEY_NAME, name);
}

export function getLastProject() {
  if (typeof window === 'undefined') return null;

  const id = localStorage.getItem(KEY_ID);
  const name = localStorage.getItem(KEY_NAME);

  if (!id || !name) return null;

  return { id, name };
}
