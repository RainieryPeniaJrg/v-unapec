export type BannerEnv = {
  bannerUsername: string;
  bannerPassword: string;
  runNegative: boolean;
  runResilience: boolean;
};

function readRequiredEnv(key: string): string {
  const value = process.env[key]?.trim();
  if (!value) {
    throw new Error(
      [
        `Missing required environment variable: ${key}.`,
        'Define it in your local .env file at project root.',
        `Example: ${key}=your_value_here`,
      ].join(' '),
    );
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
