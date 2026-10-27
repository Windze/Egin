export type Language = 'ru' | 'kz' | 'en';

export interface Robot {
  id: string;
  name: string;
  model: string;
  status: 'online' | 'working' | 'charging' | 'offline';
  battery: number;
  waterLevel: number;
  fertilizerLevel: number;
  location: string;
  locationKz?: string;
  locationEn?: string;
  currentTask: {
    id: string;
    title: string;
    titleKz?: string;
    titleEn?: string;
    progress: number;
    crop: string;
    cropKz?: string;
    cropEn?: string;
    action: string;
    actionKz?: string;
    actionEn?: string;
    eta: string;
    etaKz?: string;
    etaEn?: string;
  };
  warnings?: string[];
  image: string;
  dof: number;
  firmware: string;
  lastSync: string;
  lastSyncKz?: string;
  lastSyncEn?: string;
}

export interface FieldProfile {
  id: string;
  name: string;
  nameKz?: string;
  nameEn?: string;
  sectionCode: string;
  sectionCodeKz?: string;
  sectionCodeEn?: string;
  crop: string;
  cropKz: string;
  cropEn?: string;
  areaHa: number;
  soilMoisture: number; // percentage
  ph: number;
  nitrogenPpm: number;
  phosphorusPpm: number;
  potassiumPpm: number;
  temperatureC: number;
  lastWatered: string;
  nextWatering: string;
  nextWateringKz?: string;
  nextWateringEn?: string;
  healthScore: number;
  status: 'healthy' | 'warning' | 'needs_water' | 'ready_to_harvest';
  routeProgress: number;
}

export interface PlantInfo {
  id: string;
  nameRu: string;
  nameKz: string;
  nameEn: string;
  category: 'vegetable' | 'grain' | 'berry' | 'greens';
  idealPh: string;
  moisturePercent: string;
  wateringFrequency: string;
  waterPerDayLiters: number;
  npkRatio: string;
  growthDays: number;
  stages: { name: string; durationDays: number; desc: string }[];
  pestsAndDiseases: { name: string; symptoms: string; remedy: string }[];
  akmolaRegionTip: string;
  icon: string;
  isCustom?: boolean;
}

export interface ActivityLog {
  id: string;
  robotId: string;
  robotName: string;
  timestamp: string;
  actionRu: string;
  actionKz: string;
  actionEn: string;
  severity: 'info' | 'success' | 'warning';
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant' | 'system';
  text: string;
  timestamp: string;
  suggestedAction?: {
    type: 'send_robot' | 'adjust_schedule' | 'view_plant';
    label: string;
    payload?: any;
  };
}

export interface SimTile {
  x: number;
  y: number;
  type: 'soil' | 'tilled' | 'crop' | 'path' | 'dock' | 'water';
  cropType?: string;
  growthStage?: number; // 0: seed, 1: sprout, 2: growing, 3: ripe
  moisture?: number; // 0 - 100
  needsWater?: boolean;
}

export interface SimRobot {
  id: string;
  name: string;
  x: number;
  y: number;
  targetX?: number;
  targetY?: number;
  state: 'idle' | 'moving' | 'watering' | 'harvesting' | 'charging';
  basketAttached: boolean;
  waterCarried: number;
  cropsCollected: number;
  rotation: number;
}
