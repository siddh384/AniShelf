import ky from "ky";

const ANILIST_URL = "https://graphql.anilist.co";

const anilistApi = ky.create({
  prefixUrl: ANILIST_URL,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// We added "sort" so we can switch between Trending, Popular, and Top Rated!
const getMediaQuery = (type: "ANIME" | "MANGA", sort: string) => `
  query {
    Page(page: 1, perPage: 15) {
      media(sort: ${sort}, type: ${type}, isAdult: false) {
        id
        title {
          romaji
          english
        }
        coverImage {
          extraLarge
        }
        bannerImage
      }
    }
  }
`;

// Dynamic fetcher for our dedicated Anime/Manga pages
export const fetchMedia = async (
  type: "ANIME" | "MANGA",
  sort: "TRENDING_DESC" | "POPULARITY_DESC" | "SCORE_DESC" = "TRENDING_DESC",
) => {
  try {
    const response: any = await anilistApi
      .post("", {
        json: { query: getMediaQuery(type, sort) },
      })
      .json();
    return response.data.Page.media;
  } catch (error) {
    console.error(`Failed to fetch ${type}:`, error);
    return [];
  }
};

// Legacy fetchers for the Home page
export const fetchTrendingAnime = () => fetchMedia("ANIME", "TRENDING_DESC");
export const fetchTrendingManga = () => fetchMedia("MANGA", "TRENDING_DESC");

// Add this to the BOTTOM of frontend/src/lib/anilist.ts

const GET_MEDIA_DETAILS_QUERY = `
  query ($id: Int, $type: MediaType) {
    Media(id: $id, type: $type) {
      id
      title {
        romaji
        english
      }
      coverImage {
        extraLarge
      }
      bannerImage
      description(asHtml: false)
      averageScore
      rankings {
        rank
        type
        context
        year
      }
      characters(sort: ROLE, perPage: 12) {
        edges {
          role
          node {
            id
            name { full }
            image { large }
          }
          voiceActors(language: JAPANESE, sort: ROLE) {
            id
            name { full }
            image { large }
          }
        }
      }
      reviews(perPage: 5, sort: RATING_DESC) {
        nodes {
          id
          summary
          rating
          user {
            name
            avatar { large }
          }
        }
      }
      recommendations(perPage: 15, sort: RATING_DESC) {
        nodes {
          mediaRecommendation {
            id
            title { romaji english }
            coverImage { extraLarge }
          }
        }
      }
    }
  }
`;

export const fetchMediaDetails = async (
  id: number,
  type: "ANIME" | "MANGA",
) => {
  try {
    const response: any = await anilistApi
      .post("", {
        json: {
          query: GET_MEDIA_DETAILS_QUERY,
          variables: { id, type },
        },
      })
      .json();
    return response.data.Media;
  } catch (error) {
    console.error(`Failed to fetch details for ID ${id}:`, error);
    return null;
  }
};
