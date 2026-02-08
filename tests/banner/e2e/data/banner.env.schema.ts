export type BannerEnv = {
  bannerUsername: string;
  bannerPassword: string;
  runNegative: boolean;
  runResilience: boolean;
};

function readRequiredEnv(key: string): string {
  const value = process.env[key]?.trim();
  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value;
}

export function getBannerEnv(): BannerEnv {
  return {
    bannerUsername: readRequiredEnv('BANNER_USERNAME'),
    bannerPassword: readRequiredEnv('BANNER_PASSWORD'),
    runNegative: process.env.BANNER_RUN_NEGATIVE === 'true',
    runResilience: process.env.BANNER_RUN_RESILIENCE === 'true',
  };
}
