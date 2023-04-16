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

export type ExerciseItem = {
  __typename?: 'ExerciseItem';
  category: Scalars['String'];
  exerciseType: Scalars['String'];
};

export type Mutation = {
  __typename?: 'Mutation';
  _blank?: Maybe<Scalars['Boolean']>;
  signUp?: Maybe<AuthenticateOutput>;
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
  logIn?: Maybe<AuthenticateOutput>;
  logOut?: Maybe<Scalars['Boolean']>;
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

export type ExerciseItemsQueryVariables = Exact<{ [key: string]: never; }>;


export type ExerciseItemsQuery = { __typename?: 'Query', exerciseItems: Array<{ __typename?: 'ExerciseItem', exerciseType: string, category: string } | null> };

export type LogInQueryVariables = Exact<{
  email: Scalars['String'];
  password: Scalars['String'];
}>;


export type LogInQuery = { __typename?: 'Query', logIn?: { __typename?: 'AuthenticateOutput', expiresIn?: number | null, user?: { __typename?: 'User', id?: string | null, username?: string | null, email?: string | null } | null } | null };

export type AuthenticateQueryVariables = Exact<{ [key: string]: never; }>;


export type AuthenticateQuery = { __typename?: 'Query', authenticate?: { __typename?: 'User', id?: string | null, username?: string | null, email?: string | null } | null };

export type LogOutQueryVariables = Exact<{ [key: string]: never; }>;


export type LogOutQuery = { __typename?: 'Query', logOut?: boolean | null };

export type SignUpMutationVariables = Exact<{
  email: Scalars['String'];
  password: Scalars['String'];
  username?: InputMaybe<Scalars['String']>;
}>;


export type SignUpMutation = { __typename?: 'Mutation', signUp?: { __typename?: 'AuthenticateOutput', expiresIn?: number | null, user?: { __typename?: 'User', id?: string | null, username?: string | null, email?: string | null } | null } | null };

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