import axios from 'axios'
import { User } from '../../../types'
import {UserModel} from './_models'
import { API_ENDPOINTS } from '@/rest-api/client/api-endpoints'

const API_URL = process.env.REACT_APP_API_URL

export const LOGIN_URL = `${API_URL}${API_ENDPOINTS.LOGIN_URL}`
export const REGISTER_URL = `${API_URL}${API_ENDPOINTS.SIGNUP_URL}`
export const REQUEST_PASSWORD_URL = `${API_URL}/forgot_password`

// Server should return UserModel
export function login(email: string, password: string) {
  return axios.post<UserModel>(LOGIN_URL, {
    email,
    password,
  })
}

// Server should return UserModel
export function register(
  email: string,
  fullname: string,
  username: string,
  password: string,
  password_confirmation: string
) {
  return axios.post(REGISTER_URL, {
    email,
    name: fullname,
    username: username,
    password,
    password_confirmation,
  })
}

// Server should return object => { result: boolean } (Is Email in DB)
export function requestPassword(email: string) {
  return axios.post<{result: boolean}>(REQUEST_PASSWORD_URL, {
    email,
  })
}