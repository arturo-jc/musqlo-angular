async function getExerciseItem(root: any, args: any) {
  return {
    exerciseType: args.exerciseType,
    category: 'poopoo',
  }
}

module.exports = {
  Query: {
    exerciseItem: getExerciseItem,
  }
}
