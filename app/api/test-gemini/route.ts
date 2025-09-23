import { NextResponse } from 'next/server';
import { testGeminiConnection, generateEmergencySummary } from '@/lib/gemini';

export async function GET() {
  try {
    const isWorking = await testGeminiConnection();
    
    if (isWorking) {
      // Test with sample medical data
      const sampleReports = [
        "Patient has Type 2 Diabetes, taking Metformin 500mg twice daily. Blood group: O+",
        "Allergic to Penicillin. Recent BP reading: 140/90. Prescribed Lisinopril 10mg daily."
      ];
      
      const summary = await generateEmergencySummary(sampleReports);
      
      return NextResponse.json({
        status: 'success',
        message: 'Gemini AI is working properly!',
        testSummary: summary
      });
    } else {
      return NextResponse.json({
        status: 'error',
        message: 'Gemini AI connection failed'
      }, { status: 500 });
    }
  } catch (error) {
    return NextResponse.json({
      status: 'error',
      message: 'API test failed',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}