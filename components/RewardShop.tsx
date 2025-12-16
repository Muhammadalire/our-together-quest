import React from 'react';
import { Reward, UserProgress } from '../types';
import { HeartIcon, LockIcon, GiftIcon } from './icons';

interface RewardShopProps {
    rewards: Reward[];
    userProgress: UserProgress;
    onPurchase: (reward: Reward) => void;
    onOpen: (reward: Reward) => void;
}

const RewardShop: React.FC<RewardShopProps> = ({ rewards, userProgress, onPurchase, onOpen }) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {rewards.map(reward => {
                const isPurchased = userProgress.unlockedRewards.includes(reward.id);
                const canAfford = userProgress.points >= reward.cost;

                return (
                    <div
                        key={reward.id}
                        className={`relative p-5 rounded-xl shadow-md transition-all duration-300 flex flex-col justify-between h-56 ${isPurchased
                                ? 'bg-gold-leaf/20 border-2 border-gold-leaf'
                                : 'bg-white/80'
                            }`}
                    >
                        <div className="text-center">
                            {isPurchased ? (
                                <GiftIcon className="w-12 h-12 text-gold-leaf mx-auto mb-2" />
                            ) : (
                                <LockIcon className={`w-12 h-12 mx-auto mb-2 ${canAfford ? 'text-rose-gold' : 'text-gray-400'}`} />
                            )}

                            <h3 className="font-serif text-xl text-charcoal mb-1">{reward.title}</h3>
                            <div className="flex items-center justify-center space-x-1 text-rose-gold font-bold">
                                <HeartIcon className="w-4 h-4" />
                                <span>{reward.cost}</span>
                            </div>
                        </div>

                        <div className="mt-4">
                            {isPurchased ? (
                                <button
                                    onClick={() => onOpen(reward)}
                                    className="w-full bg-gold-leaf text-white font-bold py-2 px-4 rounded-lg hover:bg-opacity-90 transition-all shadow-sm"
                                >
                                    Open Reward
                                </button>
                            ) : (
                                <button
                                    onClick={() => onPurchase(reward)}
                                    disabled={!canAfford}
                                    className={`w-full font-bold py-2 px-4 rounded-lg transition-all shadow-sm ${canAfford
                                            ? 'bg-rose-gold text-white hover:bg-opacity-90'
                                            : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                        }`}
                                >
                                    {canAfford ? 'Purchase' : 'Not enough hearts'}
                                </button>
                            )}
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default RewardShop;
