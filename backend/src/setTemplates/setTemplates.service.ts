import { CreateSetTemplateInput, SetTemplate } from "../generated/graphql.generated";
import { v1 as uuid } from 'uuid';
import { RequiredBy } from "../utils/types";

export type SavedSetTemplate = RequiredBy<SetTemplate, 'id'>;

export let savedSetTemplates: SavedSetTemplate[] = [];

export function createSetTemplates(setTemplates: CreateSetTemplateInput[], exerciseTemplateId: string) {
  const output: SetTemplate[] = [];

  for (const setTemplate of setTemplates) {

    const newSetTemplate: SavedSetTemplate = {
      ...setTemplate,
      id: uuid(),
      exerciseTemplateId,
    }

    savedSetTemplates.push(newSetTemplate);

    output.push(newSetTemplate);
  }

  return output;
}

export function deleteSetTemplates(setTemplates: string[]) {
  savedSetTemplates = savedSetTemplates.filter(st => !setTemplates.includes(st.id));
}
