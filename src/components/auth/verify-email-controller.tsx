import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { buttonVariants } from '@/components/ui/button';

import { api } from '@/lib/api/api';

export function VerifyEmailController() {
  const { t } = useTranslation();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [errorDetails, setErrorDetails] = useState<string>('');

  useEffect(() => {
    const verify = async () => {
      const params = new URLSearchParams(window.location.search);
      const token = params.get('token');

      if (!token) {
        setStatus('error');
        setErrorDetails('InvalidToken');
        return;
      }

      try {
        // Using API SDK as requested by user
        const response = await api.user.auth.verifyEmail({ token });
        if (response.success) {
          setStatus('success');
        } else {
          setStatus('error');
          setErrorDetails((response.error as string) || 'Failed');
        }
      } catch (e) {
        console.error(e);
        setStatus('error');
        setErrorDetails('UnexpectedError');
      }
    };

    verify();
  }, []);

  if (status === 'loading') {
    return (
      <Card className="auth-card">
        <CardHeader>
          <CardTitle className="auth-card-title">
            {t('user.pages.verify_email.verifying')}
          </CardTitle>
        </CardHeader>
      </Card>
    );
  }

  if (status === 'success') {
    return (
      <Card className="auth-card">
        <CardHeader>
          <CardTitle
            className="auth-card-title text-success"
            data-testid="verify-email-success-heading"
          >
            {t('user.pages.verify_email.success_heading')}
          </CardTitle>
          <CardDescription
            className="auth-card-description"
            data-testid="verify-email-success-message"
          >
            {t('user.pages.verify_email.success_message')}
          </CardDescription>
        </CardHeader>
        <CardContent className="auth-form-container">
          <a
            href="/login"
            className={buttonVariants({
              variant: 'default',
              className: 'auth-submit-button w-full',
            })}
          >
            {t('user.pages.verify_email.go_to_login')}
          </a>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="auth-card">
      <CardHeader>
        <CardTitle
          className="auth-card-title text-destructive"
          data-testid="verify-email-error-heading"
        >
          {t('user.pages.verify_email.failed_heading')}
        </CardTitle>
        <CardDescription className="auth-card-description" data-testid="verify-email-error-message">
          {errorDetails
            ? t(`user.auth.verify.error.${errorDetails}`) || errorDetails
            : t('user.pages.verify_email.failed_message_default')}
        </CardDescription>
      </CardHeader>
      <CardContent className="auth-form-container">
        <a
          href="/login"
          className={buttonVariants({
            variant: 'default',
            className: 'auth-submit-button w-full',
          })}
        >
          {t('user.pages.verify_email.back_to_login')}
        </a>
      </CardContent>
    </Card>
  );
}
