export default interface Location {
  short_name: string;
  id: string;
  url: string;
  name: string;
  country?: Location;
  area_one?: Location;
  area_two?: Location;
  locality?: Location;
  map_image_url?: string;
  description?: string;
}