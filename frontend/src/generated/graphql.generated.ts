import { gql } from 'apollo-angular';
import { Injectable } from '@angular/core';
import * as Apollo from 'apollo-angular';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
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
  user?: Maybe<User>;
};

export type CreateExerciseInput = {
  exerciseType: Scalars['String'];
  order: Scalars['Int'];
  sets: Array<CreateSetTemplateInput>;
};

export type CreateSetTemplateInput = {
  order: Scalars['Int'];
  reps?: InputMaybe<Scalars['Int']>;
  weight?: InputMaybe<Scalars['Int']>;
};

export type CreateWorkoutTemplateInput = {
  backgroundColor?: InputMaybe<Scalars['String']>;
  exercises: Array<CreateExerciseInput>;
  name: Scalars['String'];
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
  order?: Maybe<Scalars['Int']>;
  sets: Array<SetTemplate>;
};

export type Mutation = {
  __typename?: 'Mutation';
  _blank?: Maybe<Scalars['Boolean']>;
  createWorkoutTemplates: Array<Maybe<WorkoutTemplate>>;
  signUp: AuthenticateOutput;
};


export type MutationCreateWorkoutTemplatesArgs = {
  workoutTemplates: Array<CreateWorkoutTemplateInput>;
};


export type MutationSignUpArgs = {
  email: Scalars['String'];
  password: Scalars['String'];
  username?: InputMaybe<Scalars['String']>;
};

export type Query = {
  __typename?: 'Query';
  _blank?: Maybe<Scalars['Boolean']>;
  authenticate?: Maybe<User>;
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

export type SetTemplate = {
  __typename?: 'SetTemplate';
  order?: Maybe<Scalars['Int']>;
  reps?: Maybe<Scalars['Int']>;
  weight?: Maybe<Scalars['Int']>;
};

export type User = {
  __typename?: 'User';
  email: Scalars['String'];
  id: Scalars['String'];
  username?: Maybe<Scalars['String']>;
  workoutTemplates?: Maybe<Array<WorkoutTemplate>>;
};

export type WorkoutTemplate = {
  __typename?: 'WorkoutTemplate';
  backgroundColor?: Maybe<Scalars['String']>;
  exercises: Array<ExerciseTemplate>;
  id: Scalars['String'];
  name: Scalars['String'];
};

export type ExerciseItemsQueryVariables = Exact<{ [key: string]: never; }>;


export type ExerciseItemsQuery = { __typename?: 'Query', exerciseItems: Array<{ __typename?: 'ExerciseItem', exerciseType: string, category: string } | null> };

export type LogInQueryVariables = Exact<{
  email: Scalars['String'];
  password: Scalars['String'];
}>;


export type LogInQuery = { __typename?: 'Query', logIn: { __typename?: 'AuthenticateOutput', expiresIn?: number | null, user?: { __typename?: 'User', id: string, username?: string | null, email: string } | null } };

export type AuthenticateQueryVariables = Exact<{ [key: string]: never; }>;


export type AuthenticateQuery = { __typename?: 'Query', authenticate?: { __typename?: 'User', id: string, username?: string | null, email: string } | null };

export type LogOutQueryVariables = Exact<{ [key: string]: never; }>;


export type LogOutQuery = { __typename?: 'Query', logOut: boolean };

export type SignUpMutationVariables = Exact<{
  email: Scalars['String'];
  password: Scalars['String'];
  username?: InputMaybe<Scalars['String']>;
}>;


export type SignUpMutation = { __typename?: 'Mutation', signUp: { __typename?: 'AuthenticateOutput', expiresIn?: number | null, user?: { __typename?: 'User', id: string, username?: string | null, email: string } | null } };

export const ExerciseItemsDocument = gql`
    query ExerciseItems {
  exerciseItems {
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
    user {
      id
      username
      email
    }
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
    id
    username
    email
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
    user {
      id
      username
      email
    }
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