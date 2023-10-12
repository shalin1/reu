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
    <div className="flex w-full flex-row flex-wrap">
      {range(1, 5).map((quadrant) => (
        <div className="flex w-full flex-col gap-x-2 border-black sm:w-1/2 lg:w-1/4" key={quadrant}>
          <h3 className="border-x-[1px] border-y-[2px] border-black bg-green-200">Quadrant {quadrant}</h3>
          {range(1, 9).map((linkNum) => {
            const suffix = descriptionRows[quadrant - 1][linkNum - 1]
            const description = file && file[`sm${suffix}`]
            const rawLink = file && file[`Goto sm${nameRows[quadrant - 1][linkNum - 1]}`]
            const link = rawLink && rawLink.replace('Entry\rET', 'ET')

            return (
              // eslint-disable-next-line jsx-a11y/anchor-is-valid
              <a
                className="flex h-[50px] overflow-hidden hover:cursor-pointer"
                key={`q${quadrant}_link_${linkNum}`}
                onClick={() => search(link)}
              >
                <div className="flex w-[28px] items-center justify-center border-[1px] border-r-[1px] border-t-[0px] border-neutral-800 bg-[#c5f7c5]">
                  {linkNum}
                </div>
                <div className="flex w-full justify-between border-b-[1px] border-solid border-black bg-newsprint-pink text-left text-[12px] leading-none">
                  <div className="">{description?.includes('∞∞') ? '' : description}</div>
                  {link && (
                    <div className="float-right flex h-4 items-end whitespace-nowrap border-y-[1px] border-l-[1px] border-black bg-link-name px-2 py-0 text-xs font-bold text-purple-900">
                      {link}
                    </div>
                  )}
                </div>
              </a>
            )
          })}
        </div>
      ))}
    </div>
  )
}

export default FileLinks
