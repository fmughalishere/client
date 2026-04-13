import api from '../lib/axios';

export const authAPI = {
  login: (data: any) => api.post('/auth/login', data),
  register: (data: any) => api.post('/auth/register', data),
};

export const jobAPI = {
  getAllJobs: () => api.get('/jobs'),
  getSavedJobs: () => api.get('/jobs/saved-jobs'),
  toggleSaveJob: (jobId: string) => api.post(`/jobs/save/${jobId}`),
};

export const dashboardAPI = {
  getJobseekerStats: () => api.get('/dashboard/jobseeker-stats'),
  
  getApplications: () => api.get('/applications/my-applications'),
};