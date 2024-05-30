import { curry } from 'ramda'
import axios, { AxiosResponse } from 'axios'

const range = (start: number) => (end: number): number[] => {
    return start < end ? Array.from({ length: end - start + 1 }, (_, i) => start + i) : []
}
const filter = <T>(pred: (a:T) => boolean) => (arr: T[]): T[] => arr.filter(pred)
const sum = (arr: number[]): number => arr.reduce((acc, n) => acc + n, 0)

export const calculateFP = (bottom: number) => (top: number): number =>
    sum(filter<number>((n) => n % 2 === 0)(range(bottom)(top)))

const makeRequest = curry(<T = unknown>(
    baseUrl: string,
    path: string,
    method: 'GET' | 'POST' | 'PUT' | 'DELETE',
    data: unknown
): Promise<AxiosResponse<T>> => axios.request<T>({ url: `${baseUrl}${path}`, method, data } ))

const requestToGitHub = makeRequest('https://api.github.com')
const getGitHubUser = requestToGitHub('/users', 'GET')

const makeGHUserRequest = requestToGitHub('/users')
const createNewGhUser = makeGHUserRequest('POST')
const createdUser = createNewGhUser({ name: 'John Doe', email: 'mr-cool@gmail.com' });



console.log(getGitHubUser())
console.log(createdUser)

