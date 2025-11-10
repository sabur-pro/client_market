'use client';

import { useEffect } from 'react';
import { migrateClientTokens } from '@/lib/utils/migrateTokens';

export function TokenMigration() {
  useEffect(() => {
    migrateClientTokens();
  }, []);

  return null;
}
