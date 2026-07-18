import { UserPaginator, OpportunityPaginator } from '@/types';

interface Paginator {
  page: number;
  first_page_url: string;
  from: number;
  last_page: number;
  last_page_url: string;
  links: any[];
  next_page_url: string | null;
  path: string;
  items_per_page: number;
  prev_page_url: string | null;
  to: number;
  count: number;
  data?: any[];
}

export const mapPaginatorData = (obj: Paginator | undefined) => {
  if (!obj) return null;
  const { data, ...formattedValues } = obj;
  return {
    ...formattedValues,
    hasMorePages: formattedValues.last_page !== formattedValues.page,
    firstItem: formattedValues.from,
    lastItem: formattedValues.to,
  };
};

export const mapUserPaginatorData = (obj: UserPaginator | undefined) => {
  if (!obj) return null;
  const { data, ...formattedValues } = obj;
  return {
    ...formattedValues,
    hasMorePages: formattedValues.last_page !== formattedValues.page,
    firstItem: formattedValues.from,
    lastItem: formattedValues.to,
  };
};

export const mapOpportunityPaginatorData = (obj: OpportunityPaginator | undefined) => {
  if (!obj) return null;
  const { data, ...formattedValues } = obj;
  return {
    ...formattedValues,
    hasMorePages: formattedValues.last_page !== formattedValues.page,
    firstItem: formattedValues.from,
    lastItem: formattedValues.to,
  };
};