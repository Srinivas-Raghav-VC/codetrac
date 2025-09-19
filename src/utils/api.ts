import { projectId, publicAnonKey } from './supabase/info';
import { supabase } from './supabase/client';

const API_BASE_URL = `https://${projectId}.supabase.co/functions/v1/make-server-7ec58213`;

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface Problem {
  id: string;
  title: string;
  platform: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  rating?: number;
  url: string;
  status: 'Solved' | 'Attempted' | 'To Review' | 'Unsolved';
  tags: string[];
  solvedAt?: string;
  timeSpent?: number;
  notes?: string;
  reviewDate?: string;
  isFavorite?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface HeatmapData {
  date: string;
  count: number;
  level: number;
}

export interface DashboardStats {
  totalProblems: number;
  solvedProblems: number;
  attemptedProblems: number;
  reviewProblems: number;
  difficultyStats: {
    Easy: number;
    Medium: number;
    Hard: number;
  };
  platformStats: Record<string, number>;
  tagStats: Record<string, number>;
  currentStreak: number;
  longestStreak: number;
}

export interface FetchedProblemDetails {
  title: string;
  difficulty: string;
  rating?: number;
  tags: string[];
  platform: string;
  statement?: string;
}

class ApiClient {
  private async getAuthHeaders(): Promise<Record<string, string>> {
    try {
      // Get the current session to retrieve the access token
      const { data: { session } } = await supabase.auth.getSession();
      const accessToken = session?.access_token;
      
      return {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken || publicAnonKey}`,
      };
    } catch (error) {
      console.error('Error getting auth headers:', error);
      return {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${publicAnonKey}`,
      };
    }
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    try {
      const authHeaders = await this.getAuthHeaders();
      
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers: {
          ...authHeaders,
          ...options.headers,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error(`API Error [${response.status}]:`, errorData);
        return {
          success: false,
          error: errorData.error || `HTTP ${response.status}: ${response.statusText}`,
        };
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Network Error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Network error occurred',
      };
    }
  }

  // Health check
  async healthCheck(): Promise<ApiResponse<{ status: string; timestamp: string }>> {
    return this.request('/health');
  }

  // Problem management
  async getProblems(): Promise<ApiResponse<Problem[]>> {
    return this.request('/problems');
  }

  async getProblem(id: string): Promise<ApiResponse<Problem>> {
    return this.request(`/problems/${id}`);
  }

  async createProblem(problem: Omit<Problem, 'id' | 'createdAt' | 'updatedAt'>): Promise<ApiResponse<Problem>> {
    return this.request('/problems', {
      method: 'POST',
      body: JSON.stringify(problem),
    });
  }

  async updateProblem(id: string, updates: Partial<Problem>): Promise<ApiResponse<Problem>> {
    return this.request(`/problems/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  }

  async deleteProblem(id: string): Promise<ApiResponse<{ message: string }>> {
    return this.request(`/problems/${id}`, {
      method: 'DELETE',
    });
  }

  // Problem fetching from external sources
  async fetchProblemDetails(url: string): Promise<ApiResponse<FetchedProblemDetails>> {
    return this.request('/fetch-problem', {
      method: 'POST',
      body: JSON.stringify({ url }),
    });
  }

  // Dashboard data
  async getHeatmapData(): Promise<ApiResponse<HeatmapData[]>> {
    return this.request('/heatmap');
  }

  async getDashboardStats(): Promise<ApiResponse<DashboardStats>> {
    return this.request('/stats');
  }
}

export const api = new ApiClient();

// Export commonly used functions with proper binding
export const healthCheck = () => api.healthCheck();
export const getProblems = () => api.getProblems();
export const getProblem = (id: string) => api.getProblem(id);
export const createProblem = (problem: Omit<Problem, 'id' | 'createdAt' | 'updatedAt'>) => api.createProblem(problem);
export const updateProblem = (id: string, updates: Partial<Problem>) => api.updateProblem(id, updates);
export const deleteProblem = (id: string) => api.deleteProblem(id);
export const fetchProblemDetails = (url: string) => api.fetchProblemDetails(url);
export const getHeatmapData = () => api.getHeatmapData();
export const getDashboardStats = () => api.getDashboardStats();