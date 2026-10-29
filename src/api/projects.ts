import type { Mode } from "../domain/controls"
import { apiRequest } from "./client"

export type Project = {
  id: number
  name: string
  topic?: {
    id?: number
    mode?: string
    last_sync?: string
  }
}

export async function getProjects(): Promise<Project[]> {
  const response = await apiRequest<{ data: Project[] }>({
    path: "/projects/",
    query: { page: 1, page_size: 50 },
  })
  return response.data
}

export function changeProjectMode(topicId: number, mode: Mode): Promise<void> {
  return apiRequest({
    method: "PATCH",
    path: `/topics/${topicId}/`,
    body: { mode },
  })
}
