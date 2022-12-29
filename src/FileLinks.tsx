import React from 'react'
import range from 'lodash/range'

interface Props {
  file: any
  search: (string: string) => void
}

const FileLinks: React.FC<Props> = ({ file, search }) => (
  <div className="flex flex-col sm:grid sm:grid-cols-2 lg:grid-cols-4 gap-2">
    {range(1, 5).map((quadrant) => (
      <div className="flex flex-col border-x-[1px] border-black" key={quadrant}>
        <h3 className="bg-green-200 border-black border-y-2 border-x-[1px]">Quadrant {quadrant}</h3>
        {range(1, 9).map((linkNum) => {
          const str = `q${quadrant}_link_${linkNum}`
          console.log(str)
          console.log(file)
          const link = file[str]
          const linkDescription = file[`q${quadrant}_link_${linkNum}_description`]

          return (
            // eslint-disable-next-line jsx-a11y/click-events-have-key-events
            <div
              className="flex h-16 hover:cursor-pointer relative"
              key={`q${quadrant}_link_${linkNum}`}
              onClick={() => search(link)}
            >
              <div className="w-[28px] flex items-center justify-center border-neutral-800 border-r-[1px] border-b-[1px] bg-[#c5f7c5]">
                {linkNum}
              </div>
              <div className="w-full p-1 border-solid border-b-[1px] border-black text-left text-xs leading-none bg-violet-200">
                {linkDescription}
              </div>
              <div className="absolute bottom-0 right-0 bg-fuchsia-200 w-40 border-y-[1px] border-l-[1px] border-black text-sm text-purple-800 font-bold">
                {link}
              </div>
            </div>
          )
        })}
      </div>
    ))}
  </div>
)

export default FileLinks
