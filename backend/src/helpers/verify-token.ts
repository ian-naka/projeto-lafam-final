//middlewares/checkToken.ts
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import getToken from '../helpers/get-token'; //importando a função acima

const checkToken = (req: Request, res: Response, next: NextFunction): void => {
    if (!req.headers.authorization) {
        res.status(401).json({ message: 'Acesso negado!' });
        return;
    }

    const token = getToken(req);

    if (!token) {
        res.status(401).json({ message: 'Acesso negado!' });
        return;
    }
    
    try {
        const verified = jwt.verify(token, process.env.JWT_SECRET as string);
        (req as any).admin = verified; //injeta os dados do admin na requisição
        next(); //pode passar para o RegistroController!
    } catch (error) {
        res.status(400).json({ message: 'Token inválido!' });
    }
}

export default checkToken;