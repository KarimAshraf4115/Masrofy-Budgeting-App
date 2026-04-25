import { getInstance } from '../lib/SQLiteHelper';

export default function Home() {
  const db = getInstance();
  return (
    <main>
      <h1>Masrofy is running!</h1>
    </main>
  );
}