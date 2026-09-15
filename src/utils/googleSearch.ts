// Free-forever Google integration: cross-verify any tax result against the
// open web. Plain share links — no API keys, no quotas, no cost.
export function googleSearchUrl(query: string): string {
  return `https://www.google.com/search?q=${encodeURIComponent(query.trim().slice(0, 200))}`;
}

export function gstRateSearchUrl(hsnSac: string, product: string, rate: number): string {
  return googleSearchUrl(`HSN ${hsnSac} ${product} GST rate ${rate}% CBIC notification site:cbic.gov.in`);
}

export function notificationSearchUrl(notificationNo: string | undefined, title: string): string {
  if (!notificationNo || /awaiting|pending/i.test(notificationNo)) {
    return googleSearchUrl(`${title} GST Council recommendation press release`);
  }
  return googleSearchUrl(`${notificationNo} ${title} CBIC gazette notification`);
}
