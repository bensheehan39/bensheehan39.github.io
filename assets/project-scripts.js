const select = document.getElementById('project-select');
const projects = document.querySelectorAll('.project-content');

select.addEventListener('change', () => {
    projects.forEach(proj => proj.style.display = 'none');
    const selected = document.getElementById(select.value);
    if(selected) selected.style.display = 'block';
});

                                         
const loadBtn = document.getElementById("load-races-btn");
const raceDropdown = document.getElementById("race-drop-down");

loadBtn.addEventListener("click", async () => {
    const year = document.getElementById("season-input").value;
    if (!year) return alert("Enter a season year");
    if (year < 2018 || year > 2025) return alert("Only years between 2018 and 2025 are supported.");

    const response = await fetch(`http://127.0.0.1:5000/get_races?year=${year}`);
    const races = await response.json();

    raceDropdown.innerHTML = '<option value="">Select a race</option>';

    races.forEach(race => {
        const option = document.createElement("option");
        option.value = race.round;
        option.textContent = race.name;
        raceDropdown.appendChild(option);
    });
});


const plotBtn = document.getElementById("plot-btn");
plotBtn.addEventListener("click", () => {
    const img = document.getElementById("plot-image");
    const year = document.getElementById("season-input").value;
    const round = document.getElementById("race-drop-down").value;
    if (!year || !round) {
        alert("Please select both a season year and a race.");
        return;
    }
    img.src = `http://127.0.0.1:5000/plot_lap_times?year=${year}&round=${round}&t=` + new Date().getTime();
});


plotBtn.addEventListener("click", async () => {
    const img1 = document.getElementById("plot-image-qualifying");
    const img2 = document.getElementById("plot-image-race-positions");
    const img3 = document.getElementById("plot-image-race-pace");
    const year = document.getElementById("season-input").value;
    const round = document.getElementById("race-drop-down").value;

    if (!year || !round) {
        alert("Please select both a season year and a race.");
        return;
    }

    const response = await fetch(`http://127.0.0.1:5000/plot_lap_times?year=${year}&round=${round}&t=` + new Date().getTime());
    const data = await response.json();

    const firstPlotB64 = data.images[0];
    img1.src = "data:image/png;base64," + firstPlotB64;
    const secondPlotB64 = data.images[1];
    img2.src = "data:image/png;base64," + secondPlotB64;
    const thirdPlotB64 = data.images[2];
    img3.src = "data:image/png;base64," + thirdPlotB64;
});
