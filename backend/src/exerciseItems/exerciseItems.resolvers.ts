export type Category = 'Cardio' | 'Back' | 'Legs';

export interface ExerciseItem {
  exerciseType: string;
  category: Category;
}

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

async function listExerciseItems(_root: any, args: any) {
  return exerciseItems;
}

export default {
  Query: {
    exerciseItems: listExerciseItems,
  },
}
