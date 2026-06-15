import { requirementRepository } from '@/repositories/requirementRepository';
import { projectRepository } from '@/repositories/projectRepository';
import {
  TipoRequisito,
  PrioridadeRequisito,
  StatusRequisito,
} from '@/generated/prisma/enums';
import { Prisma } from '@/generated/prisma/client';
import formatRequirementCode from '@/util/formatRequirementCode';
import extractNumber from '@/util/extractNumber';
import { requirementVersionRepository } from '@/repositories/requirementVersionRepository';
import { requirementRelationshipRepository } from '@/repositories/requirementRelationshipRepository';

export const requirementService = {
  async createRequirement(input: {
    title: string;
    description: string;
    type: TipoRequisito;
    priority: PrioridadeRequisito;
    status: StatusRequisito;
    links?: Prisma.InputJsonValue;
    projectId: string;
    userId: string;
  }) {
    if (!input.title) throw new Error('Título é obrigatório');
    if (!input.description) throw new Error('Descrição é obrigatória');
    if (!input.projectId) throw new Error('Projeto é obrigatório');
    if (!input.userId) throw new Error('Usuário é obrigatório');

    // valida ownership
    const project = await projectRepository.findById(input.projectId);

    if (!project || project.userId !== input.userId) {
      throw new Error('Acesso negado ao projeto');
    }

    const last = await requirementRepository.findLastByProjectAndType(
      input.projectId,
      input.type,
    );

    const nextIndex = last ? extractNumber(last.requirementCode) + 1 : 1;

    const requirementCode = formatRequirementCode(input.type, nextIndex);

    return requirementRepository.create({
      title: input.title,
      description: input.description,
      type: input.type,
      priority: input.priority,
      status: input.status,
      links: input.links,
      projectId: input.projectId,
      requirementCode,
    });
  },

  async listRequirements(projectId: string, userId: string) {
    if (!projectId) throw new Error('Projeto é obrigatório');
    if (!userId) throw new Error('Usuário é obrigatório');

    // valida ownership
    const project = await projectRepository.findById(projectId);

    if (!project || project.userId !== userId) {
      throw new Error('Acesso negado');
    }

    return requirementRepository.findByProject(projectId);
  },

  async updateRequirement(
    requirementId: string,
    input: {
      title: string;
      description: string;
      type: TipoRequisito;
      priority: PrioridadeRequisito;
      status: StatusRequisito;
      //links?: Prisma.InputJsonValue;
      userId: string;
    },
  ) {
    const requirement = await requirementRepository.findById(requirementId);

    if (!requirement) {
      throw new Error('Requisito não encontrado');
    }

    const project = await projectRepository.findById(requirement.projectId);

    if (!project || project.userId !== input.userId) {
      throw new Error('Acesso negado');
    }

    // cria snapshot da versão antiga
    await requirementVersionRepository.create({
      title: requirement.title,
      description: requirement.description,
      type: requirement.type,
      priority: requirement.priority,
      status: requirement.status,
      //links: requirement.links as Prisma.InputJsonValue,
      requirementId: requirement.id,
    });

    // atualiza requisito
    return requirementRepository.update(requirementId, {
      title: input.title,
      description: input.description,
      type: input.type,
      priority: input.priority,
      status: input.status,
      //links: input.links,
    });
  },

  async listVersions(requirementId: string, userId: string) {
    const requirement =
      await requirementRepository.findDetailedById(requirementId);

    if (!requirement) {
      throw new Error('Requisito não encontrado');
    }

    if (requirement.project.userId !== userId) {
      throw new Error('Acesso negado');
    }

    return requirementVersionRepository.findByRequirement(requirementId);
  },

  async createRelationship(
    originRequirementId: string,
    targetRequirementId: string,
    userId: string,
  ) {
    const origin =
      await requirementRepository.findDetailedById(originRequirementId);

    const target =
      await requirementRepository.findDetailedById(targetRequirementId);

    if (!origin || !target) {
      throw new Error('Requisito não encontrado');
    }

    if (originRequirementId === targetRequirementId) {
      throw new Error('Um requisito não pode ser relacionado com ele mesmo.');
    }

    if (origin.project.userId !== userId || target.project.userId !== userId) {
      throw new Error('Acesso negado');
    }

    const existingRelationship =
      await requirementRelationshipRepository.findByRequirements(
        originRequirementId,
        targetRequirementId,
      );

    if (existingRelationship) {
      throw new Error('Os requisitos já estão relacionados.');
    }

    return requirementRelationshipRepository.create(
      originRequirementId,
      targetRequirementId,
    );
  },

  async getRequirement(requirementId: string, userId: string) {
    if (!requirementId) {
      throw new Error('Requisito obrigatório');
    }

    const requirement =
      await requirementRepository.findDetailedById(requirementId);

    if (!requirement) {
      throw new Error('Requisito não encontrado');
    }

    if (requirement.project.userId !== userId) {
      throw new Error('Acesso negado');
    }

    return requirement;
  },

  async addExternalLink(
    requirementId: string,
    name: string,
    url: string,
    userId: string,
  ) {
    const requirement = await requirementRepository.findById(requirementId);
    if (!requirement) throw new Error('Requisito não encontrado');

    const project = await projectRepository.findById(requirement.projectId);
    if (!project || project.userId !== userId) throw new Error('Acesso negado');

    const currentLinks = Array.isArray(requirement.links)
      ? (requirement.links as any[])
      : [];

    if (currentLinks.some((link) => link.url === url)) {
      throw new Error('Esta URL já está vinculada.');
    }

    const updatedLinks = [...currentLinks, { name, url }];

    return requirementRepository.update(requirementId, {
      links: updatedLinks as Prisma.InputJsonValue,
    });
  },

  async removeExternalLink(
    requirementId: string,
    urlToRemove: string,
    userId: string,
  ) {
    const requirement = await requirementRepository.findById(requirementId);
    if (!requirement) throw new Error('Requisito não encontrado');

    const project = await projectRepository.findById(requirement.projectId);
    if (!project || project.userId !== userId) throw new Error('Acesso negado');

    const currentLinks = Array.isArray(requirement.links)
      ? (requirement.links as any[])
      : [];
    const updatedLinks = currentLinks.filter(
      (link) => link.url !== urlToRemove,
    );

    return requirementRepository.update(requirementId, {
      links: updatedLinks as Prisma.InputJsonValue,
    });
  },

  async deleteRelationship(relationshipId: string, userId: string) {
    const relationship =
      await requirementRelationshipRepository.findById(relationshipId);

    if (!relationship) {
      throw new Error('Relacionamento não encontrado');
    }

    if (relationship.originRequirement.project.userId !== userId) {
      throw new Error('Acesso negado');
    }

    await requirementRelationshipRepository.delete(relationshipId);
  },
};
