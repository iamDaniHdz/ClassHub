import { api } from '../../../core/api/client';

export const StudentsApi = {

  async getByClassroom(classroomId: number, search?: string) {

    const response = await api.get('/students', {
      params: {
        classroom_id: classroomId,
        search: search || undefined,
      },
    });

    return response.data.data;
  }

};