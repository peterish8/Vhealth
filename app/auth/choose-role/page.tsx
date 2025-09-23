'use client'

import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { User, Stethoscope } from 'lucide-react'

export default function ChooseRole() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle>Choose Your Role</CardTitle>
          <p className="text-gray-600">Select how you want to use VHealth</p>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button
            onClick={() => router.push('/patient/register')}
            variant="outline"
            className="w-full h-16 flex items-center gap-3"
          >
            <User className="h-6 w-6" />
            <div className="text-left">
              <div className="font-semibold">I'm a Patient</div>
              <div className="text-sm text-gray-600">Access my health records</div>
            </div>
          </Button>

          <Button
            onClick={() => router.push('/doctor/register')}
            variant="outline"
            className="w-full h-16 flex items-center gap-3"
          >
            <Stethoscope className="h-6 w-6" />
            <div className="text-left">
              <div className="font-semibold">I'm a Doctor</div>
              <div className="text-sm text-gray-600">Manage patient care</div>
            </div>
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}