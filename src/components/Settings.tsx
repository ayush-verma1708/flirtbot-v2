import React from 'react';
import type { ChatSettings } from '../types';

interface SettingsProps {
  settings: ChatSettings;
  onSettingsChange: (settings: ChatSettings) => void;
}

export default function Settings({ settings, onSettingsChange }: SettingsProps) {
  return (
    <div className="p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-xl font-bold mb-4">Chat Settings</h2>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Language
          </label>
          <select
            value={settings.language}
            onChange={(e) =>
              onSettingsChange({
                ...settings,
                language: e.target.value as ChatSettings['language'],
              })
            }
            className="w-full p-2 border rounded-md"
          >
            <option value="english">English</option>
            <option value="hindi">Hindi</option>
            <option value="both">Both</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Response Style
          </label>
          <select
            value={settings.responseStyle}
            onChange={(e) =>
              onSettingsChange({
                ...settings,
                responseStyle: e.target.value as ChatSettings['responseStyle'],
              })
            }
            className="w-full p-2 border rounded-md"
          >
            <option value="professional">Professional</option>
            <option value="casual">Casual</option>
            <option value="friendly">Friendly</option>
          </select>
        </div>
      </div>
    </div>
  );
}