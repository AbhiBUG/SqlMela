/**
 * Stats Service - Manages user statistics and scoring
 */

export const updateUserStats = (user, { scoreIncrement = 0, solvedIncrement = 0 }) => {
  if (!user) {
    return null;
  }

  user.score = (user.score || 0) + scoreIncrement;
  user.gamesPlayed = (user.gamesPlayed || 0) + (scoreIncrement > 0 || solvedIncrement > 0 ? 1 : 0);
  user.problemsSolved = (user.problemsSolved || 0) + solvedIncrement;
  user.accuracy = user.gamesPlayed > 0 
    ? Math.round((user.problemsSolved / user.gamesPlayed) * 100) 
    : 0;
  user.streak = (user.streak || 0) + 1;
  user.xp = (user.xp || 0) + scoreIncrement;

  return user;
};

export const calculateLeaderboard = (users, limit = 10) => {
  if (!Array.isArray(users)) {
    return [];
  }

  return [...users]
    .sort((a, b) => (b.score || 0) - (a.score || 0))
    .slice(0, limit)
    .map((user, index) => ({
      rank: index + 1,
      username: user.username,
      score: user.score || 0,
      gamesPlayed: user.gamesPlayed || 0,
      problemsSolved: user.problemsSolved || 0,
      accuracy: user.accuracy || 0,
      streak: user.streak || 0,
      xp: user.xp || 0,
    }));
};

export const getUserStats = (user) => {
  if (!user) {
    return null;
  }

  return {
    username: user.username,
    score: user.score || 0,
    gamesPlayed: user.gamesPlayed || 0,
    problemsSolved: user.problemsSolved || 0,
    accuracy: user.accuracy || 0,
    streak: user.streak || 0,
    xp: user.xp || 0,
  };
};

export const resetUserStats = (user) => {
  if (!user) {
    return null;
  }

  user.score = 0;
  user.gamesPlayed = 0;
  user.problemsSolved = 0;
  user.accuracy = 0;
  user.streak = 0;
  user.xp = 0;

  return user;
};
