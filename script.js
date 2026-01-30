const input = document.getElementById("searchInput");
const profile = document.getElementById("profile");
const repos = document.getElementById("repos");
const loading = document.getElementById("loading");
const error = document.getElementById("error");

input.addEventListener("keypress", function (event) {
    if (event.key === "Enter") {
        fetchUser(input.value.trim());
    }
});

async function fetchUser(username) {

    if (username === "") return;

    profile.innerHTML = "";
    repos.innerHTML = "";
    error.innerText = "";

    loading.style.display = "block";

    try {
        const response = await fetch(`https://api.github.com/users/${username}`);

        if (!response.ok) {
            throw new Error("User not found");
        }

        const user = await response.json();

        showProfile(user);
        fetchRepos(user.repos_url);

    } catch (err) {
        error.innerText = err.message;
    }

    loading.style.display = "none";
}

function showProfile(user) {

    
    const joiningDate = formatDate(user.created_at);

    
    profile.innerHTML = `
        <img src="${user.avatar_url}" alt="Avatar">

        <h2>${user.name ? user.name : user.login}</h2>

        <p>${user.bio ? user.bio : "No bio available"}</p>

        <p>
            <span>Joined on:</span> ${joiningDate}
        </p>

        <a href="${user.html_url}" target="_blank">
            View GitHub Profile
        </a>
    `;
}

async function fetchRepos(url) {

    const response = await fetch(url);
    const repoData = await response.json();

    repoData.slice(0, 5).forEach(repo => {
        const div = document.createElement("div");
        div.className = "repo";

        div.innerHTML = `
            <a href="${repo.html_url}" target="_blank">
                ${repo.name}
            </a>
        `;

        repos.appendChild(div);
    });
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric"
    });
}
