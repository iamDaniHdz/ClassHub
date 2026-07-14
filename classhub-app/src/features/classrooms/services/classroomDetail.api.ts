import { api } from '../../../core/api/client';

export const ClassroomDetailApi = {

  async getById(id: number) {

    const response = await api.get(
      `/classrooms/${id}`,
      {
        params: {
          with_students: true,
        },
      }
    );

    return response.data.data;
  },

};