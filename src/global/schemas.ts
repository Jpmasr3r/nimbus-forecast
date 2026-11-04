import * as z from "zod";

export const CityApiResultSchema = z.object({
	id: z.number().int(),
	name: z.string(),
	latitude: z.number(),
	longitude: z.number(),
	elevation: z.number(),
	feature_code: z.string(),
	country_code: z.string(),
	admin1_id: z.number().int().optional(),
	admin2_id: z.number().int().optional(),
	admin3_id: z.number().int().optional(),
	admin4_id: z.number().int().optional(),
	timezone: z.string(),
	population: z.number().int().nonnegative().optional(),
	postcodes: z.array(z.string()).max(100).optional(),
	country_id: z.number().int().optional(),
	country: z.string(),
	admin1: z.string().optional(),
	admin2: z.string().optional(),
	admin3: z.string().optional(),
	admin4: z.string().optional(),
});

export const CityApiResponseSchema = z.object({
	results: z.array(CityApiResultSchema).max(10).optional(),
	generationtime_ms: z.number().nonnegative(),
});

export const CitySchema = CityApiResultSchema.pick({
	id: true,
	name: true,
	country: true,
	latitude: true,
	longitude: true,
	admin1: true,
});

export const StoredFavoritesSchema = z.array(z.unknown()).max(100);

export const WeatherApiResponseSchema = z.object({
	latitude: z.number(),
	longitude: z.number(),
	generationtime_ms: z.number().nonnegative(),
	utc_offset_seconds: z.number().int(),
	timezone: z.string(),
	timezone_abbreviation: z.string(),
	elevation: z.number(),
	current_units: z.object({
		time: z.string(),
		interval: z.string(),
		temperature_2m: z.string(),
		relative_humidity_2m: z.string(),
		apparent_temperature: z.string(),
		weather_code: z.string(),
		wind_speed_10m: z.string(),
	}),
	current: z.object({
		time: z.string(),
		interval: z.number().nonnegative(),
		temperature_2m: z.number(),
		relative_humidity_2m: z.number(),
		apparent_temperature: z.number(),
		weather_code: z.number().int(),
		wind_speed_10m: z.number().nonnegative(),
	}),
	daily_units: z.object({
		time: z.string(),
		weather_code: z.string(),
		temperature_2m_max: z.string(),
		temperature_2m_min: z.string(),
		precipitation_probability_max: z.string(),
	}),
	daily: z.object({
		time: z.array(z.string()).max(5),
		weather_code: z.array(z.number().int()).max(5),
		temperature_2m_max: z.array(z.number()).max(5),
		temperature_2m_min: z.array(z.number()).max(5),
		precipitation_probability_max: z.array(z.number()).max(5),
	}),
});

export type CityApiResponseType = z.infer<typeof CityApiResponseSchema>;
export type CityType = z.infer<typeof CitySchema>;
export type WeatherApiResponseType = z.infer<typeof WeatherApiResponseSchema>;
