import { apiClient } from '../lib/apiClient';

const REMOTE_CALCULATION_API_ENABLED = import.meta.env.VITE_ENABLE_REMOTE_CALCULATION_API === 'true';

// Mocks
const mockPowerLoss = async () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        data: {
          queryId: 998,
          tractor: { brand: 'MockBrand', model: 'M-100' },
          terrain: { name: 'Campo Mock', soilType: 'rocky' },
          losses: {
            slopeLossHp: 5.5,
            altitudeLossHp: 2.0,
            rollingResistanceLossHp: 3.5,
            slippageLossHp: 4.0,
            totalLossHp: 15.0
          },
          netPowerHp: 85.0,
          enginePowerHp: 100.0,
          efficiencyPercentage: 85.0
        }
      });
    }, 1500);
  });
};

const mockDirectPowerLoss = async (payload) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const enginePowerHp = payload.enginePowerHp || 100;
      const losses = {
        slopeLossHp: +(enginePowerHp * 0.04).toFixed(2),
        altitudeLossHp: payload.hasTurbo ? 0 : +(enginePowerHp * 0.03).toFixed(2),
        rollingResistanceLossHp: +(enginePowerHp * 0.03).toFixed(2),
        slippageLossHp: +(enginePowerHp * (payload.slippagePercent || 10) / 100 * 0.5).toFixed(2),
      };
      const totalLossHp = +(losses.slopeLossHp + losses.altitudeLossHp + losses.rollingResistanceLossHp + losses.slippageLossHp).toFixed(2);
      const netPowerHp = +(enginePowerHp - totalLossHp).toFixed(2);
      resolve({
        success: true,
        data: {
          queryId: null,
          tractor: { brand: 'Manual', model: 'Input', hasTurbo: payload.hasTurbo || false },
          terrain: { name: 'Terreno ingresado', soilType: payload.soilType || 'franco' },
          losses,
          totalLossHp,
          netPowerHp,
          enginePowerHp,
          efficiencyPercentage: +((netPowerHp / enginePowerHp) * 100).toFixed(2)
        }
      });
    }, 1500);
  });
};

const mockMinimumPower = async () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        data: {
          queryId: 997,
          implement: { id: 1, name: 'Sembradora Mock', brand: 'MockB', powerRequirementHp: 70 },
          powerRequirement: { minimumPowerHp: 80.5, calculatedPowerHp: 75.0 },
          tractorAnalysis: {
            totalEvaluated: 10,
            summary: { optimal: 2, overpowered: 5, insufficient: 3 }
          },
          recommendations: {
            top5: [
              {
                tractorId: 1,
                name: 'Tractor A',
                brand: 'Brand X',
                enginePowerHp: 90,
                suitability: { score: 'OPTIMAL', label: 'Óptimo', color: 'green', utilizationPercent: 88, isCompatible: true }
              }
            ]
          }
        }
      });
    }, 1500);
  });
};

export const calculatePowerLoss = async (payload) => {
  const token = localStorage.getItem('token') || sessionStorage.getItem('token');
  if (!REMOTE_CALCULATION_API_ENABLED || !token) {
    return mockPowerLoss();
  }

  // payload expected in camelCase: tractorId, terrainId, workingSpeedKmh, carriedObjectsWeightKg, slippagePercent
  return apiClient('/api/calculations/power-loss', {
    method: 'POST',
    body: payload,
  });
};

export const calculateDirectPowerLoss = async (payload) => {
  if (!REMOTE_CALCULATION_API_ENABLED) {
    return mockDirectPowerLoss(payload);
  }

  // payload in camelCase: enginePowerHp, weightKg, soilType, altitudeM, etc.
  // apiClient converts camelCase → snake_case before sending to backend
  return apiClient('/api/calculations/direct-power-loss', {
    method: 'POST',
    body: payload,
  });
};

export const calculateMinimumPower = async (payload) => {
  const token = localStorage.getItem('token') || sessionStorage.getItem('token');
  if (!REMOTE_CALCULATION_API_ENABLED || !token) {
    return mockMinimumPower();
  }

  // payload expected in camelCase: implementId, terrainId, workingDepthM
  return apiClient('/api/calculations/minimum-power', {
    method: 'POST',
    body: payload,
  });
};

export const getCalculationHistory = async (page = 1, limit = 10, type = '') => {
  if (!REMOTE_CALCULATION_API_ENABLED) {
    return { success: true, data: [] }; // Mock empty history
  }

  const query = new URLSearchParams({ page, limit });
  if (type) query.append('type', type);

  return apiClient(`/api/calculations/history?${query.toString()}`, {
    method: 'GET',
  });
};
