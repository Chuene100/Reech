import type {
  Opportunity,
  OpportunityPaginator,
  OpportunityQueryOptions,
} from '@/types';
import { useInfiniteQuery, useQuery } from 'react-query';
import client from './client';
import { API_ENDPOINTS } from './client/api-endpoints';
import { mapOpportunityPaginatorData } from './utils/data-mapper';

export function useOpps(options: Partial<OpportunityQueryOptions>) {
  const {
    data, 
    isLoading, 
    error,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
  } = useInfiniteQuery<OpportunityPaginator, Error>(
    [API_ENDPOINTS.OPPORTUNITIES, options],
    ({queryKey, pageParam}) => 
      client.opportunities.all(Object.assign({}, queryKey[1], pageParam)),
    {
      getNextPageParam: ({ page }) => ({ page: page + 1 }),
    }
  );

  function handleLoadMore() {
    fetchNextPage();
  }

  return {
    opportunities: data?.pages.flatMap((page) => page.data) ?? [],
    paginatorInfo: Array.isArray(data?.pages)
      ? mapOpportunityPaginatorData(data?.pages[data.pages.length - 1])
      : null,
    isLoading,
    error,
    isFetching,
    isLoadingMore: isFetchingNextPage,
    loadMore: handleLoadMore,
    hasMore: Boolean(hasNextPage),
  };
}

  
  