// helpers/getUserByToken.ts
import jwt from 'jsonwebtoken';
import Admin from '../models/Admin';

const getUserByToken = async (token: string) => {
    if (!token) {
        return null;
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { id: number };
        const adminId = decoded.id;
        const admin = await Admin.findByPk(adminId);

        return admin;
    } catch (error) {
        return null;
    }
}

export default getUserByToken;