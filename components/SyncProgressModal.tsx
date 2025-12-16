import React, { useState, useCallback } from 'react';
import { UserProgress } from '../types';
import { ClipboardCopyIcon, ClipboardCheckIcon, HeartIcon } from './icons';

interface SyncProgressModalProps {
  isOpen: boolean;
  onClose: () => void;
  userNameToLoad: string; // The name from the current login input
  onLoadSuccess: (name: string) => void;
}

const SyncProgressModal: React.FC<SyncProgressModalProps> = ({ isOpen, onClose, userNameToLoad, onLoadSuccess }) => {
  const [syncCode, setSyncCode] = useState('');
  const [pasteCode, setPasteCode] = useState('');
  const [isCopied, setIsCopied] = useState(false);
  
  const generateCode = useCallback(() => {
    // This assumes the user is logged in, so we find their progress
    const savedUser = localStorage.getItem('loveQuests_currentUser');
    if (!savedUser) {
        alert("You need to be logged in to generate a sync code.");
        return;
    }
    const progressString = localStorage.getItem(`userProgress_${savedUser}`);
    if (progressString) {
        try {
            const encoded = btoa(progressString); // Base64 encode
            setSyncCode(encoded);
        } catch (e) {
            console.error("Error encoding progress", e);
            alert("Could not create sync code.");
        }
    } else {
        alert("No progress found to create a code from.");
    }
  }, []);

  const handleCopy = () => {
    navigator.clipboard.writeText(syncCode).then(() => {
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    });
  };

  const handleLoadProgress = () => {
    if (!pasteCode.trim()) {
        alert("Please paste your magic code first.");
        return;
    }
    if (!userNameToLoad.trim()) {
        alert("Please enter your name on the login screen first.");
        return;
    }
    try {
        const decoded = atob(pasteCode); // Base64 decode
        const progress: UserProgress = JSON.parse(decoded);

        if (!progress.name || typeof progress.completedTasks === 'undefined') {
            throw new Error("Invalid progress code format.");
        }
        
        // Save it under the name currently in the login input
        localStorage.setItem(`userProgress_${userNameToLoad.trim()}`, JSON.stringify(progress));
        onLoadSuccess(userNameToLoad.trim());
        onClose();

    } catch (error) {
        console.error("Error loading progress from code:", error);
        alert("This doesn't seem to be a valid magic code. Please check if you copied it correctly.");
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-charcoal bg-opacity-70 flex items-center justify-center z-50 p-4 transition-opacity duration-300"
      onClick={onClose}
    >
      <div 
        className="bg-cream rounded-2xl shadow-2xl p-6 md:p-8 w-full max-w-lg text-charcoal transform scale-95 transition-transform duration-300 relative"
        onClick={e => e.stopPropagation()}
      >
        <button onClick={onClose} className="absolute top-4 right-4 text-charcoal hover:text-rose-gold transition-colors text-2xl">&times;</button>
        <div className="text-center mb-6">
            <HeartIcon className="w-12 h-12 mx-auto text-rose-gold" />
            <h2 className="font-serif text-3xl md:text-4xl mt-2 text-charcoal">Keep Our Story Safe</h2>
            <p className="font-sans text-gray-600 mt-1">Use a Magic Code to move your progress.</p>
        </div>
        
        <div className="space-y-6">
            {/* Part 1: Generate and Copy Code */}
            <div className="bg-white/80 p-4 rounded-lg">
                <h3 className="font-serif text-xl text-rose-gold">1. Get Your Magic Code</h3>
                <p className="font-sans text-sm text-gray-700 mb-3">On the app with your latest progress, click below to get your code.</p>
                <button onClick={generateCode} className="w-full font-sans bg-rose-gold text-white p-2 rounded-lg hover:bg-opacity-80 transition mb-2">
                    Generate My Code
                </button>
                {syncCode && (
                    <div className="relative">
                        <textarea readOnly value={syncCode} className="w-full h-24 p-2 font-mono text-xs bg-blush border border-rose-gold/50 rounded-md resize-none"/>
                        <button onClick={handleCopy} className="absolute top-2 right-2 p-2 bg-white rounded-md hover:bg-blush transition">
                            {isCopied ? <ClipboardCheckIcon className="w-5 h-5 text-green-500" /> : <ClipboardCopyIcon className="w-5 h-5 text-charcoal" />}
                        </button>
                    </div>
                )}
            </div>

            {/* Part 2: Paste and Load Code */}
            <div className="bg-white/80 p-4 rounded-lg">
                <h3 className="font-serif text-xl text-rose-gold">2. Use Your Magic Code</h3>
                <p className="font-sans text-sm text-gray-700 mb-3">On the new version of the app, paste your code here to restore progress.</p>
                <textarea 
                    value={pasteCode}
                    onChange={(e) => setPasteCode(e.target.value)}
                    placeholder="Paste your magic code here..."
                    className="w-full h-24 p-2 font-mono text-xs bg-blush border border-rose-gold/50 rounded-md resize-none mb-2"
                />
                <button onClick={handleLoadProgress} className="w-full font-sans bg-gold-leaf text-white p-2 rounded-lg hover:bg-opacity-80 transition">
                    Load Our Progress
                </button>
            </div>
        </div>
      </div>
    </div>
  );
};

export default SyncProgressModal;
