import React from 'react'
import range from 'lodash/range'

interface Props {
  file: any
  sanityFile: any
  search: (string: string) => void
}

const LinkGrid = ({
  onClick,
  linkNum,
  description,
  link,
}: {
  onClick: () => any
  linkNum: number
  description: string
  link: string
}) => {
  return (
    <a className={`relative flex h-[51px] ${link?.trim() && 'hover:cursor-pointer'}`} onClick={onClick}>
      <div className=" flex w-[24px] justify-center border-x-[1px] border-b-[1px] border-neutral-800 bg-[#c5f7c5] pt-[1px]">
        {linkNum}
      </div>
      <div className="w-full border-b-[1px] border-r-[1px] border-solid border-gray-600 bg-newsprint-pink p-1 text-left text-justify text-[11px] leading-none md:text-[10px] xl:text-[11px]">
        {description?.includes('∞∞') ? '' : description}
      </div>
      {link && (
        <div className="absolute bottom-0 right-0 border-[1px] border-black bg-link-name px-2 text-[10px] font-bold leading-none text-purple-800">
          {link}
        </div>
      )}
    </a>
  )
}

const FileLinks: React.FC<Props> = ({ file, sanityFile, search }) => {
  const sanityPage = sanityFile?.pages?.find((p: { pageNumber: string }) => {
    return p.pageNumber.trim() === file['Set#']?.trim()
  })

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
    <div className="grid gap-1 xs:grid-cols-2 md:grid-cols-4">
      {range(1, 5).map((quadrant) => (
        <div className="- flex w-full flex-col border-black" key={quadrant}>
          <h3 className="rounded-t-sm border-[1px] border-gray-500 bg-green-200">Quadrant {quadrant}</h3>
          {range(1, 9).map((linkNum) => {
            const filemakerSuffix = descriptionRows[quadrant - 1][linkNum - 1]
            const filemakerDescription = file && file[`sm${filemakerSuffix}`]
            const sanityDescription = sanityPage && sanityPage[`q${quadrant}r${linkNum}`]
            const description = sanityDescription || filemakerDescription
            const rawLink = file && file[`Goto sm${nameRows[quadrant - 1][linkNum - 1]}`]
            const link = rawLink && rawLink.replace('Entry\rET', 'ET').replace('Entry', 'Entry ET')

            return (
              // eslint-disable-next-line jsx-a11y/anchor-is-valid
              <LinkGrid
                key={`q${quadrant}_link_${linkNum}`}
                onClick={() => {
                  if (link?.trim()) search(link)
                }}
                linkNum={linkNum}
                description={description}
                link={link}
              />
            )
          })}
        </div>
      ))}
    </div>
  )
}

export default FileLinks
