import { TemplateDocument } from "../models/Template";

declare module 'express' {
    interface Request {
      templateDocument?: TemplateDocument
    }
 }