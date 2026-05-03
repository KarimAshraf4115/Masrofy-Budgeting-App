import Link from 'next/link'

export default function LoginPage() {
  return (
    /* fixed inset-0: Covers the entire screen from corner to corner */
    /* z-50: Ensures it sits on top of the sidebar */
    /* bg-surface-container-low: The light grayish background from your design */
    <div className="fixed inset-0 z-50 bg-surface-container-low min-h-screen flex items-center justify-center p-4 md:p-8 selection:bg-primary-fixed selection:text-on-primary-fixed">
      
      {/* Main Centered Container */}
      <div className="w-full max-w-[420px]">
        
        {/* App Logo Area */}
        <div className="mb-8 flex flex-col items-center justify-center">
          <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center shadow-sm mb-4">
            <span className="material-symbols-outlined text-on-primary" style={{ fontVariationSettings: "'FILL' 1", fontSize: '28px' }}>account_balance_wallet</span>
          </div>
          <h1 className="font-headline-lg text-headline-lg text-primary text-center tracking-tight">Masroofy</h1>
        </div>

        {/* Login Card */}
        <div className="bg-surface-container-lowest rounded-xl p-8 shadow-[0_4px_20px_rgba(0,0,0,0.04)] relative overflow-hidden">
          
          {/* Subtle Top Accent line */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary to-primary-container opacity-80"></div>

          <div className="mb-8">
            <h2 className="font-headline-md text-headline-md text-on-surface">Welcome back</h2>
            <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">Please enter your details to access your account.</p>
          </div>

          {/* Locked Account Warning (Static UI for now) */}
          <div className="w-full bg-error-container rounded-lg p-4 mb-6 flex items-start gap-3 border border-error/20">
            <span className="material-symbols-outlined text-on-error-container shrink-0 mt-0.5">lock</span>
            <div>
              <h3 className="font-label-caps text-label-caps text-on-error-container mb-1">Account Locked</h3>
              <p className="font-body-sm text-body-sm text-on-error-container">For your security, we have temporarily locked your account after multiple failed attempts. Please reset your password or contact support.</p>
            </div>
          </div>

          {/* Login Form */}
          <form className="w-full flex flex-col gap-5">
            {/* Email Field */}
            <div className="flex flex-col">
              <label className="font-label-caps text-label-caps text-on-surface-variant mb-2 pl-1" htmlFor="email">Email Address</label>
              <input className="w-full bg-surface-container-low border-0 border-b-2 border-transparent focus:border-primary focus:bg-surface-container-highest rounded-t-lg px-4 py-3 font-body-lg text-body-lg text-on-surface transition-colors outline-none" id="email" name="email" placeholder="name@example.com" required type="email" readOnly />
            </div>

            {/* Password Field */}
            <div className="flex flex-col">
              <div className="flex justify-between items-center mb-2 pl-1 pr-1">
                <label className="font-label-caps text-label-caps text-on-surface-variant" htmlFor="password">Password</label>
                <Link className="font-label-caps text-label-caps text-primary hover:text-on-primary-fixed-variant transition-colors" href="#">Forgot?</Link>
              </div>
              <div className="relative">
                <input className="w-full bg-surface-container-low border-0 border-b-2 border-transparent focus:border-primary focus:bg-surface-container-highest rounded-t-lg px-4 py-3 font-body-lg text-body-lg text-on-surface transition-colors outline-none" id="password" name="password" placeholder="••••••••" required type="password" readOnly />
                <button className="absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-on-surface" type="button">
                  <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>visibility_off</span>
                </button>
              </div>
            </div>

            {/* Submit Action */}
            <button className="w-full mt-4 bg-primary text-on-primary font-headline-md text-[16px] leading-[24px] py-4 rounded-lg shadow-sm hover:bg-on-primary-fixed-variant active:scale-[0.98] transition-all duration-200 flex justify-center items-center gap-2" type="button">
              Log In
              <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>arrow_forward</span>
            </button>
          </form>
        </div>

        {/* Footer / Signup Link */}
        <div className="mt-8 text-center">
          <p className="font-body-sm text-body-sm text-on-surface-variant">
            Dont have an account? 
            <Link className="text-primary font-medium hover:text-on-primary-fixed-variant hover:underline transition-colors ml-1" href="/signup">Sign up</Link>
          </p>
        </div>

      </div>
    </div>
  )
}