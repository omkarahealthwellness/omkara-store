// ============================================================
// Availability States
// ============================================================
// All possible product availability states.
// Admin selects which states are displayed publicly.
// ============================================================

/** All possible product availability states */
export const AvailabilityState = {
  /** Normal product display — fully orderable */
  Available: 'available',
  /** Freshly made — orderable with visual badge */
  FreshlyPrepared: 'freshly_prepared',
  /** Limited quantity — orderable with warning badge */
  Limited: 'limited',
  /** Running low — orderable with urgency badge */
  LowStock: 'low_stock',
  /** Cannot be ordered — greyed out */
  OutOfStock: 'out_of_stock',
  /** Not yet available — distinct visual, non-orderable */
  ComingSoon: 'coming_soon',
  /** Temporarily pulled — non-orderable */
  TemporarilyUnavailable: 'temporarily_unavailable',
  /** Available only in season — may be orderable or not */
  Seasonal: 'seasonal',
} as const;

export type AvailabilityState = typeof AvailabilityState[keyof typeof AvailabilityState];

/** States where the product CAN be added to cart */
export const ORDERABLE_STATES: ReadonlySet<AvailabilityState> = new Set([
  AvailabilityState.Available,
  AvailabilityState.FreshlyPrepared,
  AvailabilityState.Limited,
  AvailabilityState.LowStock,
  AvailabilityState.Seasonal,
]);

/** Check if a product can be ordered given its availability */
export function isOrderable(state: AvailabilityState): boolean {
  return ORDERABLE_STATES.has(state);
}
