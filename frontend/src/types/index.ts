export type JournalEntry = {
  entry_id: string;
  content: string;
  tags: string[];
  date_of_memory: string;
  timestamp_created: string;
  author_id: string;
  privacy: 'private' | 'shared' | 'public';
  media_url: string[]; // array of public URLs
  transcription?: string;
  source_type?: string;
  deleted_flag?: boolean;
  journal_id?: string;
};

export type UserRole = 'parent' | 'co-parent' | 'caregiver';

export type User = {
  user_id: string;
  phone_number: string;
  role: UserRole;
  avatar_url?: string;
  name?: string;
};
