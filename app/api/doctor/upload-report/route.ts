import { NextRequest } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import pdfParse from 'pdf-parse'

export async function POST(req: NextRequest) {
  try {
    console.log('Upload route called')
    
    const formData = await req.formData()
    const patientId = formData.get('patientId') as string
    const reportType = formData.get('reportType') as string
    const reportTitle = formData.get('reportTitle') as string
    const notes = formData.get('notes') as string
    const file = formData.get('file') as File
    const importance = formData.get('importance') as string

    console.log('Form data received:', { patientId, reportType, reportTitle, fileName: file?.name, importance })

    if (!patientId || !reportType) {
      return Response.json({ error: 'Patient ID and report type are required' }, { status: 400 })
    }

    const supabase = await createClient()
    
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    if (userError || !user) {
      console.log('Auth error:', userError)
      return Response.json({ error: 'Unauthorized - please log in' }, { status: 401 })
    }

    const { data: doctor, error: doctorError } = await supabase
      .from('doctors')
      .select('id')
      .eq('auth_user_id', user.id)
      .single()

    if (doctorError || !doctor) {
      console.log('Doctor lookup error:', doctorError)
      return Response.json({ error: 'Doctor profile not found' }, { status: 404 })
    }

    const { data: patient, error: patientError } = await supabase
      .from('patients')
      .select('id, name')
      .eq('vh_id', patientId)
      .single()

    if (patientError || !patient) {
      console.log('Patient lookup error:', patientError)
      return Response.json({ error: `Patient not found with VHealth ID: ${patientId}` }, { status: 404 })
    }

    let fileUrl = null
    let fileName = null
    let fileSize = null
    let extractedText = null

    if (file) {
      fileName = file.name
      fileSize = file.size
      
      const uniqueFileName = `${patient.id}/${Date.now()}-${fileName}`
      
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('health-records')
        .upload(uniqueFileName, file)
      
      if (uploadError) {
        console.log('File upload error:', uploadError)
        return Response.json({ error: `File upload failed: ${uploadError.message}` }, { status: 500 })
      }
      
      const { data: { publicUrl } } = supabase.storage
        .from('health-records')
        .getPublicUrl(uniqueFileName)
      
      fileUrl = publicUrl

      // Extract text from PDF
      if (file.type === 'application/pdf' || fileName.toLowerCase().endsWith('.pdf')) {
        try {
          const arrayBuffer = await file.arrayBuffer()
          const buffer = Buffer.from(arrayBuffer)
          const pdfData = await pdfParse(buffer)
          extractedText = pdfData.text
          console.log('PDF text extracted successfully:', extractedText.length, 'characters');
          if (!extractedText || extractedText.trim().length === 0) {
            extractedText = `Medical document: ${fileName}. No text could be extracted.`
          }
        } catch (error) {
          console.error('PDF parsing error:', error)
          extractedText = `Medical document: ${fileName}. PDF parsing failed - manual review required.`
        }
      }
    }

    const { data: record, error: recordError } = await supabase
      .from('health_records')
      .insert({
        patient_id: patient.id,
        doctor_id: doctor.id,
        report_type: reportType,
        title: reportTitle || reportType,
        description: notes || null,
        file_url: fileUrl,
        file_name: fileName,
        file_size: fileSize,
        clinical_notes: notes || null,
        extracted_text: extractedText,
        test_date: new Date().toISOString().split('T')[0],
        importance_level: parseInt(importance, 10) || 3
      })
      .select()
      .single()

    if (recordError) {
      console.log('Database insert error:', recordError)
      return Response.json({ error: `Failed to create record: ${recordError.message}` }, { status: 500 })
    }
    
    return Response.json({
      success: true,
      message: `Report uploaded successfully to ${patient.name}'s health vault!`,
      record
    })

  } catch (error) {
    console.error('Upload route error:', error)
    return Response.json({ 
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error occurred'
    }, { status: 500 })
  }
}