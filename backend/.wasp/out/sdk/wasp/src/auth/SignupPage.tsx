import { Link as WaspRouterLink, routes } from 'wasp/client/router';
import { SignupForm } from 'wasp/client/auth';
import { AuthPageLayout } from './AuthPageLayout';

export function Signup() {
  return (
    <AuthPageLayout>
      <SignupForm />
      <br />
      <br />
    </AuthPageLayout>
  );
}
