export type LocatorWithTagAndSelectorType = {
  selector?: string,
  tag?: 'button' | 'div' | 'span' | 'mat-icon' | 'label'
  textFilters?: string[],
  tagIndex?: number
}