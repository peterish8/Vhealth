'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { toast } from 'sonner'

const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']
const CHRONIC_CONDITIONS = ['Diabetes', 'Hypertension', 'Asthma', 'Heart Disease', 'Arthritis', 'Thyroid', 'Other']

export default function PatientRegister() {
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const [formData, setFormData] = useState({
    name: '',
    dateOfBirth: '',
    gender: '',
    contactNumber: '',
    email: '',
    address: '',
    bloodGroup: '',
    allergies: '',
    chronicConditions: [] as string[],
    currentMedications: '',
    emergencyContactName: '',
    emergencyContactNumber: '',
    insuranceProvider: '',
    insurancePolicyNo: ''
  })

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleConditionChange = (condition: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      chronicConditions: checked 
        ? [...prev.chronicConditions, condition]
        : prev.chronicConditions.filter(c => c !== condition)
    }))
  }

  const validateStep = (currentStep: number) => {
    switch (currentStep) {
      case 1:
        return formData.name && formData.dateOfBirth && formData.gender && formData.contactNumber && formData.email
      case 2:
        return formData.bloodGroup && formData.emergencyContactName && formData.emergencyContactNumber
      default:
        return true
    }
  }

  const nextStep = () => {
    if (validateStep(step)) {
      setStep(prev => prev + 1)
    } else {
      toast.error('Please fill in all required fields')
    }
  }

  const prevStep = () => setStep(prev => prev - 1)

  const handleSubmit = async () => {
    if (!validateStep(step)) {
      toast.error('Please fill in all required fields')
      return
    }

    setLoading(true)
    try {
      console.log('Submitting form data:', formData)
      
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        throw new Error('Not authenticated')
      }

      const { data, error } = await supabase.from('patients').insert({
        auth_user_id: user.id,
        vh_id: `VH-${Date.now()}`,
        name: formData.name,
        email: formData.email,
        date_of_birth: formData.dateOfBirth,
        gender: formData.gender,
        contact_number: formData.contactNumber,
        address: formData.address,
        blood_group: formData.bloodGroup,
        allergies: formData.allergies ? formData.allergies.split(',').map(a => a.trim()) : [],
        chronic_conditions: formData.chronicConditions,
        current_medications: formData.currentMedications,
        emergency_contact_name: formData.emergencyContactName,
        emergency_contact_number: formData.emergencyContactNumber,
        insurance_provider: formData.insuranceProvider,
        insurance_policy_no: formData.insurancePolicyNo
      }).select()

      if (error) {
        console.error('Database error:', error)
        throw error
      }

      console.log('Registration successful:', data)
      toast.success(`Registration completed! Your VHealth ID: ${data[0]?.vh_id || 'VH-XXXX'}`)
      setTimeout(() => {
        router.push('/patient/dashboard')
      }, 2000)
    } catch (error: any) {
      console.error('Registration error:', error)
      toast.error(error.message || 'Registration failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Patient Registration</h1>
          <p className="text-gray-600">Step {step} of 3</p>
          <div className="w-full bg-gray-200 rounded-full h-2 mt-4">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(step / 3) * 100}%` }}
            />
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>
              {step === 1 && 'Personal Information'}
              {step === 2 && 'Medical Information'}
              {step === 3 && 'Additional Details'}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {step === 1 && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Full Name *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      placeholder="Enter your full name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="dateOfBirth">Date of Birth *</Label>
                    <Input
                      id="dateOfBirth"
                      type="date"
                      value={formData.dateOfBirth}
                      onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="gender">Gender *</Label>
                    <Select value={formData.gender} onValueChange={(value) => handleInputChange('gender', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select gender" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Male">Male</SelectItem>
                        <SelectItem value="Female">Female</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="contactNumber">Contact Number *</Label>
                    <Input
                      id="contactNumber"
                      value={formData.contactNumber}
                      onChange={(e) => handleInputChange('contactNumber', e.target.value)}
                      placeholder="+1 (555) 123-4567"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="email">Email Address *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    placeholder="your.email@example.com"
                  />
                </div>

                <div>
                  <Label htmlFor="address">Address</Label>
                  <Textarea
                    id="address"
                    value={formData.address}
                    onChange={(e) => handleInputChange('address', e.target.value)}
                    placeholder="City, State"
                    rows={2}
                  />
                </div>
              </>
            )}

            {step === 2 && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="bloodGroup">Blood Group *</Label>
                    <Select value={formData.bloodGroup} onValueChange={(value) => handleInputChange('bloodGroup', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select blood group" />
                      </SelectTrigger>
                      <SelectContent>
                        {BLOOD_GROUPS.map(group => (
                          <SelectItem key={group} value={group}>{group}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="allergies">Known Allergies</Label>
                    <Input
                      id="allergies"
                      value={formData.allergies}
                      onChange={(e) => handleInputChange('allergies', e.target.value)}
                      placeholder="Peanuts, Shellfish, etc. (comma separated)"
                    />
                  </div>
                </div>

                <div>
                  <Label>Chronic Conditions</Label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2">
                    {CHRONIC_CONDITIONS.map(condition => (
                      <div key={condition} className="flex items-center space-x-2">
                        <Checkbox
                          id={condition}
                          checked={formData.chronicConditions.includes(condition)}
                          onCheckedChange={(checked) => handleConditionChange(condition, checked as boolean)}
                        />
                        <Label htmlFor={condition} className="text-sm">{condition}</Label>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <Label htmlFor="currentMedications">Current Medications</Label>
                  <Textarea
                    id="currentMedications"
                    value={formData.currentMedications}
                    onChange={(e) => handleInputChange('currentMedications', e.target.value)}
                    placeholder="List your current medications..."
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="emergencyContactName">Emergency Contact Name *</Label>
                    <Input
                      id="emergencyContactName"
                      value={formData.emergencyContactName}
                      onChange={(e) => handleInputChange('emergencyContactName', e.target.value)}
                      placeholder="Contact person name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="emergencyContactNumber">Emergency Contact Number *</Label>
                    <Input
                      id="emergencyContactNumber"
                      value={formData.emergencyContactNumber}
                      onChange={(e) => handleInputChange('emergencyContactNumber', e.target.value)}
                      placeholder="+1 (555) 123-4567"
                    />
                  </div>
                </div>
              </>
            )}

            {step === 3 && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="insuranceProvider">Insurance Provider</Label>
                    <Input
                      id="insuranceProvider"
                      value={formData.insuranceProvider}
                      onChange={(e) => handleInputChange('insuranceProvider', e.target.value)}
                      placeholder="e.g., Blue Cross Blue Shield"
                    />
                  </div>
                  <div>
                    <Label htmlFor="insurancePolicyNo">Policy Number</Label>
                    <Input
                      id="insurancePolicyNo"
                      value={formData.insurancePolicyNo}
                      onChange={(e) => handleInputChange('insurancePolicyNo', e.target.value)}
                      placeholder="Policy number"
                    />
                  </div>
                </div>

                <div className="bg-blue-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-blue-900 mb-2">Registration Summary</h3>
                  <div className="text-sm text-blue-800 space-y-1">
                    <p><strong>Name:</strong> {formData.name}</p>
                    <p><strong>Email:</strong> {formData.email}</p>
                    <p><strong>Blood Group:</strong> {formData.bloodGroup}</p>
                    <p><strong>Emergency Contact:</strong> {formData.emergencyContactName}</p>
                  </div>
                </div>
              </>
            )}

            <div className="flex justify-between pt-6">
              {step > 1 && (
                <Button variant="outline" onClick={prevStep}>
                  Previous
                </Button>
              )}
              
              {step < 3 ? (
                <Button onClick={nextStep} className="ml-auto">
                  Next
                </Button>
              ) : (
                <Button onClick={handleSubmit} disabled={loading} className="ml-auto">
                  {loading ? 'Registering...' : 'Complete Registration'}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}