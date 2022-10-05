import Zone, { ZonesMeta } from './Zone';
import Meta from './Meta';
import PaginationType from './Pagination';

export default interface Zones {
    zones: Zone[],
    pagination: PaginationType,
    zonesMeta: ZonesMeta,
    currentZone: Zone | null,
    fetch_zones: (token?: string) => void,
    fetch_zone: (id: string, token: string | null) => void,
    delete_zone: (id: string, token: string | null) => void,
    update_partial_zone: (json_patch: any, token: string | null) => void,
    update_meta: (data: any) => void,
    update_pagination: (data: any) => void
    updatingMeta: Meta,


}