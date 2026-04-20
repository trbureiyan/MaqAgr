import { apiClient } from '../lib/apiClient';

const REMOTE_RECOMMENDATION_API_ENABLED = import.meta.env.VITE_ENABLE_REMOTE_RECOMMENDATION_API === 'true';

// Mocks
const generateMockRecommendation = async () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        data: {
          queryId: 999,
          implement: { id: 1, name: 'Arado Mock', brand: 'MockBrand', powerRequirementHp: 80 },
          terrain: { id: 1, name: 'Terreno Mock', soilType: 'clay', slopePercentage: 10 },
          powerRequirement: { minimumPowerHp: 85, calculatedPowerHp: 90 },
          recommendations: [
            {
              rank: 1,
              tractor: { id: 1, name: 'Tractor Mock 1', brand: 'Brand A', enginePowerHp: 95 },
              score: { total: 95 },
              classification: { label: 'OPTIMAL', color: 'green' },
              explanation: 'Excelente balance de potencia.'
            },
            {
              rank: 2,
              tractor: { id: 2, name: 'Tractor Mock 2', brand: 'Brand B', enginePowerHp: 110 },
              score: { total: 80 },
              classification: { label: 'USABLE', color: 'yellow' },
              explanation: 'Potencia sobrante, pero funcional.'
            }
          ],
          summary: { persistedCount: 2 }
        }
      });
    }, 1500); // simulate realistic calculation delay
  });
};

export const generateRecommendation = async (payload) => {
  if (!REMOTE_RECOMMENDATION_API_ENABLED) {
    return generateMockRecommendation();
  }

  // payload comes in camelCase, mapped to snake_case by apiClient
  // expected: terrainId, implementId, workingDepthM, workType
  return apiClient('/api/recommendations/generate', {
    method: 'POST',
    body: payload,
  });
};

const generateMockAdvancedRecommendation = async () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        data: {
          queryId: 998,
          tractor: { id: 1, name: 'Tractor Mock 1', brand: 'MockBrand', model: 'XT', enginePowerHp: 120 },
          detailedAnalysis: { realAvailableHp: 105, efficiencyLoss: 15 },
          recommendedImplements: [
            {
              rank: 1,
              implement: { id: 1, name: 'Arado Mock 1', implementType: 'plow', powerRequirementHp: 90 },
              score: { total: 95 }
            },
            {
              rank: 2,
              implement: { id: 2, name: 'Arado Mock 2', implementType: 'plow', powerRequirementHp: 100 },
              score: { total: 85 }
            }
          ]
        }
      });
    }, 1500);
  });
};

export const generateAdvancedRecommendation = async (payload) => {
  if (!REMOTE_RECOMMENDATION_API_ENABLED) {
    return generateMockAdvancedRecommendation();
  }

  return apiClient('/api/recommendations/advanced', {
    method: 'POST',
    body: payload,
  });
};
