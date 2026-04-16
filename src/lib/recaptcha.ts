export async function verifyRecaptcha(token: string) {
  const secretKey = process.env.RECAPTCHA_SECRET_KEY;

  if (!secretKey) {
    if (process.env.NODE_ENV === 'development') {
      console.warn('⚠️ No RECAPTCHA_SECRET_KEY detected in development, bypassing reCAPTCHA.');
      return true;
    }
    console.error('Missing RECAPTCHA_SECRET_KEY in production.');
    return false;
  }

  try {
    const res = await fetch('https://www.google.com/recaptcha/api/siteverify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: `secret=${secretKey}&response=${token}`,
    });

    const data = await res.json();
    
    // Google returns data.score between 0.0 and 1.0. 
    // 1.0 is very likely a good interaction, 0.0 is very likely a bot.
    if (data.success && data.score >= 0.5) {
      return true;
    } else {
      console.warn('reCAPTCHA verification failed or score too low:', data);
      return false;
    }
  } catch (error) {
    console.error('Error verifying reCAPTCHA:', error);
    return false;
  }
}
