import { IMovie, UpdateMovie } from "@/types/movies";

/**
 * Compares updateDto with the original movie to detect if any field changed.
 */
export function isMovieChanged(
  updateDto: UpdateMovie,
  original: IMovie
): boolean {
  for (const key in updateDto) {
    const newVal = updateDto[key as keyof UpdateMovie];
    const oldVal = original[key as keyof IMovie];

    // Normalize null/empty/undefined
    const normalizedNew =
      newVal === undefined || newVal === null || newVal === "" ? null : newVal;
    const normalizedOld =
      oldVal === undefined || oldVal === null || oldVal === "" ? null : oldVal;

    // ✅ Skip if both are null/empty
    if (normalizedNew === null && normalizedOld === null) continue;

    // ✅ Compare arrays
    if (Array.isArray(normalizedNew)) {
      if (
        !Array.isArray(normalizedOld) ||
        normalizedNew.length !== normalizedOld.length ||
        !normalizedNew.every((v, i) => v === (normalizedOld as string[])[i])
      ) {
        return true;
      }
      continue;
    }

    // ✅ Compare Dates (string vs Date safe)
    if (key === "releaseDate") {
      const dateNew = new Date(normalizedNew as string | Date).getTime();
      const dateOld = new Date(normalizedOld as string | Date).getTime();
      if (dateNew !== dateOld) return true;
      continue;
    }

    // ✅ Compare other fields (primitives)
    if (normalizedNew !== normalizedOld) {
      return true;
    }
  }

  return false;
}
