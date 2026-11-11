import { isoDaysAgo } from '@/lib/utils';
import type { Plant } from '@/types/models';

export const mockPlants: Plant[] = [
  {
    id: 'plant-1',
    name: 'Basil',
    species: 'Ocimum basilicum',
    location: 'Kitchen window',
    wateringIntervalDays: 2,
    lastWateredAt: isoDaysAgo(1),
    moisture: 62,
  },
  {
    id: 'plant-2',
    name: 'Tomato',
    species: 'Solanum lycopersicum',
    location: 'Balcony',
    wateringIntervalDays: 1,
    lastWateredAt: isoDaysAgo(2),
    moisture: 28,
  },
  {
    id: 'plant-3',
    name: 'Snake Plant',
    species: 'Dracaena trifasciata',
    location: 'Living room',
    wateringIntervalDays: 14,
    lastWateredAt: isoDaysAgo(6),
    moisture: null,
  },
];
