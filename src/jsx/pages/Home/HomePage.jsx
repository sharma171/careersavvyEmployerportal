import React, { useState, useEffect } from 'react';
import AiCompressIcon from "./icons & images/aigif compressed.gif";
import Preloader from "./preloader";

export default function HomePage() {
    const [loaderAnimation,setLoaderAnimation] = useState(true);
    useEffect(()=>{
        setTimeout(()=>{
            setLoaderAnimation(false);
        },1500)
    },[])
  return (
    <>
                {loaderAnimation ? (
                    <div className="LoaderAnimation">
                       <div className="gptAnimate"></div>
                       <img className="gptIcon" src={AiCompressIcon} alt="gptIcon"/>
                 </div>):(<><Preloader/></>)}
    </>
  )
}

