import ScreeningsList from './ScreeningsList';

export default function Home() {
  return (
    <main>
      <h1>Välkommen till Kino Italy</h1>
      <ScreeningsList days={5} />
    </main>
  );
} 