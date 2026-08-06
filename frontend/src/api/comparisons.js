import { request } from './client'

export const compareProducts = products => request('/api/comparisons', { method: 'POST', body: JSON.stringify(products) })
