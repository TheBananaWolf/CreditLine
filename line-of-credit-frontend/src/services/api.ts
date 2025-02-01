import axios from 'axios';
import { Application } from '../types';

const baseURL = 'http://localhost:3000';
const client = axios.create({ baseURL });

export const api = {
  createApplication: async (username: string, requestedAmount: number, expressDelivery: boolean) => {
    try {
      const response = await client.post<Application>('/applications', {
        username,
        requestedAmount: Number(requestedAmount),
        expressDelivery
      });
      return response.data;
    } catch (error: any) {
      console.error('API Error:', error.response?.data || error.message);
      throw error;
    }
  },

  getUserApplications: async (username: string) => {
    const response = await client.get<Application[]>(`/users/${username}/applications`);
    return response.data;
  },

  disburse: async (applicationId: string) => {
    await client.post(`/applications/${applicationId}/disburse`);
  },

  repay: async (applicationId: string, amount: number) => {
    await client.post(`/applications/${applicationId}/repay`, { amount: Number(amount) });
  },

  cancel: async (applicationId: string) => {
    await client.post(`/applications/${applicationId}/cancel`);
  },

  reject: async (applicationId: string) => {
    await client.post(`/applications/${applicationId}/reject`);
  }
}; 