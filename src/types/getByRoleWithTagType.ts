export type GetByRoleWithTagType = {
  tag: 'button' | 'heading' | 'checkbox' | 'link' | 'textbox',
  tagLevel?: 1 | 2 | 3 | 4 | undefined,
  ariaLabel?: string
}