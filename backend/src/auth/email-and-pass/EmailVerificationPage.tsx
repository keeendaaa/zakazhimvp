import { Link as WaspRouterLink, routes } from 'wasp/client/router';
import { VerifyEmailForm } from 'wasp/client/auth';
import { AuthPageLayout } from '../AuthPageLayout';

export function EmailVerificationPage() {
  return (
    <AuthPageLayout>
      <VerifyEmailForm />
      <br />
      <span className='text-sm font-medium text-gray-900'>
        If everything is okay, <WaspRouterLink to={routes.LandingPageRoute.to} className='underline'>go to home</WaspRouterLink>
      </span>
    </AuthPageLayout>
  );
}
