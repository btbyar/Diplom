import { Schema, model, Types } from 'mongoose';

interface IVehicle {
    ownerId?: Types.ObjectId;
    plateNumber: string;
    make: string;
    modelName: string;
    year?: number;
    color?: string;
    vin?: string;
    notes?: string;
    createdAt: Date;
}

const vehicleSchema = new Schema<IVehicle>(
    {
        ownerId: { type: Schema.Types.ObjectId, ref: 'User' },
        plateNumber: { type: String, required: true, unique: true },
        make: { type: String, required: true },
        modelName: { type: String, required: true },
        year: { type: Number },
        color: { type: String },
        vin: { type: String },
        notes: { type: String },
    },
    { timestamps: true }
);

vehicleSchema.virtual('id').get(function () {
    return this._id;
});

vehicleSchema.set('toJSON', { virtuals: true });

export const Vehicle = model<IVehicle>('Vehicle', vehicleSchema);
