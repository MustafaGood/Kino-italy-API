document.addEventListener("DOMContentLoaded", async () => {
  const container = document.getElementById("screenings-list");

  try {
    const response = await fetch("/api/screenings");
    if (!response.ok) throw new Error(`HTTP-fel! Status: ${response.status}`);

    const data = await response.json();
    if (!data.length) {
      container.innerHTML = "<p>Inga kommande visningar hittades.</p>";
      return;
    }

    data.forEach(item => {
      const movie = item.attributes.movie.data.attributes.title;
      const start = new Date(item.attributes.start_time).toLocaleString();

      const div = document.createElement("div");
      div.style.padding = "10px";
      div.style.borderBottom = "1px solid #ddd";
      div.style.marginBottom = "10px";
      div.innerHTML = `<strong>${movie}</strong> – ${start}`;
      container.appendChild(div);
    });
  } catch (error) {
    console.error("Kunde inte hämta visningar:", error);
    container.innerHTML = "<p>Misslyckades med att ladda visningar. Försök igen senare.</p>";
  }
});
