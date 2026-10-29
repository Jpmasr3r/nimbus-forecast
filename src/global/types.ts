export type CityType = {
	id: number;
	name: string;
	country: string;
};

export type ApiResponseType = {
	results?: CityType[];
};

export type CityProps = {
	id: number;
	name: string;
	country: string;
	favorite: boolean;
	onToggleFavorite: (city: CityType) => void;
};

export type CityResultsProps = {
	results: CityType[];
	favorites: CityType[];
	title: string;
	emptyMessage: string;
	onToggleFavorite: (city: CityType) => void;
};
