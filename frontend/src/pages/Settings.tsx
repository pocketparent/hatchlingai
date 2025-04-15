import React from 'react';

const Settings: React.FC = () => {
  return (
    <div className="max-w-2xl mx-auto p-6 pt-8 text-[#8C6F5E]">
      <h1 className="text-2xl font-semibold mb-6 text-center">Settings</h1>

      <div className="space-y-6 bg-[#F9F4EF] p-6 rounded-xl shadow-sm border border-[#EADBC8]">

        {/* Account Info */}
        <section>
          <h2 className="text-lg font-medium mb-2">Account</h2>
          <div className="text-sm space-y-1 text-[#8C6F5E]">
            <p><strong>Name:</strong> Demo User</p>
            <p><strong>Phone:</strong> (xxx) xxx-xxxx</p>
            <p><strong>Role:</strong> Parent</p>
          </div>
        </section>

        {/* Caregivers */}
        <section>
          <h2 className="text-lg font-medium mb-2">Caregivers</h2>
          <p className="text-sm text-[#D3C2B4] mb-2">Manage who can view or contribute to your journal.</p>
          <button className="px-4 py-2 bg-[#EADBC8] text-[#8C6F5E] text-sm rounded-lg hover:bg-[#F4E3DA]">
            Invite New Caregiver
          </button>
        </section>

        {/* Notifications */}
        <section>
          <h2 className="text-lg font-medium mb-2">Reminders</h2>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" className="accent-[#8C6F5E]" defaultChecked />
            Get nudges to save memories
          </label>
        </section>

        {/* Privacy */}
        <section>
          <h2 className="text-lg font-medium mb-2">Privacy & Sharing</h2>
          <select className="w-full border border-[#EADBC8] rounded-lg px-3 py-2 text-sm bg-white">
            <option value="private">Default: Private</option>
            <option value="shared">Default: Shared</option>
          </select>
        </section>

        {/* Export & Backup */}
        <section>
          <h2 className="text-lg font-medium mb-2">Export & Backup</h2>
          <p className="text-sm text-[#D3C2B4] mb-2">You can export your full journal at any time.</p>
          <button className="px-4 py-2 bg-[#EADBC8] text-[#8C6F5E] text-sm rounded-lg hover:bg-[#F4E3DA]">
            Download Journal
          </button>
        </section>

        {/* Help & Info */}
        <section>
          <h2 className="text-lg font-medium mb-2">Help & Info</h2>
          <ul className="text-sm list-disc list-inside text-[#D3C2B4] space-y-1">
            <li><a href="/faq" className="underline">FAQs</a></li>
            <li><a href="/terms" className="underline">Terms of Service</a></li>
            <li><button className="underline text-red-600">Delete Account</button></li>
          </ul>
        </section>

      </div>
    </div>
  );
};

export default Settings;
