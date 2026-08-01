import axios from 'axios'

const API_BASE = '/api/v1'

const client = axios.create({
  baseURL: API_BASE,
})

client.interceptors.request.use((config) => {
  const token = localStorage.getItem('codeforge_token')
  if (token) {
    config.headers.set('Authorization', `Bearer ${token}`)
  }
  return config
})

export interface Problem {
  id: number
  title: string
  slug: string
  description: string
  difficulty: 'EASY' | 'MEDIUM' | 'HARD'
  time_limit?: number
  memory_limit?: number
  created_at: string
}

export interface Submission {
  id: number
  user_id: number
  problem_id: number
  language: string
  code: string
  status: 'PENDING' | 'RUNNING' | 'ACCEPTED' | 'WRONG_ANSWER' | 'TIME_LIMIT_EXCEEDED' | 'MEMORY_LIMIT_EXCEEDED' | 'RUNTIME_ERROR' | 'COMPILATION_ERROR' | 'INTERNAL_ERROR'
  execution_time: number | null
  memory_usage: number | null
  error_message: string | null
  created_at: string
}

export interface UserInfo {
  id: number
  email: string
  username: string
  is_active: boolean
  is_superuser: boolean
  created_at: string
  login_days: number
  coding_days: number
  practice_count: number
}

export interface LeaderboardUser {
  rank: number
  id: number
  username: string
  solved_count: number
  points: number
  total_submissions: number
  login_days: number
  coding_days: number
  practice_count: number
}

export interface TestCase {
  id: number
  problem_id: number
  input_data: string
  expected_output: string
}

export const api = {
  // ... existing methods
  async login(username: string, password: string): Promise<string> {
    const params = new URLSearchParams()
    params.append('username', username)
    params.append('password', password)
    const response = await client.post<{ access_token: string }>('/auth/login', params, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    })
    return response.data.access_token
  },

  async register(email: string, username: string, password: string): Promise<UserInfo> {
    const response = await client.post<UserInfo>('/users/', {
      email,
      username,
      password,
    })
    return response.data
  },

  async oauthLogin(provider: string, email: string, username?: string): Promise<string> {
    const response = await client.post<{ access_token: string }>('/auth/oauth', {
      provider,
      email,
      username,
    })
    return response.data.access_token
  },

  async getMe(): Promise<UserInfo> {
    const response = await client.get<UserInfo>('/users/me')
    return response.data
  },

  async getSolvedProblems(): Promise<number[]> {
    const response = await client.get<number[]>('/users/me/solved')
    return response.data
  },

  async getLeaderboard(): Promise<LeaderboardUser[]> {
    const response = await client.get<LeaderboardUser[]>('/users/leaderboard')
    return response.data
  },

  async getProblems(skip = 0, limit = 100): Promise<Problem[]> {
    const response = await client.get<Problem[]>('/problems/', {
      params: { skip, limit },
    })
    return response.data
  },

  async getProblemBySlug(slug: string): Promise<Problem> {
    const response = await client.get<Problem>(`/problems/by-slug/${slug}`)
    return response.data
  },

  async getProblemById(id: number): Promise<Problem> {
    const response = await client.get<Problem>(`/problems/${id}`)
    return response.data
  },

  async getProblemTestcases(id: number): Promise<TestCase[]> {
    const response = await client.get<TestCase[]>(`/problems/${id}/testcases`)
    return response.data
  },

  async submitSolution(problemId: number, language: string, code: string): Promise<Submission> {
    const response = await client.post<Submission>('/submissions/', {
      problem_id: problemId,
      language,
      code,
    })
    return response.data
  },

  async getSubmission(id: number): Promise<Submission> {
    const response = await client.get<Submission>(`/submissions/${id}`)
    return response.data
  },

  async getMySubmissions(): Promise<Submission[]> {
    const response = await client.get<Submission[]>('/submissions/')
    return response.data
  },

  async deleteSubmission(id: number): Promise<Submission> {
    const response = await client.delete<Submission>(`/submissions/${id}`)
    return response.data
  },

  async runCode(code: string, language: string, inputData: string = ''): Promise<{output: string, error: string, status: string}> {
    const response = await client.post<{output: string, error: string, status: string}>('/run/', {
      code,
      language,
      input_data: inputData,
    })
    return response.data
  },
}
