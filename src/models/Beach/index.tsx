import Location from "models/Location";

export default interface Beach {
  id: string;
  name: string;
  url: string;
  latitude?: number;
  longitude?: number;
  hero_img: string;
  description: string;
  difficulty?: string;
  location_city: string;
  rating: number;
  locality?: Location;
  num_reviews: number;
}
