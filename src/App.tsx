import './App.css'
import Papa from 'papaparse';
import {useEffect, useState} from "react";
import ReunionFiles from "./ReunionFiles";

const App = () => {
    const [loading,setLoading]=useState(true)
    const [data,setData]=useState([])

    useEffect(() => {
        setLoading(true)

        Papa.parse('./thefiles.csv', {
            header: true,
            download: true,
            dynamicTyping: true,
            complete: ({data}) => {
                setLoading(false)
                // @ts-ignore
                setData(data)
            }
        })

        setLoading(false)
    },[])

    return (
        <ReunionFiles data={data} loading={loading}/>
   )
}

export default App
