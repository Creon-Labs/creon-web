import { zodResolver } from '@hookform/resolvers/zod'
import {
  useForm,
  type FieldValues,
  type UseFormProps,
  type UseFormReturn,
} from 'react-hook-form'
import type * as z from 'zod'

type HookFormSchema = z.ZodType<FieldValues, FieldValues>

export type UseHookFormProps<TSchema extends HookFormSchema> = Omit<
  UseFormProps<z.input<TSchema>, unknown, z.output<TSchema>>,
  'resolver'
> & {
  schema: TSchema
}

export function useHookForm<TSchema extends HookFormSchema>({
  schema,
  ...formProps
}: UseHookFormProps<TSchema>): UseFormReturn<
  z.input<TSchema>,
  unknown,
  z.output<TSchema>
> {
  return useForm<z.input<TSchema>, unknown, z.output<TSchema>>({
    ...formProps,
    resolver: zodResolver(schema),
  })
}