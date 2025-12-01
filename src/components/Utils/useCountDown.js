import React, { useEffect, useState } from 'react'

const useCountDown = () => {
    const [secondsLeft, setSecondsLeft] = useState(0);

    useEffect(()=>{
        if(secondsLeft<=0) return;

        const timeout = setTimeout(() => {
           setSecondsLeft(secondsLeft-1); 
        }, 1000);

        return ()=> clearTimeout(timeout);
    },[secondsLeft])

    function start(seconds){
        setSecondsLeft(seconds)
    }
    
  return {secondsLeft,start};
}

export default useCountDown
