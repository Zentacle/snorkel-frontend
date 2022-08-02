import Location from 'models/Location';

export default interface Shop {
    name: string;
    id: string;
    website?: string;
    fareharbor_url?: string;
    logo_img?: string;
    latitude?: string;
    longitude?: string;
    address1?: string;
    address2?: string;
    city?: string;
    state?: string
    zip?: string;
    owner_user_id?: string;
    stamp_uri?: string;
    phone?: string;
    hours?: string;
    country_name?: Location;
    full_address?: string;
    description?: string;
    url: string;
    country?: Location;
    area_one?: Location;
    area_two?: Location;
    locality?: Location;
  }