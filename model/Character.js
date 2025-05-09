class Character {
    constructor(id, name, role, level) {
        this.id = id;
        this.name = name;
        this.role = role;
        this.level = level;
    }

    toJSON() {
        return {
            id: this.id,
            name: this.name,
            role: this.role,
            level: this.level,
        };
    }

     static fromJSON(json) {
        return new Character(json.id, json.name, json.role, json.level);
    }
}

module.exports = Character; 