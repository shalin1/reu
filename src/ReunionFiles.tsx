import React from "react";

interface Props {
    data: {
        description: string
        name: string
        num_pages: number
        page:number
    }[]
    loading: boolean
}

const ReunionFiles:React.FC<Props> = ({data,loading}) => {
    if(loading) return<h1>Loading...</h1>
    if(data.length==0) return <h1>Nothing found</h1>

    const {description,name,num_pages,page} = data[0]

    return (
        <>
            <div className='flex justify-between'>
                <h1>{name}</h1>
                <span>{page} of {num_pages}</span>
            </div>
            <div className='border-solid border-2 border-sky-500'>
                {description}
            </div>
        </>
    )
}
export default ReunionFiles