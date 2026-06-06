export type SubjectTypeCode = "TH" | "PR" | "OR" | "TW";

export const parseSubjectTypes = (raw: string): SubjectTypeCode[] => {
  if (!raw) return [];
  const validTypes = ["TH", "PR", "OR", "TW"];
  return raw
    .split(",")
    .map((s) => s.trim().toUpperCase())
    .filter((s) => validTypes.includes(s)) as SubjectTypeCode[];
};

export const serializeSubjectTypes = (types: SubjectTypeCode[]): string => {
  return types.join(", ");
};
