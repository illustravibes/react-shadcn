import {
  Construction,
  LayoutDashboard,
  Monitor,
  Bug,
  ListTodo,
  FileX,
  HelpCircle,
  Lock,
  Bell,
  Package,
  Palette,
  ServerOff,
  Settings,
  Wrench,
  UserCog,
  UserX,
  Users,
  MessagesSquare,
  ShieldCheck,
  AudioWaveform,
  Command,
  GalleryVerticalEnd,
  Wallet,
  BarChart3,
  Receipt,
  CreditCard,
  Banknote,
  Box,
  Hammer,
  Users2,
  Percent,
  Coins,
  TrendingUp,
  FileText,
} from 'lucide-react'
import { ClerkLogo } from '@/assets/clerk-logo'
import { type SidebarData } from '../types'

export const sidebarData: SidebarData = {
  user: {
    name: 'satnaing',
    email: 'satnaingdev@gmail.com',
    avatar: '/avatars/shadcn.jpg',
  },
  teams: [
    {
      name: 'Shadcn Admin',
      logo: Command,
      plan: 'Vite + ShadcnUI',
    },
    {
      name: 'Acme Inc',
      logo: GalleryVerticalEnd,
      plan: 'Enterprise',
    },
    {
      name: 'Acme Corp.',
      logo: AudioWaveform,
      plan: 'Startup',
    },
  ],
  navGroups: [
    {
      title: 'General',
      items: [
        {
          title: 'Dashboard',
          url: '/',
          icon: LayoutDashboard,
        },
        {
          title: 'Tasks',
          url: '/tasks',
          icon: ListTodo,
        },
        {
          title: 'Apps',
          url: '/apps',
          icon: Package,
        },
        {
          title: 'Chats',
          url: '/chats',
          badge: '3',
          icon: MessagesSquare,
        },
        {
          title: 'Users',
          url: '/users',
          icon: Users,
        },
        {
          title: 'Secured by Clerk',
          icon: ClerkLogo,
          items: [
            {
              title: 'Sign In',
              url: '/clerk/sign-in',
            },
            {
              title: 'Sign Up',
              url: '/clerk/sign-up',
            },
            {
              title: 'User Management',
              url: '/clerk/user-management',
            },
          ],
        },
      ],
    },
    {
      title: 'Finance',
      items: [
        {
          title: 'Chart of Accounts',
          url: '/finance/chart-of-accounts',
          icon: BarChart3,
        },
        {
          title: 'Manual Journal',
          url: '/finance/manual-journal',
          icon: FileText,
        },
        {
          title: 'Invoicing',
          url: '/finance/invoicing',
          icon: Receipt,
        },
        {
          title: 'Reports',
          icon: TrendingUp,
          items: [
            {
              title: 'Profit & Loss',
              url: '/finance/reports/profit-loss',
            },
            {
              title: 'Balance Sheet',
              url: '/finance/reports/balance-sheet',
            },
            {
              title: 'Trial Balance',
              url: '/finance/reports/trial-balance',
            },
          ],
        },
        {
          title: 'Expenses',
          url: '/finance/expenses',
          icon: Wallet,
        },
        {
          title: 'Banking',
          url: '/finance/banking',
          icon: CreditCard,
        },
        {
          title: 'Inventory',
          url: '/finance/inventory',
          icon: Box,
        },
        {
          title: 'Fixed Assets',
          url: '/finance/fixed-assets',
          icon: Hammer,
        },
        {
          title: 'Payroll',
          url: '/finance/payroll',
          icon: Users2,
        },
        {
          title: 'Tax Management',
          url: '/finance/tax',
          icon: Percent,
        },
        {
          title: 'Petty Cash',
          url: '/finance/petty-cash',
          icon: Coins,
        },
        {
          title: 'Multi-Currency',
          url: '/finance/currency',
          icon: Banknote,
        },
        {
          title: 'Audit Trail',
          url: '/finance/audit-trail',
          icon: FileText,
        },
      ],
    },
    {
      title: 'Pages',
      items: [
        {
          title: 'Auth',
          icon: ShieldCheck,
          items: [
            {
              title: 'Sign In',
              url: '/sign-in',
            },
            {
              title: 'Sign In (2 Col)',
              url: '/sign-in-2',
            },
            {
              title: 'Sign Up',
              url: '/sign-up',
            },
            {
              title: 'Forgot Password',
              url: '/forgot-password',
            },
            {
              title: 'OTP',
              url: '/otp',
            },
          ],
        },
        {
          title: 'Errors',
          icon: Bug,
          items: [
            {
              title: 'Unauthorized',
              url: '/errors/unauthorized',
              icon: Lock,
            },
            {
              title: 'Forbidden',
              url: '/errors/forbidden',
              icon: UserX,
            },
            {
              title: 'Not Found',
              url: '/errors/not-found',
              icon: FileX,
            },
            {
              title: 'Internal Server Error',
              url: '/errors/internal-server-error',
              icon: ServerOff,
            },
            {
              title: 'Maintenance Error',
              url: '/errors/maintenance-error',
              icon: Construction,
            },
          ],
        },
      ],
    },
    {
      title: 'Other',
      items: [
        {
          title: 'Settings',
          icon: Settings,
          items: [
            {
              title: 'Profile',
              url: '/settings',
              icon: UserCog,
            },
            {
              title: 'Account',
              url: '/settings/account',
              icon: Wrench,
            },
            {
              title: 'Appearance',
              url: '/settings/appearance',
              icon: Palette,
            },
            {
              title: 'Notifications',
              url: '/settings/notifications',
              icon: Bell,
            },
            {
              title: 'Display',
              url: '/settings/display',
              icon: Monitor,
            },
          ],
        },
        {
          title: 'Help Center',
          url: '/help-center',
          icon: HelpCircle,
        },
      ],
    },
  ],
}
