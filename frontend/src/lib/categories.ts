/** Aspecto de cada categoría para las portadas generadas (cuando un lugar no tiene foto 2D). */
export interface CategoryStyle {
  from: string;
  to: string;
  icon: "landmark" | "palette" | "church" | "tree";
}

const STYLES: Record<string, CategoryStyle> = {
  historia: { from: "#F2A33A", to: "#E8604C", icon: "landmark" },
  cultura: { from: "#8E7CC3", to: "#F3A0A0", icon: "palette" },
  religioso: { from: "#FFD3A3", to: "#E0709A", icon: "church" },
  naturaleza: { from: "#4C9FB0", to: "#1E6C80", icon: "tree" },
};

const FALLBACK: CategoryStyle = { from: "#17909F", to: "#0B4F5A", icon: "landmark" };

export function categoryStyle(slug: string): CategoryStyle {
  return STYLES[slug] ?? FALLBACK;
}
