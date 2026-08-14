import { loadUsers, saveUsers, getUserByUsername, verifyUserCredentials } from "../utils/fileUtils.js";

/**
 * User Model - Manages user data and operations
 */

let usersCache = [];

export const initializeUsers = () => {
  usersCache = loadUsers();
  return usersCache;
};

export const getAllUsers = () => {
  return usersCache;
};

export const getUserById = (id) => {
  return usersCache.find((u) => u.id === id);
};

export const getUserByUsernameModel = (username) => {
  return getUserByUsername(usersCache, username);
};

export const validateUserCredentials = (username, password) => {
  return verifyUserCredentials(usersCache, username, password);
};

export const createUser = (userData) => {
  const newUser = {
    id: Date.now().toString(),
    username: userData.username,
    password: userData.password,
    name: userData.name || userData.username,
    role: userData.role || 'user',
    score: 0,
    gamesPlayed: 0,
    problemsSolved: 0,
    accuracy: 0,
    streak: 0,
    xp: 0,
    createdAt: new Date().toISOString(),
  };

  usersCache.push(newUser);
  saveUsers(usersCache);
  
  return newUser;
};

export const updateUser = (username, updates) => {
  const user = getUserByUsername(usersCache, username);
  
  if (!user) {
    return null;
  }

  Object.assign(user, updates);
  saveUsers(usersCache);
  
  return user;
};

export const deleteUser = (username) => {
  const index = usersCache.findIndex((u) => u.username === username);
  
  if (index === -1) {
    return false;
  }

  usersCache.splice(index, 1);
  saveUsers(usersCache);
  
  return true;
};

export const refreshUsersFromFile = () => {
  usersCache = loadUsers();
  return usersCache;
};
