import { user } from '../schemas/auth';
import { provider } from './provider';

export const Service = provider.getFactory().getService(user);
