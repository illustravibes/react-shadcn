const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

export interface ApiError {
  message: string;
  code?: string;
  details?: unknown;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: ApiError;
  message?: string;
}

interface RequestOptions extends RequestInit {
  params?: Record<string, unknown>;
}

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl;
  }

  private formatQueryString(params?: Record<string, unknown>): string {
    if (!params || Object.keys(params).length === 0) {
      return '';
    }

    const searchParams = new URLSearchParams();
    for (const [key, value] of Object.entries(params)) {
      if (value !== null && value !== undefined) {
        searchParams.append(key, String(value));
      }
    }

    const queryString = searchParams.toString();
    return queryString ? `?${queryString}` : '';
  }

  private async handleResponse<T>(response: Response): Promise<T> {
    const contentType = response.headers.get('content-type');
    const isJson = contentType?.includes('application/json');

    let data: unknown;
    try {
      data = isJson ? await response.json() : await response.text();
    } catch {
      data = null;
    }

    if (!response.ok) {
      const error: ApiError = {
        message: typeof data === 'object' && data !== null && 'message' in data
          ? String((data as Record<string, unknown>).message)
          : response.statusText,
        code: String(response.status),
        details: data,
      };
      throw error;
    }

    return data as T;
  }

  async get<T>(path: string, options?: RequestOptions): Promise<T> {
    const url = `${this.baseUrl}${path}${this.formatQueryString(options?.params)}`;
    const response = await fetch(url, {
      ...options,
      method: 'GET',
    });
    return this.handleResponse<T>(response);
  }

  async post<T>(path: string, body?: unknown, options?: RequestOptions): Promise<T> {
    const url = `${this.baseUrl}${path}${this.formatQueryString(options?.params)}`;
    const response = await fetch(url, {
      ...options,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
      body: body ? JSON.stringify(body) : undefined,
    });
    return this.handleResponse<T>(response);
  }

  async put<T>(path: string, body?: unknown, options?: RequestOptions): Promise<T> {
    const url = `${this.baseUrl}${path}${this.formatQueryString(options?.params)}`;
    const response = await fetch(url, {
      ...options,
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
      body: body ? JSON.stringify(body) : undefined,
    });
    return this.handleResponse<T>(response);
  }

  async patch<T>(path: string, body?: unknown, options?: RequestOptions): Promise<T> {
    const url = `${this.baseUrl}${path}${this.formatQueryString(options?.params)}`;
    const response = await fetch(url, {
      ...options,
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
      body: body ? JSON.stringify(body) : undefined,
    });
    return this.handleResponse<T>(response);
  }

  async delete<T>(path: string, options?: RequestOptions): Promise<T> {
    const url = `${this.baseUrl}${path}${this.formatQueryString(options?.params)}`;
    const response = await fetch(url, {
      ...options,
      method: 'DELETE',
    });
    return this.handleResponse<T>(response);
  }
}

export const apiClient = new ApiClient();
