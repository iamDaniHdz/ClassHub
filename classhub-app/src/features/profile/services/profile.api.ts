import { api } from '../../../core/api/client';

export const ProfileApi = {

  async getProfile() {

    const response = await api.get(
      '/me/profile'
    );

    return response.data.data;
  },

};