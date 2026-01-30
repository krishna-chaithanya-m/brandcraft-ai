
import { BrandProject } from '../types';

const PROJECTS_KEY = 'brandcraft_projects_db';

export const getStoredProjects = (): BrandProject[] => {
  const projects = localStorage.getItem(PROJECTS_KEY);
  return projects ? JSON.parse(projects) : [];
};

export const getUserProjects = (userId: string): BrandProject[] => {
  const allProjects = getStoredProjects();
  return allProjects.filter(p => p.userId === userId);
};

export const saveProject = (project: BrandProject): void => {
  const allProjects = getStoredProjects();
  const index = allProjects.findIndex(p => p.id === project.id);
  
  if (index >= 0) {
    allProjects[index] = project;
  } else {
    allProjects.push(project);
  }
  
  localStorage.setItem(PROJECTS_KEY, JSON.stringify(allProjects));
};

export const getLatestUserProject = (userId: string): BrandProject | null => {
  const userProjects = getUserProjects(userId);
  return userProjects.length > 0 ? userProjects[userProjects.length - 1] : null;
};

export const deleteProject = (projectId: string): void => {
  const allProjects = getStoredProjects();
  const filtered = allProjects.filter(p => p.id !== projectId);
  localStorage.setItem(PROJECTS_KEY, JSON.stringify(filtered));
};
