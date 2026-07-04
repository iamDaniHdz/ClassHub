import { api } from '../../../core/api/client';
import { useAuthStore } from '../../auth/store/auth.store';

export const AcademiesApi = {

  async getAll() {
    try {
      const schoolId = useAuthStore.getState().currentSchoolId;

      const response = await api.get('/my-academies-list', {
        params: {
          school_id: schoolId,
        },
      });

      return response.data.data;

    } catch (error) {
      console.error('Error fetching academies:', error);
      throw error;
    }
  }

};