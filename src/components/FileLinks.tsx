import React from 'react'
import range from 'lodash/range'

interface Props {
  file: any
  search: (string: string) => void
}

const FileLinks: React.FC<Props> = ({ file, search }) => {
  const nameRows = [
    ['0', '1', '2', '3', '4', '5', '12', '13'],
    ['14', '15', '23', '24', '25', '34', '35', '45'],
    ['123', '124', '125', '134', '135', '145', '234', '235'],
    ['245', '345', '1234', '1235', '1245', '1345', '2345', '12345'],
  ]
  const descriptionRows = [
    ['0', '1', '2', '3', '4', '5', '12', '13'],
    ['14', '15', '23', '24', '25', '34', '35', '45'],
    ['124', '123', '125', '134', '135', '145', '234', '235'],
    ['245', '345', '1234', '1235', '1245', '1345', '2345', '12345'],
  ]
  return (
    <div className="flex flex-col gap-2 sm:grid sm:grid-cols-2 lg:grid-cols-4">
      {range(1, 5).map((quadrant) => (
        <div className="flex flex-col border-x-[1px] border-black" key={quadrant}>
          <h3 className="border-y-2 border-x-[1px] border-black bg-green-200">Quadrant {quadrant}</h3>
          {range(1, 9).map((linkNum) => {
            const suffix = descriptionRows[quadrant - 1][linkNum - 1]
            const description = file && file[`sm${suffix}`]
            const link = file && file[`Goto sm${nameRows[quadrant - 1][linkNum - 1]}`]
            return (
              // eslint-disable-next-line jsx-a11y/anchor-is-valid
              <a
                className="relative flex h-16 hover:cursor-pointer"
                key={`q${quadrant}_link_${linkNum}`}
                onClick={() => search(link)}
              >
                <div className="flex w-[28px] items-center justify-center border-r-[1px] border-b-[1px] border-neutral-800 bg-[#c5f7c5]">
                  {linkNum}
                </div>
                <div className="w-full border-b-[1px] border-solid border-black bg-violet-200 p-1 text-left text-xs leading-none">
                  {description?.includes('∞∞') ? '' : description}
                </div>
                {link && (
                  <div className="absolute bottom-0 right-0 w-[120px] border-y-[1px] border-l-[1px] border-black bg-fuchsia-200 text-sm font-bold text-purple-800">
                    {link}
                  </div>
                )}
              </a>
            )
          })}
        </div>
      ))}
    </div>
  )
}

export default FileLinks
