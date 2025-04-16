import React, { useState, useEffect, useRef } from 'react';
import { JournalEntry } from '@/types';
import { createEntry, updateEntry } from '@/utils/api/entries';
import { useAuth } from '@/contexts/AuthContext';

interface EntryModalProps {
  entry: JournalEntry | null;
  onClose: () => void;
  onEntrySaved: () => void;
}

const EntryModal: React.FC<EntryModalProps> = ({ entry, onClose, onEntrySaved }) => {
  const { user } = useAuth();
  const [content, setContent] = useState(entry?.content || '');
  const [tags, setTags] = useState(entry?.tags?.join(', ') || '');
  const [dateOfMemory, setDateOfMemory] = useState(entry?.date_of_memory || '');
  const [privacy, setPrivacy] = useState(entry?.privacy || 'private');
  const [media, setMedia] = useState<File[]>([]);
  const [error, setError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) onClose();
  };

  const handleMediaUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const filtered = files.filter(file => file.size <= 15 * 1024 * 1024);
    if (filtered.length < files.length) {
      setError('Some files were too large and were ignored (limit: 15MB each)');
    }
    setMedia(filtered);
  };

  const handleRemoveMedia = (index: number) => {
    setMedia((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    setError('');

    const trimmedContent = content.trim();
    const trimmedDate = dateOfMemory.trim();

    if (!trimmedContent && media.length === 0) {
      setError('Please write something or upload a file.');
      return;
    }

    if (!trimmedDate) {
      setError('Please select a date.');
      return;
    }

    const today = new Date().toISOString().split('T')[0];
    if (trimmedDate > today) {
      setError('The memory date cannot be in the future.');
      return;
    }

    const entryPayload: Partial<JournalEntry> = {
      content: trimmedContent,
      tags: tags.split(',').map(t => t.trim()).filter(Boolean),
      date_of_memory: trimmedDate,
      privacy,
      author_id: user?.user_id || 'demo',
      journal_id: 'default',
      source_type: 'app',
      media
    };

    try {
      if (entry?.entry_id) {
        await updateEntry(entry.entry_id, entryPayload);
      } else {
        await createEntry(entryPayload);
      }

      onEntrySaved();
      alert('✅ Memory saved!');
      onClose();
    } catch (err) {
      console.error('🔥 Entry save failed:', err);
      setError('Something went wrong. Please try again.');
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50"
      onClick={handleOverlayClick}
    >
      <div className="bg-[#F9F4EF] rounded-2xl w-full max-w-xl p-6 relative shadow-xl">
        <button
          className="absolute top-4 right-4 text-[#D3C2B4] hover:text-[#8C6F5E] text-2xl"
          onClick={onClose}
        >
          ×
        </button>
        <h2 className="text-xl font-semibold mb-4 text-[#8C6F5E]">
          {entry ? 'Edit Memory' : 'New Memory'}
        </h2>

        {error && <p className="text-red-500 text-sm mb-2">{error}</p>}

        <div className="space-y-4 text-[#8C6F5E]">
          <textarea
            placeholder="Write your memory here..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full border border-[#EADBC8] rounded-xl px-4 py-2 text-sm bg-white placeholder-[#D3C2B4]"
            rows={4}
          />

          <input
            type="text"
            placeholder="Tags (e.g., first smile, milestone, funny)"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            className="w-full border border-[#EADBC8] rounded-xl px-4 py-2 text-sm bg-white placeholder-[#D3C2B4]"
          />

          <input
            type="date"
            value={dateOfMemory}
            onChange={(e) => setDateOfMemory(e.target.value)}
            max={new Date().toISOString().split('T')[0]}
            className="w-full border border-[#EADBC8] rounded-xl px-4 py-2 text-sm bg-white"
            required
          />

          <div className="text-sm">
            <p className="mb-1">Privacy</p>
            <div className="flex gap-4">
              {['private', 'shared', 'public'].map((option) => (
                <label key={option} className="flex items-center gap-1">
                  <input
                    type="radio"
                    checked={privacy === option}
                    onChange={() => setPrivacy(option)}
                  />
                  {option.charAt(0).toUpperCase() + option.slice(1)}
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-[#8C6F5E] mb-1">
              Upload photos or voice notes (optional)
            </label>
            <input
              type="file"
              multiple
              accept="image/*,audio/*"
              onChange={handleMediaUpload}
              ref={fileInputRef}
              className="block w-full text-sm text-[#8C6F5E] file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-medium file:bg-[#EADBC8] file:text-[#8C6F5E] hover:file:bg-[#F4E3DA]"
            />
            {media.length > 0 && (
              <ul className="mt-2 text-sm">
                {media.map((file, i) => (
                  <li key={i} className="flex justify-between items-center">
                    {file.name}
                    <button
                      onClick={() => handleRemoveMedia(i)}
                      className="text-red-500 text-xs ml-2"
                    >
                      Remove
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        <button
          onClick={handleSubmit}
          className="mt-6 w-full bg-[#EADBC8] text-[#8C6F5E] py-2 rounded-2xl hover:bg-[#F4E3DA] transition"
        >
          {entry ? 'Update Entry' : 'Save Entry'}
        </button>
      </div>
    </div>
  );
};

export default EntryModal;
