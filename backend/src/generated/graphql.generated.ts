import { GraphQLResolveInfo } from 'graphql';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type RequireFields<T, K extends keyof T> = Omit<T, K> & { [P in K]-?: NonNullable<T[P]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
};

export type AuthenticateOutput = {
  __typename?: 'AuthenticateOutput';
  expiresIn?: Maybe<Scalars['Int']>;
  userEmail: Scalars['String'];
  userId: Scalars['String'];
  username?: Maybe<Scalars['String']>;
};

export type CreateExerciseTemplateInput = {
  name: Scalars['String'];
  order: Scalars['Int'];
  setTemplates: Array<CreateSetTemplateInput>;
};

export type CreateScheduleInput = {
  key?: InputMaybe<Scalars['String']>;
  name: Scalars['String'];
  workouts: Array<CreateScheduleWorkoutInput>;
};

export type CreateScheduleWorkoutInput = {
  allDay?: InputMaybe<Scalars['Boolean']>;
  dow?: InputMaybe<Scalars['Int']>;
  end?: InputMaybe<Scalars['String']>;
  start?: InputMaybe<Scalars['String']>;
  workoutTemplateId?: InputMaybe<Scalars['String']>;
};

export type CreateSetTemplateInput = {
  exerciseItemId: Scalars['String'];
  order: Scalars['Int'];
  reps?: InputMaybe<Scalars['Int']>;
  weight?: InputMaybe<Scalars['Int']>;
};

export type CreateWorkoutTemplateInput = {
  backgroundColor?: InputMaybe<Scalars['String']>;
  exerciseTemplates: Array<CreateExerciseTemplateInput>;
  key: Scalars['String'];
  name: Scalars['String'];
};

export type ExerciseItem = {
  __typename?: 'ExerciseItem';
  category: Scalars['String'];
  exerciseType: Scalars['String'];
  id: Scalars['String'];
};

export type ExerciseTemplate = {
  __typename?: 'ExerciseTemplate';
  id?: Maybe<Scalars['String']>;
  key?: Maybe<Scalars['String']>;
  name: Scalars['String'];
  order: Scalars['Int'];
  setTemplates?: Maybe<Array<SetTemplate>>;
  workoutTemplateId?: Maybe<Scalars['String']>;
};

export type Mutation = {
  __typename?: 'Mutation';
  _blank?: Maybe<Scalars['Boolean']>;
  createSchedules: Array<Schedule>;
  createWorkoutTemplates: Array<WorkoutTemplate>;
  signUp: AuthenticateOutput;
  updateExerciseTemplates: Array<ExerciseTemplate>;
  updateScheduleWorkouts: Array<ScheduleWorkout>;
  updateSchedules: Array<Schedule>;
  updateSetTemplates: Array<SetTemplate>;
  updateWorkoutTemplates: Array<WorkoutTemplate>;
};


export type MutationCreateSchedulesArgs = {
  schedules: Array<CreateScheduleInput>;
};


export type MutationCreateWorkoutTemplatesArgs = {
  workoutTemplates: Array<CreateWorkoutTemplateInput>;
};


export type MutationSignUpArgs = {
  email: Scalars['String'];
  password: Scalars['String'];
  username?: InputMaybe<Scalars['String']>;
};


export type MutationUpdateExerciseTemplatesArgs = {
  exerciseTemplates: Array<UpdateExerciseTemplateInput>;
};


export type MutationUpdateScheduleWorkoutsArgs = {
  scheduleWorkouts: Array<UpdateScheduleWorkoutInput>;
};


export type MutationUpdateSchedulesArgs = {
  schedules: Array<UpdateScheduleInput>;
};


export type MutationUpdateSetTemplatesArgs = {
  setTemplates: Array<UpdateSetTemplateInput>;
};


export type MutationUpdateWorkoutTemplatesArgs = {
  workoutTemplates: Array<UpdateWorkoutTemplateInput>;
};

export type Query = {
  __typename?: 'Query';
  _blank?: Maybe<Scalars['Boolean']>;
  authenticate?: Maybe<AuthenticateOutput>;
  exerciseItems: Array<Maybe<ExerciseItem>>;
  logIn: AuthenticateOutput;
  logOut: Scalars['Boolean'];
  user?: Maybe<User>;
};


export type QueryLogInArgs = {
  email: Scalars['String'];
  password: Scalars['String'];
  username?: InputMaybe<Scalars['String']>;
};


export type QueryUserArgs = {
  userId: Scalars['String'];
};

export type Schedule = {
  __typename?: 'Schedule';
  id?: Maybe<Scalars['String']>;
  key?: Maybe<Scalars['String']>;
  name: Scalars['String'];
  userId?: Maybe<Scalars['String']>;
  workouts?: Maybe<Array<ScheduleWorkout>>;
};

export type ScheduleWorkout = {
  __typename?: 'ScheduleWorkout';
  allDay?: Maybe<Scalars['Boolean']>;
  dow?: Maybe<Scalars['Int']>;
  end?: Maybe<Scalars['String']>;
  id?: Maybe<Scalars['String']>;
  scheduleId?: Maybe<Scalars['String']>;
  start?: Maybe<Scalars['String']>;
  workoutTemplateId?: Maybe<Scalars['String']>;
  workoutTemplateKey?: Maybe<Scalars['String']>;
};

export type SetTemplate = {
  __typename?: 'SetTemplate';
  category?: Maybe<Scalars['String']>;
  exerciseItemId: Scalars['String'];
  exerciseTemplateId?: Maybe<Scalars['String']>;
  exerciseType?: Maybe<Scalars['String']>;
  id?: Maybe<Scalars['String']>;
  order: Scalars['Int'];
  reps?: Maybe<Scalars['Int']>;
  weight?: Maybe<Scalars['Int']>;
};

export type UpdateExerciseTemplateInput = {
  addSetTemplates?: InputMaybe<Array<CreateSetTemplateInput>>;
  exerciseTemplateId: Scalars['String'];
  order?: InputMaybe<Scalars['Int']>;
  removeSetTemplates?: InputMaybe<Array<Scalars['String']>>;
};

export type UpdateScheduleInput = {
  addWorkouts?: InputMaybe<Array<CreateScheduleWorkoutInput>>;
  name?: InputMaybe<Scalars['String']>;
  removeWorkouts?: InputMaybe<Array<Scalars['String']>>;
  scheduleId: Scalars['String'];
};

export type UpdateScheduleWorkoutInput = {
  allDay?: InputMaybe<Scalars['Boolean']>;
  dow?: InputMaybe<Scalars['Int']>;
  end?: InputMaybe<Scalars['String']>;
  scheduleWorkoutId: Scalars['String'];
  start?: InputMaybe<Scalars['String']>;
};

export type UpdateSetTemplateInput = {
  order: Scalars['Int'];
  reps?: InputMaybe<Scalars['Int']>;
  setTemplateId: Scalars['String'];
  weight?: InputMaybe<Scalars['Int']>;
};

export type UpdateWorkoutTemplateInput = {
  addExerciseTemplates?: InputMaybe<Array<CreateExerciseTemplateInput>>;
  backgroundColor?: InputMaybe<Scalars['String']>;
  name?: InputMaybe<Scalars['String']>;
  removeExerciseTemplates?: InputMaybe<Array<Scalars['String']>>;
  workoutTemplateId: Scalars['String'];
};

export type User = {
  __typename?: 'User';
  email: Scalars['String'];
  id: Scalars['String'];
  schedules?: Maybe<Array<Schedule>>;
  username?: Maybe<Scalars['String']>;
  workoutTemplates?: Maybe<Array<WorkoutTemplate>>;
};


export type UserSchedulesArgs = {
  filter?: InputMaybe<UserSchedulesFilter>;
};


export type UserWorkoutTemplatesArgs = {
  filter?: InputMaybe<UserWorkoutTemplatesFilter>;
};

export type UserSchedulesFilter = {
  scheduleIds?: InputMaybe<Array<Scalars['String']>>;
};

export type UserWorkoutTemplatesFilter = {
  workoutTemplateIds?: InputMaybe<Array<Scalars['String']>>;
};

export type WorkoutTemplate = {
  __typename?: 'WorkoutTemplate';
  backgroundColor?: Maybe<Scalars['String']>;
  exerciseTemplates?: Maybe<Array<ExerciseTemplate>>;
  id?: Maybe<Scalars['String']>;
  key?: Maybe<Scalars['String']>;
  name: Scalars['String'];
  userId?: Maybe<Scalars['String']>;
};

export type WithIndex<TObject> = TObject & Record<string, any>;
export type ResolversObject<TObject> = WithIndex<TObject>;

export type ResolverTypeWrapper<T> = Promise<T> | T;


export type ResolverWithResolve<TResult, TParent, TContext, TArgs> = {
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};
export type Resolver<TResult, TParent = {}, TContext = {}, TArgs = {}> = ResolverFn<TResult, TParent, TContext, TArgs> | ResolverWithResolve<TResult, TParent, TContext, TArgs>;

export type ResolverFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => Promise<TResult> | TResult;

export type SubscriptionSubscribeFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => AsyncIterable<TResult> | Promise<AsyncIterable<TResult>>;

export type SubscriptionResolveFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

export interface SubscriptionSubscriberObject<TResult, TKey extends string, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<{ [key in TKey]: TResult }, TParent, TContext, TArgs>;
  resolve?: SubscriptionResolveFn<TResult, { [key in TKey]: TResult }, TContext, TArgs>;
}

export interface SubscriptionResolverObject<TResult, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<any, TParent, TContext, TArgs>;
  resolve: SubscriptionResolveFn<TResult, any, TContext, TArgs>;
}

export type SubscriptionObject<TResult, TKey extends string, TParent, TContext, TArgs> =
  | SubscriptionSubscriberObject<TResult, TKey, TParent, TContext, TArgs>
  | SubscriptionResolverObject<TResult, TParent, TContext, TArgs>;

export type SubscriptionResolver<TResult, TKey extends string, TParent = {}, TContext = {}, TArgs = {}> =
  | ((...args: any[]) => SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>)
  | SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>;

export type TypeResolveFn<TTypes, TParent = {}, TContext = {}> = (
  parent: TParent,
  context: TContext,
  info: GraphQLResolveInfo
) => Maybe<TTypes> | Promise<Maybe<TTypes>>;

export type IsTypeOfResolverFn<T = {}, TContext = {}> = (obj: T, context: TContext, info: GraphQLResolveInfo) => boolean | Promise<boolean>;

export type NextResolverFn<T> = () => Promise<T>;

export type DirectiveResolverFn<TResult = {}, TParent = {}, TContext = {}, TArgs = {}> = (
  next: NextResolverFn<TResult>,
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;



/** Mapping between all available schema types and the resolvers types */
export type ResolversTypes = ResolversObject<{
  AuthenticateOutput: ResolverTypeWrapper<AuthenticateOutput>;
  Boolean: ResolverTypeWrapper<Scalars['Boolean']>;
  CreateExerciseTemplateInput: CreateExerciseTemplateInput;
  CreateScheduleInput: CreateScheduleInput;
  CreateScheduleWorkoutInput: CreateScheduleWorkoutInput;
  CreateSetTemplateInput: CreateSetTemplateInput;
  CreateWorkoutTemplateInput: CreateWorkoutTemplateInput;
  ExerciseItem: ResolverTypeWrapper<ExerciseItem>;
  ExerciseTemplate: ResolverTypeWrapper<ExerciseTemplate>;
  Int: ResolverTypeWrapper<Scalars['Int']>;
  Mutation: ResolverTypeWrapper<{}>;
  Query: ResolverTypeWrapper<{}>;
  Schedule: ResolverTypeWrapper<Schedule>;
  ScheduleWorkout: ResolverTypeWrapper<ScheduleWorkout>;
  SetTemplate: ResolverTypeWrapper<SetTemplate>;
  String: ResolverTypeWrapper<Scalars['String']>;
  UpdateExerciseTemplateInput: UpdateExerciseTemplateInput;
  UpdateScheduleInput: UpdateScheduleInput;
  UpdateScheduleWorkoutInput: UpdateScheduleWorkoutInput;
  UpdateSetTemplateInput: UpdateSetTemplateInput;
  UpdateWorkoutTemplateInput: UpdateWorkoutTemplateInput;
  User: ResolverTypeWrapper<User>;
  UserSchedulesFilter: UserSchedulesFilter;
  UserWorkoutTemplatesFilter: UserWorkoutTemplatesFilter;
  WorkoutTemplate: ResolverTypeWrapper<WorkoutTemplate>;
}>;

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = ResolversObject<{
  AuthenticateOutput: AuthenticateOutput;
  Boolean: Scalars['Boolean'];
  CreateExerciseTemplateInput: CreateExerciseTemplateInput;
  CreateScheduleInput: CreateScheduleInput;
  CreateScheduleWorkoutInput: CreateScheduleWorkoutInput;
  CreateSetTemplateInput: CreateSetTemplateInput;
  CreateWorkoutTemplateInput: CreateWorkoutTemplateInput;
  ExerciseItem: ExerciseItem;
  ExerciseTemplate: ExerciseTemplate;
  Int: Scalars['Int'];
  Mutation: {};
  Query: {};
  Schedule: Schedule;
  ScheduleWorkout: ScheduleWorkout;
  SetTemplate: SetTemplate;
  String: Scalars['String'];
  UpdateExerciseTemplateInput: UpdateExerciseTemplateInput;
  UpdateScheduleInput: UpdateScheduleInput;
  UpdateScheduleWorkoutInput: UpdateScheduleWorkoutInput;
  UpdateSetTemplateInput: UpdateSetTemplateInput;
  UpdateWorkoutTemplateInput: UpdateWorkoutTemplateInput;
  User: User;
  UserSchedulesFilter: UserSchedulesFilter;
  UserWorkoutTemplatesFilter: UserWorkoutTemplatesFilter;
  WorkoutTemplate: WorkoutTemplate;
}>;

export type AuthenticateOutputResolvers<ContextType = any, ParentType extends ResolversParentTypes['AuthenticateOutput'] = ResolversParentTypes['AuthenticateOutput']> = ResolversObject<{
  expiresIn?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  userEmail?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  userId?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  username?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type ExerciseItemResolvers<ContextType = any, ParentType extends ResolversParentTypes['ExerciseItem'] = ResolversParentTypes['ExerciseItem']> = ResolversObject<{
  category?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  exerciseType?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type ExerciseTemplateResolvers<ContextType = any, ParentType extends ResolversParentTypes['ExerciseTemplate'] = ResolversParentTypes['ExerciseTemplate']> = ResolversObject<{
  id?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  key?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  order?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  setTemplates?: Resolver<Maybe<Array<ResolversTypes['SetTemplate']>>, ParentType, ContextType>;
  workoutTemplateId?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type MutationResolvers<ContextType = any, ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation']> = ResolversObject<{
  _blank?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  createSchedules?: Resolver<Array<ResolversTypes['Schedule']>, ParentType, ContextType, RequireFields<MutationCreateSchedulesArgs, 'schedules'>>;
  createWorkoutTemplates?: Resolver<Array<ResolversTypes['WorkoutTemplate']>, ParentType, ContextType, RequireFields<MutationCreateWorkoutTemplatesArgs, 'workoutTemplates'>>;
  signUp?: Resolver<ResolversTypes['AuthenticateOutput'], ParentType, ContextType, RequireFields<MutationSignUpArgs, 'email' | 'password'>>;
  updateExerciseTemplates?: Resolver<Array<ResolversTypes['ExerciseTemplate']>, ParentType, ContextType, RequireFields<MutationUpdateExerciseTemplatesArgs, 'exerciseTemplates'>>;
  updateScheduleWorkouts?: Resolver<Array<ResolversTypes['ScheduleWorkout']>, ParentType, ContextType, RequireFields<MutationUpdateScheduleWorkoutsArgs, 'scheduleWorkouts'>>;
  updateSchedules?: Resolver<Array<ResolversTypes['Schedule']>, ParentType, ContextType, RequireFields<MutationUpdateSchedulesArgs, 'schedules'>>;
  updateSetTemplates?: Resolver<Array<ResolversTypes['SetTemplate']>, ParentType, ContextType, RequireFields<MutationUpdateSetTemplatesArgs, 'setTemplates'>>;
  updateWorkoutTemplates?: Resolver<Array<ResolversTypes['WorkoutTemplate']>, ParentType, ContextType, RequireFields<MutationUpdateWorkoutTemplatesArgs, 'workoutTemplates'>>;
}>;

export type QueryResolvers<ContextType = any, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = ResolversObject<{
  _blank?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  authenticate?: Resolver<Maybe<ResolversTypes['AuthenticateOutput']>, ParentType, ContextType>;
  exerciseItems?: Resolver<Array<Maybe<ResolversTypes['ExerciseItem']>>, ParentType, ContextType>;
  logIn?: Resolver<ResolversTypes['AuthenticateOutput'], ParentType, ContextType, RequireFields<QueryLogInArgs, 'email' | 'password'>>;
  logOut?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  user?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType, RequireFields<QueryUserArgs, 'userId'>>;
}>;

export type ScheduleResolvers<ContextType = any, ParentType extends ResolversParentTypes['Schedule'] = ResolversParentTypes['Schedule']> = ResolversObject<{
  id?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  key?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  userId?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  workouts?: Resolver<Maybe<Array<ResolversTypes['ScheduleWorkout']>>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type ScheduleWorkoutResolvers<ContextType = any, ParentType extends ResolversParentTypes['ScheduleWorkout'] = ResolversParentTypes['ScheduleWorkout']> = ResolversObject<{
  allDay?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  dow?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  end?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  id?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  scheduleId?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  start?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  workoutTemplateId?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  workoutTemplateKey?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type SetTemplateResolvers<ContextType = any, ParentType extends ResolversParentTypes['SetTemplate'] = ResolversParentTypes['SetTemplate']> = ResolversObject<{
  category?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  exerciseItemId?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  exerciseTemplateId?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  exerciseType?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  id?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  order?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  reps?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  weight?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type UserResolvers<ContextType = any, ParentType extends ResolversParentTypes['User'] = ResolversParentTypes['User']> = ResolversObject<{
  email?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  schedules?: Resolver<Maybe<Array<ResolversTypes['Schedule']>>, ParentType, ContextType, Partial<UserSchedulesArgs>>;
  username?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  workoutTemplates?: Resolver<Maybe<Array<ResolversTypes['WorkoutTemplate']>>, ParentType, ContextType, Partial<UserWorkoutTemplatesArgs>>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type WorkoutTemplateResolvers<ContextType = any, ParentType extends ResolversParentTypes['WorkoutTemplate'] = ResolversParentTypes['WorkoutTemplate']> = ResolversObject<{
  backgroundColor?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  exerciseTemplates?: Resolver<Maybe<Array<ResolversTypes['ExerciseTemplate']>>, ParentType, ContextType>;
  id?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  key?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  userId?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type Resolvers<ContextType = any> = ResolversObject<{
  AuthenticateOutput?: AuthenticateOutputResolvers<ContextType>;
  ExerciseItem?: ExerciseItemResolvers<ContextType>;
  ExerciseTemplate?: ExerciseTemplateResolvers<ContextType>;
  Mutation?: MutationResolvers<ContextType>;
  Query?: QueryResolvers<ContextType>;
  Schedule?: ScheduleResolvers<ContextType>;
  ScheduleWorkout?: ScheduleWorkoutResolvers<ContextType>;
  SetTemplate?: SetTemplateResolvers<ContextType>;
  User?: UserResolvers<ContextType>;
  WorkoutTemplate?: WorkoutTemplateResolvers<ContextType>;
}>;

