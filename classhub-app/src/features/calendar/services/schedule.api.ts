import { api } from '../../../core/api/client';
import { useAuthStore } from '../../auth/store/auth.store';

export const ScheduleApi = {

  async getAll() {

    const schoolId =
      useAuthStore
        .getState()
        .currentSchoolId;

    const response =
      await api.get(
        '/my-schedule',
        {
          params: {
            school_id: schoolId,
          },
        },
      );

    return response.data.data;
  },
};