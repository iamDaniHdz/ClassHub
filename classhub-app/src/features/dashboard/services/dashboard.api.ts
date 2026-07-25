import { api } from '../../../core/api/client';
import { useAuthStore } from '../../auth/store/auth.store';

export interface DashboardClass {

  academy: string;

  classroom: string;

  day_of_week: number;

  start_time: string;

  end_time: string;
}

export interface DashboardPending {

  id: number;

  title: string;

  description: string;

  due_date: string;

  is_completed: boolean;

  assignment?: {

    academy?: {
      name: string;
    };

    classroom?: {
      degree: string;
      group: string;
    };
  };
}

export interface DashboardOverview {

  role: string;

  metrics: {

    academies: number;

    today_classes: number;

    weekly_classes: number;

    pendings: number;

    overdue_pendings: number;
  };

  current_class?: DashboardClass | null;

  next_class?: DashboardClass | null;

  upcoming_pendings: DashboardPending[];
}

export const DashboardApi = {

  async getOverview(): Promise<DashboardOverview> {

    const schoolId =
      useAuthStore
        .getState()
        .currentSchoolId;

    const response =
      await api.get(
        '/dashboard-overview',
        {
          params: {
            school_id: schoolId,
          },
        },
      );

    return response.data.data;
  },
};
