import { useQuery, UseQueryOptions } from '@tanstack/react-query';

/**
 * Shared hook cho moi trang goi n8n webhook.
 * Thay the pattern useState/useEffect + fetch thu cong dang lap lai o nhieu trang.
 *
 * Vi du:
 *   const { data, isLoading, isError, error, refetch } = useN8nQuery(
 *     ['dashboard-status'],
 *     () => fetchDashboardStatus().then(r => r.json())
 *   );
 */
export function useN8nQuery<TData>(
  queryKey: readonly unknown[],
  fetchFn: () => Promise<TData>,
  options?: Omit<UseQueryOptions<TData, Error>, 'queryKey' | 'queryFn'>
) {
  return useQuery<TData, Error>({
    queryKey,
    queryFn: fetchFn,
    retry: 1,
    staleTime: 15_000,
    refetchInterval: options?.refetchInterval ?? 30_000,
    ...options,
  });
}
