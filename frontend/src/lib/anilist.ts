import ky from "ky";

const ANILIST_URL = "https://graphql.anilist.co";

const anilistApi = ky.create({
  prefixUrl: ANILIST_URL,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

export const fetchTrendingAnime = async () => {
  const query = `
    query {
      Page(page: 1, perPage: 10) {
        media(sort: TRENDING_DESC, type: ANIME, isAdult: false) {
          id
          title {
            romaji
            english
          }
          coverImage {
            extraLarge
            color
          }
          description(asHtml: false)
          format
          episodes
        }
      }
    }
  `;

  try {
    const response: any = await anilistApi
      .post("", {
        json: { query },
      })
      .json();

    return response.data.Page.media;
  } catch (error) {
    console.error("Failed to fetch from AniList:", error);
    return [];
  }
};
