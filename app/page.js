import { redirect } from 'next/navigation'

export default async function Home() {
    const response = await fetch('http://localhost:3000/api/user', {
        cache: 'no-store' // always fetch fresh, never use cached result
    });
    const data = await response.json();

    if (data.pinSet) {
        redirect('/login')  // PIN exists → go to login
    } else {
        redirect('/signup') // no PIN yet → go to setup PIN
    }
}