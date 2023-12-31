import { useState } from 'react'
import { IconType } from 'react-icons/lib'

import { usePathname } from 'next/navigation'
import { tv } from 'tailwind-variants'

import { Accordion } from '../Accordion'
import { SidebarRoute, SidebarRouteProps } from './SidebarRoute'

interface SidebarAccordionProps {
  icon: IconType
  title: string
  path: string
  exact?: boolean
  paths: SidebarRouteProps[]
}

const sidebarAccordion = tv({
  base: 'rounded-lg transition-colors',
  variants: {
    selected: {
      true: 'bg-primary-light/[.15] dark:bg-primary-dark/[.15]',
      false: 'hover:bg-primary-light/10 dark:hover:bg-primary-dark/10'
    },
    open: {
      true: '',
      false: ''
    }
  },
  compoundVariants: [
    {
      open: false,
      selected: true,
      className: 'bg-primary-light/20 hover:bg-primary-light/25 dark:bg-primary-dark/20 dark:hover:bg-primary-dark/25'
    }
  ],
  defaultVariants: {
    selected: false,
    open: false
  }
})

export function SidebarAccordion({ icon, title, path, exact, paths }: SidebarAccordionProps) {
  const pathname = usePathname()
  const selected = exact ? pathname === path : pathname?.startsWith(path)
  const [open, setOpen] = useState(selected)

  return (
    <Accordion
      title={title}
      icon={icon}
      wrapperClassName={sidebarAccordion({ selected, open })}
      onChange={setOpen}
      expanded={selected}
    >
      <div className="flex flex-col gap-2 p-2">
        {paths.map(({ path: subPath, ...rest }) => (
          <SidebarRoute path={path + subPath} key={path + subPath} {...rest} />
        ))}
      </div>
    </Accordion>
  )
}
