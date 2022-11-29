export function getUpidByUrl(ctx) {
  const route = ctx.$route;
  const { query } = route;
  if (query && query['upid']) {
    return query['upid'];
  }
  return '';
}