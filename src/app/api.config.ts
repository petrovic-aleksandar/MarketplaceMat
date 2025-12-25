import configData from './app.properties.json';

type ApiConfigSet = {
	baseApiUrl: string;
	imagePath: string;
};

type PropertiesFile = {
	activeConfig: string;
	configs: {
		[key: string]: ApiConfigSet;
	};
};

const typedConfig = configData as PropertiesFile;
const activeConfigName = typedConfig.activeConfig;
export const API_CONFIG: ApiConfigSet = typedConfig.configs[activeConfigName];
