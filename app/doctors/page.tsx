'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Stethoscope, MapPin, Clock, DollarSign } from 'lucide-react'

interface Doctor {
  id: string
  doc_id: string
  name: string
  email: string
  specialization: string
  hospital: string
  license_no: string
  experience_years: number
  consultation_fee: number
  available_days: string[]
}

export default function DoctorsPage() {
  const [doctors, setDoctors] = useState<Doctor[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const { data, error } = await supabase
          .from('doctors')
          .select('*')
          .order('name')

        if (error) throw error
        setDoctors(data || [])
      } catch (error) {
        console.error('Error fetching doctors:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchDoctors()
  }, [supabase])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading doctors...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Our Doctors</h1>
          <p className="text-gray-600">Find the right specialist for your healthcare needs</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {doctors.map((doctor) => (
            <Card key={doctor.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{doctor.name}</CardTitle>
                  <Badge variant="secondary">{doctor.doc_id}</Badge>
                </div>
                <div className="flex items-center gap-2 text-blue-600">
                  <Stethoscope className="h-4 w-4" />
                  <span className="font-medium">{doctor.specialization}</span>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2 text-gray-600">
                  <MapPin className="h-4 w-4" />
                  <span className="text-sm">{doctor.hospital}</span>
                </div>
                
                <div className="flex items-center gap-2 text-gray-600">
                  <Clock className="h-4 w-4" />
                  <span className="text-sm">{doctor.experience_years} years experience</span>
                </div>

                <div className="flex items-center gap-2 text-green-600">
                  <DollarSign className="h-4 w-4" />
                  <span className="text-sm font-medium">₹{doctor.consultation_fee} consultation</span>
                </div>

                <div>
                  <p className="text-sm text-gray-600 mb-2">Available Days:</p>
                  <div className="flex flex-wrap gap-1">
                    {doctor.available_days.map((day) => (
                      <Badge key={day} variant="outline" className="text-xs">
                        {day}
                      </Badge>
                    ))}
                  </div>
                </div>

                <Button className="w-full mt-4">
                  Book Appointment
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}