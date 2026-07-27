import { api } from '../../../core/api/client';

export const StudentDetailApi = {

  async getById(id: number) {
    const response = await api.get(`/student-assignments/${id}`);

    console.log(response);
    
    return response.data.data;
  }

};