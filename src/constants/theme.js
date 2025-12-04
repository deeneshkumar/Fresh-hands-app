import { COLORS } from './colors';

export const THEME = {
    colors: COLORS,
    spacing: {
        xs: 4,
        s: 8,
        m: 16,
        l: 24,
        xl: 32,
    },
    borderRadius: {
        s: 4,
        m: 8,
        l: 16,
        xl: 24,
    },
    typography: {
        h1: { fontSize: 24, fontWeight: 'bold', color: COLORS.text },
        h2: { fontSize: 20, fontWeight: 'bold', color: COLORS.text },
        h3: { fontSize: 18, fontWeight: '600', color: COLORS.text },
        body: { fontSize: 16, color: COLORS.text },
        caption: { fontSize: 14, color: COLORS.textLight },
    },
};
