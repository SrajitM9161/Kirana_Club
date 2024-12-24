let cache = null; 
let lastFetchTime = null; 
const CACHE_EXPIRATION_TIME = 5 * 60 * 1000; 

export const fetchContests = async () => {
  if (cache && Date.now() - lastFetchTime < CACHE_EXPIRATION_TIME) {
    console.log('Returning cached contests');
    return cache;
  }

  try {
    const response = await fetch('https://codeforces.com/api/contest.list');
    const data = await response.json();

    if (data.status === 'OK') {
      cache = data.result;
      lastFetchTime = Date.now();
      return data.result;
    } else {
      throw new Error(data.comment || 'Failed to fetch contests');
    }
  } catch (error) {
    console.error('Error fetching contests:', error);

    if (cache) {
      console.log('Returning stale cached contests due to an error');
      return cache;
    }
    return [];
  }
};
