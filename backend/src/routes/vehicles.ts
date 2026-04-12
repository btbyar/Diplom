import { Router, Request, Response } from 'express';
import { Vehicle } from '../models/Vehicle.js';
import { authenticate, requireAdmin, AuthRequest } from '../middleware/authMiddleware.js';

export const vehicleRoutes = Router();

// Get current user's vehicles (authenticated)
vehicleRoutes.get('/my', authenticate, async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.userId!;
        const vehicles = await Vehicle.find({ ownerId: userId }).sort({ createdAt: -1 });
        res.json(vehicles);
    } catch (error: any) {
        console.error('My vehicles fetch error:', error);
        res.status(500).json({ error: 'Сервер алдаа' });
    }
});

// Admin: get all vehicles
vehicleRoutes.get('/', authenticate, requireAdmin, async (_req: Request, res: Response) => {
    try {
        const vehicles = await Vehicle.find().populate('ownerId', 'name email phone').sort({ createdAt: -1 });
        res.json(vehicles);
    } catch (error: any) {
        console.error('Vehicles fetch error:', error);
        res.status(500).json({ error: 'Сервер алдаа' });
    }
});

// Get vehicle by ID
vehicleRoutes.get('/:id', async (req: Request, res: Response) => {
    try {
        const vehicle = await Vehicle.findById(req.params.id).populate('ownerId', 'name email phone');
        if (!vehicle) {
            res.status(404).json({ error: 'Машин олдсонгүй' });
            return;
        }
        res.json(vehicle);
    } catch (error: any) {
        console.error('Vehicle fetch error:', error);
        res.status(500).json({ error: 'Сервер алдаа' });
    }
});

// Authenticated user: create vehicle — ownerId from token
vehicleRoutes.post('/', authenticate, async (req: AuthRequest, res: Response) => {
    try {
        const { plateNumber, make, modelName, year, color, vin, notes } = req.body;
        const ownerId = req.userId;

        if (!plateNumber || !make || !modelName) {
            res.status(400).json({ error: 'Улсын дугаар, марк, загвар шаардлагатай' });
            return;
        }

        const existing = await Vehicle.findOne({ plateNumber });
        if (existing) {
            res.status(400).json({ error: 'Энэ дугаартай машин бүртгэгдсэн байна' });
            return;
        }

        const newVehicle = new Vehicle({
            ownerId: ownerId || undefined, // Allow null/empty for guest vehicles
            plateNumber,
            make,
            modelName,
            year: year ? parseInt(year) : undefined,
            color,
            vin,
            notes,
        });

        await newVehicle.save();

        // Populate before returning so frontend gets owner details
        const populated = await Vehicle.findById(newVehicle._id).populate('ownerId', 'name email phone');

        res.status(201).json(populated);
    } catch (error: any) {
        console.error('Vehicle create error:', error);
        res.status(500).json({ error: 'Сервер алдаа' });
    }
});

// Admin: update vehicle
vehicleRoutes.put('/:id', authenticate, requireAdmin, async (req: Request, res: Response) => {
    try {
        const vehicleId = req.params.id;
        if (!vehicleId) {
            res.status(400).json({ error: 'Машины ID шаардлагатай' });
            return;
        }

        const { ownerId, plateNumber, make, modelName, year, color, vin, notes } = req.body;

        if (plateNumber) {
            const existing = await Vehicle.findOne({ plateNumber, _id: { $ne: vehicleId } });
            if (existing) {
                res.status(400).json({ error: 'Энэ дугаартай өөр машин бүртгэгдсэн байна' });
                return;
            }
        }

        const updated = await Vehicle.findByIdAndUpdate(
            vehicleId,
            {
                ownerId: ownerId || undefined,
                plateNumber,
                make,
                modelName,
                year: year ? parseInt(year) : undefined,
                color,
                vin,
                notes
            },
            { new: true }
        ).populate('ownerId', 'name email phone');

        if (!updated) {
            res.status(404).json({ error: 'Машин олдсонгүй' });
            return;
        }

        res.json(updated);
    } catch (error: any) {
        console.error('Vehicle update error:', error);
        res.status(500).json({ error: 'Сервер алдаа' });
    }
});

// Admin: delete vehicle
vehicleRoutes.delete('/:id', authenticate, requireAdmin, async (req: Request, res: Response) => {
    try {
        const vehicleId = req.params.id;
        if (!vehicleId) {
            res.status(400).json({ error: 'Машины ID шаардлагатай' });
            return;
        }

        const deleted = await Vehicle.findByIdAndDelete(vehicleId);
        if (!deleted) {
            res.status(404).json({ error: 'Машин олдсонгүй' });
            return;
        }

        res.json({ message: 'Машин устгалаа' });
    } catch (error: any) {
        console.error('Vehicle delete error:', error);
        res.status(500).json({ error: 'Сервер алдаа' });
    }
});
