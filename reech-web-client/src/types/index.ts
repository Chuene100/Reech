export interface SearchParamOptions {
  email: string;
  name: string;
  address: string;
  role: string;
  position: string;
  status: string;
  is_active: string;
}

export interface QueryOptions {
  page: number;
  limit: number;
}

export interface PaginatorInfo<T> {
  page: number;
  data: T[];
  first_page_url: string;
  from: number;
  last_page: number;
  last_page_url: string;
  links: any;
  next_page_url: string | null;
  path: string;
  items_per_page: number;
  prev_page_url: string | null;
  to: number;
  total: number;
}

export interface UserQueryOptions extends QueryOptions {
  sortedBy: string;
  orderBy: string;
  name: string;
  role: string;
  email: string;
  address: string;
}

export interface OpportunityQueryOptions extends QueryOptions {
  sortedBy: string;
  orderBy: string;
  owner_id: string;
  name: string
}

export interface LoginUserInput {
  email: string;
  password: string;
}


export interface AuthResponse {
  access: string;
  refresh: string;
}

export type User = {
  token: {
    access_token: string
    refresh_token: string
  }
  user: {
    _id: string
    id: string
    profileID: any[]
    firstName: string
    lastName: string
    email: string
    phoneNumber: string
    identityNumber: string
    dateOfBirth: string
    empStatus: string
    verified: boolean
    __v?: number
    createdAt: string
    updatedAt: string
    profileImage: string
    coverImage: string
    address: string
    blurb: string
  }
  message: string
}

export interface UpdateUserInput extends Partial<User> {
  id: string;
}

export type Tag = {

}

export type Skill = {
  _id: string
  skillName: string
  tags: any[]
  createdAt: string
  updatedAt: string
  __v: number
  id: string

}

export type Application = {


}

export type Opportunity = {
  _id: string
  oppTitle: string
  companyName: string
  discipline: string
  applicationLink: string
  oppDescription: string
  tags: any[]
  deadline: string
  verified: boolean
  notifyBubble: boolean
  postIncognito: boolean
  reechResidentsOnly: boolean
  maxApplicants: number
  oppLocation: string
  oppExperience: string
  oppDate: string
  oppEducation: string
  jobType: string
  hoursPerWeek: number
  oppDuration: string
  salary: number
  paymentRate: string
  paymentDuration: string
  createdAt: string
  updatedAt: string
  __v: number
  oppImage: string
  oppRate: string
  skills: Skill[]
  applications: Application[]
  id: string
}


export interface UserPaginator extends PaginatorInfo<User> {}
export interface OpportunityPaginator extends PaginatorInfo<Opportunity> {}
