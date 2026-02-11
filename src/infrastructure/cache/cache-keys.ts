export const CACHE_KEYS = {
  // Auth
  USER_BY_ID: (id: string) => `user:${id}`,
  USER_BY_EMAIL: (email: string) => `user:email:${email}`,
  USER_SESSION: (sessionId: string) => `session:${sessionId}`,
  USER_PERMISSIONS: (userId: string) => `user:${userId}:permissions`,

  // Animals
  ANIMAL_BY_ID: (id: string) => `animal:${id}`,
  ANIMAL_BY_EARRING: (earring: string) => `animal:earring:${earring}`,
  ANIMALS_LIST: (ranchId: string, page: number) => `animals:ranch:${ranchId}:page:${page}`,
  ANIMALS_COUNT: (ranchId: string) => `animals:ranch:${ranchId}:count`,

  // Lots
  LOT_BY_ID: (id: string) => `lot:${id}`,
  LOTS_LIST: (ranchId: string) => `lots:ranch:${ranchId}`,

  // Events
  EVENTS_LIST: (animalId: string) => `events:animal:${animalId}`,

  // Health
  HEALTH_RECORDS: (animalId: string) => `health:animal:${animalId}`,

  // Reproduction
  REPRODUCTION_RECORDS: (animalId: string) => `reproduction:animal:${animalId}`,

  // SENASAG
  SENASAG_DOCUMENTS: (ranchId: string) => `senasag:ranch:${ranchId}`,

  // Finance
  FINANCE_SUMMARY: (ranchId: string) => `finance:ranch:${ranchId}:summary`,
  FINANCE_TRANSACTIONS: (ranchId: string, page: number) => `finance:ranch:${ranchId}:transactions:page:${page}`,

  // Dashboard / Materialized Views
  DASHBOARD_STATS: (ranchId: string) => `dashboard:ranch:${ranchId}:stats`,
  MATERIALIZED_VIEWS_LAST_REFRESH: 'materialized_views:last_refresh',

  // Patterns for invalidation
  PATTERNS: {
    USER: (id: string) => `user:${id}*`,
    ANIMAL: (id: string) => `animal:${id}*`,
    ANIMALS_RANCH: (ranchId: string) => `animals:ranch:${ranchId}*`,
    LOT: (id: string) => `lot:${id}*`,
    LOTS_RANCH: (ranchId: string) => `lots:ranch:${ranchId}*`,
    EVENTS_ANIMAL: (animalId: string) => `events:animal:${animalId}*`,
    HEALTH_ANIMAL: (animalId: string) => `health:animal:${animalId}*`,
    FINANCE_RANCH: (ranchId: string) => `finance:ranch:${ranchId}*`,
    DASHBOARD_RANCH: (ranchId: string) => `dashboard:ranch:${ranchId}*`,
    ALL: '*',
  },
} as const;

export const CACHE_TTL = {
  /** 5 minutes */
  SHORT: 300,
  /** 15 minutes */
  MEDIUM: 900,
  /** 1 hour */
  LONG: 3600,
  /** 6 hours */
  VERY_LONG: 21600,
  /** 24 hours */
  DAY: 86400,
  /** 7 days */
  WEEK: 604800,
  /** Session TTL - 8 hours */
  SESSION: 28800,
} as const;
