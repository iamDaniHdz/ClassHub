import { api } from '../../../core/api/client';
import { useAuthStore } from '../../auth/store/auth.store';

export const PendingsApi = {

  async getAll() {

    const schoolId =
      useAuthStore.getState().currentSchoolId;

    const response = await api.get(
      '/my-pendings',
      {
        params: {
          school_id: schoolId,
        },
      },
    );

    return response.data.data;
  },
};