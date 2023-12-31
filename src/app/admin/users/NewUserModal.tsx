'use client'

import { ChangeEvent } from 'react'
import { useForm } from 'react-hook-form'

import { SignUpRequest, signUpSchema } from '@/@types/auth'
import { Button } from '@/components/Buttons'
import { Input } from '@/components/Input'
import { Checkbox } from '@/components/Input/Checkbox'
import { Modal } from '@/components/Modal'
import { useAxios } from '@/hooks/useAxios'
import { useSnackbar } from '@/hooks/useSnackbar'
import { zodResolver } from '@hookform/resolvers/zod'
import { User } from '@prisma/client'

interface NewUserModalProps {
  open: boolean
  onClose(): void
  onCreate?(user: User): void
}

export function NewUserModal({ open, onClose, onCreate }: NewUserModalProps) {
  const {
    register,
    watch,
    setValue,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<SignUpRequest>({ resolver: zodResolver(signUpSchema) })
  const { open: openSnackbar } = useSnackbar()
  const isAdmin = (watch('roles') || []).includes('ADMIN')

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async function onSubmit({ confirmPassword, ...newUser }: SignUpRequest) {
    const { data: user, error } = await useAxios.post<User>('api/register', newUser)
    if (typeof error === 'string') {
      openSnackbar({
        message: error,
        type: 'error',
        position: 'mid-top'
      })
    } else if (user) {
      onCreate?.(user)
    }
  }

  function toggleAdmin(e: ChangeEvent<HTMLInputElement>) {
    setValue('roles', e.target.checked ? ['ADMIN'] : undefined)
  }

  return (
    <Modal open={open} onClose={onClose} onSubmit={handleSubmit(onSubmit)}>
      <Modal.Content className="min-w-[min(442px,calc(100vw-64px))] pb-0">
        <h2 className="mb-4 text-center text-3xl font-extrabold">Criar um usuário</h2>
        <div className="space-y-2">
          <Input label="username" error={errors.username?.message} {...register('username')} />
          <Input label="Nome completo" error={errors.name?.message} {...register('name')} />
          <Input
            label="email"
            error={errors.email?.message}
            {...register('email', { setValueAs: value => value || undefined })}
          />
          <Input type="password" label="senha" error={errors.password?.message} {...register('password')} />
          <Input
            type="password"
            label="confirme sua senha"
            error={errors.confirmPassword?.message}
            {...register('confirmPassword')}
          />
          <Checkbox label="admin" value="ADMIN" checked={isAdmin} onChange={toggleAdmin} />
        </div>
      </Modal.Content>
      <Modal.Actions>
        <Button type="submit" loading={isSubmitting}>
          Criar
        </Button>
      </Modal.Actions>
    </Modal>
  )
}
