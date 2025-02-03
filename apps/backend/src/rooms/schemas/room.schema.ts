import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Features {
    @Prop()
    bedType: string;

    @Prop()
    maxOccupancy: number;

    @Prop()
    wifi: boolean;

    @Prop()
    airConditioning: boolean;

    @Prop()
    tv: boolean;

    @Prop()
    minibar: boolean;
}

@Schema()
export class Room extends Document {
    @Prop()
    name: string;

    @Prop()
    type: string;

    @Prop()
    price: number;

    @Prop()
    currency: string;

    @Prop()
    availability: boolean;

    @Prop()
    description: string;

    @Prop({ type: Features })
    features: Features;

    @Prop([String])
    images: string[];
}

export const RoomSchema = SchemaFactory.createForClass(Room);