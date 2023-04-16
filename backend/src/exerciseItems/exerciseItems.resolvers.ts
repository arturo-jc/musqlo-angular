import { QueryResolvers, ExerciseItem, Resolvers } from '../generated/graphql.generated';
import { Context } from '../context';

const exerciseItems: ExerciseItem[] = [
  {
    exerciseType: 'Aerobics',
    category: 'Cardio',
  },
  {
    exerciseType: 'Deadlift',
    category: 'Back',
  },
  {
    exerciseType: 'Seated Calf Raise',
    category: 'Legs',
  },
  {
    exerciseType: 'Burpees',
    category: 'Cardio',
  },
  {
    exerciseType: 'Turkish Get-Up',
    category: 'Cardio',
  },
];

const listExerciseItems: QueryResolvers['exerciseItems'] = () => {
  return exerciseItems;
}

const resolvers: Resolvers<Context> = {
  Query: {
    exerciseItems: listExerciseItems
  }
}

export default resolvers;
