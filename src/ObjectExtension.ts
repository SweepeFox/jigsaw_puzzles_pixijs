
interface Object {
    getConstructorName():string;
}

Object.defineProperty(Object.prototype, "getConstructorName", 
{
    value: function() {
        return Object.getPrototypeOf(this).constructor.name;
    }
});