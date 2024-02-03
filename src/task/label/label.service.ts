import { Injectable, NotFoundException } from '@nestjs/common';
import { Model, Types } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Label } from './entity/labels.entity';

@Injectable()
export class LabelService {
  constructor(
    @InjectModel(Label.name) private readonly labelModel: Model<Label>,
  ) {}

  async findAll(): Promise<Label[]> {
    return this.labelModel.find().exec();
  }

  async findById(userId: string): Promise<Label> {
    try {
      const [label] = await this.labelModel
        .find({ userId: new Types.ObjectId(userId) })
        .exec();
      if (!label) {
        throw new NotFoundException('Label not found');
      }
      return label;
    } catch (err) {
      console.log('xxx r', err);
    }
  }

  async create(labelData: { name: string; userId: string }): Promise<Label> {
    const existingLabel = await this.labelModel.findOne({
      userId: new Types.ObjectId(labelData.userId),
    });
    if (existingLabel) {
      existingLabel.labels.push(labelData.name);
      return existingLabel.save();
    } else {
      const createdLabel = new this.labelModel({
        userId: new Types.ObjectId(labelData.userId),
        labels: [labelData.name],
      });
      return createdLabel.save();
    }
  }

  async delete(name: string, userId: string): Promise<void> {
    const result = await this.labelModel
      .findOneAndUpdate(
        { userId: new Types.ObjectId(userId) },
        { $pull: { labels: name } },
        { new: true },
      )
      .exec();

    if (!result) {
      throw new NotFoundException('Label not found');
    }
  }
}
