import { Body, Controller, Get, Param, Post, Delete } from '@nestjs/common';
import { Label } from './entity/labels.entity';
import { LabelService } from './label.service';

@Controller('label')
export class LabelController {
  constructor(private readonly labelService: LabelService) {}

  @Get()
  async findAllLabels(): Promise<Label[]> {
    return this.labelService.findAll();
  }

  @Get(':id')
  async findLabelById(@Param('id') id: string): Promise<Label> {
    return this.labelService.findById(id);
  }

  @Post()
  async createLabel(
    @Body() labelData: { name: string; userId: string },
  ): Promise<Label> {
    return this.labelService.create(labelData);
  }

  @Delete(':id/:name')
  async delete(
    @Param('name') name: string,
    @Param('id') id: string,
  ): Promise<void> {
    return this.labelService.delete(name, id);
  }
}
