import React from 'react';
import { JournalEntry } from '../types';

type Props = {
  entry: JournalEntry;
  onClick: () => void;
};

const EntryCard: React.FC<Props> = ({ entry, onClick }) => {
  return (
    <div
      onClick={onClick}
      className="cursor-pointer"
    >
      <div className="flex justify-between items-center text-sm text-[#D3C2B4] mb-2">
        <span>{entry.date_of_memory || 'Unknown date'}</span>
        {entry.privacy && (
          <span className="text-xs bg-[#F4E3DA] text-[#8C6F5E] px-2 py-0.5 rounded capitalize">
            {entry.privacy}
          </span>
        )}
      </div>

      <p className="text-[#8C6F5E] text-sm whitespace-pre-line">
        {entry.content || <span className="italic text-[#D3C2B4]">No content</span>}
      </p>

      {entry.media_url && (
        <div className="mt-3">
          {Array.isArray(entry.media_url)
            ? entry.media_url.map((url, i) => (
                <div key={i}>
                  {url.endsWith('.mp3') || url.endsWith('.m4a') ? (
                    <audio controls src={url} className="w-full mt-2" />
                  ) : (
                    <img
                      src={url}
                      alt="Memory"
                      className="w-full max-h-64 object-cover rounded-lg border mt-2"
                    />
                  )}
                </div>
              ))
            : null}
        </div>
      )}

      {entry.tags?.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-2 text-sm">
          {entry.tags.map((tag, idx) => (
            <span
              key={idx}
              className="bg-[#EADBC8] text-[#8C6F5E] px-2 py-0.5 rounded-full text-xs"
            >
              #{tag}
            </span>
          ))}
        </div>
      )}
    </div>
  );
};

export default EntryCard;
