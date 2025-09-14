export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export const PaginationData = (
  skip: number,
  take: number,
  total: number,
): PaginationMeta => {
  const page = Math.floor(skip / take) + 1;
  const totalPages = Math.ceil(total / take);

  return {
    page,
    limit: take,
    total,
    totalPages,
    hasNextPage: skip + take < total,
    hasPreviousPage: skip > 0,
  };
};
