const fs = require('fs').promises;;
const Character = require('../model/Character');
const path = require('path');

const playersPath = path.join(__dirname, '../data/players.json');

function addCharacter(character) {
    fs.readFile(playersPath, 'utf8', (err, data) => {
        if (err) {
            console.error('파일을 읽는데 실패했습니다.', err);
            return;
        }

        let characters = data ? JSON.parse(data) : [];
        
        characters.push(character.toJSON());

        fs.writeFile(playersPath, JSON.stringify(characters, null, 2), (err) => {
            if (err) {
                console.error('파일을 쓰는데 실패했습니다.', err);
            } else {
                console.log('캐릭터를 생성했습니다!');
            }
        })
    })
}

async function loadMyCharactor(userId) {
    try {
        const data = await fs.readFile(playersPath, 'utf8');
        let characters = data ? JSON.parse(data) : [];
        console.log('Json', characters.find(char => char.id === userId));

        const character = Character.fromJSON(characters.find(char => char.id === userId));
        console.log('character', character);

        return character;  
    } catch (err) {
        console.error('파일을 읽는데 실패했습니다.', err);
        return;  
    } 
}

async function checkExistCharacter(userId) {
    try {
        const data = await fs.readFile(playersPath, 'utf8');
        let characters = data ? JSON.parse(data) : [];

        const alreadyExists = characters.some(char => char.id === userId);
        console.log(alreadyExists);

        return alreadyExists; 

    } catch (err) {
        console.error('파일을 읽는데 실패했습니다.', err);
        return false;  
    }
}

module.exports = {
  addCharacter,
  checkExistCharacter,
  loadMyCharactor,
};