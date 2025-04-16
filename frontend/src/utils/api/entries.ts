import axios from 'axios';
import { JournalEntry } from '@/types';

const api = axios.create({
  baseURL: '/api/entry',
  headers: { Accept: 'application/json' }
});

export const fetchEntries = async (): Promise<JournalEntry[]> => {
  const res = await api.get('/');
  return res.data || [];
};

export const createEntry = async (formData: FormData): Promise<JournalEntry> => {
  const res = await api.post('/', formData);
  return res.data;
};

export const updateEntry = async (entryId: string, formData: FormData): Promise<JournalEntry> => {
  const res = await api.patch(`/${entryId}`, formData);
  return res.data;
};

export const deleteEntry = async (entryId: string): Promise<void> => {
  await api.delete(`/${entryId}`);
};
