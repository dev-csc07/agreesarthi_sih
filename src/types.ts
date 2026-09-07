export type NavigationTab = 'overview' | 'rover' | 'map' | 'sensors' | 'alerts' | 'menu';

export interface TelemetryState {
  roverId: string;
  status: 'ONLINE' | 'OFFLINE' | 'BUSY' | 'RTH' | 'ESTOP';
  lastPingSec: number;
  batteryPercent: number;
  batteryVoltage: number;
  signalStrengthDbm: number;
  gps: {
    lat: number;
    lng: number;
    alt: number;
    satellites: number;
    accuracyM: number;
  };
  speedMs: number;
  soilMoistureVwc: number; // percentage
  soilTempC: number;
  soilPh: number;
  soilEc: number; // mS/cm
  npk: {
    n: number; // mg/kg
    p: number;
    k: number;
  };
  cropHealthPercent: number;
  surveyCoverAcres: number;
  totalAcres: number;
  motorPowerPercent: number;
  driveMode: 'MANUAL' | 'AUTO';
  imu: {
    x: number;
    y: number;
    z: number;
  };
  sonarFrontCm: number;
}

export interface CropZoneItem {
  id: string;
  cropName: string;
  zone: string;
  healthPercent: number;
  status: 'HEALTHY' | 'STRESSED' | 'OPTIMAL' | 'ATTENTION';
  description: string;
  imageUrl: string;
  chlorophyllIndex: number;
  lastScanned: string;
}

export interface AlertLogItem {
  id: string;
  title: string;
  zone: string;
  detail: string;
  severity: 'critical' | 'warning' | 'info';
  timestamp: string;
  acknowledged: boolean;
}

export interface SensorTrendPoint {
  time: string;
  hour: number;
  vwc: number;
  temp: number;
  ph: number;
  ec: number;
}

export interface MissionLogItem {
  id: string;
  time: string;
  message: string;
  category: 'primary' | 'secondary' | 'neutral' | 'warning';
}
