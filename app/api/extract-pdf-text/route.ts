import { NextRequest } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()
    const file = formData.get('file') as File
    
    if (!file) {
      return Response.json({ error: 'No file provided' }, { status: 400 })
    }

    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)
    
    let extractedText = ''
    
    try {
      const pdfParse = require('pdf-parse')
      const data = await pdfParse(buffer)
      
      if (data && data.text) {
        extractedText = data.text
          .replace(/\s+/g, ' ')
          .trim()
        
        console.log('PDF parsed successfully:', extractedText.length, 'characters')
      }
    } catch (error) {
      console.error('PDF parse error:', error)
      
      // Simple fallback
      const text = buffer.toString('utf8')
      const simpleText = text.match(/[a-zA-Z0-9\s.,;:!?()-]{10,}/g)
      if (simpleText) {
        extractedText = simpleText.join(' ').substring(0, 1000)
      }
    }
    
    if (!extractedText || extractedText.length < 5) {
      extractedText = `Medical document: ${file.name}. Content requires manual review.`
    }
    
    return Response.json({ 
      success: true, 
      extractedText: extractedText.substring(0, 3000)
    })
    
  } catch (error) {
    return Response.json({ 
      success: true,
      extractedText: `Document uploaded: ${(req.formData().then(fd => (fd.get('file') as File)?.name) || 'unknown')}. Manual review needed.`
    })
  }
}