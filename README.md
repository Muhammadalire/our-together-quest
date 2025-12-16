# Our Love Quests - Instructions for My Love

Hello! This guide will help you customize our special app.

## How to Update Tasks

You can add, remove, or change the quests we do.

1.  Open the file: `data/mockData.ts`
2.  Find the `TASKS` array.
3.  You can edit the existing tasks or add new ones. Each task looks like this:

    ```javascript
    {
      id: 't5', // Must be a unique ID
      title: 'New Task Title',
      description: 'A description of what to do.',
      type: TaskType.ONCE, // or TaskType.DAILY
      duration: 1, // 1 for ONCE, or number of days for DAILY
      rewardId: 'r5', // The ID of the reward to unlock
    }
    ```

## How to Update Rewards

You can also change the surprises!

1.  Open the file: `data/mockData.ts`
2.  Find the `REWARDS` array.
3.  Edit or add new rewards. Each reward looks like this:

    ```javascript
    {
      id: 'r5', // Must be a unique ID that matches a task's rewardId
      title: 'A New Surprise',
      type: RewardType.TEXT, // Can be TEXT, IMAGE, or GEMINI_STORY
      content: "Your content here.",
    }
    ```

### Reward Types:
*   `RewardType.TEXT`: The `content` is the text that will be displayed.
*   `RewardType.IMAGE`: The `content` is a URL to an image.
*   `RewardType.GEMINI_STORY`: The `content` is a *prompt* for an AI to write a story about us.

## IMPORTANT: Personalizing the AI Stories

For the AI-generated stories to be about us, you need to set your name.

1.  Open the file: `components/RewardModal.tsx`
2.  Find this line of code:
    `generateStory(reward.content, userProgress.name, "Your Name")`
3.  Replace `"Your Name"` with your actual name in quotes. For example: `"David"`.

Khumaira's name is already set up automatically. You only need to add yours!

That's it! Your changes will appear the next time you open the app.
