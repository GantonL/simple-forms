import { userFsEntitlements } from '../schemas/entitlements';
import { provider } from './provider';

export const Service = provider.getFactory().getService(userFsEntitlements);
