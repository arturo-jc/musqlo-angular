import { CreateSetTemplateInput, SetTemplate } from "../generated/graphql.generated";
import { v1 as uuid } from 'uuid';

export const savedSetTemplates: SetTemplate[] = [];

export function createSetTemplates(setTemplates: CreateSetTemplateInput[], exerciseTemplateId: string) {
  const output: SetTemplate[] = [];

  for (const setTemplate of setTemplates) {

    const newSetTemplate: SetTemplate = {
      ...setTemplate,
      id: uuid(),
      exerciseTemplateId,
    }

    savedSetTemplates.push(newSetTemplate);

    output.push(newSetTemplate);
  }

  return output;
}
