import { Test, TestingModule } from '@nestjs/testing';
import { CoopService } from './coop.service';

describe('CoopService', () => {
  let service: CoopService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CoopService],
    }).compile();

    service = module.get<CoopService>(CoopService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
