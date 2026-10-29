export type CityType = {
	id: number;
	name: string;
	country: string;
	latitude: number;
	longitude: number;
};

export type ApiResponseType = {
	results?: CityType[];
};

export type CityProps = {
	id: number;
	name: string;
	country: string;
	latitude: number;
	longitude: number;
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
