import { api } from '../../../core/api/client';

export const SchoolSelectionApi = {

  async getMySchool() {

    const response = await api.get(
      '/my-schools'
    );

    return response;
  },

};