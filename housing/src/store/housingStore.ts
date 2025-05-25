import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { Project, CreateProjectRequest, UpdateProjectRequest } from '../types/project';

interface HousingState {
  // Projects
  projects: Project[];
  currentProject: Project | null;
  loading: boolean;
  error: string | null;

  // Actions
  setProjects: (projects: Project[]) => void;
  setCurrentProject: (project: Project | null) => void;
  addProject: (project: Project) => void;
  updateProject: (id: string, updates: Partial<Project>) => void;
  deleteProject: (id: string) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
}

export const useHousingStore = create<HousingState>()(
  devtools(
    (set, get) => ({
      // Initial state
      projects: [],
      currentProject: null,
      loading: false,
      error: null,

      // Actions
      setProjects: (projects) => set({ projects }),
      
      setCurrentProject: (project) => set({ currentProject: project }),
      
      addProject: (project) => set((state) => ({
        projects: [...state.projects, project]
      })),
      
      updateProject: (id, updates) => set((state) => ({
        projects: state.projects.map(project =>
          project.id === id ? { ...project, ...updates } : project
        ),
        currentProject: state.currentProject?.id === id 
          ? { ...state.currentProject, ...updates }
          : state.currentProject
      })),
      
      deleteProject: (id) => set((state) => ({
        projects: state.projects.filter(project => project.id !== id),
        currentProject: state.currentProject?.id === id ? null : state.currentProject
      })),
      
      setLoading: (loading) => set({ loading }),
      
      setError: (error) => set({ error }),
      
      clearError: () => set({ error: null }),
    }),
    {
      name: 'housing-store',
    }
  )
); 