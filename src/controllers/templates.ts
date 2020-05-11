import { Request, Response, NextFunction } from "express";
import { Template, TemplateDocument } from "../models/Template";
import path from "path";
import pug from "pug";
import pdf, { CreateOptions } from "html-pdf";

/**
 * GET /templates
 * Templates Home page.
 */
export const index = (req: Request, res: Response) => {
    res.render("home", {
        title: "Home"
    });
};
/**
 * GET /templates
 * Send a contact form via Nodemailer.
 */
export const getTemplates = async (req: Request, res: Response, next: NextFunction) => {
    const templates: Array<TemplateDocument> = await Template.find({}, (err: Error, templates: Array<TemplateDocument>) => {
        if (err) { return next(err); }
        return templates;
    });
    const fullUrl = req.protocol + "://" + req.get("host"); 
    templates.map(t => {
        t.html = fullUrl +  t.html ;
        t.pdf = fullUrl +  t.pdf ;
    });
    res.render("templates", {
        title: "Templates",
        templates:templates,
    });
};

export const getTemplateById = async (req: Request, res: Response, next: NextFunction) => {
    const templateId = req.params.tempid;
    Template.findById(templateId, (err: Error, template: TemplateDocument) => {
        if (err) { return next(err); }
        res.status(200).json(template);
    });
};
export class PdfTemplateOptions  {
    rootTemplatePath: string = path.resolve("./views/templates");
    scssTemplate =  "template.scss";
    pugTemplate = "default.pug";
    toHtml = false;
    user: object;
    generated: string = new Date().toJSON().slice(0, 10).split("-").reverse().join("/")
};
export const getTemplateByIdHTML = async (req: Request, res: Response, next: NextFunction) => {
    const templateId = req.params.tempid;
    Template.findById(templateId, (err: Error, template: TemplateDocument) => {
        if (err) { return next(err); }
        req.templateDocument = template;
        res.render("templates/" + template.templateName , {
            templateDocument: template,
        });
    });
};



function createPDFAsync(html: string, basePath: string) {
    const options: CreateOptions = {
        base: basePath,
        format: "A4",
        width: "210mm",
        height: "297mm"
    };
    
    return new Promise((resolve, reject) => {
        pdf.create(html, options).toBuffer(function (err, buffer) {
            if (err) {
                reject(err);
            }
            resolve(buffer);
        });
    });
}

async function PDFAsync(options: PdfTemplateOptions) {
    /*const styleOptions = {
        file: path.resolve(options.rootTemplatePath, options.scssTemplate)
    };
    const compiledStyle = await sass.renderSync(styleOptions);
    options.compiledStyle = compiledStyle.css;
    */
    const html = pug.renderFile(path.resolve(options.rootTemplatePath, options.pugTemplate), options);
    if (options.toHtml) {
        return html;
    } else {
        const buffer = createPDFAsync(html, options.rootTemplatePath);
        return buffer;
    }
}

export const getTemplateByIdPDF = async (req: Request, res: Response) => {

    const templateId = req.params.tempid;
    const templateDocument = await Template.findById(templateId, (err: Error, template: TemplateDocument) => {
        return template;
    });

    const pdfTemplateOptions = new PdfTemplateOptions();
    pdfTemplateOptions.pugTemplate = templateDocument.templateName;
    pdfTemplateOptions.user =  req.user;
    const buffer = await PDFAsync(pdfTemplateOptions) as Buffer;
    res.set({ "Content-Type": pdfTemplateOptions.toHtml ? "text/html" : "application/pdf", "Content-Length": buffer.length });
    res.send(buffer);
};