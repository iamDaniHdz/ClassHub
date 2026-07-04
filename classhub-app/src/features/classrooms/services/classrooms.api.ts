import { api } from '../../../core/api/client';
import { useAuthStore } from '../../auth/store/auth.store';

export const ClassroomsApi = {

  async getByAcademy(academyId: number) {
    const schoolId = useAuthStore.getState().currentSchoolId;

    const response = await api.get('/academy-classrooms', {
      params: {
        academy_id: academyId,
        school_id: schoolId,
      },
    });

    return response.data.data;
  }

};