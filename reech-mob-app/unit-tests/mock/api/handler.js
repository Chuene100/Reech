import { rest } from 'msw'
const API_BASE_URL = process.env.REACT_APP_API_URL;

const dummyRespnseData = [
  { id: "a747d83d2aa3e34c33", name: "Graduation photography contract", deadline: "21/04/2023" },
  { id: "a747d83d2aa3e34c33", name: "Accounting job (long term)", deadline: "11/05/2023" },
]

export const handlers = [
  rest.get(`${API_BASE_URL}/*`, (req, res, ctx) => {
    return res(ctx.status(200), ctx.json(dummyRespnseData))
  })
]
