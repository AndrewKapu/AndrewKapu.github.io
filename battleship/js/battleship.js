render();

/**
 * Renders game's field. Rows - tr, Cells - td.
 */
function render() {
    const table = document.getElementById('table');
    for (let i = 0; i <= 6; i++) {
        let row = document.createElement('tr');
        table.appendChild(row);
        for (let j = 0; j <= 6; j++) {
            let cell = document.createElement('td');
            row.appendChild(cell);
            cell.setAttribute('id', `${i}${j}`)
        }
    }
}



const controller = {
    guesses: 0,

    /**
     * Handling shot coordinates and transfer it to model
     * @param {string} guess String in format 'A0', 'B4' 
     */
    processGuess: function (guess) {
        let location = this.parseGuess(guess);
        //If method doesn't return null that means we get real location
        if (location) {
            this.guesses++;
            let hit = model.fire(location);
            if (hit && model.shipsSunk === model.numShips) {
                view.displayMessage(`You sank all my battleships, 
                in ${this.guesses} ${this.guesses}`);
            }
        }
    },

    /**
     * Parses user's input of a shot coordinate
     * from format 'A0' to format '00', 'B4' to '14'.
     * @param {string} guess String in format 'A0', 'B4'
     * @returns {string} parsed coordinate of a shot like 'B4' to '14'
     */
    parseGuess: function (guess) {
        const alphabet = ["A", "B", "C", "D", "E", "F", "G"];

        if (guess === null || guess.length !== 2) {
            alert('Oops, please enter a letter and a number on the board.');
        } else {
            //Получает символ с указанным индексом из строки
            firstChar = guess.charAt(0);
            //Получает индекс по которому данный элемент может быть найден
            let row = alphabet.indexOf(firstChar);
            let column = guess.charAt(1);

            if (isNaN(row) || isNaN(column)) {
                alert("Oops, that isn't on the board.");
            } else if (row < 0 || row >= model.boardSize ||
                column < 0 || column >= model.boardSize) {
                alert("Oops, that's off the board!");
            } else {
                return row + column;
            }
        }
        return null;
    }
};


const model = {
    /**
     * @property {number} Amount of rows and columns on game board
     */
    boardSize: 7,
    /**
     * @property {number} Amount of ships in game
     */
    numShips: 3,
    shipLength: 3,
    shipsSunk: 0,

    ships: [{
            locations: [0, 0, 0],
            hits: ['', '', '']
        },
        {
            locations: [0, 0, 0],
            hits: ['', '', '']
        },
        {
            locations: [0, 0, 0],
            hits: ['', '', '']
        }
    ],

    /**
     * Method gets shot coordinate and defines if hit was on target or not.
     * Also displays it in user's interface.
     * @param {string} guess String type of '00' '14'
     * @returns {boolean} true if player hit target, false - if not
     */
    fire: function (guess) {
        for (let i = 0; i < this.numShips; i++) {
            let ship = this.ships[i];
            /**  indexOf возвращает индекс первого попавшегося элемента в массиве переданного
             в параметре и -1 если такого элемента нет */
            let index = ship.locations.indexOf(guess);
            if (index >= 0) {
                // hit on target!
                ship.hits[index] = 'hit';
                view.displayHit(guess);
                view.displayMessage('HIT!');
                if (this.isSunk(ship)) {
                    view.displayMessage('You sank my battleship!');
                    this.shipsSunk++;
                }
                return true;
            }
        }

        view.displayMiss(guess);
        view.displayMessage('You missed.');
        return false;
    },

    isSunk: function (ship) {
        for (let i = 0; i < this.shipLength; i++) {
            if (ship.hits[i] !== 'hit') {
                return false;
            }
        }
        return true;
    },


    /**
     * Generates locations-cordinates for every ship for game
     */
    generateShipLocations: function () {
        let locations;

        for (let i = 0; i < this.numShips; i++) {
            do {
                locations = this.generateShip();
            } while (this.collision(locations));
            this.ships[i].locations = locations;
        }
    },

    generateShip: function () {
        let direction = Math.floor(Math.random() * 2);
        let row, col;

        if (direction === 1) {
            //Generate position for horizontal ship
            //Random number from 0 to 7 excluding 7
            row = Math.floor(Math.random() * this.boardSize);
            //Random number from 0 to 4 to exclude battleship from going out of game board
            col = Math.floor(Math.random() * (this.boardSize - this.shipLength + 1));
        } else {
            //Generate position for vertical ship
            row = Math.floor(Math.random() * (this.boardSize - this.shipLength + 1));
            col = Math.floor(Math.random() * this.boardSize);
        }

        let newShipLocations = [];

        for (let i = 0; i < this.shipLength; i++) {
            if (direction === 1) {
                //Add array for horizontal ship
                newShipLocations.push(row + "" + (col + i));
            } else {
                //Add array for vertical ship
                newShipLocations.push((row + i) + "" + col);
            }
        }

        return newShipLocations;
    },

    /**
     * Gets new ship locations data and checks if ship collide with existing ships on game
     * board
     * @param {[number]} locations Each array element contains coordinate
     * of a new ship which we want to place on game board
     * @returns {boolean} true if ships collide, false if not
     */
    collision: function (locations) {
        for (let i = 0; i < this.numShips; i++) {
            let ship = this.ships[i];
            for (let j = 0; j < locations.length; j++) {
                if (ship.locations.indexOf(locations[j]) >= 0) {
                    return true;
                }
            }
        }
        return false;
    }
};

const view = {
    displayMessage: function (msg) {
        let messageArea = document.getElementById('messageArea');
        messageArea.innerHTML = msg;
    },

    displayHit: function (location) {
        let cell = document.getElementById(location);
        cell.setAttribute('class', 'hit');
    },

    displayMiss: function (location) {
        let cell = document.getElementById(location);
        cell.setAttribute('class', 'miss');
    }
};


function init() {
    let fireButton = document.getElementById('fireButton');
    fireButton.onclick = handleFireButton;
    let guessInput = document.getElementById('guessInput');
    guessInput.onkeypress = handleKeyPress;

    model.generateShipLocations();
}

/**
 * Handles user's press of a fire button
 * @param {event} e User's press of a button
 */
function handleKeyPress(e) {
    let fireButton = document.getElementById('fireButton');

    if (e.keyCode === 13) {
        fireButton.click();
        return false;
    }
}

/**
 * Transfers data from UI html input to controller 
 */
function handleFireButton() {
    let guessInput = document.getElementById('guessInput');
    let guess = guessInput.value;

    controller.processGuess(guess);
    guessInput.value = '';
}

window.onload = init;