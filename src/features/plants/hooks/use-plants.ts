import { useEffect, useState } from 'react';

import { getErrorMessage } from '@/lib/utils';
import { plantsService } from '@/services/plants.service';
import type { Plant } from '@/types/models';

export function usePlants() {
  const [plants, setPlants] = useState<Plant[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    plantsService
      .listPlants()
      .then((data) => active && setPlants(data))
      .catch((e) => active && setError(getErrorMessage(e)))
      .finally(() => active && setIsLoading(false));
    return () => {
      active = false;
    };
  }, []);

  return { plants, isLoading, error };
}
