import { api } from '../../../core/api/client';
import { useAuthStore } from '../../auth/store/auth.store';

export const PendingsApi = {

  async getAll() {

    const schoolId =
      useAuthStore
        .getState()
        .currentSchoolId;

    const response =
      await api.get(
        '/my-pendings',
        {
          params: {
            school_id: schoolId,
          },
        },
      );

    return response.data.data;
  },

  async show(
    id: number,
  ) {

    const response =
      await api.get(
        `/academy-assignment-pendings/${id}`,
      );

    return response.data.data;
  },

  async toggleCompleted(
    id: number,
    isCompleted: boolean,
  ) {

    const response =
      await api.put(
        `/academy-assignment-pendings/${id}`,
        {
          is_completed:
            isCompleted,
        },
      );

    return response.data.data;
  },
};