async function getExerciseItem(root: any, args: any) {
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
