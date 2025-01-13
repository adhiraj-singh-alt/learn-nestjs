import { UUID } from 'crypto';

export interface Cat {
  id: UUID;
  name: string;
  age: number;
  breed: string;
}
