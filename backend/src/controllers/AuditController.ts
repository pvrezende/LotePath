import { NextFunction, Request, Response } from "express";
import { AuditService } from "../services/AuditService.js";

export class AuditController {
    private auditService: AuditService;

    constructor(auditService: AuditService) {
        this.auditService = auditService;
    }

    async getAll(req: Request, res: Response, next: NextFunction) {
        try {
            const modulo = req.query.modulo as string | undefined;
            const logs = await this.auditService.getLogs(modulo);

            return res.status(200).json({
                status: 200,
                data: logs
            });
        } catch (error) {
            return next(error);
        }
    }
}
