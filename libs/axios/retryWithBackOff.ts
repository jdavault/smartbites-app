// Retry helper with exponential backoff
export async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  retries = 3,
  delay = 1000
): Promise<T> {
  try {
    return await fn();
  } catch (error) {
    if (retries <= 0) throw error;
    console.warn(`Retrying in ${delay}ms... (${retries} retries left)`);
    await new Promise((res) => setTimeout(res, delay));
    return retryWithBackoff(fn, retries - 1, delay);
  }
}
