import { QueryResolvers, ExerciseItem, Resolvers } from '../generated/graphql.generated';
import { Context } from '../context';

export const savedExerciseItems: ExerciseItem[] = [
  {
    id: 'a',
    exerciseType: 'Aerobics',
    category: 'Cardio',
  },
  {
    id: 'b',
    exerciseType: 'Deadlift',
    category: 'Back',
  },
  {
    id: 'c',
    exerciseType: 'Seated Calf Raise',
    category: 'Legs',
  },
  {
    id: 'd',
    exerciseType: 'Burpees',
    category: 'Cardio',
  },
  {
    id: 'e',
    exerciseType: 'Turkish Get-Up',
    category: 'Cardio',
  },
];

const listExerciseItems: QueryResolvers['exerciseItems'] = () => {
  return savedExerciseItems;
}

const resolvers: Resolvers<Context> = {
  Query: {
    exerciseItems: listExerciseItems
  }
}

export default resolvers;
