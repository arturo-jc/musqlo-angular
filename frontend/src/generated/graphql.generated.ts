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

export type ExerciseItem = {
  __typename?: 'ExerciseItem';
  category: Scalars['String'];
  exerciseType: Scalars['String'];
};

export type Mutation = {
  __typename?: 'Mutation';
  _blank?: Maybe<Scalars['Boolean']>;
  signUp?: Maybe<User>;
};


export type MutationSignUpArgs = {
  email: Scalars['String'];
  password: Scalars['String'];
  username?: InputMaybe<Scalars['String']>;
};

export type Query = {
  __typename?: 'Query';
  _blank?: Maybe<Scalars['Boolean']>;
  exerciseItem?: Maybe<ExerciseItem>;
  logIn?: Maybe<User>;
};


export type QueryExerciseItemArgs = {
  exerciseType: Scalars['String'];
};


export type QueryLogInArgs = {
  email: Scalars['String'];
  password: Scalars['String'];
  username?: InputMaybe<Scalars['String']>;
};

export type User = {
  __typename?: 'User';
  email?: Maybe<Scalars['String']>;
  id?: Maybe<Scalars['String']>;
  username?: Maybe<Scalars['String']>;
};

export type LogInQueryVariables = Exact<{
  email: Scalars['String'];
  password: Scalars['String'];
}>;


export type LogInQuery = { __typename?: 'Query', logIn?: { __typename?: 'User', id?: string | null, username?: string | null, email?: string | null } | null };

export type SignUpMutationVariables = Exact<{
  email: Scalars['String'];
  password: Scalars['String'];
  username?: InputMaybe<Scalars['String']>;
}>;


export type SignUpMutation = { __typename?: 'Mutation', signUp?: { __typename?: 'User', id?: string | null, username?: string | null, email?: string | null } | null };

export const LogInDocument = gql`
    query logIn($email: String!, $password: String!) {
  logIn(email: $email, password: $password) {
    id
    username
    email
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
export const SignUpDocument = gql`
    mutation signUp($email: String!, $password: String!, $username: String) {
  signUp(email: $email, password: $password, username: $username) {
    id
    username
    email
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