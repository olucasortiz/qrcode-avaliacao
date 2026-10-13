export function periodoWhere({ inicio, fim }) {
  const gte = inicio ? new Date(`${inicio}T00:00:00.000Z`) : undefined;
  const lt = fim ? new Date(`${fim}T00:00:00.000Z`) : undefined;
  if (lt) lt.setUTCDate(lt.getUTCDate() + 1);
  return gte || lt ? { createdAt: { ...(gte ? { gte } : {}), ...(lt ? { lt } : {}) } } : {};
}
