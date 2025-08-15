// src/lib/api.ts
import { Member, MemberFormData } from '@/types/member';

interface ApiResponse<T> {
  data?: T;
  error?: string;
  status: number;
}

interface ApiError {
  message: string;
  status: number;
  details?: any;
}

class ApiClient {
  private baseURL: string;
  private timeout: number;

  constructor() {
    this.baseURL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000';
    this.timeout = parseInt(process.env.NEXT_PUBLIC_API_TIMEOUT || '10000');
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    try {
      const url = `${this.baseURL}${endpoint}`;
      const config: RequestInit = {
        ...options,
        signal: controller.signal,
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
      };

      const response = await fetch(url, config);
      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorText = await response.text();
        let errorMessage = `HTTP ${response.status}: ${response.statusText}`;
        
        try {
          const errorData = JSON.parse(errorText);
          errorMessage = errorData.message || errorData.detail || errorMessage;
        } catch {
          // Use default error message if JSON parsing fails
        }

        throw new Error(errorMessage);
      }

      const data = await response.json();
      return { data, status: response.status };
    } catch (error) {
      clearTimeout(timeoutId);
      
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          throw new Error('Request timeout - please check your connection');
        }
        throw new Error(error.message);
      }
      
      throw new Error('An unexpected error occurred');
    }
  }

  // Member API methods
  async getMembers(): Promise<Member[]> {
    const response = await this.request<Member[]>('/gymApi/members/');
    return response.data || [];
  }

  async getMember(id: number): Promise<Member> {
    const response = await this.request<Member>(`/gymApi/members/${id}/`);
    if (!response.data) {
      throw new Error('Member not found');
    }
    return response.data;
  }

  async createMember(memberData: MemberFormData): Promise<Member> {
    const response = await this.request<Member>('/gymApi/members/', {
      method: 'POST',
      body: JSON.stringify(memberData),
    });
    
    if (!response.data) {
      throw new Error('Failed to create member');
    }
    return response.data;
  }

  async updateMember(id: number, memberData: MemberFormData): Promise<Member> {
    const response = await this.request<Member>(`/gymApi/members/${id}/`, {
      method: 'PUT',
      body: JSON.stringify(memberData),
    });
    
    if (!response.data) {
      throw new Error('Failed to update member');
    }
    return response.data;
  }

  async deleteMember(id: number): Promise<void> {
    await this.request(`/gymApi/members/${id}/`, {
      method: 'DELETE',
    });
  }

  // Health check method
  async healthCheck(): Promise<boolean> {
    try {
      await this.request('/gymApi/health/', { method: 'GET' });
      return true;
    } catch {
      return false;
    }
  }
}

// Export singleton instance
export const apiClient = new ApiClient();

// Export error handling utilities
export const handleApiError = (error: unknown): string => {
  if (error instanceof Error) {
    return error.message;
  }
  return 'An unexpected error occurred';
};

export type { ApiError, ApiResponse };