/**
 * Single source of truth for the storefront category order.
 *
 * Used by the homepage/shop filter rails, the product breadcrumb/label index,
 * and the cart (to list items in a fixed category order). Keeping it in one
 * place stops the four page-local copies from drifting apart.
 */
import type { CategoryId } from '../types'

export const CATEGORY_ORDER: CategoryId[] = [
  'bouquet',
  'box',
  'plant',
  'wreath',
  'weddingcar',
]

/** Sort rank of a category (lower = earlier). Unknown/absent → last. */
export const categoryRank = (c: CategoryId | undefined): number => {
  const i = CATEGORY_ORDER.indexOf(c as CategoryId)
  return i === -1 ? CATEGORY_ORDER.length : i
}
