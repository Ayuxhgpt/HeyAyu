# Client-Side Generator Implementation

We will implement the main functionality using React Components.

## Components

### `FontCard.jsx`
- Pure presentational component.
- Props:
    - `fontName`: string
    - `transformedText`: string
    - `isFavorite`: boolean
    - `safety`: object (level, reasons),
    - `onCopy`: function
    - `onToggleFav`: function

### `Generator.jsx`
- Main container logic.
- **State**:
    - `text`: string
    - `platform`: string
    - `tab`: 'fonts' | 'glitch' | 'decorations' | 'kaomoji'
    - `favorites`: Set<string>
- **Logic**:
    - Instantiate `FontEngine` and `ValidationEngine`.
    - `generateList()`: Returns list of transformed strings based on current tab.
    - `handleCopy()`: Copies to clipboard and saves to history (localStorage for now).

### `App.jsx`
- Update to include `<Generator />`.
