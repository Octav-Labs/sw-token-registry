function getBasicAuthAuthorizationHeader(username: string, password: string) {
  return `Basic ${Buffer.from(`${username}:${password}`).toString('base64')}`;
}

export default function urlToUrlWithHeaders(url: string) {
  const nUrl = new URL(url);
  const isBasicAuth =
    nUrl.username &&
    nUrl.username !== '' &&
    nUrl.password &&
    nUrl.password !== '';

  const headers: { Authorization?: string } = isBasicAuth
    ? {
        Authorization: getBasicAuthAuthorizationHeader(
          nUrl.username,
          nUrl.password
        ),
      }
    : {};

  return {
    url: `${nUrl.origin}${nUrl.pathname}${nUrl.search}`,
    headers,
  };
}
