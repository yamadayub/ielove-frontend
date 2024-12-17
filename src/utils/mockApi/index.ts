import { propertyApi } from './property';
import { roomApi } from './room';
import { materialApi } from './material';

export const mockApi = {
  ...propertyApi,
  ...roomApi,
  ...materialApi,
};