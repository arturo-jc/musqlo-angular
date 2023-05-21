import { Context } from '../context';
import { ExerciseTemplateResolvers, MutationResolvers, Resolvers } from '../generated/graphql.generated';
import { createSetTemplates, deleteSetTemplates } from '../setTemplates/setTemplates.service';
import { savedSetTemplates } from '../setTemplates/setTemplates.service';
import { updateExerciseTemplate } from './exerciseTemplates.service';

const setTemplatesResolver: ExerciseTemplateResolvers<Context>['setTemplates'] = (parent) => {
  return savedSetTemplates.filter(s => s.exerciseTemplateId === parent.id);
}

const updateExerciseTemplatesResolver: MutationResolvers<Context>['updateExerciseTemplates'] = (_parent, args) => {

  const removeSetTemplates: string[] = [];

  for (const exerciseTemplate of args.exerciseTemplates) {

    const {
      addSetTemplates,
      removeSetTemplates: remove,
      exerciseTemplateId,
      ...update
    } = exerciseTemplate;

    updateExerciseTemplate(exerciseTemplateId, update);

    if (addSetTemplates?.length) {
      createSetTemplates(addSetTemplates, exerciseTemplateId);
    }

    if (remove?.length) {
      removeSetTemplates.push(...remove);
    }

  }

  deleteSetTemplates(removeSetTemplates);
  return [];
}

const resolvers: Resolvers<Context> = {
  Mutation: {
    updateExerciseTemplates: updateExerciseTemplatesResolver,
  },
  ExerciseTemplate: {
    setTemplates: setTemplatesResolver,
  }
}

export default resolvers;
