import { MD3LightTheme, MD3DarkTheme, MD3Theme } from 'react-native-paper';
import { colors } from '@/constants/colors';

const createLightTheme = (): MD3Theme => ({
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: colors.primary[600],
    primaryContainer: colors.primary[100],
    secondary: colors.secondary[600],
    secondaryContainer: colors.secondary[100],
    tertiary: colors.neutral[600],
    tertiaryContainer: colors.neutral[100],
    surface: colors.surface.light,
    surfaceVariant: colors.neutral[100],
    background: colors.background.light,
    error: colors.error[600],
    errorContainer: colors.error[100],
    onPrimary: colors.neutral[50],
    onPrimaryContainer: colors.primary[900],
    onSecondary: colors.neutral[50],
    onSecondaryContainer: colors.secondary[900],
    onTertiary: colors.neutral[50],
    onTertiaryContainer: colors.neutral[900],
    onSurface: colors.text.primary.light,
    onSurfaceVariant: colors.text.secondary.light,
    onBackground: colors.text.primary.light,
    onError: colors.neutral[50],
    onErrorContainer: colors.error[900],
    outline: colors.neutral[300],
    outlineVariant: colors.neutral[200],
    shadow: colors.neutral[900],
    scrim: colors.neutral[900],
    inverseSurface: colors.neutral[800],
    inverseOnSurface: colors.neutral[50],
    inversePrimary: colors.primary[300],
    elevation: {
      level0: 'transparent',
      level1: colors.neutral[50],
      level2: colors.neutral[100],
      level3: colors.neutral[200],
      level4: colors.neutral[300],
      level5: colors.neutral[400],
    },
  },
});

const createDarkTheme = (): MD3Theme => ({
  ...MD3DarkTheme,
  colors: {
    ...MD3DarkTheme.colors,
    primary: colors.primary[400],
    primaryContainer: colors.primary[900],
    secondary: colors.secondary[400],
    secondaryContainer: colors.secondary[900],
    tertiary: colors.neutral[400],
    tertiaryContainer: colors.neutral[800],
    surface: colors.surface.dark,
    surfaceVariant: colors.neutral[800],
    background: colors.background.dark,
    error: colors.error[400],
    errorContainer: colors.error[900],
    onPrimary: colors.neutral[900],
    onPrimaryContainer: colors.primary[100],
    onSecondary: colors.neutral[900],
    onSecondaryContainer: colors.secondary[100],
    onTertiary: colors.neutral[900],
    onTertiaryContainer: colors.neutral[100],
    onSurface: colors.text.primary.dark,
    onSurfaceVariant: colors.text.secondary.dark,
    onBackground: colors.text.primary.dark,
    onError: colors.neutral[900],
    onErrorContainer: colors.error[100],
    outline: colors.neutral[600],
    outlineVariant: colors.neutral[700],
    shadow: colors.neutral[900],
    scrim: colors.neutral[900],
    inverseSurface: colors.neutral[100],
    inverseOnSurface: colors.neutral[900],
    inversePrimary: colors.primary[600],
    elevation: {
      level0: 'transparent',
      level1: colors.neutral[900],
      level2: colors.neutral[800],
      level3: colors.neutral[700],
      level4: colors.neutral[600],
      level5: colors.neutral[500],
    },
  },
});

export const lightTheme = createLightTheme();
export const darkTheme = createDarkTheme();

export type AppTheme = MD3Theme;
export type ColorScheme = 'light' | 'dark';

export const getTheme = (colorScheme: ColorScheme): AppTheme => {
  return colorScheme === 'dark' ? darkTheme : lightTheme;
}; 