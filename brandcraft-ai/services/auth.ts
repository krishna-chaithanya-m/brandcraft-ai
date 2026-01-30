
import { User } from '../types';

const USERS_KEY = 'brandcraft_users_db';
const SESSION_KEY = 'brandcraft_current_session';

export const getStoredUsers = (): User[] => {
  const users = localStorage.getItem(USERS_KEY);
  return users ? JSON.parse(users) : [];
};

export const registerUser = (userData: Omit<User, 'id'>): { success: boolean; message: string; user?: User } => {
  const users = getStoredUsers();
  if (users.find(u => u.email === userData.email)) {
    return { success: false, message: 'Email already registered' };
  }
  
  const newUser: User = {
    ...userData,
    id: Date.now().toString()
  };
  
  localStorage.setItem(USERS_KEY, JSON.stringify([...users, newUser]));
  return { success: true, message: 'Registration successful', user: newUser };
};

export const loginUser = (email: string, password?: string): { success: boolean; message: string; user?: User } => {
  const users = getStoredUsers();
  const user = users.find(u => u.email === email && u.password === password);
  
  if (user) {
    const { password: _, ...sessionUser } = user;
    localStorage.setItem(SESSION_KEY, JSON.stringify(sessionUser));
    return { success: true, message: 'Login successful', user: sessionUser as User };
  }
  
  return { success: false, message: 'Invalid email or password' };
};

export const getCurrentSession = (): User | null => {
  const session = localStorage.getItem(SESSION_KEY);
  return session ? JSON.parse(session) : null;
};

export const logout = () => {
  localStorage.removeItem(SESSION_KEY);
};
