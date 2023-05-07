import { gql } from 'apollo-angular';
import { Injectable } from '@angular/core';
import * as Apollo from 'apollo-angular';
export type Maybe<T> = T | null;
export type InputMaybe<T> = T | null | undefined;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
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
  id: Scalars['String'];
  key?: Maybe<Scalars['String']>;
  name: Scalars['String'];
  order: Scalars['Int'];
  setTemplates?: Maybe<Array<SetTemplate>>;
  workoutTemplateId: Scalars['String'];
};

export type Mutation = {
  __typename?: 'Mutation';
  _blank?: Maybe<Scalars['Boolean']>;
  createSchedules: Array<Schedule>;
  createWorkoutTemplates: Array<WorkoutTemplate>;
  signUp: AuthenticateOutput;
  updateExerciseTemplates: Array<ExerciseTemplate>;
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
  exerciseTemplateIds: Array<Scalars['String']>;
  update: UpdateExerciseTemplateInput;
};


export type MutationUpdateSetTemplatesArgs = {
  setTemplateIds: Array<Scalars['String']>;
  update: UpdateSetTemplateInput;
};


export type MutationUpdateWorkoutTemplatesArgs = {
  update: UpdateWorkoutTemplateInput;
  workoutTemplateIds: Array<Scalars['String']>;
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
  category?: Maybe<Scalars['String']>;
  exerciseItemId: Scalars['String'];
  exerciseTemplateId: Scalars['String'];
  exerciseType?: Maybe<Scalars['String']>;
  id: Scalars['String'];
  order: Scalars['Int'];
  reps?: Maybe<Scalars['Int']>;
  weight?: Maybe<Scalars['Int']>;
};

export type UpdateExerciseTemplateInput = {
  addSetTemplates?: InputMaybe<Array<CreateSetTemplateInput>>;
  order?: InputMaybe<Scalars['Int']>;
  removeSetTemplates?: InputMaybe<Array<Scalars['String']>>;
};

export type UpdateSetTemplateInput = {
  order: Scalars['Int'];
  reps?: InputMaybe<Scalars['Int']>;
  weight?: InputMaybe<Scalars['Int']>;
};

export type UpdateWorkoutTemplateInput = {
  addExerciseTemplates?: InputMaybe<Array<CreateExerciseTemplateInput>>;
  backgroundColor?: InputMaybe<Scalars['String']>;
  name?: InputMaybe<Scalars['String']>;
  removeExerciseTemplates?: InputMaybe<Array<Scalars['String']>>;
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
  exerciseTemplates?: Maybe<Array<ExerciseTemplate>>;
  id: Scalars['String'];
  key?: Maybe<Scalars['String']>;
  name: Scalars['String'];
  userId: Scalars['String'];
};

export type ExerciseItemsQueryVariables = Exact<{ [key: string]: never; }>;


export type ExerciseItemsQuery = { __typename?: 'Query', exerciseItems: Array<{ __typename?: 'ExerciseItem', id: string, exerciseType: string, category: string } | null> };

export type LogInQueryVariables = Exact<{
  email: Scalars['String'];
  password: Scalars['String'];
}>;


export type LogInQuery = { __typename?: 'Query', logIn: { __typename?: 'AuthenticateOutput', userId: string, userEmail: string, username?: string | null, expiresIn?: number | null } };

export type AuthenticateQueryVariables = Exact<{ [key: string]: never; }>;


export type AuthenticateQuery = { __typename?: 'Query', authenticate?: { __typename?: 'AuthenticateOutput', userId: string, userEmail: string, username?: string | null, expiresIn?: number | null } | null };

export type LogOutQueryVariables = Exact<{ [key: string]: never; }>;


export type LogOutQuery = { __typename?: 'Query', logOut: boolean };

export type SignUpMutationVariables = Exact<{
  email: Scalars['String'];
  password: Scalars['String'];
  username?: InputMaybe<Scalars['String']>;
}>;


export type SignUpMutation = { __typename?: 'Mutation', signUp: { __typename?: 'AuthenticateOutput', userId: string, userEmail: string, username?: string | null, expiresIn?: number | null } };

export type FullExerciseTemplateFragment = { __typename?: 'ExerciseTemplate', id: string, name: string, order: number, setTemplates?: Array<{ __typename?: 'SetTemplate', id: string, exerciseTemplateId: string, exerciseItemId: string, exerciseType?: string | null, reps?: number | null, weight?: number | null, order: number }> | null };

export type BaseExerciseTemplateFragment = { __typename?: 'ExerciseTemplate', id: string, name: string, order: number };

export type ExerciseTemplate_SetTemplatesFragment = { __typename?: 'ExerciseTemplate', setTemplates?: Array<{ __typename?: 'SetTemplate', id: string, exerciseTemplateId: string, exerciseItemId: string, exerciseType?: string | null, reps?: number | null, weight?: number | null, order: number }> | null };

export type CreateSchedulesMutationVariables = Exact<{
  schedules: Array<CreateScheduleInput> | CreateScheduleInput;
}>;


export type CreateSchedulesMutation = { __typename?: 'Mutation', createSchedules: Array<{ __typename?: 'Schedule', id: string, key?: string | null, name: string, workouts?: Array<{ __typename?: 'ScheduleWorkout', id: string, workoutTemplateId?: string | null, workoutTemplateKey?: string | null, dow?: number | null, allDay?: boolean | null, start?: string | null, end?: string | null }> | null }> };

export type FullScheduleFragment = { __typename?: 'Schedule', id: string, key?: string | null, name: string, workouts?: Array<{ __typename?: 'ScheduleWorkout', id: string, workoutTemplateId?: string | null, workoutTemplateKey?: string | null, dow?: number | null, allDay?: boolean | null, start?: string | null, end?: string | null }> | null };

export type BaseScheduleFragment = { __typename?: 'Schedule', id: string, key?: string | null, name: string };

export type Schedule_ScheduleWorkoutsFragment = { __typename?: 'Schedule', workouts?: Array<{ __typename?: 'ScheduleWorkout', id: string, workoutTemplateId?: string | null, workoutTemplateKey?: string | null, dow?: number | null, allDay?: boolean | null, start?: string | null, end?: string | null }> | null };

export type FullScheduleWorkoutFragment = { __typename?: 'ScheduleWorkout', id: string, workoutTemplateId?: string | null, workoutTemplateKey?: string | null, dow?: number | null, allDay?: boolean | null, start?: string | null, end?: string | null };

export type BaseScheduleWorkoutFragment = { __typename?: 'ScheduleWorkout', id: string, workoutTemplateId?: string | null, workoutTemplateKey?: string | null, dow?: number | null, allDay?: boolean | null, start?: string | null, end?: string | null };

export type FullSetTemplateFragment = { __typename?: 'SetTemplate', id: string, exerciseTemplateId: string, exerciseItemId: string, exerciseType?: string | null, reps?: number | null, weight?: number | null, order: number };

export type BaseSetTemplateFragment = { __typename?: 'SetTemplate', id: string, exerciseTemplateId: string, exerciseItemId: string, exerciseType?: string | null, reps?: number | null, weight?: number | null, order: number };

export type UserWorkoutTemplatesQueryVariables = Exact<{
  userId: Scalars['String'];
}>;


export type UserWorkoutTemplatesQuery = { __typename?: 'Query', user?: { __typename?: 'User', id: string, workoutTemplates?: Array<{ __typename?: 'WorkoutTemplate', id: string, name: string, backgroundColor?: string | null, key?: string | null, exerciseTemplates?: Array<{ __typename?: 'ExerciseTemplate', id: string, name: string, order: number, setTemplates?: Array<{ __typename?: 'SetTemplate', id: string, exerciseTemplateId: string, exerciseItemId: string, exerciseType?: string | null, reps?: number | null, weight?: number | null, order: number }> | null }> | null }> | null } | null };

export type UserSchedulesQueryVariables = Exact<{
  userId: Scalars['String'];
}>;


export type UserSchedulesQuery = { __typename?: 'Query', user?: { __typename?: 'User', id: string, schedules?: Array<{ __typename?: 'Schedule', id: string, key?: string | null, name: string, workouts?: Array<{ __typename?: 'ScheduleWorkout', id: string, workoutTemplateId?: string | null, workoutTemplateKey?: string | null, dow?: number | null, allDay?: boolean | null, start?: string | null, end?: string | null }> | null }> | null } | null };

export type FullUserFragment = { __typename?: 'User', id: string, workoutTemplates?: Array<{ __typename?: 'WorkoutTemplate', id: string, name: string, backgroundColor?: string | null, key?: string | null, exerciseTemplates?: Array<{ __typename?: 'ExerciseTemplate', id: string, name: string, order: number, setTemplates?: Array<{ __typename?: 'SetTemplate', id: string, exerciseTemplateId: string, exerciseItemId: string, exerciseType?: string | null, reps?: number | null, weight?: number | null, order: number }> | null }> | null }> | null };

export type BaseUserFragment = { __typename?: 'User', id: string };

export type User_WorkoutTemplatesFragment = { __typename?: 'User', workoutTemplates?: Array<{ __typename?: 'WorkoutTemplate', id: string, name: string, backgroundColor?: string | null, key?: string | null, exerciseTemplates?: Array<{ __typename?: 'ExerciseTemplate', id: string, name: string, order: number, setTemplates?: Array<{ __typename?: 'SetTemplate', id: string, exerciseTemplateId: string, exerciseItemId: string, exerciseType?: string | null, reps?: number | null, weight?: number | null, order: number }> | null }> | null }> | null };

export type CreateWorkoutTemplatesMutationVariables = Exact<{
  workoutTemplates: Array<CreateWorkoutTemplateInput> | CreateWorkoutTemplateInput;
}>;


export type CreateWorkoutTemplatesMutation = { __typename?: 'Mutation', createWorkoutTemplates: Array<{ __typename?: 'WorkoutTemplate', id: string, name: string, backgroundColor?: string | null, key?: string | null, exerciseTemplates?: Array<{ __typename?: 'ExerciseTemplate', id: string, name: string, order: number, setTemplates?: Array<{ __typename?: 'SetTemplate', id: string, exerciseTemplateId: string, exerciseItemId: string, exerciseType?: string | null, reps?: number | null, weight?: number | null, order: number }> | null }> | null }> };

export type FullWorkoutTemplateFragment = { __typename?: 'WorkoutTemplate', id: string, name: string, backgroundColor?: string | null, key?: string | null, exerciseTemplates?: Array<{ __typename?: 'ExerciseTemplate', id: string, name: string, order: number, setTemplates?: Array<{ __typename?: 'SetTemplate', id: string, exerciseTemplateId: string, exerciseItemId: string, exerciseType?: string | null, reps?: number | null, weight?: number | null, order: number }> | null }> | null };

export type BaseWorkoutTemplateFragment = { __typename?: 'WorkoutTemplate', id: string, name: string, backgroundColor?: string | null, key?: string | null };

export type WorkoutTemplate_ExerciseTemplatesFragment = { __typename?: 'WorkoutTemplate', exerciseTemplates?: Array<{ __typename?: 'ExerciseTemplate', id: string, name: string, order: number, setTemplates?: Array<{ __typename?: 'SetTemplate', id: string, exerciseTemplateId: string, exerciseItemId: string, exerciseType?: string | null, reps?: number | null, weight?: number | null, order: number }> | null }> | null };

export const BaseScheduleFragmentDoc = gql`
    fragment BaseSchedule on Schedule {
  id
  key
  name
}
    `;
export const BaseScheduleWorkoutFragmentDoc = gql`
    fragment BaseScheduleWorkout on ScheduleWorkout {
  id
  workoutTemplateId
  workoutTemplateKey
  dow
  allDay
  start
  end
}
    `;
export const Schedule_ScheduleWorkoutsFragmentDoc = gql`
    fragment Schedule_ScheduleWorkouts on Schedule {
  workouts {
    ...BaseScheduleWorkout
  }
}
    ${BaseScheduleWorkoutFragmentDoc}`;
export const FullScheduleFragmentDoc = gql`
    fragment FullSchedule on Schedule {
  ...BaseSchedule
  ...Schedule_ScheduleWorkouts
}
    ${BaseScheduleFragmentDoc}
${Schedule_ScheduleWorkoutsFragmentDoc}`;
export const FullScheduleWorkoutFragmentDoc = gql`
    fragment FullScheduleWorkout on ScheduleWorkout {
  ...BaseScheduleWorkout
}
    ${BaseScheduleWorkoutFragmentDoc}`;
export const BaseSetTemplateFragmentDoc = gql`
    fragment BaseSetTemplate on SetTemplate {
  id
  exerciseTemplateId
  exerciseItemId
  exerciseType
  reps
  weight
  order
}
    `;
export const FullSetTemplateFragmentDoc = gql`
    fragment FullSetTemplate on SetTemplate {
  ...BaseSetTemplate
}
    ${BaseSetTemplateFragmentDoc}`;
export const BaseUserFragmentDoc = gql`
    fragment BaseUser on User {
  id
}
    `;
export const BaseWorkoutTemplateFragmentDoc = gql`
    fragment BaseWorkoutTemplate on WorkoutTemplate {
  id
  name
  backgroundColor
  key
}
    `;
export const BaseExerciseTemplateFragmentDoc = gql`
    fragment BaseExerciseTemplate on ExerciseTemplate {
  id
  name
  order
}
    `;
export const ExerciseTemplate_SetTemplatesFragmentDoc = gql`
    fragment ExerciseTemplate_SetTemplates on ExerciseTemplate {
  setTemplates {
    ...BaseSetTemplate
  }
}
    ${BaseSetTemplateFragmentDoc}`;
export const FullExerciseTemplateFragmentDoc = gql`
    fragment FullExerciseTemplate on ExerciseTemplate {
  ...BaseExerciseTemplate
  ...ExerciseTemplate_SetTemplates
}
    ${BaseExerciseTemplateFragmentDoc}
${ExerciseTemplate_SetTemplatesFragmentDoc}`;
export const WorkoutTemplate_ExerciseTemplatesFragmentDoc = gql`
    fragment WorkoutTemplate_ExerciseTemplates on WorkoutTemplate {
  exerciseTemplates {
    ...FullExerciseTemplate
  }
}
    ${FullExerciseTemplateFragmentDoc}`;
export const FullWorkoutTemplateFragmentDoc = gql`
    fragment FullWorkoutTemplate on WorkoutTemplate {
  ...BaseWorkoutTemplate
  ...WorkoutTemplate_ExerciseTemplates
}
    ${BaseWorkoutTemplateFragmentDoc}
${WorkoutTemplate_ExerciseTemplatesFragmentDoc}`;
export const User_WorkoutTemplatesFragmentDoc = gql`
    fragment User_WorkoutTemplates on User {
  workoutTemplates {
    ...FullWorkoutTemplate
  }
}
    ${FullWorkoutTemplateFragmentDoc}`;
export const FullUserFragmentDoc = gql`
    fragment FullUser on User {
  ...BaseUser
  ...User_WorkoutTemplates
}
    ${BaseUserFragmentDoc}
${User_WorkoutTemplatesFragmentDoc}`;
export const ExerciseItemsDocument = gql`
    query ExerciseItems {
  exerciseItems {
    id
    exerciseType
    category
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class ExerciseItemsGQL extends Apollo.Query<ExerciseItemsQuery, ExerciseItemsQueryVariables> {
    override document = ExerciseItemsDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const LogInDocument = gql`
    query LogIn($email: String!, $password: String!) {
  logIn(email: $email, password: $password) {
    userId
    userEmail
    username
    expiresIn
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class LogInGQL extends Apollo.Query<LogInQuery, LogInQueryVariables> {
    override document = LogInDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const AuthenticateDocument = gql`
    query Authenticate {
  authenticate {
    userId
    userEmail
    username
    expiresIn
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class AuthenticateGQL extends Apollo.Query<AuthenticateQuery, AuthenticateQueryVariables> {
    override document = AuthenticateDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const LogOutDocument = gql`
    query LogOut {
  logOut
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class LogOutGQL extends Apollo.Query<LogOutQuery, LogOutQueryVariables> {
    override document = LogOutDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const SignUpDocument = gql`
    mutation SignUp($email: String!, $password: String!, $username: String) {
  signUp(email: $email, password: $password, username: $username) {
    userId
    userEmail
    username
    expiresIn
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class SignUpGQL extends Apollo.Mutation<SignUpMutation, SignUpMutationVariables> {
    override document = SignUpDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const CreateSchedulesDocument = gql`
    mutation CreateSchedules($schedules: [CreateScheduleInput!]!) {
  createSchedules(schedules: $schedules) {
    ...FullSchedule
  }
}
    ${FullScheduleFragmentDoc}`;

  @Injectable({
    providedIn: 'root'
  })
  export class CreateSchedulesGQL extends Apollo.Mutation<CreateSchedulesMutation, CreateSchedulesMutationVariables> {
    override document = CreateSchedulesDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const UserWorkoutTemplatesDocument = gql`
    query UserWorkoutTemplates($userId: String!) {
  user(userId: $userId) {
    ...FullUser
  }
}
    ${FullUserFragmentDoc}`;

  @Injectable({
    providedIn: 'root'
  })
  export class UserWorkoutTemplatesGQL extends Apollo.Query<UserWorkoutTemplatesQuery, UserWorkoutTemplatesQueryVariables> {
    override document = UserWorkoutTemplatesDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const UserSchedulesDocument = gql`
    query UserSchedules($userId: String!) {
  user(userId: $userId) {
    id
    schedules {
      ...FullSchedule
    }
  }
}
    ${FullScheduleFragmentDoc}`;

  @Injectable({
    providedIn: 'root'
  })
  export class UserSchedulesGQL extends Apollo.Query<UserSchedulesQuery, UserSchedulesQueryVariables> {
    override document = UserSchedulesDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const CreateWorkoutTemplatesDocument = gql`
    mutation CreateWorkoutTemplates($workoutTemplates: [CreateWorkoutTemplateInput!]!) {
  createWorkoutTemplates(workoutTemplates: $workoutTemplates) {
    ...FullWorkoutTemplate
  }
}
    ${FullWorkoutTemplateFragmentDoc}`;

  @Injectable({
    providedIn: 'root'
  })
  export class CreateWorkoutTemplatesGQL extends Apollo.Mutation<CreateWorkoutTemplatesMutation, CreateWorkoutTemplatesMutationVariables> {
    override document = CreateWorkoutTemplatesDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }