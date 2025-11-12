import { Injectable, BadRequestException } from "@nestjs/common";
import * as Handlebars from "handlebars";

@Injectable()
export class TemplateRendererService {
  constructor() {
    this.registerHelpers();
  }

  private registerHelpers() {
    // Register custom Handlebars helpers
    Handlebars.registerHelper("uppercase", (str: string) => {
      return str ? str.toUpperCase() : "";
    });

    Handlebars.registerHelper("lowercase", (str: string) => {
      return str ? str.toLowerCase() : "";
    });

    Handlebars.registerHelper("capitalize", (str: string) => {
      return str ? str.charAt(0).toUpperCase() + str.slice(1) : "";
    });

    Handlebars.registerHelper("formatDate", (date: Date, format?: string) => {
      if (!date) return "";
      const d = new Date(date);
      return d.toLocaleDateString();
    });

    Handlebars.registerHelper("eq", (a: any, b: any) => {
      return a === b;
    });

    Handlebars.registerHelper("neq", (a: any, b: any) => {
      return a !== b;
    });

    Handlebars.registerHelper("gt", (a: number, b: number) => {
      return a > b;
    });

    Handlebars.registerHelper("lt", (a: number, b: number) => {
      return a < b;
    });
  }

  render(template: string, variables: Record<string, any>): string {
    try {
      const compiledTemplate = Handlebars.compile(template);
      return compiledTemplate(variables);
    } catch (error) {
      throw new BadRequestException(
        `Template rendering failed: ${error.message}`
      );
    }
  }

  extractVariables(template: string): string[] {
    const variableRegex = /\{\{([^}]+)\}\}/g;
    const variables = new Set<string>();
    let match;

    while ((match = variableRegex.exec(template)) !== null) {
      // Extract variable name (remove helpers and whitespace)
      const variable = match[1]
        .trim()
        .split(" ")[0]
        .replace(/^#|^\//, "");
      variables.add(variable);
    }

    return Array.from(variables);
  }

  validateVariables(
    template: string,
    providedVariables: Record<string, any>
  ): { valid: boolean; missing: string[] } {
    const requiredVariables = this.extractVariables(template);
    const providedKeys = Object.keys(providedVariables);

    const missing = requiredVariables.filter(
      (variable) => !providedKeys.includes(variable)
    );

    return {
      valid: missing.length === 0,
      missing,
    };
  }

  renderWithValidation(
    template: string,
    variables: Record<string, any>
  ): { rendered: string; validation: { valid: boolean; missing: string[] } } {
    const validation = this.validateVariables(template, variables);

    if (!validation.valid) {
      throw new BadRequestException(
        `Missing required variables: ${validation.missing.join(", ")}`
      );
    }

    const rendered = this.render(template, variables);

    return { rendered, validation };
  }
}
