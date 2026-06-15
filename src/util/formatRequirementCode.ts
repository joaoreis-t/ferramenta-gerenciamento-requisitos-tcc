import { TipoRequisito } from '@/generated/prisma/enums';

export default function formatRequirementCode(
  type: TipoRequisito,
  index: number,
) {
  const num = String(index).padStart(3, '0');
  return type === 'FUNCIONAL' ? `RF-${num}` : `RNF-${num}`;
}
