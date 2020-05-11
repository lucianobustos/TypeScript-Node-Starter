import { Request, Response, NextFunction } from "express";
import fetch from "node-fetch";
import { TemplateDocument, Template } from "../models/Template";
/**
 * GET /
 * Home page.
 */
export const index = async (req: Request, res: Response, next: NextFunction) => {
    const templates: Array<TemplateDocument> = await Template.find({}, (err: Error, templates: Array<TemplateDocument>) => {
        if (err) { return next(err); }
        return templates;
    });
    res.render("home", {
        title: "Home",
        templates:templates
    });
};

export const privacy = async (req: Request, res: Response) => {
    const data = await fetch("https://www.privacypolicygenerator.info/live.php?token=8jZlyaB3QEN3SzYdYUEhYwCjDZUlchF9");
    const datahtml = await data.text();
    res.render("privacy", {
        title: "Privacy",
        privacyContent:datahtml.substring(datahtml.indexOf("<h1>",0), datahtml.indexOf("</div>",0))
    });
};