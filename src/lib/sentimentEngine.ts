export interface SentimentChannelBreakdown {
  printOcr: number; // 0-100%
  broadcastTv: number; // 0-100%
  socialListening: number; // 0-100%
  userComments: number; // 0-100%
  composite: number; // 0-100%
}

export interface SentimentWeights {
  printOcr: number;
  broadcastTv: number;
  socialListening: number;
  userComments: number;
}

export const SENTIMENT_WEIGHTS: SentimentWeights = {
  printOcr: 0.35, // 35% Print Media OCR
  broadcastTv: 0.25, // 25% Broadcast TV Telemetry
  socialListening: 0.25, // 25% Social Listening Data
  userComments: 0.15, // 15% Public / Citizen Comments
};

export function computeCompositeSentiment(
  channels: Omit<SentimentChannelBreakdown, 'composite'>,
  weights: SentimentWeights = SENTIMENT_WEIGHTS
): number {
  const composite =
    channels.printOcr * weights.printOcr +
    channels.broadcastTv * weights.broadcastTv +
    channels.socialListening * weights.socialListening +
    channels.userComments * weights.userComments;
  return Number(composite.toFixed(1));
}

export const DISTRICT_SENTIMENT_DATA: Record<string, Omit<SentimentChannelBreakdown, 'composite'>> = {
  thane: {
    printOcr: 85,
    broadcastTv: 82,
    socialListening: 81,
    userComments: 76,
  },
  raigad: {
    printOcr: 78,
    broadcastTv: 76,
    socialListening: 75,
    userComments: 73,
  },
  palghar: {
    printOcr: 74,
    broadcastTv: 71,
    socialListening: 70,
    userComments: 66,
  },
  ratnagiri: {
    printOcr: 70,
    broadcastTv: 69,
    socialListening: 67,
    userComments: 63,
  },
  sindhudurg: {
    printOcr: 76,
    broadcastTv: 74,
    socialListening: 74,
    userComments: 70,
  },
};

export const STATEWIDE_BASE_CHANNELS: Record<string, Omit<SentimentChannelBreakdown, 'composite'>> = {
  'Last 7 days': {
    printOcr: 71.0,
    broadcastTv: 68.5,
    socialListening: 70.2,
    userComments: 64.8,
  },
  'Last 30 days': {
    printOcr: 74.2,
    broadcastTv: 71.0,
    socialListening: 72.8,
    userComments: 67.5,
  },
  'Last 90 days': {
    printOcr: 76.5,
    broadcastTv: 74.0,
    socialListening: 75.0,
    userComments: 70.2,
  },
};

export function getDistrictSentiment(districtId?: string, timeRange: string = 'Last 7 days'): SentimentChannelBreakdown {
  const normId = (districtId || '').toLowerCase();
  const rawChannels = DISTRICT_SENTIMENT_DATA[normId] || STATEWIDE_BASE_CHANNELS[timeRange] || STATEWIDE_BASE_CHANNELS['Last 7 days'];

  // Apply minor temporal scaling based on period if district specified
  let scale = 1.0;
  if (timeRange === 'Last 30 days') scale = 1.02;
  else if (timeRange === 'Last 90 days') scale = 1.04;

  const scaled = {
    printOcr: Math.min(100, Number((rawChannels.printOcr * (districtId ? scale : 1)).toFixed(1))),
    broadcastTv: Math.min(100, Number((rawChannels.broadcastTv * (districtId ? scale : 1)).toFixed(1))),
    socialListening: Math.min(100, Number((rawChannels.socialListening * (districtId ? scale : 1)).toFixed(1))),
    userComments: Math.min(100, Number((rawChannels.userComments * (districtId ? scale : 1)).toFixed(1))),
  };

  const composite = computeCompositeSentiment(scaled);
  return {
    ...scaled,
    composite,
  };
}
