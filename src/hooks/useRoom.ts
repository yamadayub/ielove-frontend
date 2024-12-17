import { useState, useEffect } from 'react';
import { Room } from '../types';
import { mockApi } from '../utils/mockApi';

export const useRoom = (propertyId: string, roomId: string) => {
  const [room, setRoom] = useState<Room | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRoom = async () => {
      try {
        const response = await mockApi.getRoom(propertyId, roomId);
        setRoom(response.data);
      } catch (err) {
        setError('Failed to fetch room');
        console.error('Failed to fetch room:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRoom();
  }, [propertyId, roomId]);

  const updateRoom = async (data: Partial<Room>) => {
    try {
      const response = await mockApi.updateRoom(propertyId, roomId, data);
      setRoom(response.data);
      return response.data;
    } catch (err) {
      setError('Failed to update room');
      console.error('Failed to update room:', err);
      throw err;
    }
  };

  return {
    room,
    isLoading,
    error,
    updateRoom,
  };
};