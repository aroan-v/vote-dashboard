import { format, parseISO } from 'date-fns'

export const getDate = (isoDate) => {
  return format(parseISO(isoDate), 'MMM d') // Aug 13, Aug 14
}
