// Dashboard service for handling stats and metrics

export const dashboardService = {
  getStats: async () => {
    return {
      totalUsers: 1250,
      activeSessions: 42,
      serverStatus: 'Online',
      lastUpdate: new Date().toISOString(),
    };
  },

  getSystemMetrics: async () => {
    return [
      { name: 'CPU', value: 35 },
      { name: 'Memory', value: 62 },
      { name: 'Disk', value: 48 },
    ];
  },

  createReport: async (data: any) => {
    console.log('Mock report created:', data);
    return { success: true };
  },
};
