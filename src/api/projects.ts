// src/api/projects.ts
import { api } from "./http";

export type Project = {
  id: number;
  name: string;
  topic?: {
    id?: number;
    mode?: string;
    last_sync?: string;
  };
};

export type ProjectsResponse = {
  data: Project[];
};

export async function getProjects(): Promise<Project[]> {
  const res = await api.get<ProjectsResponse>("/projects/", {
    params: {
      page: 1,
      page_size: 50,
    },
  });
  return res.data.data;
}

/**
 * Change le mode d'un topic (1 = Climatisation, 2 = Chauffage)
 * @param topicId - ID du topic
 * @param mode - Mode à définir ("1" pour Climatisation, "2" pour Chauffage)
 * @returns Promise<void>
 */
export async function changeProjectMode(topicId: number, mode: "1" | "2"): Promise<void> {
  await api.patch(`/topics/${topicId}/`, {
    mode: mode,
  });
}