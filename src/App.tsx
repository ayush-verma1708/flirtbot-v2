import  { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Toaster } from 'react-hot-toast';
import ChatInterface from './components/ChatInterface';
import Settings from './components/Settings';
import type { ChatSettings } from './types';

function App() {
  const [showSettings, setShowSettings] = useState(false);
  const [settings, setSettings] = useState<ChatSettings>({
    language: 'english',
    responseStyle: 'professional',
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 p-4">
      <div className="container mx-auto">
        <div className="flex gap-4">
          <div className={`flex-1 ${showSettings ? 'w-2/3' : 'w-full'}`}>
            <ChatInterface onToggleSettings={() => setShowSettings(!showSettings)} />
          </div>
          <AnimatePresence>
            {showSettings && (
              <motion.div
                initial={{ x: 300, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: 300, opacity: 0 }}
                className="w-1/3"
              >
                <Settings settings={settings} onSettingsChange={setSettings} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
      <Toaster position="top-center" />
    </div>
  );
}

export default App;