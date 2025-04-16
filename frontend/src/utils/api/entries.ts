import axios from 'axios';
import { JournalEntry } from '@/types';

const API_BASE = import.meta.env.VITE_API_BASE_URL
  ? `${import.meta.env.VITE_API_BASE_URL}/entry`
  : '/api/entry';

export async function fetchEntries(): Promise<JournalEntry[]> {
  const response = await axios.get(API_BASE);
  return response.data;
}

export async function createEntry(entry: Partial<JournalEntry>) {
  const formData = new FormData();
  formData.append('content', entry.content || '');
  formData.append('author_id', entry.author_id || 'demo');
  formData.append('date_of_memory', entry.date_of_memory || '');
  formData.append('privacy', entry.privacy || 'private');
  formData.append('source_type', entry.source_type || 'app');
  formData.append('journal_id', entry.journal_id || 'default');

  // ✅ Tags fallback for AI tagging
  if (entry.tags && entry.tags.length > 0) {
    entry.tags.forEach(tag => formData.append('tags', tag));
  } else {
    formData.append('tags', ''); // triggers AI fallback
  }

  // ✅ Handle multiple media files
  if (entry.media && Array.isArray(entry.media)) {
    entry.media.forEach(file => {
      formData.append('media', file);
    });
  } else if (entry.media) {
    formData.append('media', entry.media); // single file fallback
  }

  // 🔍 Debug: Show FormData contents
  console.log('📤 Submitting FormData:');
  for (const [key, value] of formData.entries()) {
    console.log(`📦 ${key}:`, value);
  }

  const response = await axios.post(API_BASE, formData);
  return response.data;
}

export async function updateEntry(entryId: string, entry: Partial<JournalEntry>) {
  const formData = new FormData();
  formData.append('content', entry.content || '');
  formData.append('author_id', entry.author_id || 'demo');
  formData.append('date_of_memory', entry.date_of_memory || '');
  formData.append('privacy', entry.privacy || 'private');

  if (entry.tags && entry.tags.length > 0) {
    entry.tags.forEach(tag => formData.append('tags', tag));
  } else {
    formData.append('tags', '');
  }

  if (entry.media && Array.isArray(entry.media)) {
    entry.media.forEach(file => {
      formData.append('media', file);
    });
  } else if (entry.media) {
    formData.append('media', entry.media);
  }

  const response = await axios.patch(`${API_BASE}/${entryId}`, formData);
  return response.data;
}

export async function deleteEntry(entryId: string) {
  const response = await axios.delete(`${API_BASE}/${entryId}`);
  return response.data;
}
