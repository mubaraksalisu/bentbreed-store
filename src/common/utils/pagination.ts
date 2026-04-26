export interface PaginationQuery {
  page?: number;
  limit?: number;
}

export const getPagination = (query: any) => {
  const page = Math.max(parseInt(query.page) || 1, 1);
  const limit = Math.min(Math.max(parseInt(query.limit) || 10, 1), 100);

  const skip = (page - 1) * limit;

  return { page, limit, skip };
};
