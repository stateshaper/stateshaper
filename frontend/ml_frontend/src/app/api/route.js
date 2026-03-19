import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  console.log("DEBUG - Backend Route:", process.env.DEMO_BACKEND);
  const backend_route = process.env.DEMO_BACKEND; 
  return NextResponse.json({ data: backend_route || "No backend route found" });
}
