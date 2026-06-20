import api from './client';

export const authApi = {
  register: (payload) => api.post('/auth/register', payload, { auth: false }),
  login:    (payload) => api.post('/auth/login',    payload, { auth: false }),
};

export const userApi = {
  me: () => api.get('/users/me'),
};

export const servicesApi = {
  list: () => api.get('/services', { auth: false }),
};

export const contactApi = {
  submit: (payload) => api.post('/contact', payload, { auth: false }),
};

export const appointmentsApi = {
  book:         (payload)    => api.post('/appointments', payload),
  mine:         ()           => api.get('/appointments/me'),
  cancel:       (id)         => api.delete(`/appointments/${id}`),
  availability: (date)       => api.get(`/appointments/availability?date=${date}`),
  schedule:     (date)       => api.get(`/appointments/staff/schedule?date=${date}`),
  updateStatus: (id, status) => api.patch(`/appointments/staff/${id}/status`, { status }),

  // Admin/staff slot blocking — used to make a slot unavailable (e.g. a
  // 10:00-11:00 staff meeting) ahead of time.
  blockSlot:      (payload)             => api.post('/appointments/staff/block', payload),
  blockSlotRange: (payload)             => api.post('/appointments/staff/block-range', payload),
  unblockSlot:    (blockedSlotId)       => api.delete(`/appointments/staff/block/${blockedSlotId}`),
  listBlocked:    (date)                => api.get(`/appointments/staff/blocked?date=${date}`),
};

export const aiApi = {
  chat: (message, history = []) => api.post('/ai/chat', { message, history }),
};

// ── Admin API ─────────────────────────────────────────────────────────────
export const adminApi = {
  // Users
  getAllUsers:    ()             => api.get('/admin/users'),
  getUserById:   (id)           => api.get(`/admin/users/${id}`),
  createUser:    (payload)      => api.post('/admin/users', payload),
  updateUser:    (id, payload)  => api.put(`/admin/users/${id}`, payload),
  deleteUser:    (id)           => api.delete(`/admin/users/${id}`),

  // Appointments
  getAllAppointments: ()              => api.get('/admin/appointments'),
  approveAppt:       (id)            => api.patch(`/admin/appointments/${id}/approve`),
  rejectAppt:        (id)            => api.patch(`/admin/appointments/${id}/reject`),
  deleteAppt:        (id)            => api.delete(`/admin/appointments/${id}`),
  updateApptStatus:  (id, status)    => api.patch(`/admin/appointments/${id}/status`, { status }),

  // Stats
  stats: () => api.get('/admin/stats'),
};
