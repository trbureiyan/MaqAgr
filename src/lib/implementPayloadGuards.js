/**
 * Build a mock implement for create operation preserving generated identity.
 * @param {number} nextId
 * @param {Record<string, unknown>} implementPayload
 * @returns {Record<string, unknown>}
 */
export const buildCreateImplementMockItem = (nextId, implementPayload = {}) => {
  const { implementId: _ignoredImplementId, ...payloadWithoutId } = implementPayload;

  return {
    ...payloadWithoutId,
    implementId: nextId,
  };
};

/**
 * Build an updated mock implement without allowing identity mutation.
 * @param {Record<string, unknown>} currentItem
 * @param {Record<string, unknown>} implementPayload
 * @returns {Record<string, unknown>}
 */
export const buildUpdateImplementMockItem = (currentItem, implementPayload = {}) => {
  const { implementId: _ignoredImplementId, ...payloadWithoutId } = implementPayload;

  return {
    ...currentItem,
    ...payloadWithoutId,
  };
};
