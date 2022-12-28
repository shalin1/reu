import './App.css'
import Papa from 'papaparse';

const App =  async () => {
    const data = Papa.parse('./thefiles.csv', {
        header: true,
        download: true,
        dynamicTyping: true,
        complete: ({ data }) => {
            console.log(data)
        }
    })

    return (
      <h1 className="text-3xl font-bold underline">
          Hello world!
      </h1>
  )
}

export default App
