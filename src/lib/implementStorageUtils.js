/**
 * Parse implement data from localStorage safely.
 * @param {string | null} rawData
 * @returns {Record<string, unknown> | null}
 */
export const parseStoredImplementData = (rawData) => {
  if (!rawData) {
    return null;
  }

  try {
    const parsed = JSON.parse(rawData);
    return parsed && typeof parsed === 'object' ? parsed : null;
  } catch {
    return null;
  }
};

/**
 * Resolve working depth in meters from camelCase/snake_case input.
 * @param {Record<string, unknown> | null} implementData
 * @param {number} fallback
 * @returns {number}
 */
export const getWorkingDepthM = (implementData, fallback = 0.3) => {
  if (!implementData || typeof implementData !== 'object') {
    return fallback;
  }

  const rawDepth = implementData.workingDepthCm ?? implementData.working_depth_cm;
  const depthCm = Number(rawDepth);

  if (!Number.isFinite(depthCm) || depthCm <= 0) {
    return fallback;
  }

  return depthCm / 100;
};
