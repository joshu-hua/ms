import { extendTheme, type ThemeConfig } from "@chakra-ui/react";

// 1. Define the color mode configuration
const config: ThemeConfig = {
	initialColorMode: "light", // Start with light mode
	useSystemColorMode: false, // Don't automatically use system preference (you can change this to true later)
};

// 2. Define custom colors for your theme
const colors = {
	// You can add custom colors here later
	// For now, we'll use Chakra's built-in colors
};

// 3. Define semantic color tokens that change based on color mode
const semanticTokens = {
	colors: {
		// Background colors
		"app-bg": {
			default: "white", // Light mode
			_dark: "gray.900", // Dark mode
		},
		"surface-bg": {
			default: "gray.50",
			_dark: "gray.700",
		},
		"card-bg": {
			default: "white",
			_dark: "gray.700",
		},

		// Text colors
		"text-primary": {
			default: "gray.900",
			_dark: "white",
		},
		"text-secondary": {
			default: "gray.600",
			_dark: "gray.300",
		},
		"text-link": {
			default: "blue.500",
			_dark: "blue.300",
		},

		// Border colors
		"border-color": {
			default: "gray.200",
			_dark: "gray.600",
		},

		// Game-specific colors
		"cell-bg": {
			default: "gray.200",
			_dark: "gray.600",
		},
		"cell-revealed": {
			default: "gray.100",
			_dark: "gray.700",
		},
		"mine-color": {
			default: "red.500",
			_dark: "red.400",
		},

		// UI Panel colors
		"panel-bg": {
			default: "gray.100",
			_dark: "gray.700",
		},
		"leaderboard-bg": {
			default: "gray.100",
			_dark: "gray.800",
		},

		// Input field colors
		"input-bg": {
			default: "white",
			_dark: "gray.600",
		},
		"input-border": {
			default: "gray.200",
			_dark: "gray.500",
		},
		"input-focus-border": {
			default: "blue.500",
			_dark: "blue.300",
		},
	},
};

// 5. Component style overrides
const components = {
	Input: {
		variants: {
			outline: {
				field: {
					bg: "input-bg",
					borderColor: "input-border",
					color: "text-primary",
					_hover: {
						borderColor: "input-focus-border",
					},
					_focus: {
						borderColor: "input-focus-border",
						boxShadow:
							"0 0 0 1px var(--chakra-colors-input-focus-border)",
					},
					_placeholder: {
						color: "text-secondary",
					},
				},
			},
		},
		defaultProps: {
			variant: "outline",
		},
	},
};

// 4. Create and export the theme
const theme = extendTheme({
	config,
	colors,
	semanticTokens,
	components,
});

export default theme;
