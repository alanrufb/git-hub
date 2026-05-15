'use client'

import { useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { TrendingUp, CheckCircle, Mail, MailWarning } from 'lucide-react'

export default function RegisterPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    if (password.length < 6) {
      setError('A senha deve ter pelo menos 6 caracteres.')
      setLoading(false)
      return
    }

    const supabase = createClient()
    const { error } = await supabase.auth.signUp({ email, password })

    if (error) {
      setError(error.message)
      setLoading(false)
      return
    }

    setSuccess(true)
    setLoading(false)
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
        <Card className="w-full max-w-md shadow-xl">
          <CardContent className="pt-8 pb-8 space-y-5 text-center">
            <CheckCircle className="h-14 w-14 text-green-500 mx-auto" />
            <div>
              <h2 className="text-xl font-bold text-gray-900">Quase lá!</h2>
              <p className="text-gray-600 mt-1">
                Enviamos um link de confirmação para <strong>{email}</strong>.
              </p>
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 text-left space-y-2">
              <div className="flex items-center gap-2 text-amber-700 font-medium text-sm">
                <MailWarning className="h-4 w-4 flex-shrink-0" />
                Verifique sua caixa de spam
              </div>
              <p className="text-amber-700 text-sm">
                O email de confirmação às vezes cai na pasta de <strong>spam</strong> ou
                <strong> lixo eletrônico</strong>. Se não encontrar na caixa de entrada,
                procure lá antes de tentar novamente.
              </p>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-left">
              <p className="text-blue-700 text-sm">
                Após clicar no link do email, você será redirecionado para entrar na sua conta.
              </p>
            </div>

            <Link href="/login">
              <Button className="bg-blue-600 hover:bg-blue-700 w-full">
                Ir para o login
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="text-center pb-2">
          <div className="flex items-center justify-center gap-2 mb-2">
            <div className="bg-blue-600 text-white p-2 rounded-lg">
              <TrendingUp className="h-5 w-5" />
            </div>
            <span className="text-xl font-bold text-gray-900">FinançasPessoais</span>
          </div>
          <CardTitle className="text-2xl">Criar conta</CardTitle>
          <CardDescription>Comece a organizar suas finanças hoje</CardDescription>
        </CardHeader>
        <CardContent className="pt-4">
          <div className="flex items-start gap-2 bg-blue-50 border border-blue-200 rounded-lg px-3 py-2.5 mb-4">
            <Mail className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
            <p className="text-sm text-blue-700">
              Após o cadastro, enviaremos um <strong>email de confirmação</strong>. Verifique também
              a pasta de <strong>spam</strong> caso não encontre na caixa de entrada.
            </p>
          </div>

          <form onSubmit={handleRegister} className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <Input
                id="password"
                type="password"
                placeholder="Mínimo 6 caracteres"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700" disabled={loading}>
              {loading ? 'Criando...' : 'Criar conta'}
            </Button>
          </form>
          <p className="text-center text-sm text-gray-600 mt-4">
            Já tem conta?{' '}
            <Link href="/login" className="text-blue-600 hover:underline font-medium">
              Entrar
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
