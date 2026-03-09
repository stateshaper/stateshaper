import { useState, useEffect } from 'react'


export default function AI() {
  return (
    <div>
      <h1 className="text-4xl font-bold mb-8">AI Engine</h1>
      <p className="text-lg mb-4">This page will allow you to interact with the AI engine. You can define the engine, run it to create tokens, reverse it to recreate previous tokens, and jump to specific states.</p>
      <p className="text-lg mb-4">Use the form below to input the parameters for the engine and click the buttons to perform actions. The response from the API will be displayed below.</p>
    </div>
  )
}