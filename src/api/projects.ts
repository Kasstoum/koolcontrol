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
 * Change the mode of a topic (1 = Cooling, 2 = Heating)
 * @param topicId - Topic ID
 * @param mode - Mode to set ("1" for Cooling, "2" for Heating)
 * @returns Promise<void>
 */
export async function changeProjectMode(topicId: number, mode: "1" | "2"): Promise<void> {
  await api.patch(`/topics/${topicId}/`, {
    mode: mode,
  });
}