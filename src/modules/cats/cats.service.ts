import { Injectable } from '@nestjs/common';
import { Cat } from './interface/cat.interface';
import { UUID } from 'crypto';

@Injectable()
export class CatsService {
  private cats: Cat[] = [];

  create(cat: Cat) {
    this.cats.push(cat);
  }

  findAll(): Cat[] {
    return this.cats;
  }

  findById(id: UUID): Cat {
    return this.cats.find((cat) => cat.id === id);
  }

  update(id: UUID, catPayload: Partial<Cat>): Cat | boolean {
    const catIndex = this.cats.findIndex((cat) => cat.id === id);
    if (catIndex === -1) return false;

    const updatedCat = {
      ...this.cats[catIndex],
      ...catPayload,
    };
    return (this.cats[catIndex] = updatedCat);
  }

  delete(id: UUID) {
    this.cats = [...this.cats.filter((cat) => cat.id !== id)];
    return;
  }
}
