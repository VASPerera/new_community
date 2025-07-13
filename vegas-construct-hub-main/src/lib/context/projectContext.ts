import { ProjectStatistics } from "@/pages/Dashboard";
import { createContext, useContext } from "react";


export const ProjectDashboardContext = createContext<ProjectStatistics | undefined>(undefined);

export function useProjectDashboardContext(): ProjectStatistics {
  const projectStatisticsContext = useContext(ProjectDashboardContext);
  if ( projectStatisticsContext === undefined ) {
    throw new Error("Data does not exist in the Project Context!");
  }
  return projectStatisticsContext;
}

