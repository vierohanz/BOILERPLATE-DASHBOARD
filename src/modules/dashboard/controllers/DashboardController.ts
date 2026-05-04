import { useState, useEffect } from 'react';
import { dashboardService } from '../services/dashboard.service';

// Mock Fallback Data (Jika API Belum Siap)
const MOCK_FALLBACK = {
  stats: [
    { label: 'Total Anggota', value: '1,284', trend: '+12.5%' },
    { label: 'Total Aplikasi', value: '842', trend: '+5.2%' },
    { label: 'Tingkat Pertumbuhan', value: '18.4%', trend: '+2.1%' },
    { label: 'Beban Sistem', value: '24%', trend: '-1.4%' },
  ],
  activities: [
    { id: 1, user: 'Siti Aminah', action: 'mendaftar anggota baru', time: '2 menit yang lalu' },
    { id: 2, user: 'Budi Raharjo', action: 'mengupdate profil', time: '15 menit yang lalu' },
    { id: 3, user: 'Agus Setiawan', action: 'menyelesaikan verifikasi', time: '1 jam yang lalu' },
  ]
};

export const useDashboardController = () => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      // Panggil Service
      const result = await dashboardService.getStats();
      setData(result);
    } catch (err: any) {
      console.warn('API error, using mock data:', err);
      // Gunakan mock data jika API gagal (untuk demo)
      setData(MOCK_FALLBACK);
      // Jika ingin menampilkan error beneran, aktifkan baris di bawah:
      // setError(err?.message || 'Gagal memuat data dashboard');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  return {
    data,
    loading,
    error,
    refresh: loadData
  };
};
