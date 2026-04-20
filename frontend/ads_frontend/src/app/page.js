'use client'
import {useEffect, useState} from "react";


export default function Home() {
  const ad_count = 3

  const attributes_map = {
    "sports": 0,
    "writing": 0, 
    "fitness": 0,
    "movies": 0,
    "cooking": 0,
    "science": 0, 
    "travel": 0,
    "animals": 0, 
    "crafts": 0, 
    "history": 0,
  }

  const [Attributes, setAttributes] = useState(attributes_map)
  const [Data, setData] = useState("")
  const [Seeds, setSeeds] = useState("")
  const [Ads, setAds] = useState([])
  const [NewAds, setNewAds] = useState(false)
  const [Loaded, setLoaded] = useState(false)
  const [ShowInterests, setShowInterests] = useState(true)
  const [SeedText, setSeedText] = useState("")
  const classes = ["font-bold", ""]
  const [LinkText, setLinkText] = useState(classes[0])
  const [ShowExample, setShowExample] = useState(false)
  const [ShowCode, setShowCode] = useState(false)
  const [DesktopOnly, setDesktopOnly] = useState(false)
  const min_width = 800
  
  useEffect(()=>{
    send_api("start")
    setLoaded(true)
  }, [])


  useEffect(()=>{
    set_seeds()
  }, [Data])


  useEffect(()=>{
    setSeedText(Seeds["0"])
  }, [Seeds])


  useEffect(()=>{
    if(!NewAds){
      show_ads()
      setNewAds(true)
    }
  }, [NewAds])


  function seed_text(type){
    type == "0" ? setLinkText(classes[0]) : setLinkText(classes[1]) 
    setSeedText(Seeds[type])
  }


  function adjust_values(e){
    let value = e.target.value.replace(/[^0-9]/g, '') 
    parseInt(value) > 100 ? value = 100 : null
    parseInt(value) < 0 ? value = 0 : null
    document.getElementById(e.target.id).value = value
    let temp_arr = Attributes
    temp_arr[e.target.id] = value
    setAttributes(temp_arr)
  }


  function show_ads(){
    let temp_arr = Ads
    let new_arr = []
    let place = 0
    while(new_arr.length < ad_count){
      place = Math.floor(Math.random() * temp_arr.length)
      new_arr.push(temp_arr[place])
      temp_arr.splice(place, 1)
    }
    setAds(new_arr)
  }


  function show_interests(condition){
    setShowInterests(condition)
  }


  function full_seed(){
    return Data ? '["user_176551",' + JSON.stringify(Data) + ']' : ""
  }


  function short_seed(){
    return Data ? '["user_176551",' + JSON.stringify(Data["state"]) + ',' + JSON.stringify(Data["vocab"]) + ']' : ""
  }


  function tiny_seed(){
    return Data ? Data["vocab"][0] : ""
  }


  function raw_seed(){
    return Data ? Data["vocab"][1] : ""
  }


  function set_seeds(){
    setSeeds({"0" : [full_seed(), `~225 bytes`],
    "1" : [short_seed(), `~65 bytes`],
    "2" : [tiny_seed(),  `~` + tiny_seed().length + ` bytes`],
    "3" : [raw_seed(), `~` + raw_seed().length + ` bytes`]})
  }


  async function send_api(path) {
    try{
       if(window.innerWidth < min_width){
          setDesktopOnly(true)
          setData(null)
          return false
      }else{
          setDesktopOnly(false)
      }
    }catch{}
    
    const res = await fetch(`https://stateshaper-ads-backend.vercel.app/api/` + path, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: JSON.stringify(Attributes) })
    });

    const data = await res.json();
    setData(data.response["seed"])
    setNewAds(false)  
    setAds(data.response["ads"])
    setAttributes(data.response["ratings"])
  }


  return (
    <div className="dark:bg-black min-h-screen w-full bg-[#02082c] overflow-x-hidden">
      <div className="flex grid grid-auto-rows dark:bg-black min-h-screen w-full relative bg-[#02082c]">

        <div className="grid grid-rows-1 place-items-center text-3xl mt-8 text-gray-200 font-bold">
          <div>
            Stateshaper Personalized Ads Demo
          </div>
        </div>

        {DesktopOnly == true ?
          <div className="grid place-items-center">
            <div className="text-white text-md italic">
              For Desktop Only
            </div>
          </div>
        :
          <>
            <div className="grid grid-cols-1 lg:grid-cols-2 place-items-center gap-12 text-gray-200 mt-12 lg:mt-16 pb-28">
              <div className="grid gap-8 w-full place-items-center">
                <div className="grid grid-rows-1 grid-cols-2 w-full max-w-md text-gray-200 text-xl cursor-pointer place-items-center">
                  <a className={ShowInterests ? "font-bold" : ""} onClick={()=>show_interests(true)}>Ratings</a>
                  <a className={!ShowInterests ? "font-bold" : ""} onClick={()=>show_interests(false)}>About</a>
                </div>

                {ShowInterests ?
                  <div className="grid w-full max-w-lg place-items-center">
                    <div className="grid grid-auto-rows mt-4 gap-4 w-full">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        <div>Sports</div>
                        <textarea
                          className="bg-gray-200 h-8 w-full resize-none overflow-y-hidden px-1 py-1 text-black rounded"
                          id="sports"
                          defaultValue={Loaded && Attributes ? Attributes["sports"] : ""}
                          onChange={(e) => adjust_values(e)}
                        ></textarea>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        <div>Writing</div>
                        <textarea className="bg-gray-200 h-8 w-full resize-none overflow-y-hidden px-1 py-1 text-black rounded" id="writing" onChange={e=>adjust_values(e)} defaultValue={Loaded && Attributes ? Attributes["writing"] : ""}></textarea>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        <div>Fitness</div>
                        <textarea className="bg-gray-200 h-8 w-full resize-none overflow-y-hidden px-1 py-1 text-black rounded" id="fitness" onChange={e=>adjust_values(e)} defaultValue={Loaded && Attributes ? Attributes["fitness"] : ""}></textarea>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        <div>Movies</div>
                        <textarea className="bg-gray-200 h-8 w-full resize-none overflow-y-hidden px-1 py-1 text-black rounded" id="movies" onChange={e=>adjust_values(e)} defaultValue={Loaded && Attributes ? Attributes["movies"] : ""}></textarea>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        <div>Cooking</div>
                        <textarea className="bg-gray-200 h-8 w-full resize-none overflow-y-hidden px-1 py-1 text-black rounded" id="cooking" onChange={e=>adjust_values(e)} defaultValue={Loaded && Attributes ? Attributes["cooking"] : ""}></textarea>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        <div>Science</div>
                        <textarea className="bg-gray-200 h-8 w-full resize-none overflow-y-hidden px-1 py-1 text-black rounded" id="science" onChange={e=>adjust_values(e)} defaultValue={Loaded && Attributes ? Attributes["science"] : ""}></textarea>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        <div>Travel</div>
                        <textarea className="bg-gray-200 h-8 w-full resize-none overflow-y-hidden px-1 py-1 text-black rounded" id="travel" onChange={e=>adjust_values(e)} defaultValue={Loaded && Attributes ? Attributes["travel"] : ""}></textarea>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        <div>Animals</div>
                        <textarea className="bg-gray-200 h-8 w-full resize-none overflow-y-hidden px-1 py-1 text-black rounded" id="animals" onChange={e=>adjust_values(e)} defaultValue={Loaded && Attributes ? Attributes["animals"] : ""}></textarea>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        <div>Crafts</div>
                        <textarea className="bg-gray-200 h-8 w-full resize-none overflow-y-hidden px-1 py-1 text-black rounded" id="crafts" onChange={e=>adjust_values(e)} defaultValue={Loaded && Attributes ? Attributes["crafts"] : ""}></textarea>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        <div>History</div>
                        <textarea className="bg-gray-200 h-8 w-full resize-none overflow-y-hidden px-1 py-1 text-black rounded" id="history" onChange={e=>adjust_values(e)} defaultValue={Loaded && Attributes ? Attributes["history"] : ""}></textarea>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        <div></div>
                        <button className="bg-blue-500 p-2 rounded text-white rounded cursor-pointer mt-4" onClick={()=>send_api("process")}>
                          Calculate
                        </button>
                      </div>
                    </div>
                  </div>
                :
                  <div className="grid place-items-center grid-cols-1 grid-auto-rows w-full max-w-lg gap-4">
                    <div>
                      Stateshaper can save storage space needed for many types of generated content. Personalized ads are one of the uses that can showcase this tool's ability. The primary reason space and bandwidth can be reduced is due to the fact that the program allows for data to easily be generated from a compressed seed in real-time. 
                    </div>
                    <div>
                      This consumes very little computational resources and the installed package size is less than 1MB. All that is needed besides the main package is an app-specific plugin that can be tailored to the desired output. Stateshaper plugins are intended to take data (such as the ratings and ad images seen here), and compress it according to developer needs. Along the way, attributes can be adjusted based on variables such as user input or time of the year.
                    </div>
                    <div>
                      Actual data storage size is cut all the way down to the Stateshaper seed formats shown on to the right. This can often account for over 90% reduction in space used, and also allows for privacy through obfuscation.
                    </div>
                    <div>
                      Other uses can include, but are not limited to smart home scheduling, gaming npc behavior, fintech market data QA, ML training, and store inventories. 
                    </div>
                  </div>
                }
              </div>

              <div className="grid w-full max-w-2xl place-items-center">
                <div className="grid grid-rows-1 grid-cols-3 gap-6 sm:gap-10 lg:gap-16">
                  <img className="w-20 h-20 sm:w-28 sm:h-28 lg:w-36 lg:h-36" src={Ads ? Ads[0] : "images/001.png"}/>
                  <img className="w-20 h-20 sm:w-28 sm:h-28 lg:w-36 lg:h-36" src={Ads ? Ads[1] : "images/002.png"}/>
                  <img className="w-20 h-20 sm:w-28 sm:h-28 lg:w-36 lg:h-36" src={Ads ? Ads[2] : "images/003.png"}/>
                </div>

                <div className="grid grid-auto-rows mt-12 w-full place-items-center">
                  <div className="text-bold text-lg">
                    Seed State Format
                  </div>
                  <div className="italic mt-4 text-center max-w-xl">
                    Once a profile is created, most associated data is compressed into Seed State format. Attributes can be adjusted over time to change the output. 
                  </div>

                  <div className="grid grid-rows-1 grid-cols-4 place-items-center cursor-pointer text-gray-200 mt-8 w-full max-w-xl">
                    <a id="0" className={LinkText} onClick={(e) => seed_text(e.target.id)}>
                      Full State
                    </a>
                    <a id="1" className="hover:font-bold" onMouseOver={(e) => seed_text(e.target.id)} onMouseOut={(e) => seed_text("0")}>
                      Short State
                    </a>
                    <a id="2" className="hover:font-bold" onMouseOver={(e) => seed_text(e.target.id)} onMouseOut={(e) => seed_text("0")}>
                      Tiny State
                    </a>
                    <a id="3" className="hover:font-bold" onMouseOver={(e) => seed_text(e.target.id)} onMouseOut={(e) => seed_text("0")}>
                      Raw State
                    </a>
                  </div>

                  <div className="grid grid-rows-2 grid-cols-1 gap-6 w-full max-w-xl h-[10rem] mt-8 text-sm text-gray-700 p-4 rounded bg-gray-200 overflow-auto break-all">
                    <code>
                      {SeedText ? SeedText[0] : ""}
                    </code>
                    <code className="mt-8">
                      {SeedText ? SeedText[1] : ""}
                    </code>
                  </div>

                  <div className="italic mt-8 text-center max-w-xl">
                    A <i>Stateshaper</i> seed can be compressed even further into Tiny or Raw State format. This can shrink data such as JSON dictionaries containing attributes for personalization or arrays of image or video links. These formats can be decoded using the State Decoder tool, state-decoder. 
                  </div>
                </div>
              </div>
            </div>

            <div className={!ShowCode ? "text-white text-lg hover:font-bold fixed bottom-2 right-168 hover:text-gray-300 cursor-pointer" : "text-xl font-bold fixed bottom-2 right-168 text-gray-300 cursor-pointer"} onMouseEnter={e=>setShowCode(true)} onClick={e=>setShowCode(false)}>
              CODE
            </div>
            <div className="text-white text-lg hover:text-xl hover:font-bold fixed bottom-2 right-72 hover:text-gray-300 cursor-pointer" onMouseEnter={e=>setShowExample(true)} onMouseLeave={e=>setShowExample(false)}>
              EXAMPLE ONLY
            </div>
            {ShowCode ?
              <div className="text-white p-4 py-3 fixed bottom-10 right-168 w-112 h-18 rounded-lg bg-blue-600">
                <div className="text-sm">
                  <span className="font-bold">Frontend:</span> <a className="cursor-pointer hover:text-gray-300 hover:italic" href="https://www.github.com/jgddesigns/stateshaper/tree/ads_demo" target="_blank">https://www.github.com/jgddesigns/stateshaper/tree/ads_demo</a>
                </div>
              </div>
            : null}
            {ShowExample ?
              <div className="text-white px-4 py-3 fixed bottom-10 right-72 w-88 h-18 rounded-lg bg-blue-600">
                <div className="text-sm font-bold">
                  Sample app, real logic. 
                </div>
                <div className="text-sm mt-2">
                  Intended to showcase the tool's capabilities.
                </div>
              </div>
            : null}
          </>
        }
      </div>
    </div>
  )
    }
