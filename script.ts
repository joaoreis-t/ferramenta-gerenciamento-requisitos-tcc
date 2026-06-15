import { prisma } from '@/lib/prisma';

async function main() {
  // Limpeza opcional para o teste não falhar por email duplicado
  // await prisma.user.deleteMany({ where: { email: 'alice@prisma.io' } });

  console.log('🚀 Iniciando criação de usuário com projeto...');

  // 1. Criar um novo usuário com um projeto relacionado
  // Note que mudamos de 'posts' para 'projects'
  const user = await prisma.user.create({
    data: {
      name: 'Alice',
      email: 'alice@prisma.io',
      password: 'senha_super_segura', // Adicionado conforme seu schema
      projects: {
        create: {
          // Substitua 'title' por campos reais do seu modelo Project
          // Estou assumindo que Project tem ao menos um campo 'name' ou 'title'
          name: 'Meu Primeiro Projeto',
        },
      },
    },
    include: {
      projects: true, // Inclui os projetos no retorno para o console.log
    },
  });

  console.log('✅ Usuário criado com sucesso:', JSON.stringify(user, null, 2));

  // 2. Buscar todos os usuários e seus respectivos projetos
  const allUsers = await prisma.user.findMany({
    include: {
      projects: true,
    },
  });

  console.log(
    '📋 Lista de todos os usuários:',
    JSON.stringify(allUsers, null, 2),
  );
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error('❌ Erro durante a execução:', e);
    await prisma.$disconnect();
    process.exit(1);
  });
