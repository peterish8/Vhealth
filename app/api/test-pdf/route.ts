import { NextRequest } from 'next/server'

export async function GET() {
  return Response.json({ 
    message: 'PDF test endpoint is working',
    timestamp: new Date().toISOString()
  })
}

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()
    const file = formData.get('file') as File
    
    if (!file) {
      return Response.json({ error: 'No file provided' }, { status: 400 })
    }

    console.log('Test PDF endpoint - File details:', {
      name: file.name,
      size: file.size,
      type: file.type
    })

    // Call the actual PDF extraction API
    const extractFormData = new FormData()
    extractFormData.append('file', file)
    
    const response = await fetch(`http://localhost:3000/api/extract-pdf-text`, {
      method: 'POST',
      body: extractFormData
    })
    
    const result = await response.json()
    
    return Response.json({
      success: true,
      testResult: result,
      fileInfo: {
        name: file.name,
        size: file.size,
        type: file.type
      }
    })
    
  } catch (error) {
    console.error('Test PDF error:', error)
    return Response.json({ 
      error: 'Test failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}