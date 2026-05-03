import Link from 'next/link'

export default function SignupPage() {
  return (
    /* Same full screen cover trick */
    <div className="fixed inset-0 z-50 bg-surface-container-low min-h-screen flex items-center justify-center p-4 md:p-8 selection:bg-primary-fixed selection:text-on-primary-fixed">
      
      {/* Main Centered Container */}
      <div className="w-full max-w-[440px]">
        
        {/* App Logo Area */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-surface-container-lowest rounded-2xl shadow-sm mb-4">
            <span className="material-symbols-outlined text-primary text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>account_balance_wallet</span>
          </div>
          <h1 className="font-headline-lg text-headline-lg text-primary tracking-tight">Masroofy</h1>
        </div>

        {/* Registration Card */}
        <div className="bg-surface-container-lowest rounded-[1.5rem] p-8 shadow-[0_8px_30px_rgba(0,0,55,0.04)] relative overflow-hidden">
          
          {/* Subtle Top Accent line */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary to-primary-container opacity-80"></div>

          <div className="mb-8">
            <h2 className="font-headline-md text-headline-md text-on-surface">Create your account</h2>
            <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">Start managing your expenses with precision.</p>
          </div>

          <form action="#" className="space-y-5" method="POST">
            {/* Full Name Field */}
            <div>
              <label className="block font-label-caps text-label-caps text-on-surface-variant mb-1.5 ml-1 uppercase tracking-wider" htmlFor="fullName">Full Name</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-outline">
                  <span className="material-symbols-outlined text-[20px]">person</span>
                </div>
                <input className="w-full pl-11 pr-4 py-3.5 bg-surface text-on-surface font-body-lg text-body-lg rounded-xl border border-transparent focus:border-primary focus:bg-surface-container-lowest focus:ring-4 focus:ring-primary-fixed-dim/30 transition-all placeholder:text-outline-variant outline-none" id="fullName" name="fullName" placeholder="John Doe" required type="text" readOnly />
              </div>
            </div>

            {/* Email Field */}
            <div>
              <label className="block font-label-caps text-label-caps text-on-surface-variant mb-1.5 ml-1 uppercase tracking-wider" htmlFor="email">Email Address</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-outline">
                  <span className="material-symbols-outlined text-[20px]">mail</span>
                </div>
                <input className="w-full pl-11 pr-4 py-3.5 bg-surface text-on-surface font-body-lg text-body-lg rounded-xl border border-transparent focus:border-primary focus:bg-surface-container-lowest focus:ring-4 focus:ring-primary-fixed-dim/30 transition-all placeholder:text-outline-variant outline-none" id="email" name="email" placeholder="name@example.com" required type="email" readOnly />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label className="block font-label-caps text-label-caps text-on-surface-variant mb-1.5 ml-1 uppercase tracking-wider" htmlFor="password">Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-outline">
                  <span className="material-symbols-outlined text-[20px]">lock</span>
                </div>
                <input className="w-full pl-11 pr-11 py-3.5 bg-surface text-on-surface font-body-lg text-body-lg rounded-xl border border-transparent focus:border-primary focus:bg-surface-container-lowest focus:ring-4 focus:ring-primary-fixed-dim/30 transition-all placeholder:text-outline-variant outline-none" id="password" name="password" placeholder="••••••••" required type="password" readOnly />
                <button className="absolute inset-y-0 right-0 pr-4 flex items-center text-outline hover:text-on-surface transition-colors cursor-pointer focus:outline-none" type="button">
                  <span className="material-symbols-outlined text-[20px]">visibility_off</span>
                </button>
              </div>
            </div>

            {/* Confirm Password Field */}
            <div>
              <label className="block font-label-caps text-label-caps text-on-surface-variant mb-1.5 ml-1 uppercase tracking-wider" htmlFor="confirmPassword">Confirm Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-outline">
                  <span className="material-symbols-outlined text-[20px]">check_circle</span>
                </div>
                <input className="w-full pl-11 pr-4 py-3.5 bg-surface text-on-surface font-body-lg text-body-lg rounded-xl border border-transparent focus:border-primary focus:bg-surface-container-lowest focus:ring-4 focus:ring-primary-fixed-dim/30 transition-all placeholder:text-outline-variant outline-none" id="confirmPassword" name="confirmPassword" placeholder="••••••••" required type="password" readOnly />
              </div>
            </div>

            {/* Terms Checkbox */}
            <div className="flex items-start pt-2">
              <div className="flex items-center h-5">
                <input className="w-4 h-4 border border-outline rounded bg-surface focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-surface-container-lowest text-primary cursor-pointer" id="terms" type="checkbox" />
              </div>
              <label className="ml-3 font-body-sm text-body-sm text-on-surface-variant cursor-pointer" htmlFor="terms">
                I agree to the <a className="text-primary hover:underline" href="#">Terms of Service</a> and <a className="text-primary hover:underline" href="#">Privacy Policy</a>.
              </label>
            </div>

            {/* Submit Button */}
            <button className="w-full mt-8 bg-primary text-on-primary py-4 rounded-xl font-headline-md text-headline-md hover:bg-primary-fixed-variant hover:shadow-md active:scale-[0.98] transition-all duration-200" type="button">
              Sign Up
            </button>
          </form>
        </div>

        {/* Footer Link */}
        <div className="mt-8 text-center">
          <span className="font-body-sm text-body-sm text-on-surface-variant">Already have an account? </span>
          <Link className="font-body-sm text-body-sm text-primary font-semibold hover:text-primary-container hover:underline transition-colors px-1 py-2" href="/login">Log in</Link>
        </div>

      </div>
    </div>
  )
}