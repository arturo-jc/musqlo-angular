async function getExerciseItem(_root: any, args: any) {
  return {
    exerciseType: args.exerciseType,
    category: 'poopoo',
  }
}

export default {
  Query: {
    exerciseItem: getExerciseItem,
  },
}
