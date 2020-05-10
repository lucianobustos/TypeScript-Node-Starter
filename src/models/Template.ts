import mongoose from "mongoose";

export type TemplateDocument = mongoose.Document & {
    name: string;
    entityMap: string;
    templateName: string;
    html: string;
    pdf: string;
};

const templateSchema = new mongoose.Schema({
    name: String,
    entityMap: String,
    templateName: String,
    html: {
        type: String,
        default: function() {
          return `/templates/${this._id}/html`;
        }
      },
    pdf: {
        type: String,
        default: function() {
          return `/templates/${this._id}/pdf`;
        }
      }
}, { timestamps: true });

export const Template = mongoose.model<TemplateDocument>("Template", templateSchema);