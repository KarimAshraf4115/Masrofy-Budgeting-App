// models are the blueprints or data structures that represent the entities in your application. In this case, the User model represents the structure of a user in the system, including their properties and how they interact with the database.
class Category{
    constructor(id, name, iconRes, isDefault){
        this.id = id;
        this.name = name;
        this.iconRes = iconRes;
        this.isDefault = isDefault;
    }
    
    toString(){
        return `Category{id=${this.id}, name=${this.name}, iconRes=${this.iconRes}, isDefault=${this.isDefault}}`; // returning a string representation of the Category object, including its properties for easy debugging and logging
    }
}

export default Category; // exporting the Category class so that it can be imported and used in other parts of the application, such as repositories or controllers that manage categories