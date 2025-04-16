import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { JournalEntry } from '@/types';
import { fetchEntries } from '@/utils/api/entries';
import EntryCard from '@/components/EntryCard';
import EntryModal from '@/components/EntryModal';
import EmptyState from '@/components/EmptyState';
import { Settings, Trash } from 'lucide-react';

export default function Journal() {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [filteredEntries, setFilteredEntries] = useState<JournalEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  const loadEntries = async () => {
    try {
      const data = await fetchEntries();
      setEntries(data);
      setFilteredEntries(data);
    } catch (error) {
      console.error('Failed to fetch entries:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEntries();
  }, []);

  useEffect(() => {
    const lower = search.toLowerCase();
    if (!lower) {
      setFilteredEntries(entries);
    } else {
      setFilteredEntries(
        entries.filter((entry) =>
          entry.content?.toLowerCase().includes(lower) ||
          entry.tags?.some((tag) => tag.toLowerCase().includes(lower))
        )
      );
    }
  }, [search, entries]);

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this memory?')) return;
    try {
      const res = await fetch(`/api/entry/${id}`, { method: 'DELETE' });
      if (res.ok) setEntries((prev) => prev.filter((e) => e.entry_id !== id));
      else alert('Delete failed.');
    } catch (err) {
      console.error(err);
      alert('Error deleting memory.');
    }
  };

  return (
    <div className="relative px-4 py-6 max-w-2xl mx-auto pb-24 text-[#8C6F5E]">
      {showModal && (
        <EntryModal
          entry={null}
          onClose={() => setShowModal(false)}
          onEntrySaved={loadEntries}
        />
      )}

      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold text-center flex-1">Your Saved Memories</h2>
        <button
          onClick={() => navigate('/settings')}
          aria-label="Settings"
          className="text-[#D3C2B4] hover:text-[#8C6F5E] transition"
        >
          <Settings size={20} />
        </button>
      </div>

      <input
        type="text"
        className="mb-6 w-full rounded-xl border border-[#EADBC8] px-4 py-2 text-sm placeholder-[#D3C2B4] bg-white"
        placeholder="Search memories..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {loading ? (
        <p className="text-center text-[#D3C2B4]">Loading your journal...</p>
      ) : filteredEntries.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="space-y-4">
          {filteredEntries.map((entry) => (
            <div
              key={entry.entry_id}
              className="relative bg-white rounded-xl p-4 shadow-sm border border-[#EADBC8]"
            >
              <EntryCard entry={entry} onClick={() => null} />
              <button
                onClick={() => handleDelete(entry.entry_id)}
                className="absolute top-2 right-2 text-red-400 hover:text-red-600"
                title="Delete Memory"
              >
                <Trash size={16} />
              </button>
            </div>
          ))}
        </div>
      )}

      <button
        onClick={() => setShowModal(true)}
        className="fixed bottom-6 left-1/2 transform -translate-x-1/2 bg-[#EADBC8] hover:bg-[#F4E3DA] text-[#8C6F5E] rounded-full w-14 h-14 shadow-md flex items-center justify-center text-2xl"
        title="New Memory"
      >
        +
      </button>
    </div>
  );
}
