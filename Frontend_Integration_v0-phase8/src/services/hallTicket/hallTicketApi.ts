import { axiosInstance } from '../../utils/axiosInstance';
import type {
  ApiResponse,
  BulkHallTicketResult,
  GenerateHallTicketRequest,
  GeneratedHallTicketPayload,
  HallTicketSettings,
  HallTicketSettingsPayload,
  StudentEligibilityRow,
  StudentHallTicketView,
  HallTicketPublishStatus,
} from '../../types/COE/HallTicket/hallTicket.types';

const uploadsBaseUrl =
  (import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000').replace(/\/$/, '');

export const getHallTicketPublicUrl = (pdfUrl: string) =>
  pdfUrl.startsWith('http') ? pdfUrl : `${uploadsBaseUrl}${pdfUrl}`;

interface ExamEventOption {
  event_id: string;
  event_name: string;
}

interface PreviewResponse {
  settings: HallTicketSettings;
  exam_event: ExamEventOption;
  sample_hall_ticket: GeneratedHallTicketPayload | null;
}

interface GenerationControlData {
  exam_events: ExamEventOption[];
  settings: HallTicketSettings | null;
  students: StudentEligibilityRow[];
}

export const hallTicketAPI = {
  getExamEvents: async (): Promise<ExamEventOption[]> => {
    const res = await axiosInstance.get<ApiResponse<ExamEventOption[]>>('/exam-events/dropdown');
    return res.data.data ?? [];
  },

  getHallTicketSettings: async (examEventId: string): Promise<HallTicketSettings | null> => {
    try {
      const res = await axiosInstance.get<ApiResponse<HallTicketSettings>>(
        `/hall-ticket/hall-ticket-settings/${examEventId}`
      );
      return res.data.data;
    } catch (err: unknown) {
      const status = (err as { response?: { status?: number } })?.response?.status;
      if (status === 404) return null;
      throw err;
    }
  },

  saveHallTicketSettings: async (data: HallTicketSettingsPayload): Promise<HallTicketSettings> => {
    const existing = await hallTicketAPI.getHallTicketSettings(data.exam_event_id);

    if (existing) {
      const { exam_event_id, ...updateBody } = data;
      const res = await axiosInstance.put<ApiResponse<HallTicketSettings>>(
        `/hall-ticket/hall-ticket-settings/${exam_event_id}`,
        updateBody
      );
      return res.data.data;
    }

    const res = await axiosInstance.post<ApiResponse<HallTicketSettings>>(
      '/hall-ticket/hall-ticket-settings',
      data
    );
    return res.data.data;
  },

  previewStudentView: async (examEventId: string): Promise<PreviewResponse> => {
    const res = await axiosInstance.get<ApiResponse<PreviewResponse>>(
      `/hall-ticket/hall-ticket-settings/${examEventId}/preview`
    );
    return res.data.data;
  },

  getEligibilityFilterOptions: async (
    examEventId: string
  ): Promise<{
    branches: Array<{ branch_id: string; branch_name: string; label?: string }>;
    semesters: Array<{
      semester_id: string;
      semester_number: number;
      term_type?: string;
      label?: string;
    }>;
  }> => {
    const res = await axiosInstance.get<
      ApiResponse<{
        branches: Array<{ branch_id: string; branch_name: string; label?: string }>;
        semesters: Array<{
          semester_id: string;
          semester_number: number;
          term_type?: string;
          label?: string;
        }>;
      }>
    >('/hall-ticket/filter-options', {
      params: { exam_event_id: examEventId },
    });
    return res.data.data ?? { branches: [], semesters: [] };
  },

  getStudentsEligibility: async (params: {
    examEventId: string;
    eligibilityStatus?: string;
    branchId?: string;
    semesterId?: string;
  }): Promise<StudentEligibilityRow[]> => {
    const res = await axiosInstance.get<ApiResponse<{ students: StudentEligibilityRow[] }>>(
      '/hall-ticket/students-eligibility',
      {
        params: {
          exam_event_id: params.examEventId,
          eligibility_status: params.eligibilityStatus || undefined,
          branch_id: params.branchId || undefined,
          semester_id: params.semesterId || undefined,
        },
      }
    );
    return res.data.data?.students ?? [];
  },

  setStudentHold: async (examRegId: string, onHold: boolean): Promise<void> => {
    await axiosInstance.put('/hall-ticket/hold', {
      exam_reg_id: examRegId,
      on_hold: onHold,
    });
  },

  publishHallTickets: async (
    examEventId: string,
    scheduledAt?: string
  ): Promise<{ exam_event_id: string; message: string; scheduled_at: string | null }> => {
    const res = await axiosInstance.post<
      ApiResponse<{ exam_event_id: string; message: string; scheduled_at: string | null }>
    >('/hall-ticket/publish', {
      exam_event_id: examEventId,
      ...(scheduledAt ? { scheduled_at: scheduledAt } : {}),
    });
    return res.data.data;
  },

  getPublishStatus: async (examEventId: string): Promise<HallTicketPublishStatus> => {
    const res = await axiosInstance.get<ApiResponse<HallTicketPublishStatus>>(
      `/hall-ticket/publish-status/${examEventId}`
    );
    return res.data.data;
  },

  getHallTicketGenerationControlData: async (params: {
    examEventId?: string;
    eligibilityStatus?: string;
    branchId?: string;
    semesterId?: string;
  }): Promise<GenerationControlData> => {
    const res = await axiosInstance.get<ApiResponse<GenerationControlData>>(
      '/hall-ticket/generation-control',
      {
        params: {
          exam_event_id: params.examEventId || undefined,
          eligibility_status: params.eligibilityStatus || undefined,
          branch_id: params.branchId || undefined,
          semester_id: params.semesterId || undefined,
        },
      }
    );
    return res.data.data;
  },

  generateHallTickets: async (
    data: GenerateHallTicketRequest
  ): Promise<{ generated_count: number; results: GeneratedHallTicketPayload[] }> => {
    const res = await axiosInstance.post<
      ApiResponse<{ generated_count: number; results: GeneratedHallTicketPayload[] }>
    >('/hall-ticket/generate', data);
    return res.data.data;
  },

  downloadHallTicket: async (
    studentId: string,
    examEventId: string,
    includePrincipalSignature = true
  ): Promise<Blob> => {
    const res = await axiosInstance.get(
      `/hall-ticket/download/${studentId}/${examEventId}`,
      {
        params: { include_principal_signature: includePrincipalSignature },
        responseType: 'blob',
      }
    );
    return res.data as Blob;
  },

  downloadHallTicketBulk: async (
    examEventId: string,
    includePrincipalSignature = true
  ): Promise<{
    generated_count: number;
    results: BulkHallTicketResult[];
  }> => {
    const res = await axiosInstance.post<
      ApiResponse<{
        generated_count: number;
        results: BulkHallTicketResult[];
      }>
    >('/hall-ticket/download-bulk', {
      exam_event_id: examEventId,
      include_principal_signature: includePrincipalSignature,
    });
    return res.data.data;
  },

  getStudentHallTicketView: async (eventId?: string): Promise<StudentHallTicketView> => {
    const res = await axiosInstance.get<ApiResponse<StudentHallTicketView>>(
      '/hall-ticket/student/view',
      { params: eventId ? { event_id: eventId } : undefined }
    );
    return res.data.data;
  },

  downloadStudentHallTicket: async (eventId?: string): Promise<Blob> => {
    const res = await axiosInstance.get('/hall-ticket/student/download', {
      params: eventId ? { event_id: eventId } : undefined,
      responseType: 'blob',
    });
    return res.data as Blob;
  },
};
