const getSpotifyToken = require("../services/spotifyService");

describe("Spotify API Integration", () => {
  it("should fetch an access token", async () => {
    const token = await getSpotifyToken();
    expect(typeof token).toBe("string");
    expect(token.length).toBeGreaterThan(10); // very loose check
  });
});
