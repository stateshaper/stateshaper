'use client'
import { useState, useEffect } from "react"

export default function Home() {
  const [Data, setData] = useState(null)

  const [State, setState] = useState(null)
  const [A, setA] = useState(null)
  const [B, setB] = useState(null)
  const [C, setC] = useState(null)
  const [D, setD] = useState(null)
  const [Mod, setMod] = useState(null)
  const [TokenCount, setTokenCount] = useState(null)
  const [Index, setIndex] = useState(null)
  const [HighIndex, setHighIndex] = useState(null)

  const minimum_tokens = 1000

  const [AlottedTokens, setAlottedTokens] = useState(null)
  const [CreatedTokens, setCreatedTokens] = useState(0)
  const [RemainingTokens, setRemainingTokens] = useState(AlottedTokens ? AlottedTokens - CreatedTokens : null)
  const [hasGenerated, setHasGenerated] = useState(false)
  const [selectedAction, setSelectedAction] = useState("generate")

  const default_values = {
    state: 1,
    constants: {"a": 3, "b": 5, "c": 7, "d": 11},
    mod: 9973,
    token_count: 1,
    index: 0
  }

  async function send_api(path) {
    // const res = await fetch(`https://stateshaper-ml-backend.vercel.app/api/` + path, {
    const res = await fetch("http://localhost:8000/api/" + path, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: JSON.stringify({"state": State ? State : default_values.state, "constants": {"a": A ? A : default_values.constants.a, "b": B ? B : default_values.constants.b, "c": C ? C : default_values.constants.c, "d": D ? D : default_values.constants.d}, "mod": Mod ? Mod : default_values.mod, "token_count": TokenCount ? TokenCount : default_values.token_count, "index": Index ? Index : default_values.index}) })
    })

    const data = await res.json()
    setData(data)
    
    // Update high index
    const currentIndex = data.response?.data?.index || 0
  
    const shouldIncrement = currentIndex > HighIndex || HighIndex === 0 
    setHighIndex(currentIndex > HighIndex ? currentIndex : HighIndex)
    
    // Only increment created tokens if current index > high index
    if (shouldIncrement) {
      // let additional_tokens = 0
      // if (path === "define") {
      //   additional_tokens = TokenCount ? TokenCount : default_values.token_count
      // } else if (path === "generate") {
      //   additional_tokens = TokenCount ? TokenCount : default_values.token_count
      // } else if (path === "reverse") {
      //   additional_tokens = TokenCount ? TokenCount : default_values.token_count
      // } else if (path === "jump") {
      //   additional_tokens = 1
      // }
      
      // if (additional_tokens > 0) {
      //   const newCreatedTokens = CreatedTokens + additional_tokens
      //   setCreatedTokens(newCreatedTokens)
      //   setRemainingTokens(AlottedTokens - newCreatedTokens)
      // }
      setCreatedTokens(currentIndex > HighIndex ? currentIndex : HighIndex)
      
    }

      


    
    // Set hasGenerated for define regardless of index condition
    if (path === "define") {
      setHasGenerated(true)
    }
    // created_tokens > HighIndex ? created_tokens = HighIndex : null
    // setCreatedTokens(created_tokens)
  }

  function handleGenerateOrRestart() {
    if (hasGenerated) {
      // Restart: call restart API and reset local state
      send_api("define")
      setCreatedTokens(0)
      setRemainingTokens(AlottedTokens)
      setHasGenerated(false)
      setData(null)
    } 
    send_api("define")
  
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 pt-24">
      <div className="max-w-4xl mx-auto">
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Stateshaper</h1>
          <p className="text-lg text-gray-600">AI Engine Control Panel</p>
        </header>

        <div className="space-y-8">
          {/* Configuration Section */}
          <section className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Configuration</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Initial State</label>
                <input
                  type="number"
                  min="0"
                  disabled={hasGenerated}
                  className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${hasGenerated ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                  onChange={(e) => setState(parseInt(e.target.value) || 0)}
                  placeholder="1"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Modulus</label>
                <input
                  type="number"
                  min="0"
                  disabled={hasGenerated}
                  className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${hasGenerated ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                  onChange={(e) => setMod(parseInt(e.target.value) || 0)}
                  placeholder="9973"
                />
              </div>
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-800 mb-3">Constants</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">A</label>
                  <input
                    type="number"
                    min="0"
                    disabled={hasGenerated}
                    className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${hasGenerated ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                    onChange={(e) => setA(parseInt(e.target.value) || 0)}
                    placeholder="3"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">B</label>
                  <input
                    type="number"
                    min="0"
                    disabled={hasGenerated}
                    className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${hasGenerated ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                    onChange={(e) => setB(parseInt(e.target.value) || 0)}
                    placeholder="5"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">C</label>
                  <input
                    type="number"
                    min="0"
                    disabled={hasGenerated}
                    className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${hasGenerated ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                    onChange={(e) => setC(parseInt(e.target.value) || 0)}
                    placeholder="7"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">D</label>
                  <input
                    type="number"
                    min="0"
                    disabled={hasGenerated}
                    className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${hasGenerated ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                    onChange={(e) => setD(parseInt(e.target.value) || 0)}
                    placeholder="11"
                  />
                </div>
              </div>
            </div>
          </section>

          {/* Start Engine Section */}
          <div className="flex justify-center">
            <button
              className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-8 rounded-lg text-lg transition duration-200 shadow-md"
              onClick={handleGenerateOrRestart}
            >
              {hasGenerated ? "Restart" : "Start Engine"}
              {/* {HighIndex > 0 && ` (Current Index: ${HighIndex})`} */}
            </button>
          </div>

          {/* Actions Section */}
          {hasGenerated && (
            <section className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">Actions</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Select Action</label>
                  <select
                    value={selectedAction}
                    onChange={(e) => setSelectedAction(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="generate">Generate Tokens</option>
                    <option value="forward">Forward</option>
                    <option value="reverse">Reverse</option>
                    <option value="jump">Jump</option>
                  </select>
                </div>
                <div className="flex items-end space-x-4">
                  {selectedAction !== "jump" && selectedAction !== "generate" && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Places</label>
                      <input
                        type="number"
                        min="0"
                        className="w-32 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        onChange={(e) => setTokenCount(parseInt(e.target.value) || 0)}
                        placeholder="Places"
                      />
                    </div>
                  )}
                  {selectedAction === "generate" && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Token Count</label>
                      <input
                        type="number"
                        min="0"
                        className="w-32 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        onChange={(e) => setTokenCount(parseInt(e.target.value) || 0)}
                        placeholder="Count"
                      />
                    </div>
                  )}
                  {selectedAction === "jump" && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Index</label>
                      <input
                        type="number"
                        min="0"
                        className="w-32 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        onChange={(e) => setIndex(parseInt(e.target.value) || 0)}
                        placeholder="Index"
                      />
                    </div>
                  )}
                  <button
                    className={`font-medium py-2 px-6 rounded-md transition duration-200 ${
                      selectedAction === "generate"
                        ? "bg-blue-600 hover:bg-blue-700 text-white"
                        : selectedAction === "forward"
                        ? "bg-green-600 hover:bg-green-700 text-white"
                        : selectedAction === "reverse"
                        ? "bg-yellow-600 hover:bg-yellow-700 text-white"
                        : "bg-purple-600 hover:bg-purple-700 text-white"
                    }`}
                    onClick={
                      selectedAction === "generate"
                        ? () => send_api("generate")
                        : () => send_api(selectedAction)
                    }
                  >
                    {selectedAction === "generate"
                      ? (hasGenerated ? "Go" : "Generate Tokens")
                      : selectedAction.charAt(0).toUpperCase() + selectedAction.slice(1)}
                  </button>
                </div>
                <div className="text-sm text-gray-600">
                  {selectedAction === "generate" && "Define and generate new tokens"}
                  {selectedAction === "forward" && "Move forward by specified places"}
                  {selectedAction === "reverse" && "Move reverse by specified places"}
                  {selectedAction === "jump" && "Jump to specific index"}
                </div>
              </div>
            </section>
          )}

          {/* Status Section - Floating Widget */}
          <div className="fixed top-4 right-4 z-50 bg-white rounded-lg shadow-lg p-4 border border-gray-200 max-w-sm">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">Status</h3>
            <div className="grid grid-cols-1 gap-3">
              <div className="bg-gray-50 p-3 rounded-md">
                <div className="text-xs font-medium text-gray-500 uppercase tracking-wide">Created Tokens</div>
                <div className="text-xl font-bold text-gray-900">{CreatedTokens || 0}</div>
              </div>
              {AlottedTokens && (
                <div className="bg-gray-50 p-3 rounded-md">
                  <div className="text-xs font-medium text-gray-500 uppercase tracking-wide">Allotted Tokens</div>
                  <div className="text-xl font-bold text-gray-900">{AlottedTokens}</div>
                </div>
              )}
              {RemainingTokens !== null && AlottedTokens !== null && (
                <div className="bg-gray-50 p-3 rounded-md">
                  <div className="text-xs font-medium text-gray-500 uppercase tracking-wide">Remaining Tokens</div>
                  <div className="text-xl font-bold text-gray-900">{RemainingTokens}</div>
                </div>
              )}
            </div>
          </div>

          {/* Results Section */}
          {Data && (
            <section className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">API Response</h2>
              <pre className="bg-gray-100 p-4 rounded-md overflow-x-auto text-sm text-gray-800">
                {JSON.stringify(Data, null, 2)}
              </pre>
            </section>
          )}
        </div>
      </div>
    </div>
  );
}
