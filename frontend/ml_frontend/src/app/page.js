'use client'
import {useEffect, useState, useRef} from "react"
import "./shapes.css"
import {code} from "./data/code.js"
import Draw from "./classes/Draw"
import Stats from "./classes/Stats"

export default function Home() {
  const ref = useRef(null)
  const [DrawData, setDrawData] = useState(null)
  const [RunTest, setRunTest] = useState(false)
  const [TestTrigger, setTestTrigger] = useState(false)
  const [X_Interval, setX_Interval] = useState(10)
  const [Counter, setCounter] = useState(-1)
  const [OriginalToken, setOriginalToken] = useState(null)
  const [MapData, setMapData] = useState(0)
  const [MapText, setMapText] = useState("")
  const [Data, setData] = useState("")
  const [LoadedData, setLoadedData] = useState(false)
  const [Seeds, setSeeds] = useState("")
  const [ShowForm, setShowForm] = useState(true)
  const [ShowAbout, setShowAbout] = useState(false)
  const [ShowData, setShowData] = useState(false)
  const [ShowMainREADME, setShowMainREADME] = useState(false)
  const [ShowREADME, setShowREADME] = useState(false)
  const [ShowExample, setShowExample] = useState(false)
  const [ShowCode, setShowCode] = useState(false)
  const [SeedText, setSeedText] = useState("")
  const [ReceiveTrip, setReceiveTrip] = useState(false)
  const [LoadedTrip, setLoadedTrip] = useState(true)
  const [Pause, setPause] = useState(false)
  const [StartTest, setStartTest] = useState(false)
  const [ShowDrawData, setShowDrawData] = useState(false)
  const [HoverPos, setHoverPos] = useState([0, 0])
    
  const classes = ["font-bold", ""]
  const [LinkText, setLinkText] = useState(classes[0])
  
  const attributes = ["temperature","humidity","light","elevation","curves","road_size","road_texture","incline","traffic","hazard","weather"]
  const [SelectedAttributes, setSelectedAttributes] = useState([attributes[0]])


  const content = {
    "form": setShowForm,
    "data": setShowData,
    "about": setShowAbout
  }


  const colors = {
    "temperature": "#FF6B6B",      // pastel red
    "humidity": "#FFB6B9",         // soft pink
    "light": "#FFD6A5",            // pastel orange
    "elevation": "#FDFFB6",        // pastel yellow
    "curves": "#CAFFBF",           // pastel green
    "road_size": "#9BF6FF",        // pastel cyan
    "road_texture": "#A0C4FF",     // pastel blue
    "incline": "#66BB6A",          // pastel violet
    "traffic": "#FFC6FF",          // pastel magenta
    "hazard": "#8E7BC8",           // soft coral
    "weather": "#FFC75F"           // light peach
  }


  useEffect(()=>{
    document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    document.cookie = "engine=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    send_api("start")
  }, [])


  useEffect(()=>{
    if(TestTrigger == true){
      setRunTest(true)
      setTestTrigger(false)
      StartTest == false ? setStartTest(true) : null
    } 
  }, [TestTrigger])


  useEffect(()=>{
    if(Data && LoadedData == false){
      set_cookie("engine", JSON.stringify(Data["seed"][1]))
      set_seeds()
      change_map(0)
      !get_cookie("token") && Data["token"] ? set_cookie("token", Data["token"]) : null
      setX_Interval(Data.test.environment[0].range[1]/100)
      setLoadedData(true)
    }
  }, [Data])


  useEffect(()=>{
    ReceiveTrip == true ? adjust_trip() : null
  }, [ReceiveTrip])


  useEffect(()=>{
    Seeds ? setSeedText(Seeds["0"]) : null
  }, [Seeds])


  useEffect(()=>{
    while(StartTest == true && Counter < 100){
      const timeoutId = setTimeout(() => {
          if(Pause != true){ 
            run_session()
          }
      }, 500)

      return () => clearTimeout(timeoutId)
    }
  }, [StartTest, Counter, Pause])


  function set_cookie(name, value, expire=86400) {
    document.cookie = `${name}=${value}; max-age=${expire}; path=/`;
  }

  function get_cookie(name) {
    const cookie = document.cookie.split("; ").find(row => row.startsWith(`${name}=`))?.split("=")[1]

    return cookie ? cookie.length > 0 ? cookie : null : null
  }

  function draw_value(value){
    if(value < 1){
      value = value * 3 * 100
    }
    return 400 - (value)
  }


  function show_content(show){
    let terms = ["form", "data", "about"]
    for(let i=0; i<terms.length; i++){
      content[terms[i]](show == terms[i] ? true : false)
    }
  }


  function full_seed(){
    Data["seed"][0]["s"][0] ? Data["seed"][0]["s"] = Data["seed"][0]["s"][0] : Data["seed"][0]["s"]
    return Data ? '["user_176551",' + JSON.stringify(Data["seed"][0]) + ']' : ""
  }


  function short_seed(){
    Data["seed"][0]["s"][0] ? Data["seed"][0]["s"] = Data["seed"][0]["s"][0] : Data["seed"][0]["s"]
    return Data ? '["user_176551",' + JSON.stringify(Data["seed"][0]["s"]) + ']' : ""
  }


  function tiny_seed(){
    return Data ? '["user_176551",' + Data.token + ']' : ""
  }


  function raw_seed(){
    return "N/A"
  }


  function seed_text(type){
    type == "0" ? setLinkText(classes[0]) : setLinkText(classes[1]) 
    setSeedText(Seeds[type])
  }


  function set_seeds(){
    setSeeds({"0" : [full_seed(), full_seed().length + ` bytes`],
    "1" : [short_seed(), short_seed().length + ` bytes`],
    "2" : [tiny_seed(),  tiny_seed().length + ` bytes`],
    "3" : [raw_seed(), ``]})
  }


  async function send_api(path) {
    if(get_cookie("engine") && path == "start"){
      send_api("refresh")
    }
      const res = await fetch(`https://stateshaper-backend.vercel.app/api/` + path, {
      //const res = await fetch("http://localhost:8000/api/" + path, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: JSON.stringify({"token": 1, "environment": Data ? Data.test.environment : [], "engine_state": get_cookie("engine") ? get_cookie("engine") : {}}) })
    });
    const data = await res.json()
    
    

    if(path != "trip" && path != "reset"){
      setData(data.response)
      setDrawData(data.response.test.environment[0].data)
      set_cookie("engine", JSON.stringify(data.response.seed[1]))
    }

    if(path == "trip"){
      setDrawData(data.response.test.data)
      setReceiveTrip(true)
    }   

    if(path == "reset"){
      setLoadedTrip(true)
    }   

    console.log("data in " + path)
    console.log(data.response)
  }


  function get_name(name){
    name = name.split("_")
    let string = ""
    for(let word of name){
      string = string + capitalize(word) + " "
    }
    string = string.slice(0, string.length-1)
    return string
  }


  function capitalize(word){
    return word[0].toUpperCase() + word.slice(1)
  }


  function get_range(range){
    return range[0].toString().length > 1 ? range[0] + " - " + range[1] : range[0] + "  - " + range[1]
  }


  function change_map(current){
    try{
      reset_trip()
      setX_Interval(Data.test.environment[current].range[1]/100)
      setDrawData(Data.test.environment[current].data)
      setMapText(Data.test.environment.map((item, i) => (
        <div className="grid grid-cols-2 gap-8" key={i}>
          <div className="flex items-center cursor-pointer z-99" onClick={e => change_map(i)}>
          <div className={map_text(Data.test.environment[current].environment, item.environment)}>{item.environment}</div>
          </div>
          <div className="font-mono whitespace-pre flex items-center">
            mi. {get_range(item.range)}
          </div>
        </div>
      )))
      setMapData(Object.keys(Data.test.environment[current].data).map((item, i) => (
        <div className="grid w-full grid-rows-1 grid-cols-2 gap-8 text-lg" key={i}>
          <div>
            {get_name(item)}
          </div>
          <div className={!Data.test.environment[current].data[item].toString().includes(".") ? "whitespace-pre italic" : "whitespace-pre"}>
            {Data.test.environment[current].data[item]}
          </div>
        </div>
      )))
    }catch{
      setMapData("")
    }
  }


  function map_text(map, data){
    return map == data ? "text-green-300 hover:text-violet-300 font-bold cursor-default select-none" : "select-none hover:text-green-200"
  }
 

  function run_session(){
    Counter == 0 ? setCounter(1) : null
    Counter < 100 ? send_api("trip") : null
  }


  function pause_session(toggle){
    setPause(toggle)
  }


  function adjust_trip(){
    setReceiveTrip(false)
    let counter = Counter
    counter++
    setCounter(counter)
    console.log("draw data in adjust trip")
    console.log(DrawData)
    setTestTrigger(true)
  }

    
  function reset_trip(){
    setLoadedTrip(false)
    setReceiveTrip(false)
    setCounter(-1)
    setTestTrigger(false)
    setStartTest(false)
    send_api("reset")
  }
  

  function draw_display(){
    let classes = []
    let data = null

    for(let value of SelectedAttributes){
      data = {
        "value": null,
        "prev_value": null,
        "counter": null,
        "color": null,
      }
      data.value = draw_value(DrawData[value])
      data.prev_value = draw_value(DrawData[value])
      data.counter = Counter
      data.color = colors[value]
      classes.push(data)
    }
    return classes
  }




  return (
    <div className="flex grid grid-auto-rows dark:bg-black h-screen min-h-screen bg-[#02082c] font-mono overflow-y-hidden">
      <style>
        {`
          .dot-scrollbar::-webkit-scrollbar {
            width: 12px;
          }
          .dot-scrollbar::-webkit-scrollbar-track {
            background: transparent;
          }
          .dot-scrollbar::-webkit-scrollbar-thumb {
            background-color: gray;
            border-radius: 50%;
            border: 3px solid transparent;
          }
          .dot-scrollbar::-webkit-scrollbar-thumb:hover {
            background-color: gray;
          }
        `}
      </style>
      <div className="grid grid-rows-1 place-items-center text-3xl mt-8 text-gray-200 font-bold">
        <div>
          Stateshaper ML Training Demo
        </div>   
      </div>

      {Data ? 
        <div className="grid grid-cols-2 grid-rows-1 place-items-center h-4/5 mt-32 text-gray-200 min-w-full static">
        <div className="grid gap-8 h-full content-start place-items-center">
          <div className="grid grid-rows-1 grid-cols-3 w-128 text-gray-200 text-xl cursor-pointer place-items-center">
            <a className={ShowForm ? "font-bold text-2xl disabled select-none cursor-default" : "hover:text-gray-300"} onClick={()=>show_content("form")}>Trip</a>
            <a className={ShowData ? "font-bold text-2xl disabled select-none cursor-default" : "hover:text-gray-300"} onClick={()=>show_content("data")}>Run</a>
            <a className={ShowAbout ? "font-bold text-2xl disabled select-none cursor-default" : "hover:text-gray-300"} onClick={()=>show_content("about")}>About</a>
          </div>
          <div className="">
            <div>
              <div className={ShowForm ? "grid grid-rows-3 max-w-[800px] h-140 content-start overflow-y-auto gap-10 p-4 dot-scrollbar static mt-24" : "hidden"} style={{scrollbarWidth: 'thin', scrollbarColor: 'gray transparent'}}>
                <div className="grid grid-cols-3 gap-4 w-full text-xl">
                  <div>
                    Derived From: 
                  </div>
                  <div>
                    {Data["token"] ? Data["token"] : ""}
                  </div>
                  <div className="grid grid-cols-2 w-full text-xl">
                      <button className={Data && get_cookie("token") ? Data["token"] != get_cookie("token") ? "w-20 h-12 px-4 py-1 bg-blue-600 rounded-2xl cursor-pointer text-4xl hover:bg-gray-300 hover:text-blue-700 select-none z-99" : "disabled select-none w-20 h-12 px-4 py-1 bg-gray-600 rounded-2xl cursor-none text-4xl" : null} onClick={e => send_api("reverse")} disabled={Data && get_cookie("token") ? Data["token"] == get_cookie("token") : false}>
                        &larr;
                      </button>
                      <button className="w-20 h-12 px-4 py-1 bg-blue-600 rounded-2xl cursor-pointer px-2 text-4xl hover:bg-gray-300 hover:text-blue-700 select-none z-99"  onClick={e => send_api("forward")}>
                        &rarr;
                      </button>
                  </div>
                </div>
                <div className="grid grid-cols-2 w-full gap-8 text-lg">
                  <div className="grid w-full grid-rows-2 grid-cols-1 h-36">
                    <div>
                      <b>Car:</b>
                    </div>   
                    <div className="text-blue-400 text-2xl mt-4">
                      <i>{Data ? get_name(Data.test.vehicle.name) : null}</i>
                    </div>
                  </div>
                  <div className="grid w-full grid-rows-2 grid-cols-1 h-36">
                    <div className="grid grid-rows-1 grid-cols-2">
                      <div>
                        <b>Maps:</b> 
                      </div>
                    </div>
                    <div className="mt-4">
                      {Data ? MapText :null}
                    </div>
                  </div>
                </div>
                <div className="grid grid-rows-2 grid-cols-1 gap-24 w-full text-lg">
                    <div className="grid w-full grid-rows-1 grid-cols-1 justify-self-start mt-auto top-0 static">
                    </div>
                    <div className="grid grid-rows-1 grid-cols-2 static">
                      <div>
                        {Data ? Object.keys(Data.test.vehicle).map((item, i) => (
                          <div key={i}>
                            {i > 0 ?
                            <div className="grid w-full grid-rows-1 grid-cols-2 gap-8">
                              <div>
                                {capitalize(item)}
                              </div>
                              <div className="whitespace-pre">
                                {Data.test.vehicle[item]}
                              </div>
                            </div>
                            : null}
                          </div>
                        )):null}
                      </div>
                      <div>
                        {Data ? MapData : null}
                      </div>
                    </div>
                </div>
            </div>
            <div>
              <div className={ShowData ? "grid grid-rows-3 max-w-[800px] h-150 place-items-center overflow-y-auto  p-4 dot-scrollbar static gap-28 mt-18" : "hidden"} style={{scrollbarWidth: 'thin', scrollbarColor: 'gray transparent'}}>
                <div>
                  <Stats AttributeStates={[SelectedAttributes, setSelectedAttributes]} StartTest={StartTest} Counter={Counter} DrawData={DrawData}/>
                </div>
                <div className="relative mt-12 w-180 h-100 bg-gray-400" ref={ref}>
                  {StartTest == true && Counter >= 0 ?
                    <div>
                      <div className="absolute text-black text-sm p-4">
                        map: {DrawData ? DrawData.environment : null}
                      </div>
                      <div className="absolute text-black text-sm p-4 ml-auto right-0">
                        mile: {Counter}
                      </div>

                    </div>
                  : null}
                  {LoadedTrip ? 
                    <div>
                      {Data ? draw_display().map((data, i) => (
                        <Draw Value={data.value} PreviousValue={data.prev_value} Counter={data.counter} Color={data.color} setShowDrawData={setShowDrawData} setHoverPos={setHoverPos} RunTestState={[RunTest, setRunTest]} key={i}/>
                      )) : null}
                    </div>
                  : null}
                </div>
                <div className={Counter < 100 && StartTest == false ? "mt-16 px-4 py-2 ml-auto w-32 h-12 bg-blue-800 hover:bg-blue-900 rounded-lg text-xl text-white cursor-pointer hover:bg-blue-800 select-none" : Counter < 100 && StartTest == true && Pause == false ? "mt-16 px-8 py-2 ml-auto w-32 h-12 bg-green-400 hover:bg-green-500 rounded-lg text-xl text-white cursor-pointer select-none" : Counter < 100 && StartTest == true && Pause == true ? "mt-16 px-6 py-2 ml-auto w-32 h-12 bg-yellow-500 hover:bg-yellow-600 rounded-lg italic text-xl text-white cursor-pointer select-none" : "mt-16 px-5 py-2 ml-auto w-32 h-12 bg-violet-700 hover:bg-violet-800 rounded-lg text-xl text-white cursor-pointer select-none"}  onClick={Counter < 100 && StartTest == false ? e => run_session() : Counter < 100 && StartTest == true && Pause == false ? e => pause_session(true) : Counter < 100 && StartTest == true && Pause == true ? e => pause_session(false) : e => reset_trip()}>
                  {Counter < 100 && StartTest == false ? "Run Test" : Counter < 100 && StartTest == true && Pause == false ? "Pause" : Counter < 100 && StartTest == true && Pause == true ? "Resume" : "Restart"}
                </div>
              </div>
            </div>
            <div>
            <div className={ShowAbout ? "grid max-w-[800px] h-140 content-start overflow-y-auto gap-10 p-4 dot-scrollbar static mt-24" : "hidden"} style={{scrollbarWidth: 'thin', scrollbarColor: 'gray transparent'}}>
            <div>
              An unlimited amount of training data for machine learning can be created and stored using <i>Stateshaper</i>. The ability for the engine to derive synthetic data by tokenizing its numeric output allows for a wide range of training data values to be used. Each test can be stored and re-created at any time from the small seed formats seen to the right of the screen. 
            </div>
            <div>  
              If the data variations created aren't good enough, output can be adjusted in the plugin file by using the current token as a base to derive test values from. This particular example shows how <i>Stateshaper</i> can be used to run road simulations that help train the AI in self-driving cars. Theoretically, all possible test scenarios can be created based on how output of the program is structured. If needed, the parameter values for the main class and corresponding plugin file can be modified for a particular use.
            </div>
            <div>
              Once run, these tests can be stored using almost no space. Any simulation can be revisited at any time. Consider that one prototype for a self-driving car may have several versions. Each version created can have millions of possible AI training sessions conducted before the car begins testing on the road. The data needed for this can take up many terabytes of space. 
            </div>
            <div>
              Storing this data can be important for many reasons such as further research, version comparison, and regulatory reasons to name a few. Using <i>Stateshaper</i> in this case can reduce database related costs in this instance by over 99%. This includes storage, bandwidth and electricity consumption. This logic in this demo can also be used in many other applications that require ML Training. 
            </div>
            <div className="mt-8">
              <i>Stateshaper</i> is currently available as a Python package and Github repository. 
            </div>
            <div className="mt-8 grid grid-cols-1 gap-4 grid-rows-2 place-items-center">
              <code className="bg-gray-700 p-2 w-124 rounded-sm">{'>'} pip install stateshaper-ml</code>
              <a className="mt-4 underline hover:text-gray-300 hover:italic" href="https://www.github.com/stateshaper/stateshaper/tree/ml_use" target="_blank">https://www.github.com/stateshaper/stateshaper/tree/ml_use</a>
            </div>
            <div className="mt-8">
              ML Training is only one of the many uses for this program. There are other demos listed in the project's documentation.  Other uses can include, but are not limited to, smart home scheduling, gaming NPC behavior, content generation, graphic assets and store inventories. 
            </div>
            </div>
          </div>
          </div>
          </div>

        </div>

        <div className="grid w-3/4 grid-rows-2 gap-36 grid-cols-1 place-items-start h-full static mb-12">
          <div className="grid grid-rows-1 grid-cols-1 mt-12">
            <div className="text-bold text-lg">
              Seed State Format
            </div>
            <div className="italic mt-4">
              The training data can be re-created without loss using this format, a plugin file, and the Stateshaper engine. In some cases, such as those requiring no security, Seed State format can be minimized to only an integer value. 
            </div>
            <div className="grid grid-rows-1 grid-cols-4 place-items-center cursor-pointer text-gray-200 mt-8">
              <a id="0" className={LinkText} onClick={(e) => seed_text(e.target.id)}>
                Full State
              </a>
              <a id="1" className="hover:font-bold hover:text-gray-300 cursor-pointer" onMouseOver={(e) => seed_text(e.target.id)} onMouseOut={(e) => seed_text("0")}>
                Short State
              </a>
              {/* <a id="2" className="hover:font-bold hover:text-gray-300 cursor-pointer" onMouseOver={(e) => seed_text(e.target.id)} onMouseOut={(e) => seed_text("0")}>
                Minimal State
              </a> */}
              {/* <a id="3" className="hover:font-bold hover:text-gray-300 cursor-pointer" onMouseOver={(e) => seed_text(e.target.id)} onMouseOut={(e) => seed_text("0")}>
                Raw State
              </a> */}
            </div>
            <div className="grid grid-rows-2 grid-cols-1 gap-8 w-3/4 h-32 min-h-32 static mt-8 bold text-gray-700 p-4 rounded bg-gray-200">
              <code>
                {SeedText ? SeedText[0] : ""}
              </code>
              <code className="mt-3">
                {SeedText ? SeedText[1] : ""}
              </code>
            </div>
            <div className="italic mt-8">
              Using the values from these strings as parameters in Stateshaper will allow you to re-create an unlimited chain of data without loss. Tiny State and Raw State format are not required for this type of use because no personalized data is selected from the original dataset. 
            </div>
            <div className="italic mt-8">
              The custom plugin file required to coordinate Stateshaper output can be kept and referenced in the program where Stateshaper is installed. An example of what a plugin file looks like is provided in the documentation section of the main Github branch. 
            </div>
          </div>
          <div className="w-full text-2xl grid grid-rows-1 grid-cols-3 gap-24 mb-4 mr-12">
            <div className={!ShowCode && !ShowREADME && !ShowExample ? "text-white  hover:font-bold bottom-6 hover:text-gray-300 cursor-pointer" : ShowCode ? " font-bold bottom-6 text-gray-300" : "text-white  bottom-6"} onMouseEnter={!ShowREADME && !ShowExample ? e=>setShowCode(true) : null} onClick={e=>setShowCode(false)}>
              CODE
            </div>
            <div className={!ShowCode && !ShowREADME && !ShowExample ? "text-white  hover:font-bold bottom-6 hover:text-gray-300 cursor-pointer" : ShowREADME ? " font-bold bottom-6  text-gray-300 cursor-pointer" : "text-white "} onMouseEnter={!ShowCode && !ShowExample ? e=>setShowREADME (true) : null} onClick={e=>setShowREADME(false)}>
              README
            </div>
            <div className={!ShowCode && !ShowREADME && !ShowExample ? "text-white  hover:font-bold hover:text-gray-300 cursor-pointer" : ShowExample ? " font-bold text-gray-300" : "text-white "} onMouseEnter={!ShowCode && !ShowREADME ? e=>setShowExample(true) : null} onMouseLeave={e=>setShowExample(false)}>
              EXAMPLE ONLY
            </div>
          </div>
        </div>
        </div>
      : null}

      {ShowREADME || ShowCode && !ShowExample?
        <div className="grid grid-auto-rows grid-auto-cols place-items-center fixed bottom-18 right-36 w-4/5 h-5/6 z-102 p-4 py-5 rounded-lg border border-zinc-800 bg-gray-400 text-white gap-12">
            <div className="grid place-items-center w-full h-full overflow-x-hidden overflow-y-auto">
              <img className="ml-4 mb-4 select-none" src={ShowREADME ? "plugin.png" : "code.png"} />
            </div>
            <div>
              Stateshaper Github: <a href="https://www.github.com/stateshaper/stateshaper" className="text-blue-500 hover:underline hover:italic hover:text-gray-600" target="_blank" rel="noopener noreferrer">
                https://www.github.com/stateshaper/stateshaper
              </a>
            </div>
        </div>
      : null}
      {ShowExample && !ShowCode && !ShowREADME ?
        <div className="text-white p-4 bottom-18 right-12 ml-auto absolute w-128 h-24 rounded-lg bg-blue-600">
        <div className="text-lg font-bold">
          Sample app, real logic. 
        </div>
        <div className="text-md mt-2">
          Intended to showcase the tool's capabilities.
        </div>
        </div>
      : null}
    </div>
  )
}