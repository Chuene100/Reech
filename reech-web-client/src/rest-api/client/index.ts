import {
    LoginUserInput,
    AuthResponse,
    User,
    OpportunityQueryOptions,
    OpportunityPaginator,
    Opportunity
} from '@/types';
import { API_ENDPOINTS } from './api-endpoints';
import { HttpClient } from './http-client';

  class Client {
    users = {
      login: (input: LoginUserInput) =>
        HttpClient.post<User>(API_ENDPOINTS.LOGIN_URL, input),
      logout: () => HttpClient.post<boolean>(API_ENDPOINTS.LOGOUT, {}),
    };

    opportunities = {
      all: (params: Partial<OpportunityQueryOptions>) =>
        HttpClient.get<OpportunityPaginator>(
          API_ENDPOINTS.OPPORTUNITIES,
          params
        ),
      get: (profileId: string) =>
          HttpClient.get<Opportunity>(`${API_ENDPOINTS.OPPORTUNITIES}/myopportunities/${profileId}`),
    };
}

export default new Client();