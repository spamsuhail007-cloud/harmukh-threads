'use client';
import { useActionState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();
  
  async function action(_prevState: any, formData: FormData) {
    const email = formData.get('email');
    const password = formData.get('password');
    
    try {
      const res = await signIn('credentials', {
        email, password, redirect: false
      });
      if (res?.error) {
        return { error: 'Invalid credentials' };
      }
      router.push('/admin');
      return { success: true };
    } catch (err) {
      return { error: 'Something went wrong' };
    }
  }

  const [state, formAction, isPending] = useActionState(action, undefined);

  return (
    <div className="admin-login-wrap">
      <div className="admin-login-card">
        <div style={{ textAlign: 'center', marginBottom: 'var(--space-xl)' }}>
          <div className="logo-mark" style={{ fontSize: '2rem', marginBottom: 'var(--space-sm)' }}>✦</div>
          <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.5rem' }}>Admin Portal</h1>
        </div>
        <form action={formAction}>
          <div className="form-group">
            <label className="form-label">Email</label>
            <input type="email" name="email" className="form-input" required defaultValue="admin@harmukh.com" />
          </div>
          <div className="form-group">
            <label className="form-label">Password</label>
            <input type="password" name="password" className="form-input" required defaultValue="admin123" />
          </div>
          {state?.error && <div className="form-error" style={{ marginBottom: 'var(--space-md)', textAlign: 'center' }}>{state.error}</div>}
          <button type="submit" className="btn btn-primary btn-full" disabled={isPending}>
            {isPending ? 'Authenticating...' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
}
