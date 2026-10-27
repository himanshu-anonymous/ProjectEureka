export interface DistrictPointsLost {
  district: string;
  districtMr: string;
  volumeLost: number;
  speedLost: number;
  sentimentLost: number;
  crisisLost: number;
  totalLost: number;
  totalScore: number;
  highlightNote?: string;
}

export const POINTS_LOST_DATA: DistrictPointsLost[] = [
  {
    district: 'Thane',
    districtMr: 'ठाणे',
    volumeLost: 0.0,
    speedLost: 0.0,
    sentimentLost: 3.25,
    crisisLost: 0.0,
    totalLost: 3.25,
    totalScore: 96.75,
  },
  {
    district: 'Raigad',
    districtMr: 'रायगड',
    volumeLost: 0.8,
    speedLost: 1.5,
    sentimentLost: 4.8,
    crisisLost: 0.5,
    totalLost: 7.6,
    totalScore: 92.4,
  },
  {
    district: 'Palghar',
    districtMr: 'पालघर',
    volumeLost: 1.2,
    speedLost: 0.9,
    sentimentLost: 6.0,
    crisisLost: 2.75,
    totalLost: 10.85,
    totalScore: 89.15,
  },
  {
    district: 'Ratnagiri',
    districtMr: 'रत्नागिरी',
    volumeLost: 2.5,
    speedLost: 3.0,
    sentimentLost: 4.2,
    crisisLost: 3.5,
    totalLost: 13.2,
    totalScore: 86.8,
  },
  {
    district: 'Sindhudurg',
    districtMr: 'सिंधुदुर्ग',
    volumeLost: 9.08,
    speedLost: 1.0,
    sentimentLost: 5.0,
    crisisLost: 0.0,
    totalLost: 15.08,
    totalScore: 84.92,
    highlightNote: 'Volume Gap (-9.08 pts due to geographical dispatch delays)',
  },
];
