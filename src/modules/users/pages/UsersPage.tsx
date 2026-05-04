import React, { useCallback, useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Plus, 
  Pencil, 
  Trash2, 
  Mail,
  User as UserIcon,
  CreditCard,
  CheckCircle2,
  Save,
  MailQuestion,
  FileSpreadsheet,
  FileText
} from 'lucide-react';
import { DataTable, type Column } from '../../../components/ui/DataTable';
import { SearchInput } from '../../../components/ui/SearchInput';
import { Pagination } from '../../../components/ui/Pagination';
import { useTableState } from '../../../hooks/useTableState';
import { DetailModal } from '../../../components/ui/DetailModal';
import { Input } from '../../../components/ui/Input';
import { Select } from '../../../components/ui/Select';
import { MultiSelect } from '../../../components/ui/MultiSelect';
import { DeleteConfirmModal } from '../../../components/ui/DeleteConfirmModal';
import { Shield, Filter } from 'lucide-react';

interface User {
  id: number;
  nik: string;
  namaLengkap: string;
  email: string;
  role: string;
  isVerified: boolean;
}

const DUMMY_USERS: User[] = [
  { id: 1, nik: '', namaLengkap: 'Dinas Kesehatan Provinsi', email: 'dinkes_prov@gmail.com', role: 'dinas prov', isVerified: true },
  { id: 2, nik: '', namaLengkap: 'Puskesmas Semarang', email: 'puskesmas_smg@gmail.com', role: 'puskesmas', isVerified: true },
  { id: 3, nik: '3322892717251121', namaLengkap: 'Rais Hannan Rizanto', email: 'rizantohannan@gmail.com', role: 'superadmin', isVerified: true },
  { id: 4, nik: '4332212135443222', namaLengkap: 'Muhammad Rayhan Maulana Anas', email: 'rayhanzz772@gmail.com', role: 'ortu', isVerified: true },
  { id: 5, nik: '', namaLengkap: 'Kecamatan Gajahmungkur', email: 'kec_gajah@gmail.com', role: 'kecamatan', isVerified: true },
];

const ROLE_OPTIONS = [
  { value: 'superadmin', label: 'Superadmin' },
  { value: 'dinas prov', label: 'Dinas Prov' },
  { value: 'dinas kota/kab', label: 'Dinas Kota/Kab' },
  { value: 'puskesmas', label: 'Puskesmas' },
  { value: 'kecamatan', label: 'Kecamatan' },
  { value: 'kelurahan', label: 'Kelurahan' },
  { value: 'rt/rw', label: 'RT/RW' },
  { value: 'ortu', label: 'Ortu' },
];

const INITIAL_FORM = {
  nik: '',
  namaLengkap: '',
  email: '',
  role: 'ortu',
  isVerified: false,
};

const UsersPage: React.FC = () => {
  const [selectedRoles, setSelectedRoles] = useState<string[]>([]);
  const [formData, setFormData] = useState(INITIAL_FORM);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formMode, setFormMode] = useState<'add' | 'edit'>('add');
  const [deleteTarget, setDeleteTarget] = useState<User | null>(null);

  const filterFn = useCallback((item: User, search: string) => {
    const q = search.toLowerCase();
    const matchesSearch = item.namaLengkap.toLowerCase().includes(q) || 
                         item.email.toLowerCase().includes(q);
    const matchesRole = selectedRoles.length === 0 || selectedRoles.includes(item.role);
    return matchesSearch && matchesRole;
  }, [selectedRoles]);

  const {
    search, page, perPage, setSearch, setPage, setPerPage,
    totalPages, paginatedData, filteredData, startIndex, endIndex
  } = useTableState<User>(DUMMY_USERS, filterFn, { initialPerPage: 10 });

  const handleOpenAdd = () => {
    setFormMode('add');
    setFormData(INITIAL_FORM);
    setIsFormOpen(true);
  };

  const handleOpenEdit = (item: User) => {
    setFormMode('edit');
    setFormData({
      nik: item.nik,
      namaLengkap: item.namaLengkap,
      email: item.email,
      role: item.role,
      isVerified: item.isVerified,
    });
    setIsFormOpen(true);
  };

  const columns: Column<User>[] = [
    {
      key: 'no',
      header: 'No',
      className: 'w-14 text-text-muted/60 font-bold text-sm',
      render: (_, idx) => <span className="text-sm font-bold text-text-muted/60">{idx + startIndex + 1}</span>
    },

    {
      key: 'namaLengkap',
      header: 'Nama Lengkap',
      sortable: true,
      render: (item) => (
        <div className="flex flex-col">
          <span className="text-sm font-bold text-text-main uppercase tracking-tight leading-tight">{item.namaLengkap}</span>
          <div className="flex items-center gap-1.5 mt-1">
             <div className={`w-1.5 h-1.5 rounded-full ${item.role === 'superadmin' ? 'bg-amber-400' : item.role === 'ortu' ? 'bg-primary' : 'bg-slate-400'}`} />
             <span className="text-[10px] font-black uppercase tracking-wider text-text-muted/60">{item.role}</span>
          </div>
        </div>
      )
    },
    {
      key: 'email',
      header: 'Email',
      render: (item) => (
        <div className="flex items-center gap-2 text-text-muted">
          <Mail size={14} className="opacity-40" />
          <span className="text-sm font-medium">{item.email}</span>
        </div>
      )
    },
    {
      key: 'isVerified',
      header: 'Verifikasi Email',
      className: 'text-center',
      render: (item) => (
        <div className="flex justify-center">
          {item.isVerified ? (
            <div className="w-8 h-8 rounded-full bg-green-500/10 text-green-500 flex items-center justify-center">
              <CheckCircle2 size={18} />
            </div>
          ) : (
            <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-white/5 text-text-muted/40 flex items-center justify-center">
              <MailQuestion size={18} />
            </div>
          )}
        </div>
      )
    },
    {
      key: 'actions',
      header: 'Aksi',
      className: 'w-36',
      render: (item) => (
        <div className="flex items-center gap-1.5">
          <button 
            onClick={() => handleOpenEdit(item)}
            className="h-10 w-10 flex items-center justify-center rounded-xl text-text-muted hover:text-primary hover:bg-primary/10 transition-all duration-200"
          >
            <Pencil size={18} />
          </button>
          <button 
            onClick={() => setDeleteTarget(item)}
            className="h-10 w-10 flex items-center justify-center rounded-xl text-text-muted hover:text-rose-400 hover:bg-rose-400/10 transition-all duration-200"
          >
            <Trash2 size={18} />
          </button>
        </div>
      )
    }
  ];

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-text-main tracking-tight uppercase">Manajemen Pengguna</h1>
          <p className="text-md text-text-muted font-medium mt-0.5">Kelola akses dan verifikasi akun pengguna</p>
        </div>
        <button className="btn-primary h-11 flex items-center gap-2" onClick={handleOpenAdd}>
          <Plus size={14} strokeWidth={3} />
          Tambah Pengguna
        </button>
      </div>

      {/* Search & Toolbar Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3 flex-1 max-w-xl">
          <div className="flex-1 max-w-xs">
            <SearchInput
              value={search}
              onChange={setSearch}
              placeholder="Cari nama atau email..."
            />
          </div>
          <MultiSelect
            value={selectedRoles}
            onChange={setSelectedRoles}
            options={ROLE_OPTIONS}
            placeholder="Filter Role"
            icon={<Filter size={18} strokeWidth={2.5} />}
            compact
          />
        </div>

        <div className="flex items-center gap-2">
          <button title="Export Excel" className="w-11 h-11 flex items-center justify-center rounded-2xl bg-surface-card border border-border-subtle text-emerald-600 hover:border-emerald-500/30 hover:bg-emerald-500/5 transition-all active:scale-95 shadow-sm">
            <FileSpreadsheet size={18} strokeWidth={2.5} />
          </button>
          <button title="Export PDF" className="w-11 h-11 flex items-center justify-center rounded-2xl bg-surface-card border border-border-subtle text-rose-600 hover:border-rose-500/30 hover:bg-rose-500/5 transition-all active:scale-95 shadow-sm">
            <FileText size={18} strokeWidth={2.5} />
          </button>
        </div>
      </div>

      <DataTable<User> columns={columns} data={paginatedData} startIndex={startIndex} />
      <Pagination 
        page={page} totalPages={totalPages} perPage={perPage} 
        totalItems={filteredData.length} startIndex={startIndex} endIndex={endIndex}
        onPageChange={setPage} onPerPageChange={setPerPage}
      />

      <DetailModal 
        isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} 
        title={formMode === 'add' ? 'Tambah Pengguna' : 'Ubah Pengguna'}
        footer={
          <div className="flex gap-3">
             <button onClick={() => setIsFormOpen(false)} className="px-8 py-3 bg-slate-100 dark:bg-white/5 text-text-muted font-bold text-xs rounded-2xl">Batal</button>
             <button className="btn-primary flex items-center gap-2" onClick={() => setIsFormOpen(false)}>
               <Save size={14} /> Simpan
             </button>
          </div>
        }
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
           {formData.role === 'ortu' && (
             <Input 
               label="NIK" icon={<CreditCard />} 
               placeholder="Contoh: 3322..."
               value={formData.nik}
               onChange={(e) => setFormData({ ...formData, nik: e.target.value })}
             />
           )}
           <Input 
             label="Nama Lengkap" icon={<UserIcon />} 
             placeholder="Contoh: Ahmad Subardjo"
             value={formData.namaLengkap}
             onChange={(e) => setFormData({ ...formData, namaLengkap: e.target.value })}
             className={formData.role !== 'ortu' ? 'sm:col-span-1' : ''}
           />
           <div className={`sm:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-6`}>
             <Input 
               label="Email" icon={<Mail />} 
               placeholder="Contoh: user@gmail.com"
               value={formData.email}
               onChange={(e) => setFormData({ ...formData, email: e.target.value })}
             />
             <Select
               label="Role Pengguna"
               icon={<Shield />}
               value={formData.role}
               onChange={(val) => setFormData({ ...formData, role: val })}
               options={ROLE_OPTIONS}
             />
           </div>
        </div>
      </DetailModal>

      <DeleteConfirmModal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={() => setDeleteTarget(null)}
        message={`Apakah Anda yakin ingin menghapus pengguna "${deleteTarget?.namaLengkap}"?`}
      />
    </motion.div>
  );
};

export default UsersPage;
