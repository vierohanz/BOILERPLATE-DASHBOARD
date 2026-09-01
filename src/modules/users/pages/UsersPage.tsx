import React, { useCallback, useState } from 'react';
import { motion } from 'framer-motion';
import {
  Plus,
  Pencil,
  Trash2,
  Mail,
  User as UserIcon,
  CheckCircle2,
  Save,
  MailQuestion,
  FileSpreadsheet,
  FileText,
} from 'lucide-react';
import {
  DataTable,
  type Column,
  SearchInput,
  Pagination,
  DetailModal,
  Input,
  Select,
  MultiSelect,
  DeleteConfirmModal,
} from '@/components/ui';
import { useTableState } from '@/hooks';
import { Shield, Filter } from 'lucide-react';

interface User {
  id: number;
  fullName: string;
  email: string;
  role: string;
  isVerified: boolean;
}

const DUMMY_USERS: User[] = [
  {
    id: 1,
    fullName: 'System Administrator',
    email: 'admin@example.com',
    role: 'admin',
    isVerified: true,
  },
  { id: 2, fullName: 'John Doe', email: 'john@example.com', role: 'editor', isVerified: true },
  { id: 3, fullName: 'Jane Smith', email: 'jane@example.com', role: 'user', isVerified: true },
  {
    id: 4,
    fullName: 'Marketing Team',
    email: 'marketing@example.com',
    role: 'editor',
    isVerified: true,
  },
];

const ROLE_OPTIONS = [
  { value: 'admin', label: 'Administrator' },
  { value: 'editor', label: 'Editor' },
  { value: 'user', label: 'Standard User' },
];

const INITIAL_FORM = {
  fullName: '',
  email: '',
  role: 'user',
  isVerified: false,
};

const UsersPage: React.FC = () => {
  const [selectedRoles, setSelectedRoles] = useState<string[]>([]);
  const [formData, setFormData] = useState(INITIAL_FORM);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formMode, setFormMode] = useState<'add' | 'edit'>('add');
  const [deleteTarget, setDeleteTarget] = useState<User | null>(null);

  const filterFn = useCallback(
    (item: User, search: string) => {
      const q = search.toLowerCase();
      const matchesSearch =
        item.fullName.toLowerCase().includes(q) || item.email.toLowerCase().includes(q);
      const matchesRole = selectedRoles.length === 0 || selectedRoles.includes(item.role);
      return matchesSearch && matchesRole;
    },
    [selectedRoles]
  );

  const {
    search,
    page,
    perPage,
    setSearch,
    setPage,
    setPerPage,
    totalPages,
    paginatedData,
    filteredData,
    startIndex,
    endIndex,
  } = useTableState<User>(DUMMY_USERS, filterFn, { initialPerPage: 10 });

  const handleOpenAdd = () => {
    setFormMode('add');
    setFormData(INITIAL_FORM);
    setIsFormOpen(true);
  };

  const handleOpenEdit = (item: User) => {
    setFormMode('edit');
    setFormData({
      fullName: item.fullName,
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
      render: (_, idx) => (
        <span className="text-sm font-bold text-text-muted/60">{idx + startIndex + 1}</span>
      ),
    },

    {
      key: 'fullName',
      header: 'Full Name',
      sortable: true,
      render: (item) => (
        <div className="flex flex-col">
          <span className="text-sm font-bold text-text-main uppercase tracking-tight leading-tight">
            {item.fullName}
          </span>
          <div className="flex items-center gap-1.5 mt-1">
            <div
              className={`w-1.5 h-1.5 rounded-full ${item.role === 'admin' ? 'bg-amber-400' : item.role === 'user' ? 'bg-primary' : 'bg-slate-400'}`}
            />
            <span className="text-[10px] font-black uppercase tracking-wider text-text-muted/60">
              {item.role}
            </span>
          </div>
        </div>
      ),
    },
    {
      key: 'email',
      header: 'Email',
      render: (item) => (
        <div className="flex items-center gap-2 text-text-muted">
          <Mail size={14} className="opacity-40" />
          <span className="text-sm font-medium">{item.email}</span>
        </div>
      ),
    },
    {
      key: 'isVerified',
      header: 'Status',
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
      ),
    },
    {
      key: 'actions',
      header: 'Actions',
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
      ),
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-text-main tracking-tight uppercase">
            User Management
          </h1>
          <p className="text-md text-text-muted font-medium mt-0.5">
            Manage user access and account verification
          </p>
        </div>
        <button className="btn-primary h-11 flex items-center gap-2" onClick={handleOpenAdd}>
          <Plus size={14} strokeWidth={3} />
          Add User
        </button>
      </div>

      {/* Search & Toolbar Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3 flex-1 max-w-xl">
          <div className="flex-1 max-w-xs">
            <SearchInput
              value={search}
              onChange={setSearch}
              placeholder="Search name or email..."
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
          <button
            title="Export Excel"
            className="w-11 h-11 flex items-center justify-center rounded-2xl bg-surface-card border border-border-subtle text-emerald-600 hover:border-emerald-500/30 hover:bg-emerald-500/5 transition-all active:scale-95 shadow-sm"
          >
            <FileSpreadsheet size={18} strokeWidth={2.5} />
          </button>
          <button
            title="Export PDF"
            className="w-11 h-11 flex items-center justify-center rounded-2xl bg-surface-card border border-border-subtle text-rose-600 hover:border-rose-500/30 hover:bg-rose-500/5 transition-all active:scale-95 shadow-sm"
          >
            <FileText size={18} strokeWidth={2.5} />
          </button>
        </div>
      </div>

      <DataTable<User> columns={columns} data={paginatedData} startIndex={startIndex} />
      <Pagination
        page={page}
        totalPages={totalPages}
        perPage={perPage}
        totalItems={filteredData.length}
        startIndex={startIndex}
        endIndex={endIndex}
        onPageChange={setPage}
        onPerPageChange={setPerPage}
      />

      <DetailModal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        title={formMode === 'add' ? 'Add User' : 'Edit User'}
        footer={
          <div className="flex gap-3">
            <button
              onClick={() => setIsFormOpen(false)}
              className="px-8 py-3 bg-slate-100 dark:bg-white/5 text-text-muted font-bold text-xs rounded-2xl"
            >
              Cancel
            </button>
            <button
              className="btn-primary flex items-center gap-2"
              onClick={() => setIsFormOpen(false)}
            >
              <Save size={14} /> Save Changes
            </button>
          </div>
        }
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <Input
            label="Full Name"
            icon={<UserIcon />}
            placeholder="e.g. John Doe"
            value={formData.fullName}
            onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
          />
          <Input
            label="Email Address"
            icon={<Mail />}
            placeholder="e.g. user@example.com"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          />
          <div className={`sm:col-span-2`}>
            <Select
              label="User Role"
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
        message={`Are you sure you want to delete user "${deleteTarget?.fullName}"?`}
      />
    </motion.div>
  );
};

export default UsersPage;
