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

export type CreateExerciseInput = {
  exerciseType: Scalars['String'];
  order: Scalars['Int'];
  sets: Array<CreateSetTemplateInput>;
};

export type CreateScheduleInput = {
  key: Scalars['String'];
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
  order: Scalars['Int'];
  reps?: InputMaybe<Scalars['Int']>;
  weight?: InputMaybe<Scalars['Int']>;
};

export type CreateWorkoutTemplateInput = {
  backgroundColor?: InputMaybe<Scalars['String']>;
  exercises: Array<CreateExerciseInput>;
  key: Scalars['String'];
  name: Scalars['String'];
};

export type EditExerciseInput = {
  id?: InputMaybe<Scalars['String']>;
  order?: InputMaybe<Scalars['Int']>;
  sets?: InputMaybe<Array<EditSetTemplateInput>>;
};

export type EditSetTemplateInput = {
  order: Scalars['Int'];
  reps?: InputMaybe<Scalars['Int']>;
  weight?: InputMaybe<Scalars['Int']>;
};

export type EditWorkoutTemplateInput = {
  backgroundColor?: InputMaybe<Scalars['String']>;
  exercises?: InputMaybe<Array<EditExerciseInput>>;
  name?: InputMaybe<Scalars['String']>;
};

export type ExerciseItem = {
  __typename?: 'ExerciseItem';
  category: Scalars['String'];
  exerciseType: Scalars['String'];
};

export type ExerciseTemplate = {
  __typename?: 'ExerciseTemplate';
  exerciseType: Scalars['String'];
  id: Scalars['String'];
  key?: Maybe<Scalars['String']>;
  order: Scalars['Int'];
  sets: Array<SetTemplate>;
};

export type Mutation = {
  __typename?: 'Mutation';
  _blank?: Maybe<Scalars['Boolean']>;
  createSchedules: Array<Schedule>;
  createWorkoutTemplates: Array<WorkoutTemplate>;
  editWorkoutTemplates: Array<WorkoutTemplate>;
  signUp: AuthenticateOutput;
};


export type MutationCreateSchedulesArgs = {
  schedules: Array<CreateScheduleInput>;
};


export type MutationCreateWorkoutTemplatesArgs = {
  workoutTemplates: Array<CreateWorkoutTemplateInput>;
};


export type MutationEditWorkoutTemplatesArgs = {
  edit: EditWorkoutTemplateInput;
  workoutTemplateIds: Array<Scalars['String']>;
};


export type MutationSignUpArgs = {
  email: Scalars['String'];
  password: Scalars['String'];
  username?: InputMaybe<Scalars['String']>;
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
  id: Scalars['String'];
  key?: Maybe<Scalars['String']>;
  name: Scalars['String'];
  workouts?: Maybe<Array<ScheduleWorkout>>;
};

export type ScheduleWorkout = {
  __typename?: 'ScheduleWorkout';
  allDay?: Maybe<Scalars['Boolean']>;
  dow?: Maybe<Scalars['Int']>;
  end?: Maybe<Scalars['String']>;
  id: Scalars['String'];
  start?: Maybe<Scalars['String']>;
  workoutTemplateId?: Maybe<Scalars['String']>;
  workoutTemplateKey?: Maybe<Scalars['String']>;
};

export type SetTemplate = {
  __typename?: 'SetTemplate';
  order: Scalars['Int'];
  reps?: Maybe<Scalars['Int']>;
  weight?: Maybe<Scalars['Int']>;
};

export type User = {
  __typename?: 'User';
  email: Scalars['String'];
  id: Scalars['String'];
  schedules?: Maybe<Array<Schedule>>;
  username?: Maybe<Scalars['String']>;
  workoutTemplates?: Maybe<Array<WorkoutTemplate>>;
};

export type WorkoutTemplate = {
  __typename?: 'WorkoutTemplate';
  backgroundColor?: Maybe<Scalars['String']>;
  exercises: Array<ExerciseTemplate>;
  id: Scalars['String'];
  key?: Maybe<Scalars['String']>;
  name: Scalars['String'];
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
  CreateExerciseInput: CreateExerciseInput;
  CreateScheduleInput: CreateScheduleInput;
  CreateScheduleWorkoutInput: CreateScheduleWorkoutInput;
  CreateSetTemplateInput: CreateSetTemplateInput;
  CreateWorkoutTemplateInput: CreateWorkoutTemplateInput;
  EditExerciseInput: EditExerciseInput;
  EditSetTemplateInput: EditSetTemplateInput;
  EditWorkoutTemplateInput: EditWorkoutTemplateInput;
  ExerciseItem: ResolverTypeWrapper<ExerciseItem>;
  ExerciseTemplate: ResolverTypeWrapper<ExerciseTemplate>;
  Int: ResolverTypeWrapper<Scalars['Int']>;
  Mutation: ResolverTypeWrapper<{}>;
  Query: ResolverTypeWrapper<{}>;
  Schedule: ResolverTypeWrapper<Schedule>;
  ScheduleWorkout: ResolverTypeWrapper<ScheduleWorkout>;
  SetTemplate: ResolverTypeWrapper<SetTemplate>;
  String: ResolverTypeWrapper<Scalars['String']>;
  User: ResolverTypeWrapper<User>;
  WorkoutTemplate: ResolverTypeWrapper<WorkoutTemplate>;
}>;

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = ResolversObject<{
  AuthenticateOutput: AuthenticateOutput;
  Boolean: Scalars['Boolean'];
  CreateExerciseInput: CreateExerciseInput;
  CreateScheduleInput: CreateScheduleInput;
  CreateScheduleWorkoutInput: CreateScheduleWorkoutInput;
  CreateSetTemplateInput: CreateSetTemplateInput;
  CreateWorkoutTemplateInput: CreateWorkoutTemplateInput;
  EditExerciseInput: EditExerciseInput;
  EditSetTemplateInput: EditSetTemplateInput;
  EditWorkoutTemplateInput: EditWorkoutTemplateInput;
  ExerciseItem: ExerciseItem;
  ExerciseTemplate: ExerciseTemplate;
  Int: Scalars['Int'];
  Mutation: {};
  Query: {};
  Schedule: Schedule;
  ScheduleWorkout: ScheduleWorkout;
  SetTemplate: SetTemplate;
  String: Scalars['String'];
  User: User;
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
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type ExerciseTemplateResolvers<ContextType = any, ParentType extends ResolversParentTypes['ExerciseTemplate'] = ResolversParentTypes['ExerciseTemplate']> = ResolversObject<{
  exerciseType?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  key?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  order?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  sets?: Resolver<Array<ResolversTypes['SetTemplate']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type MutationResolvers<ContextType = any, ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation']> = ResolversObject<{
  _blank?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  createSchedules?: Resolver<Array<ResolversTypes['Schedule']>, ParentType, ContextType, RequireFields<MutationCreateSchedulesArgs, 'schedules'>>;
  createWorkoutTemplates?: Resolver<Array<ResolversTypes['WorkoutTemplate']>, ParentType, ContextType, RequireFields<MutationCreateWorkoutTemplatesArgs, 'workoutTemplates'>>;
  editWorkoutTemplates?: Resolver<Array<ResolversTypes['WorkoutTemplate']>, ParentType, ContextType, RequireFields<MutationEditWorkoutTemplatesArgs, 'edit' | 'workoutTemplateIds'>>;
  signUp?: Resolver<ResolversTypes['AuthenticateOutput'], ParentType, ContextType, RequireFields<MutationSignUpArgs, 'email' | 'password'>>;
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
  id?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  key?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  workouts?: Resolver<Maybe<Array<ResolversTypes['ScheduleWorkout']>>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type ScheduleWorkoutResolvers<ContextType = any, ParentType extends ResolversParentTypes['ScheduleWorkout'] = ResolversParentTypes['ScheduleWorkout']> = ResolversObject<{
  allDay?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  dow?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  end?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  start?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  workoutTemplateId?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  workoutTemplateKey?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type SetTemplateResolvers<ContextType = any, ParentType extends ResolversParentTypes['SetTemplate'] = ResolversParentTypes['SetTemplate']> = ResolversObject<{
  order?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  reps?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  weight?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type UserResolvers<ContextType = any, ParentType extends ResolversParentTypes['User'] = ResolversParentTypes['User']> = ResolversObject<{
  email?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  schedules?: Resolver<Maybe<Array<ResolversTypes['Schedule']>>, ParentType, ContextType>;
  username?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  workoutTemplates?: Resolver<Maybe<Array<ResolversTypes['WorkoutTemplate']>>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type WorkoutTemplateResolvers<ContextType = any, ParentType extends ResolversParentTypes['WorkoutTemplate'] = ResolversParentTypes['WorkoutTemplate']> = ResolversObject<{
  backgroundColor?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  exercises?: Resolver<Array<ResolversTypes['ExerciseTemplate']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  key?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
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

