import { Context } from '../context';
import { savedExerciseItems } from '../exerciseItems/exerciseItems.resolvers';
import { MutationResolvers, Resolvers, SetTemplateResolvers } from '../generated/graphql.generated';
import { savedSetTemplates, updateSetTemplate } from './setTemplates.service';

export const updateSetTemplatesResolver: MutationResolvers<Context>['updateSetTemplates'] = (_parent, args) => {

  for (const setTemplate of args.setTemplates) {

    const { setTemplateId, ...update } = setTemplate;

    updateSetTemplate(setTemplateId, update);
  }

  const setTemplateIds = args.setTemplates.map(st => st.setTemplateId);

  return savedSetTemplates.filter(st => setTemplateIds.includes(st.id));
}

const categoryResolver: SetTemplateResolvers<Context>['category'] = (parent) => {
  const exerciseItem = savedExerciseItems.find(i => i.id === parent.exerciseItemId);

  if (!exerciseItem) {
    throw new Error('Could not resolve exercise item');
  }

  return exerciseItem.category;
}

const exerciseTypeResolver: SetTemplateResolvers<Context>['exerciseType'] = (parent) => {
  const exerciseItem = savedExerciseItems.find(i => i.id === parent.exerciseItemId);

  if (!exerciseItem) {
    throw new Error('Could not resolve exercise item');
  }

  return exerciseItem.exerciseType;
}

const resolvers: Resolvers<Context> = {
  Mutation: {
    updateSetTemplates: updateSetTemplatesResolver,
  },
  SetTemplate: {
    category: categoryResolver,
    exerciseType: exerciseTypeResolver,
  }
}

export default resolvers;
