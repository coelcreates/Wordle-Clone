/* 
* TILEBOARD
*/


class Tile {
  constructor(rowElement) {
    this._tileElement = document.createElement('div');
    this._tileElement.classList.add('tile');

    rowElement.appendChild(this._tileElement);
  }

  get text() {
    return this._tileElement.innerText;
  }
  set text(value) {
    this._tileElement.innerText = value;
  }
  get color() {
    return this._tileElement.style.backgroundColor;
  }
  set color(value) {
    this._tileElement.style.backgroundColor = value;
  }

  get isEmpty() {
    // return this._tileElement.innerText.length > 0;
    if (this._tileElement.innerText == "") {
      return true;
    }
    else {
      return false;
    }
  }
}
/**
 * Represents a single tile on the Wordle game board.
 *
 * @param {HTMLElement} rowElement - The DOM element representing the row this tile belongs to.
 *
 * **Constructor:**
 * - Creates a new `div` element to represent the tile visually.
 * - Appends the tile's `div` element to the provided `rowElement`.
 *
 *
 * **Properties:**
 * - `text`: Gets or sets the text displayed within the tile.
 * - `color`: Gets or sets the background color of the tile.
 * - `isEmpty`: Indicates whether the tile is empty (true) or has a character (false).
 */


class TileboardRow {
  constructor(gridElement, numberOfTilesPerRow) {
    let rowElement = document.createElement('div');
    rowElement.classList.add('row');
    gridElement.appendChild(rowElement);

    this.tiles = [];

    for (var i = 0; i < numberOfTilesPerRow; i++) {
      const tile = new Tile(rowElement);
      tile.character = "";
      this.tiles.push(tile);
    }
  }

  get firstEmptyTile() {
    for (let i = 0; i < this.tiles.length; i++) {
      if (this.tiles[i].isEmpty) {
        return this.tiles[i];
      }
    }
  }
}

/**
 * Represents a single row of tiles on the Wordle game board.
 *
 * Encapsulates the creation and management of tiles within a row.
 *
 * @param {HTMLElement} gridElement - The DOM element containing the tiles for this row.
 * @param {number} numberOfTilesPerRow - The number of tiles to create in this row.
 *
 * **Constructor:**
 * - Creates the specified number of `Tile` objects within the provided `gridElement`.
 *  * - **Constructor Actions:**
 *      - Creates a new DOM element to represent the row visually (e.g., a `div`).
 *      - Uses a `for` loop to create the specified number of `Tile` objects and append them to the row's DOM element.
 *      - Appends the row's DOM element to the provided `gridElement` to display it on the board.
 *
 * **Methods:**
 * - `firstEmptyTile`: Returns the first empty tile in the row for text input.
 * - Return Value: The `Tile` object representing the first empty tile, or null if none are empty.
 * - Usage: Used to determine where to place the next character entered by the player.
 */

class Tileboard {
  constructor(tileboardElement, numberofRows, numberOfTilesPerRow) {
    tileboardElement.classList.add('tileboard');
    this.tileBoardRows = [];

    for (let i = 0; i < numberofRows; i++) {
      const row = new TileboardRow(tileboardElement, numberOfTilesPerRow);
      this.tileBoardRows.push(row);
    }
  }

  setTileText(row, col, text) {
    this.tileBoardRows[row].tiles[col].text = text;
  }
  setTileColor(row, col, tileColor) {
    this.tileBoardRows[row].tiles[col].color = tileColor;
  }
}

/**
 * Represents the entire Wordle game board with multiple rows of tiles.
 *
 * **Purpose:**
 * - Manages the creation and display of all tiles on the Wordle game board.
 *
 * **Constructor:**
 * - `tileboardElement`: The DOM element representing the container for the entire board.
 * - `numberofRows`: The number of rows (attempts) available on the board.
 * - `numberOfTilesPerRow`: The number of tiles in each row.
 * - **Constructor Actions:**
 *      - Initializes an array to store the `TileboardRow` objects for each row.
 *      - Uses a `for` loop to create the specified number of `TileboardRow` objects and add them to the array.
 *      - Appends each row's DOM element to the `tileboardElement` to display them on the board.
 *
 * **Methods:**
 * - `setTileText(row, col, text)`: Sets the text displayed within the specified tile.
 *      - Parameters:
 *          - `row`: The index of the row (starting from 0) containing the target tile.
          - `col`: The index of the column (starting from 0) containing the target tile.
          - `text`: The string to display within the tile.
 * - `setTileColor(row, col, tileColor)`: Sets the background color of the specified tile.
 *      - Parameters:
 *          - `row`: The index of the row (starting from 0) containing the target tile.
          - `col`: The index of the column (starting from 0) containing the target tile.
          - `tileColor`: The CSS color string to apply to the tile.
 */

/*
* KEYBOARD
*/
class Key {
  constructor(keyboardRowElement, character, keyPressed) {
    this._keyElement = document.createElement('div');
    this._keyElement.classList.add('key');
    this._keyElement.innerText = this.translateIntoVisualCharacter(character);

    keyboardRowElement.appendChild(this._keyElement);
    this._keyElement.onclick = function(e) {
      keyPressed(character);
    }
  }

  get color() {
    return this._keyElement.style.backgroundColor;
  }
  set color(value) {
    this._keyElement.style.backgroundColor = value;
  }

  translateIntoVisualCharacter(character) {
    if (character == Chars.backspace) {
      return "←";
    }
    else if (character == Chars.enter) {
      return "↵";
    }

    return character;
  }
}

/**
 * Represents a single key on the virtual keyboard of the Wordle game.
 *
 * **Purpose:**
 * - Displays a character and handles click events for user input.
 *
 * **Constructor:**
 * - `keyboardRowElement`: The DOM element representing the row this key belongs to.
 * - `character`: The character displayed on the key.
 * - `keyPressed`: A callback function to be called when the key is clicked.
 *
 * - **Constructor Actions:**
 *      - Creates a new DOM element (e.g., a `div`) to represent the key visually.
 *      - Sets the key's text content to the provided `character`.
 *      - Adds the key's DOM element to the `keyboardRowElement`.
 *      - Attaches a click event listener to the key that calls the `keyPressed` callback with the key's character.
 *
 * **Properties:**
 * - `color`: Gets or sets the background color of the key.
 *
 * **Methods:**
 * - `translateIntoVisualCharacter(character)`:
 *      - **Purpose:** Translates the given character into a symbol for display on the key.
 *      - **Parameters:**
 *          - `character`: The character to be translated.
 *      - **Return Value:** The translated visual representation or symbol of the character.
 */
 

class KeyboardRow {
  constructor(keyboardElement, characters, keyPressed) {
    let keyboardRowElement = document.createElement('div');
    keyboardRowElement.classList.add('keyboardRow');
    keyboardElement.appendChild(keyboardRowElement);

    this._keys = {};

    for (let character of characters) {
      this._keys[character] = new Key(keyboardRowElement, character, keyPressed);
    }
  }

  setKeyColor(keyLetter, color) {
    const key = this._keys[keyLetter];

    if (!key) {
      return;
    }

    this._keys[keyLetter].color = color;
  }
}
/**
 * Represents a single row of keys on the virtual keyboard of the Wordle game.
 *
 * **Purpose:**
 * - Manages the creation and display of all keys within a single row.
 * - Handles key click events and sends character information to the game.
 *
 * **Constructor:**
 * - `keyboardElement`: The DOM element representing the container for the entire keyboard (where this row will be appended).
 * - `characters`: An array of characters to be displayed as keys in this row.
 * - `keyPressed`: A callback function to be called with the pressed character whenever a key is clicked.
 *
 * - **Constructor Actions:**
 *      - Creates a new DOM element to represent the row visually (e.g., a `div`).
 *      - Uses a `for` loop to iterate through the provided `characters` array:
 *          - For each character in the array:
 *              - Creates a `Key` object with the character and the `keyPressed` callback.
 *              - Appends the `Key` object's DOM element to the row's DOM element.
 *      - Appends the row's DOM element to the `keyboardElement`, visually placing it within the keyboard.
 *
 * **Methods:**
 * - None.

 */


class Keyboard {
  constructor(keyboardElement, keyPressed) {
    const rowsOfLetters = [
      "QWERTYUIOP",
      "ASDFGHJKL",
      Chars.enter + "ZXCVBNM" + Chars.backspace
    ];

    this._keyboardRows = [];

    for (let i = 0; i < rowsOfLetters.length; i++) {
      let characters = rowsOfLetters[i].split("");
      this._keyboardRows[i] = new KeyboardRow(keyboardElement, characters, keyPressed);
    }
  }

  setKeyColor(keyLetter, color) {
    for (let keyboardRow of this._keyboardRows) {
      keyboardRow.setKeyColor(keyLetter, color);
    }
  }
}

/**
 * Represents the entire virtual keyboard of the Wordle game.
 *
 * **Purpose:**
 * - Manages the creation and display of all keys on the keyboard.
 * - Handles user input through key clicks and sends character information to the game.
 *
 * **Constructor:**
 * - `keyboardElement`: The DOM element representing the container for the entire keyboard.
 * - `keyPressed`: A callback function to be called with the pressed character whenever a key is clicked.
 *
 * - **Constructor Actions:**
 *      - Defines an array of character strings representing the keyboard rows.
 *      - Initializes an empty array to store `KeyboardRow` objects.
 *      - Iterates through the rows of letters:
 *          - Splits each row string into individual characters.
 *          - Creates a new `KeyboardRow` object for the characters and appends it to the `_keyboardRows` array.
 *
 * **Methods:**
 * - `setKeyColor(keyLetter, color)`: Sets the background color of all keys with the specified letter to the given color.

 */

class Char {
  #rawChar = "";

  constructor(rawChar) {
    this.#rawChar = rawChar;
  }

  get rawChar() {
    return this.#rawChar;
  }

  get isEnter() {
    return this.rawChar == Chars.enter;
  }

  get isBackspace() {
    return this.rawChar == Chars.backspace;
  }
}

/**
 * Represents a single character in the Wordle game, encapsulating its raw value and providing methods for comparison with special characters.
 *
 * **Constructor:**
 * - `rawChar`: The raw character value (e.g., "a", "Z", or a special character).
 *
 * **Properties:**
 * - `rawChar`: A getter that returns the raw character value.
 *
 * **Methods:**
 * - `isEnter()`: Returns true if the character is the Enter key (Chars.enter), false otherwise.
 * - `isBackspace()`: Returns true if the character is the Backspace key (Chars.backspace), false otherwise.
 */


const Chars = {
  enter: '\n',
  backspace: '\r',
  empty: ''
}
/**
 * A collection of special character constants used to define/replace the action taken when pressed
 */

/*
* CORE MODEL
*/
class Attempt {
  constructor(nr, word) {
    this.nr = nr;
    this.word = word ?? "";
    this.evalLabels = [];
  }

  get isFull() {
    return this.word.length === 5;
  }
  get isEmpty() {
    return this.word.length === 0;
  }

  enterCharacter(char) {
    if (char.isBackspace) {
      if (this.isEmpty) {
        throw new Error("Row is empty");
      }

      this.deleteLastChar();
    }
    else if (char.isEnter) {
      if (this.isFull) {
        // handled on a higher abstractional level (GOF class)
        throw new Error("This shouldn't happen.");
      }
      else {
        throw new Error("Not enough letters");
      }
    }
    else {
      // TODO: check if attempt is full
      this.appendNewChar(char);
    }
  }
  appendNewChar(char) {
    this.word = this.word + char.rawChar;
  }
  deleteLastChar() {
    const arrayOfChars = this.word.split("");
    arrayOfChars.pop();
    this.word = arrayOfChars.join("");
  }
  addEvalLabels(labels) {
    this.evalLabels = labels;
  }
}

/**
 * Represents a single attempt (guess) made by the player in the Wordle game.
 *
 * **Constructor:**
 * - `nr`: The numerical order of this attempt (e.g., 1 for the first attempt, 2 for the second).
 * - `word`: The initial word for this attempt (optional). Defaults to an empty string.
 *
 * **Properties:**
 * - `nr`: The attempt number.
 * - `word`: The current word entered for this attempt.
 * - `evalLabels`: An array of evaluation labels (indicating letter correctness and position).
 * - `isFull`: A getter that returns true if the word has reached its maximum length (5 letters), false otherwise.
 * - `isEmpty`: A getter that returns true if the word is empty, false otherwise.
 *
 * **Methods:**
 * - `enterCharacter(char)`: Handles character input, either appending, deleting, or throwing errors based on the character type and word state.
 *     - Appends new characters to the word.
 *     - Deletes the last character if a backspace is entered.
 *     - Throws errors for invalid actions (e.g., backspace on an empty word, Enter on incomplete word).
 * - `appendNewChar(char)`: Appends a given character to the word.
 * - `deleteLastChar()`: Deletes the last character from the word.
 * - `addEvalLabels(labels)`: Sets the evaluation labels for this attempt.
 */
class Dictionary {
  #entries = {};

  constructor() { }

  static loadFromData(dictData) {
    const entries = dictData.split("\n");
    const dict = new Dictionary();

    for (const entry of entries) {
      dict.add(entry);
    }

    return dict;
  }

  add(entry) {
    entry = entry.trim().toLowerCase();

    // TODO: parameterize
    if (entry.length != 5) {
      throw new Error("Invalid entry: " + entry);
    }

    Object.defineProperty(this.#entries, entry, { writable: false });
  }
  contains(entry) {
    entry = entry.toLowerCase();
    return this.#entries.hasOwnProperty(entry);
  }
  pickRandomEntry() {
    const entries = Object.getOwnPropertyNames(this.#entries);
    const rndInt = Math.floor(Math.random() * entries.length);
    return entries[rndInt];
  }
}
/**
 * Represents a collection of words used for word validation and selection in the Wordle game.
 *
 * **Constructor:**
 * - Creates an empty dictionary with no entries.
 *
 * **Static Methods:**
 * - `loadFromData(dictData)`: Creates a new Dictionary object and populates it with entries from a provided string of words, separated by newlines.
 *
 * **Methods:**
 * - `add(entry)`: Adds a new word to the dictionary, enforcing a 5-letter length and making the entry non-writable.
 * - `contains(entry)`: Checks if a given word exists in the dictionary, case-insensitively.
 * - `pickRandomEntry()`: Returns a random word from the dictionary.
 */

class GameState {
  #gameRules;

  constructor(gameRules, activeAttempt, message) {
    this.#gameRules = gameRules;
    this.activeAttempt = activeAttempt;
    this.message = message;
  }
}
/** Represents and maintains the state of the game.
 *  **Constructor:** 
 * - gameRules validate that the turn and game are not over 
 * - activeAttempt validates that the game is begin played in the correct chronology
 * - messages will display when the player or game encounters errors.
 * */

class GameRules {
  constructor() {
    this.maxAttempts = 6;
    this.wordLength = 5;
  }
}

/** Defines the contraints of the game
 *  **Constructor:** 
 *  - sets max attempts and maximum word lenth 
 */
class WordleGame {
  #activeAttempt;
  #dictionary;
  #targetWord;
  #gameRules;
  #gameIsOver;

  constructor(dictionary, gameRules) {
    this.#activeAttempt = new Attempt(0, "");
    this.#dictionary = dictionary;
    // TODO: normalize
    this.#targetWord = dictionary.pickRandomEntry();
    this.#gameRules = gameRules;
    this.#gameIsOver = false;
  }

  enterCharacter(char) {
    // TODO: refactor and delegate to attempt
    if (this.#gameIsOver) {
      return new GameState(this.#gameRules, null, "Game Over!");
    }
    else if (this.#activeAttempt.isFull) {
      // check type of character
      if (char.isEnter) {
        return this.validateActiveAttempt();
      }
      else if (char.isBackspace) {
        this.#activeAttempt.enterCharacter(char);
        return new GameState(this.#gameRules, this.#activeAttempt);
      }
      else {
        // active attempt is full
        return new GameState(this.#gameRules, this.#activeAttempt, "Row is full.");
      }
    }
    else {
      try {
        this.#activeAttempt.enterCharacter(char);
        return new GameState(this.#gameRules, this.#activeAttempt);
      }
      catch (error) {
        return new GameState(this.#gameRules, this.#activeAttempt, error.message);
      }
    }
  }

  validateActiveAttempt() {
    // guard clauses
    if (!this.#dictionary.contains(this.#activeAttempt.word)) {
      return new GameState(this.#gameRules, this.#activeAttempt, "Unknown word: " + this.#activeAttempt.word);
    }

    let evaluator = new Evaluator(this.#activeAttempt.word, this.#targetWord);
    let evaluation = evaluator.evaluate();

    this.#activeAttempt.addEvalLabels(evaluation);
    const validatedAttempt = this.#activeAttempt;

    // game over?
    const maxAttemptsReached = validatedAttempt.nr == this.#gameRules.maxAttempts - 1;
    const targetWordGuessed = (this.#targetWord.toLowerCase() == validatedAttempt.word.toLowerCase());

    this.#gameIsOver = maxAttemptsReached || targetWordGuessed;
    let message = null;

    if (this.#gameIsOver) {
      this.#activeAttempt = null;
      message = "Game Over";

      if (targetWordGuessed) {
        message += ": You won!";
      }
      else {
        message += ": You lost! Target word: " + this.#targetWord;
      }
    }
    else {
      this.#activeAttempt = new Attempt(validatedAttempt.nr + 1, "");
    }

    return new GameState(this.#gameRules, validatedAttempt, message);
  }
}
/**
 * Represents the core game logic and state for a Wordle game, managing attempts, word validation, and game progression.
 *
 * **Constructor:**
 * - `dictionary`: A Dictionary object containing valid words for the game.
 * - `gameRules`: An object containing game rules (e.g., maximum attempts).
 *
 * **Properties:**
 * - `#activeAttempt`: The current Attempt object representing the player's in-progress guess.
 * - `#dictionary`: The Dictionary being used for word validation.
 * - `#targetWord`: The randomly selected target word that the player is trying to guess.
 * - `#gameRules`: The game rules object.
 * - `#gameIsOver`: A boolean flag indicating whether the game has ended.
 *
 * **Methods:**
 * - `enterCharacter(char)`: Handles character input, either adding it to the active attempt, validating the attempt if Enter is pressed, or handling errors.
 * - `validateActiveAttempt()`: Validates the current attempt against the target word, setting evaluation labels, checking for game over conditions, and creating a new GameState object with the updated state.
 */


const EvalLabels = {
  mismatch: 0,
  directMatch: 1,
  indirectMatch: 2
}
class Evaluator {
  constructor(attemptWord, targetWord) {
    this.attemptWord = attemptWord.toLowerCase();
    this.targetWord = targetWord.toLowerCase();
  }

  evaluate() {
    const evalLabels = [];

    console.log("evaluating: " + this.attemptWord + " == " + this.targetWord);

    for (let i = 0; i < this.attemptWord.length; i++) {
      if (this.attemptWord[i] === this.targetWord[i]) {
        evalLabels.push(EvalLabels.directMatch)
      }
      else if (this.targetWord.indexOf(this.attemptWord[i]) >= 0) {
        evalLabels.push(EvalLabels.indirectMatch)
      } else {
        evalLabels.push(EvalLabels.mismatch)
      }
    }

    return evalLabels;
  }
}
/**
 * Evaluates a Wordle attempt against a target word, assigning evaluation labels to each letter.
 *
 * **Constructor:**
 * - `attemptWord`: The word to be evaluated.
 * - `targetWord`: The correct target word.
 *
 * **Methods:**
 * - `evaluate()`: Compares the attempt word to the target word letter-by-letter and returns an array of evaluation labels (EvalLabels.mismatch, EvalLabels.directMatch, or EvalLabels.indirectMatch) for each letter.
 */

/*
* TRANSLATORS
*/
const EvalLabelColors = [
  "gray",
  "green",
  "orange"
];
class GameStateVisualizer {
  #gameRules;
  #tileboard;
  #keyboard;

  constructor(gameRules, tileboard, keyboard) {
    this.#gameRules = gameRules;
    this.#tileboard = tileboard;
    this.#keyboard = keyboard;
  }

  visualize(gameState) {
    console.log(gameState);
    this.visualizeAttempt(gameState.activeAttempt);
    this.visualizeMessage(gameState.message);
  }
  visualizeAttempt(attempt) {
    console.log('visualize attempt', attempt);

    for (let i = 0; i < this.#gameRules.wordLength; i++) {
      this.#tileboard.setTileText(attempt.nr, i, attempt.word[i] ?? Chars.empty);

      const labelForLetterAtI = attempt.evalLabels[i];
      const evalLabelColor = EvalLabelColors[labelForLetterAtI];

      this.#tileboard.setTileColor(attempt.nr, i, evalLabelColor);
      this.#keyboard.setKeyColor(attempt.word[i] ?? Chars.empty, evalLabelColor);
    }
  }
  visualizeMessage(message) {
    if (!message) {
      return;
    }

    this.showAlert(message);
  }

  showAlert(message) {
    setTimeout(() => {
      alert(message);
    }, 0);
  }
}

/**
 * Translates a GameState object into visual updates on the tileboard and keyboard, providing visual feedback to the player.
 *
 * **Constructor:**
 * - `gameRules`: An object containing game rules (e.g., word length).
 * - `tileboard`: An object representing the tileboard UI component, responsible for displaying attempts and letter feedback.
 * - `keyboard`: An object representing the keyboard UI component, responsible for displaying letter availability and feedback.
 *
 * **Methods:**
 * - `visualize(gameState)`: Updates the visual representation based on the provided GameState object, including attempt tiles, messages, and keyboard colors.
 * - `visualizeAttempt(attempt)`: Updates the tileboard and keyboard to reflect the letters and evaluation labels of a single Attempt object.
 * - `visualizeMessage(message)`: Displays an alert with the provided message if it exists.
 * - `showAlert(message)`: Shows an alert message using a timeout to ensure it appears after other visual updates.
 */

/*
* BOOTSTRAPPING THE APP
*/
var rules = new GameRules();

/** Initializes game rules */

// bootstrapping the UI
const tileboardElement = document.getElementById("tileboard");
const tileboard = new Tileboard(tileboardElement, rules.maxAttempts, rules.wordLength);
const keyboardElement = document.getElementById("keyboard");
const keyboard = new Keyboard(keyboardElement, onKeyboardkeyPressed);

/**
 * Sets up the tileboard and keyboard UI element used to display attempts, player input, and letter feedback.
 *
 * @param {HTMLElement} tileboardElement The DOM element representing the tileboard.
 * @param {number} maxAttempts The maximum number of attempts allowed in the game.
 * @param {number} wordLength The length of the target words in the game.
 * @param {HTMLElement} keyboardElement The DOM element representing the keyboard.
 * @param {function(string)} onKeyPressedCallback A callback function called when a key is pressed, receiving the pressed character as an argument.
 */

// bootstrapping the core model
const dictDataResponse = await fetch("./words5.txt");
const dictData = await dictDataResponse.text();
const dictionary = Dictionary.loadFromData(dictData);
const game = new WordleGame(dictionary, rules);

/**
 * Loads the dictionary of valid words for the game from a text file.
 *
 * @param {string} filePath The path to the text file containing the word list.
 * @returns {Dictionary} A Dictionary object containing all valid words for the game.
 */

// hooking up UI and core model
var visualizer = new GameStateVisualizer(rules, tileboard, keyboard);

/**
 * Creates a GameStateVisualizer object to translate game state updates into visual changes on the UI elements.
 */

function onKeyboardkeyPressed(keyCharacter) {
  const char = new Char(keyCharacter);
  const result = game.enterCharacter(char);
  visualizer.visualize(result);
}
/**
 * Callback function called when a key is pressed on the keyboard.
 *
 * @param {string} keyCharacter The character pressed on the keyboard.
 */