import { createFileRoute } from '@tanstack/react-router'
import { ConfigDrawer } from '@/components/config-drawer'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { FinanceProvider } from '@/features/finance/components/finance-provider'
import { CoaPage } from '@/features/finance/components/coa-page'

function CoaLayout() {
  return (
    <FinanceProvider>
      <Header fixed>
        <Search />
        <div className='ms-auto flex items-center space-x-4'>
          <ThemeSwitch />
          <ConfigDrawer />
          <ProfileDropdown />
        </div>
      </Header>

      <Main className='flex flex-1 flex-col gap-4 sm:gap-6'>
        <CoaPage />
      </Main>
    </FinanceProvider>
  )
}

export const Route = createFileRoute('/_authenticated/finance/coa')({
  component: CoaLayout,
})
