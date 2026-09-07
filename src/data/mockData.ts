import { TelemetryState, CropZoneItem, AlertLogItem, SensorTrendPoint, MissionLogItem } from '../types';

export const ASSETS = {
  logo: 'https://lh3.googleusercontent.com/aida/AEtjO1XEzNZQlAp38wfSTLdMGd8Be7uEKlWxLD94hAdJKEHbiGzTFr-fsvVxfXZ_bBEZvdJGUBbDNDZ4NlNrwOtWfds_W_ULsPcAVux_dZbyJhUPIg_yogxjykwtauWSXpTWBlDRduNDgeo2g2nPTUmKZHMnFnVU-IHwzOeztEZpK23yUpKszRfH3iGXcsyCwA70UYc2yChTwGSnV1QVvtPJxywrJmU66TKanu2_zBSxJOIOmQvp_ARuLMvxoj4',
  profile: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAwI2GBcUz7rHtWX7XvMOhLONpXTQwMsEQZne5D9z1MF2XyTNudCZsYLb--e7gXlJD-fkszkSwfYbIJtDFv6vmNq4N7tTjF_EGBa_QQJ7SuMS9kUYFh23HlUe_cf-l_fS74GuXJpkngK_oS6O47d6yOiG45ySIIwsCbAkztbZXd20S6DOsBkwJK3iXW-VFuq661Dtdz8K-kAjhEwyHwQgq12reme5b2o68mTENtaM-jT5Km8-d2HiUB',
  opticalCam: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBM_kQm4tuvBa477fiXwUhMpOVLaCFZp0KLPUHXZP5UQdSulfU-24yTSoppxaNPkXHSyKHAzcFnqAy7faPt0clgG0-3Klq2UJ9G96nGqBcKb-RjmQ-wOyuxosBN33iw0CsPJBi4klQbhRXXZcEVJWrRllngcEPp37y3uoUUOTD6mInyv3ieU14u7-cq32mHDsuInNzrp1PslGO0xFy3mjxB_E9aZ3ibTXftzBFCiQ-JuQ0X-aWzo6Ju',
  wheat: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAKgOp7wOr0EcuinPuEYdJydZTY8nG1bHbWR4ki3d1q7x8qTmFXiemAFLlmEWyXG65xp1ncCtSY8yG6s4Bd7kUKfaXJjmojDCCIcOQyn3LKBo1eBrEI9dHFau_0o-uKmcMi-a70t_ZuKxjKQgkNr14foP0nPA4v2pIhZLvyV3vgwazS6MWPtCkMwv2sfq_h_ufH9InYNNVIVBIop27i9HVRDpS2hSM3OZcJuF8Ju_SIeL-6rYGI4lDt',
  mustard: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDhRctAjMDoozROzxPIDZ8AqXSzgjBfmhU98fAVk5WBr_nF0HBuk7ED3nE3W6kaggdA-xwdA3g-joSAFVUwkDX23SOfwyRZBvkRkzqKsVCVAgpOLMG-rZ8YqUNkPyBcN70jmRYCLb_W-YyFvpVP_9dp_0t44v2UmhvDNJEAPutKyOJ-x8TL4qnLS8bzMOCGh7vPmMcufbh3aEBnYelnhwouzX9HcNeLn2kLJ91hrBQebwFJ5mg5s2yG',
  barley: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBEbn7rzV95ndp2NbV0UcgIWY5N5vBI6wc97WLPwyvP8jv-j0ZtIKDyAeV0ZJreUdPBocZ4m2NRimb68iKnsTOPUkqgXE6CPTE16YWrVOLTyvKrcY48RWlxWXXxIJ2nfnOfN2W_LxpHcDHpsXwLJamdzsAuvRVU0ro8FBBpJo4gR--79z5vFUIQvMSVyX6ubOcexO1LhY3jYq2Ga6wkW7TxjyWZnDPDwQ7bJtWm2XTllhyjkIUygC78',
};

export const INITIAL_TELEMETRY: TelemetryState = {
  roverId: 'ROVER-001',
  status: 'ONLINE',
  lastPingSec: 2,
  batteryPercent: 82,
  batteryVoltage: 12.1,
  signalStrengthDbm: -54,
  gps: {
    lat: 28.6139,
    lng: 77.2090,
    alt: 218.4,
    satellites: 8,
    accuracyM: 3.2,
  },
  speedMs: 0.8,
  soilMoistureVwc: 42.0,
  soilTempC: 27.4,
  soilPh: 6.7,
  soilEc: 1.2,
  npk: {
    n: 42,
    p: 28,
    k: 51,
  },
  cropHealthPercent: 84,
  surveyCoverAcres: 12.4,
  totalAcres: 18.2,
  motorPowerPercent: 65,
  driveMode: 'MANUAL',
  imu: {
    x: 0.12,
    y: 0.04,
    z: 9.81,
  },
  sonarFrontCm: 45,
};

export const INITIAL_CROPS: CropZoneItem[] = [
  {
    id: 'crop-1',
    cropName: 'Wheat',
    zone: 'Zone A3',
    healthPercent: 92,
    status: 'HEALTHY',
    description: 'Optimal chlorophyll response',
    imageUrl: ASSETS.wheat,
    chlorophyllIndex: 0.88,
    lastScanned: '10:41 AM',
  },
  {
    id: 'crop-2',
    cropName: 'Mustard',
    zone: 'Zone B3',
    healthPercent: 64,
    status: 'STRESSED',
    description: 'Moisture deficit warning',
    imageUrl: ASSETS.mustard,
    chlorophyllIndex: 0.54,
    lastScanned: '10:35 AM',
  },
  {
    id: 'crop-3',
    cropName: 'Barley',
    zone: 'Zone A1',
    healthPercent: 88,
    status: 'HEALTHY',
    description: 'Uniform canopy density',
    imageUrl: ASSETS.barley,
    chlorophyllIndex: 0.82,
    lastScanned: '10:28 AM',
  },
];

export const INITIAL_ALERTS: AlertLogItem[] = [
  {
    id: 'alert-1',
    title: 'Low Soil Moisture Warning',
    zone: 'Zone B3',
    detail: 'Zone B3 reached 18% VWC. Critical threshold for mustard crop flowering stage.',
    severity: 'critical',
    timestamp: '2m ago',
    acknowledged: false,
  },
  {
    id: 'alert-2',
    title: 'Foliage Stress Detected',
    zone: 'Zone C2',
    detail: 'Zone C2 multispectral image classified stress (64% NDVI Index deficit).',
    severity: 'warning',
    timestamp: '12m ago',
    acknowledged: false,
  },
  {
    id: 'alert-3',
    title: 'Subsurface Salinity Elevated',
    zone: 'Zone D1',
    detail: 'Modbus EC sensor detected 2.4 mS/cm following recent fertigation run.',
    severity: 'info',
    timestamp: '45m ago',
    acknowledged: true,
  },
  {
    id: 'alert-4',
    title: 'Obstacle Proximity Alert',
    zone: 'Sector North Trail',
    detail: 'Ultrasonic rangefinder registered rock outcrop at 30cm during grid turn.',
    severity: 'warning',
    timestamp: '1h ago',
    acknowledged: true,
  },
];

export const SOIL_TRENDS_DATA: SensorTrendPoint[] = [
  { time: '00:00', hour: 0, vwc: 44.2, temp: 22.1, ph: 6.8, ec: 1.15 },
  { time: '02:00', hour: 2, vwc: 44.0, temp: 21.4, ph: 6.8, ec: 1.16 },
  { time: '04:00', hour: 4, vwc: 43.5, temp: 20.8, ph: 6.7, ec: 1.17 },
  { time: '06:00', hour: 6, vwc: 42.8, temp: 21.5, ph: 6.7, ec: 1.18 },
  { time: '08:00', hour: 8, vwc: 41.9, temp: 24.3, ph: 6.7, ec: 1.20 },
  { time: '10:00', hour: 10, vwc: 43.1, temp: 26.8, ph: 6.7, ec: 1.21 },
  { time: '10:42', hour: 10.7, vwc: 43.2, temp: 27.4, ph: 6.7, ec: 1.20 },
  { time: '12:00', hour: 12, vwc: 40.5, temp: 29.5, ph: 6.6, ec: 1.22 },
  { time: '14:00', hour: 14, vwc: 39.2, temp: 31.0, ph: 6.6, ec: 1.24 },
  { time: '16:00', hour: 16, vwc: 41.0, temp: 28.6, ph: 6.7, ec: 1.22 },
  { time: '18:00', hour: 18, vwc: 42.4, temp: 25.7, ph: 6.7, ec: 1.19 },
  { time: '20:00', hour: 20, vwc: 43.0, temp: 23.9, ph: 6.8, ec: 1.18 },
  { time: '22:00', hour: 22, vwc: 43.8, temp: 22.8, ph: 6.8, ec: 1.16 },
];

export const INITIAL_MISSION_LOGS: MissionLogItem[] = [
  { id: 'log-1', time: '10:42', message: 'Autonomous sector survey initiated', category: 'primary' },
  { id: 'log-2', time: '10:41', message: 'RTK GNSS differential lock acquired (±1.8cm)', category: 'secondary' },
  { id: 'log-3', time: '10:40', message: 'ROVER-001 connected to ground station', category: 'neutral' },
  { id: 'log-4', time: '10:38', message: 'ESP32-CAM optical feed synchronized at 30 fps', category: 'secondary' },
  { id: 'log-5', time: '10:35', message: 'Modbus RS485 soil spectrometer calibrated', category: 'primary' },
];
