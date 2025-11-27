export async function addMovieToGroup(groupId, apiId) {
  try {
    const res = await fetch(
      `http://localhost:3001/group-movies/${groupId}/${apiId}`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );

    if (!res.ok) throw new Error("Failed to add movie");

    return await res.json();

  } catch (err) {
    console.error("Error adding movie:", err);
    throw err;
  }
}



export async function removeMovieFromGroup(groupId, movieId) {
  const res = await fetch(
    `http://localhost:3001/group-movies/${groupId}/${movieId}`,
    {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    }
  );

  if (!res.ok) throw new Error("Failed to remove movie");
  return res.json();
}

export async function getGroupMovies(groupId) {
  const res = await fetch(
    `http://localhost:3001/group-movies/${groupId}/movies`,
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`
      }
    }
  );
  return res.json();
}

