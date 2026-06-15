'use server';

import { requirementService } from '@/services/requirementService';
import { auth } from '../../auth';
import {
  TipoRequisito,
  PrioridadeRequisito,
  StatusRequisito,
} from '@/generated/prisma/enums';

export async function createRequirementAction(formData: FormData) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      throw new Error('Não autenticado');
    }

    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    const projectId = formData.get('projectId') as string;

    const type = formData.get('type') as TipoRequisito;
    const priority = formData.get('priority') as PrioridadeRequisito;
    const status = formData.get('status') as StatusRequisito;

    // opcional
    const linksRaw = formData.get('links') as string;
    const links = linksRaw ? JSON.parse(linksRaw) : undefined;

    await requirementService.createRequirement({
      title,
      description,
      type,
      priority,
      status,
      links,
      projectId,
      userId: session.user.id,
    });

    return { success: true };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Erro inesperado';
    return { error: message };
  }
}

export async function listRequirementsAction(projectId: string) {
  const session = await auth();

  if (!session?.user?.id) {
    throw new Error('Não autenticado');
  }

  return requirementService.listRequirements(projectId, session.user.id);
}

export async function updateRequirementAction(
  requirementId: string,
  formData: FormData,
) {
  const session = await auth();

  if (!session?.user?.id) {
    throw new Error('Não autenticado');
  }

  await requirementService.updateRequirement(requirementId, {
    title: formData.get('title') as string,
    description: formData.get('description') as string,
    type: formData.get('type') as TipoRequisito,
    priority: formData.get('priority') as PrioridadeRequisito,
    status: formData.get('status') as StatusRequisito,
    userId: session.user.id,
  });
}

export async function listRequirementVersionsAction(requirementId: string) {
  const session = await auth();

  if (!session?.user?.id) {
    throw new Error('Não autenticado');
  }

  return requirementService.listVersions(requirementId, session.user.id);
}

export async function createRelationshipAction(
  originRequirementId: string,
  targetRequirementId: string,
) {
  const session = await auth();

  if (!session?.user?.id) {
    throw new Error('Não autenticado');
  }

  return requirementService.createRelationship(
    originRequirementId,
    targetRequirementId,
    session.user.id,
  );
}

export async function getRequirementAction(requirementId: string) {
  const session = await auth();

  if (!session?.user?.id) {
    throw new Error('Não autenticado');
  }

  return requirementService.getRequirement(requirementId, session.user.id);
}

export async function restoreVersionAction(
  requirementId: string,
  versionData: any,
) {
  const session = await auth();

  if (!session?.user?.id) {
    throw new Error('Não autenticado');
  }

  return requirementService.updateRequirement(requirementId, {
    title: versionData.title,
    description: versionData.description,
    type: versionData.type,
    priority: versionData.priority,
    status: versionData.status,
    userId: session.user.id,
  });
}

export async function addExternalLinkAction(
  requirementId: string,
  name: string,
  url: string,
) {
  const session = await auth();
  if (!session?.user?.id) throw new Error('Não autenticado');

  return requirementService.addExternalLink(
    requirementId,
    name,
    url,
    session.user.id,
  );
}

export async function removeExternalLinkAction(
  requirementId: string,
  urlToRemove: string,
) {
  const session = await auth();
  if (!session?.user?.id) throw new Error('Não autenticado');

  return requirementService.removeExternalLink(
    requirementId,
    urlToRemove,
    session.user.id,
  );
}

export async function deleteRelationshipAction(relationshipId: string) {
  const session = await auth();

  if (!session?.user?.id) {
    throw new Error('Não autenticado');
  }

  return requirementService.deleteRelationship(relationshipId, session.user.id);
}
