import { useQuery } from '@tanstack/react-query';
import { getMe } from '@/api/users';
import { useAuth } from '@/lib/auth-context';

export const useMe = () => {
  const { token } = useAuth();

  return useQuery({
    queryKey: ['me'],
    queryFn: getMe,
    enabled: !!token, // Only fetch user data if a token exists
    staleTime: 5 * 60 * 1000, // Cache user data for 5 minutes
    retry: false, // Don't retry on failure (e.g., if the token is invalid)
  });
};
