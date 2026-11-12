import type { GardenBed } from '@/types/models';

/** The six CUIA rooftop beds shown in design-references (Farm overview, Garden beds). */
export const mockBeds: GardenBed[] = [
  { id: 'bed-01', code: 'B-01', cropName: 'Butterhead Lettuce', status: 'healthy', soilMoisture: 62, temperature: 29.2 },
  { id: 'bed-02', code: 'B-02', cropName: 'Cherry Tomato', status: 'healthy', soilMoisture: 58, temperature: 29.8 },
  { id: 'bed-03', code: 'B-03', cropName: 'Curly Kale', status: 'attention', soilMoisture: 24, temperature: 31.6 },
  { id: 'bed-04', code: 'B-04', cropName: 'Sweet Basil', status: 'healthy', soilMoisture: 66, temperature: 29.0 },
  { id: 'bed-05', code: 'B-05', cropName: 'Siling Labuyo', status: 'offline', soilMoisture: null, temperature: null },
  { id: 'bed-06', code: 'B-06', cropName: 'Eggplant', status: 'attention', soilMoisture: 31, temperature: 32.2 },
];
