import { useState, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { useAuth } from './useAuth';
import * as messageService from '../services/messageService';

export const useUnreadMessages = () => {
  const { token } = useAuth();
  const [unreadCount, setUnreadCount] = useState(0);

  const fetchUnread = useCallback(async () => {
    if (!token) return;
    try {
      const data = await messageService.listMessages(token);
      const rawMessages = data.messages || data;
      const unread = rawMessages.filter((m) => !m.read_by_owner).length;
      setUnreadCount(unread);
    } catch (err) {
      console.error('Failed to fetch unread badge count:', err);
    }
  }, [token]);

  useFocusEffect(
    useCallback(() => {
      fetchUnread();
    }, [fetchUnread])
  );

  return unreadCount;
};