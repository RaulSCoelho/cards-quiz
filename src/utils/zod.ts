import { formatMoney } from 'accounting'
import z, { ZodError } from 'zod'

interface StringProps {
  field: string
  min?: number
  max?: number
}

export function boundedString({ field, min, max }: StringProps) {
  let schema = z.string({ required_error: `${field} é obrigatório` })
  if (min) schema = schema.min(min, `${field} deve ter pelo menos ${min} caractere${min > 1 ? 's' : ''}.`)
  if (max) schema = schema.max(max, `${field} deve ter no máximo ${max} caractere${max > 1 ? 's' : ''}.`)
  return schema
}

export const nullableString = ({ field, min, max }: StringProps) =>
  z
    .union([boundedString({ field, min, max }), z.string().length(0)])
    .optional()
    .transform(value => value || undefined)

type PriceProps = {
  name: string
} & StringProps

export const price = ({ name, field, min, max }: PriceProps) => {
  return boundedString({ field: name, min, max }).transform(value => {
    if (/[^0-9.,$ ]/.test(value)) {
      throw new ZodError([{ code: 'custom', path: [field], message: `${name} contém caracteres inválidos` }])
    } else {
      return formatMoney(value, '$', 2)
    }
  })
}

export const priceNullable = ({ name, field, min, max }: PriceProps) => {
  return nullableString({ field: name, min, max }).transform(value => {
    if (value) {
      if (/[^0-9.,$ ]/.test(value)) {
        throw new ZodError([{ code: 'custom', path: [field], message: `${name} contém caracteres inválidos` }])
      } else {
        return formatMoney(value, '$', 2)
      }
    }
  })
}
