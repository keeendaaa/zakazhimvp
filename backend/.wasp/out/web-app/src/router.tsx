import React from 'react'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import App from '../../../../src/client/App'

import createAuthRequiredPage from "./auth/pages/createAuthRequiredPage"

import LandingPage from '../../../../src/landing-page/LandingPage'
import { Signup as SignupPage } from '../../../../src/auth/SignupPage'
import { RequestPasswordResetPage } from '../../../../src/auth/email-and-pass/RequestPasswordResetPage'
import { PasswordResetPage } from '../../../../src/auth/email-and-pass/PasswordResetPage'
import { EmailVerificationPage } from '../../../../src/auth/email-and-pass/EmailVerificationPage'
import AccountPage from '../../../../src/user/AccountPage'
import DemoAppPage from '../../../../src/demo-ai-app/DemoAppPage'
import AnalyticsDashboardPage from '../../../../src/admin/dashboards/analytics/AnalyticsDashboardPage'
import { NotFoundPage } from '../../../../src/client/components/NotFoundPage'


import { DefaultRootErrorBoundary } from './components/DefaultRootErrorBoundary'

import { routes } from 'wasp/client/router'

export const routeNameToRouteComponent = {
  LandingPageRoute: LandingPage,
  SignupRoute: SignupPage,
  RequestPasswordResetRoute: RequestPasswordResetPage,
  PasswordResetRoute: PasswordResetPage,
  EmailVerificationRoute: EmailVerificationPage,
  AccountRoute: createAuthRequiredPage(AccountPage),
  DemoAppRoute: createAuthRequiredPage(DemoAppPage),
  AdminRoute: createAuthRequiredPage(AnalyticsDashboardPage),
  NotFoundRoute: NotFoundPage,
} as const;

const waspDefinedRoutes = [
]
const userDefinedRoutes = Object.entries(routes).map(([routeKey, route]) => {
  return {
    path: route.to,
    Component: routeNameToRouteComponent[routeKey],
  }
})

const browserRouter = createBrowserRouter([{
  path: '/',
  element: <App />,
  ErrorBoundary: DefaultRootErrorBoundary,
  children: [
    ...waspDefinedRoutes,
    ...userDefinedRoutes,
  ],
}])

export const router = <RouterProvider router={browserRouter} />
