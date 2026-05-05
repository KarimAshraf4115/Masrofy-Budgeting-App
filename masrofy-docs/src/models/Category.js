/**
 * @fileoverview Category model representing an expense classification type.
 * Categories are pre-seeded in the database and used to group expenses
 * for breakdown analysis on the dashboard.
 * @module models/Category
 * @author Karim Ashraf Ahmed, Eyad Hatem Fouad, Sherif Ahmed Metwally, Ahmed Sherif Ahmed
 */

/**
 * @class Category
 * @classdesc Represents an expense category (e.g., Food, Transport, Entertainment, Other).
 * Categories are pre-seeded during database initialization and are not created by the user.
 * Each expense is assigned one category via a foreign key relationship.
 */
class Category {
    /**
     * Creates a new Category instance.
     * @param {number} id - The unique identifier (1=Food, 2=Transport, 3=Entertainment, 4=Other).
     * @param {string} name - The display name of the category.
     * @param {string} iconRes - The icon resource identifier (emoji or icon name) for UI display.
     * @param {number} isDefault - Whether this is a system-seeded default category (1 = default).
     */
    constructor(id, name, iconRes, isDefault) {
        this.id = id;
        this.name = name;
        this.iconRes = iconRes;
        this.isDefault = isDefault;
    }

    /**
     * Returns a human-readable string representation of the Category object.
     * Useful for debugging and logging purposes.
     * @returns {string} A formatted string containing all category properties.
     * @example
     * category.toString();
     * // 'Category{id=1, name=Food, iconRes=🍔, isDefault=1}'
     */
    toString() {
        return `Category{id=${this.id}, name=${this.name}, iconRes=${this.iconRes}, isDefault=${this.isDefault}}`;
    }
}

export default Category;
