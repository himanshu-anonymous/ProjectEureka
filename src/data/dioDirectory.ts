import type { DistrictId } from './maharashtraGeo.generated';
import { ALL_36_DISTRICTS } from './maharashtraDistrictsData';

export type DioStatus = 'Active' | 'Standby' | 'Field Operation';

export interface DioRecord {
  officer: string;
  status: DioStatus;
}

/**
 * Operational DIO data for all 36 districts of Maharashtra.
 * Driven directly from the verified 36 districts registry.
 */
export const DIO_BY_DISTRICT: Record<DistrictId, DioRecord> = Object.fromEntries(
  ALL_36_DISTRICTS.map((d) => [
    d.id,
    {
      officer: d.dioOffice.officer,
      status: d.dioOffice.status,
    },
  ])
) as Record<DistrictId, DioRecord>;
