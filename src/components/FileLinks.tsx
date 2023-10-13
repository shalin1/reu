import React from 'react'
import range from 'lodash/range'

interface Props {
  file: any
  sanityFile: any
  search: (string: string) => void
}

const FileLinks: React.FC<Props> = ({ file, sanityFile, search }) => {
  console.log(sanityFile)
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
        <div className="flex w-full flex-col gap-x-2 border-black sm:w-1/2 md:w-1/4" key={quadrant}>
          <h3 className="border-x-[1px] border-y-[2px] border-black bg-green-200">Quadrant {quadrant}</h3>
          {range(1, 9).map((linkNum) => {
            const filemakerSuffix = descriptionRows[quadrant - 1][linkNum - 1]
            const filemakerDescription = file && file[`sm${filemakerSuffix}`]
            const sanityDescription = sanityFile && sanityFile[`q${quadrant}r${linkNum}`]
            const description = sanityDescription || filemakerDescription
            const rawLink = file && file[`Goto sm${nameRows[quadrant - 1][linkNum - 1]}`]
            const link = rawLink && rawLink.replace('Entry\rET', 'ET')

            return (
              // eslint-disable-next-line jsx-a11y/anchor-is-valid
              <a
                className="relative flex h-[51px] hover:cursor-pointer"
                key={`q${quadrant}_link_${linkNum}`}
                onClick={() => search(link)}
              >
                <div className="flex w-[28px] items-center justify-center border-[1px] border-r-[1px] border-t-[0px] border-neutral-800 bg-[#c5f7c5]">
                  {linkNum}
                </div>
                <div className="w-full border-b-[1px] border-solid border-black bg-newsprint-pink p-1 py-0.5 text-left text-[11px] leading-none md:text-[10px] xl:text-[11px]">
                  {description?.includes('∞∞') ? '' : description}
                </div>
                {link && (
                  <div className="absolute bottom-0 right-0 border-y-[1px] border-l-[1px] border-black bg-link-name px-2 text-[11px] font-bold text-purple-800">
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
