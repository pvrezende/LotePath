import { NextFunction, Request, Response } from "express";
import { DashboardService } from "../services/DashboardService.js";

export class DashboardController {
    private dashboardService: DashboardService;

    constructor(dashboardService: DashboardService) {
        this.dashboardService = dashboardService;
    }

    async get(req: Request, res: Response, next: NextFunction) {
        try {
            const dashboard = await this.dashboardService.getDashboard();

            return res.status(200).json(dashboard);
        } catch (error) {
            return next(error);
        }
    }
}