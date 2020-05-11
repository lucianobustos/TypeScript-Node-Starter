"use strict";

import graph from "fbgraph";
import { Response, Request, NextFunction } from "express";
import { UserDocument } from "../models/User";


/**
 * GET /api
 * List of API examples.
 */
export const getApi = (req: Request, res: Response) => {
    res.render("api/index", {
        title: "API Examples"
    });
};

export const getEnvVars = async (req: Request, res: Response) => {
    const dto = process.env;
    res.status(200).json(dto);
};

/**
 * GET /api/facebook
 * Facebook API example.
 */
export const getFacebook = (req: Request, res: Response, next: NextFunction) => {
    const user = req.user as UserDocument;
    const token = user.tokens.find((token: any) => token.kind === "linkedin");
    graph.setAccessToken(token.accessToken);
    graph.get(`${user.facebook}?fields=id,name,email,first_name,last_name,gender,link,locale,timezone`, (err: Error, results: graph.FacebookUser) => {
        if (err) { return next(err); }
        res.render("api/facebook", {
            title: "Facebook API",
            profile: results
        });
    });
};

/**
 * GET /api/linkedin
 * Facebook API example.
 */
export const getLinkedin = (req: Request, res: Response, next: NextFunction) => {
    const user = req.user as UserDocument;
    const token = user.tokens.find((token: any) => token.kind === "linkedin");
    graph.setAccessToken(token.accessToken);
    graph.get(`${user.linkedin}?projection=(id,firstName,lastName,email)`, (err: Error, results: graph.FacebookUser) => {
        if (err) { return next(err); }
        res.render("api/linkedin", {
            title: "linkedin API",
            profile: results
        });
    });
};