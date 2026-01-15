import { getCurrentUser } from '@/services/auth.service';
import { useQuery } from '@tanstack/react-query';
const useAuth = () => {
    const { data, isLoading, isError } = useQuery({
        queryKey: ['currentUser'],
        queryFn: getCurrentUser, 
        retry: 0,
    });    

    return {
        isAuthenticated: !!data?.data, 
        isLoading,
        user: data?.data || null,
    };
};

export default useAuth;