
import { Task, Reward, TaskType, RewardType } from '../types';

export const TASKS: Task[] = [

  {
    id: 't5',
    title: 'Spreading Positivity',
    description: 'Give 1 compliment to each family member, it can be anything like telling Nada how well she draws or telling Kakak how hard she worked for degree, etc.',
    type: TaskType.DAILY,
    duration: 2,
    points: 20,
  },

  {
    id: 't1',
    title: 'Say meow 5 times in chat',
    description: 'welp as the title says',
    type: TaskType.DAILY,
    duration: 1,
    points: 10,
  },
  {
    id: 't2',
    title: 'A drawing of us',
    description: 'Draw yourself in gojo pose and me in sukuna pose together',
    type: TaskType.ONCE,
    duration: 1,
    points: 100,
  }
];

export const REWARDS: Reward[] = [
  {
    id: 'r1',
    title: 'A drawing of you',
    type: RewardType.TEXT,
    content: "A drawing of you made by me.",
    cost: 50,
  },
  {
    id: 'r2',
    title: 'A website',
    type: RewardType.TEXT,
    content: "A website made for my jaan with love",
    cost: 500,
  },
  {
    id: 'r5',
    title: 'A Video ',
    type: RewardType.TEXT,
    content: 'A video of me doing dual jerk-off workout',
    cost: 150,
  }

];
