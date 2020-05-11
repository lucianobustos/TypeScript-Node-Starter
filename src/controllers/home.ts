import { Request, Response } from "express";
import fetch from "node-fetch";
/**
 * GET /
 * Home page.
 */
export const index = (req: Request, res: Response) => {
    res.render("home", {
        title: "Home"
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