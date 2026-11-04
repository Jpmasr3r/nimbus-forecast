import type {
	CityApiResponseType,
	CityType,
	WeatherApiResponseType,
} from "./schemas";

export type { CityApiResponseType, CityType, WeatherApiResponseType };

export type CityProps = {
	id: number;
	name: string;
	country: string;
	latitude: number;
	longitude: number;
	admin1?: string;
	favorite: boolean;
	onToggleFavorite: (city: CityType) => void;
	onSelect: (city: CityType) => void;
};

export type CityModalProps = {
	id: number;
	name: string;
	country: string;
	latitude: number;
	longitude: number;
	admin1?: string;
	onClose: () => void;
};

export type CityResultsProps = {
	results: CityType[];
	favorites: CityType[];
	title: string;
	emptyMessage: string;
	onToggleFavorite: (city: CityType) => void;
	onSelect: (city: CityType) => void;
};
