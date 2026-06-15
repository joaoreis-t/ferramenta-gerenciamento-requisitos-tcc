import { projectRepository } from '@/repositories/projectRepository';

export const projectService = {
  async createProject(input: {
    name: string;
    description?: string;
    userId: string;
  }) {
    if (!input.name || input.name.trim().length === 0) {
      throw new Error('Nome é obrigatório');
    }
    if (!input.userId) {
      throw new Error('UserId é obrigatório');
    }

    return projectRepository.createProject(input);
  },

  async listUserProjects(userId: string) {
    if (!userId) {
      throw new Error('UserId é obrigatório');
    }
    return projectRepository.findByUser(userId);
  },

  async getProject(projectId: string, userId: string) {
    const project = await projectRepository.findById(projectId);

    if (!project || project.userId !== userId) {
      throw new Error('Projeto não encontrado');
    }

    return project;
  },
};
