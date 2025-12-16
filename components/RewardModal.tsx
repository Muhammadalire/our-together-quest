
import React, { useState, useEffect } from 'react';
import { Reward, RewardType, UserProgress } from '../types';
import { generateStory } from '../services/geminiService';
import { GiftIcon } from './icons';

interface RewardModalProps {
  reward: Reward | null;
  onClose: () => void;
  userProgress: UserProgress;
}

const RewardModal: React.FC<RewardModalProps> = ({ reward, onClose, userProgress }) => {
  const [content, setContent] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (reward) {
      if (reward.type === RewardType.GEMINI_STORY) {
        setIsLoading(true);
        // NOTE TO DEVELOPER:
        // Replace "Your Name" with your actual name for a personalized story.
        generateStory(reward.content, userProgress.name, "Your Name")
          .then(story => {
            setContent(story);
            setIsLoading(false);
          });
      } else {
        setContent(reward.content);
        setIsLoading(false);
      }
    }
  }, [reward, userProgress.name]);

  if (!reward) return null;

  return (
    <div 
      className="fixed inset-0 bg-charcoal bg-opacity-70 flex items-center justify-center z-50 p-4 transition-opacity duration-300"
      onClick={onClose}
    >
      <div 
        className="bg-cream rounded-2xl shadow-2xl p-6 md:p-8 w-full max-w-lg text-charcoal transform scale-95 hover:scale-100 transition-transform duration-300 relative"
        onClick={e => e.stopPropagation()}
      >
        <button onClick={onClose} className="absolute top-4 right-4 text-charcoal hover:text-rose-gold transition-colors text-2xl">&times;</button>
        <div className="text-center mb-4">
            <GiftIcon className="w-12 h-12 mx-auto text-gold-leaf" />
            <h2 className="font-serif text-3xl md:text-4xl mt-2 text-rose-gold">{reward.title}</h2>
        </div>
        
        {isLoading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rose-gold mx-auto"></div>
            <p className="mt-4 font-sans">Unwrapping your surprise...</p>
          </div>
        ) : (
          <div className="font-sans text-base md:text-lg leading-relaxed max-h-[60vh] overflow-y-auto pr-2">
            {reward.type === RewardType.IMAGE ? (
              <img src={content} alt={reward.title} className="rounded-lg w-full h-auto object-cover shadow-md" />
            ) : (
              <p style={{ whiteSpace: 'pre-wrap' }}>{content}</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default RewardModal;
   