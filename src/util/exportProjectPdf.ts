import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

function getStatusColor(status: string): [number, number, number] {
  switch (status) {
    case 'PENDENTE':
      return [251, 191, 36]; // amber

    case 'FINALIZADO':
      return [34, 197, 94]; // green

    case 'DESATIVADO':
      return [156, 163, 175]; // gray

    default:
      return [0, 0, 0];
  }
}

function getPriorityColor(priority: string): [number, number, number] {
  switch (priority) {
    case 'ESSENCIAL':
      return [239, 68, 68]; // red

    case 'IMPORTANTE':
      return [34, 211, 238]; // cyan

    case 'DESEJAVEL':
      return [168, 85, 247]; // purple

    default:
      return [0, 0, 0];
  }
}

function getTypeColor(type: string): [number, number, number] {
  switch (type) {
    case 'FUNCIONAL':
      return [59, 130, 246]; // blue

    case 'NAO_FUNCIONAL':
      return [236, 72, 153]; // pink

    default:
      return [0, 0, 0];
  }
}

export async function exportProjectPdf(project: any, requirements: any[]) {
  const doc = new jsPDF();

  const pendingCount = requirements.filter(
    (r) => r.status === 'PENDENTE',
  ).length;

  const finishedCount = requirements.filter(
    (r) => r.status === 'FINALIZADO',
  ).length;

  const disabledCount = requirements.filter(
    (r) => r.status === 'DESATIVADO',
  ).length;

  let y = 0;

  // =========================
  // CAPA
  // =========================

  doc.setFillColor(14, 44, 79);
  doc.rect(0, 0, 210, 30, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(22);
  doc.text(project.name, 14, 19);

  doc.setTextColor(120);
  doc.setFontSize(10);

  doc.text(`Exportado em ${new Date().toLocaleDateString('pt-BR')}`, 14, 40);

  y = 55;

  // =========================
  // DESCRIÇÃO
  // =========================

  if (project.description) {
    doc.setTextColor(26, 77, 215);
    doc.setFontSize(16);

    doc.text('Descrição do Projeto', 14, y);

    y += 10;

    doc.setTextColor(0);
    doc.setFontSize(11);

    const descriptionLines = doc.splitTextToSize(project.description, 180);

    doc.text(descriptionLines, 14, y);

    y += descriptionLines.length * 5 + 10;
  }

  // =========================
  // RESUMO
  // =========================

  doc.setDrawColor(26, 77, 215);
  doc.line(14, y, 196, y);

  y += 10;

  doc.setTextColor(26, 77, 215);
  doc.setFontSize(16);

  doc.text('Resumo', 14, y);

  y += 10;

  doc.setTextColor(0);
  doc.setFontSize(12);

  doc.text(`Total de requisitos: ${requirements.length}`, 14, y);

  y += 8;

  doc.text(`Pendentes: ${pendingCount}`, 14, y);

  y += 8;

  doc.text(`Finalizados: ${finishedCount}`, 14, y);

  y += 8;

  doc.text(`Desativados: ${disabledCount}`, 14, y);

  y += 20;

  // =========================
  // REQUISITOS
  // =========================

  doc.setDrawColor(26, 77, 215);
  doc.line(14, y, 196, y);

  y += 10;

  doc.setTextColor(26, 77, 215);
  doc.setFontSize(16);

  doc.text('Requisitos', 14, y);

  y += 10;

  requirements.forEach((requirement) => {
    if (y > 250) {
      doc.addPage();
      y = 20;
    }

    doc.setFillColor(245, 247, 250);

    doc.roundedRect(14, y, 182, 34, 3, 3, 'F');

    doc.setTextColor(0);

    doc.setFontSize(12);

    doc.text(
      `${requirement.requirementCode} - ${requirement.title}`,
      18,
      y + 8,
    );

    doc.setFontSize(9);

    doc.setTextColor(...getStatusColor(requirement.status));
    doc.text(`Status: ${requirement.status}`, 18, y + 17);

    doc.setTextColor(...getPriorityColor(requirement.priority));
    doc.text(`Prioridade: ${requirement.priority}`, 80, y + 17);

    doc.setTextColor(...getTypeColor(requirement.type));
    doc.text(`Tipo: ${requirement.type}`, 145, y + 17);

    doc.setTextColor(0);

    const relations = [
      ...requirement.originRelations.map(
        (relation: any) => relation.targetRequirement.requirementCode,
      ),

      ...requirement.targetRelations.map(
        (relation: any) => relation.originRequirement.requirementCode,
      ),
    ];

    doc.text(`Relacionamentos: ${relations.join(', ') || '-'}`, 18, y + 26);

    y += 42;
  });

  // =========================
  // MATRIZ TABULAR
  // =========================

  doc.addPage();

  doc.setFontSize(18);
  doc.setTextColor(26, 77, 215);

  doc.text('Relacionamentos', 14, 20);

  autoTable(doc, {
    startY: 30,

    head: [['Requisito', 'Referencia', 'É Referenciado Por']],

    body: requirements.map((requirement) => {
      const origins = requirement.originRelations.map(
        (relation: any) => relation.targetRequirement.requirementCode,
      );

      const targets = requirement.targetRelations.map(
        (relation: any) => relation.originRequirement.requirementCode,
      );

      return [
        requirement.requirementCode,
        origins.join(', ') || '-',
        targets.join(', ') || '-',
      ];
    }),

    headStyles: {
      fillColor: [26, 77, 215],
    },
    columnStyles: {
      0: {
        cellWidth: 35,
      },
      1: {
        cellWidth: 75,
      },
      2: {
        cellWidth: 75,
      },
    },
  });

  // =========================
  // MATRIZ TRADICIONAL
  // =========================

  doc.addPage();

  doc.setFontSize(18);
  doc.setTextColor(26, 77, 215);

  doc.text('Matriz de Rastreabilidade', 14, 20);

  const matrixHeaders = [
    '',
    ...requirements.map((requirement) => requirement.requirementCode),
  ];

  const matrixRows = requirements.map((requirement) => {
    const relatedCodes = new Set<string>();

    requirement.originRelations.forEach((relation: any) =>
      relatedCodes.add(relation.targetRequirement.requirementCode),
    );

    requirement.targetRelations.forEach((relation: any) =>
      relatedCodes.add(relation.originRequirement.requirementCode),
    );

    return [
      requirement.requirementCode,

      ...requirements.map((other) => {
        if (requirement.requirementCode === other.requirementCode) {
          return '-';
        }

        return relatedCodes.has(other.requirementCode) ? 'X' : '';
      }),
    ];
  });

  autoTable(doc, {
    startY: 30,

    head: [matrixHeaders],

    body: matrixRows,

    styles: {
      fontSize: 8,
      cellPadding: 2,
      halign: 'center',
    },

    headStyles: {
      fillColor: [26, 77, 215],
    },
  });

  doc.save(`${project.name.replace(/\s+/g, '_')}.pdf`);
}
