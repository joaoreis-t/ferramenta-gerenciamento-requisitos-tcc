'use server';

import { projectService } from '@/services/projectService';
import { auth } from '../../auth';

export async function createProjectAction(formData: FormData) {
  try {
    const session = await auth();
    console.log('SESSION:', session);

    if (!session?.user?.id) {
      throw new Error('Não autenticado');
    }

    const name = formData.get('name') as string;
    const description = formData.get('description') as string;

    await projectService.createProject({
      name,
      description,
      userId: session.user.id,
    });

    return { success: true };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Erro inesperado';
    return { error: message };
  }
}

export async function listProjectsAction() {
  const session = await auth();

  if (!session?.user?.id) {
    throw new Error('Não autenticado');
  }

  return projectService.listUserProjects(session.user.id);
}

export async function getProjectAction(projectId: string) {
  const session = await auth();

  if (!session?.user?.id) {
    throw new Error('Não autenticado');
  }

  return projectService.getProject(projectId, session.user.id);
}
